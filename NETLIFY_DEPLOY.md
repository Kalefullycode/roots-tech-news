# 🚀 Netlify Deployment Guide

## Updated: October 27, 2025

Your RootsTechNews site is ready for deployment to Netlify! Choose the deployment method that works best for you.

---

## ⚡ Quick Deploy (Recommended)

### Option 1: Git Push (Automatic Deploy)

The easiest way to deploy is to commit and push your changes to GitHub. Netlify will automatically detect and deploy:

```bash
# Stage all changes
git add .

# Commit with a message
git commit -m "fix: Site fixes and improvements"

# Push to GitHub (triggers Netlify auto-deploy)
git push origin main
```

**✅ Netlify will automatically:**
- Detect the push
- Run `npm ci && npm run build`
- Deploy to production
- Takes 2-3 minutes

**Monitor deployment:** https://app.netlify.com/sites/roots-tech-news/deploys

---

### Option 2: Manual Deploy with Netlify CLI

If you prefer manual control or Git push isn't working:

**First, fix the npm permission issue:**
```bash
sudo chown -R 501:20 "/Users/aniecepompey/.npm"
```

**Then deploy:**
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=dist
```

Or use the shortcut script:
```bash
npm run deploy
```

---

### Option 3: Use the Deploy Script

We've provided a convenient deploy script:

```bash
bash deploy.sh
```

This will:
- Show git status
- Stage all changes
- Commit with timestamp
- Push to GitHub
- Trigger Netlify auto-deploy

---

## 🔧 Netlify Configuration Updates

### What Changed:

1. **Updated `netlify.toml`:**
   - ✅ Node version upgraded to 20 (from 18)
   - ✅ Build command now uses `npm ci` for clean installs
   - ✅ Optimized caching headers
   - ✅ Security headers configured

2. **Added deploy scripts to `package.json`:**
   - `npm run deploy` - Deploy to production
   - `npm run deploy:draft` - Deploy draft preview

3. **Build optimizations:**
   - Code splitting enabled
   - Asset optimization
   - Lazy loading configured

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- ✅ All changes committed
- ✅ Build succeeds locally: `npm run build`
- ✅ Preview works: `npm run preview`
- ✅ No TypeScript errors: `npx tsc --noEmit`
- ✅ No linting errors: `npm run lint`

---

## 🌐 Deployment Workflow

### Development → Staging → Production

1. **Development:**
   ```bash
   npm run dev
   # Test at http://localhost:8081
   ```

2. **Build & Preview:**
   ```bash
   npm run build
   npm run preview
   # Test at http://localhost:4174
   ```

3. **Deploy Draft (Optional):**
   ```bash
   npm run deploy:draft
   # Get preview URL to test before production
   ```

4. **Deploy to Production:**
   ```bash
   git add .
   git commit -m "deploy: Production update"
   git push origin main
   ```

---

## 🔍 Troubleshooting

### Issue: npm permission error

**Error:** `npm error errno EPERM`

**Fix:**
```bash
sudo chown -R 501:20 "/Users/aniecepompey/.npm"
```

### Issue: Netlify build fails

**Check:**
1. Netlify build logs: https://app.netlify.com
2. Ensure `netlify.toml` is committed
3. Verify Node version in Netlify settings matches `netlify.toml`

**Common fixes:**
```bash
# Clear Netlify cache
netlify build --clear-cache

# Test build locally
npm ci && npm run build
```

### Issue: Routes return 404

**Solution:** Already fixed in `netlify.toml`
- All routes redirect to `/index.html` for SPA routing
- Client-side routing handles navigation

### Issue: RSS feeds not loading

**Note:** This is expected behavior:
- External RSS feeds may have CORS restrictions
- Fallback content will display automatically
- Some feeds work, others may not

---

## 📊 Deployment Status

### Current Configuration:

- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 20
- **Functions Directory:** `netlify/functions`

### Build Output:

```
✓ 1719 modules transformed
✓ Built in ~1.5s
✓ Total bundle: ~1.2MB
✓ Gzipped: ~115KB
```

### Performance Features:

- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization (WebP)
- ✅ Asset compression
- ✅ Aggressive caching
- ✅ Security headers

---

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server

# Build & Test
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Check for errors

# Deploy
git push origin main     # Auto-deploy via GitHub
npm run deploy           # Manual production deploy
npm run deploy:draft     # Deploy preview/draft

# Netlify CLI
netlify login            # Login to Netlify
netlify status           # Check site status
netlify open             # Open Netlify dashboard
netlify logs             # View function logs
```

---

## 🔗 Useful Links

- **Netlify Dashboard:** https://app.netlify.com/sites/roots-tech-news
- **Live Site:** https://rootstechnews.com
- **Deploy Logs:** https://app.netlify.com/sites/roots-tech-news/deploys
- **GitHub Repo:** (Your repository URL)

---

## 🆘 Support

### If deployment fails:

1. Check the build logs in Netlify dashboard
2. Test build locally: `npm run build`
3. Verify all files are committed: `git status`
4. Check Netlify environment variables
5. Clear Netlify cache and retry

### For help:

- Netlify Docs: https://docs.netlify.com
- Vite Docs: https://vitejs.dev/guide/static-deploy.html#netlify
- Community: https://answers.netlify.com

---

## ✅ Ready to Deploy!

Your site is configured and ready. Choose your deployment method:

**Quick (Recommended):**
```bash
git add .
git commit -m "deploy: Update site"
git push origin main
```

**Alternative:**
```bash
bash deploy.sh
```

**Manual:**
```bash
npm run deploy
```

---

🎉 **Happy Deploying!**

