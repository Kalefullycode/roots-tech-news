import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Calendar, Gift, TrendingUp, ArrowLeft } from 'lucide-react';

export default function NewsletterHubPage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Newsletter Hub - Roots Tech News</title>
        <meta name="description" content="Your newsletter hub - manage your subscriptions and preferences" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <Card className="p-8 mb-8 border-2 border-green-500/20 bg-green-500/5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">
                    🎉 Welcome to Your Newsletter Hub!
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    You've successfully subscribed to Roots Tech News. Check your email for a confirmation message.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={() => navigate('/newsletter')} variant="outline">
                      Manage Subscription
                    </Button>
                    <Button onClick={() => navigate('/')} variant="default">
                      Explore Latest News
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* What You'll Get */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Daily AI & Tech Digest</h3>
                </div>
                <p className="text-muted-foreground">
                  Get curated tech news delivered to your inbox every morning at 7:00 AM EST.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Breaking News Alerts</h3>
                </div>
                <p className="text-muted-foreground">
                  Stay ahead with real-time breaking news alerts for major tech announcements.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Weekly Deep Dives</h3>
                </div>
                <p className="text-muted-foreground">
                  In-depth analysis and insights delivered every Sunday to help you understand the tech landscape.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Gift className="w-5 h-5 text-pink-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Exclusive Offers</h3>
                </div>
                <p className="text-muted-foreground">
                  Member-only deals, discounts, and early access to new features and tools.
                </p>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="justify-start h-auto py-4"
                  onClick={() => navigate('/newsletter')}
                >
                  <div className="text-left">
                    <div className="font-semibold">Manage Preferences</div>
                    <div className="text-sm text-muted-foreground">Update your email preferences</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-4"
                  onClick={() => navigate('/unsubscribe')}
                >
                  <div className="text-left">
                    <div className="font-semibold">Unsubscribe</div>
                    <div className="text-sm text-muted-foreground">Opt out anytime</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-4"
                  onClick={() => navigate('/')}
                >
                  <div className="text-left">
                    <div className="font-semibold">Read Latest News</div>
                    <div className="text-sm text-muted-foreground">Explore today's top stories</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-4"
                  onClick={() => navigate('/contact')}
                >
                  <div className="text-left">
                    <div className="font-semibold">Contact Support</div>
                    <div className="text-sm text-muted-foreground">Need help? We're here</div>
                  </div>
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 mt-8 bg-muted/50">
              <h3 className="font-semibold mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Add <strong className="text-foreground">newsletter@send.rootstechnews.com</strong> to your contacts to ensure emails don't go to spam</li>
                <li>• Your first newsletter will arrive tomorrow morning at 7:00 AM EST</li>
                <li>• You can update your preferences or unsubscribe anytime</li>
                <li>• Reply to any newsletter email to reach our team</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

