import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Mail, Play } from "lucide-react";

const Sidebar = () => {
  const trendingArticles = [
    {
      title: "AI Revolution in African Tech Startups",
      image: "/placeholder.svg",
      category: "AI"
    },
    {
      title: "Quantum Computing Breakthrough",
      image: "/placeholder.svg",
      category: "Science"
    },
    {
      title: "Cybersecurity in the Metaverse",
      image: "/placeholder.svg",
      category: "Security"
    },
    {
      title: "Green Tech Innovations from Nigeria",
      image: "/placeholder.svg",
      category: "Startups"
    }
  ];

  return (
    <aside className="space-y-6">
      {/* Trending Section */}
      <Card className="bg-gradient-card border-card-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="font-orbitron font-bold text-lg text-glow-accent">
            TRENDING NOW
          </h3>
        </div>
        
        <div className="space-y-4">
          {trendingArticles.map((article, index) => (
            <div key={index} className="flex gap-3 cursor-pointer group">
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Badge className="text-xs mb-1 bg-primary/20 text-primary">
                  {article.category}
                </Badge>
                <h4 className="font-roboto text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-card border-card-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-neon-blue" />
          <h3 className="font-orbitron font-bold text-lg text-glow-primary">
            STAY ROOTED IN TECH
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 font-roboto">
          Get the latest in Afro-futuristic technology delivered to your inbox.
        </p>
        
        <div className="space-y-3">
          <Input 
            placeholder="Enter your email" 
            className="bg-input border-border focus:border-neon-blue"
          />
          <Button className="w-full bg-gradient-hero glow-primary font-orbitron font-bold">
            SUBSCRIBE
          </Button>
        </div>
      </Card>

      {/* Video Module */}
      <Card className="bg-gradient-card border-card-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Play className="h-5 w-5 text-cyber-pink" />
          <h3 className="font-orbitron font-bold text-lg text-glow-accent">
            FEATURED VIDEO
          </h3>
        </div>
        
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Play className="h-12 w-12 text-foreground group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h4 className="font-roboto text-sm font-medium text-foreground">
              The Future of African AI Innovation
            </h4>
          </div>
        </div>
      </Card>
    </aside>
  );
};

export default Sidebar;