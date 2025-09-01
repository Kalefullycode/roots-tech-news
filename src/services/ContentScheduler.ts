import RSSService from './RSSService';
import VideoService from './VideoService';
import NewsService from './NewsService';
import { NewsArticle } from './NewsService';

interface ScheduleConfig {
  rssUpdate: string; // Every 30 minutes
  youtubeSync: string; // Every 6 hours  
  newsAPIFetch: string; // Every 15 minutes
}

interface ScheduledJob {
  id: string;
  name: string;
  schedule: string;
  lastRun?: number;
  nextRun?: number;
  isRunning: boolean;
  intervalId?: NodeJS.Timeout;
}

interface ContentUpdate {
  type: 'rss' | 'youtube' | 'news';
  timestamp: number;
  count: number;
  success: boolean;
  error?: string;
}

class ContentScheduler {
  private jobs: Map<string, ScheduledJob> = new Map();
  private readonly STORAGE_KEY = 'content_scheduler_state';
  private updateCallbacks: Set<(update: ContentUpdate) => void> = new Set();

  private readonly defaultConfig: ScheduleConfig = {
    rssUpdate: '0 */30 * * * *', // Every 30 minutes
    youtubeSync: '0 0 */6 * * *', // Every 6 hours
    newsAPIFetch: '0 */15 * * * *' // Every 15 minutes
  };

  constructor() {
    this.loadState();
    this.setupJobs();
  }

