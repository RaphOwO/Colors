from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import bcrypt
import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import Optional

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET", "default_secret")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect("userdata.db")
    conn.row_factory = sqlite3.Row
    return conn

with get_db() as db:
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
        )
    """)
    db.commit()

def create_token(username: str):
    payload = {
        "username": username,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(auth_header: Optional[str] = Header(None)):
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Access denied, no token provided")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")

@app.get("/")
def home():
    return {"message": "Hello from FastAPI backend!"}

@app.post("/register")
def register(data: dict):
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        raise HTTPException(status_code=400, detail="All fields are required")

    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE username = ? OR email = ?", (username, email)
    ).fetchone()

    if user:
        if user["username"] == username:
            raise HTTPException(status_code=400, detail="Username already exists")
        if user["email"] == email:
            raise HTTPException(status_code=400, detail="Email already registered")

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    try:
        db.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed)
        )
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create account")

    return {"message": "Account created successfully"}

@app.post("/login")
def login(data: dict):
    username = data.get("username")
    password = data.get("password")

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_token(user["username"])

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"]
        }
    }

@app.get("/register/users")
def get_all_users():
    db = get_db()
    users = db.execute("SELECT id, username, email FROM users").fetchall()
    return [dict(u) for u in users]

@app.get("/user")
def get_user(user=Depends(verify_token)):
    db = get_db()
    result = db.execute(
        "SELECT id, username, email FROM users WHERE username = ?", (user["username"],)
    ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return dict(result)
