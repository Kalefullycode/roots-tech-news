/// <reference types="@cloudflare/workers-types" />

interface Env {
  RESEND_API_KEY: string;
}

interface RequestBody {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
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
    // Parse request body
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

    const { to, subject, html, text, from } = body;

    // Validate required fields
    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to and subject are required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipients = Array.isArray(to) ? to : [to];
    for (const email of recipients) {
      if (!emailRegex.test(email.trim())) {
        return new Response(
          JSON.stringify({ error: `Invalid email address: ${email}` }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
    }

    // Get environment variables
    const RESEND_API_KEY = context.env.RESEND_API_KEY;

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

    // Send email via Resend
    let emailResponse: Response;
    try {
      const emailPayload: any = {
        from: from || 'Roots Tech News <onboarding@resend.dev>',
        to: recipients,
        subject: subject,
      };

      if (html) {
        emailPayload.html = html;
      }
      if (text) {
        emailPayload.text = text;
      }
      if (!html && !text) {
        return new Response(
          JSON.stringify({ error: 'Either html or text content is required' }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
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
      try {
        errorText = await emailResponse.text();
      } catch (textError) {
        console.error('Failed to read error response:', textError);
      }
      
      console.error('Resend Email API error:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        error: errorText
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: emailResponse.status === 401 ? 'Invalid API key' : 'Email service error'
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
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Email sent successfully',
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
        message: 'Email sent successfully',
        emailId: emailData.id
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: unknown) {
    console.error('Send email error:', error);
    
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

