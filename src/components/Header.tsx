import { useState } from "react";
import { Search, Menu, X, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = ["AI", "Startups", "Culture", "Gadgets", "Security"];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-md bg-background/90" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Rss className="h-6 w-6 text-accent glow-accent" />
              <h1 className="font-orbitron text-2xl font-bold text-glow-primary">
                Roots<span className="text-accent">Tech</span>News
              </h1>
            </div>
            <Badge className="bg-secondary/20 text-secondary border-secondary font-orbitron text-xs animate-pulse-safe">
              LIVE
            </Badge>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase()}`}
                className="font-roboto font-medium text-foreground hover:text-primary transition-colors duration-200 hover:text-glow-primary"
              >
                {category}
              </a>
            ))}
          </nav>

          {/* Search & Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tech news..."
                className="w-64 bg-input border-border focus:border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Search tech news articles"
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={isMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-popover border-t border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search tech news..."
                  className="flex-1 bg-input border-border"
                />
              </div>
              
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${category.toLowerCase()}`}
                  className="font-orbitron text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;