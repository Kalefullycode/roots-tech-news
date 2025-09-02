import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  featured?: boolean;
  url?: string;
}

const ArticleCard = ({ title, excerpt, category, date, imageUrl, featured = false, url }: ArticleCardProps) => {
  const handleClick = () => {
    if (url && url !== "#" && url !== "") {
      // Check if it's a valid external URL
      try {
        const urlObj = new URL(url);
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      } catch (error) {
        console.warn('Invalid URL:', url);
      }
    }
  };

  return (
    <Card 
      className={`${
        featured ? 'md:col-span-2 lg:col-span-3' : ''
      } bg-card-modern border border-card-border/60 hover:border-primary/70 hover:shadow-card-elevated transition-all duration-300 hover-lift overflow-hidden group cursor-pointer focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-background backdrop-blur-sm`}
      onClick={handleClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Read article: ${title}`}
    >
      
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? 'h-80' : 'h-52'} rounded-t-lg`}>
        <img 
          src={imageUrl} 
          srcSet={`${imageUrl} 1x`}
          sizes={featured ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" : "(max-width: 768px) 100vw, 50vw"}
          alt={`${title} - ${category} article thumbnail`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Category Badge */}
        <Badge 
          className="absolute top-5 left-5 bg-primary/95 text-primary-foreground font-orbitron font-semibold text-xs px-3 py-1.5 rounded-full border border-primary/20 shadow-md backdrop-blur-sm"
        >
          {category}
        </Badge>
        
        {featured && (
          <Badge 
            className="absolute top-5 right-5 bg-accent/95 text-accent-foreground font-orbitron font-semibold text-xs px-3 py-1.5 rounded-full border border-accent/20 shadow-md backdrop-blur-sm"
          >
            FEATURED
          </Badge>
        )}
      </div>
      
      {/* Content */}
      <div className={`p-7 ${featured ? 'p-8' : ''}`}>
        <h3 className={`font-orbitron font-bold mb-4 line-clamp-2 text-foreground group-hover:text-primary transition-all duration-300 leading-tight ${
          featured ? 'text-2xl' : 'text-lg'
        }`}>
          {title}
        </h3>
        
        <p className={`text-muted-foreground font-roboto mb-6 line-clamp-3 leading-relaxed ${
          featured ? 'text-base' : 'text-sm'
        }`}>
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <span className="text-sm text-muted-foreground font-roboto">
            {date}
          </span>
          <span className="text-sm text-accent font-roboto font-medium group-hover:text-accent-glow transition-colors duration-300 flex items-center gap-1">
            Read More
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;