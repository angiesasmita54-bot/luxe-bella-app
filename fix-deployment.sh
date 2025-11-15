#!/bin/bash
# Fix deployment - Ensure proper build and deployment

set -e

RESOURCE_GROUP="luxe-bella-rg"
APP_NAME="luxe-bella-app"

echo "🔧 Fixing Azure Deployment"
echo "=========================="
echo ""

# Step 1: Ensure build settings are correct
echo "⚙️  Configuring build settings..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    ENABLE_ORYX_BUILD=true \
    POST_BUILD_COMMAND="npm run build && npx prisma generate" \
    WEBSITE_NODE_DEFAULT_VERSION="~20" \
  --output none

# Step 2: Set startup command
echo "⚙️  Setting startup command..."
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --startup-file "npm start" \
  --output none

# Step 3: Ensure Prisma will generate
echo "⚙️  Adding Prisma build command..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    POST_BUILD_COMMAND="npm run build && npx prisma generate" \
  --output none

echo "✅ Configuration updated"
echo ""

# Step 4: Build locally first to test
echo "📦 Testing local build..."
if npm run build; then
    echo "✅ Local build successful"
else
    echo "❌ Local build failed - fix errors first"
    exit 1
fi

# Step 5: Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Ready to deploy!"
echo ""
echo "Now run: ./deploy-zip.sh"
echo ""
echo "Or Azure will build automatically when you deploy source code"



