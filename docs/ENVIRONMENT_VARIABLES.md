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
- **Used In**: `functions/api/newsletter/subscribe.ts`

#### `RESEND_AUDIENCE_ID` (Optional but Recommended)
- **Purpose**: Resend Audience ID for managing newsletter subscribers
- **Location**: Cloudflare Pages Dashboard → Settings → Environment Variables
- **How to Get**:
  1. Go to https://resend.com/audiences
  2. Create a new audience or select an existing one
  3. Copy the Audience ID (UUID format)
- **Format**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Security**: Mark as "Encrypted" in Cloudflare
- **Used In**: `functions/api/newsletter/subscribe.ts`
- **Note**: If not provided, the subscription will still work but contacts won't be added to an audience

### Optional Variables

#### `VITE_YOUTUBE_API_KEY`
- **Purpose**: YouTube Data API v3 key for enhanced video features (optional)
- **Location**: For local development, add to `.env.local` file
- **Note**: Currently, the app uses YouTube RSS feeds which don't require an API key. This is configured for future use.
- **How to Get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing
  3. Enable "YouTube Data API v3"
  4. Create credentials → API Key
  5. Copy the API key
- **Format**: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Used In**: `src/config/youtube.ts` (currently optional, for future YouTube API integration)

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

For local development, create a `.env.local` file in the project root:

```bash
# .env.local (DO NOT COMMIT THIS FILE)
# Required for newsletter functionality
RESEND_API_KEY=re_your_api_key_here

# Optional but recommended - Resend Audience ID for subscriber management
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Optional - for future YouTube API features
VITE_YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Important**: 
- Add `.env.local` to `.gitignore` to prevent committing secrets
- For Cloudflare Pages dev environment, use `.dev.vars` file

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
The newsletter subscription now uses the `RESEND_AUDIENCE_ID` environment variable for managing subscribers. This allows you to:
- Manage subscribers in Resend's dashboard
- Send targeted emails to your audience
- Track subscriber metrics

If you need to change the audience:
1. Create a new audience in Resend dashboard
2. Update the `RESEND_AUDIENCE_ID` environment variable in Cloudflare Pages

---

## Related Documentation

- [Resend API Documentation](https://resend.com/docs/api-reference)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/functions/bindings/#environment-variables)









