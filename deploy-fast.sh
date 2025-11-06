#!/bin/bash
# Fast deployment script - Deploys source code and lets Azure build it

set -e

RESOURCE_GROUP="luxe-bella-rg"
APP_NAME="luxe-bella-app"

echo "🚀 Fast Deployment to Azure"
echo "============================"
echo ""

# Configure Azure to build automatically
echo "⚙️  Configuring build settings..."
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

echo "✅ Build settings configured"
echo ""

# Create source zip (without node_modules and .next - Azure will build)
echo "📦 Creating source package..."
zip -r deploy-source.zip . \
  -x "*.git*" \
  -x "node_modules/*" \
  -x ".next/*" \
  -x "*.md" \
  -x "*.sh" \
  -x "*.zip" \
  -x ".env*" \
  -x ".next/cache/*" \
  -x "deploy*.zip" 2>&1 | tail -3

echo "✅ Package created"
echo ""

# Deploy
echo "🚀 Deploying to Azure (this may take 5-10 minutes for first build)..."
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src-path deploy-source.zip \
  --type zip \
  --async false

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app: https://luxe-bella-app.azurewebsites.net"
echo ""
echo "💡 Note: First build takes time, but Azure handles everything automatically"

