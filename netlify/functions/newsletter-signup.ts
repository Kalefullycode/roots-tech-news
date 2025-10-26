import { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation schema
const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional(), // Track where signup came from (sidebar, footer, etc.)
});

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse and validate request body
    const body = JSON.parse(event.body || '{}');
    const { email, source } = emailSchema.parse(body);

    // Send welcome email using Resend
    const { data, error } = await resend.emails.send({
      from: 'RootsTechNews <newsletter@rootstechnews.com>', // Replace with your verified domain
      to: [email],
      subject: '🚀 Welcome to RootsTechNews - Your AI & Tech Newsletter',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                text-align: center;
                color: white;
              }
              .header h1 {
                margin: 0;
                font-size: 32px;
                font-weight: 800;
                letter-spacing: -0.5px;
              }
              .header p {
                margin: 10px 0 0;
                font-size: 16px;
                opacity: 0.9;
              }
              .content {
                padding: 40px 30px;
              }
              .content h2 {
                color: #667eea;
                font-size: 24px;
                margin-top: 0;
              }
              .features {
                background: #f7f8fc;
                border-radius: 12px;
                padding: 20px;
                margin: 30px 0;
              }
              .feature {
                display: flex;
                align-items: center;
                margin: 15px 0;
              }
              .feature-icon {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                margin-right: 15px;
                flex-shrink: 0;
              }
              .feature-text {
                font-size: 15px;
                color: #555;
              }
              .cta {
                text-align: center;
                margin: 30px 0;
              }
              .cta a {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 15px 40px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                transition: transform 0.2s;
              }
              .cta a:hover {
                transform: scale(1.05);
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #999;
                font-size: 13px;
                border-top: 1px solid #eee;
              }
              .social-links {
                margin: 20px 0;
              }
              .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #667eea;
                text-decoration: none;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 RootsTechNews</h1>
                <p>Illuminating the Future of Technology</p>
              </div>
              
              <div class="content">
                <h2>Welcome to the Future! 👋</h2>
                
                <p>Thank you for joining RootsTechNews! You've just taken a step into the most exciting frontier of technology and innovation.</p>
                
                <div class="features">
                  <div class="feature">
                    <div class="feature-icon">🤖</div>
                    <div class="feature-text">
                      <strong>AI News & Insights</strong><br>
                      Latest breakthroughs in artificial intelligence
                    </div>
                  </div>
                  
                  <div class="feature">
                    <div class="feature-icon">🎧</div>
                    <div class="feature-text">
                      <strong>Curated Podcasts</strong><br>
                      Top AI & tech podcasts delivered to your inbox
                    </div>
                  </div>
                  
                  <div class="feature">
                    <div class="feature-icon">🚀</div>
                    <div class="feature-text">
                      <strong>Startup Spotlight</strong><br>
                      Discover the next unicorns and disruptors
                    </div>
                  </div>
                  
                  <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <div class="feature-text">
                      <strong>Security Updates</strong><br>
                      Stay ahead of cyber threats and vulnerabilities
                    </div>
                  </div>
                </div>
                
                <p>You'll receive our weekly digest every Sunday with:</p>
                <ul>
                  <li>Top 10 AI & tech stories of the week</li>
                  <li>Must-listen podcast episodes</li>
                  <li>Trending GitHub repos and tools</li>
                  <li>Exclusive insights and analysis</li>
                </ul>
                
                <div class="cta">
                  <a href="https://rootstechnews.com">Explore RootsTechNews</a>
                </div>
                
                <p style="color: #999; font-size: 14px; margin-top: 40px;">
                  <strong>Pro Tip:</strong> Add newsletter@rootstechnews.com to your contacts to ensure our emails land in your primary inbox.
                </p>
              </div>
              
              <div class="footer">
                <div class="social-links">
                  <a href="https://twitter.com/rootstechnews">Twitter</a> •
                  <a href="https://linkedin.com/company/rootstechnews">LinkedIn</a> •
                  <a href="https://rootstechnews.com">Website</a>
                </div>
                
                <p>
                  © 2024 RootsTechNews. All rights reserved.<br>
                  <a href="https://rootstechnews.com/privacy" style="color: #667eea;">Privacy Policy</a> •
                  <a href="https://rootstechnews.com" style="color: #667eea;">Unsubscribe</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome to RootsTechNews! 🚀

Thank you for joining our newsletter. You're now part of a community exploring the cutting edge of AI and technology.

What you'll receive:
- Weekly AI & tech news digest
- Curated podcast recommendations  
- Startup spotlights and funding news
- Security updates and insights

Visit us at: https://rootstechnews.com

---
© 2024 RootsTechNews
Privacy Policy: https://rootstechnews.com/privacy
      `.trim(),
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to send confirmation email',
          details: error 
        }),
      };
    }

    // TODO: Add email to your mailing list database or service (Mailchimp, ConvertKit, etc.)
    // For now, just send the welcome email

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed! Check your email for confirmation.',
        emailId: data?.id,
      }),
    };

  } catch (error: any) {
    console.error('Newsletter signup error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid email address',
          details: error.errors,
        }),
      };
    }

    // Handle other errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};

