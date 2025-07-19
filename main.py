import os
import tempfile
from typing import Optional
from PIL import Image as PILImage
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import base64
import io
import google.generativeai as genai

# Set your API Key (Replace with your actual key)
GOOGLE_API_KEY = "AIzaSyCr35hxFrpVsbNWgqOwU6PwmkpwLmO2dJA"
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Configure Google AI
genai.configure(api_key=GOOGLE_API_KEY)

# Ensure API Key is provided
if not GOOGLE_API_KEY:
    raise ValueError("⚠️ Please set your Google API Key in GOOGLE_API_KEY")

# Initialize FastAPI app
app = FastAPI(title="Medical Image Analysis API", version="1.0.0")

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

### 1. Image Type & Region
- Identify imaging modality (X-ray/MRI/CT/Ultrasound/etc.).
- Specify anatomical region and positioning.
- Evaluate image quality and technical adequacy.

### 2. Key Findings
- Highlight primary observations systematically.
- Identify potential abnormalities with detailed descriptions.
- Include measurements and densities where relevant.

### 3. Diagnostic Assessment
- Provide primary diagnosis with confidence level.
- List differential diagnoses ranked by likelihood.
- Support each diagnosis with observed evidence.
- Highlight critical/urgent findings.

### 4. Patient-Friendly Explanation
- Simplify findings in clear, non-technical language.
- Avoid medical jargon or provide easy definitions.
- Include relatable visual analogies.

### 5. Recommendations
- Suggest next steps or follow-up actions.
- Recommend additional tests if needed.
- Provide general health advice related to findings.

Ensure a structured and medically accurate response using clear markdown formatting.
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

@app.get("/")
async def root():
    return {"message": "Medical Image Analysis API", "version": "1.0.0"}

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