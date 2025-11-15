#!/usr/bin/env node
/**
 * Roots Tech News Newsletter Broadcast Script
 * Sends newsletter broadcasts using Resend's Broadcast API
 * 
 * Usage:
 *   node scripts/send-newsletter.js
 *   or
 *   npm run send-newsletter
 * 
 * Requires environment variables:
 *   - RESEND_API_KEY: Your Resend API key (starts with re_)
 *   - RESEND_AUDIENCE_ID: Your Resend Audience ID (UUID)
 */

require('dotenv').config();
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  from: 'Roots Tech News <newsletter@rootstechnews.com>',
  replyTo: 'hello@rootstechnews.com',
  templatePath: path.join(__dirname, '..', 'newsletter_template_inlined.html'),
  subjectPrefix: '🚀 Your Daily Tech Briefing',
  // You can override these with environment variables if needed
  audienceId: process.env.RESEND_AUDIENCE_ID,
};

// Get today's date in readable format
function getTodayDate() {
  const today = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return today.toLocaleDateString('en-US', options);
}

// Validate environment variables
function validateEnv() {
  const errors = [];
  
  if (!process.env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is required');
  } else if (!process.env.RESEND_API_KEY.startsWith('re_')) {
    errors.push('RESEND_API_KEY must start with "re_"');
  }
  
  if (!process.env.RESEND_AUDIENCE_ID) {
    errors.push('RESEND_AUDIENCE_ID is required');
  } else {
    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(process.env.RESEND_AUDIENCE_ID)) {
      errors.push('RESEND_AUDIENCE_ID must be a valid UUID');
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration Errors:');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error('\n💡 Tip: Create a .env file or set environment variables:');
    console.error('   RESEND_API_KEY=re_xxxxxxxxxxxxx');
    console.error('   RESEND_AUDIENCE_ID=your-audience-id-here');
    process.exit(1);
  }
}

// Read HTML template
function readTemplate() {
  try {
    if (!fs.existsSync(CONFIG.templatePath)) {
      throw new Error(`Template file not found: ${CONFIG.templatePath}`);
    }
    
    const html = fs.readFileSync(CONFIG.templatePath, 'utf-8');
    
    if (!html || html.trim().length === 0) {
      throw new Error('Template file is empty');
    }
    
    // Replace date placeholder if it exists
    const htmlWithDate = html.replace(/\{\{DATE\}\}/g, getTodayDate());
    
    return htmlWithDate;
  } catch (error) {
    console.error(`❌ Error reading template: ${error.message}`);
    process.exit(1);
  }
}

// Send newsletter broadcast
async function sendNewsletter() {
  try {
    console.log('📧 Roots Tech News Newsletter Broadcast');
    console.log('=' .repeat(50));
    
    // Validate environment
    console.log('\n🔍 Validating configuration...');
    validateEnv();
    console.log('✅ Configuration valid');
    
    // Read template
    console.log('\n📄 Reading HTML template...');
    const html = readTemplate();
    console.log(`✅ Template loaded (${html.length.toLocaleString()} characters)`);
    
    // Initialize Resend
    console.log('\n🔌 Initializing Resend client...');
    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend client initialized');
    
    // Prepare broadcast data
    const todayDate = getTodayDate();
    const subject = `${CONFIG.subjectPrefix} - ${todayDate}`;
    
    console.log('\n📬 Broadcast Details:');
    console.log(`   From: ${CONFIG.from}`);
    console.log(`   Reply-To: ${CONFIG.replyTo}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Audience ID: ${process.env.RESEND_AUDIENCE_ID}`);
    
    // Send broadcast
    console.log('\n🚀 Sending broadcast...');
    const { data, error } = await resend.broadcasts.create({
      from: CONFIG.from,
      replyTo: CONFIG.replyTo,
      subject: subject,
      html: html,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });
    
    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }
    
    // Success
    console.log('\n✅ Broadcast sent successfully!');
    console.log('=' .repeat(50));
    console.log(`📊 Broadcast ID: ${data?.id || 'N/A'}`);
    console.log(`📅 Date: ${todayDate}`);
    console.log(`📧 Sent to audience: ${process.env.RESEND_AUDIENCE_ID}`);
    console.log('\n💡 Check your Resend dashboard for delivery status:');
    console.log('   https://resend.com/broadcasts');
    
    return {
      success: true,
      broadcastId: data?.id,
      date: todayDate,
    };
    
  } catch (error) {
    console.error('\n❌ Failed to send newsletter broadcast');
    console.error('=' .repeat(50));
    console.error(`Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('403')) {
      console.error('\n💡 Tip: Check that your domain is verified in Resend');
      console.error('   https://resend.com/domains');
    } else if (error.message.includes('401')) {
      console.error('\n💡 Tip: Verify your RESEND_API_KEY is correct');
      console.error('   https://resend.com/api-keys');
    } else if (error.message.includes('invalid input syntax for type uuid')) {
      console.error('\n💡 Tip: Check that RESEND_AUDIENCE_ID is a valid UUID');
      console.error('   Get it from: https://resend.com/audiences');
    }
    
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  sendNewsletter()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { sendNewsletter, getTodayDate };

