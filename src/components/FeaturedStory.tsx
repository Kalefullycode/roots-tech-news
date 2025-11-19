import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { cleanDescription } from "@/utils/cleanDescription";
import aiArticle from "@/assets/ai-article.webp";

async function fetchArticles() {
  const response = await fetch('/functions/fetch-rss');
  if (!response.ok) throw new Error('Failed to fetch articles');
  const data = await response.json();
  return data.articles;
}

const FeaturedStory = () => {
  const { data: newsArticles, isLoading } = useQuery({
    queryKey: ['featured-story'],
    queryFn: fetchArticles,
    refetchInterval: 86400000, // Refresh daily (24 hours)
    staleTime: 3600000, // 1 hour
    retry: 2
  });

  // Get featured story - highest engagement or first article
  // In production, this would be determined by engagement metrics
  const getFeaturedStory = () => {
    if (!newsArticles || newsArticles.length === 0) {
      return {
        id: "fallback",
        title: "Revolutionary AI Breakthrough in Quantum Neural Networks",
        description: "Scientists at leading research institutions have developed a groundbreaking quantum-AI hybrid that could reshape machine learning as we know it. This futuristic approach combines traditional computing with quantum mechanics.",
        url: "#",
        image: aiArticle,
        category: "AI",
        publishedAt: new Date().toISOString()
      };
    }

    // For now, use the first article as featured (in production, use engagement metrics)
    const featured = newsArticles[0];
    const rawDescription = featured.description || featured.contentSnippet || '';
    const cleanedDescription = cleanDescription(rawDescription).substring(0, 200);
    
    return {
      id: featured.id || "featured-1",
      title: featured.title || "Featured Story",
      description: cleanedDescription || "Read the full story to discover more about this exciting development.",
      url: featured.url || "#",
      image: featured.image || aiArticle,
      category: featured.category || "Tech",
      publishedAt: featured.publishedAt || new Date().toISOString()
    };
  };

  const featured = getFeaturedStory();

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="font-orbitron text-3xl font-bold text-glow-primary">
            BREAKING NEWS
          </h2>
        </div>

        <Card 
          className="relative overflow-hidden bg-card-modern border border-card-border/60 hover:border-primary/40 transition-all cursor-pointer group"
          onClick={() => {
            if (featured.url && featured.url !== '#') {
              window.open(featured.url, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {/* Large Hero Image with Gradient Overlay */}
          <div className="relative h-[500px] md:h-[600px] overflow-hidden">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = aiArticle;
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            
            {/* Featured Badge */}
            <Badge className="absolute top-6 right-6 bg-accent/95 text-accent-foreground font-orbitron font-bold text-sm px-4 py-2 rounded-full border border-accent/20 shadow-lg backdrop-blur-sm z-10">
              FEATURED
            </Badge>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="max-w-3xl">
                <Badge className="mb-4 bg-primary/95 text-primary-foreground font-orbitron font-semibold text-xs px-3 py-1.5 rounded-full border border-primary/20">
                  {featured.category}
                </Badge>
                
                <h3 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-foreground leading-tight">
                  {featured.title}
                </h3>
                
                <p className="font-roboto text-lg md:text-xl text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                  {featured.description}
                </p>

                <Button
                  size="lg"
                  className="bg-gradient-hero hover:glow-primary font-orbitron font-bold text-lg px-8 py-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (featured.url && featured.url !== '#') {
                      window.open(featured.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  Read More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FeaturedStory;

