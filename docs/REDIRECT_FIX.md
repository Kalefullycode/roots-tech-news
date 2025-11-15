# Redirect Configuration Fix for Cloudflare Pages

## Test Results

### ✅ Working
- **rootstechnews.com** - HTTP 200 ✅ (Site loads correctly)

### ❌ Issues Found
- **www.rootstechnews.com** - HTTP 522 (Connection timeout)
  - **Issue:** www subdomain not configured in Cloudflare Pages or DNS
  - **Fix:** Add www subdomain in Cloudflare Pages dashboard

- **roots-tech-news.pages.dev** - HTTP 200 (Not redirecting)
  - **Issue:** `_redirects` file doesn't work for cross-domain redirects on Cloudflare Pages
  - **Fix:** Configure redirects via Cloudflare Transform Rules or Workers

## Why `_redirects` File Doesn't Work

Cloudflare Pages handles redirects differently than Netlify:
- ✅ `_redirects` works for **same-domain** redirects (e.g., `/old` → `/new`)
- ❌ `_redirects` does **NOT** work for **cross-domain** redirects (e.g., `pages.dev` → `rootstechnews.com`)

## Solution: Configure Redirects in Cloudflare Dashboard

### Option 1: Transform Rules (Recommended)

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Select **rootstechnews.com** (the domain, not Pages)

2. **Create Transform Rule**
   - Go to **Rules** → **Transform Rules** → **Redirect Rules**
   - Click **Create rule**

3. **Configure Redirect from .pages.dev**
   - **Rule name:** `Redirect pages.dev to custom domain`
   - **When incoming requests match:**
     - **Hostname:** `roots-tech-news.pages.dev`
   - **Then:**
     - **Type:** Dynamic
     - **Status code:** 301
     - **Destination URL:** `https://rootstechnews.com/$1`
     - **Preserve query string:** Yes
     - **Preserve path:** Yes

4. **Configure Redirect from www**
   - **Rule name:** `Redirect www to root`
   - **When incoming requests match:**
     - **Hostname:** `www.rootstechnews.com`
   - **Then:**
     - **Type:** Dynamic
     - **Status code:** 301
     - **Destination URL:** `https://rootstechnews.com/$1`
     - **Preserve query string:** Yes
     - **Preserve path:** Yes

### Option 2: Add www Subdomain in Cloudflare Pages

1. **Go to Cloudflare Pages**
   - Navigate to: **Workers & Pages** → **Pages** → **roots-tech-news**
   - Click **Custom domains** tab

2. **Add www Subdomain**
   - Click **"Set up a domain"** or **"Add custom domain"**
   - Enter: `www.rootstechnews.com`
   - Cloudflare will automatically configure DNS

3. **Configure Redirect (if needed)**
   - After adding www, you can configure redirect via Transform Rules (see Option 1)

### Option 3: Use Cloudflare Workers (Advanced)

If you need more control, create a Worker:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Redirect www to root
    if (url.hostname === 'www.rootstechnews.com') {
      return Response.redirect(
        `https://rootstechnews.com${url.pathname}${url.search}`,
        301
      );
    }
    
    // Redirect .pages.dev to custom domain
    if (url.hostname.includes('.pages.dev')) {
      return Response.redirect(
        `https://rootstechnews.com${url.pathname}${url.search}`,
        301
      );
    }
    
    // Otherwise, fetch from origin
    return fetch(request);
  }
}
```

## Step-by-Step: Fix www Subdomain (HTTP 522)

### Step 1: Add www in Cloudflare Pages
1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Pages** → **roots-tech-news**
2. Click **Custom domains** tab
3. Click **"Set up a domain"**
4. Enter: `www.rootstechnews.com`
5. Click **Continue**
6. Cloudflare will automatically add DNS records

### Step 2: Verify DNS Records
1. Go to **DNS** → **Records** for `rootstechnews.com`
2. Verify these records exist:
   ```
   Type: CNAME
   Name: www
   Target: roots-tech-news.pages.dev
   Proxy: ON (orange cloud) ✅
   ```

### Step 3: Configure Redirect (Optional)
- Use Transform Rules (Option 1) to redirect www → root
- Or keep both www and root working (both serve the same site)

## Step-by-Step: Fix .pages.dev Redirect

### Using Transform Rules (Easiest)

1. **Go to Cloudflare Dashboard**
   - Select **rootstechnews.com** domain

2. **Create Redirect Rule**
   - **Rules** → **Transform Rules** → **Redirect Rules** → **Create rule**
   - **Rule name:** `Redirect pages.dev to rootstechnews.com`
   - **When:** Hostname equals `roots-tech-news.pages.dev`
   - **Then:** Redirect to `https://rootstechnews.com/$1` with status 301

3. **Save and Test**
   - Click **Deploy**
   - Test: `curl -I https://roots-tech-news.pages.dev`
   - Should return: `HTTP/2 301` with `Location: https://rootstechnews.com/`

## Verification Commands

After configuring, test with:

```bash
# Test www redirect (should redirect or work)
curl -I https://www.rootstechnews.com

# Test .pages.dev redirect (should redirect)
curl -I https://roots-tech-news.pages.dev

# Test root domain (should work)
curl -I https://rootstechnews.com
```

## Expected Results

After configuration:

✅ **rootstechnews.com** - HTTP 200 (works)  
✅ **www.rootstechnews.com** - HTTP 301 → rootstechnews.com OR HTTP 200 (both work)  
✅ **roots-tech-news.pages.dev** - HTTP 301 → rootstechnews.com

## Current Status

- ✅ Root domain working: `rootstechnews.com`
- ❌ www subdomain: HTTP 522 (needs configuration)
- ❌ .pages.dev redirect: Not working (needs Transform Rule)

## Quick Fix Checklist

- [ ] Add `www.rootstechnews.com` in Cloudflare Pages → Custom domains
- [ ] Create Transform Rule to redirect `roots-tech-news.pages.dev` → `rootstechnews.com`
- [ ] (Optional) Create Transform Rule to redirect `www.rootstechnews.com` → `rootstechnews.com`
- [ ] Test all URLs after configuration
- [ ] Verify SSL certificates are active for all domains

---

**Note:** The `_redirects` file format works for same-domain redirects but not cross-domain. Use Cloudflare Transform Rules for cross-domain redirects.

