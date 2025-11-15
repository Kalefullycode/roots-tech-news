import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Mail, Zap, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import SubscriptionModal from './SubscriptionModal';

const STORAGE_KEY = 'newsletter-popup-dismissed';
const STORAGE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    // Check if popup was recently dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const now = Date.now();
      if (now - dismissedTime < STORAGE_EXPIRY) {
        return; // Don't show popup if dismissed within expiry period
      }
    }

    // Trigger after 10 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Store dismissal timestamp
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
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
        // Show subscription modal after a brief delay
        setTimeout(() => {
          handleClose();
          setShowSubscriptionModal(true);
        }, 1500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="newsletter-popup-content border-2 border-purple-500/50 p-0 overflow-hidden max-w-[600px] bg-[#1a1a2e] shadow-2xl shadow-purple-500/20 [&>button]:hidden">
          {/* Animated Purple Border Glow */}
          <div className="absolute inset-0 border-2 border-purple-500/30 rounded-lg animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 pointer-events-none" />
          
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_50%)] animate-pulse" />
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-50 rounded-full p-2 hover:bg-purple-500/20 transition-colors text-muted-foreground hover:text-purple-400 border border-purple-500/30 hover:border-purple-500/60"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative z-10 p-8 md:p-12">
            {/* Header Section */}
            <DialogHeader className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-2 border-purple-400/50 shadow-lg shadow-purple-500/50">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
              
              <DialogTitle className="font-orbitron text-3xl md:text-4xl font-black mb-3 text-glow-gradient">
                Join the Digital Frontier
              </DialogTitle>
              
              <DialogDescription className="text-base md:text-lg text-muted-foreground max-w-md mx-auto font-roboto">
                Get the latest AI news, tech deep dives, and market analysis delivered straight to your inbox.
              </DialogDescription>
            </DialogHeader>

            {/* Form Section */}
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <h3 className="font-orbitron text-xl font-bold text-foreground mb-2 text-glow-gradient">
                  Welcome Aboard! 🚀
                </h3>
                <p className="text-muted-foreground">
                  Check your email to confirm your subscription.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400 z-10" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="pl-12 h-14 text-base bg-card/50 border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] text-foreground placeholder:text-muted-foreground/50 transition-all newsletter-input"
                    required
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-400 text-center">
                    Please enter a valid email address.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-14 text-base font-orbitron font-bold newsletter-button"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground font-roboto">
                🔒 No spam. Unsubscribe anytime. Join 50,000+ tech enthusiasts.
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Modal for Additional Newsletters */}
      <SubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={(open) => {
          setShowSubscriptionModal(open);
          if (!open) {
            setEmail('');
            setStatus('idle');
          }
        }}
        email={email}
      />
    </>
  );
}

