# Roots Tech News - Complete Setup Guide

## Quick Start (Get Your Site Working in 15 Minutes)

### Step 1: Get Your API Keys

#### YouTube Data API v3 (Required for Videos)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

#### Resend API (Required for Newsletter)
1. Go to [Resend.com](https://resend.com/)
2. Sign up for free account
3. Go to API Keys section
4. Create a new API key
5. Copy your API key

### Step 2: Configure Environment Variables

Create `.env.local` file in the root directory:

```bash
# YouTube API Configuration
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Newsletter Configuration
RESEND_API_KEY=your_resend_api_key_here

# Analytics (Optional)
VITE_GA_TRACKING_ID=
```

### Step 3: Deploy to Cloudflare Pages

#### Why Cloudflare Pages?
Your site uses Cloudflare Pages Functions for:
- RSS feed aggregation
- Newsletter subscriptions
- Video feed proxying
- Caching with Cloudflare KV

These features **only work on Cloudflare Pages**, not in local development.

#### Deployment Steps

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Configure environment"
   git push origin main
   ```

2. **Create Cloudflare Pages Project**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to "Workers & Pages"
   - Click "Create Application" → "Pages"
   - Connect your GitHub account
   - Select `Kalefullycode/roots-tech-news` repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/` (leave empty)

3. **Add Environment Variables**
   - In Cloudflare Pages project settings
   - Go to "Settings" → "Environment Variables"
   - Add:
     - `VITE_YOUTUBE_API_KEY` = your YouTube API key
     - `RESEND_API_KEY` = your Resend API key
     - `VITE_GA_TRACKING_ID` = your Google Analytics ID (optional)

4. **Create KV Namespace**
   - Go to "Workers & Pages" → "KV"
   - Click "Create namespace"
   - Name it: `FEED_CACHE`
   - Copy the namespace ID

5. **Bind KV to Your Project**
   - In your Pages project settings
   - Go to "Settings" → "Functions"
   - Under "KV Namespace Bindings"
   - Add binding:
     - **Variable name**: `FEED_CACHE`
     - **KV namespace**: Select the one you created

6. **Deploy**
   - Cloudflare will automatically deploy
   - Wait for deployment to complete
   - Visit your site URL (e.g., `roots-tech-news.pages.dev`)

### Step 4: Verify Everything Works

After deployment, test these features:

- [ ] Homepage loads
- [ ] YouTube videos appear in "Latest AI & Tech Videos"
- [ ] "Live AI News" section shows videos
- [ ] Newsletter subscription works
- [ ] Daily AI Briefing audio plays
- [ ] RSS feed shows recent articles
- [ ] All navigation links work

## Local Development

### Running Locally (Limited Functionality)

```bash
npm install
npm run dev
```

**Note**: Local dev server will show fallback content for:
- RSS feeds (uses hardcoded fallback articles)
- YouTube videos (won't load without API key)
- Newsletter (won't work without Cloudflare Functions)

### Running with Cloudflare Pages Dev (Full Functionality)

```bash
npm install
npm run build
npx wrangler pages dev dist
```

This runs a local Cloudflare Pages environment with Functions support.

## Troubleshooting

### Videos Not Loading
- **Check**: YouTube API key is set in environment variables
- **Check**: API key has YouTube Data API v3 enabled
- **Check**: API key quota hasn't been exceeded (10,000 requests/day free)

### Newsletter Not Working
- **Check**: Resend API key is set in environment variables
- **Check**: Resend account is verified
- **Check**: Sending domain is configured in Resend

### RSS Feeds Not Updating
- **Check**: KV namespace is bound to your Pages project
- **Check**: Cloudflare Functions are enabled
- **Check**: No CORS errors in browser console

### Build Failures
- **Check**: Node.js version is 18+ (check `.nvmrc` file)
- **Check**: All dependencies installed (`npm install`)
- **Check**: No TypeScript errors (`npm run build`)

## Architecture Overview

### Frontend (React + TypeScript + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6

### Backend (Cloudflare Pages Functions)
- **Runtime**: Cloudflare Workers (V8 isolates)
- **Functions**: TypeScript-based serverless functions
- **Caching**: Cloudflare KV (key-value store)
- **CDN**: Cloudflare global network

### Data Sources
- **RSS Feeds**: 12+ curated tech news sources
- **YouTube**: 100+ AI & tech channels via YouTube Data API
- **Newsletter**: Resend.com email API
- **Audio**: AI-generated voice briefings

## Performance Optimizations

The site is optimized for speed:
- Code splitting with React.lazy()
- Image optimization (WebP format)
- CSS code splitting disabled for single CSS file
- Manual chunk splitting for vendor libraries
- Cloudflare CDN caching
- KV caching for RSS feeds (10-minute TTL)
- Preconnect hints for external resources

## Security Features

- CORS headers properly configured
- Bot protection middleware
- Rate limiting on API endpoints
- Environment variables for sensitive data
- No API keys exposed in frontend code

## Maintenance

### Updating RSS Sources
Edit `functions/fetch-rss.ts` and modify the `RSS_SOURCES` array.

### Updating YouTube Channels
Edit `src/config/youtube-config.ts` and modify the `channels` object.

### Updating AI Tools
Edit `src/components/AIToolsSidebar.tsx` to add/remove tools.

## Support

For issues:
1. Check this guide first
2. Review `DETAILED_FINDINGS.md` for known issues
3. Check browser console for errors
4. Review Cloudflare Pages deployment logs

## Next Steps

After deployment:
1. Set up custom domain (optional)
2. Configure analytics
3. Set up email notifications
4. Monitor API usage quotas
5. Review and optimize performance
