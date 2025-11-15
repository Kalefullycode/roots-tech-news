#!/usr/bin/env node
/**
 * Newsletter Broadcast Script
 * Reads an HTML template and sends it as a broadcast via Resend
 * 
 * Usage:
 *   RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx npm run send-broadcast
 *   or
 *   RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx node scripts/send-newsletter-broadcast.js
 */

import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

// Get environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

// Configuration
const FROM_EMAIL = 'newsletter@send.rootstechnews.com';
const SUBJECT = 'Your Daily Tech Briefing';
const TEMPLATE_PATH = path.join(process.cwd(), 'newsletter_template_inlined.html');

// Validate environment variables
if (!RESEND_API_KEY) {
  console.error('❌ Error: RESEND_API_KEY environment variable is required');
  console.error('   Set it with: export RESEND_API_KEY=re_xxx');
  process.exit(1);
}

if (!RESEND_AUDIENCE_ID) {
  console.error('❌ Error: RESEND_AUDIENCE_ID environment variable is required');
  console.error('   Set it with: export RESEND_AUDIENCE_ID=xxx');
  process.exit(1);
}

// Check if template file exists
if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`❌ Error: Template file not found at ${TEMPLATE_PATH}`);
  console.error('   Please create the template file or update TEMPLATE_PATH in the script');
  process.exit(1);
}

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

async function sendBroadcast() {
  try {
    console.log('📧 Reading newsletter template...');
    const html = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

    if (!html || html.trim().length === 0) {
      throw new Error('Template file is empty');
    }

    console.log(`✅ Template loaded (${html.length} characters)`);
    console.log(`📬 Sending broadcast to audience: ${RESEND_AUDIENCE_ID}`);
    console.log(`📧 From: ${FROM_EMAIL}`);
    console.log(`📝 Subject: ${SUBJECT}`);

    const { data, error } = await resend.broadcasts.create({
      from: FROM_EMAIL,
      subject: SUBJECT,
      html: html,
      audienceId: RESEND_AUDIENCE_ID!, // Safe to use ! since we validate above
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log('✅ Broadcast sent successfully!');
    console.log(`📊 Broadcast ID: ${data?.id || 'N/A'}`);

    return { success: true, broadcastId: data?.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to send broadcast:', errorMessage);
    
    if (errorMessage.includes('403')) {
      console.error('\n💡 Tip: Check that your domain is verified in Resend dashboard');
      console.error('   https://resend.com/domains');
    }
    
    if (errorMessage.includes('401')) {
      console.error('\n💡 Tip: Check that your RESEND_API_KEY is valid');
      console.error('   https://resend.com/api-keys');
    }

    process.exit(1);
  }
}

// Run the script
sendBroadcast();

