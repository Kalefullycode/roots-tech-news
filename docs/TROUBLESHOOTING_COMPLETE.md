# Complete Newsletter Troubleshooting Guide

## Current Issues

Based on the "Partially Failed" status for `send.rootstechnews.com`, here's a comprehensive troubleshooting guide.

## Step 1: Verify Environment Variables

### Check Cloudflare Pages Environment Variables

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to: **Workers & Pages** → **roots-tech-news**
3. Click **Settings** → **Environment Variables**
4. Verify these are set for **Production**:
   - ✅ `RESEND_API_KEY` - Must start with `re_`
   - ⚠️ `RESEND_AUDIENCE_ID` - Optional but recommended

**If missing:**
- Click **Add variable**
- Name: `RESEND_API_KEY`
- Value: Your Resend API key from https://resend.com/api-keys
- Check **Encrypt**
- Click **Save**
- **Redeploy** your site for changes to take effect

## Step 2: Fix Domain Verification

### Current Status: Partially Failed for `send.rootstechnews.com`

The domain needs DNS records configured. Here's what to check:

### A. Check Resend Dashboard for Required Records

1. Go to https://resend.com/domains
2. Click on `send.rootstechnews.com`
3. Look at the verification section - it will show:
   - ❌ Domain Verification (DKIM) - What's missing?
   - ❌ Enable Sending (SPF/MX) - What's missing?

### B. Add Missing DNS Records in Cloudflare

**For DKIM (Domain Verification):**

1. In Cloudflare: **DNS** → **Records** → **Add record**
2. **Type:** `TXT`
3. **Name:** `resend._domainkey.send` (or exactly what Resend shows)
4. **Content:** Copy the FULL long string from Resend dashboard
5. **TTL:** `Auto`
6. **Proxy:** Gray cloud (DNS only, NOT proxied)
7. Click **Save**

**For MX (Enable Sending):**

1. In Cloudflare: **DNS** → **Records** → **Add record**
2. **Type:** `MX`
3. **Name:** `send` (just "send", not "@send" or "send.rootstechnews.com")
4. **Mail server:** Copy from Resend (e.g., `feedback-smtp.us-east-1.amazonses.com`)
5. **Priority:** `10`
6. **TTL:** `Auto`
7. **Proxy:** Gray cloud (DNS only, NOT proxied)
8. Click **Save**

**For SPF (if required):**

1. In Cloudflare: **DNS** → **Records** → **Add record**
2. **Type:** `TXT`
3. **Name:** `send` (for the subdomain)
4. **Content:** `v=spf1 include:resend.com ~all`
5. **TTL:** `Auto`
6. **Proxy:** Gray cloud (DNS only, NOT proxied)
7. Click **Save**

### C. Wait for DNS Propagation

- Cloudflare: Usually 5-15 minutes
- Maximum: Up to 24 hours
- Resend checks automatically every few minutes

### D. Verify in Resend

1. Go back to Resend dashboard
2. Click on `send.rootstechnews.com`
3. Click **"Refresh"** or **"Verify"** button
4. Status should change to **"Verified"** ✅

## Step 3: Test the Subscription Endpoint

### Test with curl:

