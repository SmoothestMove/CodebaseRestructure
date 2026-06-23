import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  threshold?: number;
}

/**
 * LazyImage component with intersection observer and progressive loading
 * Features:
 * - Lazy loading with intersection observer
 * - Blur-up effect from low-quality placeholder
 * - Loading and error states
 * - Performance optimized with proper cleanup
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  className = '',
  width,
  height,
  blurDataURL,
  onLoad,
  onError,
  loading = 'lazy',
  threshold = 0.1,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const [hasError, setHasError] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (loading === 'eager' || isInView) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsInView(true);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin: '50px', // Start loading 50px before the image comes into view
    });

    const currentRef = imgRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isInView, loading, threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
    setShowPlaceholder(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setShowPlaceholder(false);
    onError?.();
  };

  const transitionStyle: React.CSSProperties = { transition: 'opacity 0.3s ease-out, transform 0.3s ease-out' };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width || '100%',
    height: height || 'auto',
    backgroundColor: '#f8fafc', // Default placeholder background
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      {/* Blur placeholder (if provided) */}
      {blurDataURL && showPlaceholder && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
          style={{ pointerEvents: 'none', opacity: isLoaded ? 0 : 1, ...transitionStyle }}
        />
      )}

      {/* Color placeholder */}
      {!blurDataURL && showPlaceholder && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
          style={{ opacity: isLoaded ? 0 : 1, ...transitionStyle }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-400 dark:border-slate-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={isInView ? src : placeholder || ''}
        alt={alt}
        className={`w-full h-full object-cover ${hasError ? 'opacity-50' : ''}`}
        style={{
          width: width || '100%',
          height: height || 'auto',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
          ...transitionStyle,
        }}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
      />

      {/* Error state overlay */}
      {hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800"
          style={{ opacity: 1 }}
        >
          <div className="text-center text-slate-500 dark:text-slate-400">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
