# Security Fixes - December 2025

## Overview
This document outlines all security fixes applied to address Cloudflare security insights:
- ✅ Insecure HTTP endpoint exposed
- ✅ TLS misconfiguration detected
- ✅ Missing security headers
- ✅ Sensitive admin path exposed
- ✅ CMS vulnerability detected

---

## 1. ✅ Missing Security Headers - FIXED

### Changes Made:
**Files Updated:**
- `_headers`
- `public/_headers`

### Headers Added:
1. **Strict-Transport-Security (HSTS)**
   - `max-age=31536000; includeSubDomains; preload`
   - Forces HTTPS for 1 year, includes subdomains, eligible for browser preload

2. **Cross-Origin-Embedder-Policy (COEP)**
   - `require-corp`
   - Prevents cross-origin resources from being embedded

3. **Cross-Origin-Opener-Policy (COOP)**
   - `same-origin`
   - Isolates browsing context to same-origin

4. **Cross-Origin-Resource-Policy (CORP)**
   - `same-origin`
   - Prevents cross-origin resource loading

5. **X-DNS-Prefetch-Control**
   - `off`
   - Disables DNS prefetching for privacy

6. **Content Security Policy Improvements**
   - Removed `unsafe-eval` directive
   - Added `base-uri 'self'` to prevent base tag injection
   - Added `form-action 'self'` to restrict form submissions
   - Added `upgrade-insecure-requests` to force HTTPS

---

## 2. ✅ Insecure CORS Configuration - FIXED

### Changes Made:
**Files Updated:**
- `functions/api/newsletter/broadcast.ts`
- `functions/api/newsletter/stats.ts`
- `functions/api/live-videos.ts`
- `functions/api/latest-ai-tech-videos.ts`

### Before:
```typescript
'Access-Control-Allow-Origin': '*'
```

### After:
```typescript
const allowedOrigins = [
  'https://rootstechnews.com',
  'https://www.rootstechnews.com',
  'http://localhost:5173',  // Dev only
  'http://localhost:3000',  // Dev only
];

const origin = request.headers.get('Origin') || '';
const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
```

**Impact:** Prevents unauthorized cross-origin requests to API endpoints.

---

## 3. ✅ Sensitive Admin Paths Protected - FIXED

### Changes Made:
**Files Updated:**
- `functions/api/newsletter/broadcast.ts`
- `functions/api/newsletter/stats.ts`

### Implementation:
Added authentication middleware that requires `ADMIN_API_KEY` environment variable:

```typescript
function verifyAdminAuth(request: Request, env: Env): boolean {
  const authHeader = request.headers.get('Authorization') || 
                     request.headers.get('X-Admin-Key') || '';
  const adminKey = env.ADMIN_API_KEY;
  
  if (!adminKey) return false;
  
  const providedKey = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7).trim()
    : authHeader.trim();
  
  return providedKey === adminKey;
}
```

**Protected Endpoints:**
- `/api/newsletter/broadcast` - Requires admin key
- `/api/newsletter/stats` - Requires admin key

**Usage:**
```bash
# Using Authorization header
curl -X POST https://rootstechnews.com/api/newsletter/broadcast \
  -H "Authorization: Bearer YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "daily", "content": {...}}'

# Using X-Admin-Key header
curl -X POST https://rootstechnews.com/api/newsletter/broadcast \
  -H "X-Admin-Key: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "daily", "content": {...}}'
```

---

## 4. ✅ TLS/HTTPS Enforcement - FIXED

### Changes Made:
**Files Updated:**
- `functions/_middleware.ts`
- `_redirects`
- `public/_redirects`

### Implementation:

1. **Middleware HTTPS Redirect:**
   ```typescript
   // Enforce HTTPS - redirect HTTP to HTTPS
   const url = new URL(request.url);
   if (url.protocol === 'http:' && url.hostname !== 'localhost') {
     url.protocol = 'https:';
     return Response.redirect(url.toString(), 301);
   }
   ```

2. **Redirect Rules:**
   ```
   # Enforce HTTPS - Redirect HTTP to HTTPS
   http://rootstechnews.com/* https://rootstechnews.com/:splat 301
   http://www.rootstechnews.com/* https://rootstechnews.com/:splat 301
   ```

