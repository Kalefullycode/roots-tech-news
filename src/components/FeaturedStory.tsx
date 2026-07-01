import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, Eye } from "lucide-react";

interface FeaturedStoryProps {
  title?: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  date?: string;
  readTime?: string;
  author?: string;
  slug?: string;
}

const FeaturedStory: React.FC<FeaturedStoryProps> = ({
  title = "Major AI Breakthrough: Quantum Neural Networks Achieve 99.9% Accuracy",
  excerpt = "Revolutionary quantum neural networks demonstrate unprecedented accuracy in real-world testing, marking a significant milestone in artificial intelligence development.",
  imageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
  category = "Artificial Intelligence",
  date = "August 31, 2025",
  readTime = "8 min read",
  author = "Dr. Amara Okafor",
  slug = "/ai/quantum-neural-breakthrough"
}) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="featured-article">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <img 
                src={imageUrl}
                alt={title}
                className="featured-article-image rounded-lg object-cover w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            {/* Content */}
            <div className="featured-article-content order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-4">
                <span className="badge badge-primary">{category}</span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{readTime}</span>
                </div>
              </div>
              
              <h2 className="featured-article-title">{title}</h2>
              <p className="featured-article-excerpt">{excerpt}</p>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`}
                    alt={author}
                    className="h-10 w-10 rounded-full"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{author}</p>
                    <p className="text-sm text-gray-500">Senior Tech Correspondent</p>
                  </div>
                </div>
                
                <Button asChild className="btn btn-primary">
                  <Link to={slug}>Read Full Story</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStory;
