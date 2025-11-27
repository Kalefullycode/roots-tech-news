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

  // Navigation structure matching creative.tech
  const theLatestMenu = [
    { name: 'AI News', href: '/category/ai', icon: '🤖', description: 'Latest AI developments' },
    { name: 'Technology', href: '/category/technology', icon: '💻', description: 'Tech innovations' },
    { name: 'Startups', href: '/category/startups', icon: '🚀', description: 'Startup ecosystem' },
    { name: 'Security', href: '/category/security', icon: '🔒', description: 'Cybersecurity news' },
  ];

  const chatMenu = [
    { name: 'Podcast Series', href: '/podcasts', icon: '🎙️', description: 'Tech podcasts' },
    { name: 'Daily Briefing', href: '/ai/daily-briefing', icon: '⚡', description: '60-second AI updates' },
  ];

  const featuredTopicsMenu = [
    { name: '3D', href: '/category/3d', icon: '🎨', description: '3D design & modeling' },
    { name: 'AI Filmmaking', href: '/category/ai-filmmaking', icon: '🎬', description: 'AI in film production' },
    { name: 'Creative Coding', href: '/category/creative-coding', icon: '💻', description: 'Code as art' },
    { name: 'Motion Design', href: '/category/motion-design', icon: '✨', description: 'CG / VFX / Animation' },
    { name: 'Projection Mapping', href: '/category/projection-mapping', icon: '📽️', description: 'Spatial projections' },
    { name: 'Volumography', href: '/category/volumography', icon: '📊', description: '3D volumetric capture' },
    { name: 'Spatial XR', href: '/videos', icon: '🥽', description: 'AR / VR / Mixed Reality' },
  ];

  const simpleLinks = [
    { name: 'Creators', href: '/creators', icon: '👥' },
    { name: 'Tools', href: '/resources', icon: '🛠️' },
    { name: 'Videos', href: '/videos', icon: '🎥' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isAnyActive = (paths: string[]) => {
    return paths.some(path => isActive(path));
  };

  // Render dropdown menu items with descriptions
  const renderDropdownMenu = (items: typeof theLatestMenu, align: 'start' | 'end' = 'start') => (
    <>
      {items.map((item, index) => (
        <div key={item.href}>
          <DropdownMenuItem asChild>
            <Link 
              to={item.href} 
              className="cursor-pointer text-gray-200 hover:text-white hover:bg-[#1a1a1a] rounded-lg px-4 py-3 flex items-start gap-4 group/item transition-all duration-200 hover:scale-[1.02]"
            >
              <span className="text-2xl mt-0.5">{item.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-sm group-hover/item:text-[#E935FF] transition-colors">
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.description}
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
          {index < items.length - 1 && (
            <DropdownMenuSeparator className="my-1 bg-gray-700" />
          )}
        </div>
      ))}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-700 bg-[#000000]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#000000]/80">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-xl font-display font-bold bg-gradient-to-r from-[#E935FF] via-[#FF8C00] to-[#E935FF] bg-clip-text text-transparent group-hover:from-[#E935FF] group-hover:via-[#FF8C00] transition-all">
            Roots Tech News
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {/* The Latest Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group border relative ${
                  isAnyActive(theLatestMenu.map(i => i.href))
                    ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#E935FF] after:to-[#FF8C00]'
                    : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
                }`}
              >
                <span>The Latest</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-72 bg-[#1a1a1a]/95 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-xl p-3 mt-2"
            >
              {renderDropdownMenu(theLatestMenu)}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Home Link */}
          <Link
            to="/"
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border relative ${
              isActive('/')
                ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#E935FF] after:to-[#FF8C00]'
                : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
            }`}
          >
            Home
          </Link>

          {/* Creators Link */}
          <Link
            to="/creators"
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border relative ${
              isActive('/creators')
                ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#E935FF] after:to-[#FF8C00]'
                : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
            }`}
          >
            Creators
          </Link>

          {/* Chat Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group border relative ${
                  isAnyActive(chatMenu.map(i => i.href))
                    ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#E935FF] after:to-[#FF8C00]'
                    : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
                }`}
              >
                <span>Chat</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-72 bg-[#1a1a1a]/95 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-xl p-3 mt-2"
            >
              {renderDropdownMenu(chatMenu)}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tools Link */}
          <Link
            to="/resources"
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border relative ${
              isActive('/resources')
                ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#E935FF] after:to-[#FF8C00]'
                : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
            }`}
          >
            Tools
          </Link>

          {/* Videos Link */}
          <Link
            to="/videos"
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border relative ${
              isActive('/videos')
                ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#E935FF] after:to-[#FF8C00]'
                : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
            }`}
          >
            Videos
          </Link>

          {/* Featured Topics Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group border relative ${
                  isAnyActive(featuredTopicsMenu.map(i => i.href))
                    ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#E935FF] after:to-[#FF8C00]'
                    : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
                }`}
              >
                <span>Featured Topics</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-80 bg-[#1a1a1a]/95 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-xl p-3 mt-2 max-h-[600px] overflow-y-auto"
            >
              {renderDropdownMenu(featuredTopicsMenu)}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Newsletter Subscribe Button */}
          <div className="ml-4 pl-4 border-l border-gray-700">
            <NewsletterSubscribe variant="compact" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="md:hidden text-white hover:bg-[#1a1a1a]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700 bg-[#000000]/95 backdrop-blur-xl">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {/* Home Link */}
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 border ${
                isActive('/')
                  ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30'
                  : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">🏠</span>
                <span className="font-semibold text-sm">Home</span>
              </div>
            </Link>

            {/* The Latest Section */}
            <div className="space-y-3 pb-4 border-b border-gray-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                The Latest
              </div>
              {theLatestMenu.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 border ${
                    isActive(item.href)
                      ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30'
                      : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Creators Link */}
            <Link
              to="/creators"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 border ${
                isActive('/creators')
                  ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30'
                  : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">👥</span>
                <span className="font-semibold text-sm">Creators</span>
              </div>
            </Link>

            {/* Chat Section */}
            <div className="space-y-3 pb-4 border-b border-gray-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Chat
              </div>
              {chatMenu.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 border ${
                    isActive(item.href)
                      ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30'
                      : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Tools Link */}
            <Link
              to="/resources"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 border ${
                isActive('/resources')
                  ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30'
                  : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">🛠️</span>
                <span className="font-semibold text-sm">Tools</span>
              </div>
            </Link>

            {/* Videos Link */}
            <Link
              to="/videos"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 border ${
                isActive('/videos')
                  ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30'
                  : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">🎥</span>
                <span className="font-semibold text-sm">Videos</span>
              </div>
            </Link>

            {/* Featured Topics Section */}
            <div className="space-y-3 pb-4 border-b border-gray-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Featured Topics
              </div>
              {featuredTopicsMenu.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 border ${
                    isActive(item.href)
                      ? 'bg-[#E935FF]/20 text-[#E935FF] border-[#E935FF]/30'
                      : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Newsletter Subscribe */}
            <div className="pt-4 border-t border-gray-700">
              <NewsletterSubscribe variant="compact" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;

