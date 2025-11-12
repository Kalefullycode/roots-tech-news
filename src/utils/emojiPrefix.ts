/**
 * Adds emoji prefixes to article titles based on category and keywords
 * Inspired by EvolvingAI's emoji headlines
 */

export function addEmojiPrefix(title: string, category?: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerCategory = (category || '').toLowerCase();

  // AI-related emojis
  if (
    lowerTitle.includes('ai') ||
    lowerTitle.includes('gpt') ||
    lowerTitle.includes('llm') ||
    lowerTitle.includes('neural') ||
    lowerTitle.includes('machine learning') ||
    lowerCategory.includes('ai')
  ) {
    return `🤖 ${title}`;
  }

  // Security/Cyber emojis
  if (
    lowerTitle.includes('security') ||
    lowerTitle.includes('cyber') ||
    lowerTitle.includes('hack') ||
    lowerTitle.includes('breach') ||
    lowerTitle.includes('vulnerability') ||
    lowerCategory.includes('security')
  ) {
    return `🔒 ${title}`;
  }

  // Startup/Funding emojis
  if (
    lowerTitle.includes('funding') ||
    lowerTitle.includes('startup') ||
    lowerTitle.includes('raised') ||
    lowerTitle.includes('investment') ||
    lowerTitle.includes('series') ||
    lowerCategory.includes('startup')
  ) {
    return `💰 ${title}`;
  }

  // Tech/Gadget emojis
  if (
    lowerTitle.includes('iphone') ||
    lowerTitle.includes('android') ||
    lowerTitle.includes('device') ||
    lowerTitle.includes('gadget') ||
    lowerTitle.includes('hardware') ||
    lowerCategory.includes('tech')
  ) {
    return `📱 ${title}`;
  }

  // Quantum emojis
  if (
    lowerTitle.includes('quantum') ||
    lowerTitle.includes('qubit')
  ) {
    return `⚛️ ${title}`;
  }

  // Crypto/Blockchain emojis
  if (
    lowerTitle.includes('crypto') ||
    lowerTitle.includes('bitcoin') ||
    lowerTitle.includes('blockchain') ||
    lowerTitle.includes('nft') ||
    lowerCategory.includes('crypto')
  ) {
    return `₿ ${title}`;
  }

  // Cloud/Infrastructure emojis
  if (
    lowerTitle.includes('cloud') ||
    lowerTitle.includes('aws') ||
    lowerTitle.includes('azure') ||
    lowerTitle.includes('infrastructure')
  ) {
    return `☁️ ${title}`;
  }

  // Gaming emojis
  if (
    lowerTitle.includes('game') ||
    lowerTitle.includes('gaming') ||
    lowerTitle.includes('playstation') ||
    lowerTitle.includes('xbox') ||
    lowerCategory.includes('gaming')
  ) {
    return `🎮 ${title}`;
  }

  // Social Media emojis
  if (
    lowerTitle.includes('twitter') ||
    lowerTitle.includes('meta') ||
    lowerTitle.includes('facebook') ||
    lowerTitle.includes('instagram') ||
    lowerTitle.includes('social')
  ) {
    return `📱 ${title}`;
  }

  // Breaking News emojis
  if (
    lowerTitle.includes('breaking') ||
    lowerTitle.includes('urgent') ||
    lowerTitle.includes('alert')
  ) {
    return `🚨 ${title}`;
  }

  // Default tech emoji
  return `⚡ ${title}`;
}

