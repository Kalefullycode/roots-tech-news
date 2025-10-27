import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AIToolsSidebar = () => {
  const featuredTools = [
    {
      name: 'ChatGPT',
      icon: '🤖',
      description: 'Best all-around AI assistant',
      url: 'https://chat.openai.com',
      gradient: 'from-green-500 to-emerald-600',
      features: ['GPT-4', 'Browse', 'DALL-E 3']
    },
    {
      name: 'Claude',
      icon: '🧠',
      description: 'Long context AI conversations',
      url: 'https://claude.ai',
      gradient: 'from-purple-500 to-violet-600',
      features: ['200K context', 'Coding', 'Analysis']
    },
    {
      name: 'Midjourney',
      icon: '🎨',
      description: 'Professional AI art generation',
      url: 'https://midjourney.com',
      gradient: 'from-pink-500 to-rose-600',
      features: ['Photorealistic', 'Artistic', 'High-res']
    }
  ];

  return (
    <aside className="w-80 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        {/* AI Tools Section */}
        <Card className="bg-card-modern border border-card-border/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-orbitron font-bold text-foreground flex items-center gap-2">
              ⚡ Top AI Tools
            </h3>
            <a
              href="#ai-tools-section"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const section = document.getElementById('ai-tools-section');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              View All →
            </a>
          </div>

          <div className="space-y-3">
            {featuredTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-4 bg-gradient-to-r ${tool.gradient} rounded-lg hover:scale-105 transition-transform group`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{tool.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white mb-1">{tool.name}</h4>
                    <p className="text-xs text-white/80 mb-2">{tool.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="px-2 py-0.5 bg-white/20 text-white text-xs border-0"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>

          <a
            href="#ai-tools-section"
            className="block mt-4 px-4 py-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-center text-sm text-primary font-medium transition-colors"
            onClick={(e) => {
              e.preventDefault();
              const section = document.getElementById('ai-tools-section');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore 50+ AI Tools →
          </a>
        </Card>

        {/* Newsletter Signup - Keep it visible but compact */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-6">
          <h3 className="text-lg font-orbitron font-bold text-foreground mb-2 flex items-center gap-2">
            📬 Daily Digest
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get AI & tech news in your inbox
          </p>
          <a
            href="#newsletter-signup"
            className="block w-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-center rounded-lg font-medium hover:opacity-90 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              const newsletter = document.querySelector('aside form') || document.querySelector('[id*="newsletter"]');
              if (newsletter) {
                newsletter.scrollIntoView({ behavior: 'smooth' });
                // Highlight effect
                newsletter.classList.add('ring-4', 'ring-primary', 'ring-offset-4', 'ring-offset-background');
                setTimeout(() => {
                  newsletter.classList.remove('ring-4', 'ring-primary', 'ring-offset-4', 'ring-offset-background');
                }, 2000);
              }
            }}
          >
            Subscribe Now
          </a>
        </Card>

        {/* Trending Topics */}
        <Card className="bg-card-modern border border-card-border/60 p-6">
          <h3 className="text-lg font-orbitron font-bold text-foreground mb-4 flex items-center gap-2">
            🔥 Trending Now
          </h3>
          <div className="space-y-3">
            {[
              { title: 'OpenAI GPT-5 Release', category: 'AI', hot: true },
              { title: 'Quantum Computing Breakthrough', category: 'Tech', hot: true },
              { title: 'African Tech Unicorns', category: 'Startups', hot: false },
              { title: 'Cybersecurity Threats 2025', category: 'Security', hot: false }
            ].map((item, index) => (
              <div
                key={index}
                className="p-3 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground text-sm font-bold mt-0.5">#{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </p>
                      {item.hot && (
                        <span className="text-xs">🔥</span>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  );
};

export default AIToolsSidebar;

