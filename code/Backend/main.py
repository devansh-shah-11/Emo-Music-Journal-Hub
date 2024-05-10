from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form, Response, Request, WebSocket
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import base64
from typing import Optional
from pymongo import MongoClient
from passlib.context import CryptContext
import jwt
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import uuid
from keras.preprocessing import image
import numpy as np
from tensorflow.keras.applications.resnet import preprocess_input
from tensorflow.keras.preprocessing.sequence import pad_sequences
import cv2
import re
from huggingface_hub import from_pretrained_keras
from cachetools import cached, TTLCache
import json
import keras
from bson.binary import Binary
import pickle
import nltk
from nltk.corpus import wordnet,stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

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
    
class Logout(BaseModel):
    session_token: str
    
class TextPrediction(BaseModel):
    text: str

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
async def logout(logout_data: Logout):
    print("IN LOGOUT\n\n\n")
    collection.update_one({"session_token": logout_data.session_token}, {"$set": {"session_token": ""}})
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
async def get_user(session_token: str):
    db_user = collection.find_one({"session_token": session_token})
    print(db_user)
    if not db_user:
        raise HTTPException(status_code=400, detail="User not logged in")
    db_user.pop('_id', None)
    return db_user

@app.get("/getentry")
async def get_entry(session_token: str):
    db_user = collection.find_one({"session_token": session_token})
    print(db_user)
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
def load_model(model_name):
    return from_pretrained_keras(model_name)

@app.post("/predict")
async def predict(file: UploadFile = File(...), session_token: str = Form(...)):
    file.filename = f"{uuid.uuid4()}.jpg"
    contents = await file.read()
    os.makedirs(IMAGEDIR, exist_ok=True)
    #save the file
    with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
        f.write(contents)
    img_array = preprocess_image(f"{IMAGEDIR}{file.filename}")
    model = load_model(model_name="DShah-11/emotion_detection_v2")
    classes = ["anger", "contempt", "disgust", "fear", "happy", "sadness", "surprise"]
    prediction = model.predict(img_array)
    print(prediction)
    prediction = np.squeeze(np.round(prediction))
    print(prediction)
    emotion = classes[int(np.argmax(prediction))]
    print(f'The image is a {emotion}!')
    
    face_entry = {
        "timestamp": datetime.now(),
        "filename": file.filename,
        "predicted_emotion": emotion
    }
    # collection.update_one({"session_token": session_token}, {"$push": {"face_entry": face_entry}})
    
    return {"prediction": emotion}

def get_wordnet_pos(tag):
    """Mapping the word to the correct POS tag for lemmatization."""
    if tag.startswith('J'):
        return wordnet.ADJ
    elif tag.startswith('V'):
        return wordnet.VERB
    elif tag.startswith('N'):
        return wordnet.NOUN
    elif tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN 

def lemmatize_sentence(sentence):
    """Lemmatizing the sentence and removing the stop words."""
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))

    tokens = word_tokenize(sentence)
    pos_tags = nltk.pos_tag(tokens)
    
    lemmatized_words = [lemmatizer.lemmatize(word, pos=get_wordnet_pos(tag)) for word, tag in pos_tags]
    lemmatized_words_no_stopwords = [word for word in lemmatized_words if word.lower() not in stop_words]
    
    return ' '.join(lemmatized_words_no_stopwords)

def predict_emotion(tokenizer, model, sent):
    sent = re.sub('[^a-zA-Z]', ' ', sent)
    sent = sent.lower()
    result = lemmatize_sentence(sent)
    print(result)
    sequence = tokenizer.texts_to_sequences([result])
    print(sequence)
    embedding = pad_sequences(sequence, maxlen=40, padding='pre')
    prediction = model.predict(embedding)
    predicted_class = prediction.argmax()
    return predicted_class

@cached(cache)
def load_tokenizer():
    with open('../ML/tokenizer.json','r',encoding='utf-8') as f:
        json_str = json.loads(f.read())
    return keras.preprocessing.text.tokenizer_from_json(json_str)

@app.post("/predicttext")
async def predict_text(text: str = Form(...), session_token: str = Form(...)):
    input_text = json.loads(text)
    text = input_text['text']
    print("Text written: ",text)
    tokenizer = load_tokenizer()
    print("\n\nTokenizer loaded\n\n")
    model = load_model(model_name="DShah-11/sentiment_analysis_v1")
    print("\n\nModel loaded\n\n")
    classes = ['Sadness', 'Anger', 'Love', 'Surprise', 'Fear', 'Happy']
    index = predict_emotion(tokenizer, model, text)
    emotion = classes[index]
    print(f"Predicted class is {emotion}")
    text_entry = {
        "timestamp": datetime.now(),
        "text": text,
        "predicted_emotion": emotion
    }
    collection.update_one({"session_token": session_token}, {"$push": {"text_entry": text_entry}})

    
    return {"prediction": f"{emotion}"}


