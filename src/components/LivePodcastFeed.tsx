import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Clock, Radio } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PodcastEpisode {
  podcast: string;
  host: string;
  title: string;
  link: string;
  pubDate: Date;
  description: string;
  audioUrl: string;
  logo: string;
  color: string;
}

// Live AI/Tech Podcast Sources
const AI_PODCASTS = [
  {
    name: 'The AI Breakdown',
    host: 'NLW',
    description: 'Daily 5-minute AI news updates',
    rssUrl: 'https://feeds.redcircle.com/0ecf83dc-64b5-4fef-8ecd-e760cb932ec6',
    logo: '🤖',
    color: 'purple'
  },
  {
    name: 'Lex Fridman Podcast',
    host: 'Lex Fridman',
    description: 'Long-form AI conversations',
    rssUrl: 'https://lexfridman.com/feed/podcast/',
    logo: '🎙️',
    color: 'blue'
  },
  {
    name: 'Practical AI',
    host: 'Chris Benson & Daniel Whitenack',
    description: 'AI engineering & implementation',
    rssUrl: 'https://changelog.com/practicalai/feed',
    logo: '⚡',
    color: 'green'
  },
  {
    name: 'The Vergecast',
    host: 'Nilay Patel',
    description: 'Tech news & analysis',
    rssUrl: 'https://feeds.megaphone.fm/vergecast',
    logo: '📱',
    color: 'orange'
  },
  {
    name: 'Hard Fork',
    host: 'Kevin Roose & Casey Newton',
    description: 'NYT tech podcast',
    rssUrl: 'https://feeds.simplecast.com/l2i9YnTd',
    logo: '🍴',
    color: 'red'
  },
  {
    name: 'This Week in Tech',
    host: 'Leo Laporte',
    description: 'Weekly tech roundup',
    rssUrl: 'https://feeds.twit.tv/twit.xml',
    logo: '💻',
    color: 'cyan'
  }
];

const LivePodcastFeed = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEpisodes = async () => {
      const fetchedEpisodes: PodcastEpisode[] = [];
      
      for (const podcast of AI_PODCASTS) {
        try {
          const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(podcast.rssUrl)}`
          );
          
          if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'text/xml');
            
            const items = xml.querySelectorAll('item');
            const latestEpisode = items[0];
            
            if (latestEpisode) {
              const title = latestEpisode.querySelector('title')?.textContent || '';
              const link = latestEpisode.querySelector('link')?.textContent || '';
              const pubDate = latestEpisode.querySelector('pubDate')?.textContent || '';
              const description = latestEpisode.querySelector('description')?.textContent || '';
              const audioUrl = latestEpisode.querySelector('enclosure')?.getAttribute('url') || '';
              
              fetchedEpisodes.push({
                podcast: podcast.name,
                host: podcast.host,
                title,
                link,
                pubDate: new Date(pubDate),
                description: description.replace(/<[^>]*>/g, '').slice(0, 150),
                audioUrl,
                logo: podcast.logo,
                color: podcast.color
              });
            }
          }
        } catch (error) {
          console.error(`Failed to fetch ${podcast.name}:`, error);
        }
      }
      
      setEpisodes(fetchedEpisodes.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()).slice(0, 6));
      setIsLoading(false);
    };

    fetchRecentEpisodes();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchRecentEpisodes, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">🎧</span>
            <div>
              <h2 className="font-orbitron text-3xl font-bold text-foreground">AI & Tech Podcasts</h2>
              <p className="text-muted-foreground text-sm mt-1">Loading latest episodes...</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎧</span>
            <div>
              <h2 className="font-orbitron text-3xl font-bold text-foreground">
                AI & Tech Podcasts
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Latest episodes from top AI & technology podcasts
              </p>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-accent text-sm font-medium">Live Feed</span>
          </div>
        </div>

        {/* Podcast Episodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((episode, index) => {
            // Map colors to full Tailwind classes (required for build-time generation)
            const colorClasses: Record<string, string> = {
              purple: 'bg-gradient-to-br from-purple-600/10 to-purple-900/5',
              blue: 'bg-gradient-to-br from-blue-600/10 to-blue-900/5',
              green: 'bg-gradient-to-br from-green-600/10 to-green-900/5',
              orange: 'bg-gradient-to-br from-orange-600/10 to-orange-900/5',
              red: 'bg-gradient-to-br from-red-600/10 to-red-900/5',
              cyan: 'bg-gradient-to-br from-cyan-600/10 to-cyan-900/5',
            };
            
            return (
              <Card
                key={index}
                className="bg-card-modern border border-card-border/60 overflow-hidden hover:border-primary/50 transition-all hover-lift"
              >
                {/* Episode Header */}
                <div className={`p-6 ${colorClasses[episode.color] || 'bg-gradient-to-br from-primary-600/10 to-primary-900/5'}`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-4xl">{episode.logo}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-orbitron font-bold text-foreground text-lg">
                      {episode.podcast}
                    </h3>
                    <p className="text-sm text-muted-foreground">{episode.host}</p>
                  </div>
                </div>
                
                <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
                  {episode.title}
                </h4>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {episode.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{episode.pubDate.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Audio Player */}
              {episode.audioUrl && (
                <div className="p-4 bg-muted/30 border-y border-border/30">
                  <audio
                    controls
                    className="w-full h-10"
                    preload="none"
                    style={{
                      filter: 'contrast(0.8)',
                      borderRadius: '4px'
                    }}
                  >
                    <source src={episode.audioUrl} type="audio/mpeg" />
                    Your browser does not support audio.
                  </audio>
                </div>
              )}

              {/* Listen Button */}
              <div className="p-4">
                <Button
                  className="w-full bg-gradient-hero hover:glow-primary"
                  onClick={() => window.open(episode.link, '_blank')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Listen Full Episode
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </Card>
            );
          })}
        </div>

        {/* View More */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            🔴 New episodes added hourly • Subscribe for updates
          </p>
        </div>
      </div>
    </section>
  );
};

export default LivePodcastFeed;

