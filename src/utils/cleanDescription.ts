/**
 * Cleans article descriptions by removing URLs, metadata, and unwanted text
 * @param description - The raw description text
 * @returns Cleaned description without URLs and metadata
 */
export function cleanDescription(description: string | undefined | null): string {
  if (!description) return '';

  return description
    // Remove "Article URL:" patterns
    .replace(/Article URL:\s*https?:\/\/[^\s]+/gi, '')
    .replace(/Article URL:.*?(?=\s|$)/gi, '')
    
    // Remove "Comments URL:" patterns
    .replace(/Comments URL:\s*https?:\/\/[^\s]+/gi, '')
    .replace(/Comments URL:.*?(?=\s|$)/gi, '')
    
    // Remove "Points:" patterns
    .replace(/Points:\s*\d+/gi, '')
    
    // Remove comment counts
    .replace(/#\s*Comments:\s*\d+/gi, '')
    .replace(/\d+\s*(comment|comments)/gi, '')
    
    // Remove CDATA closing tags
    .replace(/\]\]>/g, '')
    .replace(/<!\[CDATA\[/g, '')
    
    // Remove all URLs (http://, https://)
    .replace(/https?:\/\/[^\s]+/g, '')
    
    // Remove email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
    
    // Remove common metadata patterns
    .replace(/Read more.*/gi, '')
    .replace(/Continue reading.*/gi, '')
    .replace(/Source:.*/gi, '')
    .replace(/Via:.*/gi, '')
    
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

