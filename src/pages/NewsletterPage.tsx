import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NewsletterPage() {
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
      console.log('Subscribing email:', email);
      
      // Use the newsletter API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('🎉 Success! Check your email for confirmation.');
      setEmail('');
      
      // Show success toast
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

    } catch (error: any) {
      console.error('Subscription error:', error);
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      setStatus('error');
      setMessage(errorMessage);
      
      // Show error toast
      toast.error('Subscription failed', {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Subscribe to Newsletter | Roots Tech News</title>
        <meta name="description" content="Subscribe to Roots Tech News for daily AI & tech news, tool reviews, exclusive deals, and breaking alerts." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full mb-6">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Stay Ahead with Daily Tech News
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Join 50,000+ tech enthusiasts getting the latest AI & technology news delivered to their inbox
              </p>
            </div>

            {/* Subscription Form Card */}
            <Card className="p-8 md:p-12 mb-8 border-2 border-primary/20 shadow-lg">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                    Successfully Subscribed! 🎉
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    We've sent a confirmation email to your inbox. Please check your email (and spam folder) to verify your subscription.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate('/')} variant="outline">
                      Back to Home
                    </Button>
                    <Button onClick={() => { setStatus('idle'); setEmail(''); }} variant="default">
                      Subscribe Another Email
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-center">Subscribe Now</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading'}
                        className="w-full h-12 text-lg"
                        required
                      />
                    </div>

                    {message && (
                      <div className={`p-4 rounded-lg flex items-center gap-3 ${
                        status === 'success' 
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                          : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                      }`}>
                        {status === 'success' ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="text-sm">{message}</span>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={status === 'loading'}
                      className="w-full h-12 text-lg"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe Now
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-8 pt-8 border-t">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      What You'll Get
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>📰 Daily AI & tech news digest (every morning)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>🛠️ Exclusive AI tool reviews & comparisons</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>💰 Special deals on AI tools (30-50% off)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>🎓 Free tutorials & guides</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>🔥 Breaking news alerts</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>No spam. Unsubscribe anytime. We respect your privacy.</p>
                    <p className="mt-2">
                      <a href="/unsubscribe" className="text-primary hover:underline">
                        Unsubscribe
                      </a>
                      {' • '}
                      <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </>
              )}
            </Card>

            {/* Trust Indicators */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                🔒 Your email is safe with us. We never share your information.
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}

