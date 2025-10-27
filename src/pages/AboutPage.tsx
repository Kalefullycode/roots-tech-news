import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap, Users, Globe, Target, Code, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Real-Time Updates",
      description: "Get the latest AI & tech news from 7+ premium sources, updated every 5 minutes with zero CORS issues."
    },
    {
      icon: <Globe className="h-8 w-8 text-accent" />,
      title: "Global Perspective",
      description: "Covering AI breakthroughs, startup funding, gadget reviews, and cybersecurity from around the world."
    },
    {
      icon: <Users className="h-8 w-8 text-neon-blue" />,
      title: "Curated Content",
      description: "Hand-picked articles filtered for AI/tech relevance with smart content filtering to eliminate noise."
    }
  ];

  const techStack = [
    { name: "React 18", purpose: "Modern UI framework" },
    { name: "TypeScript", purpose: "Type-safe development" },
    { name: "Vite", purpose: "Lightning-fast builds" },
    { name: "Tailwind CSS", purpose: "Beautiful, responsive design" },
    { name: "React Query", purpose: "Smart data caching" },
    { name: "Cloudflare Pages", purpose: "Serverless RSS fetching" },
    { name: "Resend", purpose: "Newsletter delivery" },
    { name: "RSS Parser", purpose: "Multi-source aggregation" }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - RootsTechNews</title>
        <meta name="description" content="Learn about RootsTechNews, our mission to illuminate the future of technology, and the team behind the platform." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
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
                <Rocket className="h-12 w-12" />
                <h1 className="font-orbitron text-4xl font-bold">
                  About RootsTechNews
                </h1>
              </div>
              <p className="font-roboto text-lg opacity-90 max-w-2xl">
                Illuminating the Future of Technology
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Mission */}
          <section className="mb-16">
            <Card className="bg-card-modern border border-card-border/60 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-8 w-8 text-primary" />
                <h2 className="font-orbitron text-3xl font-bold text-glow-primary">
                  Our Mission
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground font-roboto text-lg">
                <p>
                  RootsTechNews was built to solve a critical problem: staying informed about AI and technology 
                  developments without drowning in noise.
                </p>
                <p>
                  We aggregate news from the world's leading tech publications, apply intelligent filtering to 
                  remove non-tech content, and deliver it all in a beautiful, futuristic interface that makes 
                  staying current effortless.
                </p>
                <p className="text-primary font-semibold">
                  "Where innovation meets culture in the digital frontier."
                </p>
              </div>
            </Card>
          </section>

          {/* Features */}
          <section className="mb-16">
            <h2 className="font-orbitron text-3xl font-bold text-glow-accent mb-8 text-center">
              What Makes Us Different
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card-modern border border-card-border/60 p-6 hover:border-primary/50 transition-all">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="font-orbitron text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground font-roboto">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-16">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Code className="h-8 w-8 text-accent" />
                <h2 className="font-orbitron text-3xl font-bold text-glow-accent">
                  Technology Stack
                </h2>
              </div>
              <p className="text-muted-foreground font-roboto mb-6">
                Built with modern, cutting-edge technologies for performance, reliability, and scale:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {techStack.map((tech, index) => (
                  <div 
                    key={index}
                    className="bg-card border border-card-border/40 rounded-lg p-4 hover:border-primary/50 transition-all"
                  >
                    <div className="font-orbitron font-bold text-primary mb-1">
                      {tech.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tech.purpose}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Features List */}
          <section className="mb-16">
            <h2 className="font-orbitron text-3xl font-bold text-center mb-8">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card-modern border border-card-border/60 p-6">
                <h3 className="font-orbitron font-bold text-lg text-primary mb-4">Content</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✅ Real-time RSS aggregation from 7+ sources</li>
                  <li>✅ AI & tech-focused content filtering</li>
                  <li>✅ YouTube video integration</li>
                  <li>✅ AI podcast feeds (6 top podcasts)</li>
                  <li>✅ AI tools directory (50+ tools)</li>
                  <li>✅ Tech books library</li>
                </ul>
              </Card>

              <Card className="bg-card-modern border border-card-border/60 p-6">
                <h3 className="font-orbitron font-bold text-lg text-accent mb-4">Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✅ Category-based filtering</li>
                  <li>✅ Newsletter subscription (Resend)</li>
                  <li>✅ Auto-rotating video carousel</li>
                  <li>✅ Mobile-responsive design</li>
                  <li>✅ Dark mode futuristic theme</li>
                  <li>✅ SEO optimized</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section>
            <Card className="bg-gradient-to-r from-primary to-accent p-8 text-white text-center">
              <h2 className="font-orbitron text-3xl font-bold mb-4">
                Join the Future
              </h2>
              <p className="font-roboto text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Stay ahead of the curve with daily AI & tech updates delivered straight to your inbox.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  const sidebar = document.querySelector('aside');
                  if (sidebar) {
                    navigate('/');
                    setTimeout(() => {
                      sidebar.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="bg-white text-primary hover:bg-gray-100 font-orbitron font-bold"
              >
                Subscribe Now
              </Button>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutPage;

