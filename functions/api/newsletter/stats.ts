/// <reference types="@cloudflare/workers-types" />

import { NewsletterManager } from '../../services/newsletter-manager';

interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID?: string;
  ADMIN_API_KEY?: string;
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    const newsletter = new NewsletterManager(RESEND_API_KEY, RESEND_AUDIENCE_ID);
    const stats = await newsletter.getStats();

    return new Response(
      JSON.stringify({ 
        success: true, 
        ...stats 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  } catch (error: unknown) {
    console.error('Stats error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to get statistics',
        message: errorMessage 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

