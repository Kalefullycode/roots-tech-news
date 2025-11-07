import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";

interface DarkArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  url?: string;
}

const DarkArticleCard = ({ title, excerpt, category, date, imageUrl, url }: DarkArticleCardProps) => {
  const handleClick = () => {
    if (url && url !== "#" && url !== "") {
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
    <div 
      className="article-card-redesigned cursor-pointer"
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
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
        <img 
          src={imageUrl}
          alt={`${title} - ${category} article thumbnail`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        
        {/* Category Badge */}
        <Badge className="absolute top-3 left-3 bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs font-semibold">
          {category}
        </Badge>
      </div>
      
      {/* Content */}
      <div className="card-body">
        <h3 className="line-clamp-2 mb-2">
          {title}
        </h3>
        
        <p className="line-clamp-3 mb-4">
          {excerpt}
        </p>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <span className="date flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {date}
        </span>
        <a
          href={url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="listen-button"
          onClick={(e) => {
            e.stopPropagation();
            if (url) {
              handleClick();
            }
          }}
        >
          Read More
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default DarkArticleCard;

