import { useState } from 'react';
import { toast } from 'sonner';

interface NewsletterSubscribeProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

export default function NewsletterSubscribe({ 
  variant = 'hero',
  className = '' 
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('🎉 Successfully subscribed to Daily AI News!');
        setEmail('');
        
        // Show success toast
        toast.success('Successfully subscribed!', {
          description: 'Check your email for confirmation.',
          duration: 5000,
        });
        
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorMsg = data.error || 'Failed to subscribe. Please try again.';
        setStatus('error');
        setMessage(errorMsg);
        
        // Show error toast
        toast.error('Subscription failed', {
          description: errorMsg,
          duration: 5000,
        });
      }
    } catch (error) {
      const errorMsg = 'An error occurred. Please try again.';
      setStatus('error');
      setMessage(errorMsg);
      
      // Show error toast
      toast.error('Subscription failed', {
        description: errorMsg,
        duration: 5000,
      });
    }
  };

  // Compact button for header
  if (variant === 'compact') {
    return (
      <button
        onClick={() => {
          const heroSection = document.getElementById('newsletter-hero');
          if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-yellow-400 text-white rounded-lg hover:opacity-90 transition-opacity font-medium ${className}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Subscribe to Daily AI News
      </button>
    );
  }

  // Hero section subscription form
  return (
    <div id="newsletter-hero" className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-purple-500/20 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">📧</span>
        <h2 className="text-3xl md:text-4xl font-bold text-white">Never Miss an Update</h2>
      </div>
      
      <p className="text-gray-300 text-lg mb-8">
        Get daily AI & tech news, curated podcasts, and exclusive insights delivered to your inbox every morning.
      </p>

      <form onSubmit={handleSubscribe} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading'}
            className="flex-1 px-6 py-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {status === 'loading' ? 'Subscribing...' : 'Subscribe to Daily AI News'}
          </button>
        </div>
        
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {message}
          </div>
        )}
      </form>

      <div className="flex items-center gap-4 text-gray-400 text-sm">
        <div className="flex items-center gap-2">
          <span>🤝</span>
          <span>Join 50,000+ readers staying ahead in AI & tech</span>
        </div>
      </div>
      
      <div className="mt-3 text-gray-500 text-sm">
        • Free forever • Unsubscribe anytime
      </div>
    </div>
  );
}

