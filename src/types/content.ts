export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;
  category: "AI" | "Startups" | "Culture" | "Gadgets" | "Security";
  tags: string[];
  heroImage: string;
  featured: boolean;
  content?: string;
}

export interface ContentMetadata {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  heroImage: string;
  featured: boolean;
}