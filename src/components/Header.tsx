import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Startups', href: '/category/startups' },
    { name: 'Security', href: '/category/security' },
    { name: 'Videos', href: '/videos' },
    { name: 'Live', href: '/videos/live' },
    { name: 'Podcasts', href: '/podcasts' },
    { name: 'Resources', href: '/resources' },
    { name: 'Blog', href: '/blog' },
  ];

  const aiNewsMenu = [
    { name: 'All AI News', href: '/category/ai', description: 'Latest AI developments' },
    { name: 'Daily Briefing', href: '/ai/daily-briefing', description: '60-second AI updates' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-xl font-display font-bold text-primary group-hover:text-primary-dark transition-colors">
            Roots Tech News
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* AI News Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 group border ${
                  isActive('/category/ai') || isActive('/ai/daily-briefing')
                    ? 'bg-primary/5 text-primary border-primary/20'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50 border-transparent'
                }`}
              >
                <span>AI News</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-64 bg-popover border border-border/50 shadow-lg rounded-xl p-2 mt-2"
            >
              {aiNewsMenu.map((item, index) => (
                <div key={item.href}>
                  <DropdownMenuItem asChild>
                    <Link 
                      to={item.href} 
                      className="cursor-pointer text-foreground hover:text-primary rounded-lg px-3 py-2.5 flex items-start gap-3 group/item transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm group-hover/item:text-primary transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  {index < aiNewsMenu.length - 1 && (
                    <DropdownMenuSeparator className="my-1 bg-border/50" />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 border ${
                isActive(item.href)
                  ? 'bg-primary/5 text-primary border-primary/20'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-50 border-transparent'
              }`}
            >
              <span>{item.name}</span>
            </Link>
          ))}
          
          {/* Newsletter Subscribe Button */}
          <div className="ml-3 pl-3 border-l border-border/50">
            <NewsletterSubscribe variant="compact" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-popover">
          <div className="container px-4 pt-4 pb-6 space-y-2">
            {/* AI News Section */}
            <div className="space-y-2 pb-4 border-b border-border/50">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                AI News
              </div>
              {aiNewsMenu.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all border ${
                    isActive(item.href)
                      ? 'bg-primary/5 text-primary border-primary/20'
                      : 'text-foreground hover:text-primary hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-3 border ${
                  isActive(item.href)
                    ? 'bg-primary/5 text-primary border-primary/20'
                    : 'text-foreground hover:text-primary hover:bg-gray-50 border-transparent'
                }`}
              >
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            ))}
            
            {/* Newsletter Subscribe Button for Mobile */}
            <div className="pt-4 border-t border-border/50">
              <NewsletterSubscribe variant="compact" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
