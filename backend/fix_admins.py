"""
Lists all admin accounts and keeps only admin@gmail.com.
Usage: python fix_admins.py
"""
from pymongo import MongoClient

MONGO_URL = "mongodb+srv://healthuser:healthpass123@cluster0.jrk94p8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URL)
db = client["canteen_management"]

admins = list(db["users"].find({"role": "admin"}))
print("Current admin accounts:")
for a in admins:
    print(f"  - {a['email']}")

# Keep only admin@gmail.com, delete everything else with role admin
result = db["users"].delete_many({
    "role": "admin",
    "email": {"$ne": "admin@gmail.com"}
})
print(f"\nDeleted {result.deleted_count} extra admin(s).")

remaining = list(db["users"].find({"role": "admin"}))
print("Remaining admins:")
for a in remaining:
    print(f"  - {a['email']}")
