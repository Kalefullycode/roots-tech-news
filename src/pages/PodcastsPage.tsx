import { Suspense, lazy } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Radio } from "lucide-react";

const LivePodcastFeed = lazy(() => import("@/components/LivePodcastFeed"));

const PodcastsPage = () => {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>AI & Tech Podcasts - RootsTechNews</title>
          <meta name="description" content="Latest episodes from top AI and technology podcasts. Listen to The AI Breakdown, Lex Fridman, Practical AI, and more." />
          <meta property="og:title" content="AI & Tech Podcasts - RootsTechNews" />
          <meta property="og:description" content="Latest episodes from top AI and technology podcasts" />
          <meta name="keywords" content="AI podcasts, tech podcasts, artificial intelligence, machine learning, technology news, podcast episodes" />
        </Helmet>

        {/* Header */}
        <div className="bg-card border-b border-card-border">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mb-6 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 rounded-xl text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">🎧</span>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      <Radio className="h-4 w-4 animate-pulse" />
                      <span className="text-sm font-semibold">Live Feed</span>
                    </div>
                  </div>
                  <h1 className="font-orbitron text-4xl font-bold mb-4">
                    AI & Tech Podcasts
                  </h1>
                  <p className="font-roboto text-lg opacity-90 max-w-2xl">
                    Stay updated with the latest episodes from top AI and technology podcasts. 
                    Listen to industry leaders, researchers, and innovators discuss the future of technology.
                  </p>
                </div>
              </div>
              
              {/* Featured Podcasts */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-orbitron font-semibold text-sm">The AI Breakdown</div>
                  <div className="text-xs opacity-80">Daily AI News</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">🎙️</div>
                  <div className="font-orbitron font-semibold text-sm">Lex Fridman</div>
                  <div className="text-xs opacity-80">Long-form AI</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-orbitron font-semibold text-sm">Practical AI</div>
                  <div className="text-xs opacity-80">Engineering</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-orbitron font-semibold text-sm">The Vergecast</div>
                  <div className="text-xs opacity-80">Tech News</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">🍴</div>
                  <div className="font-orbitron font-semibold text-sm">Hard Fork</div>
                  <div className="text-xs opacity-80">NYT Tech</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">💻</div>
                  <div className="font-orbitron font-semibold text-sm">This Week in Tech</div>
                  <div className="text-xs opacity-80">Weekly Roundup</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Podcast Feed */}
        <Suspense fallback={
          <div className="container mx-auto px-4 py-12">
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </div>
        }>
          <LivePodcastFeed />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default PodcastsPage;

