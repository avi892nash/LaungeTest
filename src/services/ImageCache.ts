import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const CACHE_DIR_NAME = 'image_cache';
const CACHE_DIR = `${RNFS.CachesDirectoryPath}/${CACHE_DIR_NAME}`;
const METADATA_PREFIX = '@ImageCache:';

interface CacheMetadata {
  localPath: string;
  createdAt: number;
  originalUrl: string;
}

// Function to create a safe filename from a URL
const generateSafeFilename = (url: string): string => {
  // Replace non-alphanumeric characters (except periods for extension) with underscores
  // And ensure it's not too long
  return url.replace(/[^a-zA-Z0-9.]/g, '_').slice(-100);
};

const ensureDirExists = async (): Promise<void> => {
  try {
    const exists = await RNFS.exists(CACHE_DIR);
    if (!exists) {
      await RNFS.mkdir(CACHE_DIR, { NSURLIsExcludedFromBackupKey: true }); // Exclude from iCloud backup on iOS
      if (Platform.OS === 'android') {
        // Create a .nomedia file to hide images from gallery apps on Android
        const noMediaFile = `${CACHE_DIR}/.nomedia`;
        if (!(await RNFS.exists(noMediaFile))) {
          await RNFS.writeFile(noMediaFile, '', 'utf8');
        }
      }
    }
  } catch (error) {
    console.error('Failed to create cache directory:', error);
  }
};

export const getCachedImageUri = async (url: string): Promise<string | null> => {
  if (!url) return null;
  await ensureDirExists();
  const metadataKey = `${METADATA_PREFIX}${url}`;

  try {
    const metadataString = await AsyncStorage.getItem(metadataKey);
    if (metadataString) {
      const metadata: CacheMetadata = JSON.parse(metadataString);
      if (await RNFS.exists(metadata.localPath)) {
        // Optional: Add cache expiry logic here if needed
        // e.g., if (Date.now() - metadata.createdAt > MAX_AGE) { ... clear and return null }
        console.log('[ImageCache] Cache hit:', url);
        return `file://${metadata.localPath}`;
      } else {
        // File missing, remove stale metadata
        await AsyncStorage.removeItem(metadataKey);
      }
    }
  } catch (error) {
    console.error('[ImageCache] Error reading cache metadata:', error);
  }
  console.log('[ImageCache] Cache miss:', url);
  return null;
};

export const cacheImage = async (url: string): Promise<string | null> => {
  if (!url) return null;
  await ensureDirExists();

  const filename = generateSafeFilename(url);
  const localPath = `${CACHE_DIR}/${filename}`;
  const metadataKey = `${METADATA_PREFIX}${url}`;

  try {
    // Check if already downloading or recently downloaded to prevent race conditions (simplified)
    const existingDownload = await RNFS.exists(localPath + ".tmp"); // Simple check
    if (existingDownload) {
        console.log('[ImageCache] Download already in progress or recently failed for (tmp exists):', url);
        // Wait a bit and try to get from cache, or return null to let it try again later
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getCachedImageUri(url); // See if it completed
    }

    console.log('[ImageCache] Downloading:', url, 'to', localPath);
    const downloadResult = await RNFS.downloadFile({
      fromUrl: url,
      toFile: localPath + ".tmp", // Download to a temporary file first
      // Optional: add progress tracking
    }).promise;

    if (downloadResult.statusCode === 200) {
      await RNFS.moveFile(localPath + ".tmp", localPath); // Move to final location on success
      const metadata: CacheMetadata = {
        localPath,
        createdAt: Date.now(),
        originalUrl: url,
      };
      await AsyncStorage.setItem(metadataKey, JSON.stringify(metadata));
      console.log('[ImageCache] Cached successfully:', url);
      return `file://${localPath}`;
    } else {
      console.error('[ImageCache] Failed to download image:', url, 'Status:', downloadResult.statusCode);
      if (await RNFS.exists(localPath + ".tmp")) {
        await RNFS.unlink(localPath + ".tmp"); // Clean up temp file on failure
      }
    }
  } catch (error) {
    console.error('[ImageCache] Error caching image:', url, error);
     if (await RNFS.exists(localPath + ".tmp")) {
        try { await RNFS.unlink(localPath + ".tmp"); } catch (e) { /* ignore */ }
      }
  }
  return null;
};

export const clearImageCache = async (): Promise<void> => {
  try {
    if (await RNFS.exists(CACHE_DIR)) {
      await RNFS.unlink(CACHE_DIR); // Deletes the directory and its contents
    }
    // Recreate the directory for future use
    await ensureDirExists();

    // Clear AsyncStorage metadata
    const allKeys = await AsyncStorage.getAllKeys();
    const imageCacheKeys = allKeys.filter(key => key.startsWith(METADATA_PREFIX));
    await AsyncStorage.multiRemove(imageCacheKeys);
    console.log('[ImageCache] Cache cleared.');
  } catch (error) {
    console.error('[ImageCache] Error clearing image cache:', error);
  }
};

// Optional: Function to pre-populate cache
export const preloadImages = async (urls: string[]): Promise<void> => {
  await ensureDirExists();
  for (const url of urls) {
    const cachedUri = await getCachedImageUri(url);
    if (!cachedUri) {
      await cacheImage(url); // Download and cache if not already present
    }
  }
};
