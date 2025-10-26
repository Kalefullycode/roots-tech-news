export interface NavSection {
  title: string;
  href: string;
  description?: string;
}

export interface NavCategory {
  name: string;
  sections: NavSection[];
}

export const NAVIGATION_STRUCTURE: NavCategory[] = [
  {
    name: 'AI',
    sections: [
      {
        title: 'AI News',
        href: '#ai-news',
        description: 'Latest AI developments & breakthroughs'
      },
      {
        title: 'AI Podcasts',
        href: '/podcasts',
        description: 'Latest episodes from top AI & tech podcasts'
      },
      {
        title: 'AI Tools Directory',
        href: '#ai-tools-directory',
        description: '50+ AI tools for every use case'
      },
      {
        title: 'AI Leaders',
        href: '#ai-leaders',
        description: 'Sam Altman, Demis Hassabis, Dario Amodei'
      },
      {
        title: 'Large Language Models',
        href: '#llm-section',
        description: 'ChatGPT, Claude, Gemini, LLaMA'
      },
      {
        title: 'AI Research',
        href: '#ai-research',
        description: 'Papers, breakthroughs, academic news'
      },
      {
        title: 'Generative AI',
        href: '#generative-ai',
        description: 'Image, video, audio generation'
      },
      {
        title: 'AI Ethics & Safety',
        href: '#ai-safety',
        description: 'Alignment, regulation, responsible AI'
      },
      {
        title: 'AI in Business',
        href: '#ai-business',
        description: 'Enterprise adoption, ROI, strategies'
      }
    ]
  },
  {
    name: 'Startups',
    sections: [
      {
        title: 'Startup News',
        href: '#startup-news',
        description: 'Latest from the startup ecosystem'
      },
      {
        title: 'Funding Rounds',
        href: '#funding',
        description: 'Seed, Series A-F, IPOs'
      },
      {
        title: 'AI Startups',
        href: '#ai-startups',
        description: 'OpenAI, Anthropic, Perplexity, etc.'
      },
      {
        title: 'Unicorns',
        href: '#unicorns',
        description: '$1B+ valued startups'
      },
      {
        title: 'Y Combinator',
        href: '#yc-news',
        description: 'YC batch news & alumni'
      },
      {
        title: 'Startup Accelerators',
        href: '#accelerators',
        description: 'Techstars, 500 Startups, more'
      },
      {
        title: 'Founder Stories',
        href: '#founders',
        description: 'Interviews, advice, journeys'
      },
      {
        title: 'Startup Jobs',
        href: '#startup-jobs',
        description: 'Join the next big thing'
      }
    ]
  },
  {
    name: 'Culture',
    sections: [
      {
        title: 'Tech Culture',
        href: '#tech-culture',
        description: 'Industry trends, workplace culture'
      },
      {
        title: 'Silicon Valley',
        href: '#silicon-valley',
        description: 'News from the valley'
      },
      {
        title: 'Tech Videos',
        href: '/videos',
        description: 'Latest YouTube content from top tech channels'
      },
      {
        title: 'Diversity & Inclusion',
        href: '#diversity',
        description: 'Building inclusive tech'
      },
      {
        title: 'Remote Work',
        href: '#remote-work',
        description: 'Future of work, digital nomads'
      },
      {
        title: 'Tech Events',
        href: '#tech-events',
        description: 'Conferences, summits, meetups'
      },
      {
        title: 'Podcasts & Interviews',
        href: '#podcasts',
        description: 'Tech leaders in conversation'
      },
      {
        title: 'Books & Learning',
        href: '#books',
        description: 'Essential reading for tech professionals'
      }
    ]
  },
  {
    name: 'Gadgets',
    sections: [
      {
        title: 'Latest Gadgets',
        href: '#latest-gadgets',
        description: 'New releases & reviews'
      },
      {
        title: 'Smartphones',
        href: '#smartphones',
        description: 'iPhone, Pixel, Samsung, more'
      },
      {
        title: 'Laptops & PCs',
        href: '#laptops',
        description: 'MacBooks, ThinkPads, gaming rigs'
      },
      {
        title: 'Wearables',
        href: '#wearables',
        description: 'Smartwatches, fitness trackers, AR/VR'
      },
      {
        title: 'Smart Home',
        href: '#smart-home',
        description: 'IoT devices, home automation'
      },
      {
        title: 'Gaming Hardware',
        href: '#gaming',
        description: 'Consoles, GPUs, peripherals'
      },
      {
        title: 'Reviews',
        href: '#gadget-reviews',
        description: 'In-depth product reviews'
      }
    ]
  },
  {
    name: 'Security',
    sections: [
      {
        title: 'Cybersecurity News',
        href: '#cybersecurity-news',
        description: 'Latest threats & defenses'
      },
      {
        title: 'AI Security',
        href: '#ai-security',
        description: 'Securing AI systems, adversarial attacks'
      },
      {
        title: 'Data Privacy',
        href: '#privacy',
        description: 'GDPR, encryption, data protection'
      },
      {
        title: 'Breaches & Hacks',
        href: '#breaches',
        description: 'Security incidents, leaks'
      },
      {
        title: 'Crypto Security',
        href: '#crypto-security',
        description: 'Blockchain, wallet security'
      },
      {
        title: 'Security Tools',
        href: '#security-tools',
        description: 'VPNs, password managers, 2FA'
      },
      {
        title: 'Bug Bounties',
        href: '#bug-bounties',
        description: 'Ethical hacking programs'
      }
    ]
  }
];

