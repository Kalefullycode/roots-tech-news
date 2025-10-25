export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverUrl?: string;
  rating: number;
  publishYear: number;
  amazonUrl?: string;
  goodreadsUrl?: string;
  isbn?: string;
}

export const BOOKS: Book[] = [
  // AI & Machine Learning
  {
    id: 'life-3-0',
    title: 'Life 3.0: Being Human in the Age of Artificial Intelligence',
    author: 'Max Tegmark',
    description: 'A compelling guide to the challenges and choices in our quest for a great future of life, intelligence, and consciousness—on Earth and beyond.',
    category: 'AI',
    rating: 4.5,
    publishYear: 2017,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'superintelligence',
    title: 'Superintelligence: Paths, Dangers, Strategies',
    author: 'Nick Bostrom',
    description: 'A groundbreaking exploration of what superintelligent AI could mean for humanity and how we can prepare.',
    category: 'AI',
    rating: 4.3,
    publishYear: 2014,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'human-compatible',
    title: 'Human Compatible: AI and the Problem of Control',
    author: 'Stuart Russell',
    description: 'A leading AI researcher makes the case for building AI that is provably beneficial to humans.',
    category: 'AI',
    rating: 4.4,
    publishYear: 2019,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    description: 'The definitive textbook on deep learning by pioneers in the field.',
    category: 'AI',
    rating: 4.6,
    publishYear: 2016,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'ai-superpowers',
    title: 'AI Superpowers: China, Silicon Valley, and the New World Order',
    author: 'Kai-Fu Lee',
    description: 'An insider\'s perspective on the AI race between China and the US and its implications.',
    category: 'AI',
    rating: 4.2,
    publishYear: 2018,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },

  // Technology & Innovation
  {
    id: 'innovators-dilemma',
    title: 'The Innovator\'s Dilemma',
    author: 'Clayton M. Christensen',
    description: 'Why new technologies cause great firms to fail and how to avoid the same fate.',
    category: 'Tech',
    rating: 4.1,
    publishYear: 1997,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'zero-to-one',
    title: 'Zero to One: Notes on Startups, or How to Build the Future',
    author: 'Peter Thiel',
    description: 'Contrarian insights on innovation and building companies that create new things.',
    category: 'Business',
    rating: 4.3,
    publishYear: 2014,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'lean-startup',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    description: 'How today\'s entrepreneurs use continuous innovation to create radically successful businesses.',
    category: 'Business',
    rating: 4.2,
    publishYear: 2011,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'hard-thing',
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    description: 'Building a business when there are no easy answers.',
    category: 'Business',
    rating: 4.5,
    publishYear: 2014,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },

  // Quantum Physics & Innovation
  {
    id: 'quantum-computing',
    title: 'Quantum Computing: An Applied Approach',
    author: 'Jack D. Hidary',
    description: 'A comprehensive introduction to quantum computing with practical applications.',
    category: 'Quantum Physics',
    rating: 4.4,
    publishYear: 2019,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'something-deeply-hidden',
    title: 'Something Deeply Hidden: Quantum Worlds and the Emergence of Spacetime',
    author: 'Sean Carroll',
    description: 'A mind-bending exploration of quantum mechanics and the many-worlds interpretation.',
    category: 'Quantum Physics',
    rating: 4.3,
    publishYear: 2019,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'quantum-supremacy',
    title: 'Quantum Supremacy: How the Quantum Computer Revolution Will Change Everything',
    author: 'Michio Kaku',
    description: 'The father of string theory explores the quantum computing revolution.',
    category: 'Quantum Physics',
    rating: 4.2,
    publishYear: 2023,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'elegant-universe',
    title: 'The Elegant Universe',
    author: 'Brian Greene',
    description: 'Superstrings, hidden dimensions, and the quest for the ultimate theory.',
    category: 'Quantum Physics',
    rating: 4.1,
    publishYear: 1999,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },

  // Future & Innovation
  {
    id: 'singularity-is-near',
    title: 'The Singularity Is Near',
    author: 'Ray Kurzweil',
    description: 'When humans transcend biology through technology.',
    category: 'Innovation',
    rating: 4.2,
    publishYear: 2005,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'inevitable',
    title: 'The Inevitable: Understanding the 12 Technological Forces',
    author: 'Kevin Kelly',
    description: 'How technological forces will shape the next 30 years.',
    category: 'Innovation',
    rating: 4.1,
    publishYear: 2016,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'fourth-revolution',
    title: 'The Fourth Industrial Revolution',
    author: 'Klaus Schwab',
    description: 'How the fusion of technologies is blurring the lines between the physical, digital, and biological.',
    category: 'Innovation',
    rating: 4.0,
    publishYear: 2017,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'homo-deus',
    title: 'Homo Deus: A Brief History of Tomorrow',
    author: 'Yuval Noah Harari',
    description: 'What will happen to the world when biotechnology and AI surpass human capabilities?',
    category: 'Innovation',
    rating: 4.3,
    publishYear: 2017,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },

  // Business & Strategy
  {
    id: 'blitzscaling',
    title: 'Blitzscaling: The Lightning-Fast Path to Building Massively Valuable Companies',
    author: 'Reid Hoffman, Chris Yeh',
    description: 'The playbook for building and scaling tech startups at breakneck speed.',
    category: 'Business',
    rating: 4.1,
    publishYear: 2018,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'measure-what-matters',
    title: 'Measure What Matters',
    author: 'John Doerr',
    description: 'How Google, Bono, and the Gates Foundation rock the world with OKRs.',
    category: 'Business',
    rating: 4.2,
    publishYear: 2018,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
  {
    id: 'crossing-chasm',
    title: 'Crossing the Chasm',
    author: 'Geoffrey A. Moore',
    description: 'Marketing and selling disruptive products to mainstream customers.',
    category: 'Business',
    rating: 4.0,
    publishYear: 1991,
    amazonUrl: 'https://amazon.com',
    goodreadsUrl: 'https://goodreads.com'
  },
];

export const BOOK_CATEGORIES = [
  'All',
  'AI',
  'Tech',
  'Business',
  'Quantum Physics',
  'Innovation'
];

