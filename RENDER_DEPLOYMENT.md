# Render Deployment Guide for Medico Backend

## Prerequisites
1. Create account at [Render.com](https://render.com)
2. Connect your GitHub account

## Step 1: Prepare Your Backend

### 1.1 Update requirements.txt
Add gunicorn for production server:
```
Flask==2.3.3
Flask-CORS==4.0.0
numpy==1.24.3
pandas==2.0.3
scikit-learn==1.3.0
joblib==1.3.2
gunicorn==21.2.0
fastapi
uvicorn[standard]
python-multipart
Pillow
google-generativeai
python-dotenv
ultralytics
opencv-python
```

### 1.2 Create render.yaml (optional)
```yaml
services:
  - type: web
    name: medico-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

## Step 2: Deploy on Render

### Via Render Dashboard:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: medico-backend
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: Free (or paid for better performance)

## Step 3: Configure Environment Variables
In Render dashboard, add:
- `PYTHON_VERSION`: 3.11.0
- Any API keys your app needs

## Step 4: Update CORS Settings
Make sure your Flask app allows your Vercel domain:
```python
CORS(app, origins=['https://your-vercel-app.vercel.app'])
```

## Benefits of Render:
- ✅ Free tier with 750 hours/month
- ✅ Automatic SSL
- ✅ Git-based deployments
- ✅ Good for Python/ML apps
- ✅ PostgreSQL database add-on
