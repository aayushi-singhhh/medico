# Complete Backend Deployment Guide

## 🚀 Quick Deployment Steps

### Method 1: Railway (Recommended)

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Deploy to Railway
```bash
# Login to Railway
railway login

# Initialize and deploy
railway init
railway up
```

#### Step 3: Set Environment Variables
In Railway dashboard, add:
- `FRONTEND_URL`: Your Vercel app URL (e.g., https://medico-app.vercel.app)

### Method 2: Render

#### Step 1: Go to Render Dashboard
1. Visit [render.com](https://render.com)
2. Connect your GitHub account
3. Click "New" → "Web Service"

#### Step 2: Configure Deployment
- **Repository**: Select your medico repository
- **Name**: medico-backend
- **Environment**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

#### Step 3: Set Environment Variables
- `FRONTEND_URL`: Your Vercel app URL

## 🔧 Update Frontend Configuration

### Update API URLs in React App

#### Option 1: Environment Variables (Recommended)
Create `.env.production` in your React app:
```
VITE_API_URL=https://your-backend-url.railway.app
```

#### Option 2: Direct Configuration
Update your API calls to use the backend URL:
```javascript
const API_BASE_URL = 'https://your-backend-url.railway.app';

// Example API call
const response = await fetch(`${API_BASE_URL}/predict/diabetes`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

## 📱 Update Firebase Configuration for Production

### Add Production Domain to Firebase
1. Go to Firebase Console
2. Navigate to Authentication → Settings
3. Add your production domain to "Authorized domains":
   - Your Vercel domain (e.g., `medico-app.vercel.app`)

### Update Google OAuth Settings
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add your production domains to:
   - **Authorized JavaScript origins**
   - **Authorized redirect URIs**

## 🔍 Testing Your Deployment

### Backend Testing
```bash
curl https://your-backend-url.railway.app/predict/diabetes \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"Pregnancies": 1, "Glucose": 85, "BloodPressure": 66, "SkinThickness": 29, "Insulin": 0, "BMI": 26.6, "DiabetesPedigreeFunction": 0.351, "Age": 31}'
```

### Frontend Testing
1. Visit your Vercel app
2. Test Google OAuth functionality
3. Test ML prediction features
4. Check browser console for any errors

## 🛠 Troubleshooting

### Common Issues:

#### CORS Errors
- Update `FRONTEND_URL` environment variable
- Check allowed origins in Flask app

#### Model Loading Errors
- Ensure all `.pkl` files are included in deployment
- Check file paths in app.py

#### Authentication Issues
- Verify Firebase domains are updated
- Check Google OAuth settings

## 📋 Deployment Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Environment variables configured
- [ ] Frontend updated with backend URL
- [ ] Firebase domains updated for production
- [ ] Google OAuth configured for production
- [ ] CORS properly configured
- [ ] ML models loading correctly
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] End-to-end testing completed

## 🎯 Next Steps After Deployment

1. **Monitor Performance**: Set up logging and monitoring
2. **Add Rate Limiting**: Protect your API endpoints
3. **Database Setup**: Consider adding PostgreSQL for user data
4. **CDN Setup**: Optimize static file delivery
5. **SSL Certificate**: Ensure HTTPS is properly configured
6. **Backup Strategy**: Set up automated backups for models/data
