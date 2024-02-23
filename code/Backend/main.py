from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional
from pymongo import MongoClient
from passlib.context import CryptContext
import jwt
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
# import uuid
# from keras.preprocessing import image
# import numpy as np
# from tensorflow.keras.applications.resnet import preprocess_input
# import cv2
# from huggingface_hub import from_pretrained_keras
from cachetools import cached, TTLCache

IMAGEDIR = "test-faces/"

load_dotenv()

app = FastAPI()

client = MongoClient('mongodb://localhost:27017/')
db = client['JournalApp']
collection = db['users']

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://localhost:5174', 'https://included-vastly-mite.ngrok-free.app'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

class User(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
    mobilenumber: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None

class Entry(BaseModel):
    title: str
    body: str
    session_token: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    return jwt.encode(data, os.getenv("TOKEN_KEY"))

@app.post("/signup")
async def signup(user: User):
    print(user)
    if collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    user.password = hashed_password
    collection.insert_one(user.dict())
    return {"message": "User created"}

@app.post("/login")
async def login(user: User):
    db_user = collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    access_token = create_access_token(data={"email": user.email})
    collection.update_one({"email": user.email}, {"$set": {"session_token": access_token}})
    return {"session_token": access_token, "token_type": "bearer"}

@app.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    collection.update_one({"token": token}, {"$set": {"token": ""}})
    return {"message": "Logged out"}

@app.post("/addentry")
async def add_entry(entry: Entry):
    print(entry)
    db_user = collection.find_one({"session_token": entry.session_token})
    print(db_user)
    if not db_user:
        raise HTTPException(status_code=400, detail="User not logged in")
    entries = db_user.get("entries", {})
    current_date = datetime.now(timezone.utc).isoformat(timespec='microseconds')
    entries[entry.title] = [entry.body, current_date]
    collection.update_one({"session_token": entry.session_token}, {"$set": {"entries": entries}})
    return {"message": "Entry added"}

@app.get("/getuser")
async def get_user(token: str = Depends(oauth2_scheme)):
    db_user = collection.find_one({"token": token})
    if not db_user:
        raise HTTPException(status_code=400, detail="User not logged in")
    return db_user

@app.get("/getentry")
async def get_entry(token: str = Depends(oauth2_scheme)):
    db_user = collection.find_one({"token": token})
    if not db_user:
        raise HTTPException(status_code=400, detail="User not logged in")
    return db_user["entries"]

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):

    file.filename = f"{uuid.uuid4()}.jpg"
    contents = await file.read()
    os.makedirs(IMAGEDIR, exist_ok=True)
    #save the file
    with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
        f.write(contents)
    # db.images.insert_one({"filename": file.filename, "contents": contents})
    return {"filename": file.filename}

def preprocess_image(img_path):
    img = image.load_img(img_path)
    img_array = image.img_to_array(img)
    img_resized = cv2.resize(img_array, (224, 224))
    img_array = np.expand_dims(img_resized, axis=0) 
    img_array = preprocess_input(img_array)
    return img_array

cache = TTLCache(maxsize=1, ttl=360000)

@cached(cache)
def load_model():
    return from_pretrained_keras("DShah-11/emotion_detection_v2")

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    file.filename = f"{uuid.uuid4()}.jpg"
    contents = await file.read()
    os.makedirs(IMAGEDIR, exist_ok=True)
    #save the file
    with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
        f.write(contents)
    img_array = preprocess_image(f"{IMAGEDIR}{file.filename}")
    model = load_model()
    classes = ["anger", "contempt", "disgust", "fear", "happy", "sadness", "surprise"]
    prediction = model.predict(img_array)
    print(prediction)
    prediction = np.squeeze(np.round(prediction))
    print(prediction)
    print(f'The image is a {classes[int(np.argmax(prediction))]}!')
    return {"prediction": f'The image is a {classes[int(np.argmax(prediction))]}!'}