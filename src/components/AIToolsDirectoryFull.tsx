import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AI_TOOLS, AI_TOOL_CATEGORIES } from '../data/aiTools';
import { Search, ExternalLink, Check } from 'lucide-react';

const AIToolsDirectoryFull = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = AI_TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="ai-tools-directory" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🤖</span>
          <h2 className="font-orbitron text-4xl font-bold text-glow-primary">
            AI Tools Directory
          </h2>
        </div>
        <p className="text-muted-foreground text-lg mb-8">
          Discover {AI_TOOLS.length}+ AI tools for every use case - from language models to image generation
        </p>

        {/* Search & Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools by name, feature, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-input border-border focus:border-primary text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            <Button
              onClick={() => setSelectedCategory('All')}
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              className={selectedCategory === 'All' ? 'bg-gradient-hero' : ''}
            >
              All ({AI_TOOLS.length})
            </Button>
            {AI_TOOL_CATEGORIES.filter(cat => cat !== 'All').map((category) => {
              const count = AI_TOOLS.filter(t => t.category === category).length;
              return (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={selectedCategory === category ? 'bg-gradient-hero' : ''}
                >
                  {category} ({count})
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground text-sm mb-6">
          <span className="text-accent font-semibold">{filteredTools.length}</span> tools found
          {searchQuery && <span> for "{searchQuery}"</span>}
          {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
        </p>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card
              key={tool.id}
              className="bg-card-modern border border-card-border/60 hover:border-primary/50 transition-all hover-lift group p-6"
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Tool Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {tool.name.charAt(0)}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-orbitron font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs mt-1">
                      {tool.category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                {tool.description}
              </p>

              {/* Pricing */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/30">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-accent font-semibold">
                  {tool.pricing}
                </span>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {tool.features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Try Now Button */}
              <Button
                className="w-full bg-gradient-hero hover:glow-primary"
                onClick={() => window.open(tool.url, '_blank')}
              >
                Try {tool.name}
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <Card className="text-center py-12 bg-card-modern border border-card-border/60">
            <p className="text-muted-foreground mb-4 text-lg">
              No tools found matching your criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              variant="outline"
              className="border-primary hover:bg-primary/10"
            >
              Clear filters
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
};

export default AIToolsDirectoryFull;

