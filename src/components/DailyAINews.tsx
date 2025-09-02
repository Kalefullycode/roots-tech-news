import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  Globe,
  Zap,
  TrendingUp
} from "lucide-react";

const DailyAINews = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration] = useState("1:23");

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Here you would integrate with actual audio/speech synthesis
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    setCurrentTime("0:00");
    setIsPlaying(false);
  };

  const todaysStories = [
    {
      title: "OpenAI Announces GPT-5 with Revolutionary Multimodal Capabilities",
      time: "2 hours ago",
      source: "TechCrunch",
      impact: "High"
    },
    {
      title: "Google's New AI Chip Outperforms NVIDIA in Energy Efficiency",
      time: "4 hours ago", 
      source: "MIT Technology Review",
      impact: "Medium"
    },
    {
      title: "African AI Startup Secures $50M for Healthcare Diagnostics",
      time: "6 hours ago",
      source: "Disrupt Africa", 
      impact: "High"
    },
    {
      title: "EU Finalizes AI Regulation Framework with Global Implications",
      time: "8 hours ago",
      source: "Reuters",
      impact: "Medium"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="font-orbitron text-2xl font-bold text-glow-primary">
              Daily AI Briefing
            </h2>
            <p className="text-sm text-muted-foreground">
              Your 60-second AI news update
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <Badge className="bg-accent/20 text-accent border-accent/30">
            <Globe className="h-3 w-3 mr-1" />
            Global
          </Badge>
        </div>
      </div>

      {/* Audio Player Interface */}
      <Card className="bg-card-modern border border-card-border/60 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className={`rounded-full w-14 h-14 ${
                isPlaying 
                  ? "bg-accent hover:bg-accent/80" 
                  : "bg-primary hover:bg-primary/80"
              }`}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRestart}
                className="hover:bg-primary/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMute}
                className="hover:bg-primary/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-orbitron text-lg font-bold text-primary">
              {currentTime} / {duration}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPlaying ? "Playing..." : "Ready to play"}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-border rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: isPlaying ? "35%" : "0%" }}
          />
        </div>
        
        <div className="text-center">
          <p className="font-orbitron text-sm font-semibold text-primary mb-2">
            Today's AI Highlights - {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by advanced AI voice synthesis • Updated every hour
          </p>
        </div>
      </Card>

      {/* Story Headlines */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="font-orbitron font-semibold text-accent">
            Today's Top Stories
          </h3>
        </div>
        
        {todaysStories.map((story, index) => (
          <Card 
            key={index}
            className="p-4 bg-card border border-card-border/40 hover:border-primary/40 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-roboto font-semibold text-foreground mb-2 line-clamp-2">
                  {story.title}
                </h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{story.source}</span>
                  <span>•</span>
                  <span>{story.time}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <Badge className={getImpactColor(story.impact)}>
                  {story.impact} Impact
                </Badge>
                <span className="text-xs text-muted-foreground">
                  #{index + 1}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/30">
        <Button className="flex-1 bg-gradient-hero hover:glow-primary">
          <Play className="h-4 w-4 mr-2" />
          Listen to Full Briefing
        </Button>
        <Button variant="outline" className="flex-1 border-primary hover:bg-primary/10">
          Subscribe to Daily AI News
        </Button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">
            AI Voice System Active
          </span>
        </div>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">
          Next update in 47 minutes
        </span>
      </div>
    </Card>
  );
};

export default DailyAINews;