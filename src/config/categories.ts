// Category configuration for dynamic category pages
export interface CategoryConfig {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  keywords: string[];
  image?: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: 'ai',
    title: 'Artificial Intelligence',
    description: 'Explore the cutting-edge world of AI, machine learning, and neural networks shaping our future.',
    icon: '🤖',
    color: 'from-blue-500 to-purple-600',
    keywords: ['AI', 'artificial intelligence', 'machine learning', 'neural networks', 'deep learning', 'ChatGPT', 'Claude', 'GPT', 'LLM'],
  },
  {
    slug: 'technology',
    title: 'Technology',
    description: 'Breaking tech news, product launches, and industry updates from around the world.',
    icon: '💻',
    color: 'from-purple-500 to-pink-600',
    keywords: ['technology', 'tech', 'innovation', 'hardware', 'software', 'gadgets'],
  },
  {
    slug: 'startups',
    title: 'Startup Ecosystem',
    description: 'Discover innovative startups, funding rounds, and entrepreneurial ventures across Africa and beyond.',
    icon: '🚀',
    color: 'from-green-500 to-teal-600',
    keywords: ['startups', 'startup', 'funding', 'venture capital', 'entrepreneurship', 'unicorn'],
  },
  {
    slug: 'security',
    title: 'Cybersecurity',
    description: 'Stay informed about digital security, privacy, and emerging cyber threats in our connected world.',
    icon: '🔒',
    color: 'from-red-500 to-yellow-600',
    keywords: ['security', 'cybersecurity', 'privacy', 'hacking', 'data breach', 'encryption'],
  },
  {
    slug: 'gadgets',
    title: 'Gadgets & Hardware',
    description: 'Latest reviews, launches, and breakthrough hardware innovations from around the world.',
    icon: '📱',
    color: 'from-orange-500 to-red-600',
    keywords: ['gadgets', 'hardware', 'smartphone', 'laptop', 'wearables', 'devices'],
  },
  {
    slug: 'culture',
    title: 'Tech Culture',
    description: 'Dive into the intersection of technology, society, and futuristic innovations.',
    icon: '🌍',
    color: 'from-purple-500 to-pink-600',
    keywords: ['culture', 'tech culture', 'society', 'innovation', 'future'],
  },
];

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find(cat => cat.slug === slug);
}

// Helper function to check if article matches category
export function articleMatchesCategory(article: { title: string; description: string; category?: string }, categorySlug: string): boolean {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return false;

  const searchText = `${article.title} ${article.description} ${article.category || ''}`.toLowerCase();
  return category.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
}

