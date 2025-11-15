# 🔐 Git Deployment - Setup Instructions

The Git push requires deployment credentials. Here's how to set it up:

## Option A: Azure Portal (Easiest)

1. **Go to Azure Portal:**
   - https://portal.azure.com
   - Navigate to **luxe-bella-app** → **Deployment Center**

2. **Get Git URL:**
   - Click **"Local Git"** tab
   - You'll see a Git URL like: `https://username@luxe-bella-app.scm.azurewebsites.net/luxe-bella-app.git`
   - Copy this URL

3. **Update Git Remote:**
   ```bash
   git remote remove azure
   git remote add azure https://username@luxe-bella-app.scm.azurewebsites.net/luxe-bella-app.git
   ```

4. **Push to Deploy:**
   ```bash
   git push azure main
   ```
   - When prompted, enter the password shown in Azure Portal
   - Or use the username/password from the publishing profile

## Option B: Set Deployment User (Command Line)

1. **Create deployment user:**
   ```bash
   az webapp deployment user set --user-name luxe-bella-deploy
   ```
   - Enter a password when prompted (remember it!)

2. **Update Git Remote:**
   ```bash
   git remote remove azure
   git remote add azure https://luxe-bella-deploy@luxe-bella-app.scm.azurewebsites.net/luxe-bella-app.git
   ```

3. **Push to Deploy:**
   ```bash
   git push azure main
   ```
   - Enter the password you set in step 1

## Option C: Use Publishing Profile Password

1. **Get publishing profile:**
   ```bash
   az webapp deployment list-publishing-profiles \
     --resource-group luxe-bella-rg \
     --name luxe-bella-app \
     --query "[?publishMethod=='MSDeploy'].{userName:userName, userPWD:userPWD}" \
     --output json
   ```

2. **Use those credentials in Git URL:**
   ```bash
   git remote remove azure
   git remote add azure https://USERNAME:PASSWORD@luxe-bella-app.scm.azurewebsites.net/luxe-bella-app.git
   ```
   (Replace USERNAME and PASSWORD with actual values)

3. **Push:**
   ```bash
   git push azure main
   ```

## ✅ After Setup

Once credentials are configured, deployment is simple:

```bash
# Make changes
git add .
git commit -m "Update"
git push azure main  # Deploys automatically!
```

Azure will:
- Pull your code
- Install dependencies (`npm install`)
- Build your app (`npm run build`)
- Start the server (`npm start`)

## 📊 Monitor Deployment

Check deployment status:
- Azure Portal → **luxe-bella-app** → **Deployment Center** → **Logs**
- Or visit: https://luxe-bella-app.scm.azurewebsites.net/api/deployments

## 🎯 Recommended: Use Azure Portal

The easiest way is to use Azure Portal's Deployment Center - it provides the exact Git URL with credentials already configured!

