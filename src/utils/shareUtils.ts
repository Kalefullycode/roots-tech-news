import { AggregatedVideo } from '@/types/video';

/**
 * Share video to social media
 */
export function shareVideo(video: AggregatedVideo, platform: 'twitter' | 'facebook' | 'linkedin' | 'reddit'): void {
  const url = encodeURIComponent(video.url);
  const title = encodeURIComponent(video.title);
  const text = encodeURIComponent(`${video.title} - ${video.channelName}`);
  
  const shareUrls: Record<typeof platform, string> = {
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    reddit: `https://reddit.com/submit?url=${url}&title=${title}`,
  };
  
  window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
}

/**
 * Copy video link to clipboard
 */
export async function copyVideoLink(video: AggregatedVideo): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(video.url);
    return true;
  } catch (error) {
    console.error('Error copying link:', error);
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = video.url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
      return false;
    }
  }
}

/**
 * Share via Web Share API if available
 */
export async function shareViaWebAPI(video: AggregatedVideo): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }
  
  try {
    await navigator.share({
      title: video.title,
      text: `${video.title} - ${video.channelName}`,
      url: video.url,
    });
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    return false;
  }
}

