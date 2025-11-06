# Azure Quick Start - Deployment Checklist

This is a condensed checklist for quick deployment. See `AZURE_DEPLOYMENT_PLAN.md` for detailed instructions.

---

## 🎯 Quick Deployment Steps

### 1. Azure Login & Setup (5 minutes)
```bash
# Login
az login

# Create resource group
az group create --name luxe-bella-rg --location eastus
```

### 2. Database Setup (10 minutes)

**Via Azure Portal (Easiest):**
1. Portal → Create resource → "Azure Database for PostgreSQL"
2. Select "Flexible server"
3. Fill in details → Create
4. Note: Connection string, admin username, password

**Via CLI:**
```bash
az postgres flexible-server create \
  --resource-group luxe-bella-rg \
  --name luxe-bella-db \
  --location eastus \
  --admin-user admin \
  --admin-password "YourPassword123!" \
  --sku-name Standard_B1ms \
  --public-access 0.0.0.0

# Create database
az postgres flexible-server db create \
  --resource-group luxe-bella-rg \
  --server-name luxe-bella-db \
  --database-name luxe_bella
```

### 3. App Service Setup (5 minutes)
```bash
# Create App Service Plan
az appservice plan create \
  --name luxe-bella-plan \
  --resource-group luxe-bella-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group luxe-bella-rg \
  --plan luxe-bella-plan \
  --name luxe-bella-app \
  --runtime "NODE|18-lts"
```

### 4. Configure Environment Variables (10 minutes)

**Get your connection string:**
```bash
# Get database host
az postgres flexible-server show \
  --resource-group luxe-bella-rg \
  --name luxe-bella-db \
  --query fullyQualifiedDomainName \
  --output tsv
```

**Set all variables at once:**
```bash
az webapp config appsettings set \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --settings \
    DATABASE_URL="postgresql://admin:YourPassword@luxe-bella-db.postgres.database.azure.com:5432/luxe_bella?sslmode=require" \
    NEXTAUTH_URL="https://luxe-bella-app.azurewebsites.net" \
    NEXTAUTH_SECRET="$(openssl rand -base64 32)" \
    NODE_ENV="production"
```

**Or set one by one via Portal:**
- Azure Portal → Your App Service → Configuration → Application settings

### 5. Run Database Migrations (5 minutes)
```bash
# Set DATABASE_URL locally
export DATABASE_URL="your-connection-string-from-azure"

# Run migrations
npx prisma migrate deploy
```

### 6. Deploy Application (5 minutes)

**Option A: Quick Deploy (Local Build)**
```bash
npm run build
zip -r deploy.zip . -x "*.git*" "node_modules/*" ".env*"
az webapp deployment source config-zip \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --src deploy.zip
```

**Option B: GitHub Actions (Recommended)**
- Push code to GitHub
- Set up workflow (see `AZURE_DEPLOYMENT_PLAN.md`)
- Auto-deploys on push

### 7. Update OAuth Redirect URIs (5 minutes)

**Google:**
- Add: `https://luxe-bella-app.azurewebsites.net/api/auth/callback/google`

**Facebook:**
- Add: `https://luxe-bella-app.azurewebsites.net/api/auth/callback/facebook`

### 8. Test (5 minutes)
- Visit: `https://luxe-bella-app.azurewebsites.net`
- Test sign-up, sign-in, password reset
- Verify database connection

---

## ⏱️ Total Time: ~45 minutes

---

## 📝 Required Information Checklist

Before starting, gather:
- [ ] Azure subscription ID
- [ ] Database admin password (strong password)
- [ ] Google OAuth Client ID & Secret
- [ ] Facebook App ID & Secret
- [ ] NEXTAUTH_SECRET (generate with: `openssl rand -base64 32`)
- [ ] Optional: Stripe keys, Twilio credentials, SMTP settings

---

## 🔗 Your App URLs

After deployment:
- **App URL:** `https://luxe-bella-app.azurewebsites.net`
- **OAuth Callbacks:**
  - Google: `https://luxe-bella-app.azurewebsites.net/api/auth/callback/google`
  - Facebook: `https://luxe-bella-app.azurewebsites.net/api/auth/callback/facebook`

---

## 🆘 Common Commands

```bash
# View logs
az webapp log tail --resource-group luxe-bella-rg --name luxe-bella-app

# Restart app
az webapp restart --resource-group luxe-bella-rg --name luxe-bella-app

# View app settings
az webapp config appsettings list --resource-group luxe-bella-rg --name luxe-bella-app

# Delete everything (cleanup)
az group delete --name luxe-bella-rg --yes
```

---

## ✅ Verification Checklist

After deployment:
- [ ] App loads at Azure URL
- [ ] Database connection works
- [ ] Can create new user account
- [ ] Can sign in with email
- [ ] Google sign-in works (if configured)
- [ ] Facebook sign-in works (if configured)
- [ ] Password reset works
- [ ] Can create appointments
- [ ] Services page loads

---

**Need detailed instructions?** See `AZURE_DEPLOYMENT_PLAN.md`

