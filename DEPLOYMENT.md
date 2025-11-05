# Deployment Guide - Luxe Bella App

## Azure Deployment Steps

### 1. Prerequisites

- Azure account with active subscription
- Azure CLI installed
- PostgreSQL database (Azure Database for PostgreSQL or external)

### 2. Database Setup

1. Create PostgreSQL database in Azure:
   ```bash
   az postgres flexible-server create \
     --resource-group luxe-bella-rg \
     --name luxe-bella-db \
     --location eastus \
     --admin-user adminuser \
     --admin-password YourPassword123! \
     --sku-name Standard_B1ms \
     --version 14
   ```

2. Update connection string:
   ```
   DATABASE_URL="postgresql://adminuser:YourPassword123!@luxe-bella-db.postgres.database.azure.com:5432/luxe_bella?sslmode=require"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### 3. App Service Setup

1. Create resource group:
   ```bash
   az group create --name luxe-bella-rg --location eastus
   ```

2. Create App Service Plan:
   ```bash
   az appservice plan create \
     --name luxe-bella-plan \
     --resource-group luxe-bella-rg \
     --sku B1 \
     --is-linux
   ```

3. Create Web App:
   ```bash
   az webapp create \
     --resource-group luxe-bella-rg \
     --plan luxe-bella-plan \
     --name luxe-bella-app \
     --runtime "NODE|18-lts"
   ```

### 4. Configure Environment Variables

Set all environment variables in Azure Portal or via CLI:

```bash
az webapp config appsettings set \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --settings \
    DATABASE_URL="your-database-url" \
    NEXTAUTH_URL="https://luxe-bella-app.azurewebsites.net" \
    NEXTAUTH_SECRET="your-secret-key" \
    GOOGLE_CLIENT_ID="your-google-id" \
    GOOGLE_CLIENT_SECRET="your-google-secret" \
    FACEBOOK_CLIENT_ID="your-facebook-id" \
    FACEBOOK_CLIENT_SECRET="your-facebook-secret" \
    STRIPE_PUBLISHABLE_KEY="your-stripe-key" \
    STRIPE_SECRET_KEY="your-stripe-secret" \
    TWILIO_ACCOUNT_SID="your-twilio-sid" \
    TWILIO_AUTH_TOKEN="your-twilio-token" \
    TWILIO_PHONE_NUMBER="your-twilio-number"
```

### 5. Deploy Application

#### Option A: GitHub Actions (Recommended)

1. Create `.github/workflows/azure-deploy.yml`:
   ```yaml
   name: Deploy to Azure
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: azure/login@v1
           with:
             creds: ${{ secrets.AZURE_CREDENTIALS }}
         - uses: azure/webapps-deploy@v2
           with:
             app-name: 'luxe-bella-app'
             package: '.'
   ```

2. Add Azure credentials to GitHub Secrets

#### Option B: Azure CLI

```bash
az webapp deployment source config-zip \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --src deploy.zip
```

#### Option C: VS Code Extension

Use the Azure App Service extension in VS Code for easy deployment.

### 6. Set Up Cron Jobs

For automated notifications, set up Azure Functions or use a service like EasyCron:

1. Create Azure Function App
2. Create timer trigger function
3. Call `/api/cron/notifications` endpoint hourly

Or use Azure Logic Apps with HTTP trigger scheduled to run every hour.

### 7. Configure Custom Domain

1. In Azure Portal, go to your App Service
2. Navigate to Custom domains
3. Add your domain and configure DNS records

### 8. Enable HTTPS

Azure automatically provides SSL certificates for `*.azurewebsites.net` domains. For custom domains, configure SSL certificates in the Custom domains section.

### 9. Monitoring

- Enable Application Insights for monitoring
- Set up alerts for errors and performance issues
- Monitor database performance

### 10. Scaling

- For production, consider upgrading to Premium plan
- Enable auto-scaling based on metrics
- Use Azure CDN for static assets

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] OAuth providers configured with production URLs
- [ ] Stripe webhook URL configured
- [ ] Twilio credentials verified
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Cron jobs scheduled
- [ ] Monitoring enabled
- [ ] Backup strategy configured

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check firewall rules allow Azure services
- Ensure SSL is enabled

### Authentication Issues
- Verify OAuth redirect URLs match production domain
- Check NEXTAUTH_URL matches actual domain
- Ensure NEXTAUTH_SECRET is set

### Payment Issues
- Verify Stripe webhook endpoint is accessible
- Check webhook secret matches
- Ensure payment intent creation succeeds

### Notification Issues
- Verify Twilio credentials
- Check phone number format
- Ensure cron job is running

