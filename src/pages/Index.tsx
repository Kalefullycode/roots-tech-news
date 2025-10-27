import { useEffect, Suspense, lazy } from "react";
import RealTimeNewsTicker from "@/components/RealTimeNewsTicker";

// Lazy load breaking news banner since it's not critical for first contentful paint
const BreakingNewsBanner = lazy(() => import("@/components/BreakingNewsBanner"));
// Lazy load hero section to reduce initial bundle size
const HeroSection = lazy(() => import("@/components/HeroSection"));

// Lazy load below-the-fold and non-critical components for better performance
const Header = lazy(() => import("@/components/Header"));
const MainFeed = lazy(() => import("@/components/MainFeed"));
const DailyAINews = lazy(() => import("@/components/DailyAINews"));
const Sidebar = lazy(() => import("@/components/Sidebar"));
const AIToolsSidebar = lazy(() => import("@/components/AIToolsSidebar"));
const LiveAINewsVideos = lazy(() => import("@/components/LiveAINewsVideos"));
const PodcastSection = lazy(() => import("@/components/PodcastSection"));
const AIToolsSection = lazy(() => import("@/components/AIToolsSection"));
const BooksSection = lazy(() => import("@/components/BooksSection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  useEffect(() => {
    // Add JSON-LD for the homepage articles
    const script = document.createElement('script');
    script.type = 'application/ld+json';
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
      document.head.removeChild(script);
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
      <Suspense fallback={
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-starfield" aria-label="Loading hero section">
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
          {/* Container for standard content */}
          <div className="container mx-auto px-4 py-12">
            {/* Daily AI Briefing */}
            <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg mb-8" />}>
              <div className="mb-12">
                <DailyAINews />
              </div>
            </Suspense>

            {/* Live AI News Videos - EXPANDED SECTION */}
            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg mb-12" />}>
              <LiveAINewsVideos />
            </Suspense>
            
            {/* Main News Feed - Today's Top Stories */}
            <Suspense fallback={<div className="space-y-6"><div className="h-8 bg-muted animate-pulse rounded" /><div className="h-96 bg-muted animate-pulse rounded-lg" /><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="h-48 bg-muted animate-pulse rounded-lg" /><div className="h-48 bg-muted animate-pulse rounded-lg" /></div></div>}>
              <MainFeed />
            </Suspense>

            {/* Podcasts Section */}
            <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg mb-12 mt-12" />}>
              <div className="mb-12 mt-12">
                <PodcastSection />
              </div>
            </Suspense>
          </div>

          {/* Subscribe Section - MOVED TO BOTTOM */}
          <section className="py-16 bg-gradient-to-b from-transparent to-primary/20 border-t border-border/30">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-orbitron text-3xl font-bold text-glow-primary mb-4">
                  📧 Never Miss an Update
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Get daily AI & tech news, curated podcasts, and exclusive insights delivered to your inbox every morning.
                </p>
                <button 
                  className="px-12 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold text-lg hover:opacity-90 transition-all inline-flex items-center gap-3"
                  onClick={() => {
                    const sidebar = document.querySelector('aside');
                    if (sidebar) {
                      sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setTimeout(() => {
                        const newsletterForm = sidebar.querySelector('form');
                        if (newsletterForm) {
                          newsletterForm.classList.add('ring-4', 'ring-primary', 'ring-offset-4', 'ring-offset-background');
                          setTimeout(() => {
                            newsletterForm.classList.remove('ring-4', 'ring-primary', 'ring-offset-4', 'ring-offset-background');
                          }, 2000);
                        }
                      }, 500);
                    }
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Subscribe to Daily AI News
                </button>
                <p className="text-xs text-muted-foreground mt-4">
                  🤖 Join 50,000+ readers staying ahead in AI & tech • Free forever • Unsubscribe anytime
                </p>
              </div>
            </div>
          </section>

          {/* Hidden sections accessible via navigation */}
          <div className="hidden">
            {/* AI Tools Directory - Full directory accessible via /ai-tools route or AI dropdown */}
            <div id="ai-tools-section" className="scroll-mt-24">
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <AIToolsSection />
              </Suspense>
            </div>
            
            {/* Books Section - Accessible via Resources dropdown */}
            <div id="books-section" className="scroll-mt-24">
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <BooksSection />
              </Suspense>
            </div>
          </div>
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
      
      <Suspense fallback={<div className="h-32 bg-muted animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;