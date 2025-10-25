export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  features: string[];
}

export const AI_TOOL_CATEGORIES = [
  'All',
  'Language Models',
  'Image Generation',
  'Video Generation',
  'Audio & Music',
  'Code Assistant',
  'Writing & Content',
  'Research & Data',
  'Design & Creative',
  'Business & Productivity'
] as const;

export const AI_TOOLS: AITool[] = [
  // Language Models
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Advanced conversational AI by OpenAI with GPT-4 capabilities',
    category: 'Language Models',
    pricing: 'Free • Plus $20/mo',
    url: 'https://chat.openai.com',
    features: [
      'Natural language conversations',
      'Code generation and debugging',
      'Creative writing and brainstorming',
      'Image generation with DALL-E'
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s AI assistant with extended context and constitutional AI',
    category: 'Language Models',
    pricing: 'Free • Pro $20/mo',
    url: 'https://claude.ai',
    features: [
      '200K token context window',
      'Advanced reasoning capabilities',
      'Document analysis',
      'Safe and helpful responses'
    ]
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google\'s multimodal AI model with deep search integration',
    category: 'Language Models',
    pricing: 'Free • Pro $19.99/mo',
    url: 'https://gemini.google.com',
    features: [
      'Multimodal understanding',
      'Google Workspace integration',
      'Real-time information access',
      'Code execution capabilities'
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'AI-powered search engine with citations and real-time answers',
    category: 'Research & Data',
    pricing: 'Free • Pro $20/mo',
    url: 'https://www.perplexity.ai',
    features: [
      'Real-time web search',
      'Source citations',
      'Academic research mode',
      'Follow-up questions'
    ]
  },

  // Image Generation
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'State-of-the-art AI image generation via Discord',
    category: 'Image Generation',
    pricing: 'Basic $10/mo • Pro $30/mo',
    url: 'https://www.midjourney.com',
    features: [
      'Photorealistic images',
      'Artistic styles',
      'Upscaling and variations',
      'Commercial use license'
    ]
  },
  {
    id: 'dalle',
    name: 'DALL-E 3',
    description: 'OpenAI\'s latest image generation model with precise text understanding',
    category: 'Image Generation',
    pricing: 'Via ChatGPT Plus $20/mo',
    url: 'https://openai.com/dall-e-3',
    features: [
      'Detailed text prompts',
      'Built into ChatGPT',
      'Safety features',
      'High resolution output'
    ]
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Open-source image generation model you can run locally',
    category: 'Image Generation',
    pricing: 'Free • Open Source',
    url: 'https://stability.ai',
    features: [
      'Run locally or cloud',
      'ControlNet for precision',
      'Custom model training',
      'Community extensions'
    ]
  },
  {
    id: 'leonardo-ai',
    name: 'Leonardo.AI',
    description: 'Game asset and creative content generation with consistency',
    category: 'Image Generation',
    pricing: 'Free • Pro $10/mo',
    url: 'https://leonardo.ai',
    features: [
      'Character consistency',
      'Game asset generation',
      'Canvas editor',
      'Background removal'
    ]
  },

  // Video Generation
  {
    id: 'runway',
    name: 'Runway',
    description: 'AI-powered video editing and generation platform',
    category: 'Video Generation',
    pricing: 'Free • Pro $12/mo',
    url: 'https://runwayml.com',
    features: [
      'Text to video',
      'Video editing tools',
      'Image to video',
      'Motion tracking'
    ]
  },
  {
    id: 'pika',
    name: 'Pika',
    description: 'Innovative video generation from text and images',
    category: 'Video Generation',
    pricing: 'Free Beta',
    url: 'https://pika.art',
    features: [
      'Text to video',
      'Image animation',
      'Video expansion',
      'Style transfer'
    ]
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    description: 'AI avatar video creation for business and education',
    category: 'Video Generation',
    pricing: 'Starter $22/mo',
    url: 'https://www.synthesia.io',
    features: [
      '140+ AI avatars',
      '120+ languages',
      'Custom avatars',
      'Enterprise features'
    ]
  },

  // Audio & Music
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Realistic text-to-speech and voice cloning',
    category: 'Audio & Music',
    pricing: 'Free • Starter $5/mo',
    url: 'https://elevenlabs.io',
    features: [
      'Natural voice synthesis',
      'Voice cloning',
      'Multiple languages',
      'API access'
    ]
  },
  {
    id: 'suno',
    name: 'Suno',
    description: 'Create complete songs from text prompts',
    category: 'Audio & Music',
    pricing: 'Free • Pro $10/mo',
    url: 'https://www.suno.ai',
    features: [
      'Text to music',
      'Lyrics generation',
      'Multiple genres',
      'High quality audio'
    ]
  },
  {
    id: 'murf',
    name: 'Murf AI',
    description: 'Professional AI voiceover studio',
    category: 'Audio & Music',
    pricing: 'Basic $19/mo',
    url: 'https://murf.ai',
    features: [
      '120+ voices',
      'Voice customization',
      'Video sync',
      'Commercial use'
    ]
  },

  // Code Assistant
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer from GitHub and OpenAI',
    category: 'Code Assistant',
    pricing: 'Individual $10/mo',
    url: 'https://github.com/features/copilot',
    features: [
      'Code completion',
      'Multiple languages',
      'IDE integration',
      'Context awareness'
    ]
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first code editor built for productivity',
    category: 'Code Assistant',
    pricing: 'Free • Pro $20/mo',
    url: 'https://cursor.sh',
    features: [
      'Chat with codebase',
      'AI code generation',
      'Natural language editing',
      'Multiple AI models'
    ]
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    description: 'AI code completion trained on your codebase',
    category: 'Code Assistant',
    pricing: 'Free • Pro $12/mo',
    url: 'https://www.tabnine.com',
    features: [
      'Private models',
      'Team learning',
      'All major IDEs',
      'On-premise option'
    ]
  },
  {
    id: 'replit-ai',
    name: 'Replit AI',
    description: 'AI coding assistant in browser-based IDE',
    category: 'Code Assistant',
    pricing: 'Free • Pro $7/mo',
    url: 'https://replit.com',
    features: [
      'Explain code',
      'Generate functions',
      'Debug assistance',
      'Instant deployment'
    ]
  },

  // Writing & Content
  {
    id: 'jasper',
    name: 'Jasper',
    description: 'AI content platform for marketing teams',
    category: 'Writing & Content',
    pricing: 'Creator $49/mo',
    url: 'https://www.jasper.ai',
    features: [
      'Marketing copy',
      'Brand voice',
      'SEO optimization',
      'Team collaboration'
    ]
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    description: 'AI copywriting for sales and marketing',
    category: 'Writing & Content',
    pricing: 'Free • Pro $49/mo',
    url: 'https://www.copy.ai',
    features: [
      'Sales emails',
      'Social media posts',
      'Blog content',
      '90+ templates'
    ]
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    description: 'AI writing assistant with grammar and style checking',
    category: 'Writing & Content',
    pricing: 'Free • Premium $12/mo',
    url: 'https://www.grammarly.com',
    features: [
      'Grammar checking',
      'Style suggestions',
      'Tone detection',
      'Plagiarism detection'
    ]
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    description: 'AI assistant built into Notion workspace',
    category: 'Writing & Content',
    pricing: '$10/mo per user',
    url: 'https://www.notion.so/product/ai',
    features: [
      'Writing assistance',
      'Summarization',
      'Translation',
      'Action items extraction'
    ]
  },

  // Research & Data
  {
    id: 'consensus',
    name: 'Consensus',
    description: 'AI-powered academic research search engine',
    category: 'Research & Data',
    pricing: 'Free • Premium $8.99/mo',
    url: 'https://consensus.app',
    features: [
      'Academic paper search',
      'Evidence-based answers',
      'Citation extraction',
      'Research synthesis'
    ]
  },
  {
    id: 'elicit',
    name: 'Elicit',
    description: 'AI research assistant for literature reviews',
    category: 'Research & Data',
    pricing: 'Free • Plus $10/mo',
    url: 'https://elicit.org',
    features: [
      'Paper summaries',
      'Data extraction',
      'Research questions',
      'Citation finding'
    ]
  },
  {
    id: 'scite',
    name: 'scite',
    description: 'Smart citations showing how papers are cited',
    category: 'Research & Data',
    pricing: 'Free • Premium $20/mo',
    url: 'https://scite.ai',
    features: [
      'Citation context',
      'Supporting/contrasting evidence',
      'Custom dashboards',
      'Research integrity'
    ]
  },

  // Design & Creative
  {
    id: 'canva-ai',
    name: 'Canva Magic Studio',
    description: 'AI-powered design tools in Canva',
    category: 'Design & Creative',
    pricing: 'Free • Pro $14.99/mo',
    url: 'https://www.canva.com',
    features: [
      'Magic Design',
      'Background removal',
      'Magic Eraser',
      'Text to image'
    ]
  },
  {
    id: 'figma-ai',
    name: 'Figma AI',
    description: 'AI features in Figma design platform',
    category: 'Design & Creative',
    pricing: 'Free • Pro $12/mo',
    url: 'https://www.figma.com',
    features: [
      'Design suggestions',
      'Component generation',
      'Auto layout',
      'Smart selection'
    ]
  },
  {
    id: 'adobe-firefly',
    name: 'Adobe Firefly',
    description: 'Adobe\'s generative AI for creative work',
    category: 'Design & Creative',
    pricing: 'Free • Premium $4.99/mo',
    url: 'https://www.adobe.com/products/firefly.html',
    features: [
      'Generative fill',
      'Text effects',
      'Recolor vectors',
      'Commercial safe'
    ]
  },
  {
    id: 'remove-bg',
    name: 'Remove.bg',
    description: 'AI-powered background removal',
    category: 'Design & Creative',
    pricing: 'Free • Pro $9/mo',
    url: 'https://www.remove.bg',
    features: [
      'Instant removal',
      'High resolution',
      'Bulk processing',
      'API access'
    ]
  },

  // Business & Productivity
  {
    id: 'otter-ai',
    name: 'Otter.ai',
    description: 'AI meeting notes and transcription',
    category: 'Business & Productivity',
    pricing: 'Free • Pro $10/mo',
    url: 'https://otter.ai',
    features: [
      'Live transcription',
      'Meeting summaries',
      'Action items',
      'CRM integration'
    ]
  },
  {
    id: 'fireflies',
    name: 'Fireflies.ai',
    description: 'AI notetaker for meetings',
    category: 'Business & Productivity',
    pricing: 'Free • Pro $10/mo',
    url: 'https://fireflies.ai',
    features: [
      'Auto meeting notes',
      'Search conversations',
      'Team collaboration',
      '50+ integrations'
    ]
  },
  {
    id: 'zapier-ai',
    name: 'Zapier AI',
    description: 'AI automation for business workflows',
    category: 'Business & Productivity',
    pricing: 'Free • Pro $19.99/mo',
    url: 'https://zapier.com',
    features: [
      'Workflow automation',
      'AI-powered suggestions',
      '5000+ app integrations',
      'Custom chatbots'
    ]
  },
  {
    id: 'tome',
    name: 'Tome',
    description: 'AI-powered storytelling and presentations',
    category: 'Business & Productivity',
    pricing: 'Free • Pro $10/mo',
    url: 'https://tome.app',
    features: [
      'AI presentations',
      'Dynamic layouts',
      'Embedded content',
      'Collaboration tools'
    ]
  },
  {
    id: 'beautiful-ai',
    name: 'Beautiful.ai',
    description: 'AI presentation software with smart templates',
    category: 'Business & Productivity',
    pricing: 'Pro $12/mo',
    url: 'https://www.beautiful.ai',
    features: [
      'Smart templates',
      'Auto-formatting',
      'Team collaboration',
      'Brand controls'
    ]
  },
  {
    id: 'mem',
    name: 'Mem',
    description: 'AI-powered note-taking and knowledge management',
    category: 'Business & Productivity',
    pricing: 'Free • Pro $10/mo',
    url: 'https://get.mem.ai',
    features: [
      'Smart search',
      'Auto-organization',
      'Meeting notes',
      'Knowledge graph'
    ]
  }
];
