import { useEffect, Suspense, lazy } from "react";
// Lazy load breaking news banner since it's not critical for first contentful paint
const BreakingNewsBanner = lazy(() => import("@/components/BreakingNewsBanner"));
import HeroSection from "@/components/HeroSection";

// Lazy load below-the-fold and non-critical components for better performance
const Header = lazy(() => import("@/components/Header"));
const MainFeed = lazy(() => import("@/components/MainFeed"));
const DailyAINews = lazy(() => import("@/components/DailyAINews"));
const Sidebar = lazy(() => import("@/components/Sidebar"));
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
      <Suspense fallback={<div className="h-16 bg-background border-b border-border animate-pulse" />}>
        <Header />
      </Suspense>
      <HeroSection />
      
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <section className="lg:col-span-3" aria-label="Latest tech news and articles">
            {/* Daily AI News Section */}
            <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg mb-8" />}>
              <div className="mb-12">
                <DailyAINews />
              </div>
            </Suspense>
            
            <Suspense fallback={<div className="space-y-6"><div className="h-8 bg-muted animate-pulse rounded" /><div className="h-96 bg-muted animate-pulse rounded-lg" /><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="h-48 bg-muted animate-pulse rounded-lg" /><div className="h-48 bg-muted animate-pulse rounded-lg" /></div></div>}>
              <MainFeed />
            </Suspense>
          </section>
          
          {/* Sidebar */}
          <aside className="lg:col-span-1" aria-label="Trending news and newsletter signup">
            <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
              <Sidebar />
            </Suspense>
          </aside>
        </div>
      </main>
      
      <Suspense fallback={<div className="h-32 bg-muted animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;