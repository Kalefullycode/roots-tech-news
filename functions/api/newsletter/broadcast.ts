/// <reference types="@cloudflare/workers-types" />

import { NewsletterManager, NewsletterContent, EmailTemplate } from '../../services/newsletter-manager';

interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID?: string;
  ADMIN_API_KEY?: string;
}

interface RequestBody {
  type: 'daily' | 'breaking' | 'promotional';
  content: NewsletterContent;
}

// Helper function to verify admin authentication
function verifyAdminAuth(request: Request, env: Env): boolean {
  // Check for admin API key in Authorization header or X-Admin-Key header
  const authHeader = request.headers.get('Authorization') || request.headers.get('X-Admin-Key') || '';
  const adminKey = env.ADMIN_API_KEY as string | undefined;
  
  if (!adminKey) {
    console.warn('ADMIN_API_KEY not configured - admin endpoints disabled');
    return false;
  }
  
  // Support both "Bearer <key>" and direct key
  const providedKey = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7).trim()
    : authHeader.trim();
  
  return providedKey === adminKey;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // Restrict CORS to allowed origins only
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Key',
  };

  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  // Verify admin authentication
  if (!verifyAdminAuth(context.request, context.env)) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Unauthorized. Admin API key required.' 
      }),
      { 
        status: 401, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }

  try {
    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = context.env.RESEND_AUDIENCE_ID;

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'RESEND_API_KEY not configured' 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    if (!RESEND_AUDIENCE_ID) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'RESEND_AUDIENCE_ID is required for broadcasts' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Parse request body
    let body: RequestBody;
    try {
      body = await context.request.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body. Expected JSON.' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const { type, content } = body;

    if (!type || !['daily', 'breaking', 'promotional'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid type. Must be: daily, breaking, or promotional' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const newsletter = new NewsletterManager(RESEND_API_KEY, RESEND_AUDIENCE_ID);
    
    let result;
    switch (type) {
      case 'daily':
        result = await newsletter.sendDailyNewsletter(content);
        break;
      case 'breaking':
        result = await newsletter.sendBreakingNews(content);
        break;
      case 'promotional':
        result = await newsletter.sendPromotional(content);
        break;
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  } catch (error: unknown) {
    console.error('Broadcast error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send newsletter',
        message: errorMessage 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