  private loadState(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        state.jobs?.forEach((job: any) => {
          this.jobs.set(job.id, {
            ...job,
            isRunning: false, // Reset running state on load
            intervalId: undefined
          });
        });
      }
    } catch (error) {
      console.warn('Failed to load scheduler state:', error);
    }
  }

  private saveState(): void {
    try {
      const state = {
        jobs: Array.from(this.jobs.values()).map(job => ({
          ...job,
          intervalId: undefined // Don't save interval IDs
        }))
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save scheduler state:', error);
    }
  }

  private setupJobs(): void {
    this.createJob('rss-update', 'RSS Feed Update', this.defaultConfig.rssUpdate, this.updateRSSFeeds.bind(this));
    this.createJob('youtube-sync', 'YouTube Sync', this.defaultConfig.youtubeSync, this.syncYouTubeContent.bind(this));
    this.createJob('news-fetch', 'News API Fetch', this.defaultConfig.newsAPIFetch, this.fetchNewsAPI.bind(this));
  }

  private createJob(id: string, name: string, schedule: string, handler: () => Promise<void>): void {
    const existingJob = this.jobs.get(id);
    
    const job: ScheduledJob = {
      id,
      name,
      schedule,
      lastRun: existingJob?.lastRun,
      nextRun: existingJob?.nextRun,
      isRunning: false
    };

    this.jobs.set(id, job);
    
    // Convert cron-like schedule to milliseconds (simplified)
    const intervalMs = this.parseScheduleToMs(schedule);
    
    if (intervalMs > 0) {
      const intervalId = setInterval(async () => {
        await this.runJob(id, handler);
      }, intervalMs);
      
      job.intervalId = intervalId;
      job.nextRun = Date.now() + intervalMs;
    }

    this.saveState();
  }

  private parseScheduleToMs(schedule: string): number {
    // Simplified cron parser for demo purposes
    // Format: "seconds minutes hours dayOfMonth month dayOfWeek"
    // Examples:
    // "0 */30 * * * *" = every 30 minutes
    // "0 0 */6 * * *" = every 6 hours
    // "0 */15 * * * *" = every 15 minutes
    
    const parts = schedule.split(' ');
    if (parts.length !== 6) return 0;
    
    const [seconds, minutes, hours] = parts;
    
    // Handle */X patterns
    if (minutes.startsWith('*/')) {
      const interval = parseInt(minutes.substring(2));
      return interval * 60 * 1000; // Convert minutes to ms
    }
    
    if (hours.startsWith('*/')) {
      const interval = parseInt(hours.substring(2));
      return interval * 60 * 60 * 1000; // Convert hours to ms
    }
    
    // Default fallback
    return 30 * 60 * 1000; // 30 minutes
  }

  private async runJob(jobId: string, handler: () => Promise<void>): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job || job.isRunning) return;

    job.isRunning = true;
    job.lastRun = Date.now();
    
    try {
      await handler();
      console.log(`Job ${job.name} completed successfully`);
    } catch (error) {
      console.error(`Job ${job.name} failed:`, error);
    } finally {
      job.isRunning = false;
      if (job.intervalId) {
        const intervalMs = this.parseScheduleToMs(job.schedule);
        job.nextRun = Date.now() + intervalMs;
      }
      this.saveState();
    }
  }

  private async updateRSSFeeds(): Promise<void> {
    try {
      const articles = await RSSService.fetchAllRSSFeeds();
      this.notifyUpdate({
        type: 'rss',
        timestamp: Date.now(),
        count: articles.length,
        success: true
      });
      
      // Cache the results for the main app
      localStorage.setItem('cached_rss_articles', JSON.stringify({
        data: articles,
        timestamp: Date.now()
      }));
      
    } catch (error) {
      this.notifyUpdate({
        type: 'rss',
        timestamp: Date.now(),
        count: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async syncYouTubeContent(): Promise<void> {
    try {
      const videos = await VideoService.fetchLatestVideos();
      this.notifyUpdate({
        type: 'youtube',
        timestamp: Date.now(),
        count: videos.length,
        success: true
      });
      
      // Cache the results
      localStorage.setItem('cached_youtube_videos', JSON.stringify({
        data: videos,
        timestamp: Date.now()
      }));
      
    } catch (error) {
      this.notifyUpdate({
        type: 'youtube',
        timestamp: Date.now(),
        count: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async fetchNewsAPI(): Promise<void> {
    try {
      const articles = await NewsService.fetchAggregatedNews();
      this.notifyUpdate({
        type: 'news',
        timestamp: Date.now(),
        count: articles.length,
        success: true
      });
      
      // Cache the results
      localStorage.setItem('cached_news_articles', JSON.stringify({
        data: articles,
        timestamp: Date.now()
      }));
      
    } catch (error) {
      this.notifyUpdate({
        type: 'news',
        timestamp: Date.now(),
        count: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private notifyUpdate(update: ContentUpdate): void {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in update callback:', error);
      }
    });
  }

  // Public API
  start(): void {
    this.jobs.forEach((job, id) => {
      if (!job.intervalId) {
        this.setupJobs();
      }
    });
    console.log('Content scheduler started');
  }

  stop(): void {
    this.jobs.forEach(job => {
      if (job.intervalId) {
        clearInterval(job.intervalId);
        job.intervalId = undefined;
        job.isRunning = false;
      }
    });
    this.saveState();
    console.log('Content scheduler stopped');
  }

  getJobs(): ScheduledJob[] {
    return Array.from(this.jobs.values());
  }

  getJobStatus(jobId: string): ScheduledJob | undefined {
    return this.jobs.get(jobId);
  }

  updateSchedule(jobId: string, newSchedule: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    // Stop current interval
    if (job.intervalId) {
      clearInterval(job.intervalId);
    }

    // Update schedule
    job.schedule = newSchedule;
    
    // Restart with new schedule
    const intervalMs = this.parseScheduleToMs(newSchedule);
    if (intervalMs > 0) {
      let handler: () => Promise<void>;
      
      switch (jobId) {
        case 'rss-update':
          handler = this.updateRSSFeeds.bind(this);
          break;
        case 'youtube-sync':
          handler = this.syncYouTubeContent.bind(this);
          break;
        case 'news-fetch':
          handler = this.fetchNewsAPI.bind(this);
          break;
        default:
          return false;
      }
      
      const intervalId = setInterval(async () => {
        await this.runJob(jobId, handler);
      }, intervalMs);
      
      job.intervalId = intervalId;
      job.nextRun = Date.now() + intervalMs;
    }

    this.saveState();
    return true;
  }

  manualRun(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return Promise.reject(new Error('Job not found'));

    let handler: () => Promise<void>;
    
    switch (jobId) {
      case 'rss-update':
        handler = this.updateRSSFeeds.bind(this);
        break;
      case 'youtube-sync':
        handler = this.syncYouTubeContent.bind(this);
        break;
      case 'news-fetch':
        handler = this.fetchNewsAPI.bind(this);
        break;
      default:
        return Promise.reject(new Error('Unknown job type'));
    }

    return this.runJob(jobId, handler);
  }

  onUpdate(callback: (update: ContentUpdate) => void): () => void {
    this.updateCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.updateCallbacks.delete(callback);
    };
  }

  getUpdateHistory(): ContentUpdate[] {
    try {
      const history = localStorage.getItem('scheduler_update_history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  clearUpdateHistory(): void {
    localStorage.removeItem('scheduler_update_history');
  }

  getCachedContent(): {
    rss?: { data: NewsArticle[]; timestamp: number };
    youtube?: { data: any[]; timestamp: number };
    news?: { data: NewsArticle[]; timestamp: number };
  } {
    const result: any = {};
    
    try {
      const rss = localStorage.getItem('cached_rss_articles');
      if (rss) result.rss = JSON.parse(rss);
      
      const youtube = localStorage.getItem('cached_youtube_videos');
      if (youtube) result.youtube = JSON.parse(youtube);
      
      const news = localStorage.getItem('cached_news_articles');
      if (news) result.news = JSON.parse(news);
    } catch (error) {
      console.warn('Error loading cached content:', error);
    }
    
    return result;
  }
}

export default new ContentScheduler();
export type { ScheduledJob, ContentUpdate, ScheduleConfig };