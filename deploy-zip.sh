#!/bin/bash
# Zip Deploy Script for Luxe Bella App - Faster than FTPS

set -e

RESOURCE_GROUP="luxe-bella-rg"
APP_NAME="luxe-bella-app"

echo "🚀 Zip Deploy to Azure"
echo "======================"
echo ""

echo "📦 Building application first..."
npm run build

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "📦 Creating deployment package..."
# For standalone output, we need to deploy the built files
rm -f deploy-azure.zip

if [ -d ".next/standalone" ]; then
    echo "Using standalone build..."
    # Deploy standalone build (includes everything needed)
    cd .next/standalone
    zip -r ../../deploy-azure.zip . \
      -x "*.git*" "node_modules/.cache/*" 2>&1 | tail -5
    cd ../..
    
    # Also include static files
    if [ -d ".next/static" ]; then
        cd .next
        zip -r ../deploy-azure.zip static/ 2>&1 | tail -3
        cd ..
    fi
else
    echo "Standalone build not found, deploying source for Azure to build..."
    # Deploy source files (Azure will build)
    zip -r deploy-azure.zip . \
      -x "*.git*" \
      -x "node_modules/*" \
      -x ".next/*" \
      -x "*.md" \
      -x "*.sh" \
      -x "*.zip" \
      -x ".env*" \
      -x ".deployment-trigger" \
      -x "deploy*.zip" \
      -x "*.bak" \
      -x "*.bak2" 2>&1 | tail -5
fi

if [ ! -f "deploy-azure.zip" ]; then
  echo "❌ Failed to create deployment package"
  exit 1
fi

echo "✅ Package created ($(du -h deploy-azure.zip | cut -f1))"
echo ""

echo "🚀 Deploying to Azure..."
az webapp deploy \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src-path deploy-azure.zip \
  --type zip \
  --async false

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app: https://luxe-bella-app.azurewebsites.net"
echo ""
echo "💡 Azure will automatically:"
echo "   - Install dependencies (npm install)"
echo "   - Build the app (npm run build)"
echo "   - Start the server (npm start)"
echo ""
echo "⏱️  This may take 5-10 minutes for the first build"

