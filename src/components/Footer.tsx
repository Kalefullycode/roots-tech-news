import { Button } from "@/components/ui/button";
import { 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Rss
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "AI", href: "/category/ai" },
    { name: "Startups", href: "/category/startups" },
    { name: "Culture", href: "/category/culture" },
    { name: "Gadgets", href: "/category/gadgets" },
    { name: "Security", href: "/category/security" }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/rootstechnews", label: "Follow RootsTechNews on Twitter" },
    { icon: Instagram, href: "https://instagram.com/rootstechnews", label: "Follow RootsTechNews on Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/rootstechnews", label: "Connect with RootsTechNews on LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/@rootstechnews", label: "Subscribe to RootsTechNews on YouTube" },
    { icon: Github, href: "https://github.com/rootstechnews", label: "View RootsTechNews source code on GitHub" },
    { icon: Rss, href: "/rss.xml", label: "Subscribe to RSS feed" }
  ];

  return (
    <footer className="bg-card border-t border-card-border mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="font-orbitron text-3xl font-bold text-glow-primary mb-4">
              Roots<span className="text-accent">Tech</span>News
            </h3>
            <p className="text-muted-foreground font-roboto mb-6 max-w-md">
              Illuminating the future of technology through an Afro-futuristic lens. 
              Where innovation meets culture in the digital frontier.
            </p>
            <p className="font-orbitron font-bold text-accent text-lg text-glow-accent">
              Future of Tech, Rooted in Innovation.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-orbitron font-bold text-lg mb-4 text-foreground">
              EXPLORE
            </h4>
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => navigate(category.href)}
                  className="block text-muted-foreground hover:text-primary transition-colors font-roboto bg-transparent border-none cursor-pointer text-left"
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-orbitron font-bold text-lg mb-4 text-foreground">
              CONNECT
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-primary/20 hover:text-primary transition-all duration-300 glow-primary"
                >
                  <a 
                    href={social.href} 
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-card-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm font-roboto">
              © 2024 RootsTechNews. All rights reserved. Built with love and innovation.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <button 
                onClick={() => navigate('/privacy')}
                className="text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigate('/terms')}
                className="text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Neon Elements */}
      <div className="absolute bottom-10 left-10 w-3 h-3 bg-neon-blue rounded-full animate-pulse-safe opacity-40" />
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-cyber-pink rounded-full animate-pulse-safe opacity-40" />
    </footer>
  );
};

export default Footer;