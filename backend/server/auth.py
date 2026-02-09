from flask import Blueprint, request, jsonify
from server.db import parents
import uuid

auth_api = Blueprint("auth_api", __name__)

# -------- SIGNUP --------
@auth_api.route("/auth/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not (name and email and password):
        return jsonify({"error": "missing fields"}), 400

    exists = parents.find_one({"email": email})

    if exists:
        return jsonify({"error": "Email already registered"}), 400

    parent = {
        "parentId": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "password": password,
        "child": None
    }

    parents.insert_one(parent)

    return jsonify({
        "message": "registered",
        "parentId": parent["parentId"]
    })


# -------- ADD CHILD DETAILS --------
@auth_api.route("/auth/add-child", methods=["POST"])
def add_child():

    data = request.json
    print("ADD CHILD REQUEST:", data)

    parentId = data.get("parentId")
    childName = data.get("childName")
    age = data.get("age")
    gender = data.get("gender")

    if not all([parentId, childName, age, gender]):
        return jsonify({"error": "missing fields"}), 400

    # Generate readable childId
    import random
    childId = f"CHD-{age}-{random.randint(100000,999999)}"

    parents.update_one(
        {"parentId": parentId},
        {"$set": {
            "child": {
                "childId": childId,
                "name": childName,
                "age": age,
                "gender": gender
            }
        }}
    )

    return jsonify({
        "childId": childId,
        "message": "child added"
    })


# -------- LOGIN --------
@auth_api.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = parents.find_one({
        "email": email,
        "password": password
    })

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "parentId": user["parentId"],
        "name": user["name"]
    })
