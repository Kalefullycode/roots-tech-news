
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import PreconnectHints from "@/components/PreconnectHints";
import Index from "./pages/Index";
// import EmergencyIndex from "./pages/EmergencyIndex"; // Uncomment to test

// Lazy load non-critical pages to reduce initial bundle size
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const YouTubePage = lazy(() => import("./pages/YouTubePage"));
const PodcastsPage = lazy(() => import("./pages/PodcastsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

// Lazy load the 404 page since it's only needed when user hits an invalid route
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    },
  },
});

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <PreconnectHints />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/category/:category" 
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>}>
                    <CategoryPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/videos" 
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>}>
                    <YouTubePage />
                  </Suspense>
                } 
              />
              <Route 
                path="/podcasts" 
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>}>
                    <PodcastsPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>}>
                    <ContactPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/privacy" 
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>}>
                    <PrivacyPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/terms" 
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>}>
                    <TermsPage />
                  </Suspense>
                } 
              />
              <Route 
                path="*" 
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">Loading...</div></div>}>
                    <NotFound />
                  </Suspense>
                } 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
