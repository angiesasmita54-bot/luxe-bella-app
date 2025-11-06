# Azure Deployment Plan - Luxe Bella App

This is a comprehensive step-by-step guide to deploy your Luxe Bella app to Azure.

---

## 📋 Pre-Deployment Checklist

Before starting, make sure you have:
- [ ] Azure account with active subscription
- [ ] Azure CLI installed ([Download here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
- [ ] Your code committed to git (local or GitHub)
- [ ] All environment variables documented
- [ ] OAuth credentials ready (Google & Facebook)
- [ ] Domain name (optional, for custom domain)

---

## 🚀 Step-by-Step Deployment Plan

### Phase 1: Azure Setup & Authentication

#### Step 1.1: Install Azure CLI
```bash
# macOS
brew install azure-cli

# Verify installation
az --version
```

#### Step 1.2: Login to Azure
```bash
az login
# This will open a browser for authentication
```

#### Step 1.3: Set Your Subscription
```bash
# List your subscriptions
az account list --output table

# Set active subscription (replace with your subscription ID)
az account set --subscription "your-subscription-id"
```

---

### Phase 2: Database Setup

#### Step 2.1: Create Resource Group
```bash
az group create \
  --name luxe-bella-rg \
  --location eastus
```

**Note:** Choose a location close to your users (e.g., `eastus`, `westus2`, `westeurope`)

#### Step 2.2: Create PostgreSQL Database

**Option A: Azure Database for PostgreSQL Flexible Server (Recommended)**
```bash
az postgres flexible-server create \
  --resource-group luxe-bella-rg \
  --name luxe-bella-db \
  --location eastus \
  --admin-user luxebellaadmin \
  --admin-password "YourSecurePassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32 \
  --public-access 0.0.0.0
```

**Option B: Using Azure Portal (Easier for first-time users)**
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Azure Database for PostgreSQL"
4. Select "Flexible server"
5. Fill in:
   - Server name: `luxe-bella-db`
   - Resource group: `luxe-bella-rg`
   - Location: `East US`
   - Admin username: `luxebellaadmin`
   - Password: (create a strong password)
   - Compute: `Burstable B1ms`
   - Storage: `32 GB`
6. Click "Review + create" → "Create"

#### Step 2.3: Configure Database Firewall
```bash
# Allow Azure services to access
az postgres flexible-server firewall-rule create \
  --resource-group luxe-bella-rg \
  --name luxe-bella-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your local IP (for running migrations)
az postgres flexible-server firewall-rule create \
  --resource-group luxe-bella-rg \
  --name luxe-bella-db \
  --rule-name AllowMyIP \
  --start-ip-address YOUR_IP_ADDRESS \
  --end-ip-address YOUR_IP_ADDRESS
```

#### Step 2.4: Create Database
```bash
az postgres flexible-server db create \
  --resource-group luxe-bella-rg \
  --server-name luxe-bella-db \
  --database-name luxe_bella
```

#### Step 2.5: Get Connection String
```bash
# Get the connection details
az postgres flexible-server show \
  --resource-group luxe-bella-rg \
  --name luxe-bella-db \
  --query "{host:fullyQualifiedDomainName, username:administratorLogin}" \
  --output table
```

Your connection string will be:
```
postgresql://luxebellaadmin:YourSecurePassword123!@luxe-bella-db.postgres.database.azure.com:5432/luxe_bella?sslmode=require
```

---

### Phase 3: App Service Setup

#### Step 3.1: Create App Service Plan
```bash
az appservice plan create \
  --name luxe-bella-plan \
  --resource-group luxe-bella-rg \
  --sku B1 \
  --is-linux
```

**SKU Options:**
- `B1` (Basic) - $13/month - Good for testing
- `S1` (Standard) - $55/month - Recommended for production
- `P1V2` (Premium) - $146/month - For high traffic

#### Step 3.2: Create Web App
```bash
az webapp create \
  --resource-group luxe-bella-rg \
  --plan luxe-bella-plan \
  --name luxe-bella-app \
  --runtime "NODE|18-lts"
```

**Note:** Your app URL will be: `https://luxe-bella-app.azurewebsites.net`

#### Step 3.3: Configure Node.js Version
```bash
az webapp config appsettings set \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --settings WEBSITE_NODE_DEFAULT_VERSION="~18"
```

---

### Phase 4: Environment Variables Configuration

#### Step 4.1: Prepare Your Environment Variables

Create a file `azure-env-vars.txt` with all your variables:

```bash
# Database
DATABASE_URL="postgresql://luxebellaadmin:YourPassword@luxe-bella-db.postgres.database.azure.com:5432/luxe_bella?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://luxe-bella-app.azurewebsites.net"
NEXTAUTH_SECRET="generate-this-with: openssl rand -base64 32"

# OAuth - Google
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth - Facebook
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Email (Optional - for password reset emails)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@luxebella.com"

# Stripe (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Twilio (Optional)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"
TWILIO_WHATSAPP_NUMBER="+1234567890"

# Other (Optional)
NODE_ENV="production"
```

#### Step 4.2: Set Environment Variables in Azure

**Option A: Using Azure CLI (Recommended)**
```bash
az webapp config appsettings set \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --settings \
    DATABASE_URL="postgresql://luxebellaadmin:YourPassword@luxe-bella-db.postgres.database.azure.com:5432/luxe_bella?sslmode=require" \
    NEXTAUTH_URL="https://luxe-bella-app.azurewebsites.net" \
    NEXTAUTH_SECRET="your-generated-secret" \
    GOOGLE_CLIENT_ID="your-google-client-id" \
    GOOGLE_CLIENT_SECRET="your-google-client-secret" \
    FACEBOOK_CLIENT_ID="your-facebook-app-id" \
    FACEBOOK_CLIENT_SECRET="your-facebook-app-secret" \
    NODE_ENV="production"
```

**Option B: Using Azure Portal (Easier for multiple variables)**
1. Go to Azure Portal → Your App Service
2. Navigate to "Configuration" → "Application settings"
3. Click "New application setting" for each variable
4. Click "Save" when done

---

### Phase 5: Database Migrations

#### Step 5.1: Run Migrations Locally (Recommended)

```bash
# Set your DATABASE_URL locally
export DATABASE_URL="postgresql://luxebellaadmin:YourPassword@luxe-bella-db.postgres.database.azure.com:5432/luxe_bella?sslmode=require"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

#### Step 5.2: Or Run Migrations via Azure Cloud Shell

1. Go to Azure Portal → Your App Service
2. Click "Cloud Shell" (top menu)
3. Run:
```bash
# Install Prisma CLI
npm install -g prisma

# Set DATABASE_URL
export DATABASE_URL="your-connection-string"

# Run migrations
prisma migrate deploy
```

---

### Phase 6: Deploy Your Application

#### Option A: Deploy via Azure CLI (Quickest)

```bash
# Build your app locally
npm run build

# Create deployment package
zip -r deploy.zip . -x "*.git*" "node_modules/*" ".env*" "*.md"

# Deploy to Azure
az webapp deployment source config-zip \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --src deploy.zip
```

#### Option B: Deploy via GitHub Actions (Recommended for CI/CD)

1. **Push your code to GitHub** (if not already)
```bash
git remote add origin https://github.com/yourusername/luxe-bella-app.git
git push -u origin main
```

2. **Create GitHub Actions Workflow**

Create `.github/workflows/azure-deploy.yml`:
```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'luxe-bella-app'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: .
```

3. **Get Publish Profile from Azure**
   - Go to Azure Portal → Your App Service
   - Click "Get publish profile"
   - Copy the entire XML content

4. **Add to GitHub Secrets**
   - Go to your GitHub repo → Settings → Secrets → Actions
   - Add secret: `AZURE_WEBAPP_PUBLISH_PROFILE` (paste the XML)
   - Add secret: `DATABASE_URL` (for build-time if needed)

5. **Push to trigger deployment**
```bash
git add .github/workflows/azure-deploy.yml
git commit -m "Add Azure deployment workflow"
git push
```

#### Option C: Deploy via VS Code Extension

1. Install "Azure App Service" extension in VS Code
2. Sign in to Azure
3. Right-click your project → "Deploy to Web App"
4. Select your App Service
5. Wait for deployment to complete

#### Option D: Deploy via Azure Portal

1. Go to Azure Portal → Your App Service
2. Navigate to "Deployment Center"
3. Choose source:
   - **GitHub**: Connect your GitHub account
   - **Local Git**: Set up local git deployment
   - **Zip Deploy**: Upload a zip file
4. Follow the setup wizard

---

### Phase 7: Post-Deployment Configuration

#### Step 7.1: Update OAuth Redirect URIs

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth client
3. Add authorized redirect URI:
   - `https://luxe-bella-app.azurewebsites.net/api/auth/callback/google`

**Facebook OAuth:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Navigate to your app → Facebook Login → Settings
3. Add Valid OAuth Redirect URI:
   - `https://luxe-bella-app.azurewebsites.net/api/auth/callback/facebook`

#### Step 7.2: Test Your Application

1. Visit: `https://luxe-bella-app.azurewebsites.net`
2. Test sign-up/sign-in
3. Test password reset
4. Test OAuth (Google/Facebook)
5. Test creating appointments
6. Check database connection

#### Step 7.3: Configure Custom Domain (Optional)

1. Go to Azure Portal → Your App Service
2. Navigate to "Custom domains"
3. Click "Add custom domain"
4. Enter your domain name
5. Follow DNS configuration instructions
6. Enable SSL certificate (free with App Service)

---

### Phase 8: Monitoring & Maintenance

#### Step 8.1: Enable Application Insights

```bash
az monitor app-insights component create \
  --app luxe-bella-insights \
  --location eastus \
  --resource-group luxe-bella-rg

# Link to your App Service
az webapp config appsettings set \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --settings \
    APPINSIGHTS_INSTRUMENTATIONKEY="your-instrumentation-key"
```

#### Step 8.2: Set Up Logging

1. Go to Azure Portal → Your App Service
2. Navigate to "Log stream" to view real-time logs
3. Navigate to "App Service logs" to configure logging
4. Enable "Application Logging (Filesystem)"

#### Step 8.3: Set Up Alerts

1. Go to Azure Portal → Your App Service
2. Navigate to "Alerts" → "New alert rule"
3. Configure alerts for:
   - High response time
   - High error rate
   - High CPU/Memory usage

---

### Phase 9: Automated Tasks (Cron Jobs)

#### Option A: Azure Functions (Recommended)

1. Create Function App:
```bash
az functionapp create \
  --resource-group luxe-bella-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name luxe-bella-functions \
  --storage-account luxebellastorage
```

2. Create Timer Trigger Function to call `/api/cron/notifications`

#### Option B: Azure Logic Apps

1. Create Logic App in Azure Portal
2. Add "Recurrence" trigger (every hour)
3. Add "HTTP" action to call your endpoint:
   - `https://luxe-bella-app.azurewebsites.net/api/cron/notifications`

#### Option C: External Cron Service

Use services like:
- [EasyCron](https://www.easycron.com/)
- [Cron-Job.org](https://cron-job.org/)

---

## 🔧 Troubleshooting

### Common Issues:

**1. Database Connection Failed**
- Check firewall rules allow Azure services
- Verify connection string format
- Ensure SSL is enabled (`sslmode=require`)

**2. Build Fails**
- Check Node.js version matches (18.x)
- Verify all environment variables are set
- Check build logs in Azure Portal

**3. OAuth Not Working**
- Verify redirect URIs match exactly
- Check environment variables are set correctly
- Ensure `NEXTAUTH_URL` matches your domain

**4. Application Crashes**
- Check Application Insights for errors
- Review logs in Azure Portal
- Verify database connection is working

---

## 📊 Cost Estimation

**Monthly Costs (Approximate):**

- **Basic Tier (B1):**
  - App Service Plan: ~$13/month
  - PostgreSQL B1ms: ~$12/month
  - **Total: ~$25/month**

- **Standard Tier (S1) - Recommended:**
  - App Service Plan: ~$55/month
  - PostgreSQL S1: ~$30/month
  - **Total: ~$85/month**

- **Premium Tier (P1V2):**
  - App Service Plan: ~$146/month
  - PostgreSQL P1: ~$200/month
  - **Total: ~$346/month**

**Note:** Prices vary by region and may include free tier credits.

---

## ✅ Post-Deployment Checklist

- [ ] Database created and migrations applied
- [ ] Environment variables configured
- [ ] Application deployed successfully
- [ ] OAuth redirect URIs updated
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Application Insights enabled
- [ ] Logging configured
- [ ] Alerts set up
- [ ] Cron jobs scheduled
- [ ] All features tested
- [ ] Backup strategy configured

---

## 🚀 Next Steps

1. **Set up staging environment** (copy the same setup with `-staging` suffix)
2. **Configure CI/CD pipeline** for automatic deployments
3. **Set up monitoring and alerts**
4. **Configure backups** for database
5. **Optimize performance** (CDN, caching, etc.)
6. **Set up scaling** rules for traffic spikes

---

## 📚 Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Production Checklist](https://www.prisma.io/docs/guides/performance-and-optimization/production-checklist)

---

## 🆘 Need Help?

If you encounter issues:
1. Check Azure Portal logs
2. Review Application Insights
3. Check Prisma migration status
4. Verify all environment variables
5. Test database connection separately

Good luck with your deployment! 🎉

