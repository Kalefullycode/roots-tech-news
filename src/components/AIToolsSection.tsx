import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ExternalLink, Filter } from "lucide-react";
import { AI_TOOLS, AI_TOOL_CATEGORIES } from "@/data/aiTools";

const AIToolsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredTools = selectedCategory === "All" 
    ? AI_TOOLS 
    : AI_TOOLS.filter(tool => tool.category === selectedCategory);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <h2 className="font-orbitron text-3xl font-bold text-glow-primary">
            AI Tools Directory
          </h2>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        {AI_TOOL_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-gradient-hero" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="p-6 bg-card-modern border border-card-border/60 hover:border-primary/50 transition-all hover-lift group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-orbitron text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  {tool.category}
                </Badge>
              </div>
              {tool.isPremium && (
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  Premium
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {tool.description}
            </p>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Key Features:</p>
              <div className="flex flex-wrap gap-1">
                {tool.features.slice(0, 3).map((feature, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="text-xs bg-secondary/10 border-secondary/30"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm font-semibold text-accent">
                {tool.pricing}
              </span>
              <Button 
                size="sm" 
                className="bg-gradient-hero hover:glow-primary"
                onClick={() => window.open(tool.url, '_blank')}
              >
                Try Now
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AIToolsSection;

