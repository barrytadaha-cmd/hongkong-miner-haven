import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
}

const LazyImage = ({ src, alt, className, placeholderClassName }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Fallback image for broken links
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjAyMDIwIi8+CjxyZWN0IHg9IjEzMCIgeT0iMTMwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgcng9IjIwIiBmaWxsPSIjMzAzMDMwIi8+Cjwvc3ZnPg==';

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Shimmer placeholder */}
      {!isLoaded && (
        <div 
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-secondary',
            'animate-pulse',
            placeholderClassName
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={hasError ? fallbackImage : src}
          alt={alt}
          className={cn(
            'transition-all duration-500 ease-out',
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;
