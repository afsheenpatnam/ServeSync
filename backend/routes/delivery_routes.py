import random
from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime

from database import (
    orders_collection,
    users_collection,
    delivery_tracking_collection,
    notifications_collection
)

from middleware.auth_middleware import (
    delivery_required,
    admin_required,
    get_current_user
)

router = APIRouter(prefix="/delivery", tags=["Delivery"])


def generate_delivery_otp():
    return str(random.randint(1000, 9999))


# =====================================
# TOGGLE AVAILABILITY
# =====================================
@router.put("/toggle-availability")
def toggle_availability(delivery: dict = Depends(delivery_required)):
    current = delivery.get("is_available", True)
    new_status = not current
    users_collection.update_one(
        {"email": delivery["email"]},
        {"$set": {"is_available": new_status}}
    )
    status_text = "Available" if new_status else "Busy"
    return {"is_available": new_status, "message": f"You are now {status_text}"}


# =====================================
# AVAILABLE ORDERS (district-matched)
# =====================================
@router.get("/available-orders")
def available_orders(delivery: dict = Depends(delivery_required)):
    delivery_district = (delivery.get("district") or "").strip().lower()

    query = {
        "order_status": "Ready",
        "delivery_partner_email": {"$exists": False}
    }

    orders = list(orders_collection.find(query))

    # Show orders matching delivery boy's district first
    if delivery_district:
        matched   = [o for o in orders if (o.get("customer_district") or "").strip().lower() == delivery_district]
        unmatched = [o for o in orders if not o.get("customer_district")]
        orders = matched + unmatched

    for order in orders:
        order["_id"] = str(order["_id"])

    return orders


# =====================================
# ACCEPT ORDER — generates delivery OTP
# =====================================
@router.put("/accept-order/{order_id}")
def accept_order(order_id: str, delivery: dict = Depends(delivery_required)):
    order = orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    otp = generate_delivery_otp()

    orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {
            "delivery_partner_email": delivery["email"],
            "delivery_partner_name":  delivery.get("name", ""),
            "delivery_status":        "Assigned",
            "order_status":           "Out For Delivery",
            "delivery_otp":           otp,
        }}
    )

    delivery_tracking_collection.update_one(
        {"order_id": order_id},
        {"$set": {
            "order_id":               order_id,
            "delivery_partner_email": delivery["email"],
            "delivery_partner_name":  delivery.get("name", ""),
            "current_status":         "Assigned",
            "current_lat":            None,
            "current_lng":            None,
            "customer_lat":           order.get("customer_lat"),
            "customer_lng":           order.get("customer_lng"),
            "reached_destination":    False,
            "delivered_successfully": False,
            "updated_at":             datetime.utcnow(),
        }},
        upsert=True
    )

    # Send OTP to customer via notification
    notifications_collection.insert_one({
        "user_email":        order["user_email"],
        "title":             "Delivery Partner Assigned 🛵",
        "message":           f"Your delivery OTP is {otp}. Show this to the delivery partner to confirm receipt.",
        "notification_type": "delivery",
        "is_read":           False,
        "created_at":        datetime.utcnow(),
    })

    return {"message": "Order accepted successfully", "delivery_otp": otp}


# =====================================
# VERIFY DELIVERY OTP (COD confirmation)
# =====================================
@router.post("/verify-otp/{order_id}")
def verify_delivery_otp(
    order_id: str,
    data: dict,
    delivery: dict = Depends(delivery_required)
):
    otp = data.get("otp", "").strip()
    order = orders_collection.find_one({"_id": ObjectId(order_id)})

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.get("delivery_partner_email") != delivery["email"]:
        raise HTTPException(status_code=403, detail="Not your order")

    if order.get("delivery_otp") != otp:
        raise HTTPException(status_code=400, detail="Wrong OTP. Ask the customer to check their notifications.")

    orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {
            "order_status":    "Delivered",
            "delivery_status": "Delivered",
            "delivered_at":    datetime.utcnow(),
        }}
    )

    delivery_tracking_collection.update_one(
        {"order_id": order_id},
        {"$set": {"current_status": "Delivered", "delivered_successfully": True, "updated_at": datetime.utcnow()}}
    )

    notifications_collection.insert_one({
        "user_email":        order["user_email"],
        "title":             "Order Delivered ✅",
        "message":           "Your order has been delivered successfully!",
        "notification_type": "delivery",
        "is_read":           False,
        "created_at":        datetime.utcnow(),
    })

    return {"message": "Delivery confirmed successfully"}


