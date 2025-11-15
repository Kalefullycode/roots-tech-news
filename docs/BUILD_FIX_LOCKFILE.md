# Build Fix: Lockfile Sync Issue

## Problem

Cloudflare Pages build was failing with:
```
error: lockfile had changes, but lockfile is frozen
note: try re-running without --frozen-lockfile and commit the updated lockfile
```

## Root Cause

- Added `tsx` as a dev dependency to `package.json` for the newsletter broadcast script
- The `bun.lockb` file was updated locally but not committed
- Cloudflare Pages uses `bun install --frozen-lockfile` which requires the lockfile to be in sync

## Solution

1. ✅ Updated lockfile locally: `bun install`
2. ✅ Staged lockfile: `git add bun.lockb`
3. ⏳ **Next step:** Commit and push the lockfile

## To Fix

```bash
git commit -m "chore: update bun lockfile after adding tsx dependency"
git push
```

## Why tsx?

The `tsx` package is a dev dependency used to run TypeScript files directly:
- Used by: `scripts/send-newsletter-broadcast.ts`
- Purpose: Run newsletter broadcast script locally
- **Not needed for Cloudflare Pages build** - only for local development

## Alternative Solutions

If you want to avoid this in the future:

### Option 1: Use npm instead of bun (Recommended for Cloudflare Pages)
Configure Cloudflare Pages build settings to use npm:
- Build command: `npm install && npm run build`
- This avoids bun lockfile issues

### Option 2: Keep lockfile in sync
Always commit `bun.lockb` after adding dependencies:
```bash
bun install
git add bun.lockb package.json
git commit -m "chore: add dependency"
```

## Verification

After committing and pushing, the next Cloudflare Pages build should succeed.

