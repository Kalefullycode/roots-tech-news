#!/bin/bash

echo "🔍 Newsletter Subscription Troubleshooting"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "1. Testing Subscription Endpoint..."
echo "-----------------------------------"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST https://rootstechnews.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}')

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $HTTP_STATUS"
echo "Response: $BODY"
echo ""

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Endpoint is working!${NC}"
elif [ "$HTTP_STATUS" = "403" ]; then
    echo -e "${RED}❌ 403 Forbidden - Domain not verified in Resend${NC}"
    echo "   → Check Resend dashboard: https://resend.com/domains"
    echo "   → Verify send.rootstechnews.com domain status"
elif [ "$HTTP_STATUS" = "500" ]; then
    echo -e "${RED}❌ 500 Server Error${NC}"
    echo "   → Check Cloudflare Functions logs"
    echo "   → Verify RESEND_API_KEY is set in Cloudflare Pages"
elif [ "$HTTP_STATUS" = "401" ]; then
    echo -e "${RED}❌ 401 Unauthorized - Invalid API Key${NC}"
    echo "   → Check RESEND_API_KEY in Cloudflare Pages environment variables"
else
    echo -e "${YELLOW}⚠️  Unexpected status: $HTTP_STATUS${NC}"
fi

echo ""
echo "2. Checking DNS Records..."
echo "-------------------------"
echo "Checking TXT records for send.rootstechnews.com..."
dig TXT send.rootstechnews.com +short 2>/dev/null || echo "Could not query DNS"

echo ""
echo "Checking MX records for send.rootstechnews.com..."
dig MX send.rootstechnews.com +short 2>/dev/null || echo "Could not query DNS"

echo ""
echo "3. Checklist:"
echo "------------"
echo "□ RESEND_API_KEY set in Cloudflare Pages?"
echo "□ Domain send.rootstechnews.com added in Resend?"
echo "□ DNS records configured correctly?"
echo "□ Domain status is 'Verified' in Resend?"
echo "□ Email 'from' address matches verified domain?"

echo ""
echo "4. Next Steps:"
echo "-------------"
echo "→ Check Resend dashboard: https://resend.com/domains"
echo "→ Check Cloudflare Pages logs: Dashboard → Functions → Logs"
echo "→ Verify DNS records in Cloudflare: DNS → Records"
echo "→ Test with a real email address you control"

