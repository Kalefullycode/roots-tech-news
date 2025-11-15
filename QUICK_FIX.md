# ⚡ QUICK FIX - Cloudflare Pages Build

## The Problem
Build fails: `Cannot find module '@rollup/rollup-linux-x64-gnu'`

## The Fix (2 Minutes)

1. **Go to:** https://dash.cloudflare.com → Pages → roots-tech-news → Settings → Builds & deployments

2. **Change Build command from:**
   ```
   npm ci && npm run build
   ```
   **To:**
   ```
   npm install && npm run build
   ```

3. **Click Save**

4. **Go to Deployments tab → Retry deployment**

5. **Done!** ✅

---

## Why?
- `npm ci` doesn't install optional dependencies
- Rollup needs `@rollup/rollup-linux-x64-gnu` (optional dependency)
- `npm install` installs everything correctly

---

**Full instructions:** See `docs/URGENT_FIX_INSTRUCTIONS.md`

