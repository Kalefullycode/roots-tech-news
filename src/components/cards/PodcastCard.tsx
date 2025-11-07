import { Play, ExternalLink, Clock } from "lucide-react";
import { PodcastEpisode } from "@/services/PodcastService";

interface PodcastCardProps {
  podcast: PodcastEpisode;
}

const PodcastCard = ({ podcast }: PodcastCardProps) => {
  return (
    <div className="article-card-redesigned">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-lg overflow-hidden">
          <img 
            src={podcast.thumbnail}
            alt={podcast.podcastName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="card-header">
            <span className="category-badge">
              {podcast.category}
            </span>
            {podcast.duration && (
              <span className="duration">
                <Clock className="inline h-3 w-3 mr-1" />
                {podcast.duration}
              </span>
            )}
          </div>

          <div className="card-body">
            <h3 className="line-clamp-2">
              {podcast.title}
            </h3>
            
            <p className="mb-2">
              {podcast.podcastName}
            </p>

            <p className="line-clamp-2">
              {podcast.description}
            </p>
          </div>

          <div className="card-footer">
            <span className="date">
              {new Date(podcast.publishedAt).toLocaleDateString()}
            </span>
            <a
              href={podcast.url}
              target="_blank"
              rel="noopener noreferrer"
              className="listen-button"
              onClick={(e) => {
                e.preventDefault();
                window.open(podcast.url, '_blank');
              }}
            >
              <Play className="h-4 w-4" />
              Listen
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;

