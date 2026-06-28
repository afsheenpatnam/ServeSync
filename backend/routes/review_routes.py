from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime

from database import reviews_collection, orders_collection
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])


# =====================================
# ADD REVIEW
# =====================================
@router.post("/add")
def add_review(data: dict, current_user: dict = Depends(get_current_user)):
    order_id = data.get("order_id")
    item_id  = data.get("item_id")
    rating   = data.get("rating")
    comment  = data.get("comment", "").strip()

    if not order_id or not item_id or not rating:
        raise HTTPException(status_code=400, detail="order_id, item_id and rating are required")

    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be 1–5")

    # prevent duplicate review for same order+item
    existing = reviews_collection.find_one({
        "order_id": order_id,
        "item_id":  item_id,
        "user_email": current_user["email"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already reviewed this item for this order")

    reviews_collection.insert_one({
        "order_id":   order_id,
        "item_id":    item_id,
        "user_email": current_user["email"],
        "user_name":  current_user.get("name", ""),
        "rating":     rating,
        "comment":    comment,
        "created_at": datetime.utcnow(),
    })
    return {"message": "Review added successfully"}


# =====================================
# GET REVIEWS FOR AN ITEM
# =====================================
@router.get("/item/{item_id}")
def get_item_reviews(item_id: str):
    reviews = list(reviews_collection.find({"item_id": item_id}).sort("created_at", -1))
    for r in reviews:
        r["_id"] = str(r["_id"])
    total  = len(reviews)
    avg    = round(sum(r["rating"] for r in reviews) / total, 1) if total else 0
    return {"reviews": reviews, "total": total, "average_rating": avg}


# =====================================
# GET MY REVIEWS
# =====================================
@router.get("/my")
def my_reviews(current_user: dict = Depends(get_current_user)):
    reviews = list(reviews_collection.find({"user_email": current_user["email"]}).sort("created_at", -1))
    for r in reviews:
        r["_id"] = str(r["_id"])
    return reviews
