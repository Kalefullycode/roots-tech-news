# Quick Fix: Resend DNS Records for rootstechnews.com

## Current Status
- **Domain:** rootstechnews.com
- **Status:** ❌ Failed
- **Issues:** 
  1. Domain Verification (DKIM) - Missing TXT record
  2. Enable Sending (SPF) - Missing MX record

## Immediate Action Required

### Step 1: Add DKIM Record (Domain Verification)

**In Cloudflare Dashboard:**

1. Go to https://dash.cloudflare.com
2. Select `rootstechnews.com`
3. Click **DNS** → **Records**
4. Click **"Add record"**
5. Configure:
   - **Type:** `TXT`
   - **Name:** `resend._domainkey`
   - **Content:** [Copy from Resend dashboard - starts with `p=MIGfMAOGCSqGSIb3DQEB...`]
   - **TTL:** `Auto`
6. Click **"Save"**

**To get the exact Content value:**
- Go to https://resend.com/domains/91396e43-3b00-4c71-890f-0d95a7e7371d
- Scroll to "Domain Verification (DKIM)" section
- Copy the full **Content** value from the table

### Step 2: Add MX Record (Enable Sending)

**In Cloudflare Dashboard:**

1. Still in DNS Records
2. Click **"Add record"** again
3. Configure:
   - **Type:** `MX`
   - **Name:** `send`
   - **Mail server:** [Copy from Resend dashboard - e.g., `feedback-smtp.us-east-1.amazonses.com`]
   - **Priority:** `10`
   - **TTL:** `Auto`
4. Click **"Save"**

**To get the exact Mail server value:**
- Go to https://resend.com/domains/91396e43-3b00-4c71-890f-0d95a7e7371d
- Scroll to "Enable Sending (SPF & DMARC)" section
- Copy the full **Content** value from the MX record table

### Step 3: Wait for DNS Propagation

- **Cloudflare:** Usually 5-15 minutes
- **Maximum:** Up to 24 hours
- Resend checks automatically every few minutes

### Step 4: Verify in Resend

1. Go back to: https://resend.com/domains/91396e43-3b00-4c71-890f-0d95a7e7371d
2. Status should change from **"Failed"** to **"Verified"**
3. Both sections should show green checkmarks

## Troubleshooting

### If records still show "Failed" after 1 hour:

1. **Check record names are exact:**
   - DKIM: Must be exactly `resend._domainkey` (not `resend._domainkey.rootstechnews.com`)
   - MX: Must be exactly `send` (not `@send`)

2. **Verify values match exactly:**
   - No extra spaces before/after
   - Full value copied (DKIM is very long)
   - Case-sensitive where applicable

3. **Check Cloudflare proxy status:**
   - DNS records should have **gray cloud** (DNS only)
   - Not **orange cloud** (proxied)
   - Click the cloud icon to toggle if needed

4. **Verify DNS propagation:**
   - Use https://mxtoolbox.com/TXTLookup.aspx to check TXT records
   - Use https://mxtoolbox.com/MXLookup.aspx to check MX records
   - Search for `rootstechnews.com`

## Important Notes

- The DKIM record value is very long - make sure you copy the entire value
- Both records are REQUIRED for email sending to work
- Once verified, your emails will send from `newsletter@rootstechnews.com`
- DNS changes can take time - be patient!

## Support

If issues persist after 24 hours:
1. Check Resend documentation: https://resend.com/docs/dashboard/domains/verify-a-domain
2. Contact Resend support through their dashboard
3. Verify Cloudflare DNS settings are correct

