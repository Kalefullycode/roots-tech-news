# 🔧 Cloudflare KV Setup Guide

This guide will help you set up Cloudflare KV namespace for RSS feed caching.

---

## ✅ **What is Cloudflare KV?**

Cloudflare KV (Key-Value) is a global, low-latency, key-value data store. It's perfect for caching RSS feeds with a 10-minute TTL.

**Benefits:**
- ⚡ **Fast**: Global edge network, <10ms latency
- 💰 **Free Tier**: 100,000 reads/day, 1,000 writes/day
- 🌍 **Global**: Data replicated to 300+ edge locations
- 🔄 **Automatic Expiration**: Built-in TTL support

---

## 📋 **Step 1: Create KV Namespace in Cloudflare Dashboard**

### **Option A: Via Cloudflare Dashboard (Recommended)**

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Log in to your account

2. **Navigate to Workers & Pages**
   - Click **"Workers & Pages"** in the left sidebar
   - Click **"KV"** in the submenu

3. **Create Production Namespace**
   - Click **"Create a namespace"**
   - **Name**: `FEED_CACHE`
   - Click **"Add"**
   - **Copy the Namespace ID** (you'll need this)

4. **Create Preview Namespace** (for testing)
   - Click **"Create a namespace"** again
   - **Name**: `FEED_CACHE_PREVIEW`
   - Click **"Add"**
   - **Copy the Preview Namespace ID**

---

### **Option B: Via Wrangler CLI**

If you prefer using the command line:

```bash
# Create production namespace
npx wrangler kv:namespace create "FEED_CACHE"

# Output will show:
# { binding = "FEED_CACHE", id = "your-namespace-id-here" }

# Create preview namespace
npx wrangler kv:namespace create "FEED_CACHE" --preview

# Output will show:
# { binding = "FEED_CACHE", preview_id = "your-preview-namespace-id-here" }
```

---

## 📝 **Step 2: Update wrangler.toml**

1. **Open `wrangler.toml`** in your project root

2. **Replace the placeholder IDs** with your actual namespace IDs:

```toml
[[kv_namespaces]]
binding = "FEED_CACHE"
id = "your-actual-production-namespace-id"  # Replace this
preview_id = "your-actual-preview-namespace-id"  # Replace this
```

**Example:**
```toml
[[kv_namespaces]]
binding = "FEED_CACHE"
id = "abc123def456ghi789"
preview_id = "xyz987uvw654rst321"
```

---

## 🔗 **Step 3: Bind KV to Cloudflare Pages Project**

### **Via Cloudflare Dashboard:**

1. **Go to your Pages project**
   - Navigate to: **Workers & Pages** → **Pages**
   - Click on your project: **roots-tech-news**

2. **Go to Settings**
   - Click **"Settings"** tab
   - Scroll down to **"Functions"** section

3. **Add KV Namespace Binding**
   - Under **"KV Namespace Bindings"**, click **"Add binding"**
   - **Variable name**: `FEED_CACHE`
   - **KV namespace**: Select `FEED_CACHE` from dropdown
   - Click **"Save"**

4. **Repeat for Preview Environment** (optional)
   - Switch to **"Preview"** environment
   - Add the same binding with `FEED_CACHE_PREVIEW` namespace

---

## ✅ **Step 4: Verify Setup**

### **Test Locally:**

```bash
# Start local development server
npm run cf:dev

# Or with wrangler directly
npx wrangler pages dev dist
```

### **Test in Production:**

1. **Deploy to Cloudflare Pages:**
   ```bash
   npm run deploy
   ```

2. **Test the endpoint:**
   ```bash
   curl https://roots-tech-news.pages.dev/fetch-rss
   ```

3. **Check Cloudflare Dashboard:**
   - Go to **Workers & Pages** → **KV**
   - Click on `FEED_CACHE` namespace
   - You should see a key: `rss-feeds-aggregated`
   - Check the **"Last modified"** timestamp

---

## 🐛 **Troubleshooting**

### **Issue: "FEED_CACHE is not defined"**

**Solution:**
- Verify KV namespace binding in `wrangler.toml`
- Check that namespace IDs are correct (not placeholders)
- Ensure binding is added in Cloudflare Pages dashboard

### **Issue: "KV namespace not found"**

**Solution:**
- Verify namespace exists in Cloudflare Dashboard
- Check namespace ID matches `wrangler.toml`
- Ensure you're using the correct account

### **Issue: "Permission denied"**

**Solution:**
- Verify you're logged in: `npx wrangler login`
- Check account permissions in Cloudflare Dashboard
- Ensure you have access to the Pages project

### **Issue: Cache not working**

**Solution:**
- Check Cloudflare Dashboard → KV → `FEED_CACHE` namespace
- Verify keys are being created
- Check function logs in Cloudflare Dashboard
- Verify TTL is set correctly (600 seconds = 10 minutes)

---

## 📊 **Monitoring KV Usage**

### **Check KV Statistics:**

1. Go to **Workers & Pages** → **KV**
2. Click on `FEED_CACHE` namespace
3. View:
   - **Keys**: Number of keys stored
   - **Reads**: Number of read operations
   - **Writes**: Number of write operations
   - **Size**: Total storage used

### **Free Tier Limits:**

- ✅ **100,000 reads/day** (plenty for RSS caching)
- ✅ **1,000 writes/day** (sufficient for 10-min cache)
- ✅ **1 GB storage** (more than enough)

---

## 🔄 **Cache Behavior**

### **How It Works:**

1. **First Request:**
   - KV cache is empty
   - Function fetches all RSS feeds
   - Stores result in KV with 10-minute TTL
   - Returns articles

2. **Subsequent Requests (within 10 minutes):**
   - KV cache hit
   - Returns cached articles immediately
   - No RSS feed fetching needed

3. **After 10 Minutes:**
   - KV cache expires
   - Function fetches fresh RSS feeds
   - Updates KV cache
   - Returns new articles

### **Cache Key:**
- **Key**: `rss-feeds-aggregated`
- **TTL**: 600 seconds (10 minutes)
- **Format**: JSON string

---

## 📚 **Additional Resources**

- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

---

## ✅ **Checklist**

- [ ] Created production KV namespace `FEED_CACHE`
- [ ] Created preview KV namespace `FEED_CACHE_PREVIEW`
- [ ] Updated `wrangler.toml` with namespace IDs
- [ ] Bound KV namespace in Cloudflare Pages dashboard
- [ ] Tested locally with `npm run cf:dev`
- [ ] Deployed to Cloudflare Pages
- [ ] Verified cache is working (check KV dashboard)
- [ ] Tested endpoint returns cached data

---

**Your RSS feed caching is now set up with Cloudflare KV!** 🎉