```bash
curl -X POST https://rootstechnews.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

### Expected Responses:

**✅ Success (200):**
```json
{
  "success": true,
  "message": "✅ Successfully subscribed! Check your email.",
  "emailId": "email-id-here"
}
```

**❌ Domain Not Verified (403):**
```json
{
  "error": "Failed to send welcome email",
  "details": "Domain not verified - verify send.rootstechnews.com in Resend dashboard",
  "status": 403
}
```

**❌ API Key Missing (500):**
```json
{
  "error": "Server configuration error. Please contact support."
}
```

**❌ Invalid API Key (401):**
```json
{
  "error": "Failed to send welcome email",
  "details": "Invalid API key - check RESEND_API_KEY environment variable",
  "status": 401
}
```

## Step 4: Check Cloudflare Functions Logs

1. Go to Cloudflare Dashboard
2. **Workers & Pages** → **roots-tech-news**
3. Click **Functions** tab
4. Click **Logs** to see real-time errors
5. Look for:
   - `RESEND_API_KEY is not set or invalid`
   - `Resend Email API error`
   - `Domain not verified`

## Step 5: Common Issues & Solutions

### Issue 1: "403 Forbidden" or "Domain not verified"

**Cause:** Domain `send.rootstechnews.com` is not verified in Resend

**Solution:**
1. Check Resend dashboard for missing DNS records
2. Add required DKIM and MX records in Cloudflare
3. Ensure records are DNS-only (not proxied)
4. Wait for DNS propagation
5. Refresh in Resend dashboard

### Issue 2: "500 Server Error" or "Server configuration error"

**Cause:** `RESEND_API_KEY` not set in Cloudflare Pages

**Solution:**
1. Go to Cloudflare Pages → Settings → Environment Variables
2. Add `RESEND_API_KEY` with your Resend API key
3. Redeploy the site
4. Test again

### Issue 3: "401 Unauthorized" or "Invalid API key"

**Cause:** API key is incorrect or expired

**Solution:**
1. Go to https://resend.com/api-keys
2. Create a new API key
3. Update `RESEND_API_KEY` in Cloudflare Pages
4. Redeploy the site

### Issue 4: DNS Records Not Working

**Cause:** Records configured incorrectly

**Solution:**
- Verify record names match exactly (case-sensitive)
- Ensure no extra spaces in values
- Check records are DNS-only (gray cloud, not orange)
- Use DNS checker: https://mxtoolbox.com/TXTLookup.aspx

### Issue 5: Emails Not Sending

**Cause:** Domain verified but emails still failing

**Solution:**
1. Check Resend dashboard for specific error messages
2. Verify `from` address matches verified domain exactly
3. Check Resend API logs for delivery errors
4. Ensure domain status is "Verified" (not "Partially Failed")

## Step 6: Verify Code Configuration

### Check Email From Address

The code should use:
```typescript
from: 'Roots Tech News <newsletter@send.rootstechnews.com>'
```

**Files to check:**
- `functions/api/newsletter/subscribe.ts` (line 162)
- `functions/api/newsletter/unsubscribe.ts` (line 86)
- `functions/api/send-email.ts` (line 124)

All should use `newsletter@send.rootstechnews.com` ✅

## Step 7: Testing Checklist

- [ ] `RESEND_API_KEY` set in Cloudflare Pages
- [ ] Domain `send.rootstechnews.com` added in Resend
- [ ] DKIM TXT record added (`resend._domainkey.send`)
- [ ] MX record added (`send` → mail server)
- [ ] SPF record added (if required)
- [ ] All DNS records are DNS-only (not proxied)
- [ ] Waited 15+ minutes for DNS propagation
- [ ] Domain status is "Verified" in Resend
- [ ] Test subscription endpoint returns 200
- [ ] Welcome email arrives in inbox

## Quick Diagnostic Commands

```bash
# Test subscription endpoint
curl -X POST https://rootstechnews.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check DNS records
dig TXT send.rootstechnews.com
dig TXT resend._domainkey.send.rootstechnews.com
dig MX send.rootstechnews.com

# Run troubleshooting script
./troubleshoot-newsletter.sh
```

## Still Not Working?

1. **Check Resend Dashboard:**
   - Go to https://resend.com/domains
   - Click on `send.rootstechnews.com`
   - Look for specific error messages
   - Check which records are missing/failed

2. **Check Cloudflare Logs:**
   - Functions → Logs
   - Look for error messages
   - Check if API key is being read

3. **Contact Support:**
   - Resend Support: support@resend.com
   - Include screenshots of:
     - Resend domain status
     - Cloudflare DNS records
     - Error messages from logs

## Success Indicators

✅ Domain status: **"Verified"** (not "Partially Failed")
✅ Subscription endpoint returns: **200 OK**
✅ Welcome email arrives in inbox
✅ No errors in Cloudflare Functions logs

