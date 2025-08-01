import os
import tempfile
from typing import Optional, List, Tuple
from PIL import Image as PILImage, ImageDraw, ImageFont
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import uvicorn
import base64
import io
import numpy as np
import cv2
from ultralytics import YOLO
import joblib

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
diabetes_model = None
diabetes_scaler = None
heart_model = None
pcos_model = None
pcos_scaler = None
yolo_model = None

# Initialize models
def load_models():
    global diabetes_model, diabetes_scaler, heart_model, pcos_model, pcos_scaler, yolo_model
    try:
        diabetes_model = joblib.load("diabetes_model.pkl")
        diabetes_scaler = joblib.load("diabetes_scaler.pkl")
        print("Diabetes model loaded successfully")
    except Exception as e:
        print(f"Error loading diabetes model: {e}")
    
    try:
        heart_model = joblib.load("heart_model.pkl")
        print("Heart model loaded successfully")
    except Exception as e:
        print(f"Error loading heart model: {e}")
    
    try:
        pcos_model = joblib.load("pcos_model.pkl")
        pcos_scaler = joblib.load("pcos_scaler.pkl")
        print("PCOS model loaded successfully")
    except Exception as e:
        print(f"Error loading PCOS model: {e}")
    
    try:
        yolo_model = YOLO("yolov8n.pt")
        print("YOLO model loaded successfully")
    except Exception as e:
        print(f"Error loading YOLO model: {e}")

# Load models on startup
load_models()

@app.get("/")
def read_root():
    return {"message": "Medical AI API is running"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models": {
            "diabetes": diabetes_model is not None,
            "heart": heart_model is not None,
            "pcos": pcos_model is not None,
            "yolo": yolo_model is not None
        }
    }

@app.post("/predict/diabetes")
async def predict_diabetes(data: dict):
    if diabetes_model is None or diabetes_scaler is None:
        raise HTTPException(status_code=500, detail="Diabetes model not loaded")
    
    try:
        # Extract features in the correct order
        features = [
            data.get("Pregnancies", 0),
            data.get("Glucose", 0),
            data.get("BloodPressure", 0),
            data.get("SkinThickness", 0),
            data.get("Insulin", 0),
            data.get("BMI", 0),
            data.get("DiabetesPedigreeFunction", 0),
            data.get("Age", 0)
        ]
        
        # Scale features
        features_scaled = diabetes_scaler.transform([features])
        
        # Make prediction
        prediction = diabetes_model.predict(features_scaled)[0]
        probability = diabetes_model.predict_proba(features_scaled)[0]
        
        return {
            "prediction": int(prediction),
            "probability": {
                "no_diabetes": float(probability[0]),
                "diabetes": float(probability[1])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/heart")
async def predict_heart(data: dict):
    if heart_model is None:
        raise HTTPException(status_code=500, detail="Heart model not loaded")
    
    try:
        # Extract features in the correct order
        features = [
            data.get("Age", 0),
            data.get("Sex", 0),
            data.get("ChestPainType", 0),
            data.get("RestingBP", 0),
            data.get("Cholesterol", 0),
            data.get("FastingBS", 0),
            data.get("RestingECG", 0),
            data.get("MaxHR", 0),
            data.get("ExerciseAngina", 0),
            data.get("Oldpeak", 0),
            data.get("ST_Slope", 0),
            data.get("Ca", 0),
            data.get("Thal", 0)
        ]
        
        # Make prediction
        prediction = heart_model.predict([features])[0]
        probability = heart_model.predict_proba([features])[0]
        
        return {
            "prediction": int(prediction),
            "probability": {
                "no_disease": float(probability[0]),
                "disease": float(probability[1])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/pcos")
async def predict_pcos(data: dict):
    if pcos_model is None or pcos_scaler is None:
        raise HTTPException(status_code=500, detail="PCOS model not loaded")
    
    try:
        # Extract features in the correct order
        features = [
            data.get("Age", 0),
            data.get("BMI", 0),
            data.get("Menstrual_Irregularity", 0),
            data.get("Testosterone_Level_ng_dL", 0),
            data.get("Antral_Follicle_Count", 0)
        ]
        
        # Scale features
        features_scaled = pcos_scaler.transform([features])
        
        # Make prediction
        prediction = pcos_model.predict(features_scaled)[0]
        probability = pcos_model.predict_proba(features_scaled)[0]
        
        return {
            "prediction": int(prediction),
            "probability": {
                "no_pcos": float(probability[0]),
                "pcos": float(probability[1])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/analyze-medical-image")
async def analyze_medical_image(file: UploadFile = File(...)):
    if yolo_model is None:
        raise HTTPException(status_code=500, detail="YOLO model not loaded")
    
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Run YOLO detection
        results = yolo_model(image)
        
        # Process results
        detections = []
        annotated_image = image.copy()
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Get box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = box.conf[0].cpu().numpy()
                    class_id = int(box.cls[0].cpu().numpy())
                    class_name = yolo_model.names[class_id]
                    
                    detections.append({
                        "class": class_name,
                        "confidence": float(confidence),
                        "bbox": [float(x1), float(y1), float(x2), float(y2)]
                    })
                    
                    # Draw bounding box
                    cv2.rectangle(annotated_image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                    cv2.putText(annotated_image, f"{class_name}: {confidence:.2f}", 
                              (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Convert annotated image to base64
        _, buffer = cv2.imencode('.jpg', annotated_image)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "detections": detections,
            "annotated_image": f"data:image/jpeg;base64,{img_base64}",
            "detection_count": len(detections)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
