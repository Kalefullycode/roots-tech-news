import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import SubscriptionModal from '@/components/modals/SubscriptionModal';

interface NewsletterFormProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export default function NewsletterForm({ 
  variant = 'default',
  className = ''
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation - use proper email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      // Use the newsletter subscription API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        setStatus('success');
        // Show the subscription modal for additional newsletters
        setShowModal(true);
        // Don't clear email yet - modal might need it
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
    }
  };

  // Compact variant - optimized for sidebar
  if (variant === 'compact') {
    return (
      <>
        <div className={className}>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-sm">Stay Updated</h4>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className="w-full"
            required
          />
          <Button 
            type="submit" 
            disabled={status === 'loading' || status === 'success'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
            size="sm"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Subscribed!
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </>
            )}
          </Button>
          {status === 'success' && (
            <p className="text-xs text-green-400 text-center">Thanks for subscribing!</p>
          )}
          {status === 'error' && (
            <p className="text-xs text-red-400 text-center">Please try again.</p>
          )}
        </form>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          No spam. Unsubscribe anytime.
        </p>
        </div>
        <SubscriptionModal
          open={showModal}
          onOpenChange={(open) => {
            setShowModal(open);
            if (!open) {
              setEmail(''); // Clear email when modal closes
            }
          }}
          email={email}
        />
      </>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <>
        <div className={className}>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className="flex-1"
            required
          />
          <Button 
            type="submit" 
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>

        {status === 'success' && <p className="mt-3 text-sm text-green-600 dark:text-green-400">Thanks for subscribing!</p>}
        {status === 'error' && <p className="mt-3 text-sm text-red-600 dark:text-red-400">Something went wrong. Please try again.</p>}
        </div>
        <SubscriptionModal
          open={showModal}
          onOpenChange={(open) => {
            setShowModal(open);
            if (!open) {
              setEmail('');
            }
          }}
          email={email}
        />
      </>
    );
  }

  // Default variant
  return (
    <>
      <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Newsletter Subscription</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newsletter-email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className="w-full"
            required
          />
        </div>

        {status === 'success' && <p className="text-sm text-green-600 dark:text-green-400">Thanks for subscribing!</p>}
        {status === 'error' && <p className="text-sm text-red-600 dark:text-red-400">Something went wrong. Please try again.</p>}

        <Button 
          type="submit" 
          disabled={status === 'loading' || status === 'success'}
          className="w-full"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Subscribed!
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Subscribe to Newsletter
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        No spam. Unsubscribe anytime.
      </p>
      </div>
      <SubscriptionModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setEmail('');
          }
        }}
        email={email}
      />
    </>
  );
}

