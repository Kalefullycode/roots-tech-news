import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RealTimeNewsTicker = () => {
  const [tickerItems, setTickerItems] = useState<string[]>([
    "Apple announces new AI features in iOS 19",
    "Microsoft to acquire AI startup for $2 billion",
    "New study reveals impact of AI on job market",
    "OpenAI announces GPT-5 with multimodal capabilities",
    "Cybersecurity experts warn of new phishing campaign"
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, tickerItems.length]);

  const scrollLeft = () => {
    setCurrentIndex((prev) => (prev - 1 + tickerItems.length) % tickerItems.length);
  };

  const scrollRight = () => {
    setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
  };

  if (tickerItems.length === 0) return null;

  return (
    <div 
      className="border-b border-gray-200 bg-white py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          
          <div className="flex-1 overflow-hidden">
            <div 
              className="flex gap-8 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {tickerItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-full text-center"
                >
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeNewsTicker;
