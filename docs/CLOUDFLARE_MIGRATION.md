# 🚀 Cloudflare Pages Migration Guide

Complete guide to migrating RootsTechNews from Netlify to Cloudflare Pages.

---

## 📋 **PRE-MIGRATION CHECKLIST**

- [x] Repository cleaned and organized
- [x] Cloudflare Functions created (`/functions/`)
- [x] Configuration files added (`wrangler.toml`, `_headers`, `_redirects`)
- [ ] Cloudflare account created
- [ ] GitHub repository connected to Cloudflare
- [ ] Environment variables configured
- [ ] DNS configured (if using custom domain)

---

## 🆕 **WHAT'S CHANGED**

### **File Structure**
```diff
roots-tech-news/
├── netlify/              ❌ OLD (Netlify-specific)
│   └── functions/
+├── functions/            ✅ NEW (Cloudflare Pages Functions)
│   ├── fetch-rss.ts
│   └── subscribe.ts
+├── _headers             ✅ NEW (Cloudflare format)
+├── _redirects           ✅ NEW (Cloudflare format)
+├── wrangler.toml        ✅ NEW (Cloudflare config)
├── netlify.toml          ⚠️  KEEP (for Netlify compatibility)
```

### **Function Syntax**
```typescript
// ❌ OLD (Netlify)
import { Handler } from '@netlify/functions';
export const handler: Handler = async (event) => {
  return { statusCode: 200, headers, body };
};

// ✅ NEW (Cloudflare)
export async function onRequestGet(context) {
  return new Response(JSON.stringify(data), { status: 200, headers });
}
```

### **Environment Variables**
```bash
# ❌ OLD (Netlify)
process.env.RESEND_API_KEY

# ✅ NEW (Cloudflare)
context.env.RESEND_API_KEY
```

---

## 🔧 **STEP-BY-STEP MIGRATION**

### **STEP 1: Update Package.json**

Add Cloudflare deployment scripts:

```bash
npm install --save-dev wrangler
```

Update `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy:netlify": "npm run build && npx netlify-cli deploy --prod",
    "deploy:cloudflare": "npm run build && npx wrangler pages deploy dist --project-name=roots-tech-news",
    "cf:dev": "wrangler pages dev dist"
  }
}
```

---

### **STEP 2: Create Cloudflare Account**

1. Visit: https://dash.cloudflare.com/sign-up
2. Verify your email
3. Go to "Workers & Pages"
4. Click "Create application"
5. Select "Pages" tab
6. Click "Connect to Git"

---

### **STEP 3: Connect GitHub Repository**

1. **Authorize Cloudflare** to access your GitHub
2. **Select repository:** `Kalefullycode/roots-tech-news`
3. **Configure build settings:**
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```

4. **Environment variables:** (Add these)
   ```
   RESEND_API_KEY = your_resend_api_key_here
   NODE_VERSION = 20
   ```

5. **Click "Save and Deploy"**

---

### **STEP 4: Copy `_headers` and `_redirects` to Public**

These files need to be in the build output:

```bash
# Run this command:
cp _headers public/_headers
cp _redirects public/_redirects
```

Or add this to your build process in `package.json`:
```json
{
  "scripts": {
    "prebuild": "cp _headers public/_headers && cp _redirects public/_redirects",
    "build": "vite build"
  }
}
```

---

### **STEP 5: Configure Custom Domain (Optional)**

If using `rootstechnews.com`:

1. **In Cloudflare Pages:**
   - Go to your project
   - Click "Custom domains"
   - Click "Set up a domain"
   - Enter: `rootstechnews.com`
   - Add DNS records as instructed

2. **DNS Configuration:**
   ```
   Type: CNAME
   Name: @
   Target: roots-tech-news.pages.dev
   Proxy: ON (orange cloud)
   ```

3. **Add www subdomain:**
   ```
   Type: CNAME
   Name: www
   Target: roots-tech-news.pages.dev
   Proxy: ON (orange cloud)
   ```

---

### **STEP 6: Test Functions Locally**

Before deploying, test functions locally:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the site
npm run build

# Run local development server with Functions
wrangler pages dev dist

# Test in browser:
# http://localhost:8788
# http://localhost:8788/functions/fetch-rss
# http://localhost:8788/functions/subscribe
```

---

### **STEP 7: Deploy to Cloudflare**

**Option 1: Automatic (GitHub Push)**
```bash
git add .
git commit -m "feat: migrate to Cloudflare Pages"
git push origin main
```
Cloudflare will automatically detect and deploy!

**Option 2: Manual (CLI)**
```bash
npm run build
npx wrangler pages deploy dist --project-name=roots-tech-news
```

