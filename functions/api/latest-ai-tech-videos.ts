// Cloudflare Pages Function - Latest AI & Tech Videos
// Fetches the single latest video from each channel in the AI_TECH_CHANNELS list

/// <reference types="@cloudflare/workers-types" />

interface Env {
  YOUTUBE_API_KEY: string;
  FEED_CACHE: KVNamespace;
  [key: string]: unknown;
}

interface VideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string };
      default: { url: string };
    };
    channelTitle: string;
  };
  channelName?: string;
}

// Helper to get channel ID from handle
async function getChannelId(handle: string, apiKey: string): Promise<string | null> {
  try {
    const cleanHandle = handle.replace("@", "");
    
    // Try searching by handle first
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(cleanHandle)}&type=channel&maxResults=1&key=${apiKey}`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.error(`Failed to search for channel ${handle}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const channelId = data.items?.[0]?.id?.channelId;
    
    if (channelId) {
      return channelId;
    }
    
    // If not found, try searching by custom URL
    const customUrlSearch = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(`youtube.com/${cleanHandle}`)}&type=channel&maxResults=1&key=${apiKey}`;
    const customResponse = await fetch(customUrlSearch);
    
    if (customResponse.ok) {
      const customData = await customResponse.json();
      return customData.items?.[0]?.id?.channelId || null;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting channel ID for ${handle}:`, error);
    return null;
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  const { env } = context;
  const cacheKey = "latest-ai-tech-videos";
  const CACHE_TTL = 3600; // 1 hour

  // Check cache first
  try {
    if (env.FEED_CACHE) {
      const cachedData = await env.FEED_CACHE.get(cacheKey, "json");
      if (cachedData) {
        console.log('KV cache hit for latest AI & Tech videos');
        return new Response(JSON.stringify(cachedData), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }
    }
  } catch (kvError) {
    console.warn('KV cache read error:', kvError);
  }

  // Validate API key
  if (!env.YOUTUBE_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'YOUTUBE_API_KEY not configured' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }

  try {
    // Import channels dynamically (since we can't import from src in functions)
    // For now, we'll define them inline or use a different approach
    const AI_TECH_CHANNELS = [
      { handle: '@isadoesai', name: 'Isa does AI' },
      { handle: '@HeyGen', name: 'HeyGen' },
      { handle: '@PaulJLipsky', name: 'Paul J Lipsky' },
      { handle: '@NickySaunders', name: 'Nicky Saunders' },
      { handle: '@JuliaMcCoy', name: 'Julia McCoy' },
      { handle: '@GaryVee', name: 'GaryVee' },
      { handle: '@NetworkChuck', name: 'NetworkChuck' },
      { handle: '@TwoMinutePapers', name: 'Two Minute Papers' },
      { handle: '@aiexplained-official', name: 'AI Explained' },
      { handle: '@mreflow', name: 'Mr. Eflow' },
      { handle: '@TimExplainsAI', name: 'Tim Explains AI' },
      { handle: '@JohnnyTube', name: 'JohnnyTube' },
      { handle: '@OpenArt', name: 'OpenArt' },
      { handle: '@Excelerator', name: 'Excelerator' },
      { handle: '@TheoreticallyMedia', name: 'TheoreticallyMedia' },
      { handle: '@NuliStudio', name: 'NuliStudio' },
      { handle: '@ElevenLabs', name: 'ElevenLabs' },
      { handle: '@AIVideoSchool', name: 'AI Video School' },
      { handle: '@JohnSavageAI', name: 'John Savage AI' },
      { handle: '@AllAboutAI', name: 'All About AI' },
      { handle: '@3Blue1Brown', name: '3Blue1Brown' },
      { handle: '@LexFridman', name: 'Lex Fridman' },
      { handle: '@sentdex', name: 'Sentdex' },
      { handle: '@Fireship', name: 'Fireship' },
      { handle: '@MarquesBrownlee', name: 'Marques Brownlee' },
      { handle: '@LinusTechTips', name: 'Linus Tech Tips' },
      { handle: '@TechCrunch', name: 'TechCrunch' },
    ];

    const videoPromises = AI_TECH_CHANNELS.map(async (channel) => {
      try {
        const channelId = await getChannelId(channel.handle, env.YOUTUBE_API_KEY);
        if (!channelId) {
          console.warn(`Could not find channel ID for ${channel.handle}`);
          return null;
        }

        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=1&type=video&key=${env.YOUTUBE_API_KEY}`;
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
          console.error(`Failed to fetch videos for ${channel.name}: ${response.status}`);
          return null;
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
          return {
            ...data.items[0],
            channelName: channel.name,
          } as VideoItem;
        }
        
        return null;
      } catch (error) {
        console.error(`Error fetching video for ${channel.name}:`, error);
        return null;
      }
    });

    const results = (await Promise.all(videoPromises)).filter((v): v is VideoItem => v !== null);
    
    // Sort by published date, newest first
    results.sort((a, b) => 
      new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime()
    );

    // Cache the results
    if (env.FEED_CACHE && context.waitUntil) {
      context.waitUntil(
        env.FEED_CACHE.put(cacheKey, JSON.stringify(results), { expirationTtl: CACHE_TTL })
          .catch((kvError) => {
            console.warn('Failed to cache latest AI & Tech videos:', kvError);
          })
      );
    } else if (env.FEED_CACHE) {
      // Fallback: cache synchronously
      env.FEED_CACHE.put(cacheKey, JSON.stringify(results), { expirationTtl: CACHE_TTL })
        .catch((kvError) => {
          console.warn('Failed to cache latest AI & Tech videos:', kvError);
        });
    }

    return new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching latest AI & Tech videos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch videos',
        message: errorMessage,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

// Handle OPTIONS for CORS preflight
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
};


