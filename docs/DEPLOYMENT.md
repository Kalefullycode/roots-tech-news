# 🚀 RootsTechNews Deployment Guide

## Quick Deploy

### Option 1: Use the Deploy Script (Easiest)
```bash
./deploy.sh
```

### Option 2: Manual Git Push
```bash
git add -A
git commit -m "Update site"
git push origin main
```

### Option 3: Netlify CLI Deploy
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

---

## 📋 Pre-Deployment Checklist

✅ **Local Testing**
```bash
npm run dev
# Open http://localhost:8080
# Verify all features work
```

✅ **Build Test**
```bash
npm run build
# Check for any build errors
```

✅ **Preview Build**
```bash
npm run build
npx vite preview
# Test production build locally
```

---

## 🔐 GitHub Authentication Setup

### Using Personal Access Token (Recommended)

1. **Generate Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control of private repositories)
   - Copy the token

2. **Use Token for Push**
   ```bash
   git push origin main
   # Username: Kalefullycode
   # Password: [paste your token]
   ```

3. **Cache Credentials (Optional)**
   ```bash
   git config credential.helper store
   # Next push will save credentials
   ```

### Using SSH Keys (Alternative)

1. **Generate SSH Key**
   ```bash
   ssh-keygen -t ed25519 -C "aniecemyri@gmail.com"
   ```

2. **Add to GitHub**
   - Copy key: `cat ~/.ssh/id_ed25519.pub`
   - Add at: https://github.com/settings/keys

3. **Update Remote**
   ```bash
   git remote set-url origin git@github.com:Kalefullycode/roots-tech-news.git
   ```

---

## 🌐 Netlify Deployment Process

### Automatic Deployment (Default)

When you push to `main` branch:

1. **GitHub** receives your push
2. **Netlify** detects the change via webhook
3. **Build** starts automatically
   - Runs: `npm run build`
   - Publishes: `dist/` directory
4. **Deploy** to https://rootstechnews.com
5. **Complete** in ~2-3 minutes

### Monitor Deployment

- **Dashboard**: https://app.netlify.com/sites/roots-tech-news/deploys
- **Build Logs**: Click on any deployment to see logs
- **Status**: 
  - 🟡 Building
  - 🟢 Published
  - 🔴 Failed

---

## 🔧 Troubleshooting

### Build Fails

1. **Check Build Logs**
   - Go to Netlify dashboard
   - Click on failed deployment
   - Review error messages

2. **Common Issues**
   ```bash
   # Memory issues
   # Solution: Add to netlify.toml:
   [build.environment]
   NODE_OPTIONS = "--max_old_space_size=4096"
   
   # Dependency issues
   npm install
   npm run build
   # Fix locally first
   ```

### Site Not Updating

1. **Clear Cache**
   - Netlify Dashboard → Deploys → Trigger Deploy → Clear cache and deploy

2. **Hard Refresh Browser**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

### 404 Errors on Refresh

Already fixed! `netlify.toml` has SPA redirects:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📊 Current Configuration

### Repository
- **GitHub**: https://github.com/Kalefullycode/roots-tech-news.git
- **Branch**: main
- **User**: Kalefullycode
- **Email**: aniecemyri@gmail.com

### Netlify
- **Site**: roots-tech-news
- **Domain**: https://rootstechnews.com
- **Build**: `npm run build`
- **Publish**: `dist/`
- **Node**: 18

### Features Deployed
✅ Real-time news ticker (25+ RSS feeds)
✅ YouTube videos (10+ channels)
✅ Podcasts (10+ shows)
✅ AI Tools directory (17+ tools)
✅ Books library (20+ books)
✅ Responsive design
✅ SEO optimized
✅ Performance optimized

---

## 🎯 Deploy Commands Reference

```bash
# Quick deploy
./deploy.sh

# Manual deploy
git add -A
git commit -m "Update: description"
git push origin main

# Build locally
npm run build

# Test build
npm run preview

# Deploy via CLI (if push fails)
npx netlify-cli deploy --prod --dir=dist

# Check deployment status
curl -I https://rootstechnews.com

# View build logs
npx netlify-cli open:site
```

---

## 🚨 Emergency Rollback

If deployment breaks the site:

1. **Via Netlify Dashboard**
   - Go to: Deploys
   - Find last working deployment
   - Click "Publish deploy"

2. **Via Git**
   ```bash
   # Revert last commit
   git revert HEAD
   git push origin main
   ```

---

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com
- **GitHub Issues**: https://github.com/Kalefullycode/roots-tech-news/issues
- **Build Logs**: https://app.netlify.com/sites/roots-tech-news/deploys

---

**Last Updated**: October 25, 2025
**Site Status**: ✅ Ready to Deploy

