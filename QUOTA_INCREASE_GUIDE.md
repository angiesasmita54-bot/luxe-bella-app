# 📈 Azure Quota Increase Request Guide

Your Azure subscription needs a quota increase to create App Service resources. This is normal for new subscriptions.

## 🚀 Quick Solution: Request Quota Increase

### Option 1: Azure Portal (Easiest - Recommended)

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com
   - Sign in with your account

2. **Navigate to Subscriptions**
   - Search for "Subscriptions" in the top search bar
   - Click on your subscription (Azure subscription 1)

3. **Request Quota Increase**
   - Click on "Usage + quotas" in the left menu
   - Search for "App Service Plan" or look for "Compute" quotas
   - Click on the quota you want to increase (Free or Basic)
   - Click "Request increase"
   - Fill in the form:
     - **Details**: Select "App Service Plan"
     - **Region**: Select "East US 2" (or your preferred region)
     - **Quota type**: Select "Free" or "Basic"
     - **Limit**: Request 1 (minimum)
     - **Reason**: "Testing deployment of Luxe Bella web application"
   - Click "Submit"

4. **Wait for Approval**
   - Usually approved within 1-24 hours
   - You'll receive an email when approved

### Option 2: Azure CLI (Alternative)

If you prefer command line, you can create a support request:

```bash
# Create a support ticket (requires Azure Support plan)
az support tickets create \
  --title "Request App Service Plan Quota Increase" \
  --description "Need quota increase for App Service Plan (Free or Basic tier) to deploy Luxe Bella application" \
  --problem-classification "Quota" \
  --severity "minimal"
```

**Note:** This requires an Azure Support plan. The Portal method is free.

### Option 3: Try Different Regions

Some regions may have quota available. Try these:

```bash
# Try West US 2
az appservice plan create \
  --name luxe-bella-plan \
  --resource-group luxe-bella-rg \
  --sku FREE \
  --is-linux \
  --location westus2

# Or try West Europe
az appservice plan create \
  --name luxe-bella-plan \
  --resource-group luxe-bella-rg \
  --sku FREE \
  --is-linux \
  --location westeurope
```

---

## ⏱️ While Waiting for Quota Approval

### Test Locally

You can continue testing your app locally:

```bash
# Make sure database is accessible
# Update .env with your Azure database connection string
DATABASE_URL="postgresql://luxebellaadmin:VvlcPZVk3jG42uwX@luxe-bella-db.postgres.database.azure.com:5432/luxe_bella?sslmode=require"

# Run migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

### Prepare for Deployment

While waiting, you can prepare:

1. **Set up OAuth credentials** (Google & Facebook)
2. **Configure Stripe** (if using payments)
3. **Set up email service** (SMTP)
4. **Review deployment documentation**

---

## 📋 After Quota is Approved

Once you receive approval email:

1. **Verify quota increase:**
   ```bash
   az vm list-usage --location eastus2 --output table
   ```

2. **Run deployment script:**
   ```bash
   ./deploy-to-azure.sh
   ```

3. **Or create resources manually:**
   ```bash
   # Create App Service Plan
   az appservice plan create \
     --name luxe-bella-plan \
     --resource-group luxe-bella-rg \
     --sku FREE \
     --is-linux \
     --location eastus2
   
   # Create Web App
   az webapp create \
     --resource-group luxe-bella-rg \
     --plan luxe-bella-plan \
     --name luxe-bella-app \
     --runtime "NODE|18-lts"
   ```

---

## 🎯 What You Need for Custom Domain

**Important:** Free tier does NOT support custom domains.

To use `somosluxebella.com`, you'll need at least:

- **Basic tier (B1)** - ~$13/month
- Or **Shared tier (D1)** - ~$9/month

**Recommendation:**
1. Start with Free tier for testing
2. Upgrade to Basic (B1) when ready for custom domain
3. This can be done anytime without redeployment

### Upgrade Plan Command

```bash
# Upgrade from Free to Basic
az appservice plan update \
  --name luxe-bella-plan \
  --resource-group luxe-bella-rg \
  --sku B1
```

---

## ✅ Checklist

- [ ] Request quota increase via Azure Portal
- [ ] Wait for approval email (1-24 hours)
- [ ] Test app locally while waiting
- [ ] Set up OAuth credentials
- [ ] Prepare other services (Stripe, email, etc.)
- [ ] After approval, run deployment
- [ ] Upgrade to Basic tier when ready for custom domain

---

## 🆘 Need Help?

- **Azure Support**: https://azure.microsoft.com/support/
- **Quota Documentation**: https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits
- **App Service Pricing**: https://azure.microsoft.com/pricing/details/app-service/

---

**Current Status:**
- ✅ Database created and ready
- ✅ Resource group created
- ⏳ Waiting for App Service quota approval
- 📝 Deployment script ready (will run after quota approval)