# =====================================
# UPDATE DELIVERY BOY GPS LOCATION
# =====================================
@router.put("/update-location/{order_id}")
def update_location(
    order_id: str,
    data: dict,
    delivery: dict = Depends(delivery_required)
):
    lat = data.get("lat")
    lng = data.get("lng")

    if lat is None or lng is None:
        raise HTTPException(status_code=400, detail="lat and lng required")

    delivery_tracking_collection.update_one(
        {"order_id": order_id},
        {"$set": {"current_lat": lat, "current_lng": lng, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    return {"message": "Location updated"}


# =====================================
# GET DELIVERY LOCATION (for customer map)
# =====================================
@router.get("/location/{order_id}")
def get_location(order_id: str, current_user: dict = Depends(get_current_user)):
    tracking = delivery_tracking_collection.find_one({"order_id": order_id})
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")

    return {
        "delivery_lat":          tracking.get("current_lat"),
        "delivery_lng":          tracking.get("current_lng"),
        "customer_lat":          tracking.get("customer_lat"),
        "customer_lng":          tracking.get("customer_lng"),
        "status":                tracking.get("current_status"),
        "delivery_partner_name": tracking.get("delivery_partner_name", ""),
        "updated_at":            str(tracking.get("updated_at", "")),
    }


# =====================================
# MY DELIVERIES
# =====================================
@router.get("/my-orders")
def my_orders(delivery: dict = Depends(delivery_required)):
    orders = list(orders_collection.find({"delivery_partner_email": delivery["email"]}))
    for order in orders:
        order["_id"] = str(order["_id"])
    return orders


# =====================================
# UPDATE DELIVERY STATUS
# =====================================
@router.put("/update-status/{order_id}")
def update_delivery_status(
    order_id: str,
    data: dict,
    delivery: dict = Depends(delivery_required)
):
    allowed = ["Picked Up", "Reached Location", "Waiting For Confirmation"]
    status  = data.get("status")

    if status not in allowed:
        raise HTTPException(status_code=400, detail="Invalid status")

    orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"delivery_status": status}}
    )
    delivery_tracking_collection.update_one(
        {"order_id": order_id},
        {"$set": {"current_status": status, "updated_at": datetime.utcnow()}}
    )

    order = orders_collection.find_one({"_id": ObjectId(order_id)})
    notifications_collection.insert_one({
        "user_email":        order["user_email"],
        "title":             "Delivery Update",
        "message":           f"Your order is now: {status}",
        "notification_type": "delivery",
        "is_read":           False,
        "created_at":        datetime.utcnow(),
    })

    return {"message": f"Status updated to {status}"}


# =====================================
# DELIVERY TRACKING DETAILS
# =====================================
@router.get("/tracking/{order_id}")
def tracking_details(order_id: str, current_user: dict = Depends(get_current_user)):
    tracking = delivery_tracking_collection.find_one({"order_id": order_id})
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    tracking["_id"] = str(tracking["_id"])
    return tracking


# =====================================
# ALL DELIVERY PARTNERS (ADMIN)
# =====================================
@router.get("/partners")
def all_delivery_partners(admin: dict = Depends(admin_required)):
    partners = list(users_collection.find({"role": "delivery"}))
    for p in partners:
        p["_id"] = str(p["_id"])
        p.pop("password", None)
    return partners
