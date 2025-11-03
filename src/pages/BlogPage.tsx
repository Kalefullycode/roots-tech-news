import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Lazy load components
const Header = lazy(() => import('@/components/Header'));
const Footer = lazy(() => import('@/components/Footer'));

// Blog posts data - can be extended to load from MDX files dynamically
const blogPosts = [
  {
    slug: 'afrofuturism-tech-culture',
    title: 'Afrofuturism and Tech Culture: Shaping the Future',
    description: 'Exploring how Afrofuturism influences modern technology culture and innovation.',
    date: '2025-01-15',
    category: 'Culture',
    readingTime: '5 min read'
  },
  {
    slug: 'ai-breakthrough-quantum-neural',
    title: 'AI Breakthrough: Quantum Neural Networks Achieve 99.9% Accuracy',
    description: 'Revolutionary quantum neural networks demonstrate unprecedented accuracy in real-world testing.',
    date: '2025-01-10',
    category: 'AI',
    readingTime: '7 min read'
  },
  {
    slug: 'cybersecurity-quantum-threats',
    title: 'Cybersecurity Threats in the Quantum Computing Era',
    description: 'Understanding the new security challenges posed by quantum computing advancements.',
    date: '2025-01-05',
    category: 'Security',
    readingTime: '6 min read'
  },
  {
    slug: 'next-gen-smartphone-tech',
    title: 'Next-Generation Smartphone Technology: What to Expect',
    description: 'A deep dive into upcoming smartphone innovations and their impact on daily life.',
    date: '2024-12-28',
    category: 'Gadgets',
    readingTime: '4 min read'
  },
  {
    slug: 'startup-disrupting-fintech',
    title: 'African Startup Disrupting Fintech with AI-Powered Solutions',
    description: 'How innovative African startups are transforming the financial technology landscape.',
    date: '2024-12-20',
    category: 'Startups',
    readingTime: '6 min read'
  }
];

const BlogPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Blog - Tech Insights & Articles - RootsTechNews</title>
        <meta name="description" content="Read in-depth articles, tech insights, and analysis on AI, startups, security, and emerging technologies." />
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
                <BookOpen className="h-10 w-10" />
                <h1 className="font-orbitron text-4xl font-bold">
                  Blog
                </h1>
              </div>
              <p className="font-roboto text-lg opacity-90 max-w-2xl">
                In-depth articles, tech insights, and analysis on AI, startups, security, and emerging technologies
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card 
                key={post.slug}
                className="bg-card-modern border border-card-border/60 hover:border-primary/50 transition-all hover-lift group"
              >
                <Link 
                  to={`/blog/${post.slug}`}
                  className="block p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.readingTime}</span>
                  </div>
                  
                  <h2 className="font-orbitron text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </time>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

          {blogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Coming soon - check back for new articles!</p>
            </div>
          )}
        </div>

        <Suspense fallback={<div className="h-32 bg-muted animate-pulse" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default BlogPage;

