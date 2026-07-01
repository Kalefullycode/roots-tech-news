import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.webp";
import heroBg800 from "@/assets/hero-bg-800w.webp";
import heroBg1200 from "@/assets/hero-bg-1200w.webp";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      aria-label="Hero section with main headline and call-to-action buttons"
    >
      {/* Background Image - Optimized for LCP */}
      <img 
        src={heroBg1200}
        srcSet={`${heroBg800} 800w, ${heroBg1200} 1200w, ${heroBg} 1920w`}
        sizes="(max-width: 768px) 800px, (max-width: 1200px) 1200px, 1920px"
        alt="Professional tech background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        fetchPriority="high"
        loading="eager"
        decoding="async"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/80" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="font-playfair font-black text-5xl md:text-7xl lg:text-8xl mb-6 text-primary">
          ILLUMINATING THE
          <br />
          <span className="text-gradient">
            FUTURE OF TECH
          </span>
        </h1>
        
        <p className="font-inter text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover tomorrow's technology today. Where innovation meets 
          insight in the digital frontier.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="btn btn-primary font-bold text-lg px-8 py-6"
            aria-label="Explore future technology articles and news"
            onClick={() => {
              requestAnimationFrame(() => {
                const mainFeed = document.querySelector('main');
                mainFeed?.scrollIntoView({ behavior: 'smooth' });
              });
            }}
          >
            EXPLORE THE FUTURE
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="btn btn-outline font-bold text-lg px-8 py-6"
            aria-label="Stay connected with tech culture and community"
            onClick={() => {
              requestAnimationFrame(() => {
                const footer = document.querySelector('footer');
                footer?.scrollIntoView({ behavior: 'smooth' });
              });
            }}
          >
            STAY ROOTED
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
