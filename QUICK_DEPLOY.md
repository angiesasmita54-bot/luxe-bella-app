# ⚡ Quick Deployment Options

## Option 1: Azure Portal (Easiest - No CLI)

**Fastest way if you don't want to use command line:**

1. Go to: https://portal.azure.com
2. Navigate to: **luxe-bella-app** → **Deployment Center**
3. Click **"Local Git"** or **"GitHub"**
4. Follow the wizard
5. Azure will provide Git commands or connect to GitHub

**Time:** ~5 minutes setup, then instant deployments

---

## Option 2: Fast Source Deploy (Let Azure Build)

**Deploy source code and let Azure build it automatically:**

```bash
./deploy-fast.sh
```

This:
- Creates a source package (no node_modules, no .next)
- Uploads to Azure
- Azure automatically installs dependencies and builds
- Takes 5-10 minutes for first build, but handles everything

**Time:** 5-10 minutes (first time), 2-3 minutes (subsequent)

---

## Option 3: GitHub Actions (Best for Production)

If your code is on GitHub:

1. Push code to GitHub
2. Azure Portal → **Deployment Center** → **GitHub**
3. Authorize and select repository
4. Auto-deploys on every push!

**Time:** Setup once, then automatic

---

## Option 4: Azure CLI Quick Deploy (Current Method)

**Simplified version:**

```bash
# Build locally
npm run build

# Create minimal package (just what's needed)
zip -r deploy-minimal.zip .next package.json package-lock.json \
  -x "*.git*" "node_modules/*" "*.md" "*.sh" "*.zip"

# Deploy
az webapp deploy \
  --resource-group luxe-bella-rg \
  --name luxe-bella-app \
  --src-path deploy-minimal.zip \
  --type zip
```

**Time:** 2-5 minutes

---

## 🎯 My Recommendation

**For fastest deployment right now:**

1. **Use Azure Portal Deployment Center** (easiest)
   - Go to portal.azure.com
   - Navigate to your app → Deployment Center
   - Choose Local Git or GitHub
   - Follow wizard

2. **Or use the fast source deploy script:**
   ```bash
   ./deploy-fast.sh
   ```

Both are much faster than the current ZIP method!

