/**
 * Complete Newsletter Integration for Roots Tech News
 * Adapted for Cloudflare Pages Functions
 * Incorporates professional email templates with Resend API
 */

import { Resend } from 'resend';

// Template types
export enum EmailTemplate {
  DAILY_DIGEST = 'daily',
  BREAKING_NEWS = 'breaking',
  PROMOTIONAL = 'promotional',
  WELCOME = 'welcome'
}

// Newsletter content interface
export interface NewsletterContent {
  featuredArticle?: {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
  };
  trendingStories?: Array<{
    rank: number;
    title: string;
    category: 'AI' | 'Tech' | 'Startups' | 'Security';
    link: string;
  }>;
  breakingNews?: {
    headline: string;
    summary: string;
    link: string;
  };
  promotion?: {
    title: string;
    description: string;
    originalPrice?: string;
    discountPrice: string;
    benefits: string[];
    ctaText: string;
    ctaLink: string;
  };
}

interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID?: string;
}

/**
 * Main Newsletter Manager Class
 */
export class NewsletterManager {
  private resend: Resend;
  private audienceId?: string;
  private fromEmail: string;

  constructor(apiKey: string, audienceId?: string) {
    this.resend = new Resend(apiKey);
    this.audienceId = audienceId;
    this.fromEmail = 'Roots Tech News <newsletter@send.rootstechnews.com>';
  }

  /**
   * Subscribe a new user and send welcome email
   */
  async subscribe(email: string, firstName?: string): Promise<{ success: boolean; message: string; contactId?: string }> {
    try {
      // Add to Resend audience if audience ID is configured
      let contactId: string | undefined;
      if (this.audienceId) {
        try {
          const contact = await this.resend.contacts.create({
            email,
            firstName,
            audienceId: this.audienceId,
          });
          contactId = contact.data?.id;
        } catch (contactError: any) {
          // If contact already exists, that's okay - continue with email send
          if (!contactError.message?.includes('already exists') && !contactError.message?.includes('409')) {
            console.warn('Failed to add contact to audience:', contactError);
          }
        }
      }

      // Send welcome email
      await this.sendWelcomeEmail(email, firstName);

      return { 
        success: true, 
        message: 'Successfully subscribed! Check your email for confirmation.',
        contactId
      };
    } catch (error: any) {
      console.error('Subscription error:', error);
      
      // Check if already subscribed
      if (error.message?.includes('already exists') || error.message?.includes('409')) {
        return { 
          success: false, 
          message: 'This email is already subscribed.' 
        };
      }
      
      return { 
        success: false, 
        message: 'Failed to subscribe. Please try again.' 
      };
    }
  }

