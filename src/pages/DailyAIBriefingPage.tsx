import { Suspense, lazy } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DailyAINews = lazy(() => import('@/components/DailyAINews'));

const DailyAIBriefingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              ⚡ Daily AI Briefing
            </h1>
            <p className="text-gray-400">
              Your 60-second AI news update • Updated hourly
            </p>
          </div>
          
          <Suspense fallback={
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          }>
            <DailyAINews />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DailyAIBriefingPage;

