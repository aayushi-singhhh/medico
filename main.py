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
import google.generativeai as genai
from dotenv import load_dotenv
from ultralytics import YOLO
import cv2
import numpy as np
import json
import re

# Set your API Key (Replace with your actual key)
load_dotenv()
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY") 

# Configure Google AI
genai.configure(api_key=GOOGLE_API_KEY)
detection_model = YOLO("yolov8n.pt")  

# Ensure API Key is provided
if not GOOGLE_API_KEY:
    raise ValueError("⚠️ Please set your Google API Key in GOOGLE_API_KEY")

# Initialize FastAPI app
app = FastAPI(title="Medical Image Analysis API with Annotation", version="1.0.0")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Gemini model
model = genai.GenerativeModel('gemini-1.5-flash')

# Medical Analysis Query
MEDICAL_QUERY = """
You are a highly skilled medical imaging expert with extensive knowledge in radiology and diagnostic imaging. Analyze the medical image and structure your response as follows:

 1. Image Type & Region
- Identify imaging modality (X-ray/MRI/CT/Ultrasound/etc.).
- Specify anatomical region and positioning.
- Evaluate image quality and technical adequacy.

 2. Key Findings
- Highlight primary observations systematically.
- Identify potential abnormalities with detailed descriptions.
- Include measurements and densities where relevant.

 3. Diagnostic Assessment
- Provide primary diagnosis with confidence level.
- List differential diagnoses ranked by likelihood.
- Support each diagnosis with observed evidence.
- Highlight critical/urgent findings.

4. Patient-Friendly Explanation
- Simplify findings in clear, non-technical language.
- Avoid medical jargon or provide easy definitions.
- Include relatable visual analogies.

5. Recommendations
- Suggest next steps or follow-up actions.
- Recommend additional tests if needed.
- Provide general health advice related to findings.

Ensure a structured and medically accurate response using clear markdown formatting.
"""

# Annotation-specific query for detecting abnormal areas
ANNOTATION_QUERY = """
You are a medical imaging expert. Analyze this medical image and identify any abnormal areas that should be highlighted for medical attention.

For each abnormal area you identify, provide:
1. A brief description of the abnormality
2. The approximate location using percentage coordinates (x, y, width, height) where:
   - x, y are the center coordinates as percentages (0-100)
   - width, height are the size as percentages (0-100)
3. Severity level (Low/Medium/High)
4. Confidence level (0-100%)

Format your response as JSON:
{
  "abnormalities": [
    {
      "description": "Brief description of abnormality",
      "location": {"x": 50, "y": 30, "width": 15, "height": 10},
      "severity": "Medium",
      "confidence": 85
    }
  ]
}

Only include areas that are clearly abnormal or suspicious. If no abnormalities are found, return an empty abnormalities array.
"""

def analyze_medical_image(image_file) -> str:
    """Processes and analyzes a medical image using Google Gemini AI."""
    
    try:
        # Open and resize image
        image = PILImage.open(image_file)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image to optimize for AI processing
        width, height = image.size
        aspect_ratio = width / height
        new_width = 800
        new_height = int(new_width / aspect_ratio)
        resized_image = image.resize((new_width, new_height), PILImage.Resampling.LANCZOS)
        
        # Convert to bytes for Gemini
        img_byte_arr = io.BytesIO()
        resized_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        # Generate analysis using Gemini
        response = model.generate_content([
            MEDICAL_QUERY,
            {
                'mime_type': 'image/png',
                'data': img_byte_arr.getvalue()
            }
        ])
        
        return response.text
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

