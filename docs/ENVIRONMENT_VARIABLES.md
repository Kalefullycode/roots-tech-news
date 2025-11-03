# Environment Variables Configuration

This document outlines all required and optional environment variables for the RootsTechNews application.

## Cloudflare Pages Environment Variables

### Required Variables

#### `RESEND_API_KEY`
- **Purpose**: API key for Resend email service (newsletter subscriptions)
- **Location**: Cloudflare Pages Dashboard → Settings → Environment Variables
- **How to Get**:
  1. Sign up at https://resend.com
  2. Go to API Keys section
  3. Create a new API key
  4. Copy the key (starts with `re_`)
- **Format**: `re_xxxxxxxxxxxxx`
- **Security**: Mark as "Encrypted" in Cloudflare
- **Used In**: `functions/subscribe.ts`

---

## Setting Environment Variables in Cloudflare Pages

### Steps:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to: **Workers & Pages** → **roots-tech-news**
3. Click **Settings** → **Environment Variables**
4. For **Production** environment:
   - Click **Add variable**
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key (e.g., `re_xxxxxxxxxxxxx`)
   - Click **Encrypt** checkbox
   - Click **Save**

### Verification:
After setting the variable, test the newsletter subscription:
1. Visit your site
2. Try subscribing to the newsletter
3. Check Cloudflare Functions logs for errors

---

## Local Development

For local development, create a `.dev.vars` file in the project root:

```bash
# .dev.vars (DO NOT COMMIT THIS FILE)
RESEND_API_KEY=re_your_api_key_here
```

**Important**: Add `.dev.vars` to `.gitignore` to prevent committing secrets.

---

## Troubleshooting

### Newsletter Subscription Not Working

**Error**: "API key not configured"
- **Solution**: Ensure `RESEND_API_KEY` is set in Cloudflare Pages environment variables
- **Check**: Cloudflare Dashboard → Your Project → Settings → Environment Variables

**Error**: "Failed to subscribe"
- **Check**: Resend API key is valid and has proper permissions
- **Check**: Cloudflare Functions logs for detailed error messages

### Testing Locally

If testing newsletter functionality locally:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Run local dev server with environment variables
wrangler pages dev dist --local --env .dev.vars
```

---

## Security Best Practices

1. ✅ **Never commit** environment variables to git
2. ✅ **Always encrypt** sensitive variables in Cloudflare
3. ✅ **Use different keys** for production and preview environments
4. ✅ **Rotate keys** periodically (every 90 days recommended)
5. ✅ **Restrict API key permissions** in Resend dashboard

---

## Additional Configuration

### Resend Audience ID
The newsletter subscription uses a fixed audience ID defined in `functions/subscribe.ts`:
```typescript
const AUDIENCE_ID = '35eb466a-614c-46d8-830b-0ae8108177c8';
```

If you need to change this:
1. Create a new audience in Resend dashboard
2. Update the `AUDIENCE_ID` constant in `functions/subscribe.ts`

---

## Related Documentation

- [Resend API Documentation](https://resend.com/docs/api-reference)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/functions/bindings/#environment-variables)






