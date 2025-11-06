#!/bin/bash
# Minimal deployment - Only essential files

set -e

RESOURCE_GROUP="luxe-bella-rg"
APP_NAME="luxe-bella-app"

echo "🚀 Minimal Deployment to Azure"
echo "=============================="
echo ""

# Configure build
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    ENABLE_ORYX_BUILD=true \
  --output none

az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --startup-file "npm start" \
  --output none

echo "✅ Configured"

# Create minimal package
echo "📦 Creating minimal package..."
rm -f deploy-minimal.zip

zip -r deploy-minimal.zip \
  package.json \
  package-lock.json \
  next.config.js \
  tsconfig.json \
  postcss.config.js \
  tailwind.config.js \
  prisma/ \
  app/ \
  components/ \
  lib/ \
  public/ \
  -x "*.git*" "*.md" "*.sh" "*.zip" ".env*"

echo "✅ Package created ($(du -h deploy-minimal.zip | cut -f1))"
echo ""

# Deploy
echo "🚀 Deploying..."
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src-path deploy-minimal.zip \
  --type zip \
  --async false

echo ""
echo "✅ Deployment initiated!"
echo "🌐 Check: https://luxe-bella-app.azurewebsites.net"

