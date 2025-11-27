import { useEffect, Suspense, lazy } from "react";
import RealTimeNewsTicker from "@/components/RealTimeNewsTicker";

// Lazy load breaking news banner since it's not critical for first contentful paint
const BreakingNewsBanner = lazy(() => import("@/components/BreakingNewsBanner"));
// Lazy load hero section to reduce initial bundle size
const HeroSection = lazy(() => import("@/components/HeroSection"));

// Lazy load below-the-fold and non-critical components for better performance
const Header = lazy(() => import("@/components/Header"));
const FeaturedStory = lazy(() => import("@/components/FeaturedStory"));
const LatestDiscoveries = lazy(() => import("@/components/LatestDiscoveries"));
const TodaysTopStories = lazy(() => import("@/components/TodaysTopStories"));
const AINewsSection = lazy(() => import("@/components/AINewsSection"));
const NewsletterSubscribe = lazy(() => import("@/components/NewsletterSubscribe"));
const AIToolsSidebar = lazy(() => import("@/components/AIToolsSidebar"));
const Sidebar = lazy(() => import("@/components/Sidebar"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  useEffect(() => {
    // Add JSON-LD for the homepage articles
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'homepage-json-ld';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "Article",
          "position": 1,
          "headline": "Major AI Breakthrough: Quantum Neural Networks Achieve 99.9% Accuracy",
          "description": "Revolutionary quantum neural networks demonstrate unprecedented accuracy in real-world testing",
          "image": "https://rootstechnews.com/images/quantum-neural-brain.jpg",
          "datePublished": "2025-08-31T21:47:00Z",
          "author": {
            "@type": "Person",
            "name": "Dr. Amara Okafor"
          },
          "publisher": {
            "@type": "Organization",
            "name": "RootsTechNews",
            "logo": {
              "@type": "ImageObject",
              "url": "https://rootstechnews.com/logo.png"
            }
          }
        }
      ]
    });
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('homepage-json-ld');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      <Suspense fallback={<div className="h-12 bg-background animate-pulse" />}>
        <BreakingNewsBanner />
      </Suspense>
      
      {/* Real-time News Ticker */}
      <RealTimeNewsTicker />
      
      <Suspense fallback={<div className="h-16 bg-background border-b border-border animate-pulse" />}>
        <Header />
      </Suspense>

      {/* HERO BANNER */}
      <Suspense fallback={
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-starfield">
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/80" />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <div className="h-24 bg-muted/20 rounded-lg mb-6 animate-pulse-safe" />
            <div className="h-16 bg-muted/10 rounded-lg mb-8 max-w-2xl mx-auto animate-pulse-safe" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-14 w-48 bg-muted/20 rounded-lg animate-pulse-safe" />
              <div className="h-14 w-36 bg-muted/10 rounded-lg animate-pulse-safe" />
            </div>
          </div>
        </section>
      }>
        <HeroSection />
      </Suspense>
      
      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Main Content Area */}
        <main id="main-content" className="flex-1 min-w-0">
          {/* SECTION 1: BREAKING NEWS - Large Featured Story */}
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
            <FeaturedStory />
          </Suspense>

          {/* SECTION 2: LIVE TECH FEED - News Cards Grid */}
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
            <LatestDiscoveries />
          </Suspense>

          {/* SECTION 3: TODAY'S TOP STORIES - RSS Feed Articles */}
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
            <TodaysTopStories />
          </Suspense>

          {/* SECTION 4: AI NEWS */}
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
            <AINewsSection />
          </Suspense>

          {/* SECTION 5: NEWSLETTER SIGNUP */}
          <section className="py-16 px-4">
            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
              <NewsletterSubscribe variant="hero" />
            </Suspense>
          </section>
        </main>

        {/* AI Tools Sidebar - RIGHT SIDE (3 Featured Tools) */}
        <Suspense fallback={<div className="w-80 bg-muted animate-pulse hidden lg:block" />}>
          <AIToolsSidebar />
        </Suspense>
      </div>

      {/* Traditional Sidebar for Mobile/Tablet (Newsletter + Trending) */}
      <div className="lg:hidden container mx-auto px-4 mb-12">
        <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
          <Sidebar />
        </Suspense>
      </div>
      
      {/* FOOTER */}
      <Suspense fallback={<div className="h-32 bg-muted animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
