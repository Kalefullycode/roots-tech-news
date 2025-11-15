# Cloudflare Pages Build Fix - Use npm Instead of bun

## Problem

Cloudflare Pages build is failing with:
```
error: lockfile had changes, but lockfile is frozen
```

**Root Cause:**
- Cloudflare Pages uses `bun v1.2.15`
- Local development uses `bun v1.1.18` (or different version)
- Different bun versions produce different lockfiles
- This causes lockfile sync issues

## Solution: Configure Cloudflare Pages to Use npm

### Step 1: Update Cloudflare Pages Build Settings

1. Go to **Cloudflare Dashboard** → **Pages** → **roots-tech-news**
2. Click **Settings** → **Builds & deployments**
3. Scroll to **Build configuration**
4. Update the **Build command** to:
   ```
   npm install && npm run build
   ```
5. Click **Save**

### Step 2: Verify package-lock.json Exists

The project already has `package-lock.json` which npm will use.

### Step 3: Trigger New Build

1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest failed build
3. Or push a new commit to trigger automatic rebuild

## Why This Works

- ✅ npm is more stable across different environments
- ✅ `package-lock.json` is already committed
- ✅ No version mismatch issues
- ✅ Standard approach for Cloudflare Pages

## Alternative: Keep Using bun

If you prefer to keep using bun:

1. **Update local bun to match Cloudflare:**
   ```bash
   bun upgrade
   ```

2. **Regenerate lockfile:**
   ```bash
   rm bun.lockb
   bun install
   git add bun.lockb
   git commit -m "chore: regenerate lockfile with bun 1.2.15"
   git push
   ```

3. **Keep bun versions in sync** going forward

## Recommended: Use npm (Easier)

Using npm avoids these version sync issues and is the recommended approach for Cloudflare Pages.

