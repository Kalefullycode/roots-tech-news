/**
 * Content Filter Service
 * Filters out non-AI/tech content from all feeds
 */

const BLOCKED_KEYWORDS = [
  // Animals & Biology
  'rattlesnake', 'snake', 'cockroach', 'insect', 'animal', 'wildlife',
  'nature documentary', 'species', 'biology', 'bird', 'fish', 'mammal',
  'reptile', 'dog', 'cat', 'pet', 'zoo', 'evolution', 'creature',
  'spider', 'ant', 'bee', 'butterfly', 'elephant', 'lion', 'tiger',
  
  // Climate & Nature (unless tech-related)
  'climate change', 'weather forecast', 'ocean life', 'forest animals',
  'plant species', 'coral reef', 'endangered species',
  
  // Unrelated Entertainment
  'anime', 'cartoon', 'celebrity gossip', 'cooking recipe', 'fashion show',
  'makeup tutorial', 'travel vlog', 'sports highlight', 'movie review'
];

const AI_TECH_KEYWORDS = [
  // AI & Machine Learning
  'ai', 'artificial intelligence', 'machine learning', 'deep learning',
  'neural network', 'llm', 'large language model', 'gpt', 'chatgpt',
  'claude', 'gemini', 'generative ai', 'openai', 'anthropic', 'deepmind',
  
  // Robotics & Automation
  'robot', 'robotics', 'automation', 'autonomous', 'self-driving',
  'drone', 'humanoid robot',
  
  // Computer Science & Tech
  'algorithm', 'computer', 'software', 'hardware', 'programming',
  'coding', 'developer', 'engineer', 'tech', 'technology',
  'semiconductor', 'chip', 'gpu', 'cpu', 'quantum computing',
  
  // Data & ML Applications
  'computer vision', 'natural language processing', 'nlp', 
  'recommendation system', 'data science', 'big data',
  'neural', 'transformer', 'diffusion model',
  
  // Tech Industry
  'startup', 'tech company', 'innovation', 'breakthrough',
  'silicon valley', 'tech news', 'gadget', 'device',
  'smartphone', 'laptop', 'tablet', 'wearable',
  
  // Specific AI Tools/Products
  'midjourney', 'stable diffusion', 'dall-e', 'copilot',
  'github copilot', 'cursor', 'replit', 'hugging face',
  
  // AI Research & Development
  'research paper', 'arxiv', 'conference', 'model training',
  'fine-tuning', 'reinforcement learning', 'supervised learning'
];

export interface FilterableContent {
  title: string;
  description?: string;
  content?: string;
  category?: string;
}

export class ContentFilter {
  /**
   * Check if content is AI/Tech related and not blocked
   */
  static isAITechContent(item: FilterableContent): boolean {
    const text = `${item.title} ${item.description || ''} ${item.content || ''}`.toLowerCase();
    
    // First, reject if contains blocked keywords
    const hasBlockedContent = BLOCKED_KEYWORDS.some(keyword => 
      text.includes(keyword.toLowerCase())
    );
    
    if (hasBlockedContent) {
      console.log(`[ContentFilter] Blocked: "${item.title}" - Contains blocked keyword`);
      return false;
    }
    
    // Accept if contains AI/tech keywords
    const hasAITechContent = AI_TECH_KEYWORDS.some(keyword => 
      text.includes(keyword.toLowerCase())
    );
    
    if (!hasAITechContent) {
      console.log(`[ContentFilter] Rejected: "${item.title}" - No AI/tech keywords found`);
    }
    
    return hasAITechContent;
  }

  /**
   * Filter array of content items
   */
  static filterArray<T extends FilterableContent>(items: T[]): T[] {
    return items.filter(item => this.isAITechContent(item));
  }

  /**
   * Get relevance score (0-100) for sorting
   */
  static getRelevanceScore(item: FilterableContent): number {
    const text = `${item.title} ${item.description || ''}`.toLowerCase();
    let score = 0;
    
    // High-value AI keywords
    const highValueKeywords = [
      'chatgpt', 'gpt-4', 'openai', 'claude', 'gemini',
      'ai breakthrough', 'generative ai', 'neural network',
      'machine learning', 'deep learning', 'llm'
    ];
    
    highValueKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 10;
    });
    
    // Medium-value tech keywords
    const mediumValueKeywords = [
      'artificial intelligence', 'robot', 'algorithm',
      'quantum', 'semiconductor', 'startup', 'innovation'
    ];
    
    mediumValueKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 5;
    });
    
    // Boost recent mentions
    if (text.includes('breaking') || text.includes('new') || text.includes('latest')) {
      score += 3;
    }
    
    return Math.min(score, 100);
  }

  /**
   * Sort by relevance
   */
  static sortByRelevance<T extends FilterableContent>(items: T[]): T[] {
    return items.sort((a, b) => 
      this.getRelevanceScore(b) - this.getRelevanceScore(a)
    );
  }

  /**
   * Filter and sort in one go
   */
  static filterAndSort<T extends FilterableContent>(items: T[]): T[] {
    const filtered = this.filterArray(items);
    return this.sortByRelevance(filtered);
  }
}

export default ContentFilter;

