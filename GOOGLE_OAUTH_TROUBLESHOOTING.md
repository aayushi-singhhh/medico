# Google OAuth Troubleshooting Guide

## Error: "OAuth operation not allowed"

This error occurs when your domain is not authorized in Firebase Console. Follow these steps to fix it:

### Step 1: Firebase Console - Authorized Domains
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **medico-65975**
3. Navigate to **Authentication > Settings**
4. Scroll to **"Authorized domains"** section
5. Add these domains if missing:
   - `localhost`
   - `127.0.0.1`
   - Your Vercel domain (e.g., `medico-app.vercel.app`)
   - Any custom domains you're using

### Step 2: Firebase Console - Google Sign-In
1. Go to **Authentication > Sign-in method**
2. Click on **Google** provider
3. Ensure it's **enabled** (toggle should be ON)
4. Verify **Support email** is set
5. Save changes

### Step 3: Google Cloud Console - OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: **medico-65975**
3. Navigate to **APIs & Services > OAuth consent screen**
4. In **Authorized domains**, add:
   - `localhost`
   - `127.0.0.1`
   - Your Vercel domain (without https://, e.g., `medico-app.vercel.app`)
5. Save and continue

### Step 4: Google Cloud Console - Credentials
1. In Google Cloud Console, go to **APIs & Services > Credentials**
2. Find your OAuth 2.0 Client ID
3. Click to edit it
4. In **Authorized JavaScript origins**, add:
   - `http://localhost:8080`
   - `http://localhost:8081`
   - `http://localhost:8082`
   - `http://127.0.0.1:8080`
   - `http://127.0.0.1:8081`
   - `http://127.0.0.1:8082`
5. In **Authorized redirect URIs**, add:
   - `http://localhost:8080/__/auth/handler`
   - `http://localhost:8081/__/auth/handler`
   - `http://localhost:8082/__/auth/handler`

### Step 5: Clear Browser Cache
1. Open browser developer tools (F12)
2. Right-click refresh button
3. Select **"Empty Cache and Hard Reload"**
4. Or use incognito/private browsing mode

### Step 6: Verify Configuration
After making changes:
1. Wait 5-10 minutes for changes to propagate
2. Clear browser cache
3. Try Google OAuth again
4. Check browser console for detailed error messages

## Common Issues

### Issue: "redirect_uri_mismatch"
- **Solution**: Add your exact redirect URI to authorized redirect URIs in Google Cloud Console

### Issue: "invalid_client"
- **Solution**: Verify OAuth client ID matches between Firebase and Google Cloud Console

### Issue: "access_blocked"
- **Solution**: Configure OAuth consent screen properly and add test users if in testing mode

## Testing Steps
1. Open your app: http://localhost:8082
2. Go to `/register` or `/login`
3. Select "Doctor" or "Patient" tab
4. Click "Continue with Google as [Role]"
5. Should open Google sign-in popup
6. Complete authentication
7. Should redirect back to your app

## Support
If issues persist:
1. Check Firebase Console error logs
2. Check browser developer console for errors
3. Verify all domains are correctly added
4. Contact Firebase support if needed

## Current Development URL
Your app is running at: **http://localhost:8082**
Make sure this exact URL is authorized in both Firebase and Google Cloud Console.
