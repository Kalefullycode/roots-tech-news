# RSS.app YouTube Feed Setup Guide

## 🎯 Quick Setup Steps

Based on [RSS.app's YouTube feed creation](https://rss.app/new-rss-feed/create-youtube-rss-feed), follow these steps:

### Step 1: Create RSS.app Account
1. Go to https://rss.app
2. Sign up for a free account
3. Navigate to "New Feed" → "YouTube"

### Step 2: Create YouTube Feeds

For each category, create a separate feed:

#### Feed 1: AI Videos
- **Name**: "RootsTechNews - AI Videos"
- **Channels**: Add YouTube channel handles (e.g., `@sabrina_ramonov`, `@StefanMischook`, `@aiexplained-official`)
- **Keywords**: `AI videos`, `Artificial Intelligence`, `ChatGPT`, `Claude`, `Machine Learning`
- **Items**: 20-30 videos
- **Layout**: Grid
- **Theme**: Dark
- **Sort**: Most Recent
- **Update Frequency**: Every 2-4 hours

#### Feed 2: AI News
- **Name**: "RootsTechNews - AI News"
- **Keywords**: `AI News`, `Tech News`, `AI Updates`, `OpenAI`, `Anthropic`
- **Items**: 20-30 videos
- **Settings**: Same as Feed 1

#### Feed 3: Cyber Security
- **Name**: "RootsTechNews - Cyber Security"
- **Keywords**: `Cyber Security`, `Cybersecurity`, `Security News`, `Hacking`, `Data Protection`
- **Items**: 20-30 videos

#### Feed 4: Virtual Reality
- **Name**: "RootsTechNews - Virtual Reality"
- **Keywords**: `Virtual Reality`, `VR`, `AR`, `Metaverse`, `Oculus`, `Quest`
- **Items**: 20-30 videos

#### Feed 5: Business
- **Name**: "RootsTechNews - Business"
- **Keywords**: `Business`, `Startups`, `Entrepreneurship`, `Venture Capital`, `Tech Business`
- **Items**: 20-30 videos

#### Feed 6: World News
- **Name**: "RootsTechNews - World News"
- **Keywords**: `World News`, `Tech News`, `Global News`, `International News`
- **Items**: 20-30 videos

#### Feed 7: Technology
- **Name**: "RootsTechNews - Technology"
- **Keywords**: `Technology`, `Tech`, `Innovation`, `Gadgets`, `Tech Reviews`
- **Items**: 20-30 videos

#### Feed 8: Venture Capital
- **Name**: "RootsTechNews - Venture Capital"
- **Keywords**: `Venture Capital`, `VC`, `Startups`, `Funding`, `Investments`
- **Items**: 20-30 videos

#### Feed 9: Artificial Intelligence
- **Name**: "RootsTechNews - Artificial Intelligence"
- **Keywords**: `Artificial Intelligence`, `AI`, `Machine Learning`, `Deep Learning`, `Neural Networks`
- **Items**: 20-30 videos

### Step 3: Get Feed IDs

After creating each feed:
1. Go to the feed's "Embed" section
2. Copy the Feed ID (looks like: `tTCtnPmhJDGhOAbH`)
3. Note which category it belongs to

### Step 4: Add Feed IDs to Code

Update `src/pages/YouTubePage.tsx` and replace the URLs with your feed IDs:

```typescript
const RSSAPP_FEEDS = {
  'All Videos': 'YOUR_MAIN_FEED_ID', // Or use VITE_RSSAPP_FEED_ID env var
  'AI Videos': 'YOUR_AI_VIDEOS_FEED_ID',
  'AI News': 'YOUR_AI_NEWS_FEED_ID',
  'Cyber Security': 'YOUR_CYBER_SECURITY_FEED_ID',
  'Virtual Reality': 'YOUR_VR_FEED_ID',
  'Business': 'YOUR_BUSINESS_FEED_ID',
  'World News': 'YOUR_WORLD_NEWS_FEED_ID',
  'Technology': 'YOUR_TECHNOLOGY_FEED_ID',
  'Venture Capital': 'YOUR_VC_FEED_ID',
  'Artificial Intelligence': 'YOUR_AI_FEED_ID',
};
```

### Step 5: Add Environment Variable (Optional)

For the main feed, you can also set it via environment variable:

```bash
# .env.local
VITE_RSSAPP_FEED_ID=your_main_feed_id_here
```

## 📋 Channel List for RSS.app

When creating feeds in RSS.app, add these YouTube channel handles:

### Core AI Creators
- `@sabrina_ramonov`
- `@StefanMischook`
- `@NickySaunders`
- `@aiexplained-official`
- `@TwoMinutePapers`
- `@mreflow`

### Top Tech Channels
- `@MarquesBrownlee`
- `@YCombinator`
- `@TechCrunch`
- `@3Blue1Brown`
- `@Fireship`
- `@TraversyMedia`

*(Add more channels from your 200+ list)*

## 🔧 RSS.app Widget Usage

The widget is embedded using:

```html
<rssapp-wall id="YOUR_FEED_ID"></rssapp-wall>
```

The widget automatically:
- Fetches latest videos from your feed
- Displays them in a grid layout
- Updates based on your feed's update frequency
- Matches your dark theme styling

## ✅ Checklist

- [ ] RSS.app account created
- [ ] All 9 category feeds created
- [ ] Feed IDs copied from RSS.app dashboard
- [ ] Feed IDs added to `YouTubePage.tsx`
- [ ] Environment variable set (optional)
- [ ] Tested each category filter
- [ ] Verified videos are loading correctly

## 🐛 Troubleshooting

**Widget not loading?**
- Check feed ID is correct (no URLs, just the ID)
- Verify feed is active in RSS.app dashboard
- Check browser console for errors

**Videos not showing?**
- Ensure feed has videos in RSS.app dashboard
- Check feed update frequency (may take 2-4 hours)
- Verify feed is public/shared

**Category filter not working?**
- Ensure feed IDs are correct for each category
- Check that `selectedFeed` state is updating
- Verify RSS.app widget script is loaded

