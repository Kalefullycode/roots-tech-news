import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Technology', href: '/category/technology', icon: '💻' },
    { name: 'Startups', href: '/category/startups', icon: '🚀' },
    { name: 'Security', href: '/category/security', icon: '🔒' },
    { name: 'Videos', href: '/videos', icon: '🎥' },
    { name: 'Live', href: '/videos/live', icon: '🔴' },
    { name: 'Podcasts', href: '/podcasts', icon: '🎙️' },
    { name: 'Resources', href: '/resources', icon: '🛠️' },
    { name: 'Blog', href: '/blog', icon: '📝' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Roots Tech News
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {/* AI News Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  isActive('/category/ai') || isActive('/ai/daily-briefing')
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="mr-1">🤖</span>
                AI News
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-dark-800 border-dark-600">
              <DropdownMenuItem asChild>
                <Link to="/category/ai" className="cursor-pointer text-white hover:bg-dark-700">
                  <span className="mr-2">📰</span>
                  All AI News
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/ai/daily-briefing" className="cursor-pointer text-white hover:bg-dark-700">
                  <span className="mr-2">⚡</span>
                  Daily AI Briefing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          {/* Newsletter Subscribe Button */}
          <div className="ml-2">
            <NewsletterSubscribe variant="compact" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-black">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* AI News Section */}
            <div className="space-y-1 pb-2 border-b border-gray-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                AI News
              </div>
              <Link
                to="/category/ai"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/category/ai')
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="mr-2">📰</span>
                All AI News
              </Link>
              <Link
                to="/ai/daily-briefing"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/ai/daily-briefing')
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="mr-2">⚡</span>
                Daily AI Briefing
              </Link>
            </div>
            
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <NewsletterSubscribe variant="compact" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;

