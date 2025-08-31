import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNews } from "@/hooks/useNews";

const LiveNewsIndicator = () => {
  const { isLoading, isError, isFetching, refetch, dataUpdatedAt } = useNews();

  const getLastUpdateTime = () => {
    if (!dataUpdatedAt) return '';
    const diff = Date.now() - dataUpdatedAt;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    return `${minutes} mins ago`;
  };

  return (
    <div className="flex items-center gap-3 mb-6 p-4 bg-card border border-card-border rounded-lg">
      <div className="flex items-center gap-2">
        {isError ? (
          <WifiOff className="h-4 w-4 text-destructive" />
        ) : (
          <Wifi className="h-4 w-4 text-secondary" />
        )}
        
        <Badge 
          variant={isError ? "destructive" : "secondary"}
          className="font-orbitron text-xs"
        >
          {isError ? 'OFFLINE' : 'LIVE'}
        </Badge>
      </div>

      <div className="flex-1 text-sm text-muted-foreground font-roboto">
        {isError ? (
          'News feed unavailable'
        ) : (
          `Last updated: ${getLastUpdateTime()}`
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => refetch()}
        disabled={isFetching}
        className="h-8 px-3 font-orbitron text-xs hover:glow-primary"
      >
        <RefreshCw className={`h-3 w-3 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
        {isFetching ? 'UPDATING' : 'REFRESH'}
      </Button>
    </div>
  );
};

export default LiveNewsIndicator;