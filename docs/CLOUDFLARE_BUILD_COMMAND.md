# Cloudflare Pages Build Command Configuration

## ✅ Recommended Build Command

For Cloudflare Pages, use this build command in the dashboard:

```bash
npm ci && npm run build
```

## Why `npm ci` instead of `npm install`?

- ✅ **Faster** - Skips dependency resolution, uses lockfile directly
- ✅ **More reliable** - Fails if lockfile doesn't match package.json
- ✅ **Clean install** - Removes node_modules first, ensures clean state
- ✅ **Production-ready** - Designed for CI/CD environments

## How to Configure

### Step 1: Go to Cloudflare Dashboard
1. Navigate to **Cloudflare Dashboard** → **Pages** → **roots-tech-news**
2. Click **Settings** → **Builds & deployments**

### Step 2: Update Build Command
1. Scroll to **Build configuration**
2. Find **Build command** field
3. Replace with:
   ```
   npm ci && npm run build
   ```
4. Click **Save**

### Step 3: Verify Output Directory
- **Build output directory:** `dist`
- This should already be set correctly

### Step 4: Trigger New Build
1. Go to **Deployments** tab
2. Click **Retry deployment** on latest build
3. Or push a new commit to trigger automatic rebuild

## Alternative Build Commands

### If using yarn:
```bash
yarn install --frozen-lockfile && yarn build
```

### If using pnpm:
```bash
pnpm install --frozen-lockfile && pnpm build
```

## Current Setup

- ✅ **Package Manager:** npm
- ✅ **Lockfile:** `package-lock.json` (committed)
- ✅ **Build Command:** `npm ci && npm run build` (recommended)
- ✅ **Output Directory:** `dist`

## Verification

After updating the build command, check the build logs:
- Should see: `npm ci` running
- Should see: `npm run build` running
- Should complete successfully
- No lockfile errors

## Troubleshooting

### If build still fails:
1. Check build logs for specific errors
2. Verify `package-lock.json` is committed
3. Ensure build command is exactly: `npm ci && npm run build`
4. Check that Node.js version matches (18.20.8)

### If dependencies are missing:
- `npm ci` will fail if lockfile is out of sync
- Regenerate lockfile: `rm package-lock.json && npm install`
- Commit and push the updated lockfile

---

**Status:** ✅ Ready to configure in Cloudflare Dashboard

