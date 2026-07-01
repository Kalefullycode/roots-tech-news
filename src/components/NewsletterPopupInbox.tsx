import { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'rtn-newsletter-inbox-dismissed';
const STORAGE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function NewsletterPopupInbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < STORAGE_EXPIRY) return;
    }

    // Show after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
      // Trigger entrance animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => dismiss(), 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px] transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-headline"
      >
        <div
          className={`relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
            isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute right-4 top-4 z-10 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 sm:p-10">
            {status === 'success' ? (
              /* Success State */
              <div className="text-center py-6">
                <div className="flex justify-center mb-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(74, 107, 255, 0.1)' }}
                  >
                    <CheckCircle className="w-8 h-8" style={{ color: '#4A6BFF' }} />
                  </div>
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: '#1a1a2e' }}
                >
                  You're all set!
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Check your inbox to confirm your subscription.
                </p>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(74, 107, 255, 0.08)' }}
                  >
                    <Mail className="w-7 h-7" style={{ color: '#4A6BFF' }} />
                  </div>
                </div>

                {/* Headline */}
                <h2
                  id="newsletter-headline"
                  className="text-2xl font-bold text-center mb-2 tracking-tight"
                  style={{ color: '#1a1a2e' }}
                >
                  Join Our Community
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-center text-gray-500 mb-8 leading-relaxed">
                  Get weekly tips and exclusive content
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={status === 'loading'}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4A6BFF] focus:ring-2 focus:ring-[#4A6BFF]/20 transition-all"
                    style={{ color: '#1a1a2e' }}
                    aria-required="true"
                    autoComplete="email"
                    required
                  />

                  {status === 'error' && (
                    <p className="text-xs text-red-500 text-center">
                      Please enter a valid email address.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{
                      backgroundColor: '#4A6BFF',
                      boxShadow: '0 4px 14px 0 rgba(74, 107, 255, 0.3)',
                    }}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Dismiss link */}
                <div className="mt-5 text-center">
                  <button
                    onClick={dismiss}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline-offset-2 hover:underline"
                  >
                    No thanks
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}