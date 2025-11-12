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
Value: v=spf1 include:resend.com ~all
TTL: 3600 (or Auto)
```

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

**If using Cloudflare:**
1. Go to your Cloudflare dashboard
2. Select `rootstechnews.com`
3. Go to **DNS** → **Records**
4. Click **"Add record"**
5. Add each record as shown above

**If using other DNS providers:**
- Follow your provider's instructions for adding TXT records
- The process is similar across providers

## Step 3: Verify Domain

1. After adding DNS records, go back to Resend dashboard
2. Click on your domain `rootstechnews.com`
3. Click **"Verify Domain"**
4. Wait for verification (can take a few minutes to 24 hours)

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

