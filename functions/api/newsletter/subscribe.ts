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
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await context.request.json() as RequestBody;
    const { email } = body;

    // Validate email with regex
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = context.env.RESEND_AUDIENCE_ID;

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Add contact to Resend audience if audience ID is configured
    if (RESEND_AUDIENCE_ID) {
      try {
        const contactResponse = await fetch('https://api.resend.com/audiences/' + RESEND_AUDIENCE_ID + '/contacts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
          }),
        });

        if (!contactResponse.ok) {
          const errorText = await contactResponse.text();
          console.error('Resend Contacts API error:', errorText);
          
          // If contact already exists (409), that's okay - continue
          if (contactResponse.status !== 409) {
            // For other errors, log but continue to send welcome email
            console.warn('Failed to add contact to audience, but continuing with email send');
          }
        } else {
          const contactData = await contactResponse.json();
          console.log('Contact added to audience:', contactData);
        }
      } catch (contactError) {
        console.error('Error adding contact to audience:', contactError);
        // Continue with email send even if audience add fails
      }
    }

    // Send welcome email
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Roots Tech News <onboarding@resend.dev>',
        to: [email],
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

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend Email API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const emailData = await emailResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true,
        message: '✅ Successfully subscribed! Check your email.',
        emailId: emailData.id
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to subscribe' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};
