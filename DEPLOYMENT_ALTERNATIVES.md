# 🚀 Faster Deployment Alternatives

The ZIP deployment can be slow. Here are faster alternatives:

## Option 1: Local Git Deployment (Fastest - Recommended)

Azure creates a Git repository for your app. Just push to it!

### Steps:

```bash
# 1. Install Git if not already installed
# (Usually pre-installed on Mac)

# 2. Get deployment credentials
az webapp deployment list-publishing-profiles \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --xml

# 3. Add Azure as a remote (you'll get a Git URL)
az webapp deployment source config-local-git \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app

# 4. Build your app locally
npm run build

# 5. Commit and push (Azure will auto-deploy)
git add .
git commit -m "Deploy to Azure"
git push azure main
```

**Pros:** Fast, automatic builds, easy updates  
**Cons:** Requires Git setup

---

## Option 2: Azure Portal Deployment Center (Easiest GUI)

### Steps:

1. Go to: https://portal.azure.com
2. Navigate to: **luxe-bella-app** → **Deployment Center**
3. Choose: **Local Git** or **External Git**
4. Follow the wizard
5. Azure will provide Git commands

**Pros:** Visual, no CLI needed  
**Cons:** Still uses Git under the hood

---

## Option 3: GitHub Actions (Best for CI/CD)

If you have your code on GitHub:

### Steps:

1. Push code to GitHub
2. Go to Azure Portal → **luxe-bella-app** → **Deployment Center**
3. Select **GitHub**
4. Authorize and select repository
5. Azure auto-deploys on every push!

**Pros:** Automatic, professional, tracks deployments  
**Cons:** Requires GitHub account

---

## Option 4: FTP Deployment (Quick for small changes)

For quick file updates:

```bash
# Get FTP credentials
az webapp deployment list-publishing-profiles \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --query "[?publishMethod=='FTP']" \
  --output table

# Then use FTP client or command line
# Upload .next folder and package.json
```

**Pros:** Fast for small changes  
**Cons:** Manual, doesn't rebuild

---

## Option 5: Azure CLI with Oryx Build (Recommended for Now)

Let Azure build it automatically:

```bash
# Enable build during deployment
az webapp config appsettings set \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --settings \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    ENABLE_ORYX_BUILD=true

# Deploy source code (not built code)
# Create a .deployment file
cat > .deployment << 'EOF'
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
EOF

# Create source zip (without node_modules or .next)
zip -r deploy-source.zip . \
  -x "*.git*" "node_modules/*" ".next/*" "*.md" "*.sh" "*.zip" ".env*"

# Deploy source - Azure will build it
az webapp deploy \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --src-path deploy-source.zip \
  --type zip
```

**Pros:** Azure builds automatically, handles dependencies  
**Cons:** First build takes time, but subsequent deploys are faster

---

## Option 6: Manual Package.json Deploy

Deploy just source and let Azure install dependencies:

```bash
# Create minimal package
zip -r deploy-minimal.zip . \
  -x "*.git*" "node_modules/*" ".next/*" "*.md" "*.sh" "*.zip" ".env*" \
  --include "package*.json" "next.config.js" "tsconfig.json" \
  --include "app/**" "components/**" "lib/**" "prisma/**" "public/**"

# Configure Azure to build
az webapp config set \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --startup-file "npm start"

az webapp deploy \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --src-path deploy-minimal.zip \
  --type zip
```

---

## 🎯 My Recommendation: Local Git (Fastest)

This is the fastest and most reliable method:

```bash
# Quick setup script
./setup-git-deploy.sh
```

Then every deployment is just:
```bash
npm run build
git add .
git commit -m "Update"
git push azure main
```

---

## 📊 Comparison

| Method | Speed | Complexity | Best For |
|--------|-------|------------|----------|
| Local Git | ⚡⚡⚡ Fast | Easy | Regular updates |
| GitHub Actions | ⚡⚡⚡ Fast | Medium | CI/CD workflow |
| Azure Portal | ⚡⚡ Medium | Easy | One-time setup |
| Source Deploy | ⚡⚡ Medium | Easy | Let Azure build |
| ZIP Deploy | ⚡ Slow | Easy | Small files |
| FTP | ⚡⚡⚡ Fast | Hard | Quick fixes |

---

## 🚀 Quick Start: Local Git (Recommended)

Would you like me to set this up for you? It's the fastest option!

