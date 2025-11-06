# Azure Account Setup Guide

This guide will help you create a new Azure account and prepare it for deploying the Luxe Bella app.

---

## 🆓 Step 1: Create Azure Account

### Option A: Free Account (Recommended for Getting Started)

1. **Go to Azure Free Account Page**
   - Visit: https://azure.microsoft.com/free/
   - Click **"Start free"** button

2. **Sign Up**
   - Use your Microsoft account (or create one)
   - Provide:
     - Email address
     - Phone number for verification
     - Country/Region
     - Agree to terms

3. **Identity Verification**
   - Azure will verify your identity via:
     - Phone number verification (SMS or call)
     - Credit card verification (required but won't be charged unless you upgrade)
     - Note: You get $200 free credit for 30 days, no charges for 12 months on free services

4. **Complete Registration**
   - Accept the agreement
   - Complete verification process
   - Wait for account activation (usually instant)

### Option B: Existing Microsoft Account

If you already have a Microsoft account:
1. Go to https://portal.azure.com
2. Sign in with your Microsoft account
3. If you don't have an Azure subscription, you'll be prompted to create one

---

## 💳 Step 2: Understanding Azure Pricing

### Free Tier Benefits (12 months):
- **App Service:** 10 apps on Free tier (shared infrastructure)
- **PostgreSQL:** Not included in free tier (starts at ~$12/month)
- **$200 credit** for 30 days to use any services
- **Always Free Services:**
  - Azure Functions (1 million requests/month)
  - Application Insights (5GB data/month)
  - Static Web Apps (100GB bandwidth/month)

### Recommended Starting Plan:
- **Budget Option:** ~$25-30/month
  - App Service Basic (B1): ~$13/month
  - PostgreSQL Burstable (B1ms): ~$12/month
  
- **Production Option:** ~$85-100/month
  - App Service Standard (S1): ~$55/month
  - PostgreSQL General Purpose (S1): ~$30/month

---

## ✅ Step 3: Verify Your Account

### Check Subscription Status

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com
   - Sign in

2. **Check Subscription**
   - Click on your account icon (top right)
   - Select "Subscriptions" or go to: https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade
   - You should see your subscription listed

3. **Verify Account Type**
   - Free Account: Shows "Free Trial" or similar
   - Pay-As-You-Go: Shows "Pay-As-You-Go"

---

## 🔧 Step 4: Install Azure CLI

You'll need Azure CLI to run deployment commands. Install it on your Mac:

### macOS Installation:
```bash
# Using Homebrew (Recommended)
brew install azure-cli

# Verify installation
az --version
```

### Manual Installation:
- Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-macos
- Or use: `curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash`

---

## 🔐 Step 5: Login to Azure CLI

```bash
# Login to Azure
az login

# This will:
# 1. Open your browser
# 2. Ask you to sign in
# 3. Complete authentication
# 4. Show your subscriptions
```

### Verify Login:
```bash
# List your subscriptions
az account list --output table

# Set active subscription (if you have multiple)
az account set --subscription "your-subscription-id-or-name"
```

---

## 📋 Step 6: Prepare Your Deployment

### Before You Deploy:

1. **Gather Required Information:**
   - [ ] Azure subscription ID (from `az account list`)
   - [ ] Your preferred location (e.g., `eastus`, `westus2`)
   - [ ] App name (must be globally unique, e.g., `luxe-bella-yourname`)

2. **Prepare OAuth Credentials:**
   - [ ] Google OAuth Client ID & Secret
   - [ ] Facebook App ID & Secret
   - **Note:** Update redirect URIs after deployment

3. **Optional Services:**
   - [ ] Stripe keys (for payments)
   - [ ] Twilio credentials (for SMS)
   - [ ] SMTP settings (for emails)

---

## 🚀 Step 7: Quick Test

Test your Azure account setup:

```bash
# Test Azure CLI
az account show

# Test resource group creation (will be created, then deleted)
az group create --name test-rg --location eastus
az group delete --name test-rg --yes

# If both work, you're ready!
```

---

## 💰 Step 8: Set Up Billing Alerts (Recommended)

To avoid unexpected charges:

1. **Go to Azure Portal**
   - Navigate to: Cost Management + Billing
   - Click "Budgets"
   - Create a budget alert

2. **Set Budget:**
   - Amount: $50/month (or your preferred limit)
   - Alert at: 80% and 100%
   - Email alerts to your email

3. **Monitor Spending:**
   - Check "Cost Management" regularly
   - Review "Usage" to see what's being used

---

## 🎯 Step 9: Choose Your Deployment Method

Once your Azure account is ready, you have three options:

### Option A: Automated Script (Easiest)
```bash
# Run the deployment script
./deploy-to-azure.sh
```
This will create everything automatically!

### Option B: Step-by-Step Manual (Recommended for Learning)
Follow `AZURE_DEPLOYMENT_PLAN.md` for detailed instructions

### Option C: Azure Portal (GUI)
Use the Azure Portal web interface (slower but visual)

---

## 📝 Account Setup Checklist

Before deploying, make sure:
- [ ] Azure account created and verified
- [ ] Subscription active (check Azure Portal)
- [ ] Azure CLI installed (`az --version` works)
- [ ] Logged in via CLI (`az login` successful)
- [ ] Subscription ID noted
- [ ] Preferred location chosen
- [ ] Budget alerts configured (optional but recommended)
- [ ] OAuth credentials ready (Google & Facebook)
- [ ] Ready to deploy!

---

## 🆘 Troubleshooting

### "No subscription found"
- Make sure you completed the sign-up process
- Check that you accepted the agreement
- Verify your account in Azure Portal

### "Azure CLI not found"
- Install Azure CLI (see Step 4)
- Make sure it's in your PATH
- Try `brew install azure-cli` on macOS

### "Login failed"
- Make sure you're using the correct Microsoft account
- Try `az logout` then `az login` again
- Check that your account has an active subscription

### "Billing concerns"
- Set up budget alerts (Step 8)
- Use free tier services where possible
- Monitor usage in Azure Portal
- You can delete resources anytime to stop charges

---

## 🎉 Next Steps

Once your Azure account is set up:

1. **Review the deployment plan:**
   - Read `AZURE_DEPLOYMENT_PLAN.md` for detailed steps
   - Or use `AZURE_QUICK_START.md` for condensed version

2. **Choose your deployment method:**
   - Automated script (fastest)
   - Manual step-by-step (most control)
   - Azure Portal GUI (most visual)

3. **Start deploying!**
   - Follow the deployment guide
   - Test your app
   - Configure OAuth redirect URIs
   - Set up monitoring

---

## 💡 Tips

1. **Start Small:** Use Basic tier (B1) for testing, upgrade later
2. **Use Free Tier:** Take advantage of 12-month free services
3. **Monitor Costs:** Set up alerts and check regularly
4. **Delete When Done:** If testing, delete resources to stop charges
5. **Document Everything:** Save passwords, connection strings, etc.

---

## 📚 Additional Resources

- [Azure Free Account FAQ](https://azure.microsoft.com/free/free-account-faq/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [Azure CLI Documentation](https://docs.microsoft.com/en-us/cli/azure/)
- [Azure Portal](https://portal.azure.com)

---

**Ready to create your Azure account?** 
1. Visit: https://azure.microsoft.com/free/
2. Click "Start free"
3. Follow the sign-up process
4. Come back here when done!

Good luck! 🚀

