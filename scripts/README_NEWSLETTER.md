# Roots Tech News Newsletter Broadcast

Send newsletter broadcasts to your Resend audience using a simple Node.js script.

## 📋 Prerequisites

1. **Resend Account** - Sign up at [resend.com](https://resend.com)
2. **API Key** - Get from [resend.com/api-keys](https://resend.com/api-keys)
3. **Audience** - Create at [resend.com/audiences](https://resend.com/audiences)
4. **Verified Domain** - Verify `rootstechnews.com` at [resend.com/domains](https://resend.com/domains)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `resend` - Resend SDK for Node.js
- `dotenv` - Environment variable management

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_AUDIENCE_ID=your-audience-id-here
```

**Or** set environment variables directly:

```bash
export RESEND_API_KEY=re_xxxxxxxxxxxxx
export RESEND_AUDIENCE_ID=your-audience-id-here
```

### 3. Send Newsletter

```bash
# Using npm script
npm run send-newsletter

# Or directly with node
node scripts/send-newsletter.js
```

## 📧 Newsletter Template

The script reads from `newsletter_template_inlined.html` which includes:

- ✅ Dark theme (#0a0a0a background)
- ✅ Purple to yellow gradient buttons (#8B5CF6 → #FCD34D)
- ✅ Featured article section with image
- ✅ Trending stories (4 items) with category badges
- ✅ Category badges:
  - AI: Green (#10B981)
  - Tech: Blue (#3B82F6)
  - Startups: Orange (#F97316)
  - Security: Pink (#EC4899)
- ✅ Mobile-responsive design
- ✅ Email-safe HTML with inline CSS
- ✅ Resend unsubscribe link: `{{{RESEND_UNSUBSCRIBE_URL}}}`

## 🎨 Customizing Content

### Update Template

Edit `newsletter_template_inlined.html` to customize:
- Featured article content
- Trending stories
- Images and links
- Colors and styling

**Important:** Keep all CSS inline for email compatibility.

### Update Script Configuration

Edit `scripts/send-newsletter.js` to change:

```javascript
const CONFIG = {
  from: 'Roots Tech News <newsletter@rootstechnews.com>',
  replyTo: 'hello@rootstechnews.com',
  subjectPrefix: '🚀 Your Daily Tech Briefing',
  templatePath: path.join(__dirname, '..', 'newsletter_template_inlined.html'),
};
```

## 📝 Script Features

- ✅ Automatic date formatting in subject line
- ✅ Template validation
- ✅ Environment variable validation
- ✅ Error handling with helpful tips
- ✅ Console logging for debugging
- ✅ UUID format validation for Audience ID

## 🔍 Troubleshooting

### Error: "RESEND_API_KEY is required"

**Solution:** Set the environment variable:
```bash
export RESEND_API_KEY=re_xxxxxxxxxxxxx
```

Or create a `.env` file with your credentials.

### Error: "RESEND_AUDIENCE_ID is required"

**Solution:** Get your Audience ID from:
1. Go to https://resend.com/audiences
2. Select your audience
3. Copy the Audience ID (UUID format)

### Error: "Domain not verified" (403)

**Solution:** 
1. Go to https://resend.com/domains
2. Verify `rootstechnews.com` domain
3. Add required DNS records:
   - DKIM: `resend._domainkey.send`
   - SPF: Include `include:resend.com`
   - MX: Mail server from Resend

### Error: "Invalid API key" (401)

**Solution:**
1. Verify your API key at https://resend.com/api-keys
2. Make sure it starts with `re_`
3. Check that the key is active (not revoked)

### Error: "invalid input syntax for type uuid"

**Solution:** Your Audience ID format is incorrect. It should be:
- Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Only contains: `0-9` and `a-f`
- Example: `a35eb466-614c-46d8-830b-0ae8108177c8`

## 📊 Expected Output

```
📧 Roots Tech News Newsletter Broadcast
==================================================

🔍 Validating configuration...
✅ Configuration valid

📄 Reading HTML template...
✅ Template loaded (14,275 characters)

🔌 Initializing Resend client...
✅ Resend client initialized

📬 Broadcast Details:
   From: Roots Tech News <newsletter@rootstechnews.com>
   Reply-To: hello@rootstechnews.com
   Subject: 🚀 Your Daily Tech Briefing - Monday, January 15, 2025
   Audience ID: a35eb466-614c-46d8-830b-0ae8108177c8

🚀 Sending broadcast...

✅ Broadcast sent successfully!
==================================================
📊 Broadcast ID: broadcast_xyz789
📅 Date: Monday, January 15, 2025
📧 Sent to audience: a35eb466-614c-46d8-830b-0ae8108177c8

💡 Check your Resend dashboard for delivery status:
   https://resend.com/broadcasts
```

## 🔐 Security Notes

- ⚠️ **Never commit `.env` file** - It contains sensitive credentials
- ✅ `.env` is already in `.gitignore`
- ✅ Use environment variables in production
- ✅ Rotate API keys regularly

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Broadcasts API](https://resend.com/docs/api-reference/broadcasts/create)
- [Email HTML Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding/)

## 🛠️ Development

### Test Locally

```bash
# Set test credentials
export RESEND_API_KEY=re_test_xxxxx
export RESEND_AUDIENCE_ID=test-audience-id

# Run script
node scripts/send-newsletter.js
```

### Debug Mode

The script includes detailed console logging. To see more details, check:
- Template file path
- Environment variable values (masked)
- API response details

## 📦 Files

- `scripts/send-newsletter.js` - Main script
- `newsletter_template_inlined.html` - Email template
- `.env.example` - Environment variable template
- `scripts/README_NEWSLETTER.md` - This file

## ✅ Checklist Before Sending

- [ ] Resend API key is set and valid
- [ ] Audience ID is correct (UUID format)
- [ ] Domain is verified in Resend
- [ ] Template content is updated
- [ ] All links in template are correct
- [ ] Images are hosted and accessible
- [ ] Test send to yourself first (optional)

---

**Need Help?** Check the [Resend Support](https://resend.com/support) or review the error messages in the console output.

