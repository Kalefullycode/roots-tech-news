# Quick Start: Send Newsletter Broadcast

## Prerequisites

1. **Get your Resend API Key:**
   - Go to https://resend.com/api-keys
   - Create a new API key or copy an existing one
   - It should start with `re_`

2. **Get your Audience ID:**
   - Go to https://resend.com/audiences
   - Create an audience or select an existing one
   - Copy the Audience ID (it's a UUID)

3. **Verify your domain:**
   - Go to https://resend.com/domains
   - Make sure `send.rootstechnews.com` is verified
   - All DNS records should be green ✅

## Send Newsletter

### Option 1: Using npm script (Recommended)

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx RESEND_AUDIENCE_ID=your-audience-id-here npm run send-broadcast
```

### Option 2: Direct execution

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx RESEND_AUDIENCE_ID=your-audience-id-here npx tsx scripts/send-newsletter-broadcast.ts
```

### Option 3: Set environment variables first

```bash
# Set variables
export RESEND_API_KEY=re_xxxxxxxxxxxxx
export RESEND_AUDIENCE_ID=your-audience-id-here

# Run script
npm run send-broadcast
```

## Customize the Template

Edit `newsletter_template_inlined.html` in the project root to customize:
- Content
- Images
- Links
- Styling (all styles are inlined)

**Important:** Keep all styles inline for email compatibility. The template is already fully inlined and ready to use.

## Configuration

You can modify these values in `scripts/send-newsletter-broadcast.ts`:

- `FROM_EMAIL` - Currently: `newsletter@send.rootstechnews.com`
- `SUBJECT` - Currently: `Your Daily Tech Briefing`
- `TEMPLATE_PATH` - Currently: `newsletter_template_inlined.html` in project root

## Expected Output

```
📧 Reading newsletter template...
✅ Template loaded (5421 characters)
📬 Sending broadcast to audience: abc123-def456-ghi789
📧 From: newsletter@send.rootstechnews.com
📝 Subject: Your Daily Tech Briefing
✅ Broadcast sent successfully!
📊 Broadcast ID: broadcast_xyz789
```

## Troubleshooting

### Error: "RESEND_API_KEY not configured"
- Make sure you've set the environment variable
- Verify the API key starts with `re_`

### Error: "RESEND_AUDIENCE_ID is required"
- Create an audience in Resend dashboard
- Copy the Audience ID correctly

### Error: "Domain not verified" (403)
- Go to https://resend.com/domains
- Check that `send.rootstechnews.com` is verified
- Ensure all DNS records are configured correctly

### Error: "Invalid API key" (401)
- Verify your API key at https://resend.com/api-keys
- Make sure it's active and not revoked

## Files

- **Script:** `scripts/send-newsletter-broadcast.ts`
- **Template:** `newsletter_template_inlined.html`
- **Documentation:** `scripts/README_NEWSLETTER_BROADCAST.md`

