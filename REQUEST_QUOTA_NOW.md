# 🚀 Request Quota Increase - Quick Steps

You need to request a quota increase for **Basic VMs** to create your App Service Plan.

## ⚡ Quick Steps (5 minutes)

### Step 1: Go to Azure Portal
Visit: https://portal.azure.com

### Step 2: Navigate to Quota Request
1. Search for **"Subscriptions"** in the top search bar
2. Click on your subscription: **"Azure subscription 1"**
3. In the left menu, click **"Usage + quotas"**
4. Click **"Request increase"** button at the top

### Step 3: Fill Out the Form
- **Quota type**: Select **"Compute-VM (cores-vCPUs) subscription limit"** or **"App Service Plan"**
- **Region**: Select **"East US 2"** (or your preferred region)
- **Instance family**: Select **"Basic"** or **"Standard"**
- **New limit**: Enter **1** (minimum)
- **Details**: 
  ```
  Need quota for App Service Plan (Basic B1) to deploy Luxe Bella web application.
  Application requires custom domain support (somosluxebella.com).
  ```
- Click **"Submit"**

### Step 4: Wait for Approval
- Usually approved within **1-24 hours**
- You'll receive an email notification when approved
- Some requests are auto-approved instantly

## 🔄 Alternative: Try Different Regions

Some regions may have quota available. Run:

```bash
# Try West US 2
az appservice plan create \
  --name luxe-bella-plan \
  --resource-group luxe-bella-rg \
  --sku B1 \
  --is-linux \
  --location westus2

# Try West Europe
az appservice plan create \
  --name luxe-bella-plan \
  --resource-group luxe-bella-rg \
  --sku B1 \
  --is-linux \
  --location westeurope
```

## ✅ After Approval

Once you receive the approval email, run:

```bash
./deploy-to-azure.sh
```

Or create the plan manually:

```bash
az appservice plan create \
  --name luxe-bella-plan \
  --resource-group luxe-bella-rg \
  --sku B1 \
  --is-linux \
  --location eastus2
```

## 📞 Need Help?

If the request takes too long or you need urgent help:
- Azure Support: https://azure.microsoft.com/support/options/
- Create a support ticket through Azure Portal

## 🎯 Current Status

- ✅ Database: Created and ready
- ✅ Resource Group: Created
- ✅ Deployment Script: Ready
- ⏳ Waiting for: Basic VM quota approval

