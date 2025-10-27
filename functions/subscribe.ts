// Cloudflare Pages Function
import { Resend } from 'resend';

const AUDIENCE_ID = '35eb466a-614c-46d8-830b-0ae8108177c8';

export async function onRequestPost(context: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    // Get RESEND_API_KEY from environment variables
    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'API key not configured' 
      }), {
        status: 500,
        headers
      });
    }

    const resend = new Resend(RESEND_API_KEY);
    
    const body = await context.request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ 
        error: 'Valid email required' 
      }), {
        status: 400,
        headers
      });
    }

    // Add to Resend audience
    await resend.contacts.create({
      email: email,
      unsubscribed: false,
      audienceId: AUDIENCE_ID
    });

    // Send welcome email
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '🚀 Welcome to RootsTechNews!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 32px; font-weight: 800; }
              .content { background: #ffffff; padding: 40px 30px; }
              .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; transition: transform 0.2s; }
              .button:hover { transform: scale(1.05); }
              .feature { margin: 15px 0; padding-left: 25px; position: relative; color: #555; }
              .feature:before { content: "✓"; position: absolute; left: 0; color: #667eea; font-weight: bold; font-size: 18px; }
              .footer { padding: 30px; text-align: center; color: #666; font-size: 12px; background: #f9f9f9; border-top: 1px solid #eee; }
              .highlight-box { background: #f0f4ff; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🤖 Welcome to RootsTechNews!</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Illuminating the Future of Technology</p>
              </div>
              <div class="content">
                <p style="font-size: 18px; margin-bottom: 25px; color: #333;">Hi there! 👋</p>
                <p style="color: #555;">Thanks for subscribing to our daily AI & tech digest. You're now part of a community that stays ahead of the curve!</p>
                
                <div class="highlight-box">
                  <h3 style="margin-top: 0; color: #667eea;">📬 What you'll receive every morning at 8 AM:</h3>
                  <div class="feature">📰 Daily AI news roundup & breakthroughs</div>
                  <div class="feature">🔧 New AI tools & resources you can use today</div>
                  <div class="feature">🚀 Startup funding announcements & unicorns</div>
                  <div class="feature">🌍 Emerging market tech trends</div>
                  <div class="feature">🧠 Quantum computing & cutting-edge research</div>
                  <div class="feature">🎓 Learning guides, tutorials & best practices</div>
                </div>
                
                <p style="color: #555; margin-top: 30px;">We curate only the most important tech news so you can stay informed without the noise.</p>
                
                <center>
                  <a href="https://rootstechnews.com" class="button">Explore RootsTechNews →</a>
                </center>
                
                <div style="margin-top: 40px; padding: 20px; background: #fff8f0; border-radius: 8px; border: 1px solid #ffe4cc;">
                  <p style="margin: 0; color: #d97706; font-size: 14px;">
                    <strong>💡 Pro Tip:</strong> Add <strong>onboarding@resend.dev</strong> to your contacts to ensure our emails always land in your primary inbox!
                  </p>
                </div>
              </div>
              <div class="footer">
                <p style="margin-bottom: 15px;">Not interested anymore? You can <a href="https://rootstechnews.com/unsubscribe" style="color: #667eea; text-decoration: none;">unsubscribe anytime</a>.</p>
                <p style="margin: 10px 0;">© 2025 RootsTechNews. All rights reserved.</p>
                <p style="margin: 5px 0;">
                  <a href="https://rootstechnews.com/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">Privacy Policy</a> •
                  <a href="https://rootstechnews.com/terms" style="color: #999; text-decoration: none; margin: 0 10px;">Terms</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Successfully subscribed! Check your email.' 
    }), {
      status: 200,
      headers
    });

  } catch (error: any) {
    console.error('Newsletter error:', error);
    
    // Handle duplicate email (already subscribed)
    if (error.message?.includes('already exists') || error.message?.includes('Contact already exists')) {
      return new Response(JSON.stringify({ 
        error: 'This email is already subscribed!' 
      }), {
        status: 400,
        headers
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Failed to subscribe. Please try again.',
      details: context.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  });
}

