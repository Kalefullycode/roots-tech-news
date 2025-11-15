# Fix: Rollup Optional Dependency Build Error on Cloudflare Pages

## Problem

Build fails with:
```
Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828)
```

## Root Cause

Cloudflare Pages runs `npm clean-install` automatically, which doesn't always install optional dependencies correctly. Rollup requires platform-specific binaries (`@rollup/rollup-linux-x64-gnu` for Linux) that are marked as optional dependencies.

## Solution

Update the Cloudflare Pages build command to explicitly include optional dependencies.

### Step-by-Step Fix

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Go to: **Workers & Pages** → **Pages** → **roots-tech-news**

2. **Open Build Settings**
   - Click **Settings** tab
   - Click **Builds & deployments** in left sidebar

3. **Update Build Command**
   - Find **Build command** field
   - Replace current command with:
     ```bash
     npm install --include=optional && npm run build
     ```
   - Verify **Build output directory** is: `dist`

4. **Save and Deploy**
   - Click **Save**
   - Go to **Deployments** tab
   - Click **Retry deployment** on the latest failed build

## Why This Works

- `--include=optional` flag ensures optional dependencies are installed
- This includes Rollup's platform-specific binaries
- Still uses `package-lock.json` for version locking
- Works around npm's optional dependency bug

## Alternative: If Above Doesn't Work

If the build still fails, try this more aggressive approach:

```bash
rm -rf node_modules package-lock.json && npm install --include=optional && npm run build
```

**Note:** This removes the lockfile, so use only if necessary.

## Verification

After updating, the build should:
- ✅ Install all dependencies including optional ones
- ✅ Find `@rollup/rollup-linux-x64-gnu` module
- ✅ Build successfully with Vite/Rollup
- ✅ Deploy without errors

## Files Updated

- ✅ `.npmrc` - Added `optional=true` and `include=optional`
- ✅ `wrangler.toml` - Updated build command documentation
- ✅ `package.json` - Added `install:fix` script as backup

## Current Status

**Action Required:** Update build command in Cloudflare Pages Dashboard to:
```bash
npm install --include=optional && npm run build
```

