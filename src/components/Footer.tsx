import { Button } from "@/components/ui/button";
import { 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Rss
} from "lucide-react";

const Footer = () => {
  const categories = [
    { name: "AI", href: "#ai" },
    { name: "Startups", href: "#startups" },
    { name: "Culture", href: "#culture" },
    { name: "Gadgets", href: "#gadgets" },
    { name: "Security", href: "#security" }
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Rss, href: "#", label: "RSS Feed" }
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
                <a
                  key={category.name}
                  href={category.href}
                  className="block text-muted-foreground hover:text-primary transition-colors font-roboto"
                >
                  {category.name}
                </a>
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
                  <a href={social.href} aria-label={social.label}>
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
              <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Neon Elements */}
      <div className="absolute bottom-10 left-10 w-3 h-3 bg-neon-blue rounded-full animate-pulse opacity-40" />
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-cyber-pink rounded-full animate-pulse opacity-40" />
    </footer>
  );
};

export default Footer;