# OAuth Setup Guide - Google & Facebook Sign-In

This guide will walk you through setting up Google and Facebook OAuth authentication for the Luxe Bella app.

---

## 🔵 Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `Luxe Bella App` (or any name)
5. Click **"Create"**

### Step 2: Configure OAuth Consent Screen

1. In the left sidebar, go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (for testing) or **"Internal"** (if using Google Workspace)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: `Luxe Bella`
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On **"Scopes"** page, click **"Save and Continue"** (no need to add scopes)
7. On **"Test users"** page, click **"Save and Continue"** (optional for testing)
8. Review and click **"Back to Dashboard"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Select **"Web application"** as the application type
4. Give it a name: `Luxe Bella Web Client`
5. **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `https://your-domain.com` (for production)
6. **Authorized redirect URIs** (IMPORTANT - Add these exact URLs):
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
7. Click **"Create"**
8. **Copy the Client ID and Client Secret** (you'll need these!)

### Step 4: Add to Environment Variables

Add these to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

## 🔵 Facebook OAuth Setup

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select **"Consumer"** as the app type
4. Click **"Next"**
5. Fill in:
   - **App name**: `Luxe Bella`
   - **App contact email**: Your email
6. Click **"Create App"**

### Step 2: Add Facebook Login Product

1. In your app dashboard, find **"Add a Product"**
2. Click **"Set Up"** on **"Facebook Login"**
3. Select **"Web"** as the platform
4. Click **"Continue"**

### Step 3: Configure Facebook Login Settings

1. In the left sidebar, go to **"Facebook Login"** → **"Settings"**
2. **Valid OAuth Redirect URIs** (Add these exact URLs):
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://your-domain.com/api/auth/callback/facebook` (production)
3. Click **"Save Changes"**

### Step 4: Get App Credentials

1. Go to **"Settings"** → **"Basic"** (in the left sidebar)
2. You'll see:
   - **App ID** (this is your `FACEBOOK_CLIENT_ID`)
   - **App Secret** (click **"Show"** to reveal - this is your `FACEBOOK_CLIENT_SECRET`)

### Step 5: Add to Environment Variables

Add these to your `.env` file:

```env
FACEBOOK_CLIENT_ID=your-app-id-here
FACEBOOK_CLIENT_SECRET=your-app-secret-here
```

### Step 6: Configure App Domains (Optional but Recommended)

1. In **"Settings"** → **"Basic"**
2. Scroll to **"App Domains"**
3. Add your domain: `your-domain.com` (without http/https)
4. Click **"Save Changes"**

---

## ✅ After Setup

### 1. Update Your `.env` File

Make sure your `.env` file includes all OAuth credentials:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Required for NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 2. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Test the Sign-In

1. Go to `http://localhost:3000/auth/signin`
2. Click **"Sign in with Google"** or **"Sign in with Facebook"**
3. You should be redirected to Google/Facebook for authentication
4. After approving, you'll be redirected back and signed in!

---

## 🔒 Important Security Notes

### For Production:

1. **Update Redirect URIs**: Make sure to add your production domain URLs in both Google and Facebook settings
2. **App Review**: Facebook requires app review for production use. Google may require verification for sensitive scopes.
3. **HTTPS Required**: Both providers require HTTPS for production redirect URIs
4. **Environment Variables**: Never commit `.env` file to git. Use secure environment variable storage in production (Azure App Settings, etc.)

### For Development:

1. **Localhost**: Both providers support `http://localhost:3000` for development
2. **Test Users**: Facebook allows you to add test users in the dashboard for testing before app review
3. **Google Test Mode**: Google apps in test mode can only be used by users you add to the test users list

---

## 🐛 Troubleshooting

### Google Sign-In Not Working?

- ✅ Check that redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
- ✅ Verify Client ID and Secret are correct in `.env`
- ✅ Make sure OAuth consent screen is configured
- ✅ Restart the dev server after adding credentials
- ✅ Check browser console for errors

### Facebook Sign-In Not Working?

- ✅ Check that redirect URI matches exactly: `http://localhost:3000/api/auth/callback/facebook`
- ✅ Verify App ID and Secret are correct in `.env`
- ✅ Make sure Facebook Login product is added
- ✅ Check App is not in restricted mode
- ✅ Restart the dev server after adding credentials
- ✅ Check browser console for errors

### Common Errors:

**"redirect_uri_mismatch"**
- The redirect URI in your OAuth provider settings doesn't match what NextAuth is using
- Double-check the exact URL format (no trailing slashes, correct protocol)

**"Invalid client"**
- Your Client ID or Secret is incorrect
- Check `.env` file for typos

**"App not configured"**
- The OAuth provider hasn't been fully set up
- Make sure all steps above are completed

---

## 📝 Quick Reference

### Required URLs for Development:

**Google:**
- Redirect URI: `http://localhost:3000/api/auth/callback/google`

**Facebook:**
- Redirect URI: `http://localhost:3000/api/auth/callback/facebook`

### Required URLs for Production:

**Google:**
- Redirect URI: `https://your-domain.com/api/auth/callback/google`

**Facebook:**
- Redirect URI: `https://your-domain.com/api/auth/callback/facebook`

---

## ✅ Verification Checklist

Before testing, make sure:

- [ ] Google OAuth consent screen is configured
- [ ] Google OAuth client created with correct redirect URI
- [ ] Facebook app created with Facebook Login product
- [ ] Facebook redirect URI configured
- [ ] All credentials added to `.env` file
- [ ] Development server restarted
- [ ] `NEXTAUTH_URL` is set correctly in `.env`

Once all these are done, Google and Facebook sign-in should work perfectly! 🎉

