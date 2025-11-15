# 📤 FTPS Deployment Guide

FTPS deployment is an alternative when Git deployment has issues.

## 🚀 Quick Deploy

```bash
./deploy-ftps.sh
```

## 📋 Manual FTPS Upload

### Using lftp (Recommended)

1. **Install lftp:**
   ```bash
   brew install lftp
   ```

2. **Upload files:**
   ```bash
   lftp -u "luxe-bella-app\\\$luxe-bella-app,S8sEfb2SedkBw33u6zatCiD0Z15wtv7B6Rlvcbnm1omhvZrWXjHYyHPFro30" \
     ftps://waws-prod-mwh-105.ftp.azurewebsites.windows.net
   
   # In lftp prompt:
   cd /site/wwwroot
   mirror -R --delete --exclude-glob=.git* --exclude-glob=node_modules/* .
   quit
   ```

### Using FileZilla (GUI)

1. **Download FileZilla:** https://filezilla-project.org/

2. **Connect:**
   - **Host:** `waws-prod-mwh-105.ftp.azurewebsites.windows.net`
   - **Protocol:** FTPS - File Transfer Protocol over SSL/TLS
   - **Username:** `luxe-bella-app\$luxe-bella-app`
   - **Password:** `S8sEfb2SedkBw33u6zatCiD0Z15wtv7B6Rlvcbnm1omhvZrWXjHYyHPFro30`
   - **Port:** 21

3. **Navigate to:** `/site/wwwroot`

4. **Upload files** (but NOT node_modules, .git, .env files)

### Using curl (Simple Upload)

```bash
# Upload specific files
curl --ftp-ssl -u "luxe-bella-app\\\$luxe-bella-app:S8sEfb2SedkBw33u6zatCiD0Z15wtv7B6Rlvcbnm1omhvZrWXjHYyHPFro30" \
  --ftp-ssl-reqd \
  -T package.json \
  ftps://waws-prod-mwh-105.ftp.azurewebsites.windows.net/site/wwwroot/package.json
```

## ⚠️ Important Notes

1. **Build first:** Always run `npm run build` before uploading
2. **Don't upload:**
   - `node_modules/` (Azure will install)
   - `.git/` folder
   - `.env` files (use Azure App Settings instead)
   - `.next/cache/`

3. **Must upload:**
   - `package.json` and `package-lock.json`
   - `.next/` folder (built files)
   - `app/`, `components/`, `lib/` folders
   - `next.config.js`, `tsconfig.json`
   - All source files

## 🔧 After FTPS Upload

1. **Azure will need to:**
   - Install dependencies (`npm install`)
   - Restart the app

2. **Check logs:**
   - Azure Portal → luxe-bella-app → Log stream
   - Or: https://luxe-bella-app.scm.azurewebsites.net/api/logs

3. **Restart app if needed:**
   ```bash
   az webapp restart --resource-group luxe-bella-rg --name luxe-bella-app
   ```

## 🎯 Recommended: Use the Script

The `deploy-ftps.sh` script handles everything:
- Builds the app
- Uploads only necessary files
- Excludes unnecessary files

Just run:
```bash
./deploy-ftps.sh
```

