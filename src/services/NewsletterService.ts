/**
 * Newsletter Service
 * Handles newsletter subscription via Netlify serverless function
 */

interface NewsletterResponse {
  success: boolean;
  message: string;
  emailId?: string;
  error?: string;
}

export class NewsletterService {
  private static readonly ENDPOINT = '/.netlify/functions/subscribe';

  /**
   * Subscribe to newsletter
   */
  static async subscribe(email: string, source: string = 'sidebar'): Promise<NewsletterResponse> {
    try {
      // Basic email validation
      if (!email || !this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address',
        };
      }

      const response = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to subscribe. Please try again.',
        };
      }

      return {
        success: true,
        message: data.message || 'Successfully subscribed! Check your email.',
        emailId: data.emailId,
      };

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default NewsletterService;

