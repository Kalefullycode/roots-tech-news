// RootsTechNews Complete RSS Fix

// This replaces ALL broken RSS feeds with working alternatives



(function() {

    'use strict';

    

    console.log('🚀 RootsTechNews RSS Fix Starting...');

    

    // STEP 1: Block ALL broken RSS/CORS requests

    const originalFetch = window.fetch;

    window.fetch = function(...args) {

        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;

        

        // Block all CORS proxy attempts and broken RSS feeds

        const blockedPatterns = [

            'cors-proxy',

            'cors.bridged.cc',

            'cors-anywhere',

            'allorigins.win',

            'htmldriven.com',

            '/api/rss-proxy',

            'openai.com/blog/rss',

            'news.mit.edu/rss',

            'lexfridman.com/feed',

            'twimlai.com/feed',

            'substack.com/feed',

            'changelog.com',

            'megaphone.fm'

        ];

        

        if (url && blockedPatterns.some(pattern => url.includes(pattern))) {

            console.log('🚫 Blocked CORS/RSS request:', url.substring(0, 50) + '...');

            

            // Return empty but valid XML response for RSS feeds to prevent XML parsing errors

            const isRSSRequest = url.includes('rss') || url.includes('feed') || url.includes('xml');

            const emptyRSSXML = `<?xml version="1.0" encoding="UTF-8"?>

<rss version="2.0">

  <channel>

    <title>Replaced Feed</title>

    <description>This feed has been replaced with working alternatives</description>

    <items></items>

  </channel>

</rss>`;

            

            return Promise.resolve(new Response(

                isRSSRequest ? emptyRSSXML : JSON.stringify({

                    items: [],

                    articles: [],

                    feed: { title: 'Replaced Feed', items: [] }

                }), 

                {

                    status: 200,

                    headers: { 

                        'Content-Type': isRSSRequest ? 'application/xml' : 'application/json'

                    }

                }

            ));

        }

        

        return originalFetch.apply(this, args);

    };

    

    // STEP 2: Replace RSS Service with Direct API calls

    class WorkingNewsService {

        constructor() {

            this.articles = [];

            this.isLoading = false;

        }

        

        async loadAllFeeds() {

            if (this.isLoading) return this.articles;

            this.isLoading = true;

            

            console.log('📡 Loading news from working sources...');

            

            try {

                // These APIs work without CORS issues

                const sources = await Promise.allSettled([

                    this.loadDevTo(),

                    this.loadHackerNews(),

                    this.loadReddit(),

                    this.loadGitHubTrending()

                ]);

                

                // Combine all successful results

                this.articles = [];

                sources.forEach((result, index) => {

                    if (result.status === 'fulfilled' && result.value) {

                        this.articles.push(...result.value);

                        console.log(`✅ Loaded ${result.value.length} articles from source ${index + 1}`);

                    }

                });

                

                // Sort by date (newest first)

                this.articles.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

                

                // Display the articles

                this.displayArticles();

                

                console.log(`✅ Total articles loaded: ${this.articles.length}`);

                

            } catch (error) {

                console.error('Error loading feeds:', error);

            } finally {

                this.isLoading = false;

            }

            

            return this.articles;

        }

        

        async loadDevTo() {

            try {

                const [aiArticles, techArticles] = await Promise.all([

                    fetch('https://dev.to/api/articles?tag=ai&per_page=15').then(r => r.json()),

                    fetch('https://dev.to/api/articles?tag=technology&per_page=15').then(r => r.json())

                ]);

                

                const articles = [...aiArticles, ...techArticles].map(article => ({

                    title: article.title,

                    url: article.url,

                    description: article.description || article.tag_list?.join(', '),

                    date: article.published_at,

                    source: 'DEV Community',

                    category: article.tag_list?.includes('ai') ? 'AI' : 'Tech',

                    image: article.cover_image || article.social_image

                }));

                

                return articles.slice(0, 20);

            } catch (error) {

                console.error('DEV.to error:', error);

                return [];

            }

        }

        

        async loadHackerNews() {

            try {

                const topStories = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(r => r.json());

                const storyPromises = topStories.slice(0, 15).map(id => 

                    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())

                );

                

                const stories = await Promise.all(storyPromises);

                

                return stories.filter(story => story && story.title).map(story => ({

                    title: story.title,

                    url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,

                    description: `${story.score} points • ${story.descendants || 0} comments`,

                    date: new Date(story.time * 1000).toISOString(),

                    source: 'Hacker News',

                    category: 'Tech News'

                }));

            } catch (error) {

                console.error('HackerNews error:', error);

                return [];

            }

        }

        

        async loadReddit() {

            try {

                const response = await fetch('https://www.reddit.com/r/technology/top.json?limit=15');

                const data = await response.json();

                

                return data.data.children.map(post => ({

                    title: post.data.title,

                    url: post.data.url.startsWith('/r/') ? 

                         `https://reddit.com${post.data.url}` : 

                         post.data.url,

                    description: `⬆ ${post.data.score} • 💬 ${post.data.num_comments} comments`,

                    date: new Date(post.data.created_utc * 1000).toISOString(),

                    source: 'Reddit r/technology',

                    category: 'Discussion'

                }));

            } catch (error) {

                console.error('Reddit error:', error);

                return [];

            }

        }

        

        async loadGitHubTrending() {

            try {

                const response = await fetch('https://api.github.com/search/repositories?q=ai+OR+machine-learning+OR+chatgpt&sort=stars&order=desc&per_page=10');

                const data = await response.json();

                

                return (data.items || []).map(repo => ({

                    title: `${repo.name} - ${repo.description?.substring(0, 60)}...`,

                    url: repo.html_url,

                    description: `⭐ ${repo.stargazers_count} stars • ${repo.language || 'Various'}`,

                    date: repo.updated_at,

                    source: 'GitHub Trending',

                    category: 'Open Source'

                }));

            } catch (error) {

                console.error('GitHub error:', error);

                return [];

            }

        }

        

        displayArticles() {

            // Only display if React app hasn't loaded or if there's an error

            // Check if React root is empty or has error

            const reactRoot = document.getElementById('root');

            const hasReactContent = reactRoot && reactRoot.children.length > 0 && 

                                   !reactRoot.querySelector('.error-boundary, .error-screen');

            

            // Don't interfere with React if it's working

            if (hasReactContent) {

                console.log('✅ React app is running, skipping RSS fix display');

                return;

            }

            

            // Remove any error screens

            const errorScreen = document.querySelector('.error-screen, #error-boundary');

            if (errorScreen) {

                errorScreen.style.display = 'none';

            }

            

            // Find or create main container (only if React isn't working)

            let container = document.getElementById('roots-news-container');

            if (!container) {

                // Look for existing containers

                const possibleContainers = [

                    document.getElementById('root'),

                    document.getElementById('app'),

                    document.querySelector('.main-content'),

                    document.querySelector('main'),

                    document.body

                ];

                

                container = possibleContainers.find(el => el) || document.body;

                

                // Create our news container

                const newsDiv = document.createElement('div');

                newsDiv.id = 'roots-news-container';

                newsDiv.className = 'roots-news-feed';

                container.appendChild(newsDiv);

                container = newsDiv;

            }

            

            // Apply dark theme styles

            if (!document.getElementById('roots-news-styles')) {

                const styles = document.createElement('style');

                styles.id = 'roots-news-styles';

                styles.innerHTML = `

                    .roots-news-feed {

                        max-width: 1400px;

                        margin: 0 auto;

                        padding: 40px 20px;

                        background: #0a0e27;

                        min-height: 100vh;

                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

                    }

                    

                    .news-header {

                        text-align: center;

                        margin-bottom: 40px;

                        padding-bottom: 30px;

                        border-bottom: 2px solid rgba(0, 255, 204, 0.2);

                    }

                    

                    .news-title {

                        font-size: 3rem;

                        font-weight: bold;

                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

                        -webkit-background-clip: text;

                        -webkit-text-fill-color: transparent;

                        margin: 0 0 10px 0;

                    }

                    

                    .news-subtitle {

                        color: #9ca3af;

                        font-size: 1.2rem;

                    }

                    

                    .refresh-button {

                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

                        color: white;

                        border: none;

                        padding: 12px 30px;

                        border-radius: 30px;

                        font-size: 1rem;

                        font-weight: 600;

                        cursor: pointer;

                        margin-top: 20px;

                        transition: transform 0.2s, box-shadow 0.2s;

                    }

                    

                    .refresh-button:hover {

                        transform: translateY(-2px);

                        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);

                    }

                    

                    .news-grid {

                        display: grid;

                        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));

                        gap: 30px;

                        margin-top: 40px;

                    }

                    

                    .news-card {

                        background: rgba(255, 255, 255, 0.03);

                        border: 1px solid rgba(255, 255, 255, 0.06);

                        border-radius: 16px;

                        padding: 24px;

                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

                        position: relative;

                        overflow: hidden;

                    }

                    

                    .news-card::before {

                        content: '';

                        position: absolute;

                        top: 0;

                        left: 0;

                        right: 0;

                        height: 3px;

                        background: linear-gradient(90deg, #667eea, #764ba2);

                        transform: scaleX(0);

                        transition: transform 0.3s;

                    }

                    

                    .news-card:hover {

                        transform: translateY(-8px);

                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

                        border-color: rgba(102, 126, 234, 0.3);

                        background: rgba(255, 255, 255, 0.05);

                    }

                    

                    .news-card:hover::before {

                        transform: scaleX(1);

                    }

                    

                    .news-meta {

                        display: flex;

                        justify-content: space-between;

                        align-items: center;

                        margin-bottom: 12px;

                    }

                    

                    .news-source {

                        color: #667eea;

                        font-size: 0.85rem;

                        font-weight: 600;

                        text-transform: uppercase;

                        letter-spacing: 0.5px;

                    }

                    

                    .news-category {

                        padding: 4px 12px;

                        border-radius: 20px;

                        font-size: 0.75rem;

                        font-weight: 600;

                        text-transform: uppercase;

                        letter-spacing: 0.5px;

                    }

                    

                    .category-ai {

                        background: rgba(16, 185, 129, 0.1);

                        color: #10b981;

                    }

                    

                    .category-tech {

                        background: rgba(59, 130, 246, 0.1);

                        color: #3b82f6;

                    }

                    

                    .category-discussion {

                        background: rgba(236, 72, 153, 0.1);

                        color: #ec4899;

                    }

                    

                    .category-open-source {

                        background: rgba(251, 146, 60, 0.1);

                        color: #fb923c;

                    }

                    

                    .news-card h3 {

                        margin: 12px 0;

                        font-size: 1.15rem;

                        line-height: 1.4;

                    }

                    

                    .news-card h3 a {

                        color: #e5e7eb;

                        text-decoration: none;

                        transition: color 0.2s;

                    }

                    

                    .news-card h3 a:hover {

                        color: #667eea;

                    }

                    

                    .news-description {

                        color: #9ca3af;

                        font-size: 0.95rem;

                        line-height: 1.6;

                        margin: 12px 0;

                    }

                    

                    .news-date {

                        color: #6b7280;

                        font-size: 0.85rem;

                        margin-top: 12px;

                    }

                    

                    .loading-indicator {

                        text-align: center;

                        padding: 40px;

                        color: #667eea;

                        font-size: 1.2rem;

                    }

                    

                    @media (max-width: 768px) {

                        .news-grid {

                            grid-template-columns: 1fr;

                        }

                        

                        .news-title {

                            font-size: 2rem;

                        }

                    }

                `;

                document.head.appendChild(styles);

            }

            

            // Generate HTML

            const html = `

                <div class="news-header">

                    <h1 class="news-title">Roots Tech News</h1>

                    <p class="news-subtitle">AI & Technology News Hub</p>

                    <button class="refresh-button" onclick="window.newsService.loadAllFeeds()">

                        🔄 Refresh Feed

                    </button>

                </div>

                

                ${this.articles.length === 0 ? 

                    '<div class="loading-indicator">Loading news feeds...</div>' :

                    `<div class="news-grid">

                        ${this.articles.slice(0, 50).map(article => {

                            const categoryClass = article.category.toLowerCase().replace(/\s+/g, '-');

                            return `

                                <article class="news-card">

                                    <div class="news-meta">

                                        <span class="news-source">${article.source}</span>

                                        <span class="news-category category-${categoryClass}">${article.category}</span>

                                    </div>

                                    <h3>

                                        <a href="${article.url}" target="_blank" rel="noopener">

                                            ${article.title}

                                        </a>

                                    </h3>

                                    <p class="news-description">${article.description || ''}</p>

                                    <div class="news-date">

                                        ${this.formatDate(article.date)}

                                    </div>

                                </article>

                            `;

                        }).join('')}

                    </div>`

                }

            `;

            

            container.innerHTML = html;

            

            // Hide any remaining error screens

            document.querySelectorAll('.error-boundary, .error-screen').forEach(el => {

                el.style.display = 'none';

            });

        }

        

        formatDate(dateStr) {

            if (!dateStr) return '';

            const date = new Date(dateStr);

            const now = new Date();

            const diff = now - date;

            const hours = Math.floor(diff / (1000 * 60 * 60));

            

            if (hours < 1) return 'Just now';

            if (hours < 24) return `${hours}h ago`;

            if (hours < 48) return 'Yesterday';

            

            return date.toLocaleDateString('en-US', { 

                month: 'short', 

                day: 'numeric',

                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined

            });

        }

    }

    

    // STEP 3: Initialize and auto-load

    const newsService = new WorkingNewsService();

    window.newsService = newsService; // Make globally available

    

    // Load feeds when DOM is ready

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', () => {

            setTimeout(() => newsService.loadAllFeeds(), 1000);

        });

    } else {

        setTimeout(() => newsService.loadAllFeeds(), 1000);

    }

    

    // Auto-refresh every 5 minutes

    setInterval(() => {

        console.log('🔄 Auto-refreshing feeds...');

        newsService.loadAllFeeds();

    }, 5 * 60 * 1000);

    

    // STEP 4: Override any existing RSS services

    if (window.RSSService || window.EnhancedRSSService || window.TechNewsFeedManager) {

        console.log('🔄 Replacing existing RSS services...');

        

        // Override with our working service

        window.RSSService = newsService;

        window.EnhancedRSSService = newsService;

        window.TechNewsFeedManager = newsService;

        

        // Override their methods

        const services = [window.RSSService, window.EnhancedRSSService, window.TechNewsFeedManager];

        services.forEach(service => {

            if (service) {

                service.loadFeeds = () => newsService.loadAllFeeds();

                service.fetchRSSFeed = () => Promise.resolve([]);

                service.loadRSSFeed = () => Promise.resolve([]);

            }

        });

    }

    

    console.log('✅ RootsTechNews RSS Fix Applied!');

    console.log('📝 Use window.newsService.loadAllFeeds() to manually refresh');

    

})();

