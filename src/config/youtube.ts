export const YOUTUBE_CONFIG = {
  apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,

  // AI & Tech YouTube Channels
  channels: {
    aiNews: [
      { id: 'UCBJycsmduvYEL83R_U4JriQ', name: 'Two Minute Papers' },
      { id: 'UCYO_jab_esuFRV4b17AJtAw', name: '3Blue1Brown' },
      { id: 'UCqYPhGiB9tkShZorfgcL2lA', name: 'AI Explained' },
      { id: 'UCbfYPyITQ-7l4upoX8nvctg', name: 'Yannic Kilcher' },
    ],
    techNews: [
      { id: 'UCCjyq_K1Xwfg8Lndy7lKMpA', name: 'TechCrunch' },
      { id: 'UCOmcA3f_RrH6b9NmcNa4tdg', name: 'The Verge' },
      { id: 'UC16niRr50-MSBwiO3YDb3RA', name: 'Linus Tech Tips' },
      { id: 'UCXuqSBlHAE6Xw-yeJA0Tunw', name: 'Marques Brownlee' },
    ],
    podcasts: [
      { id: 'UCXZCJLdBC09xxGZ6gcdrc6A', name: 'Lex Fridman' },
      { id: 'UCMEXQf0DZpfkFB9kDWQcYqQ', name: 'The AI Breakdown' },
      { id: 'UCRxDB1CoGCUYuH0K5p8hVfg', name: 'This Week in ML & AI' },
    ],
    tutorials: [
      { id: 'UCmJz2DV1a3yfgrR7GqRtUUA', name: 'Sentdex' },
      { id: 'UCCezIgC97PvUuR4_gbFUs5g', name: 'Corey Schafer' },
      { id: 'UCW6TXMZ5Pq6yL6_k5NZ2e0Q', name: 'Fireship' },
    ],
    makeMoneyWithAI: [
      { id: 'UCrILIGLdFXFCYiKjxHYKgSA', name: 'AI Business School' },
      { id: 'UCJWCJCWOxBYSi5DhCieLOLQ', name: 'Make Money with AI' },
    ],
    aiVsHuman: [
      { id: 'UCuXxC1gNmXOz9uS0TTB-nJg', name: 'AI vs Human Challenges' },
    ]
  },

  // Fetch settings
  maxResults: 12,
  refreshInterval: 300000, // 5 minutes

  // Thumbnail quality options
  thumbnailQuality: 'maxresdefault' as 'default' | 'medium' | 'high' | 'maxresdefault',
};

