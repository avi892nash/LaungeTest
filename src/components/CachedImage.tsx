import React, { useState, useEffect, useMemo } from 'react';
import { Image, View, ActivityIndicator, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import { getCachedImageUri, cacheImage } from '../services/ImageCache';

interface CachedImageProps {
  uri: string | undefined | null;
  style?: StyleProp<ImageStyle>;
  placeholderStyle?: StyleProp<ImageStyle>; // Style for the placeholder view
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  // Add any other Image props you might need
}

const CachedImage: React.FC<CachedImageProps> = ({ uri, style, placeholderStyle, resizeMode = 'cover', ...rest }) => {
  const [imageSource, setImageSource] = useState<ImageSourcePropType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const effectiveUri = useMemo(() => {
    if (uri && (uri.startsWith('http://') || uri.startsWith('https://'))) {
      return uri;
    }
    // If uri is already a local file path (e.g. from a file picker, or already cached by other means)
    // This basic check might need to be more robust depending on expected URI formats
    if (uri && uri.startsWith('file://')) {
      return uri;
    }
    // For any other case, including potentially relative paths that are not meant for network
    // treat as invalid for network caching for now.
    // Or, if you have a base URL for relative paths:
    // return `https://your-base-url.com/${uri}`;
    return null;
  }, [uri]);


  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setImageSource(null); // Reset while loading new URI

    const loadImage = async () => {
      if (!effectiveUri) {
        if (isActive) {
          setIsLoading(false);
          // setImageSource(require('../assets/images/placeholder.png')); // Optional: default placeholder
        }
        return;
      }

      try {
        // 1. Try to get from cache
        let localUri = await getCachedImageUri(effectiveUri);

        if (isActive && localUri) {
          setImageSource({ uri: localUri });
          setIsLoading(false);
          return;
        }

        // 2. If not in cache, download and cache it
        // For initial display, we can show the remote URI while it caches in background,
        // or show a loader until it's cached and then show the local file.
        // Showing remote URI first gives faster perceived load for first time.
        if (isActive) {
           // Temporarily display remote URI if you want immediate feedback
           // setImageSource({ uri: effectiveUri }); 
        }

        localUri = await cacheImage(effectiveUri); // This will download and save

        if (isActive) {
          if (localUri) {
            setImageSource({ uri: localUri });
          } else {
            // Download failed, maybe show a fallback or keep showing remote if it was set
            // If not showing remote URI initially, set a fallback here
            // setImageSource(require('../assets/images/error.png')); // Optional: error placeholder
            // Or, if you want to attempt to display the remote URI directly on failure:
            setImageSource({ uri: effectiveUri }); 
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[CachedImage] Error loading image:', effectiveUri, error);
        if (isActive) {
          setIsLoading(false);
          // setImageSource(require('../assets/images/error.png')); // Optional: error placeholder
          // Or, if you want to attempt to display the remote URI directly on error:
           setImageSource({ uri: effectiveUri });
        }
      }
    };

    if (effectiveUri) {
      loadImage();
    } else {
      setIsLoading(false);
    }

    return () => {
      isActive = false; // Prevent state updates on unmounted component
    };
  }, [effectiveUri]);

  if (isLoading) {
    return (
      <View style={[style, placeholderStyle, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!imageSource) {
    // This case handles if URI is null/undefined or loading failed without a fallback imageSource being set
    return (
      <View style={[style, placeholderStyle, { backgroundColor: '#e0e0e0' }]}>
        {/* Optional: You can put a placeholder icon or text here */}
      </View>
    );
  }

  return <Image source={imageSource} style={style} resizeMode={resizeMode} {...rest} />;
};

export default CachedImage;
