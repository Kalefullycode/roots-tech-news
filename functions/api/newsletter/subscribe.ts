/// <reference types="@cloudflare/workers-types" />

interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID?: string;
}

interface RequestBody {
  email: string;
  source?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // CORS headers - restrict to allowed origins
  const allowedOrigins = [
    'https://rootstechnews.com',
    'https://www.rootstechnews.com',
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  
  const origin = context.request.headers.get('Origin') || '';
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    const allowedOrigins = [
      'https://rootstechnews.com',
      'https://www.rootstechnews.com',
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    
    const origin = context.request.headers.get('Origin') || '';
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    
    return new Response(null, { 
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  try {
    // Parse request body with error handling
    let body: RequestBody;
    try {
      const rawBody = await context.request.json();
      body = rawBody as RequestBody;
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request body. Expected JSON.' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const { email } = body;

    // Validate email with regex
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Trim and validate email format
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address format' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Get environment variables
    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = context.env.RESEND_AUDIENCE_ID;

    if (!RESEND_API_KEY || typeof RESEND_API_KEY !== 'string') {
      console.error('RESEND_API_KEY is not set or invalid');
      return new Response(
        JSON.stringify({ error: 'Server configuration error. Please contact support.' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Add contact to Resend audience if audience ID is configured
    if (RESEND_AUDIENCE_ID && typeof RESEND_AUDIENCE_ID === 'string') {
      try {
        const contactResponse = await fetch(
          `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: trimmedEmail,
            }),
          }
        );

        if (!contactResponse.ok) {
          const errorText = await contactResponse.text().catch(() => 'Unknown error');
          console.error('Resend Contacts API error:', errorText);
          
          // If contact already exists (409), that's okay - continue
          if (contactResponse.status !== 409) {
            // For other errors, log but continue to send welcome email
            console.warn('Failed to add contact to audience, but continuing with email send');
          }
        } else {
          try {
            const contactData = await contactResponse.json();
            console.log('Contact added to audience:', contactData);
          } catch (jsonError) {
            console.warn('Could not parse contact response JSON');
          }
        }
      } catch (contactError) {
        console.error('Error adding contact to audience:', contactError);
        // Continue with email send even if audience add fails
      }
    }

    // Send welcome email
    let emailResponse: Response;
    try {
      emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Roots Tech News <newsletter@send.rootstechnews.com>',
          to: [trimmedEmail],
          subject: '🎉 Welcome to Roots Tech News!',
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 40px; text-align: center; border-radius: 10px; margin-bottom: 30px;">
                  <h1 style="color: white; margin: 0;">🚀 Welcome to Roots Tech News!</h1>
                </div>
                
                <div style="padding: 20px; background: #f9fafb; border-radius: 10px;">
                  <h2>Thanks for subscribing! 🎉</h2>
                  <p>You're now part of 50,000+ tech enthusiasts staying ahead in AI & technology.</p>
                  
                  <p><strong>Here's what you'll get:</strong></p>
                  <ul>
                    <li>📰 Daily AI & tech news digest</li>
                    <li>🛠️ Exclusive AI tool reviews</li>
                    <li>💰 Special deals (30-50% off)</li>
                    <li>🎓 Free tutorials & guides</li>
                    <li>🔥 Breaking news alerts</li>
                  </ul>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://rootstechnews.com" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                      Explore Latest News →
                    </a>
                  </div>
                </div>
                
                <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p>You're receiving this because you subscribed to Roots Tech News.</p>
                  <p><a href="https://rootstechnews.com">Visit Website</a> • <a href="https://rootstechnews.com/newsletter">Newsletter</a></p>
                  <p style="margin-top: 20px;"><strong>Roots Tech News</strong><br>AI & Technology News for the Real World</p>
                </div>
              </body>
            </html>
          `,
        }),
      });
    } catch (fetchError) {
      console.error('Failed to send email request:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to connect to email service. Please try again later.' 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    if (!emailResponse.ok) {
      let errorText = 'Unknown error';
      let errorJson: unknown = null;
      try {
        errorText = await emailResponse.text();
        // Try to parse as JSON
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          // Not JSON, use text as-is
        }
      } catch (textError) {
        console.error('Failed to read error response:', textError);
      }
      
      console.error('Resend Email API error:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        error: errorText,
        errorJson
      });
      
      // Provide more specific error messages
      let errorMessage = 'Email service error';
      if (emailResponse.status === 401) {
        errorMessage = 'Invalid API key - check RESEND_API_KEY environment variable';
      } else if (emailResponse.status === 403) {
        errorMessage = 'Domain not verified - verify send.rootstechnews.com in Resend dashboard';
      } else if (errorJson?.message) {
        errorMessage = errorJson.message;
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send welcome email',
          details: errorMessage,
          status: emailResponse.status,
          ...(errorJson ? { resendError: errorJson } : {})
        }),
        { 
          status: emailResponse.status >= 400 && emailResponse.status < 500 ? emailResponse.status : 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    let emailData: { id?: string };
    try {
      emailData = await emailResponse.json();
    } catch (jsonError) {
      console.error('Failed to parse email response JSON:', jsonError);
      // Still return success if email was sent but we can't parse the response
      return new Response(
        JSON.stringify({ 
          success: true,
          message: '✅ Successfully subscribed! Check your email.',
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: '✅ Successfully subscribed! Check your email.',
        emailId: emailData.id
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: unknown) {
    console.error('Newsletter subscription error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};
