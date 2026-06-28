from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime
import random

from utils.email_utils import send_order_receipt_email
from database import (
    orders_collection,
    cart_collection,
    users_collection,
    notifications_collection
)

from middleware.auth_middleware import (
    get_current_user,
    admin_required
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# =====================================
# PLACE ORDER
# =====================================
@router.post("/place/{email}")
def place_order(
    email: str,
    payment_method: str,
    scheduled_time: str = None,
    data: dict = None,
    current_user: dict = Depends(get_current_user)
):

    if current_user["email"] != email:

        raise HTTPException(
            status_code=403,
            detail="Unauthorized access"
        )

    cart_items = list(cart_collection.find({
        "user_email": email
    }))

    if not cart_items:

        raise HTTPException(
            status_code=400,
            detail="Items cannot be empty"
        )

    total_amount = 0
    items = []

    for item in cart_items:

        subtotal = item["price"] * item["quantity"]

        total_amount += subtotal

        items.append({

            "item_id": item["item_id"],

            "name": item["name"],

            "price": item["price"],

            "quantity": item["quantity"],

            "image_path": item["image_path"],

            "subtotal": subtotal
        })

    pickup_token     = str(random.randint(1000, 9999))
    customer_district = (data or {}).get("district", "").strip()

    # ── Serviceability check ──────────────────────────────────────
    if customer_district:
        available_boys = list(users_collection.find({
            "role":         "delivery",
            "is_available": True,
            "district":     {"$regex": f"^{customer_district}$", "$options": "i"},
        }))

        if not available_boys:
            # Notify admin about unserviceable area
            notifications_collection.insert_one({
                "user_email":        "admin@gmail.com",
                "title":             f"Unserviceable Area: {customer_district}",
                "message":           f"Customer {email} tried to order but no delivery partner is available in {customer_district}.",
                "notification_type": "help_center",
                "is_read":           False,
                "created_at":        datetime.utcnow(),
            })
            raise HTTPException(
                status_code=503,
                detail=f"NOT_SERVICEABLE:{customer_district}"
            )
    # ─────────────────────────────────────────────────────────────

    order_data = {
        "user_email":       email,
        "items":            items,
        "total_amount":     total_amount,
        "payment_method":   payment_method,
        "payment_status":   "Pending",
        "order_status":     "Pending",
        "pickup_token":     pickup_token,
        "estimated_time":   "15 mins",
        "scheduled_time":   scheduled_time,
        "customer_district": customer_district,
        "delivery_area":    (data or {}).get("area", ""),
        "delivery_address": (data or {}).get("address", {}),
        "customer_lat":     (data or {}).get("lat"),
        "customer_lng":     (data or {}).get("lng"),
        "created_at":       datetime.utcnow(),
        "delivered_at":     None,
    }

    result = orders_collection.insert_one(order_data)
    order_id = str(result.inserted_id)

    # ── Notify admin about new order ──────────────────────────────
    notifications_collection.insert_one({
        "user_email":        "admin@gmail.com",
        "title":             "New Order Received!",
        "message":           f"Order #{order_id[-6:].upper()} placed by {email} · ₹{total_amount}",
        "notification_type": "order",
        "is_read":           False,
        "created_at":        datetime.utcnow(),
    })

    # ── Auto-assign a random available delivery boy ───────────────
    if customer_district and available_boys:
        chosen = random.choice(available_boys)
        notifications_collection.insert_one({
            "user_email":        chosen["email"],
            "title":             "New Order Incoming!",
            "message":           f"A new order has been placed in {customer_district}. Check your dashboard.",
            "notification_type": "delivery",
            "is_read":           False,
            "created_at":        datetime.utcnow(),
        })

    cart_collection.delete_many({"user_email": email})

    # ── Send order receipt email ──────────────────────────────────
    user_doc = users_collection.find_one({"email": email})
    customer_name = user_doc.get("name", "Customer") if user_doc else "Customer"
    try:
        send_order_receipt_email(email, customer_name, order_id, items, total_amount, payment_method)
    except Exception:
        pass

    return {
        "message":        "Order placed successfully",
        "order_id":       order_id,
        "pickup_token":   pickup_token,
        "estimated_time": "15 mins",
    }


# =====================================
# GET USER ORDERS
# =====================================
@router.get("/user/{email}")
def get_user_orders(
    email: str,
    current_user: dict = Depends(get_current_user)
):

    if current_user["email"] != email:

        raise HTTPException(
            status_code=403,
            detail="Unauthorized access"
        )

    orders = list(orders_collection.find({
        "user_email": email
    }))

    for order in orders:

        order["_id"] = str(order["_id"])

    return orders


# =====================================
# GET ALL ORDERS (ADMIN)
# =====================================
@router.get("/all")
def get_all_orders(
    admin: dict = Depends(admin_required)
):

    orders = list(orders_collection.find())

    for order in orders:

        order["_id"] = str(order["_id"])

    return orders


# =====================================
# UPDATE ORDER STATUS
# =====================================
@router.put("/status/{order_id}")
def update_order_status(
    order_id: str,
    data: dict,
    admin: dict = Depends(admin_required)
):

    allowed_status = [

        "Pending",

        "Preparing",

        "Ready",

        "Delivered",

        "Cancelled"
    ]

    status = data.get("status")

    if status not in allowed_status:

        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    update_data = {

        "order_status": status
    }

    if status == "Delivered":

        update_data["delivered_at"] = datetime.utcnow()

    result = orders_collection.update_one(

        {"_id": ObjectId(order_id)},

        {
            "$set": update_data
        }
    )

    if result.modified_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return {

        "message": f"Order updated to {status}"
    }


# =====================================
# UPDATE PAYMENT STATUS
# =====================================
@router.put("/payment/{order_id}")
def update_payment_status(
    order_id: str,
    data: dict,
    admin: dict = Depends(admin_required)
):

    allowed_payment = [
        "Pending",
        "Paid",
        "Failed"
    ]

    payment_status = data.get("payment_status")

    if payment_status not in allowed_payment:

        raise HTTPException(
            status_code=400,
            detail="Invalid payment status"
        )

    result = orders_collection.update_one(

        {"_id": ObjectId(order_id)},

        {
            "$set": {
                "payment_status": payment_status
            }
        }
    )

    if result.modified_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return {

        "message": f"Payment updated to {payment_status}"
    }


# =====================================
# GET SINGLE ORDER BY ID
# =====================================
@router.get("/{order_id}")
def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):
    order = orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order["_id"] = str(order["_id"])
    return order