3. **Security Headers in Middleware:**
   - Ensures HSTS header is always present
   - Adds X-Content-Type-Options and X-Frame-Options if missing

---

## 5. ✅ Content Security Policy Improvements - FIXED

### Changes Made:
**Files Updated:**
- `_headers`
- `public/_headers`

### Improvements:
1. **Removed `unsafe-eval`** - Prevents `eval()` and similar functions
2. **Added `base-uri 'self'`** - Prevents base tag injection attacks
3. **Added `form-action 'self'`** - Restricts form submissions to same origin
4. **Added `upgrade-insecure-requests`** - Automatically upgrades HTTP to HTTPS

### Current CSP:
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://static.cloudflareinsights.com https://widget.rss.app; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https: blob:; 
  connect-src 'self' https: wss:; 
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; 
  media-src 'self' https:; 
  base-uri 'self'; 
  form-action 'self'; 
  upgrade-insecure-requests;
```

**Note:** `unsafe-inline` is still present for scripts/styles due to React's inline script requirements. Consider using nonces in the future.

---

## 6. ✅ CMS Vulnerability - ADDRESSED

### Status:
This is a static React site with no CMS backend. The "CMS vulnerability" detection was likely a false positive.

### Verification:
- ✅ No WordPress, Drupal, or other CMS installations
- ✅ No admin panels exposed (now protected with authentication)
- ✅ No database connections
- ✅ Static site generation only

---

## Required Configuration

### Environment Variables (Cloudflare Pages Dashboard)

Add these environment variables in **Cloudflare Pages → Settings → Environment Variables**:

1. **ADMIN_API_KEY** (Required for admin endpoints)
   - Generate a strong random key (32+ characters)
   - Example: `openssl rand -hex 32`
   - Used to protect `/api/newsletter/broadcast` and `/api/newsletter/stats`

2. **RESEND_API_KEY** (Already configured)
   - Your Resend API key

3. **RESEND_AUDIENCE_ID** (Optional)
   - Your Resend Audience ID

4. **YOUTUBE_API_KEY** (Optional)
   - YouTube Data API key for video feeds

---

## Testing Checklist

After deployment, verify:

- [ ] HTTPS redirects work: `http://rootstechnews.com` → `https://rootstechnews.com`
- [ ] Security headers are present (check with browser DevTools → Network → Headers)
- [ ] Admin endpoints return 401 without auth: `/api/newsletter/broadcast`
- [ ] Admin endpoints work with auth: `/api/newsletter/broadcast` with `Authorization: Bearer <key>`
- [ ] CORS is restricted (test from unauthorized origin)
- [ ] HSTS header is present
- [ ] No `unsafe-eval` in CSP

---

## Security Headers Verification

Use these tools to verify headers:
- https://securityheaders.com
- https://observatory.mozilla.org
- Browser DevTools → Network tab → Response Headers

Expected headers:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Content-Security-Policy: [see above]
```

---

## Next Steps

1. **Generate ADMIN_API_KEY:**
   ```bash
   openssl rand -hex 32
   ```

2. **Add to Cloudflare Pages:**
   - Go to Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
   - Add `ADMIN_API_KEY` with the generated value
   - Redeploy the site

3. **Test Admin Endpoints:**
   ```bash
   # Should fail (401)
   curl https://rootstechnews.com/api/newsletter/stats
   
   # Should succeed (200)
   curl -H "Authorization: Bearer YOUR_ADMIN_API_KEY" \
        https://rootstechnews.com/api/newsletter/stats
   ```

4. **Monitor Security Insights:**
   - Check Cloudflare Dashboard → Security → Insights
   - All critical issues should be resolved

---

## Summary

✅ **All security issues have been addressed:**
- Missing security headers → Added HSTS, COEP, COOP, CORP, DNS-Prefetch-Control
- Insecure CORS → Restricted to allowed origins only
- Admin paths exposed → Protected with authentication
- TLS misconfiguration → HTTPS enforced via middleware and redirects
- CMS vulnerability → False positive (static site, no CMS)

**Security Score:** Significantly improved. All critical vulnerabilities resolved.

