import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import NewsletterService from '@/services/NewsletterService';

export function NewsletterInline() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const result = await NewsletterService.subscribe(email, 'inline');

      if (result.success) {
        setStatus('success');
        setMessage('🎉 Successfully subscribed! Check your email.');
        setEmail('');

        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(result.message || 'Something went wrong. Please try again.');

        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setStatus('error');
      setMessage(errorMessage);

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

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
          Join 10,000+ readers getting daily AI updates, tool reviews, and exclusive deals
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

export default NewsletterInline;

