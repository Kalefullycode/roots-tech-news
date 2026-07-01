import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

interface ArticleCardProps {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  date?: string;
  readTime?: string;
  author?: string;
  slug: string;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt = "",
  imageUrl,
  category = "Technology",
  date,
  readTime,
  author,
  slug,
  className = ""
}) => {
  return (
    <article className={`article-card ${className}`}>
      {imageUrl && (
        <img 
          src={imageUrl}
          alt={title}
          className="article-card-image"
          loading="lazy"
          decoding="async"
        />
      )}
      
      <div className="article-card-content">
        <div className="flex items-center gap-4 mb-3">
          <span className="badge badge-primary">{category}</span>
          {date && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>{date}</span>
            </div>
          )}
          {readTime && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{readTime}</span>
            </div>
          )}
        </div>
        
        <h3 className="article-card-title">
          <Link to={slug} className="hover:text-primary-dark transition-colors">
            {title}
          </Link>
        </h3>
        
        {excerpt && (
          <p className="article-card-excerpt line-clamp-3">{excerpt}</p>
        )}
        
        {author && (
          <div className="article-card-meta">
            <span>By {author}</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;
