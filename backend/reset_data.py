"""
Run once to wipe all data and keep only the admin account.
Usage: python reset_data.py
"""
from pymongo import MongoClient

MONGO_URL = "mongodb+srv://healthuser:healthpass123@cluster0.jrk94p8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URL)
db = client["canteen_management"]

# Keep only admin users
admin = list(db["users"].find({"role": "admin"}))
db["users"].delete_many({"role": {"$ne": "admin"}})
print(f"Users: kept {len(admin)} admin(s), deleted all others")

# Wipe everything else
collections = [
    "cart", "orders", "payments", "delivery", "delivery_tracking",
    "notifications", "offers", "combos", "inventory_logs",
    "reviews", "canteen_settings"
]

for col in collections:
    result = db[col].delete_many({})
    print(f"{col}: deleted {result.deleted_count} documents")

print("\nDone! Database is fresh. Admin account kept.")
