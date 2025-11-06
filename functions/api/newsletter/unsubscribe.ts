/// <reference types="@cloudflare/workers-types" />

/**
 * Newsletter Unsubscribe API
 * File: functions/api/newsletter/unsubscribe.ts
 * Endpoint: /api/newsletter/unsubscribe
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

    // Debug logging
    console.log('Unsubscribe request received');
    console.log('Email:', email);

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

    // Get Resend API key from environment
    const RESEND_API_KEY = context.env.RESEND_API_KEY;

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

    // TODO: If you have a database, mark the email as unsubscribed here
    // For now, we'll just return success
    // Example:
    // await db.newsletterSubscribers.update({
    //   where: { email },
    //   data: { unsubscribed: true, unsubscribedAt: new Date() }
    // });

    // Send confirmation email
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Roots Tech News <onboarding@resend.dev>',
          to: [email],
          subject: 'You\'ve been unsubscribed from Roots Tech News',
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
                    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
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
                  <h1>You've Been Unsubscribed</h1>
                </div>
                
                <div class="content">
                  <p>We're sorry to see you go!</p>
                  <p>You have been successfully unsubscribed from Roots Tech News newsletter. You will no longer receive emails from us.</p>
                  
                  <p>If this was a mistake or you'd like to re-subscribe, you can do so anytime:</p>
                  <p style="text-align: center; margin: 20px 0;">
                    <a href="https://rootstechnews.com/newsletter" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                      Subscribe Again
                    </a>
                  </p>
                </div>
                
                <div class="footer">
                  <p>Thank you for being part of our community.</p>
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
        console.error('Failed to send unsubscribe confirmation email');
      }
    } catch (emailError) {
      console.error('Error sending unsubscribe email:', emailError);
      // Continue even if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'You have been successfully unsubscribed.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    
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