@app.get("/get_text_entries")
async def get_text_entries(session_token: str):
    db_user = collection.find_one({"session_token": session_token})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found or not logged in")

    text_entry = db_user.get("text_entry", [])
    return {"entries": text_entry}


@app.get("/get_image/{filename}")
async def get_image(filename: str):
    image_directory = "test-faces"
    image_path = os.path.join(image_directory, filename)

    if not os.path.isfile(image_path):
        raise HTTPException(status_code=404, detail="Image not found")

    with open(image_path, "rb") as image_file:
        image_data = image_file.read()

    return Response(content=image_data, media_type="image/jpeg")

# @app.get("/get_user_images")
# async def get_user_images(request: Request, session_token: str):
#     db_user = collection.find_one({"session_token": session_token})
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found or not logged in")

#     face_entry = db_user.get("face_entry", [])
#     image_urls = [f"{request.url_for('get_image', filename=entry['filename'])}" for entry in face_entry]
#     return {"image_urls": image_urls}


@app.get("/get_user_images")
async def get_user_images(session_token: str):
    db_user = collection.find_one({"session_token": session_token})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found or not logged in")

    face_entry = db_user.get("face_entry", [])
    image_directory = "test-faces"
    images_base64 = []

    for entry in face_entry:
        image_path = os.path.join(image_directory, entry['filename'])
        if os.path.isfile(image_path):
            with open(image_path, "rb") as image_file:
                image_data = image_file.read()
                base64_encoded_data = base64.b64encode(image_data)
                base64_message = base64_encoded_data.decode('utf-8')
                images_base64.append({
                    "filename": entry['filename'],
                    "data": base64_message,
                    "emotion": entry['predicted_emotion']
                })

    return {"images": images_base64}

@app.websocket("/ws/{feedback_type}")
async def websocket_endpoint(websocket: WebSocket, feedback_type: str):
    await websocket.accept()
    try:
        session_token = await websocket.receive_text()

        db_user = collection.find_one({"session_token": session_token})
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found or not logged in")

        if feedback_type == "image":
            face_entry = db_user.get("face_entry", [])
            image_directory = "test-faces"
            filenames = [entry["filename"] for entry in db_user.get("image_feedback", [])] # Already feedback given
            face_entry = [entry for entry in face_entry if entry["filename"] not in filenames]
            for entry in face_entry:
                image_path = os.path.join(image_directory, entry['filename'])
                if os.path.isfile(image_path):
                    with open(image_path, "rb") as image_file:
                        image_data = image_file.read()
                        base64_encoded_data = base64.b64encode(image_data)
                        base64_message = base64_encoded_data.decode('utf-8')
                        await websocket.send_json({
                            "filename": entry['filename'],
                            "data": base64_message,
                            "emotion": entry['predicted_emotion']
                        })
        elif feedback_type == "text":
            text_entry = db_user.get("text_entry", [])
            filenames = [entry["filename"] for entry in db_user.get("text_feedback", [])] # Already feedback given
            text_entry = [entry for entry in text_entry if entry["filename"] not in filenames]
            for entry in text_entry:
                await websocket.send_json({
                    "text": entry['text'],
                    "emotion": entry['predicted_emotion']
                })

    except HTTPException as e:
        # Send error message to client before closing
        await websocket.send_text(str(e.detail))
        await websocket.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await websocket.close()
        
@app.post("/image_feedback")
async def image_feedback(file: str = Form(...), emotion: str = Form(...), session_token: str = Form(...)):
    
    feedback_entry = {
        "filename": file,
        "corrected_emotion": emotion
    }
    collection.update_one({"session_token": session_token}, {"$push": {"image_feedback": feedback_entry}})
    
    return {"message": "Feedback added"}

@app.post("/text_feedback")
async def text_feedback(text:str = Form(), emotion: str = Form(...), session_token: str = Form(...)):
    
    feedback_entry = {
        "text": text,
        "corrected_emotion": emotion
    }
    collection.update_one({"session_token": session_token}, {"$push": {"text_feedback": feedback_entry}})
    
    return {"message": "Feedback added"}