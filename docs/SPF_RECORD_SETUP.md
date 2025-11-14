# SPF Record Configuration for rootstechnews.com

## Current SPF Record

```
Type: TXT
Name: @
Value: v=spf1 include:spf.messagingengine.com include:amazonses.com include:resend.com ~all
```

## What This Record Does

This SPF (Sender Policy Framework) record authorizes multiple email services to send emails on behalf of `rootstechnews.com`:

1. **`include:spf.messagingengine.com`** - Authorizes FastMail/other email services
2. **`include:amazonses.com`** - Authorizes Amazon SES to send emails
3. **`include:resend.com`** - Authorizes Resend to send emails (REQUIRED for newsletter)
4. **`~all`** - Soft fail policy for all other sources (emails from unauthorized sources will be marked but not rejected)

## How to Add/Update in Cloudflare

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select `rootstechnews.com`

2. **Navigate to DNS**
   - Click **DNS** → **Records**

3. **Check for Existing SPF Record**
   - Look for any TXT record with Name `@` that contains `v=spf1`
   - If found, click **Edit** (pencil icon)
   - If not found, click **"Add record"**

4. **Configure the Record**
   - **Type:** `TXT`
   - **Name:** `@` (or leave blank for root domain)
   - **Content:** `v=spf1 include:spf.messagingengine.com include:amazonses.com include:resend.com ~all`
   - **TTL:** `Auto` (or `3600`)
   - **Proxy status:** Gray cloud (DNS only, not proxied)

5. **Save the Record**
   - Click **"Save"**

## Important Notes

⚠️ **You can only have ONE SPF record per domain!**

- If you have multiple SPF records, DNS will fail
- You MUST combine all `include:` statements into a single record
- The order doesn't matter, but all services must be included

## Verification

After adding/updating the SPF record:

1. **Wait for DNS propagation** (5-60 minutes, usually faster with Cloudflare)
2. **Verify using online tools:**
   - [MXToolbox SPF Checker](https://mxtoolbox.com/spf.aspx)
   - [DNS Checker](https://dnschecker.org/)
   - Search for `rootstechnews.com` and check TXT records

3. **Check in Resend Dashboard:**
   - Go to https://resend.com/domains
   - Your domain should show SPF as verified

## Troubleshooting

### SPF Record Not Working?

- **Ensure only ONE SPF record exists** - Multiple SPF records will cause failures
- **Check for typos** - Verify all `include:` statements are correct
- **Wait for propagation** - DNS changes can take up to 24 hours (usually faster)
- **Verify record format** - Must start with `v=spf1` and end with `~all` or `-all`

### Resend Still Showing Failed?

- Make sure `include:resend.com` is in the SPF record
- Verify the record is at the root domain (`@` or blank name)
- Check that the record is not proxied (gray cloud in Cloudflare)
- Wait for DNS propagation and refresh Resend dashboard

## SPF Record Syntax

```
v=spf1 [mechanisms] [modifiers]
```

- `v=spf1` - SPF version 1 (required)
- `include:domain.com` - Authorize another domain's SPF record
- `~all` - Soft fail (mark as suspicious but don't reject)
- `-all` - Hard fail (reject unauthorized emails)

For production, you can change `~all` to `-all` for stricter security, but start with `~all` to avoid blocking legitimate emails during setup.

