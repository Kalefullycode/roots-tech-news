import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

/**
 * Test component to verify rendering is working
 * This should ALWAYS display regardless of any other issues
 */
const TestContent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-8 bg-card border-2 border-primary">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <h1 className="font-orbitron text-3xl font-bold text-foreground">
            ✅ RootsTechNews is Loading!
          </h1>
        </div>
        
        <div className="space-y-4">
          <p className="text-foreground text-lg">
            If you can see this message, your React app is working correctly!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4 bg-primary/10 border-primary/30">
              <h3 className="font-orbitron font-bold text-primary mb-2">Status</h3>
              <p className="text-sm text-foreground">App is rendering ✓</p>
            </Card>
            
            <Card className="p-4 bg-accent/10 border-accent/30">
              <h3 className="font-orbitron font-bold text-accent mb-2">Styling</h3>
              <p className="text-sm text-foreground">Tailwind CSS working ✓</p>
            </Card>
            
            <Card className="p-4 bg-secondary/10 border-secondary/30">
              <h3 className="font-orbitron font-bold text-secondary mb-2">Components</h3>
              <p className="text-sm text-foreground">UI components loaded ✓</p>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-muted rounded-lg">
            <h2 className="font-orbitron text-xl font-bold text-foreground mb-4">
              Test Articles Below:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "AI Breakthrough in Quantum Neural Networks",
                  category: "AI",
                  date: "2 hours ago"
                },
                {
                  title: "Nigerian Startup Raises $50M",
                  category: "Startups",
                  date: "5 hours ago"
                },
                {
                  title: "Cybersecurity in the Metaverse",
                  category: "Security",
                  date: "1 day ago"
                },
                {
                  title: "Holographic Display Technology",
                  category: "Gadgets",
                  date: "2 days ago"
                }
              ].map((article, idx) => (
                <Card key={idx} className="p-4 bg-card-modern border border-card-border hover:border-primary transition-all">
                  <Badge className="mb-2 bg-primary/20 text-primary">
                    {article.category}
                  </Badge>
                  <h3 className="font-orbitron font-semibold text-foreground mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{article.date}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-orbitron font-bold text-yellow-500 mb-2">
                  Note About Live Feeds
                </h3>
                <p className="text-sm text-foreground">
                  RSS feeds may take time to load due to CORS and API limitations. 
                  The app uses fallback content to ensure you always see something!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestContent;

