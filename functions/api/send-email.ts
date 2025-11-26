/// <reference types="@cloudflare/workers-types" />
import { Resend } from "resend";

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

    // Validate that either html or text is provided
    if (!html && !text) {
      return new Response(
        JSON.stringify({ error: 'Either html or text content is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
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

    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);

    // Send email via Resend SDK
    try {
      const emailPayload: Record<string, unknown> = {
        from: from || 'Roots Tech News <newsletter@send.rootstechnews.com>',
        to: recipients,
        subject: subject,
      };

      if (html) {
        emailPayload.html = html;
      }
      if (text) {
        emailPayload.text = text;
      }

      const { data, error } = await resend.emails.send(emailPayload);

      if (error) {
        console.error('Resend API error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to send email',
            details: error.message || 'Email service error'
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Email sent successfully',
          emailId: data?.id
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    } catch (sendError) {
      console.error('Failed to send email:', sendError);
      const errorMessage = sendError instanceof Error 
        ? sendError.message 
        : 'Failed to connect to email service. Please try again later.';
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: errorMessage
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

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

