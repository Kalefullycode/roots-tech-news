# Resend Domain Setup Guide for rootstechnews.com

## Overview
This guide will help you connect `rootstechnews.com` to Resend so you can send emails from your custom domain instead of `onboarding@resend.dev`.

## Step 1: Add Domain in Resend Dashboard

1. Log in to [Resend](https://resend.com/emails)
2. Navigate to **Domains** in the sidebar
3. Click **"Add Domain"** button
4. Enter `rootstechnews.com`
5. Click **"Add Domain"**

## Step 2: Configure DNS Records

Resend will provide you with DNS records that need to be added to your domain. You'll need to add these records in your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.).

### Required DNS Records:

#### 1. SPF Record (TXT)
```
Type: TXT
Name: @ (or rootstechnews.com)
Value: v=spf1 include:spf.messagingengine.com include:amazonses.com include:resend.com ~all
TTL: 3600 (or Auto)
```

**Note:** This SPF record includes:
- `include:spf.messagingengine.com` - For FastMail/other email services
- `include:amazonses.com` - For Amazon SES
- `include:resend.com` - For Resend (REQUIRED for newsletter emails)
- `~all` - Soft fail for all other sources

#### 2. DKIM Records (TXT)
Resend will provide specific DKIM records. They typically look like:
```
Type: TXT
Name: resend._domainkey (or similar)
Value: [Provided by Resend]
TTL: 3600
```

#### 3. DMARC Record (TXT) - Optional but Recommended
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@rootstechnews.com
TTL: 3600
```

### Where to Add DNS Records:

**You're using Cloudflare (based on your Resend dashboard):**

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Sign in with your Cloudflare account

2. **Select your domain**
   - Click on `rootstechnews.com` from your domain list

3. **Navigate to DNS settings**
   - Click on **DNS** in the left sidebar
   - Click on **Records** tab

4. **Add the DKIM record (CRITICAL - Currently Failed)**
   - Click **"Add record"** button
   - **Type:** Select `TXT`
   - **Name:** Enter `resend._domainkey`
   - **Content:** Copy the FULL value from your Resend dashboard (it's a long string starting with `p=MIGfMAOGCSqGSIb3DQEB...`)
   - **TTL:** Select `Auto`
   - Click **"Save"**

5. **Add the MX record for sending (CRITICAL - Currently Failed)**
   - Click **"Add record"** button again
   - **Type:** Select `MX`
   - **Name:** Enter `send`
   - **Mail server:** Copy the full value from Resend dashboard (e.g., `feedback-smtp.us-east-1.amazonses.com`)
   - **Priority:** Enter `10`
   - **TTL:** Select `Auto`
   - Click **"Save"**

6. **Add or Update SPF record**
   - Click **"Add record"** button (or edit existing SPF record if present)
   - **Type:** Select `TXT`
   - **Name:** Enter `@` (or leave blank for root domain)
   - **Content:** Enter `v=spf1 include:spf.messagingengine.com include:amazonses.com include:resend.com ~all`
   - **TTL:** Select `Auto`
   - Click **"Save"**
   
   **Important:** If you already have an SPF record, you MUST combine all includes into ONE record. You can only have ONE SPF record per domain.

7. **Add DMARC record (Optional but recommended)**
   - Click **"Add record"** button
   - **Type:** Select `TXT`
   - **Name:** Enter `_dmarc`
   - **Content:** Enter `v=DMARC1; p=none; rua=mailto:dmarc@rootstechnews.com`
   - **TTL:** Select `Auto`
   - Click **"Save"**

## Step 3: Verify Domain

1. **After adding DNS records in Cloudflare:**
   - DNS propagation typically takes 5-60 minutes, but can take up to 24 hours
   - Cloudflare usually propagates changes faster (5-15 minutes)

2. **Go back to Resend dashboard:**
   - Visit: https://resend.com/domains/91396e43-3b00-4c71-890f-0d95a7e7371d
   - Resend will automatically check DNS records every few minutes
   - You can also click **"Refresh"** or **"Verify"** button if available

3. **Check verification status:**
   - The status should change from **"Failed"** to **"Verified"** once DNS propagates
   - Both sections should show **"Verified"** status:
     - ✅ Domain Verification (DKIM)
     - ✅ Enable Sending (SPF & DMARC)

4. **If still showing Failed after 1 hour:**
   - Double-check the record values match exactly (no extra spaces)
   - Ensure the `resend._domainkey` TXT record name is exactly correct
   - Verify the MX record name is `send` (not `@send` or `send.rootstechnews.com`)
   - Check Cloudflare DNS settings - ensure records are not proxied (should be DNS only, gray cloud)

**Note:** DNS propagation can take time. You can check if records are live using:
- [MXToolbox](https://mxtoolbox.com/TXTLookup.aspx)
- [DNS Checker](https://dnschecker.org/)

## Step 4: Code Updates

✅ **Already Updated!** The code has been updated to use:
- `newsletter@rootstechnews.com` instead of `onboarding@resend.dev`

Files updated:
- `functions/api/newsletter/subscribe.ts`
- `functions/api/newsletter/unsubscribe.ts`
- `functions/api/send-email.ts`

## Step 5: Test Email Sending

Once domain is verified:

1. Test newsletter subscription on your site
2. Check that emails are sent from `newsletter@rootstechnews.com`
3. Verify emails arrive in inbox (not spam)

## Troubleshooting

### Domain Not Verifying?
- Wait 24-48 hours for DNS propagation
- Double-check DNS records are correct
- Ensure no typos in record values
- Check if your DNS provider has any restrictions

### Emails Going to Spam?
- Ensure SPF, DKIM, and DMARC records are properly configured
- Use a DMARC policy (start with `p=none` then move to `p=quarantine`)
- Warm up your domain by sending gradually increasing volumes

### Still Using onboarding@resend.dev?
- Make sure domain is verified in Resend
- Check that DNS records are correct
- Verify Resend API key has access to the domain

## Additional Resources

- [Resend Domain Documentation](https://resend.com/docs/dashboard/domains/introduction)
- [Resend DNS Setup Guide](https://resend.com/docs/dashboard/domains/verify-a-domain)
- [Email Deliverability Best Practices](https://resend.com/docs/dashboard/domains/deliverability)

## Support

If you encounter issues:
1. Check Resend dashboard for error messages
2. Verify DNS records are correct
3. Contact Resend support if domain verification fails

