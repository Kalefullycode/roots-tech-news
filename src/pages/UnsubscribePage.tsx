import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2, AlertCircle, MailX } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UnsubscribePage() {
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
      // Use the unsubscribe API endpoint
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to unsubscribe');
      }

      setStatus('success');
      setMessage('You have been successfully unsubscribed. We\'re sorry to see you go!');
      setEmail('');

    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again or contact support.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Unsubscribe | Roots Tech News</title>
        <meta name="description" content="Unsubscribe from Roots Tech News newsletter" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
                <MailX className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Unsubscribe from Newsletter
              </h1>
              
              <p className="text-xl text-muted-foreground">
                We're sorry to see you go. Enter your email to unsubscribe.
              </p>
            </div>

            {/* Unsubscribe Form Card */}
            <Card className="p-8 md:p-12 mb-8 border-2 border-red-200 dark:border-red-900/50 shadow-lg">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                    Successfully Unsubscribed
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {message}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    You will no longer receive emails from Roots Tech News. If you change your mind, you can always subscribe again.
                  </p>
                  <Button onClick={() => window.location.href = '/'} variant="default">
                    Back to Home
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-center">Confirm Unsubscription</h2>
                  
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
                      variant="destructive"
                      className="w-full h-12 text-lg"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <MailX className="w-5 h-5 mr-2" />
                          Unsubscribe
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-8 pt-8 border-t text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Changed your mind? You can always subscribe again.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/newsletter'}
                    >
                      Subscribe Instead
                    </Button>
                  </div>
                </>
              )}
            </Card>

            {/* Alternative Options */}
            <Card className="p-6 bg-muted/50">
              <h3 className="font-semibold mb-4">Other Options</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• You can also unsubscribe by clicking the link in any newsletter email</li>
                <li>• If you're having trouble, contact us at <a href="/contact" className="text-primary hover:underline">support</a></li>
                <li>• Want to change your preferences? <a href="/contact" className="text-primary hover:underline">Let us know</a></li>
              </ul>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}

