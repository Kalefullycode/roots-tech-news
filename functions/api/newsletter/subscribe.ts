/// <reference types="@cloudflare/workers-types" />

/**
 * Newsletter Subscription API
 * File: functions/api/newsletter/subscribe.ts
 * Endpoint: /api/newsletter/subscribe
 * 
 * Issues fixed:
 * 1. CORS - Handled with corsHeaders
 * 2. Resend API key validation - Validates format (re_XXXXX)
 * 3. Domain verification - Uses onboarding@resend.dev temporarily
 * 4. File path - Correct: functions/api/newsletter/subscribe.ts
 * 5. Environment variable - Added logging for debugging
 */

interface Env {
  RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await context.request.json() as { email: string };
    const { email } = body;

    // Get Resend API key from environment
    const RESEND_API_KEY = context.env.RESEND_API_KEY;

    // Debug logging at the top of the function
    console.log('Newsletter signup request received');
    console.log('Email:', email);
    console.log('Has Resend key:', !!RESEND_API_KEY);
    console.log('Key starts with re_:', RESEND_API_KEY?.startsWith('re_'));

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Validate API key format (should start with 're_')
    const isValidKey = RESEND_API_KEY.startsWith('re_');
    if (!isValidKey) {
      console.error('Invalid Resend API key format. Expected format: re_XXXXX');
      return new Response(
        JSON.stringify({ error: 'Invalid API key format' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Send welcome email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Use onboarding@resend.dev temporarily until domain is verified
        from: 'Roots Tech News <onboarding@resend.dev>',
        to: [email],
        subject: '🎉 Welcome to Roots Tech News!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
                  padding: 40px 20px;
                  text-align: center;
                  border-radius: 10px;
                  margin-bottom: 30px;
                }
                .header h1 {
                  color: white;
                  margin: 0;
                  font-size: 32px;
                }
                .content {
                  padding: 20px;
                  background: #f9fafb;
                  border-radius: 10px;
                  margin-bottom: 20px;
                }
                .button {
                  display: inline-block;
                  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
                  color: white;
                  padding: 15px 30px;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: bold;
                  margin: 20px 0;
                }
                .footer {
                  text-align: center;
                  color: #6b7280;
                  font-size: 14px;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>🚀 Welcome to Roots Tech News!</h1>
              </div>
              
              <div class="content">
                <h2>Thanks for subscribing! 🎉</h2>
                <p>You're now part of our community of 50,000+ tech enthusiasts staying ahead in AI & technology.</p>
                
                <p><strong>Here's what you'll get:</strong></p>
                <ul>
                  <li>📰 Daily AI & tech news digest (every morning)</li>
                  <li>🛠️ Exclusive AI tool reviews & comparisons</li>
                  <li>💰 Special deals on AI tools (30-50% off)</li>
                  <li>🎓 Free tutorials & guides</li>
                  <li>🔥 Breaking news alerts</li>
                </ul>
                
                <center>
                  <a href="https://rootstechnews.com" class="button">Explore Latest News →</a>
                </center>
              </div>
              
              <div class="content">
                <h3>🔥 Hot Right Now:</h3>
                <p>Check out our latest content:</p>
                <ul>
                  <li><a href="https://rootstechnews.com/blog/chatgpt-vs-claude-2025">ChatGPT Plus vs Claude Pro: Which is Worth It?</a></li>
                  <li><a href="https://rootstechnews.com/videos">Live AI News Videos</a></li>
                  <li><a href="https://rootstechnews.com/resources">Top AI Tools Directory</a></li>
                </ul>
              </div>
              
              <div class="footer">
                <p>You're receiving this because you subscribed to Roots Tech News.</p>
                <p>
                  <a href="https://rootstechnews.com">Visit Website</a> • 
                  <a href="https://rootstechnews.com/newsletter">Newsletter Archive</a> • 
                  <a href="{{unsubscribe_url}}">Unsubscribe</a>
                </p>
                <p style="margin-top: 20px;">
                  <strong>Roots Tech News</strong><br>
                  AI & Technology News for the Real World
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send welcome email',
          details: errorData 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    const data = await resendResponse.json();

    // Also save to your database/audience list here
    // For now, we'll just return success
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Successfully subscribed! Check your email.',
        emailId: data.id
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
};

// Handle OPTIONS requests for CORS preflight
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};