---

### **STEP 8: Update Frontend API Endpoints**

Your frontend should work without changes! The API endpoints remain the same:
```
/functions/fetch-rss  ✅ (was /.netlify/functions/fetch-rss)
/functions/subscribe  ✅ (was /.netlify/functions/subscribe)
```

If you need to update, check these files:
- `src/components/MainFeed.tsx`
- `src/components/Sidebar.tsx`
- `src/hooks/useNews.ts`

---

### **STEP 9: Verify Deployment**

After deployment (5-10 minutes):

**1. Check Cloudflare Dashboard:**
- Visit: https://dash.cloudflare.com
- Go to "Workers & Pages"
- Click your project
- Verify "Published" status

**2. Test Live Site:**
```bash
# Visit your Cloudflare URL
https://roots-tech-news.pages.dev

# Or custom domain
https://rootstechnews.com
```

**3. Test Functions:**
```bash
# RSS Feed
curl https://roots-tech-news.pages.dev/functions/fetch-rss

# Should return JSON with articles
```

**4. Browser Tests:**
- [ ] Site loads correctly
- [ ] News feed displays articles
- [ ] Newsletter signup works
- [ ] No console errors (F12)
- [ ] All navigation works
- [ ] Search functions properly

---

## 🔄 **ROLLBACK PLAN**

If migration fails, Netlify is still live:

1. **Keep Netlify active** until Cloudflare is verified
2. **Test Cloudflare** on `*.pages.dev` subdomain first
3. **Switch DNS** only after full testing
4. **Rollback:** Just point DNS back to Netlify

---

## 📊 **CLOUDFLARE VS NETLIFY**

| Feature | Netlify | Cloudflare Pages |
|---------|---------|------------------|
| **Free Tier** | 100GB bandwidth | Unlimited bandwidth ✅ |
| **Build Minutes** | 300/month | 500/month ✅ |
| **Functions** | 125K requests | Unlimited ✅ |
| **CDN** | Good | Excellent ✅ |
| **DDoS Protection** | Basic | Advanced ✅ |
| **Analytics** | Add-on | Built-in ✅ |
| **Custom Domains** | 1 free | Unlimited ✅ |
| **SSL** | Automatic | Automatic ✅ |
| **Edge Locations** | ~46 | ~300 ✅ |

**Winner:** Cloudflare Pages 🏆

---

## 🚨 **TROUBLESHOOTING**

### **Build Fails**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Functions Not Working**
1. Check environment variables in Cloudflare dashboard
2. Verify function names match (`fetch-rss.ts`, not `fetch-rss.js`)
3. Check function logs in Cloudflare dashboard

### **CORS Errors**
- Functions already have CORS headers configured
- If issues persist, check `_headers` file is in `public/`

### **404 on Routes**
- Verify `_redirects` file is in `public/`
- Check SPA redirect is configured: `/* /index.html 200`

---

## ✅ **POST-MIGRATION CHECKLIST**

After successful migration:

- [ ] Site loads on Cloudflare URL
- [ ] All pages accessible (routing works)
- [ ] RSS feed loads articles
- [ ] Newsletter signup works
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics connected
- [ ] Netlify deployment paused (optional)
- [ ] DNS updated to Cloudflare (if using custom domain)
- [ ] Team notified of new deployment URL

---

## 📈 **PERFORMANCE BENEFITS**

After migrating to Cloudflare Pages:

✅ **Faster Load Times** - 300+ edge locations  
✅ **Unlimited Bandwidth** - No overage charges  
✅ **Better DDoS Protection** - Enterprise-grade security  
✅ **Free Analytics** - Built-in Web Analytics  
✅ **Faster Builds** - Optimized build infrastructure  
✅ **Better Caching** - Intelligent edge caching  

---

## 🎯 **NEXT STEPS**

1. **Monitor Performance:**
   - Enable Cloudflare Web Analytics
   - Check Core Web Vitals
   - Monitor function execution times

2. **Optimize Further:**
   - Enable Cloudflare Images (automatic optimization)
   - Set up Cloudflare Workers for advanced features
   - Configure automatic deployments for branches

3. **Scale:**
   - Add more RSS sources
   - Implement caching strategies
   - Add rate limiting to functions

---

## 📞 **SUPPORT**

**Cloudflare Docs:** https://developers.cloudflare.com/pages/  
**Cloudflare Community:** https://community.cloudflare.com/  
**Project Issues:** https://github.com/Kalefullycode/roots-tech-news/issues  

---

**Migration created:** October 27, 2025  
**Status:** Ready for deployment 🚀

