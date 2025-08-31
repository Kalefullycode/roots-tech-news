import { useEffect } from "react";
import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import HeroSection from "@/components/HeroSection";
import MainFeed from "@/components/MainFeed";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

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
      
      <BreakingNewsBanner />
      <Header />
      <HeroSection />
      
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <section className="lg:col-span-3" aria-label="Latest tech news and articles">
            <MainFeed />
          </section>
          
          {/* Sidebar */}
          <aside className="lg:col-span-1" aria-label="Trending news and newsletter signup">
            <Sidebar />
          </aside>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;