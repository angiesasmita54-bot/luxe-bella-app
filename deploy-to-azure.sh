#!/bin/bash

# Azure Deployment Script for Luxe Bella App
# Usage: ./deploy-to-azure.sh

set -e

echo "🚀 Luxe Bella - Azure Deployment Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed.${NC}"
    echo "Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure. Logging in...${NC}"
    az login
fi

# Variables
RESOURCE_GROUP="luxe-bella-rg"
LOCATION="eastus2"  # Changed from eastus - more reliable for PostgreSQL
APP_NAME="luxe-bella-app"
DB_NAME="luxe-bella-db"
PLAN_NAME="luxe-bella-plan"

echo -e "${GREEN}✅ Azure CLI found and authenticated${NC}"
echo ""

# Prompt for confirmation
read -p "This will create Azure resources. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Step 1: Create Resource Group
echo -e "${YELLOW}📦 Creating resource group...${NC}"
az group create --name $RESOURCE_GROUP --location $LOCATION || echo "Resource group may already exist"
echo -e "${GREEN}✅ Resource group ready${NC}"
echo ""

# Step 2: Create Database
echo -e "${YELLOW}🗄️  Creating PostgreSQL database...${NC}"
echo "This may take a few minutes..."
DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)

az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_NAME \
  --location $LOCATION \
  --admin-user luxebellaadmin \
  --admin-password $DB_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32 \
  --public-access 0.0.0.0 \
  --yes || echo "Database may already exist"

# Allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_NAME \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0 || echo "Firewall rule may already exist"

# Create database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_NAME \
  --database-name luxe_bella || echo "Database may already exist"

DB_HOST=$(az postgres flexible-server show \
  --resource-group $RESOURCE_GROUP \
  --name $DB_NAME \
  --query fullyQualifiedDomainName \
  --output tsv)

echo -e "${GREEN}✅ Database created${NC}"
echo -e "${YELLOW}📝 Database Password: ${DB_PASSWORD}${NC}"
echo -e "${YELLOW}📝 Save this password! Connection string:${NC}"
echo "postgresql://luxebellaadmin:${DB_PASSWORD}@${DB_HOST}:5432/luxe_bella?sslmode=require"
echo ""

# Step 3: Create App Service Plan
echo -e "${YELLOW}📋 Creating App Service Plan (Basic B1)...${NC}"
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux \
  --location $LOCATION || echo "App Service Plan may already exist"
echo -e "${GREEN}✅ App Service Plan created${NC}"
echo ""

# Step 4: Create Web App
echo -e "${YELLOW}🌐 Creating Web App...${NC}"
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $APP_NAME \
  --runtime "NODE|18-lts" || echo "Web App may already exist"

# Configure Node.js
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings WEBSITE_NODE_DEFAULT_VERSION="~18" || true

echo -e "${GREEN}✅ Web App created${NC}"
echo ""

# Step 5: Set Environment Variables
echo -e "${YELLOW}⚙️  Setting environment variables...${NC}"
APP_URL="https://${APP_NAME}.azurewebsites.net"
NEXTAUTH_SECRET=$(openssl rand -base64 32)

az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    DATABASE_URL="postgresql://luxebellaadmin:${DB_PASSWORD}@${DB_HOST}:5432/luxe_bella?sslmode=require" \
    NEXTAUTH_URL="${APP_URL}" \
    NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
    NODE_ENV="production" || true

echo -e "${GREEN}✅ Environment variables set${NC}"
echo -e "${YELLOW}📝 NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}${NC}"
echo ""

# Step 6: Build and Deploy
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build || {
    echo -e "${RED}❌ Build failed. Please check for errors.${NC}"
    exit 1
}

echo -e "${YELLOW}📦 Creating deployment package...${NC}"
zip -r deploy.zip . -x "*.git*" "node_modules/*" ".env*" "*.md" "*.sh" "*.zip" || {
    echo -e "${RED}❌ Failed to create deployment package${NC}"
    exit 1
}

echo -e "${YELLOW}🚀 Deploying to Azure...${NC}"
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src deploy.zip || {
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
}

# Clean up
rm -f deploy.zip

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Your app is live at:${NC}"
echo -e "${GREEN}   ${APP_URL}${NC}"
echo ""
echo -e "${YELLOW}📝 Important Information:${NC}"
echo "   Database Password: ${DB_PASSWORD}"
echo "   NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}"
echo "   Database Host: ${DB_HOST}"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "   1. Update OAuth redirect URIs:"
echo "      - Google: ${APP_URL}/api/auth/callback/google"
echo "      - Facebook: ${APP_URL}/api/auth/callback/facebook"
echo ""
echo "   2. Run database migrations:"
echo "      export DATABASE_URL=\"postgresql://luxebellaadmin:${DB_PASSWORD}@${DB_HOST}:5432/luxe_bella?sslmode=require\""
echo "      npx prisma migrate deploy"
echo ""
echo "   3. Add additional environment variables (OAuth, Stripe, etc.)"
echo "      az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings KEY=\"value\""
echo ""
echo -e "${GREEN}✨ Happy deploying!${NC}"