def detect_abnormalities(image_file) -> dict:
    """Detect abnormal areas in medical image and return coordinates."""
    
    try:
        # Open image
        image = PILImage.open(image_file)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image to optimize for AI processing
        width, height = image.size
        aspect_ratio = width / height
        new_width = 800
        new_height = int(new_width / aspect_ratio)
        resized_image = image.resize((new_width, new_height), PILImage.Resampling.LANCZOS)
        
        # Convert to bytes for Gemini
        img_byte_arr = io.BytesIO()
        resized_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        # Generate annotation data using Gemini
        response = model.generate_content([
            ANNOTATION_QUERY,
            {
                'mime_type': 'image/png',
                'data': img_byte_arr.getvalue()
            }
        ])
        
        # Parse JSON response
        try:
            # Extract JSON from response text
            response_text = response.text.strip()
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
            
            abnormalities_data = json.loads(response_text)
            return abnormalities_data
        except json.JSONDecodeError:
            # If JSON parsing fails, return empty result
            return {"abnormalities": []}
        
    except Exception as e:
        print(f"Error in detect_abnormalities: {str(e)}")
        return {"abnormalities": []}

def annotate_image(image_file, abnormalities_data: dict) -> PILImage.Image:
    """Annotate image with highlighted abnormal areas."""
    
    try:
        # Open original image
        image = PILImage.open(image_file)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Create a copy to annotate
        annotated_image = image.copy()
        draw = ImageDraw.Draw(annotated_image)
        
        # Color mapping for severity levels
        severity_colors = {
            "Low": "#FFFF00",      # Yellow
            "Medium": "#FFA500",   # Orange
            "High": "#FF0000"      # Red
        }
        
        # Get image dimensions
        img_width, img_height = image.size
        
        # Draw annotations for each abnormality
        for i, abnormality in enumerate(abnormalities_data.get("abnormalities", [])):
            location = abnormality.get("location", {})
            severity = abnormality.get("severity", "Medium")
            description = abnormality.get("description", "Abnormality")
            confidence = abnormality.get("confidence", 0)
            
            # Convert percentage coordinates to pixel coordinates
            center_x = int((location.get("x", 50) / 100) * img_width)
            center_y = int((location.get("y", 50) / 100) * img_height)
            width = int((location.get("width", 10) / 100) * img_width)
            height = int((location.get("height", 10) / 100) * img_height)
            
            # Calculate bounding box
            x1 = center_x - width // 2
            y1 = center_y - height // 2
            x2 = center_x + width // 2
            y2 = center_y + height // 2
            
            # Ensure coordinates are within image bounds
            x1 = max(0, min(x1, img_width))
            y1 = max(0, min(y1, img_height))
            x2 = max(0, min(x2, img_width))
            y2 = max(0, min(y2, img_height))
            
            # Get color for severity
            color = severity_colors.get(severity, "#FFA500")
            
            # Draw bounding box
            line_width = max(2, min(img_width, img_height) // 200)
            draw.rectangle([x1, y1, x2, y2], outline=color, width=line_width)
            
            # Draw semi-transparent overlay
            overlay = PILImage.new('RGBA', image.size, (0, 0, 0, 0))
            overlay_draw = ImageDraw.Draw(overlay)
            
            # Convert hex color to RGB with transparency
            hex_color = color.lstrip('#')
            rgb_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
            rgba_color = rgb_color + (50,)  # 50/255 transparency
            
            overlay_draw.rectangle([x1, y1, x2, y2], fill=rgba_color)
            annotated_image = PILImage.alpha_composite(annotated_image.convert('RGBA'), overlay).convert('RGB')
            
            # Add label
            try:
                # Try to use a default font, fall back to default if not available
                font_size = max(12, min(img_width, img_height) // 50)
                try:
                    font = ImageFont.truetype("arial.ttf", font_size)
                except:
                    font = ImageFont.load_default()
            except:
                font = ImageFont.load_default()
            
            # Create label text
            label = f"{i+1}. {severity} ({confidence}%)"
            
            # Draw label background
            bbox = draw.textbbox((0, 0), label, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            label_x = x1
            label_y = max(0, y1 - text_height - 5)
            
            draw.rectangle([label_x, label_y, label_x + text_width + 4, label_y + text_height + 4], 
                         fill=color, outline="black")
            draw.text((label_x + 2, label_y + 2), label, fill="black", font=font)
        
        return annotated_image
        
    except Exception as e:
        print(f"Error in annotate_image: {str(e)}")
        # Return original image if annotation fails
        return PILImage.open(image_file)

@app.get("/")
async def root():
    return {"message": "Medical Image Analysis API with Annotation", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze a medical image and return detailed findings.
    
    - **file**: Medical image file (jpg, jpeg, png, bmp, gif)
    """
    
    # Check file type
    if file.content_type not in ["image/jpeg", "image/jpg", "image/png", "image/bmp", "image/gif"]:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Please upload a medical image (jpg, jpeg, png, bmp, gif)"
        )
    
    # Check file size (max 10MB)
    file_size = 0
    content = await file.read()
    file_size = len(content)
    
    if file_size > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10MB."
        )
    
    try:
        # Create a BytesIO object from the file content
        image_file = io.BytesIO(content)
        
        # Analyze the image
        report = analyze_medical_image(image_file)
        
        return JSONResponse(content={
            "status": "success",
            "filename": file.filename,
            "analysis": report,
            "message": "Image analyzed successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")

@app.post("/analyze-with-annotation")
async def analyze_with_annotation(file: UploadFile = File(...)):
    """
    Analyze a medical image and return both the analysis and an annotated image with highlighted abnormal areas.
    
    - **file**: Medical image file (jpg, jpeg, png, bmp, gif)
    """
    
    # Check file type
    if file.content_type not in ["image/jpeg", "image/jpg", "image/png", "image/bmp", "image/gif"]:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Please upload a medical image (jpg, jpeg, png, bmp, gif)"
        )
    
    # Check file size (max 10MB)
    content = await file.read()
    file_size = len(content)
    
    if file_size > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10MB."
        )
    
    try:
        # Create BytesIO objects from the file content
        image_file = io.BytesIO(content)
        image_file_copy = io.BytesIO(content)
        
        # Analyze the image
        report = analyze_medical_image(image_file)
        
        # Detect abnormalities for annotation
        abnormalities_data = detect_abnormalities(image_file_copy)
        
        # Create annotated image
        image_file_annotation = io.BytesIO(content)
        annotated_image = annotate_image(image_file_annotation, abnormalities_data)
        
        # Convert annotated image to base64
        img_buffer = io.BytesIO()
        annotated_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        annotated_image_b64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
        
        return JSONResponse(content={
            "status": "success",
            "filename": file.filename,
            "analysis": report,
            "abnormalities": abnormalities_data,
            "annotated_image": f"data:image/png;base64,{annotated_image_b64}",
            "message": "Image analyzed and annotated successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")

@app.post("/get-annotated-image")
async def get_annotated_image(file: UploadFile = File(...)):
    """
    Return only the annotated image with highlighted abnormal areas.
    
    - **file**: Medical image file (jpg, jpeg, png, bmp, gif)
    """
    
    # Check file type
    if file.content_type not in ["image/jpeg", "image/jpg", "image/png", "image/bmp", "image/gif"]:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Please upload a medical image"
        )
    
    try:
        content = await file.read()
        
        # Create BytesIO objects from the file content
        image_file = io.BytesIO(content)
        
        # Detect abnormalities for annotation
        abnormalities_data = detect_abnormalities(image_file)
        
        # Create annotated image
        image_file_annotation = io.BytesIO(content)
        annotated_image = annotate_image(image_file_annotation, abnormalities_data)
        
        # Return image as streaming response
        img_buffer = io.BytesIO()
        annotated_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return StreamingResponse(
            io.BytesIO(img_buffer.getvalue()),
            media_type="image/png",
            headers={"Content-Disposition": f"inline; filename=annotated_{file.filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-image-simple")
async def analyze_image_simple(file: UploadFile = File(...)):
    """
    Simple endpoint that returns just the analysis text.
    """
    if file.content_type not in ["image/jpeg", "image/jpg", "image/png", "image/bmp", "image/gif"]:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Please upload a medical image"
        )
    
    try:
        content = await file.read()
        image_file = io.BytesIO(content)
        report = analyze_medical_image(image_file)
        return {"analysis": report}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)