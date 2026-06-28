from fastapi import APIRouter, Depends
from datetime import datetime

from database import canteen_settings_collection
from middleware.auth_middleware import admin_required

router = APIRouter(prefix="/canteen", tags=["Canteen"])


def _get_settings():
    s = canteen_settings_collection.find_one({})
    if not s:
        # default: open
        canteen_settings_collection.insert_one({
            "is_open": True,
            "open_time":  "08:00",
            "close_time": "21:00",
            "message": "",
            "updated_at": datetime.utcnow(),
        })
        s = canteen_settings_collection.find_one({})
    s["_id"] = str(s["_id"])
    return s


# =====================================
# GET STATUS (public)
# =====================================
@router.get("/status")
def get_status():
    return _get_settings()


# =====================================
# TOGGLE OPEN / CLOSED (admin)
# =====================================
@router.put("/toggle")
def toggle_canteen(admin: dict = Depends(admin_required)):
    current = _get_settings()
    new_state = not current["is_open"]
    canteen_settings_collection.update_one(
        {},
        {"$set": {"is_open": new_state, "updated_at": datetime.utcnow()}}
    )
    return {"is_open": new_state, "message": f"Canteen is now {'Open' if new_state else 'Closed'}"}


# =====================================
# UPDATE HOURS & MESSAGE (admin)
# =====================================
@router.put("/settings")
def update_settings(data: dict, admin: dict = Depends(admin_required)):
    update = {"updated_at": datetime.utcnow()}
    if "open_time"  in data: update["open_time"]  = data["open_time"]
    if "close_time" in data: update["close_time"] = data["close_time"]
    if "message"    in data: update["message"]    = data["message"]
    if "is_open"    in data: update["is_open"]    = data["is_open"]

    canteen_settings_collection.update_one({}, {"$set": update}, upsert=True)
    return {"message": "Settings updated"}
