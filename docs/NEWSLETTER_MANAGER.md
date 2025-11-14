# Newsletter Manager Documentation

## Overview

The Newsletter Manager is a complete newsletter integration system for Roots Tech News, adapted for Cloudflare Pages Functions. It provides professional email templates and full Resend API integration.

## Features

- ✅ **Welcome Emails** - Beautiful HTML templates for new subscribers
- ✅ **Daily Digests** - Curated tech news newsletters
- ✅ **Breaking News Alerts** - Real-time breaking news notifications
- ✅ **Promotional Emails** - Special offers and deals
- ✅ **Subscriber Management** - Integration with Resend Audiences
- ✅ **Statistics** - Subscriber count and audience information

## API Endpoints

### 1. Subscribe (`POST /api/newsletter/subscribe`)

Subscribe a new user and send welcome email.

**Request:**
```json
{
  "email": "user@example.com",
  "firstName": "John" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed! Check your email for confirmation.",
  "contactId": "contact-id-here"
}
```

### 2. Newsletter Stats (`GET /api/newsletter/stats`)

Get subscriber statistics.

**Response:**
```json
{
  "success": true,
  "totalSubscribers": 1250,
  "audienceId": "audience-uuid",
  "audienceName": "Roots Tech News Subscribers"
}
```

### 3. Send Broadcast (`POST /api/newsletter/broadcast`)

Send newsletter broadcasts (daily digest, breaking news, or promotional).

**Request:**
```json
{
  "type": "daily", // "daily" | "breaking" | "promotional"
  "content": {
    "featuredArticle": {
      "title": "OpenAI Announces GPT-5",
      "description": "Revolutionary AI model...",
      "imageUrl": "https://example.com/image.jpg",
      "link": "https://rootstechnews.com/article/gpt-5"
    },
    "trendingStories": [
      {
        "rank": 1,
        "title": "Apple Vision Pro 2 Specs Leaked",
        "category": "Tech",
        "link": "https://rootstechnews.com/apple-vision-pro-2"
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "broadcastId": "broadcast-id-here",
  "message": "Daily newsletter sent successfully!"
}
```

## Email Templates

### Welcome Email
- Beautiful gradient header
- Personalized greeting (if firstName provided)
- Feature highlights
- Call-to-action button
- Unsubscribe link

### Daily Digest
- Featured article with image
- Trending stories list
- Date header
- Category badges

### Breaking News
- Alert-style header
- Prominent headline
- Summary text
- Read more button

### Promotional
- Offer title
- Price comparison (if originalPrice provided)
- Benefits list
- Call-to-action button

## Usage Examples

### Subscribe a User

```typescript
import { NewsletterManager } from './services/newsletter-manager';

const newsletter = new NewsletterManager(
  process.env.RESEND_API_KEY!,
  process.env.RESEND_AUDIENCE_ID
);

const result = await newsletter.subscribe('user@example.com', 'John');
console.log(result.message);
```

### Send Daily Newsletter

```typescript
const content: NewsletterContent = {
  featuredArticle: {
    title: 'OpenAI Announces GPT-5',
    description: 'Revolutionary AI model demonstrates...',
    imageUrl: 'https://example.com/image.jpg',
    link: 'https://rootstechnews.com/article/gpt-5'
  },
  trendingStories: [
    {
      rank: 1,
      title: 'Apple Vision Pro 2 Specs Leaked',
      category: 'Tech',
      link: 'https://rootstechnews.com/apple-vision-pro-2'
    }
  ]
};

const result = await newsletter.sendDailyNewsletter(content);
```

### Send Breaking News

```typescript
const content: NewsletterContent = {
  breakingNews: {
    headline: 'Major Tech Company Announces Breakthrough',
    summary: 'Details about the announcement...',
    link: 'https://rootstechnews.com/breaking-news'
  }
};

const result = await newsletter.sendBreakingNews(content);
```

### Send Promotional Email

```typescript
const content: NewsletterContent = {
  promotion: {
    title: '50% Off Premium Subscription',
    description: 'Limited time offer for newsletter subscribers',
    originalPrice: '$99',
    discountPrice: '$49',
    benefits: [
      'Access to premium articles',
      'Ad-free experience',
      'Early access to new features'
    ],
    ctaText: 'Claim Offer',
    ctaLink: 'https://rootstechnews.com/premium'
  }
};

const result = await newsletter.sendPromotional(content);
```

## Environment Variables

Required:
- `RESEND_API_KEY` - Your Resend API key

Optional:
- `RESEND_AUDIENCE_ID` - Resend Audience ID for managing subscribers (required for broadcasts)

## File Structure

```
functions/
├── services/
│   └── newsletter-manager.ts    # Main NewsletterManager class
└── api/
    └── newsletter/
        ├── subscribe.ts          # Subscription endpoint
        ├── unsubscribe.ts        # Unsubscribe endpoint
        ├── stats.ts              # Statistics endpoint
        └── broadcast.ts          # Broadcast endpoint
```

## Notes

- All email templates use inline CSS for maximum compatibility
- Templates are mobile-responsive
- Unsubscribe links are included in all emails
- The system gracefully handles missing audience ID (subscriptions still work, broadcasts require it)
- Email addresses are validated before sending
- Duplicate subscriptions are handled gracefully

## Testing

Test the endpoints using curl:

```bash
# Subscribe
curl -X POST https://rootstechnews.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test"}'

# Get Stats
curl https://rootstechnews.com/api/newsletter/stats

# Send Daily Newsletter (requires RESEND_AUDIENCE_ID)
curl -X POST https://rootstechnews.com/api/newsletter/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "type": "daily",
    "content": {
      "featuredArticle": {
        "title": "Test Article",
        "description": "Test description",
        "imageUrl": "https://example.com/image.jpg",
        "link": "https://rootstechnews.com/test"
      }
    }
  }'
```

