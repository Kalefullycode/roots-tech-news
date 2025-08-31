import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BreakingNewsBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-destructive/90 to-cyber-pink/90 border-b border-destructive">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-foreground animate-pulse-safe" />
            <Badge className="bg-foreground text-destructive font-orbitron font-bold">
              BREAKING
            </Badge>
          </div>
          
          <div className="flex-1">
            <p className="text-foreground font-roboto font-medium">
              🚨 <strong>LIVE:</strong> Major AI breakthrough announced - Quantum neural networks achieve 99.9% accuracy in real-world testing
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-foreground hover:bg-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsBanner;