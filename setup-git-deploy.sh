#!/bin/bash
# Quick setup script for Local Git deployment to Azure

set -e

echo "🚀 Setting up Local Git deployment for Azure"
echo "============================================"
echo ""

RESOURCE_GROUP="luxe-bella-rg"
APP_NAME="luxe-bella-app"

# Get Git deployment URL
echo "📡 Getting Azure Git deployment URL..."
GIT_URL=$(az webapp deployment source config-local-git \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --query url \
  --output tsv)

if [ -z "$GIT_URL" ]; then
  echo "❌ Failed to get Git URL"
  exit 1
fi

echo "✅ Git URL: $GIT_URL"
echo ""

# Check if .git exists
if [ ! -d ".git" ]; then
  echo "📦 Initializing Git repository..."
  git init
  git add .
  git commit -m "Initial commit"
  echo "✅ Git repository initialized"
  echo ""
fi

# Check if azure remote exists
if git remote | grep -q "^azure$"; then
  echo "🔄 Updating existing Azure remote..."
  git remote set-url azure $GIT_URL
else
  echo "➕ Adding Azure remote..."
  git remote add azure $GIT_URL
fi

echo "✅ Azure remote configured"
echo ""

# Configure Azure to build automatically
echo "⚙️  Configuring Azure build settings..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    ENABLE_ORYX_BUILD=true \
    POST_BUILD_COMMAND="npm run build" \
  --output none

# Set startup command
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --startup-file "npm start" \
  --output none

echo "✅ Build settings configured"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo ""
echo "📝 To deploy, run:"
echo ""
echo "   npm run build"
echo "   git add ."
echo "   git commit -m 'Deploy to Azure'"
echo "   git push azure main"
echo ""
echo "💡 Note: Azure will build automatically on push"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

