# 🚀 Deployment Guide - Cloudflare Pages

This guide covers deploying Roots Tech News to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI** - Cloudflare's deployment tool
3. **GitHub Repository** - Connected to Cloudflare Pages

## Quick Deploy

### Option 1: Deploy via Wrangler CLI (Recommended)

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

Or use the deploy script:
```bash
./scripts/deploy.sh
```

### Option 2: Deploy via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (root)
5. Add environment variables (see below)
6. Click **Save and Deploy**

## Environment Variables

Add these in Cloudflare Pages → Your Project → Settings → Environment Variables:

### Required

- **RESEND_API_KEY** - Your Resend API key (starts with `re_`)
  - Get it from: https://resend.com/api-keys

### How to Add

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click **Settings** → **Environment Variables**
3. Click **Add variable**
4. Add `RESEND_API_KEY` with your key value
5. Select scopes: **Production**, **Preview**, **Branch**
6. Click **Save**

## Build Configuration

### wrangler.toml

```toml
name = "roots-tech-news"
compatibility_date = "2024-10-27"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "dist"
```

### Build Scripts

- `npm run build` - Build for production
- `npm run deploy` - Build and deploy to Cloudflare Pages
- `npm run cf:dev` - Local development with Wrangler

## Project Structure

```
functions/
  api/
    newsletter/
      subscribe.ts    # Newsletter subscription endpoint
      unsubscribe.ts  # Unsubscribe endpoint
    rss-proxy.ts      # RSS proxy endpoint
  fetch-rss.ts       # RSS fetch function
  _middleware.ts     # Global middleware

dist/                # Build output (deployed to Cloudflare)
  index.html
  assets/
  _headers
  _redirects
```

## Deployment Checklist

- [ ] Environment variables set in Cloudflare Dashboard
- [ ] Build completes successfully (`npm run build`)
- [ ] Functions are in `functions/` directory
- [ ] `wrangler.toml` is configured correctly
- [ ] `_redirects` file includes all routes
- [ ] Test API endpoints after deployment

## Testing After Deployment

### Test Newsletter API

```bash
curl -X POST https://rootstechnews.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Expected: `200 OK` with success message

### Test Pages

- Homepage: https://rootstechnews.com
- Newsletter: https://rootstechnews.com/newsletter
- Unsubscribe: https://rootstechnews.com/unsubscribe

## Troubleshooting

### Build Fails

1. Check Node.js version: `node --version` (should be 18+)
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check for TypeScript errors: `npm run lint`

### Functions Not Working

1. Verify function files are in `functions/` directory
2. Check function exports (`onRequestPost`, `onRequestGet`, etc.)
3. View logs: `npx wrangler pages deployment tail`
4. Check environment variables are set correctly

### 404 Errors on Routes

1. Ensure `_redirects` file includes all routes
2. Check that routes are in `src/App.tsx`
3. Verify `_redirects` is copied to `dist/` during build

### API Returns 405 (Method Not Allowed)

- Function may not be deployed yet - wait for deployment to complete
- Check function exports match HTTP method
- Verify function is in correct directory structure

## Continuous Deployment

If connected via GitHub:
1. Push to `main` branch
2. Cloudflare Pages automatically builds and deploys
3. Check deployment status in Cloudflare Dashboard

## Local Development

```bash
# Start dev server
npm run dev

# Test with Wrangler locally
npm run cf:dev
```

## Support

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler/
- Resend Docs: https://resend.com/docs

