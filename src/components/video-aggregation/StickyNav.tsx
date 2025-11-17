import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoCategory } from '@/types/video';
import { cn } from '@/lib/utils';

const CATEGORIES: VideoCategory[] = [
  'All',
  'Breaking News',
  'AI/ML',
  'Startups',
  'Product Launches',
  'Interviews',
  'Tutorials',
  'Conferences',
  'Quick Takes',
  'Deep Dives',
];

interface StickyNavProps {
  activeCategory: VideoCategory;
  onCategoryChange: (category: VideoCategory) => void;
}

export function StickyNav({ activeCategory, onCategoryChange }: StickyNavProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-card-border/60 transition-all',
        isSticky && 'shadow-lg'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <Button
                key={category}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  'whitespace-nowrap',
                  isActive && 'bg-primary text-primary-foreground'
                )}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

