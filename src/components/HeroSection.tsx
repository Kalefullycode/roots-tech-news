import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-starfield">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/80" />
      
      {/* Holographic Grid */}
      <div className="absolute inset-0 bg-holographic opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-6 text-glow-primary">
          ILLUMINATING THE
          <br />
          <span className="text-transparent bg-gradient-accent bg-clip-text">
            FUTURE OF TECH
          </span>
        </h1>
        
        <p className="font-roboto text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover tomorrow's technology today through an Afro-futuristic lens. 
          Where innovation meets culture in the digital frontier.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-hero hover:glow-primary font-orbitron font-bold text-lg px-8 py-6"
          >
            EXPLORE THE FUTURE
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-neon font-orbitron font-bold text-lg px-8 py-6 hover:bg-primary/10"
          >
            STAY ROOTED
          </Button>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-accent rounded-full animate-pulse opacity-60" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-neon-blue rounded-full animate-pulse opacity-60" />
      <div className="absolute bottom-20 left-20 w-5 h-5 bg-cyber-pink rounded-full animate-pulse opacity-60" />
      <div className="absolute bottom-40 right-10 w-2 h-2 bg-secondary rounded-full animate-pulse opacity-60" />
    </section>
  );
};

export default HeroSection;