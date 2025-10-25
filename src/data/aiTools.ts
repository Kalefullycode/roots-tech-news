export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  logo?: string;
  pricing: string;
  features: string[];
  isPremium: boolean;
}

export const AI_TOOLS: AITool[] = [
  // Language Models & Writing
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Advanced conversational AI by OpenAI for writing, coding, and problem-solving',
    category: 'Language Models',
    url: 'https://chat.openai.com',
    pricing: 'Free / $20/month',
    features: ['Natural language processing', 'Code generation', 'Creative writing', 'Analysis'],
    isPremium: false
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s AI assistant with advanced reasoning and long context windows',
    category: 'Language Models',
    url: 'https://claude.ai',
    pricing: 'Free / $20/month',
    features: ['Long context', 'Coding assistance', 'Analysis', 'Safe and helpful'],
    isPremium: false
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google\'s multimodal AI model for text, image, and code understanding',
    category: 'Language Models',
    url: 'https://gemini.google.com',
    pricing: 'Free / Enterprise',
    features: ['Multimodal', 'Google integration', 'Real-time info', 'Code generation'],
    isPremium: false
  },
  
  // Image Generation
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'Create stunning AI-generated images from text descriptions',
    category: 'Image Generation',
    url: 'https://midjourney.com',
    pricing: '$10-$60/month',
    features: ['High-quality images', 'Artistic styles', 'Commercial use', 'Community'],
    isPremium: true
  },
  {
    id: 'dalle',
    name: 'DALL-E 3',
    description: 'OpenAI\'s powerful image generation model integrated with ChatGPT',
    category: 'Image Generation',
    url: 'https://openai.com/dall-e-3',
    pricing: 'Via ChatGPT Plus',
    features: ['Photorealistic', 'Text in images', 'Style control', 'Safe generation'],
    isPremium: true
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Open-source image generation model with customization options',
    category: 'Image Generation',
    url: 'https://stability.ai',
    pricing: 'Free / API pricing',
    features: ['Open source', 'Customizable', 'Local deployment', 'Fine-tuning'],
    isPremium: false
  },
  
  // Video & Audio
  {
    id: 'runway',
    name: 'Runway ML',
    description: 'AI-powered video editing and generation platform',
    category: 'Video & Audio',
    url: 'https://runwayml.com',
    pricing: 'Free trial / Subscription',
    features: ['Video generation', 'AI editing', 'Motion tracking', 'Green screen'],
    isPremium: true
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Realistic AI voice synthesis and cloning',
    category: 'Video & Audio',
    url: 'https://elevenlabs.io',
    pricing: 'Free / $5-$330/month',
    features: ['Voice cloning', 'Multiple languages', 'Emotion control', 'API access'],
    isPremium: false
  },
  
  // Code & Development
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster',
    category: 'Code & Development',
    url: 'https://github.com/features/copilot',
    pricing: '$10/month',
    features: ['Code completion', 'Multiple languages', 'IDE integration', 'Context-aware'],
    isPremium: true
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first code editor built for productivity',
    category: 'Code & Development',
    url: 'https://cursor.com',
    pricing: 'Free / $20/month',
    features: ['AI code editing', 'Natural language', 'Codebase chat', 'Fast completion'],
    isPremium: false
  },
  {
    id: 'replit-ghostwriter',
    name: 'Replit Ghostwriter',
    description: 'AI-powered coding assistant in your browser',
    category: 'Code & Development',
    url: 'https://replit.com/ai',
    pricing: '$10-$25/month',
    features: ['Code completion', 'Debugging', 'Explain code', 'Browser-based'],
    isPremium: true
  },
  
  // Productivity & Business
  {
    id: 'notion-ai',
    name: 'Notion AI',
    description: 'AI assistant integrated into your Notion workspace',
    category: 'Productivity',
    url: 'https://notion.so/product/ai',
    pricing: '$10/month',
    features: ['Writing assistant', 'Summarization', 'Translation', 'Q&A'],
    isPremium: true
  },
  {
    id: 'jasper',
    name: 'Jasper AI',
    description: 'AI content platform for marketing and business',
    category: 'Productivity',
    url: 'https://jasper.ai',
    pricing: '$39-$125/month',
    features: ['Content creation', 'Brand voice', 'Templates', 'SEO optimization'],
    isPremium: true
  },
  
  // Research & Analysis
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'AI-powered search and research assistant',
    category: 'Research',
    url: 'https://perplexity.ai',
    pricing: 'Free / $20/month',
    features: ['Web search', 'Citations', 'Follow-up questions', 'Source verification'],
    isPremium: false
  },
  {
    id: 'consensus',
    name: 'Consensus',
    description: 'AI search engine for scientific research papers',
    category: 'Research',
    url: 'https://consensus.app',
    pricing: 'Free / Premium',
    features: ['Paper search', 'AI summaries', 'Citations', 'Academic focus'],
    isPremium: false
  },
  
  // Design & Creative
  {
    id: 'canva-magic',
    name: 'Canva Magic Studio',
    description: 'AI-powered design tools in Canva',
    category: 'Design',
    url: 'https://canva.com/ai-image-generator/',
    pricing: 'Free / Pro',
    features: ['Magic Edit', 'Text to image', 'Background remover', 'Templates'],
    isPremium: false
  },
  {
    id: 'figma-ai',
    name: 'Figma AI',
    description: 'AI features integrated into Figma design platform',
    category: 'Design',
    url: 'https://figma.com',
    pricing: 'Free / Professional',
    features: ['Auto layout', 'Content generation', 'Design suggestions', 'Prototyping'],
    isPremium: false
  },
];

export const AI_TOOL_CATEGORIES = [
  'All',
  'Language Models',
  'Image Generation',
  'Video & Audio',
  'Code & Development',
  'Productivity',
  'Research',
  'Design'
];

