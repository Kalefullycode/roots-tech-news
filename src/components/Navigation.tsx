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

  const aiNewsMenu = [
    { name: 'All AI News', href: '/category/ai', icon: '📰', description: 'Latest AI developments' },
    { name: 'Daily Briefing', href: '/ai/daily-briefing', icon: '⚡', description: '60-second AI updates' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent group-hover:from-primary-400 group-hover:via-secondary-400 transition-all">
            Roots Tech News
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* AI News Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                  isActive('/category/ai') || isActive('/ai/daily-briefing')
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <span className="text-base">{'🤖'}</span>
                <span>AI News</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-800/50 shadow-2xl rounded-xl p-2 mt-2"
            >
              {aiNewsMenu.map((item, index) => (
                <div key={item.href}>
                  <DropdownMenuItem asChild>
                    <Link 
                      to={item.href} 
                      className="cursor-pointer text-gray-200 hover:text-white hover:bg-gray-800/50 rounded-lg px-3 py-2.5 flex items-start gap-3 group/item transition-colors"
                    >
                      <span className="text-xl mt-0.5">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm group-hover/item:text-primary-400 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  {index < aiNewsMenu.length - 1 && (
                    <DropdownMenuSeparator className="my-1 bg-gray-800/50" />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-transparent ${
                isActive(item.href)
                  ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          
          {/* Newsletter Subscribe Button */}
          <div className="ml-3 pl-3 border-l border-gray-800/50">
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
        <div className="md:hidden border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {/* AI News Section */}
            <div className="space-y-2 pb-4 border-b border-gray-800/50">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                AI News
              </div>
              {aiNewsMenu.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
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
                className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  isActive(item.href)
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-800/50">
              <NewsletterSubscribe variant="compact" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;

