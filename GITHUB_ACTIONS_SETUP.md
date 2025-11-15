# 🚀 GitHub Actions Deployment Setup

This guide will help you set up automated deployments from GitHub to Azure App Service.

## ✅ Prerequisites

- Code is pushed to GitHub (✅ Done!)
- Azure App Service exists (luxe-bella-app)
- You have access to both GitHub and Azure

## 📋 Step-by-Step Setup

### Step 1: Get Azure Publish Profile

You need to download the publish profile from Azure. Choose one method:

#### Option A: Azure Portal (Easiest)
1. Go to https://portal.azure.com
2. Navigate to **luxe-bella-app** (App Service)
3. Click **"Get publish profile"** button (top toolbar)
4. Save the downloaded `.PublishSettings` file
5. Open the file and copy its entire contents

#### Option B: Azure CLI
```bash
az webapp deployment list-publishing-profiles \
  --name luxe-bella-app \
  --resource-group luxe-bella-rg \
  --xml
```
Copy the entire XML output.

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/angiesasmita54-bot/luxe-bella-app
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add:

   **Secret 1: `AZURE_PUBLISH_PROFILE`**
   - Name: `AZURE_PUBLISH_PROFILE`
   - Value: Paste the entire publish profile XML content from Step 1
   - Click **"Add secret"**

   **Secret 2: `DATABASE_URL`**
   - Name: `DATABASE_URL`
   - Value: Your PostgreSQL connection string (e.g., `postgresql://user:password@host:5432/dbname`)
   - Click **"Add secret"**

### Step 3: Verify Workflow File

The workflow file is already created at `.github/workflows/azure-deploy.yml`. It will:
- ✅ Build your Next.js app
- ✅ Run Prisma migrations
- ✅ Deploy to Azure App Service

### Step 4: Test the Deployment

1. Make a small change to your code (or just push the workflow file)
2. Commit and push:
   ```bash
   git add .github/workflows/azure-deploy.yml
   git commit -m "Add GitHub Actions deployment workflow"
   git push origin main
   ```
3. Go to your GitHub repository → **Actions** tab
4. You should see the workflow running
5. Wait 5-10 minutes for the first deployment

### Step 5: Monitor Deployment

- **GitHub Actions**: https://github.com/angiesasmita54-bot/luxe-bella-app/actions
- **Azure Portal**: https://portal.azure.com → luxe-bella-app → Deployment Center → Logs
- **Your App**: https://luxe-bella-app.azurewebsites.net

## 🔄 How It Works

Every time you push to the `main` branch:
1. GitHub Actions automatically triggers
2. Builds your Next.js application
3. Runs database migrations
4. Deploys to Azure App Service

## 🛠️ Manual Deployment

You can also trigger deployments manually:
1. Go to **Actions** tab in GitHub
2. Select **"Deploy to Azure App Service"** workflow
3. Click **"Run workflow"** → **"Run workflow"**

## ⚙️ Troubleshooting

### Build Fails
- Check the **Actions** tab for error logs
- Ensure all environment variables are set in Azure Portal
- Verify `DATABASE_URL` secret is correct

### Deployment Fails
- Verify `AZURE_PUBLISH_PROFILE` secret is correct
- Check Azure App Service is running
- Review deployment logs in Azure Portal

### Database Migration Fails
- Ensure `DATABASE_URL` secret is set correctly
- Check database is accessible from Azure
- Verify Prisma schema is up to date

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure App Service Deployment](https://docs.microsoft.com/azure/app-service/deploy-github-actions)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## 🎯 Next Steps

After setup:
1. ✅ Push code → Auto-deploy
2. ✅ Monitor deployments in GitHub Actions
3. ✅ Set up staging branch (optional)
4. ✅ Configure custom domain (if needed)

