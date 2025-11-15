#!/bin/bash
# FTPS Deployment Script for Luxe Bella App

set -e

FTP_HOST="waws-prod-mwh-105.ftp.azurewebsites.windows.net"
FTP_USER="luxe-bella-app\\\$luxe-bella-app"
FTP_PASS="S8sEfb2SedkBw33u6zatCiD0Z15wtv7B6Rlvcbnm1omhvZrWXjHYyHPFro30"
FTP_PATH="/site/wwwroot"

echo "🚀 FTPS Deployment to Azure"
echo "==========================="
echo ""

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "⚠️  lftp not found. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install lftp
    else
        echo "❌ Please install lftp manually: brew install lftp"
        exit 1
    fi
fi

echo "📤 Uploading source files via FTPS..."
echo "Azure will build automatically after upload"
echo "This may take a few minutes..."
echo ""

# Create a temporary script for lftp
cat > /tmp/ftps_upload.lftp << EOF
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ssl:verify-certificate false
open -u ${FTP_USER},${FTP_PASS} ftps://${FTP_HOST}
cd ${FTP_PATH}
mirror -R --delete --verbose \
  --exclude-glob=.git* \
  --exclude-glob=node_modules/* \
  --exclude-glob=.next/* \
  --exclude-glob=*.md \
  --exclude-glob=*.sh \
  --exclude-glob=*.zip \
  --exclude-glob=.env* \
  --exclude-glob=.deployment-trigger \
  . ${FTP_PATH}
quit
EOF

lftp -f /tmp/ftps_upload.lftp

rm /tmp/ftps_upload.lftp

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app: https://luxe-bella-app.azurewebsites.net"
echo ""
echo "💡 Note: It may take a minute for changes to take effect"

