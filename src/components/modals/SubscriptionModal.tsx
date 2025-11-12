import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Loader2, Mail } from 'lucide-react';

interface RecommendedNewsletter {
  id: string;
  name: string;
  description: string;
  category: string;
  sponsored?: boolean;
}

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

const recommendedNewsletters: RecommendedNewsletter[] = [
  {
    id: 'ai-weekly',
    name: 'AI Weekly Digest',
    description: 'Weekly roundup of the most important AI developments',
    category: 'AI',
  },
  {
    id: 'startup-insider',
    name: 'Startup Insider',
    description: 'Funding rounds, acquisitions, and startup news',
    category: 'Startups',
  },
  {
    id: 'tech-trends',
    name: 'Tech Trends',
    description: 'Emerging technologies and industry trends',
    category: 'Tech',
    sponsored: true,
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security Brief',
    description: 'Security updates, vulnerabilities, and best practices',
    category: 'Security',
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools Weekly',
    description: 'New tools, frameworks, and developer resources',
    category: 'Development',
  },
];

export default function SubscriptionModal({
  open,
  onOpenChange,
  email,
}: SubscriptionModalProps) {
  const [selectedNewsletters, setSelectedNewsletters] = useState<Set<string>>(new Set());
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleToggleNewsletter = (id: string) => {
    const newSelected = new Set(selectedNewsletters);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNewsletters(newSelected);
  };

  const handleSubscribeToAll = () => {
    const allIds = new Set(recommendedNewsletters.map(nl => nl.id));
    setSelectedNewsletters(allIds);
  };

  const handleSubscribe = async () => {
    if (selectedNewsletters.size === 0) {
      // If no newsletters selected, just close
      setIsComplete(true);
      setTimeout(() => {
        onOpenChange(false);
        setIsComplete(false);
        setSelectedNewsletters(new Set());
      }, 1500);
      return;
    }

    setIsSubscribing(true);

    try {
      // Subscribe to selected newsletters
      // In a real implementation, you'd call your API here
      await Promise.all(
        Array.from(selectedNewsletters).map(async (id) => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          // In production: await fetch('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email, newsletterId: id }) });
        })
      );

      setIsComplete(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setIsComplete(false);
        setSelectedNewsletters(new Set());
      }, 2000);
    } catch (error) {
      console.error('Error subscribing to newsletters:', error);
      setIsSubscribing(false);
    }
  };

  const handleMaybeLater = () => {
    onOpenChange(false);
    setSelectedNewsletters(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {isComplete ? (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl">
                All Set! 🎉
              </DialogTitle>
              <DialogDescription className="text-center">
                You've been subscribed to {selectedNewsletters.size} newsletter{selectedNewsletters.size !== 1 ? 's' : ''}.
                Check your email for confirmation.
              </DialogDescription>
            </DialogHeader>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl font-orbitron">
                Thanks for Subscribing! 🎉
              </DialogTitle>
              <DialogDescription className="text-center">
                Stay ahead with our curated newsletters. Select the ones that interest you:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {recommendedNewsletters.map((newsletter) => (
                <div
                  key={newsletter.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                    selectedNewsletters.has(newsletter.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <Checkbox
                    id={newsletter.id}
                    checked={selectedNewsletters.has(newsletter.id)}
                    onCheckedChange={() => handleToggleNewsletter(newsletter.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <label
                        htmlFor={newsletter.id}
                        className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
                      >
                        {newsletter.name}
                      </label>
                      {newsletter.sponsored && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                          Sponsored
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {newsletter.description}
                    </p>
                    <span className="inline-block mt-1 text-xs text-primary/70">
                      {newsletter.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleSubscribeToAll}
                className="flex-1"
                disabled={isSubscribing}
              >
                Subscribe to All
              </Button>
              <Button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe ({selectedNewsletters.size})
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={handleMaybeLater}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubscribing}
              >
                Maybe later
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

