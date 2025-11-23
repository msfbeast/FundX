// Podcast caching utilities using IndexedDB for audio and localStorage for metadata

const DB_NAME = 'FundingCoachPodcasts';
const STORE_NAME = 'podcasts';
const DB_VERSION = 1;

interface PodcastCacheMetadata {
  moduleTitle: string;
  script: string;
  timestamp: number;
  duration: number;
  sampleRate: number;
}

// Initialize IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'moduleTitle' });
      }
    };
  });
};

// Save podcast to cache
export const savePodcastToCache = async (
  moduleTitle: string,
  script: string,
  audioBuffer: AudioBuffer
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate inputs
    if (!moduleTitle || !script || !audioBuffer) {
      throw new Error('Invalid input: moduleTitle, script, and audioBuffer are required');
    }

    // Save metadata to localStorage
    const metadata: PodcastCacheMetadata = {
      moduleTitle,
      script,
      timestamp: Date.now(),
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate
    };
    
    try {
      localStorage.setItem(`podcast_meta_${moduleTitle}`, JSON.stringify(metadata));
    } catch (storageError) {
      // Handle quota exceeded error
      if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some cached podcasts.');
      }
      throw storageError;
    }

    // Save audio buffer to IndexedDB
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Convert AudioBuffer to raw data for storage
    const channels: Float32Array[] = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    const podcastData = {
      moduleTitle,
      numberOfChannels: audioBuffer.numberOfChannels,
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate,
      channels: channels.map(ch => Array.from(ch)) // Convert to regular arrays for storage
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(podcastData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
    console.log(`✅ Podcast cached: ${moduleTitle}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to cache podcast:', errorMessage);
    return { success: false, error: errorMessage };
  }
};

// Load podcast from cache
export const loadPodcastFromCache = async (
  moduleTitle: string
): Promise<{ script: string; audioBuffer: AudioBuffer } | null> => {
  let audioContext: AudioContext | null = null;
  
  try {
    // Check metadata first
    const metaStr = localStorage.getItem(`podcast_meta_${moduleTitle}`);
    if (!metaStr) return null;

    const metadata: PodcastCacheMetadata = JSON.parse(metaStr);

    // Check if cache is older than 30 days
    const cacheAge = Date.now() - metadata.timestamp;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (cacheAge > thirtyDays) {
      console.log('Cache expired, will regenerate');
      await clearPodcastCache(moduleTitle);
      return null;
    }

    // Load audio from IndexedDB
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const podcastData = await new Promise<any>((resolve, reject) => {
      const request = store.get(moduleTitle);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    db.close();

    if (!podcastData) return null;

    // Reconstruct AudioBuffer
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: podcastData.sampleRate
    });

    const audioBuffer = audioContext.createBuffer(
      podcastData.numberOfChannels,
      podcastData.length,
      podcastData.sampleRate
    );

    // Copy channel data back
    for (let i = 0; i < podcastData.numberOfChannels; i++) {
      const channelData = audioBuffer.getChannelData(i);
      const storedData = new Float32Array(podcastData.channels[i]);
      channelData.set(storedData);
    }

    console.log(`✅ Podcast loaded from cache: ${moduleTitle}`);
    return {
      script: metadata.script,
      audioBuffer
    };
  } catch (error) {
    console.error('Failed to load podcast from cache:', error);
    return null;
  } finally {
    // Always close AudioContext to prevent memory leaks
    if (audioContext && audioContext.state !== 'closed') {
      await audioContext.close();
    }
  }
};

// Check if podcast is cached
export const isPodcastCached = (moduleTitle: string): boolean => {
  const metaStr = localStorage.getItem(`podcast_meta_${moduleTitle}`);
  return !!metaStr;
};

// Clear specific podcast cache
export const clearPodcastCache = async (moduleTitle: string): Promise<void> => {
  try {
    localStorage.removeItem(`podcast_meta_${moduleTitle}`);

    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(moduleTitle);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
    console.log(`🗑️ Podcast cache cleared: ${moduleTitle}`);
  } catch (error) {
    console.error('Failed to clear podcast cache:', error);
  }
};

// Clear all podcast caches
export const clearAllPodcastCaches = async (): Promise<void> => {
  try {
    // Clear localStorage metadata
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('podcast_meta_')) {
        localStorage.removeItem(key);
      }
    });

    // Clear IndexedDB
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
    console.log('🗑️ All podcast caches cleared');
  } catch (error) {
    console.error('Failed to clear all podcast caches:', error);
  }
};

// Get cache size info
export const getPodcastCacheInfo = async (): Promise<{
  count: number;
  modules: string[];
}> => {
  try {
    const keys = Object.keys(localStorage);
    const modules = keys
      .filter(key => key.startsWith('podcast_meta_'))
      .map(key => key.replace('podcast_meta_', ''));

    return {
      count: modules.length,
      modules
    };
  } catch (error) {
    console.error('Failed to get cache info:', error);
    return { count: 0, modules: [] };
  }
};
