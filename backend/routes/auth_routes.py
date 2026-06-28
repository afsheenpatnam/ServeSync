import random
import os
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta

from database import users_collection
from models.user_model import UserRegister
from passlib.context import CryptContext
from utils.jwt_handler import create_access_token
from utils.email_utils import send_otp_email

router = APIRouter(tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

EMAIL_VERIFICATION = os.getenv("EMAIL_VERIFICATION", "false").lower() == "true"


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def generate_otp():
    return str(random.randint(100000, 999999))


# =====================================
# SIGNUP
# =====================================
@router.post("/signup")
def signup(user: UserRegister, background_tasks: BackgroundTasks):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    if users_collection.find_one({"phone": user.phone}):
        raise HTTPException(status_code=400, detail="Phone already exists")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    user_dict["is_verified"] = not EMAIL_VERIFICATION

    if EMAIL_VERIFICATION:
        otp = generate_otp()
        user_dict["otp"] = otp
        user_dict["otp_expiry"] = datetime.utcnow() + timedelta(minutes=10)
        users_collection.insert_one(user_dict)
        background_tasks.add_task(send_otp_email, user.email, otp, user.name)
        return {"message": "OTP sent to your email", "email": user.email, "requires_otp": True}

    users_collection.insert_one(user_dict)
    return {"message": "User registered successfully", "requires_otp": False}


# =====================================
# SEND / RESEND OTP
# =====================================
@router.post("/send-otp")
def send_otp(data: dict, background_tasks: BackgroundTasks):
    email = data.get("email", "").strip().lower()
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()
    users_collection.update_one(
        {"email": email},
        {"$set": {"otp": otp, "otp_expiry": datetime.utcnow() + timedelta(minutes=10)}}
    )
    background_tasks.add_task(send_otp_email, email, otp, user.get("name", "User"))
    return {"message": "OTP sent successfully"}


# =====================================
# VERIFY OTP
# =====================================
@router.post("/verify-otp")
def verify_otp(data: dict):
    email = data.get("email", "").strip().lower()
    otp   = data.get("otp", "").strip()

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.get("is_verified"):
        return {"message": "Already verified"}

    if user.get("otp") != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > user.get("otp_expiry", datetime.utcnow()):
        raise HTTPException(status_code=400, detail="OTP has expired. Request a new one.")

    users_collection.update_one(
        {"email": email},
        {"$set": {"is_verified": True}, "$unset": {"otp": "", "otp_expiry": ""}}
    )
    return {"message": "Email verified successfully"}


# =====================================
# LOGIN
# =====================================
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({
        "$or": [{"email": form_data.username}, {"phone": form_data.username}]
    })

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Admins and delivery partners skip email verification
    is_staff = user.get("role") in ("admin", "delivery")
    if EMAIL_VERIFICATION and not is_staff and not user.get("is_verified", True):
        raise HTTPException(
            status_code=403,
            detail="Email not verified. Please check your inbox and enter the OTP.",
        )

    token = create_access_token({"sub": user["email"], "role": user["role"]})

    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "name":  user["name"],
            "email": user["email"],
            "role":  user["role"],
            "city":  user.get("city", ""),
            "area":  user.get("area", ""),
        },
    }
