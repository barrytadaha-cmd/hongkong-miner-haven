import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  zoomLevel?: number;
  lensSize?: number;
  showBrandWatermark?: boolean;
}

const ImageZoom = ({
  src,
  alt,
  className,
  zoomLevel = 2.5,
  lensSize = 150,
  showBrandWatermark = true
}: ImageZoomProps) => {
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsZooming(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage position
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setPosition({ x: xPercent, y: yPercent });
    setCursorPosition({ x, y });
  }, []);

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjAyMDIwIi8+CjxyZWN0IHg9IjEzMCIgeT0iMTMwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgcng9IjIwIiBmaWxsPSIjMzAzMDMwIi8+Cjwvc3ZnPg==';

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden cursor-crosshair group",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-secondary animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-contain transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackImage;
          setImageLoaded(true);
        }}
      />

      {/* Zoom Hint */}
      <div className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-sm text-muted-foreground transition-opacity duration-300 pointer-events-none",
        isZooming ? "opacity-0" : "opacity-100 group-hover:opacity-100"
      )}>
        <Search className="h-4 w-4" />
        <span>Hover to zoom</span>
      </div>

      {/* Brand Watermark */}
      {showBrandWatermark && (
        <div className="absolute bottom-3 right-3 font-bold text-xs px-2 py-1 tracking-wide bg-background/80 backdrop-blur-sm rounded text-primary border border-primary/20 shadow-lg select-none pointer-events-none">
          MinerHaolan
        </div>
      )}

      {/* Magnifying Glass Lens */}
      {isZooming && imageLoaded && (
        <div
          className="absolute pointer-events-none rounded-full border-4 border-primary/50 shadow-2xl overflow-hidden z-10"
          style={{
            width: lensSize,
            height: lensSize,
            left: cursorPosition.x - lensSize / 2,
            top: cursorPosition.y - lensSize / 2,
            background: `url(${src}) no-repeat`,
            backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
            backgroundPosition: `${position.x}% ${position.y}%`,
          }}
        >
          {/* Lens glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          
          {/* Lens crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-full h-px bg-primary/30" />
            <div className="absolute w-px h-full bg-primary/30" />
          </div>
        </div>
      )}

      {/* Subtle overlay to indicate zoom area */}
      {isZooming && (
        <div className="absolute inset-0 bg-black/5 pointer-events-none transition-opacity" />
      )}
    </div>
  );
};

export default ImageZoom;
