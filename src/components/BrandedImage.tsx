import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BrandedImageProps {
  src: string;
  alt: string;
  className?: string;
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  watermarkSize?: 'sm' | 'md' | 'lg';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const BrandedImage = ({
  src,
  alt,
  className,
  watermarkPosition = 'bottom-right',
  watermarkSize = 'md',
  loading = 'lazy',
  onLoad,
  onError
}: BrandedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjAyMDIwIi8+CjxyZWN0IHg9IjEzMCIgeT0iMTMwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgcng9IjIwIiBmaWxsPSIjMzAzMDMwIi8+Cjwvc3ZnPg==';

  const positionClasses = {
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2'
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
    onError?.();
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-secondary animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      )}
      
      <img
        src={imageError ? fallbackImage : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Brand Watermark */}
      <div 
        className={cn(
          "absolute font-bold tracking-wide bg-background/80 backdrop-blur-sm rounded text-primary border border-primary/20 shadow-lg select-none pointer-events-none",
          positionClasses[watermarkPosition],
          sizeClasses[watermarkSize]
        )}
      >
        MinerHaolan
      </div>
    </div>
  );
};

export default BrandedImage;
