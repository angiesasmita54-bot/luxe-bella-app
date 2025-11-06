# 🌐 Custom Domain Setup for somosluxebella.com

This guide will help you configure your custom domain `https://somosluxebella.com/` to point to your Azure App Service.

## ✅ Prerequisites

1. **Azure App Service deployed** (you're working on this now)
2. **Domain ownership** - You own `somosluxebella.com`
3. **Access to DNS provider** - Where your domain is registered (GoDaddy, Namecheap, etc.)

---

## 📋 Step-by-Step Setup

### Step 1: Verify Domain Ownership in Azure

After your App Service is deployed, you'll need to verify the domain:

```bash
# Get your app service name (replace with your actual app name if different)
APP_NAME="luxe-bella-app"
RESOURCE_GROUP="luxe-bella-rg"

# Add custom domain to App Service
az webapp config hostname add \
  --webapp-name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname somosluxebella.com

# Add www subdomain too
az webapp config hostname add \
  --webapp-name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname www.somosluxebella.com
```

### Step 2: Get DNS Configuration from Azure

Azure will provide you with DNS records to add. Get them with:

```bash
# Get the verification ID and IP addresses
az webapp config hostname list \
  --webapp-name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --output table

# Get the custom domain verification ID
az webapp config hostname get-external-ip \
  --webapp-name $APP_NAME \
  --resource-group $RESOURCE_GROUP
```

### Step 3: Configure DNS Records

Add these DNS records in your domain provider (GoDaddy, Namecheap, Cloudflare, etc.):

#### Option A: Using CNAME (Recommended for App Service)

1. **For the root domain (`somosluxebella.com`):**
   - Type: `CNAME`
   - Name: `@` (or leave blank, depends on provider)
   - Value: `luxe-bella-app.azurewebsites.net`
   - TTL: 3600 (or default)

2. **For www subdomain:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `luxe-bella-app.azurewebsites.net`
   - TTL: 3600

#### Option B: Using A Record (Alternative)

If your DNS provider doesn't support CNAME for root domain:

1. **Get the IP address:**
   ```bash
   az webapp config hostname get-external-ip \
     --webapp-name $APP_NAME \
     --resource-group $RESOURCE_GROUP
   ```

2. **Add A record:**
   - Type: `A`
   - Name: `@`
   - Value: `<IP_ADDRESS_FROM_AZURE>`
   - TTL: 3600

3. **Still add CNAME for www:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `luxe-bella-app.azurewebsites.net`

### Step 4: Enable HTTPS (SSL Certificate)

Azure provides free SSL certificates for App Service:

```bash
# Enable HTTPS only
az webapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --https-only true

# Request free SSL certificate (Managed Certificate)
az webapp config ssl create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname somosluxebella.com \
  --certificate-name somosluxebella-ssl

# Or use App Service Managed Certificate (Free)
az webapp config hostname add \
  --webapp-name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname somosluxebella.com

# Bind the certificate
az webapp config ssl bind \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --certificate-name somosluxebella-ssl \
  --ssl-type SNI
```

**Note:** Free SSL certificates are managed by Azure and automatically renew. For production, you might want to use:
- **App Service Managed Certificate** (Free, auto-renewing)
- **Azure Key Vault Certificate** (More control)
- **Bring Your Own Certificate** (BYOC)

### Step 5: Update App Service Configuration

Update your App Service settings to use the custom domain:

```bash
# Set the default hostname
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    NEXTAUTH_URL="https://somosluxebella.com" \
    NEXT_PUBLIC_APP_URL="https://somosluxebella.com"
```

### Step 6: Update OAuth Redirect URIs

**IMPORTANT:** Update your OAuth providers with the new domain:

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client
4. Add to **Authorized redirect URIs:**
   - `https://somosluxebella.com/api/auth/callback/google`
   - `https://www.somosluxebella.com/api/auth/callback/google`

#### Facebook OAuth:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Go to Settings → Basic
4. Add to **Valid OAuth Redirect URIs:**
   - `https://somosluxebella.com/api/auth/callback/facebook`
   - `https://www.somosluxebella.com/api/auth/callback/facebook`

### Step 7: Update Environment Variables in Azure

```bash
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    NEXTAUTH_URL="https://somosluxebella.com" \
    NEXT_PUBLIC_APP_URL="https://somosluxebella.com" \
    GOOGLE_CLIENT_ID="your-google-client-id" \
    GOOGLE_CLIENT_SECRET="your-google-client-secret" \
    FACEBOOK_CLIENT_ID="your-facebook-app-id" \
    FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

---

## 🔍 Verify Domain Configuration

### Check DNS Propagation

```bash
# Check if DNS is resolving
nslookup somosluxebella.com
dig somosluxebella.com

# Check from Azure
az webapp config hostname list \
  --webapp-name $APP_NAME \
  --resource-group $RESOURCE_GROUP
```

### Test Your Domain

1. Wait 5-10 minutes for DNS propagation
2. Visit `https://somosluxebella.com`
3. Check SSL certificate is valid (green lock icon)
4. Test OAuth login to ensure redirects work

---

## 🚨 Common Issues & Solutions

### Issue: "Domain verification failed"
**Solution:** 
- Ensure DNS records are correctly configured
- Wait 24-48 hours for DNS propagation
- Check that CNAME/A records point to correct Azure endpoint

### Issue: "SSL certificate not binding"
**Solution:**
- Use App Service Managed Certificate (free, auto-renewing)
- Ensure domain is verified first
- Check that HTTPS only is enabled

### Issue: "OAuth redirect URI mismatch"
**Solution:**
- Update OAuth provider settings with exact URLs
- Include both `www` and non-`www` versions
- Clear browser cache and cookies

### Issue: "Domain not resolving"
**Solution:**
- Check DNS propagation: `dig somosluxebella.com`
- Verify DNS records are correct
- Wait up to 48 hours for global DNS propagation

---

## 📝 Quick Reference Commands

```bash
# Variables
APP_NAME="luxe-bella-app"
RESOURCE_GROUP="luxe-bella-rg"
DOMAIN="somosluxebella.com"

# Add domain
az webapp config hostname add \
  --webapp-name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname $DOMAIN

# List configured domains
az webapp config hostname list \
  --webapp-name $APP_NAME \
  --resource-group $RESOURCE_GROUP

# Enable HTTPS only
az webapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --https-only true

# Update NEXTAUTH_URL
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings NEXTAUTH_URL="https://$DOMAIN"
```

---

## ✅ Checklist

- [ ] Domain added to Azure App Service
- [ ] DNS records configured (CNAME or A record)
- [ ] DNS propagation verified (can take 24-48 hours)
- [ ] SSL certificate installed (free managed certificate)
- [ ] HTTPS-only enabled
- [ ] NEXTAUTH_URL updated in App Service settings
- [ ] OAuth redirect URIs updated (Google & Facebook)
- [ ] Test login with custom domain
- [ ] Test OAuth login (Google & Facebook)
- [ ] Verify all pages load correctly

---

## 🎯 Next Steps After Domain Setup

1. **Redirect www to non-www** (or vice versa) - Configure in Azure Portal
2. **Set up monitoring** - Monitor domain health and SSL certificate
3. **Configure CDN** (optional) - For faster global performance
4. **Update all references** - Update any hardcoded URLs in your code
5. **Test thoroughly** - Test all features with the new domain

---

**Need help?** Check Azure documentation: https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain

