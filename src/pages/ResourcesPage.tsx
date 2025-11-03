import { Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Lazy load components
const AIToolsSection = lazy(() => import('@/components/AIToolsSection'));
const BooksSection = lazy(() => import('@/components/BooksSection'));
const Header = lazy(() => import('@/components/Header'));
const Footer = lazy(() => import('@/components/Footer'));

const ResourcesPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Resources - AI Tools & Books - RootsTechNews</title>
        <meta name="description" content="Discover powerful AI tools, essential tech books, and curated resources for developers, entrepreneurs, and tech enthusiasts." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Suspense fallback={<div className="h-16 bg-background border-b border-border animate-pulse" />}>
          <Header />
        </Suspense>

        {/* Page Header */}
        <div className="bg-card border-b border-card-border">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-6 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🛠️</span>
                <h1 className="font-orbitron text-4xl font-bold">
                  Resources
                </h1>
              </div>
              <p className="font-roboto text-lg opacity-90 max-w-2xl">
                Curated AI tools, essential tech books, and resources to power your journey in technology
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* AI Tools Section */}
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg mb-12" />}>
            <AIToolsSection />
          </Suspense>

          {/* Books Section */}
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <BooksSection />
          </Suspense>
        </div>

        <Suspense fallback={<div className="h-32 bg-muted animate-pulse" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default ResourcesPage;

