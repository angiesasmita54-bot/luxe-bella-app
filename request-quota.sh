#!/bin/bash
# Quick script to check quota and provide instructions

echo "🔍 Checking Azure Quota Status..."
echo ""

az vm list-usage --location eastus2 --output table 2>&1 | grep -i "app\|web\|compute" || echo "No quota information found"

echo ""
echo "📋 To request quota increase:"
echo "   1. Go to: https://portal.azure.com"
echo "   2. Navigate to: Subscriptions → Your Subscription → Usage + quotas"
echo "   3. Search for: 'App Service Plan'"
echo "   4. Click 'Request increase'"
echo "   5. Select: Free or Basic tier"
echo "   6. Region: East US 2"
echo "   7. Submit request"
echo ""
echo "⏱️  Approval usually takes 1-24 hours"
