from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId

from database import help_center_collection, notifications_collection
from middleware.auth_middleware import admin_required, get_current_user

router = APIRouter(prefix="/help-center", tags=["Help Center"])


# =====================================
# SUBMIT QUERY (any user, no auth)
# =====================================
@router.post("/submit")
def submit_query(data: dict):
    name     = data.get("name", "").strip()
    email    = data.get("email", "").strip()
    district = data.get("district", "").strip()
    message  = data.get("message", "").strip()

    if not name or not email or not district or not message:
        raise HTTPException(status_code=400, detail="All fields are required")

    query = {
        "name":       name,
        "email":      email,
        "district":   district,
        "message":    message,
        "status":     "open",
        "reply":      None,
        "created_at": datetime.utcnow(),
        "replied_at": None,
    }
    result = help_center_collection.insert_one(query)

    # Notify admin
    notifications_collection.insert_one({
        "user_email":        "admin@gmail.com",
        "title":             f"Help Center: New query from {district}",
        "message":           f"{name} ({email}) — {message[:80]}",
        "notification_type": "help_center",
        "is_read":           False,
        "created_at":        datetime.utcnow(),
    })

    return {"message": "Query submitted successfully", "id": str(result.inserted_id)}


# =====================================
# GET ALL QUERIES (admin only)
# =====================================
@router.get("/all")
def get_all_queries(admin: dict = Depends(admin_required)):
    queries = list(help_center_collection.find().sort("created_at", -1))
    for q in queries:
        q["_id"] = str(q["_id"])
    return queries


# =====================================
# REPLY TO QUERY (admin only)
# =====================================
@router.put("/reply/{query_id}")
def reply_query(query_id: str, data: dict, admin: dict = Depends(admin_required)):
    reply = data.get("reply", "").strip()
    if not reply:
        raise HTTPException(status_code=400, detail="Reply cannot be empty")

    result = help_center_collection.update_one(
        {"_id": ObjectId(query_id)},
        {"$set": {"reply": reply, "status": "resolved", "replied_at": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Query not found")

    # Get the query to notify the customer
    query = help_center_collection.find_one({"_id": ObjectId(query_id)})
    if query:
        notifications_collection.insert_one({
            "user_email":        query["email"],
            "title":             "Help Center Reply",
            "message":           f"Admin replied to your query: {reply[:80]}",
            "notification_type": "help_center",
            "is_read":           False,
            "created_at":        datetime.utcnow(),
        })

    return {"message": "Reply sent successfully"}


# =====================================
# GET UNREAD COUNT (admin)
# =====================================
@router.get("/unread-count")
def unread_count(admin: dict = Depends(admin_required)):
    count = help_center_collection.count_documents({"status": "open"})
    return {"count": count}
