import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.webp";
import heroBg800 from "@/assets/hero-bg-800w.webp";
import heroBg1200 from "@/assets/hero-bg-1200w.webp";

export function Hero() {
  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black"
      aria-label="Hero section with main headline and call-to-action buttons"
    >
      {/* Background Image - Optimized for LCP */}
      <img 
        src={heroBg1200}
        srcSet={`${heroBg800} 800w, ${heroBg1200} 1200w, ${heroBg} 1920w`}
        sizes="(max-width: 768px) 800px, (max-width: 1200px) 1200px, 1920px"
        alt="Futuristic cosmic background with grid overlay"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        fetchPriority="high"
        loading="eager"
        decoding="async"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent animate-gradient">
          Roots Tech News
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-body">
          Illuminating the Future of Tech through an Afro-futuristic lens
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/news">
            <Button 
              size="lg" 
              className="bg-primary-500 hover:bg-primary-600 text-white shadow-glow animate-glow-pulse"
            >
              Explore News
            </Button>
          </Link>
          <Link to="/videos">
            <Button 
              size="lg" 
              variant="outline"
              className="border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-black"
            >
              Watch Videos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;

