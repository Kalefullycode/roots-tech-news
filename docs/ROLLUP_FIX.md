# Rollup Optional Dependency Fix

## Problem

Cloudflare Pages build fails with:
```
Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
```

This is a known npm issue with optional dependencies when using `npm ci`.

## Root Cause

- `npm ci` doesn't always install optional dependencies correctly
- Rollup needs platform-specific binaries (`@rollup/rollup-linux-x64-gnu` for Linux)
- Cloudflare Pages runs on Linux, so it needs the Linux-specific binary

## Solution

Change the build command from `npm ci` to `npm install` to ensure optional dependencies are installed.

### Update Cloudflare Pages Build Command

1. Go to **Cloudflare Dashboard** → **Pages** → **roots-tech-news**
2. Click **Settings** → **Builds & deployments**
3. Update **Build command** to:
   ```
   npm install && npm run build
   ```
4. Click **Save**

## Why `npm install` Instead of `npm ci`?

- ✅ Installs optional dependencies correctly
- ✅ Works better with platform-specific binaries
- ✅ Still uses package-lock.json for version locking
- ✅ More reliable for Cloudflare Pages environment

## Alternative: Force Install Optional Dependencies

If you prefer to keep `npm ci`, you can add this to package.json scripts:

```json
{
  "scripts": {
    "prebuild": "npm install --no-save @rollup/rollup-linux-x64-gnu && cp _headers public/_headers && cp _redirects public/_redirects"
  }
}
```

But `npm install` is simpler and more reliable.

## Verification

After updating the build command, the build should:
- ✅ Install all dependencies including optional ones
- ✅ Find `@rollup/rollup-linux-x64-gnu` module
- ✅ Build successfully with Vite/Rollup

---

**Status:** ⚠️ Update build command in Cloudflare Dashboard

