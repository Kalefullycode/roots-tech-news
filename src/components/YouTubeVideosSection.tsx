import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const YouTubeVideosSection = () => {
  const navigate = useNavigate();
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  // Load RSS.app widget script
  useEffect(() => {
    const scriptId = 'rssapp-youtube-script';
    
    // Check if script already exists
    if (document.getElementById(scriptId)) {
      setWidgetLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://widget.rss.app/v1/wall.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      setWidgetLoaded(true);
    };
    
    document.head.appendChild(script);

    return () => {
      // Keep script for reuse
    };
  }, []);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="font-orbitron text-3xl font-bold text-glow-primary flex items-center gap-3">
            <Play className="h-8 w-8 text-red-500" />
            🎥 Latest AI & Tech Videos
          </h2>
          <p className="text-muted-foreground mt-2 font-roboto">
            Curated from top tech channels: Stefan Mischook, Sabrina Ramonov, Nicky Saunders, AI Explained, Two Minute Papers, Matt Wolfe
          </p>
        </div>

        {/* YouTube RSS Feed Integration */}
        <div className="mb-6 w-full">
          {!widgetLoaded && (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            </div>
          )}
          {/* RSS.app YouTube Widget - Replace [YOUR-YOUTUBE-FEED-ID] with actual ID */}
          <rssapp-wall id="[YOUR-YOUTUBE-FEED-ID]"></rssapp-wall>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-orbitron font-bold"
            onClick={() => navigate('/videos')}
          >
            View All Videos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default YouTubeVideosSection;

