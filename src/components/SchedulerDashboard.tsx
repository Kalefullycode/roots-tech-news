import { useState } from 'react';
import { Play, Pause, RefreshCw, Settings, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContentScheduler, useSchedulerStats } from '@/hooks/useContentScheduler';
import { useToast } from '@/hooks/use-toast';
import { ScheduledJob, ContentUpdate } from '@/services/ContentScheduler';

const SchedulerDashboard = () => {
  const { 
    jobs, 
    isRunning, 
    updateHistory, 
    startScheduler, 
    stopScheduler, 
    runJobManually, 
    clearHistory 
  } = useContentScheduler();
  
  const stats = useSchedulerStats();
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleToggleScheduler = () => {
    if (isRunning) {
      stopScheduler();
      toast({
        title: "Scheduler Stopped",
        description: "Content automation has been paused.",
      });
    } else {
      startScheduler();
      toast({
        title: "Scheduler Started",
        description: "Content automation is now running.",
      });
    }
  };

  const handleManualRun = async (jobId: string) => {
    try {
      await runJobManually(jobId);
      toast({
        title: "Job Executed",
        description: "Manual job execution completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Job Failed",
        description: "Failed to execute job manually.",
        variant: "destructive"
      });
    }
  };

  const formatNextRun = (timestamp?: number) => {
    if (!timestamp) return 'Not scheduled';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = timestamp - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const formatLastRun = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getJobStatusColor = (job: ScheduledJob) => {
    if (job.isRunning) return 'bg-blue-500';
    if (!job.lastRun) return 'bg-gray-500';
    return 'bg-green-500';
  };

  const getUpdateStatusIcon = (update: ContentUpdate) => {
    return update.success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="p-6 bg-card-modern border border-card-border/60">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-orbitron font-bold text-foreground">Content Scheduler</h2>
            <p className="text-muted-foreground">Automated content fetching and synchronization</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={isRunning}
                onCheckedChange={handleToggleScheduler}
                id="scheduler-toggle"
              />
              <label htmlFor="scheduler-toggle" className="text-sm font-medium">
                {isRunning ? 'Running' : 'Stopped'}
              </label>
            </div>
            
            <Badge variant={isRunning ? 'default' : 'secondary'} className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {isRunning ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background/40 rounded-lg border border-border/30">
            <div className="text-2xl font-bold text-primary">{stats.totalJobs}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </div>
          
          <div className="text-center p-4 bg-background/40 rounded-lg border border-border/30">
            <div className="text-2xl font-bold text-blue-500">{stats.runningJobs}</div>
            <div className="text-sm text-muted-foreground">Running</div>
          </div>
          
          <div className="text-center p-4 bg-background/40 rounded-lg border border-border/30">
            <div className="text-2xl font-bold text-green-500">{stats.successfulRuns}</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </div>
          
          <div className="text-center p-4 bg-background/40 rounded-lg border border-border/30">
            <div className="text-2xl font-bold text-red-500">{stats.failedRuns}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>
      </Card>

      {/* Jobs and History Tabs */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Scheduled Jobs</TabsTrigger>
          <TabsTrigger value="history">Update History</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 bg-card-modern border border-card-border/60">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${getJobStatusColor(job)}`} />
                  <h3 className="text-lg font-semibold text-foreground">{job.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {job.schedule}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManualRun(job.id)}
                    disabled={job.isRunning}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className={`h-3 w-3 ${job.isRunning ? 'animate-spin' : ''}`} />
                    Run Now
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Last Run:</span>
                  <div className="font-medium">{formatLastRun(job.lastRun)}</div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Next Run:</span>
                  <div className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatNextRun(job.nextRun)}
                  </div>
                </div>
              </div>
              
              {job.isRunning && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Job is currently running...</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Recent Updates</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear History
            </Button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {updateHistory.length === 0 ? (
              <Card className="p-6 text-center bg-card-modern border border-card-border/60">
                <p className="text-muted-foreground">No update history available</p>
              </Card>
            ) : (
              updateHistory.map((update, index) => (
                <Card key={index} className="p-4 bg-card-modern border border-card-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getUpdateStatusIcon(update)}
                      <div>
                        <div className="font-medium text-foreground capitalize">
                          {update.type} Update
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {update.success 
                            ? `Fetched ${update.count} items`
                            : `Failed: ${update.error}`
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {new Date(update.timestamp).toLocaleString()}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulerDashboard;