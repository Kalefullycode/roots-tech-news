import { useState } from "react";
import { Search, Menu, X, Rss, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_STRUCTURE } from "@/data/navigationStructure";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Scroll to main content and highlight search functionality
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
      // You can add more sophisticated search handling here
      console.log('Searching for:', searchQuery);
    }
  };

  const handleCategoryClick = (categoryUrl: string) => {
    navigate(categoryUrl);
  };

  const handleSectionClick = (href: string) => {
    setActiveDropdown(null);
    setMobileDropdown(null);
    setIsMenuOpen(false);
    
    // Check if it's a route navigation
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }
    
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-md bg-background/90" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleHomeClick}>
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
            {NAVIGATION_STRUCTURE.map((category) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleCategoryClick(`/category/${category.name.toLowerCase()}`)}
                  className="font-roboto font-medium text-foreground hover:text-primary transition-colors duration-200 hover:text-glow-primary bg-transparent border-none cursor-pointer flex items-center gap-1"
                >
                  {category.name}
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === category.name ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === category.name && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-card-border rounded-lg shadow-2xl py-2 z-50 backdrop-blur-md">
                    {category.sections.map((section) => (
                      <button
                        key={section.href}
                        onClick={() => handleSectionClick(section.href)}
                        className="w-full text-left block px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border/30 last:border-0"
                      >
                        <div className="font-medium text-foreground text-sm">
                          {section.title}
                        </div>
                        {section.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {section.description}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search & Menu */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tech news..."
                className="w-64 bg-input border-border focus:border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Search tech news articles"
              />
            </form>
            
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
              <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tech news..."
                  className="flex-1 bg-input border-border"
                />
              </form>
              
              {NAVIGATION_STRUCTURE.map((category) => (
                <div key={category.name} className="mb-2">
                  <button
                    onClick={() => {
                      if (mobileDropdown === category.name) {
                        setMobileDropdown(null);
                      } else {
                        setMobileDropdown(category.name);
                      }
                    }}
                    className="font-orbitron text-lg font-medium text-foreground hover:text-primary transition-colors py-2 text-left bg-transparent border-none cursor-pointer w-full flex items-center justify-between"
                  >
                    <span>{category.name}</span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        mobileDropdown === category.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Mobile Dropdown */}
                  {mobileDropdown === category.name && (
                    <div className="ml-4 mt-2 space-y-2">
                      {category.sections.map((section) => (
                        <button
                          key={section.href}
                          onClick={() => handleSectionClick(section.href)}
                          className="w-full text-left block px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                        >
                          {section.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;