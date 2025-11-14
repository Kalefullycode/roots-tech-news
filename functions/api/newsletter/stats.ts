/// <reference types="@cloudflare/workers-types" />

import { NewsletterManager } from '../../services/newsletter-manager';

interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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

