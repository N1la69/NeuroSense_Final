from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["neurosense"]

sessions = db["sessions"]
users = db["users"]
parents = db["parents"]

