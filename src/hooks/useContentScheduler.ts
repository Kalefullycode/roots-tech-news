import { useState, useEffect, useCallback } from 'react';
import ContentScheduler, { ScheduledJob, ContentUpdate } from '@/services/ContentScheduler';

export const useContentScheduler = () => {
  const [jobs, setJobs] = useState<ScheduledJob[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [updateHistory, setUpdateHistory] = useState<ContentUpdate[]>([]);

  useEffect(() => {
    // Initialize jobs
    setJobs(ContentScheduler.getJobs());
    setUpdateHistory(ContentScheduler.getUpdateHistory());

    // Subscribe to updates
    const unsubscribe = ContentScheduler.onUpdate((update) => {
      setUpdateHistory(prev => {
        const newHistory = [update, ...prev].slice(0, 50); // Keep last 50 updates
        
        // Save to localStorage
        try {
          localStorage.setItem('scheduler_update_history', JSON.stringify(newHistory));
        } catch (error) {
          console.warn('Failed to save update history:', error);
        }
        
        return newHistory;
      });
      
      // Refresh jobs to get updated status
      setJobs(ContentScheduler.getJobs());
    });

    // Start scheduler
    ContentScheduler.start();
    setIsRunning(true);

    return () => {
      unsubscribe();
      ContentScheduler.stop();
    };
  }, []);

  const startScheduler = useCallback(() => {
    ContentScheduler.start();
    setIsRunning(true);
  }, []);

  const stopScheduler = useCallback(() => {
    ContentScheduler.stop();
    setIsRunning(false);
  }, []);

  const runJobManually = useCallback(async (jobId: string) => {
    try {
      await ContentScheduler.manualRun(jobId);
      setJobs(ContentScheduler.getJobs());
    } catch (error) {
      console.error('Failed to run job manually:', error);
      throw error;
    }
  }, []);

  const updateJobSchedule = useCallback((jobId: string, newSchedule: string) => {
    const success = ContentScheduler.updateSchedule(jobId, newSchedule);
    if (success) {
      setJobs(ContentScheduler.getJobs());
    }
    return success;
  }, []);

  const clearHistory = useCallback(() => {
    ContentScheduler.clearUpdateHistory();
    setUpdateHistory([]);
  }, []);

  const getCachedContent = useCallback(() => {
    return ContentScheduler.getCachedContent();
  }, []);

  return {
    jobs,
    isRunning,
    updateHistory,
    startScheduler,
    stopScheduler,
    runJobManually,
    updateJobSchedule,
    clearHistory,
    getCachedContent
  };
};

export const useSchedulerStats = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    runningJobs: 0,
    successfulRuns: 0,
    failedRuns: 0,
    lastUpdate: null as Date | null
  });

  useEffect(() => {
    const updateStats = () => {
      const jobs = ContentScheduler.getJobs();
      const history = ContentScheduler.getUpdateHistory();
      
      const runningJobs = jobs.filter(job => job.isRunning).length;
      const successfulRuns = history.filter(update => update.success).length;
      const failedRuns = history.filter(update => !update.success).length;
      const lastUpdate = history.length > 0 ? new Date(history[0].timestamp) : null;

      setStats({
        totalJobs: jobs.length,
        runningJobs,
        successfulRuns,
        failedRuns,
        lastUpdate
      });
    };

    updateStats();
    
    // Subscribe to updates
    const unsubscribe = ContentScheduler.onUpdate(() => {
      updateStats();
    });

    // Update stats every 30 seconds
    const interval = setInterval(updateStats, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return stats;
};