  /**
   * Send welcome email to new subscriber
   */
  private async sendWelcomeEmail(email: string, firstName?: string) {
    const welcomeHtml = this.generateWelcomeEmail(firstName);

    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject: '🚀 Welcome to Roots Tech News!',
      html: welcomeHtml,
      tags: [
        { name: 'category', value: 'welcome' },
        { name: 'source', value: 'website-signup' }
      ]
    });

    if (error) {
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }

    return data;
  }

  /**
   * Generate welcome email HTML
   */
  private generateWelcomeEmail(firstName?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #1a1a2e; border-radius: 8px;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #8B5CF6, #FCD34D); border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">🚀 Welcome to Roots Tech News!</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 15px;">
                                ${firstName ? `Hi ${firstName}!` : 'Welcome aboard!'} 🎉
                            </h2>
                            
                            <p style="color: #a9a9a9; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                You're now part of <strong style="color: #8B5CF6;">50,000+ tech enthusiasts</strong> 
                                staying ahead in AI & technology. Here's what you'll get:
                            </p>
                            
                            <ul style="color: #a9a9a9; font-size: 16px; line-height: 1.8;">
                                <li>📰 <strong style="color: #ffffff;">Daily AI & Tech Digest</strong> - Curated news every morning</li>
                                <li>⚡ <strong style="color: #ffffff;">Breaking News Alerts</strong> - Major announcements as they happen</li>
                                <li>🎯 <strong style="color: #ffffff;">Weekly Deep Dives</strong> - In-depth analysis every Sunday</li>
                                <li>🎁 <strong style="color: #ffffff;">Exclusive Offers</strong> - Member-only deals and discounts</li>
                            </ul>
                            
                            <div style="background: #0f0f1e; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="color: #FCD34D; margin-top: 0;">📅 Your First Newsletter</h3>
                                <p style="color: #a9a9a9; margin-bottom: 0;">
                                    Your first daily digest will arrive tomorrow morning at <strong style="color: #ffffff;">7:00 AM EST</strong>.
                                    Make sure to add <strong style="color: #8B5CF6;">newsletter@send.rootstechnews.com</strong> to your contacts!
                                </p>
                            </div>
                            
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://rootstechnews.com/newsletter" 
                                           style="background: linear-gradient(to right, #8B5CF6, #FCD34D); 
                                                  color: #ffffff; 
                                                  padding: 14px 30px; 
                                                  text-decoration: none; 
                                                  border-radius: 6px; 
                                                  font-weight: bold; 
                                                  display: inline-block;">
                                            Visit Your Newsletter Hub →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                                Questions? Reply to this email or visit our 
                                <a href="https://rootstechnews.com/help" style="color: #8B5CF6;">help center</a>.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; background: #0f0f1e; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #666; font-size: 12px; margin: 0;">
                                © 2025 Roots Tech News | 
                                <a href="https://rootstechnews.com/unsubscribe" style="color: #8B5CF6;">Unsubscribe</a> | 
                                <a href="https://rootstechnews.com/privacy" style="color: #8B5CF6;">Privacy</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }

  /**
   * Send daily newsletter to all subscribers
   */
  async sendDailyNewsletter(content: NewsletterContent): Promise<{ success: boolean; broadcastId?: string; message: string }> {
    if (!this.audienceId) {
      throw new Error('RESEND_AUDIENCE_ID is required for broadcasts');
    }

    const html = this.generateDailyDigestTemplate(content);
    
    const { data, error } = await this.resend.broadcasts.create({
      from: this.fromEmail,
      subject: `📰 Today's Tech Brief: ${content.featuredArticle?.title || 'Latest Updates'}`,
      html,
      audienceId: this.audienceId,
    });

    if (error) {
      throw new Error(`Failed to send daily newsletter: ${error.message}`);
    }

    return {
      success: true,
      broadcastId: data?.id,
      message: 'Daily newsletter sent successfully!'
    };
  }

  /**
   * Send breaking news alert
   */
  async sendBreakingNews(content: NewsletterContent): Promise<{ success: boolean; broadcastId?: string; message: string }> {
    if (!this.audienceId) {
      throw new Error('RESEND_AUDIENCE_ID is required for broadcasts');
    }

    if (!content.breakingNews) {
      throw new Error('Breaking news content is required');
    }

    const html = this.generateBreakingNewsTemplate(content);
    
    const { data, error } = await this.resend.broadcasts.create({
      from: this.fromEmail,
      subject: `🚨 BREAKING: ${content.breakingNews.headline}`,
      html,
      audienceId: this.audienceId,
    });

    if (error) {
      throw new Error(`Failed to send breaking news: ${error.message}`);
    }

    return {
      success: true,
      broadcastId: data?.id,
      message: 'Breaking news alert sent successfully!'
    };
  }

  /**
   * Send promotional email
   */
  async sendPromotional(content: NewsletterContent): Promise<{ success: boolean; broadcastId?: string; message: string }> {
    if (!this.audienceId) {
      throw new Error('RESEND_AUDIENCE_ID is required for broadcasts');
    }

    if (!content.promotion) {
      throw new Error('Promotion content is required');
    }

    const html = this.generatePromotionalTemplate(content);
    
    const { data, error } = await this.resend.broadcasts.create({
      from: this.fromEmail,
      subject: `🎁 ${content.promotion.title || 'Special Offer Inside'}`,
      html,
      audienceId: this.audienceId,
    });

    if (error) {
      throw new Error(`Failed to send promotional email: ${error.message}`);
    }

    return {
      success: true,
      broadcastId: data?.id,
      message: 'Promotional email sent successfully!'
    };
  }

  /**
   * Generate daily digest email template
   */
  private generateDailyDigestTemplate(content: NewsletterContent): string {
    const featured = content.featuredArticle;
    const trending = content.trendingStories || [];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #1a1a2e; border-radius: 8px;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #8B5CF6, #FCD34D); border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">📰 Today's Tech Brief</h1>
                            <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </td>
                    </tr>
                    
                    ${featured ? `
                    <!-- Featured Article -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 15px;">🔥 Featured Story</h2>
                            <a href="${featured.link}" style="text-decoration: none; color: inherit;">
                                <img src="${featured.imageUrl}" alt="${featured.title}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;" />
                                <h3 style="color: #8B5CF6; font-size: 20px; margin: 0 0 10px;">${featured.title}</h3>
                                <p style="color: #a9a9a9; font-size: 16px; line-height: 1.6; margin: 0;">${featured.description}</p>
                            </a>
                        </td>
                    </tr>
                    ` : ''}
                    
                    ${trending.length > 0 ? `
                    <!-- Trending Stories -->
                    <tr>
                        <td style="padding: 30px; background: #0f0f1e;">
                            <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">📈 Trending Now</h2>
                            ${trending.map((story, index) => `
                                <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: ${index < trending.length - 1 ? '1px solid #2a2a3e' : 'none'};">
                                    <span style="color: #8B5CF6; font-weight: bold; margin-right: 10px;">#${story.rank}</span>
                                    <span style="color: #FCD34D; font-size: 12px; text-transform: uppercase; margin-right: 10px;">${story.category}</span>
                                    <a href="${story.link}" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500;">${story.title}</a>
                                </div>
                            `).join('')}
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; background: #0f0f1e; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #666; font-size: 12px; margin: 0;">
                                © 2025 Roots Tech News | 
                                <a href="https://rootstechnews.com/unsubscribe" style="color: #8B5CF6;">Unsubscribe</a> | 
                                <a href="https://rootstechnews.com/privacy" style="color: #8B5CF6;">Privacy</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }

  /**
   * Generate breaking news email template
   */
  private generateBreakingNewsTemplate(content: NewsletterContent): string {
    const breaking = content.breakingNews!;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #1a1a2e; border-radius: 8px;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #EF4444, #F59E0B); border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">🚨 BREAKING NEWS</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #ffffff; font-size: 28px; margin-bottom: 20px;">${breaking.headline}</h2>
                            <p style="color: #a9a9a9; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">${breaking.summary}</p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${breaking.link}" 
                                           style="background: linear-gradient(to right, #EF4444, #F59E0B); 
                                                  color: #ffffff; 
                                                  padding: 14px 30px; 
                                                  text-decoration: none; 
                                                  border-radius: 6px; 
                                                  font-weight: bold; 
                                                  display: inline-block;">
                                            Read Full Story →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; background: #0f0f1e; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #666; font-size: 12px; margin: 0;">
                                © 2025 Roots Tech News | 
                                <a href="https://rootstechnews.com/unsubscribe" style="color: #8B5CF6;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }

  /**
   * Generate promotional email template
   */
  private generatePromotionalTemplate(content: NewsletterContent): string {
    const promo = content.promotion!;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #1a1a2e; border-radius: 8px;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #8B5CF6, #FCD34D); border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">🎁 ${promo.title}</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <p style="color: #a9a9a9; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">${promo.description}</p>
                            
                            ${promo.originalPrice ? `
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="color: #666; text-decoration: line-through; font-size: 24px; margin-right: 10px;">${promo.originalPrice}</span>
                                <span style="color: #FCD34D; font-size: 32px; font-weight: bold;">${promo.discountPrice}</span>
                            </div>
                            ` : `
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="color: #FCD34D; font-size: 32px; font-weight: bold;">${promo.discountPrice}</span>
                            </div>
                            `}
                            
                            <ul style="color: #a9a9a9; font-size: 16px; line-height: 1.8; margin: 20px 0;">
                                ${promo.benefits.map(benefit => `<li style="margin-bottom: 10px;">✓ ${benefit}</li>`).join('')}
                            </ul>
                            
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${promo.ctaLink}" 
                                           style="background: linear-gradient(to right, #8B5CF6, #FCD34D); 
                                                  color: #ffffff; 
                                                  padding: 14px 30px; 
                                                  text-decoration: none; 
                                                  border-radius: 6px; 
                                                  font-weight: bold; 
                                                  display: inline-block;">
                                            ${promo.ctaText} →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; background: #0f0f1e; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #666; font-size: 12px; margin: 0;">
                                © 2025 Roots Tech News | 
                                <a href="https://rootstechnews.com/unsubscribe" style="color: #8B5CF6;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }

  /**
   * Get subscriber statistics
   */
  async getStats(): Promise<{ totalSubscribers: number; audienceId?: string; audienceName?: string }> {
    if (!this.audienceId) {
      return {
        totalSubscribers: 0,
        audienceId: undefined,
        audienceName: 'No audience configured'
      };
    }

    try {
      const audience = await this.resend.audiences.get(this.audienceId);
      return {
        totalSubscribers: audience.data?.totalCount || 0,
        audienceId: this.audienceId,
        audienceName: audience.data?.name || 'Unknown'
      };
    } catch (error: any) {
      console.error('Failed to get stats:', error);
      return {
        totalSubscribers: 0,
        audienceId: this.audienceId,
        audienceName: 'Error fetching stats'
      };
    }
  }
}

