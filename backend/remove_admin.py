"""
Run once to remove the second admin account.
Usage: python remove_admin.py
"""
from pymongo import MongoClient

MONGO_URL = "mongodb+srv://healthuser:healthpass123@cluster0.jrk94p8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URL)
db = client["canteen_management"]

result = db["users"].delete_one({"email": "admingitam@gmail.com"})
if result.deleted_count:
    print("Removed → admingitam@gmail.com")
else:
    print("Not found — already removed or never created")
