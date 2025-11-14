import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterSignup({ variant = 'inline' }: { variant?: 'inline' | 'hero' | 'sidebar' }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Use the newsletter API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('🎉 Success! Check your email for confirmation.');
      setEmail('');
      
      // Show toast notification
      toast.success('Successfully subscribed!', {
        description: 'Check your email for confirmation.',
        duration: 5000,
      });
      
      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'newsletter_signup', {
          method: 'website',
        });
      }
      
      // Redirect to newsletter hub after successful subscription
      setTimeout(() => {
        navigate('/newsletter-hub');
      }, 2000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setStatus('error');
      setMessage(errorMessage);
      
      // Show error toast notification
      toast.error('Subscription failed', {
        description: errorMessage,
        duration: 5000,
      });
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  // Different layouts for different variants
  if (variant === 'hero') {
    return (
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 h-14 text-lg"
            required
          />
          <Button 
            type="submit" 
            size="lg"
            disabled={status === 'loading' || status === 'success'}
            className="px-8 h-14"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
            status === 'success' 
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Daily Digest</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Get AI news in your inbox
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className="w-full"
            required
          />
          <Button 
            type="submit" 
            className="w-full"
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

        {message && (
          <p className={`mt-3 text-xs ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </p>
        )}
      </Card>
    );
  }

  // Default inline variant
  return (
    <Card className="p-8 my-12 bg-gradient-to-r from-violet-500/10 to-purple-600/10 border-primary/20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">
          Get AI News in Your Inbox
        </h3>
        <p className="text-muted-foreground mb-6">
          Join 50,000+ readers getting daily AI updates, tool reviews, and exclusive deals
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
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
            className="px-6"
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

        {message && (
          <p className={`mt-4 text-sm ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </Card>
  );
}

