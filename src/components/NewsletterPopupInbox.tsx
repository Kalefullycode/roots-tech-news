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
import { X, Mail, Newspaper, TrendingUp, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'rtn-newsletter-inbox-dismissed';
const STORAGE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function NewsletterPopupInbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < STORAGE_EXPIRY) return;
    }

    const timer = setTimeout(() => setIsOpen(true), 12000);

    const handleExit = (e: MouseEvent) => {
      if (e.clientY <= 0) setIsOpen(true);
    };
    document.addEventListener('mouseleave', handleExit);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleExit);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
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
        setTimeout(() => handleClose(), 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const benefits = [
    { icon: Newspaper, text: 'Weekly tech digests from Africa, Caribbean & South America' },
    { icon: TrendingUp, text: 'Curated AI, startup, and coding stories' },
    { icon: CheckCircle, text: 'No spam. Unsubscribe anytime. 50,000+ readers' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden max-w-[580px] border-border shadow-2xl [&>button]:hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 rounded-full p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Header */}
          <DialogHeader className="text-center mb-8">
            <DialogTitle className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-3">
              Stay in the Loop
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground font-inter max-w-sm mx-auto">
              Get the best tech stories from underrepresented regions delivered to your inbox every week.
            </DialogDescription>
          </DialogHeader>

          {/* Success State */}
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                You're in!
              </h3>
              <p className="text-muted-foreground font-inter">
                Check your email to confirm your subscription.
              </p>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="pl-12 h-14 text-base bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 font-inter"
                    aria-label="Email address"
                    required
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-500 text-center font-inter">
                    Please enter a valid email address.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-14 text-base font-inter font-semibold bg-primary hover:bg-primary-dark"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Benefits */}
              <div className="space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <benefit.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground font-inter">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground font-inter">
              RootsTechNews • No spam, ever. Unsubscribe in one click.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
