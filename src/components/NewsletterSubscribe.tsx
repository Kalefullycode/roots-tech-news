import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

interface NewsletterSubscribeProps {
  variant?: "hero" | "compact" | "inline";
}

const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ variant = "hero" }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail("");
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  if (variant === "compact") {
    return (
      <Button 
        variant="outline" 
        size="sm"
        className="text-sm font-medium"
        onClick={() => {
          // Open newsletter modal or scroll to newsletter section
          const newsletterSection = document.querySelector("#newsletter-section");
          newsletterSection?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <Mail className="h-4 w-4 mr-2" />
        Subscribe
      </Button>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    );
  }

  // Hero variant
  return (
    <div id="newsletter-section" className="bg-primary text-white py-16 px-4">
      <div className="container mx-auto text-center max-w-2xl">
        <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
          Stay Informed
        </h2>
        <p className="text-primary-foreground/80 mb-8">
          Get the latest technology news and insights delivered to your inbox weekly.
        </p>
        
        {isSuccess ? (
          <div className="bg-green-500/20 border border-green-400 text-green-100 px-6 py-4 rounded-lg mb-4">
            Thank you for subscribing! Check your email for confirmation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/60" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/40"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn btn-secondary whitespace-nowrap"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        )}
        
        <p className="text-xs text-primary-foreground/60 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSubscribe;
