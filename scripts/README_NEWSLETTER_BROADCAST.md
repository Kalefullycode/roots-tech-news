# Newsletter Broadcast Script

This script allows you to send newsletter broadcasts using Resend by reading an HTML template file.

## Setup

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Set environment variables**:
   ```bash
   export RESEND_API_KEY=re_xxxxxxxxxxxxx
   export RESEND_AUDIENCE_ID=your-audience-id-here
   ```

   Or create a `.env` file (not recommended for production):
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_AUDIENCE_ID=your-audience-id-here
   ```

## Usage

### Option 1: Using npm script
```bash
RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx npm run send-broadcast
```

### Option 2: Direct execution
```bash
RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx npx tsx scripts/send-newsletter-broadcast.ts
```

## Template File

The script reads from `newsletter_template_inlined.html` in the project root. You can customize this file with your newsletter content.

### Template Variables

You can use placeholder variables in your template (currently static, but can be extended):
- `{{DATE}}` - Current date (needs to be replaced manually or via script enhancement)

## Configuration

Edit the script (`scripts/send-newsletter-broadcast.ts`) to customize:
- `FROM_EMAIL` - Sender email address
- `SUBJECT` - Email subject line
- `TEMPLATE_PATH` - Path to your HTML template

## Getting Your Resend Credentials

1. **API Key**: 
   - Go to https://resend.com/api-keys
   - Create a new API key or use an existing one
   - Copy the key (starts with `re_`)

2. **Audience ID**:
   - Go to https://resend.com/audiences
   - Create an audience or select an existing one
   - Copy the Audience ID from the URL or settings

## Troubleshooting

### Error: "RESEND_API_KEY not configured"
- Make sure you've set the environment variable before running the script
- Verify the API key starts with `re_`

### Error: "RESEND_AUDIENCE_ID is required"
- Create an audience in Resend dashboard
- Set the environment variable with the audience ID

### Error: "Template file not found"
- Make sure `newsletter_template_inlined.html` exists in the project root
- Or update `TEMPLATE_PATH` in the script to point to your template

### Error: "Domain not verified"
- Go to https://resend.com/domains
- Verify your sending domain (`send.rootstechnews.com`)
- Ensure all DNS records are properly configured

## Example Output

```
📧 Reading newsletter template...
✅ Template loaded (5421 characters)
📬 Sending broadcast to audience: abc123-def456-ghi789
📧 From: newsletter@send.rootstechnews.com
📝 Subject: Your Daily Tech Briefing
✅ Broadcast sent successfully!
📊 Broadcast ID: broadcast_xyz789
📈 Status: queued
```

