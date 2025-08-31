import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  featured?: boolean;
}

const ArticleCard = ({ title, excerpt, category, date, imageUrl, featured = false }: ArticleCardProps) => {
  return (
    <Card className={`${
      featured ? 'md:col-span-2 lg:col-span-3' : ''
    } bg-gradient-card border-card-border hover:border-primary/50 transition-all duration-300 hover-lift overflow-hidden group cursor-pointer`}>
      
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? 'h-80' : 'h-48'}`}>
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <Badge 
          className="absolute top-4 left-4 bg-primary/90 text-primary-foreground font-orbitron font-bold glow-primary"
        >
          {category}
        </Badge>
        
        {featured && (
          <Badge 
            className="absolute top-4 right-4 bg-accent/90 text-accent-foreground font-orbitron font-bold glow-accent"
          >
            FEATURED
          </Badge>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className={`font-orbitron font-bold mb-3 line-clamp-2 group-hover:text-glow-primary transition-all duration-300 ${
          featured ? 'text-2xl' : 'text-lg'
        }`}>
          {title}
        </h3>
        
        <p className={`text-muted-foreground font-roboto mb-4 line-clamp-3 ${
          featured ? 'text-base' : 'text-sm'
        }`}>
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-roboto">
            {date}
          </span>
          <span className="text-sm text-accent font-roboto font-medium">
            Read More →
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;