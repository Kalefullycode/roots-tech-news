# Configure rootstechnews.com as Primary Domain

## Current Status
✅ Deployment successful at: `https://1e7da11c.roots-tech-news.pages.dev`  
✅ Custom domain alias: `rootstechnews.com`  
⚠️ Need to ensure all traffic goes directly to `rootstechnews.com`

## Step-by-Step: Make rootstechnews.com Primary

### Step 1: Configure Custom Domain in Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Go to: **Workers & Pages** → **Pages** → **roots-tech-news**

2. **Open Custom Domains Settings**
   - Click **Custom domains** tab (or go to Settings → Custom domains)
   - You should see `rootstechnews.com` listed

3. **Set as Primary Domain**
   - Find `rootstechnews.com` in the list
   - Click the **three dots (⋯)** menu next to it
   - Select **"Set as primary domain"** (if available)
   - Or ensure it's marked as **Primary**

4. **Add www Subdomain (Optional but Recommended)**
   - Click **"Set up a domain"** or **"Add custom domain"**
   - Enter: `www.rootstechnews.com`
   - This will create a redirect from www to root domain

### Step 2: Verify DNS Configuration

Ensure DNS records are correct in Cloudflare DNS:

1. **Go to DNS Settings**
   - In Cloudflare Dashboard, select **rootstechnews.com** (the domain, not Pages)
   - Click **DNS** → **Records**

2. **Check Root Domain (Apex) Record**
   ```
   Type: CNAME (or AAAA if using IPv6)
   Name: @
   Target: roots-tech-news.pages.dev
   Proxy: ON (orange cloud) ✅
   ```

3. **Check www Subdomain**
   ```
   Type: CNAME
   Name: www
   Target: roots-tech-news.pages.dev
   Proxy: ON (orange cloud) ✅
   ```

### Step 3: Configure Redirects (if needed)

If you want to force redirects from `.pages.dev` to custom domain, add to `_redirects`:

```
# Redirect .pages.dev to custom domain
https://*.pages.dev/* https://rootstechnews.com/:splat 301
https://roots-tech-news.pages.dev/* https://rootstechnews.com/:splat 301

# Redirect www to root
https://www.rootstechnews.com/* https://rootstechnews.com/:splat 301

# SPA Routing
/* /index.html 200
```

### Step 4: Update Environment Variables (if using domain-specific configs)

If your code checks the domain, ensure it recognizes `rootstechnews.com`:

- Check `functions/fetch-rss.ts` - already has `rootstechnews.com` ✅
- Check newsletter scripts - already configured ✅
- Check any hardcoded URLs - should use `rootstechnews.com` ✅

### Step 5: Verify SSL Certificate

1. **In Cloudflare Pages**
   - Go to **Custom domains** tab
   - Check that `rootstechnews.com` shows **"Active"** status
   - SSL certificate should be **"Valid"**

2. **If SSL is pending**
   - Wait 5-10 minutes for automatic SSL provisioning
   - Cloudflare automatically provisions SSL certificates

### Step 6: Test Domain Access

After configuration, test:

```bash
# Test root domain
curl -I https://rootstechnews.com

# Test www redirect
curl -I https://www.rootstechnews.com

# Should return 200 OK or 301 redirect
```

## Expected Results

After configuration:

✅ **Primary Access:** `https://rootstechnews.com` (main site)  
✅ **www Redirect:** `https://www.rootstechnews.com` → `https://rootstechnews.com`  
✅ **SSL:** Valid certificate for both domains  
✅ **Pages.dev:** Still works but redirects to custom domain (if configured)

## Troubleshooting

### If custom domain shows "Pending"
- Wait 5-10 minutes for DNS propagation
- Verify DNS records are correct
- Ensure Proxy is ON (orange cloud) in DNS settings

### If SSL certificate fails
- Check DNS records are correct
- Ensure domain is verified in Cloudflare
- Wait up to 24 hours for certificate provisioning

### If redirects don't work
- Check `_redirects` file is in `public/` folder
- Verify build includes `_redirects` in `dist/` folder
- Check Cloudflare Pages redirect rules (if using)

## Quick Checklist

- [ ] Custom domain `rootstechnews.com` added in Cloudflare Pages
- [ ] Set as primary domain (if option available)
- [ ] DNS CNAME record points to `roots-tech-news.pages.dev`
- [ ] Proxy is ON (orange cloud) in DNS
- [ ] SSL certificate is active/valid
- [ ] www subdomain configured (optional)
- [ ] Test access: `https://rootstechnews.com` works
- [ ] Test redirect: `https://www.rootstechnews.com` redirects (if configured)

## Current Configuration Status

Based on your deployment:
- ✅ Deployment successful
- ✅ Custom domain alias exists: `rootstechnews.com`
- ⚠️ Need to verify it's set as primary
- ⚠️ Need to ensure DNS is properly configured

**Next Step:** Go to Cloudflare Pages → Custom domains → Verify `rootstechnews.com` is active and set as primary.

