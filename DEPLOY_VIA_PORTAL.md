# 🚀 Deploy via Azure Portal (Most Reliable)

The ZIP deployment is timing out. Use Azure Portal instead - it's more reliable!

## 📋 Step-by-Step Instructions

### Step 1: Open Azure Portal
1. Go to: https://portal.azure.com
2. Sign in with your account

### Step 2: Navigate to Your App
1. Search for **"luxe-bella-app"** in the top search bar
2. Click on **luxe-bella-app** (Web App)

### Step 3: Go to Deployment Center
1. In the left menu, click **"Deployment Center"**
2. You'll see deployment options

### Step 4: Choose Deployment Method

#### Option A: Local Git (Recommended)
1. Click **"Local Git"** tab
2. Click **"Save"** (if needed)
3. Azure will show you Git commands like:
   ```
   git remote add azure https://luxe-bella-app.scm.azurewebsites.net/luxe-bella-app.git
   git push azure main
   ```
4. Copy those commands and run them in your terminal

#### Option B: GitHub (If you have GitHub)
1. Click **"GitHub"** tab
2. Click **"Authorize"** and authorize Azure
3. Select your repository
4. Choose branch (usually `main` or `master`)
5. Click **"Save"**
6. Azure will auto-deploy on every push!

### Step 5: Deploy Code

**If using Local Git:**
```bash
cd /Users/ssahoo/IdeaProjects/luxe-bella-app

# Make sure you have a git repo
if [ ! -d ".git" ]; then
  git init
  git add .
  git commit -m "Initial commit"
fi

# Add Azure remote (use the URL from Portal)
git remote add azure https://luxe-bella-app.scm.azurewebsites.net/luxe-bella-app.git

# Push to deploy
git push azure main
```

**If using GitHub:**
1. Push your code to GitHub
2. Azure will automatically deploy!

## ⚙️ Configure Build Settings

Before deploying, make sure build settings are configured:

1. In Azure Portal, go to **"Configuration"** (left menu)
2. Under **"Application settings"**, ensure:
   - `SCM_DO_BUILD_DURING_DEPLOYMENT` = `true`
   - `ENABLE_ORYX_BUILD` = `true`
3. Click **"Save"**

## ✅ After Deployment

1. Wait 5-10 minutes for first build
2. Check deployment status in **"Deployment Center"** → **"Logs"**
3. Visit: https://luxe-bella-app.azurewebsites.net

## 🆘 Troubleshooting

**If deployment fails:**
1. Check **"Deployment Center"** → **"Logs"** for errors
2. Verify Node.js version in **"Configuration"** → **"General settings"**
3. Check build logs in **"Log stream"**

**If app doesn't load:**
1. Check **"Log stream"** for errors
2. Verify environment variables are set correctly
3. Ensure database connection string is correct

