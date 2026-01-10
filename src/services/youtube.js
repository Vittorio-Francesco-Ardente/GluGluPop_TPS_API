// ============================================
// YOUTUBE API SERVICE
// YouTube Data API v3 - Trailer ufficiali
// ============================================

import { API_CONFIG } from '../config/api';

const { BASE_URL, API_KEY, EMBED_URL } = API_CONFIG.YOUTUBE;

// Helper per le richieste
const fetchYouTube = async (endpoint, params = {}) => {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    ...params
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${searchParams}`);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('YouTube fetch error:', error);
    throw error;
  }
};

// ============================================
// SEARCH
// ============================================

// Cerca trailer di un film
export const searchTrailer = async (movieTitle, year = null) => {
  const query = year 
    ? `${movieTitle} ${year} trailer italiano ufficiale`
    : `${movieTitle} trailer italiano ufficiale`;

  const data = await fetchYouTube('/search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: 5,
    videoCategoryId: '1', // Film & Animation
    relevanceLanguage: 'it'
  });

  if (!data.items?.length) {
    // Prova con trailer in inglese
    const englishData = await fetchYouTube('/search', {
      part: 'snippet',
      q: `${movieTitle} ${year || ''} official trailer`,
      type: 'video',
      maxResults: 5
    });
    return englishData.items?.map(transformVideo) || [];
  }

  return data.items.map(transformVideo);
};

// Cerca video correlati
export const searchRelatedVideos = async (videoId, maxResults = 10) => {
  const data = await fetchYouTube('/search', {
    part: 'snippet',
    relatedToVideoId: videoId,
    type: 'video',
    maxResults
  });

  return data.items?.map(transformVideo) || [];
};

// Ricerca generica video
export const searchVideos = async (query, maxResults = 10) => {
  const data = await fetchYouTube('/search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults
  });

  return data.items?.map(transformVideo) || [];
};

// ============================================
// VIDEO DETAILS
// ============================================

// Ottieni dettagli di un video
export const getVideoDetails = async (videoId) => {
  const data = await fetchYouTube('/videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoId
  });

  if (!data.items?.length) return null;
  return transformVideoDetails(data.items[0]);
};

// Ottieni dettagli di più video
export const getMultipleVideoDetails = async (videoIds) => {
  if (!videoIds.length) return [];
  
  const data = await fetchYouTube('/videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoIds.join(',')
  });

  return data.items?.map(transformVideoDetails) || [];
};

// ============================================
// CHANNELS
// ============================================

// Cerca canale
export const searchChannel = async (query) => {
  const data = await fetchYouTube('/search', {
    part: 'snippet',
    q: query,
    type: 'channel',
    maxResults: 5
  });

  return data.items?.map(transformChannel) || [];
};

// Ottieni video di un canale
export const getChannelVideos = async (channelId, maxResults = 20) => {
  const data = await fetchYouTube('/search', {
    part: 'snippet',
    channelId,
    type: 'video',
    order: 'date',
    maxResults
  });

  return data.items?.map(transformVideo) || [];
};

// ============================================
// PLAYLISTS
// ============================================

// Ottieni video da una playlist
export const getPlaylistVideos = async (playlistId, maxResults = 50) => {
  const data = await fetchYouTube('/playlistItems', {
    part: 'snippet',
    playlistId,
    maxResults
  });

  return data.items?.map(item => ({
    ...transformVideo(item),
    videoId: item.snippet.resourceId.videoId
  })) || [];
};

// ============================================
// EMBED HELPERS
// ============================================

// Genera URL embed per iframe
export const getEmbedUrl = (videoId, options = {}) => {
  const {
    autoplay = 1,
    mute = 0,
    loop = 0,
    controls = 1,
    showinfo = 0,
    rel = 0,
    modestbranding = 1,
    enablejsapi = 1,
    start = 0,
    end = null,
    playlist = null
  } = options;

  const params = new URLSearchParams({
    autoplay,
    mute,
    loop,
    controls,
    showinfo,
    rel,
    modestbranding,
    enablejsapi,
    hl: 'it'
  });

  if (start > 0) params.set('start', start);
  if (end) params.set('end', end);
  if (loop && !playlist) params.set('playlist', videoId);
  if (playlist) params.set('playlist', playlist);

  return `${EMBED_URL}/${videoId}?${params}`;
};

// Genera URL thumbnail
export const getThumbnailUrl = (videoId, quality = 'hqdefault') => {
  // Qualità disponibili: default, mqdefault, hqdefault, sddefault, maxresdefault
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

// Genera URL watch
export const getWatchUrl = (videoId, timestamp = 0) => {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  return timestamp > 0 ? `${url}&t=${timestamp}` : url;
};

// ============================================
// TRANSFORMERS
// ============================================

function transformVideo(item) {
  const videoId = typeof item.id === 'string' ? item.id : item.id?.videoId;
  
  return {
    id: videoId,
    title: item.snippet?.title,
    description: item.snippet?.description,
    channelId: item.snippet?.channelId,
    channelTitle: item.snippet?.channelTitle,
    publishedAt: item.snippet?.publishedAt,
    thumbnail: {
      default: item.snippet?.thumbnails?.default?.url,
      medium: item.snippet?.thumbnails?.medium?.url,
      high: item.snippet?.thumbnails?.high?.url,
      maxres: item.snippet?.thumbnails?.maxres?.url || getThumbnailUrl(videoId, 'maxresdefault')
    },
    embedUrl: getEmbedUrl(videoId),
    watchUrl: getWatchUrl(videoId)
  };
}

function transformVideoDetails(item) {
  const base = transformVideo(item);
  
  // Parsing durata ISO 8601 (PT1H23M45S)
  const duration = item.contentDetails?.duration;
  let durationSeconds = 0;
  let durationFormatted = '';
  
  if (duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (match) {
      const hours = parseInt(match[1] || 0);
      const minutes = parseInt(match[2] || 0);
      const seconds = parseInt(match[3] || 0);
      durationSeconds = hours * 3600 + minutes * 60 + seconds;
      
      if (hours > 0) {
        durationFormatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        durationFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  }

  return {
    ...base,
    duration: durationFormatted,
    durationSeconds,
    viewCount: parseInt(item.statistics?.viewCount || 0),
    likeCount: parseInt(item.statistics?.likeCount || 0),
    commentCount: parseInt(item.statistics?.commentCount || 0),
    tags: item.snippet?.tags || [],
    categoryId: item.snippet?.categoryId,
    liveBroadcastContent: item.snippet?.liveBroadcastContent,
    definition: item.contentDetails?.definition,
    caption: item.contentDetails?.caption === 'true'
  };
}

function transformChannel(item) {
  return {
    id: item.id?.channelId || item.id,
    title: item.snippet?.title,
    description: item.snippet?.description,
    thumbnail: item.snippet?.thumbnails?.high?.url,
    customUrl: item.snippet?.customUrl
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Estrai video ID da vari formati URL
export const extractVideoId = (url) => {
  if (!url) return null;
  
  // Se è già solo l'ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

// Formatta numero visualizzazioni
export const formatViewCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M visualizzazioni`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K visualizzazioni`;
  }
  return `${count} visualizzazioni`;
};

// Export default
export default {
  searchTrailer,
  searchRelatedVideos,
  searchVideos,
  getVideoDetails,
  getMultipleVideoDetails,
  searchChannel,
  getChannelVideos,
  getPlaylistVideos,
  getEmbedUrl,
  getThumbnailUrl,
  getWatchUrl,
  extractVideoId,
  formatViewCount
};
