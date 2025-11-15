# 🚨 URGENT: Fix Cloudflare Pages Build - Step-by-Step Instructions

## Problem
Build is failing with: `Cannot find module '@rollup/rollup-linux-x64-gnu'`

## Solution
Update the build command in Cloudflare Pages to use `npm install` instead of `npm ci`.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Cloudflare Dashboard
1. Go to: **https://dash.cloudflare.com**
2. Log in to your account
3. Navigate to: **Workers & Pages** → **Pages**

### Step 2: Select Your Project
1. Find and click on: **roots-tech-news**
2. You'll see the project dashboard with deployments

### Step 3: Go to Settings
1. Click on **Settings** tab (top navigation)
2. In the left sidebar, click **Builds & deployments**

### Step 4: Update Build Command
1. Scroll down to **Build configuration** section
2. Find the **Build command** field
3. **Delete** the current command (if it says `npm ci && npm run build`)
4. **Type** this new command:
   ```
   npm install && npm run build
   ```
5. **Verify** the **Build output directory** is set to: `dist`

### Step 5: Save Changes
1. Scroll to the bottom of the page
2. Click **Save** button
3. Wait for confirmation message

### Step 6: Trigger New Build
1. Go to **Deployments** tab (top navigation)
2. Find the latest failed build
3. Click the **three dots (⋯)** menu on the right
4. Click **Retry deployment**
5. Or wait for automatic rebuild (if auto-deploy is enabled)

### Step 7: Monitor Build
1. Click on the deployment to see build logs
2. Watch for:
   - ✅ `npm install` running successfully
   - ✅ `npm run build` starting
   - ✅ Build completing without errors
   - ✅ Deployment succeeding

---

## ✅ What Should Happen

### Before (Failing):
```
Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
Failed: build command exited with code: 1
```

### After (Success):
```
added 515 packages, and audited 516 packages
✓ built in 2.14s
Success: Deployment completed
```

---

## 🔍 Visual Guide

### Build Configuration Section:
```
┌─────────────────────────────────────────┐
│ Build configuration                     │
├─────────────────────────────────────────┤
│ Framework preset: [Vite]                │
│                                         │
│ Build command:                          │
│ ┌─────────────────────────────────────┐ │
│ │ npm install && npm run build        │ │ ← Change this
│ └─────────────────────────────────────┘ │
│                                         │
│ Build output directory:                 │
│ ┌─────────────────────────────────────┐ │
│ │ dist                                 │ │ ← Should be "dist"
│ └─────────────────────────────────────┘ │
│                                         │
│         [Save]  [Cancel]                │
└─────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### If you can't find Settings:
- Make sure you're logged in
- Check you're on the correct project (roots-tech-news)
- Try refreshing the page

### If Save button doesn't work:
- Check your internet connection
- Try a different browser
- Clear browser cache

### If build still fails:
1. Check build logs for specific errors
2. Verify Node.js version is 18.20.8
3. Make sure `package-lock.json` is committed in git

### If you see "Permission denied":
- Check you have admin access to the Cloudflare account
- Contact account owner if needed

---

## 📞 Quick Reference

**Build Command to Use:**
```bash
npm install && npm run build
```

**Output Directory:**
```
dist
```

**Why This Works:**
- `npm install` installs optional dependencies (like Rollup binaries)
- `npm ci` skips optional dependencies (causes the error)
- Still uses `package-lock.json` for version locking

---

## ✅ Checklist

Before updating:
- [ ] Logged into Cloudflare Dashboard
- [ ] Found roots-tech-news project
- [ ] Located Settings → Builds & deployments

After updating:
- [ ] Changed build command to `npm install && npm run build`
- [ ] Verified output directory is `dist`
- [ ] Clicked Save
- [ ] Triggered new build (Retry deployment)
- [ ] Build completed successfully

---

## 🎯 Expected Timeline

- **Update build command:** 2 minutes
- **Save and trigger build:** 1 minute
- **Build time:** ~20-30 seconds
- **Total:** ~3-4 minutes

---

## 📝 Notes

- This fix is already committed to your repository
- The code changes are ready
- You just need to update Cloudflare Dashboard settings
- Once updated, all future builds will use the correct command

---

**Status:** ⚠️ **Action Required** - Update build command in Cloudflare Dashboard

**Priority:** 🔴 **URGENT** - Build is currently failing

