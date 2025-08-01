# Railway Deployment Guide for Medico Backend

## Prerequisites
1. Create account at [Railway.app](https://railway.app)
2. Install Railway CLI: `npm install -g @railway/cli`

## Step 1: Prepare Your Backend for Deployment

### 1.1 Create Railway Configuration
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.2 Update requirements.txt (if needed)
Make sure all dependencies are listed with compatible versions:
```
Flask==2.3.3
Flask-CORS==4.0.0
numpy==1.24.3
pandas==2.0.3
scikit-learn==1.3.0
joblib==1.3.2
gunicorn==21.2.0
```

### 1.3 Create Procfile
```
web: gunicorn app:app
```

## Step 2: Deploy to Railway

### Command Line Deployment:
```bash
# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### GitHub Integration (Recommended):
1. Push code to GitHub repository
2. Connect Railway to your GitHub repo
3. Auto-deploy on commits

## Step 3: Configure Environment Variables
In Railway dashboard, add these variables:
- `PORT`: 8000 (or leave empty for Railway to set)
- `FLASK_ENV`: production
- Any API keys or secrets your app needs

## Step 4: Update Frontend Configuration
Update your Vercel frontend to use the Railway backend URL:
- Railway will provide a URL like: `https://your-app-name.railway.app`
- Update API calls in your React app to use this URL

## Benefits of Railway:
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy scaling
- ✅ Git-based deployments
- ✅ Great for ML models
- ✅ PostgreSQL database add-on available
