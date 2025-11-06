# RSS.app YouTube Feed Setup Guide

## Quick Setup

To enable RSS.app integration on the videos page:

1. **Create RSS.app Account**
   - Go to https://rss.app
   - Sign up for a free account

2. **Create YouTube Feed**
   - Click "New Feed" → "YouTube"
   - Add channels from the list in `src/config/rssapp-config.ts`
   - Or use the helper functions to get channel handles:
     - `getChannelsForFeed1_AI_News()` - AI News channels
     - `getChannelsForFeed2_AI_Tutorials()` - Tutorial channels
     - `getChannelsForFeed3_AI_Business()` - Business channels
     - `getChannelsForFeed4_Coding()` - Coding channels
     - `getChannelsForFeed5_Everything()` - Other channels
     - `getAllChannelsForMasterFeed()` - All 200+ channels

3. **Configure Feed Settings**
   - Name: "RootsTechNews AI & Tech Videos"
   - Items: 20-30 videos
   - Layout: Grid (3 columns)
   - Sort: Most Recent
   - Update Frequency: Every 2-4 hours
   - Theme: Dark mode

4. **Get Feed ID**
   - After creating feed, go to "Embed" section
   - Copy the Feed ID (looks like: `tTCtnPmhJDGhOAbH`)

5. **Add Environment Variable**
   - Add to `.env.local`:
     ```
     VITE_RSSAPP_FEED_ID=your_feed_id_here
     ```
   - Or add to Cloudflare Pages environment variables:
     - Key: `VITE_RSSAPP_FEED_ID`
     - Value: Your RSS.app feed ID

6. **Deploy**
   - The page will automatically use RSS.app if `VITE_RSSAPP_FEED_ID` is set
   - Falls back to YouTubeService if not configured

## Channel List

The complete list of 200+ channels is available in:
- `src/config/rssapp-config.ts` - Full channel configuration
- `src/config/youtube-config.ts` - YouTube channel IDs (for RSS fallback)

## Keywords for RSS.app

When creating feeds, use these keywords for better curation:
- Artificial Intelligence, AI Tools, ChatGPT, Claude, Google Gemini
- Machine Learning, AI Tutorial, AI News, Tech News
- AI Business, AI Automation, AI Development, AI Strategy
- Generative AI, AI Agents, AI Coding, AI Video
- OpenAI, Anthropic, AI Innovation, Tech Updates

## Troubleshooting

**Videos not showing?**
- Check `VITE_RSSAPP_FEED_ID` is set correctly
- Verify RSS.app feed is active and has videos
- Check browser console for errors
- RSS.app widget script loads from: `https://widget.rss.app/v1/wall.js`

**Fallback to YouTubeService**
- If RSS.app fails to load, the page automatically falls back to YouTubeService
- This uses the channels configured in `youtube-config.ts`
- Limited to channels with RSS feeds available

## Notes

- RSS.app free tier supports up to 5 feeds
- For 200+ channels, consider creating a master feed or multiple category feeds
- The page supports both RSS.app widget and YouTubeService fallback
- Dark theme styling is automatically applied

