import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Play,
  Maximize2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MegaGalleryProps {
  images: string[];
  productName: string;
  brand?: string;
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  location?: string;
  onWatchReview?: () => void;
  hasVideo?: boolean;
}

const MegaGallery = ({
  images,
  productName,
  brand,
  isNew,
  isSale,
  inStock = true,
  location,
  onWatchReview,
  hasVideo = false
}: MegaGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const currentImage = images[selectedIndex] || '/placeholder.svg';

  // Scroll thumbnail into view when selected
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[selectedIndex] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedIndex]);

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newLevel = Math.max(prev - 0.5, 1);
      if (newLevel === 1) {
        setIsZoomed(false);
        setPanPosition({ x: 0, y: 0 });
      }
      return newLevel;
    });
  };

  const handleImageClick = () => {
    if (zoomLevel === 1) {
      setIsLightboxOpen(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel === 1) return;
    
    setPanPosition((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'Escape') setIsLightboxOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handlePrevious, handleNext]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Stage */}
      <div 
        ref={imageRef}
        className="relative aspect-square rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-br from-muted/80 to-muted group"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Main Image */}
        <motion.div
          className={cn(
            "w-full h-full",
            zoomLevel > 1 ? "cursor-grab" : "cursor-zoom-in",
            isDragging && zoomLevel > 1 && "cursor-grabbing"
          )}
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`
          }}
          onClick={handleImageClick}
        >
          <img
            src={currentImage}
            alt={`${productName} - View ${selectedIndex + 1}`}
            className="w-full h-full object-contain"
            draggable={false}
          />
        </motion.div>

        {/* Brand Watermark */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
          <div className="font-bold text-xs sm:text-sm px-2 py-1 tracking-wide bg-background/80 backdrop-blur-sm rounded text-primary border border-primary/20 select-none">
            MinerHaolan
          </div>
        </div>

        {/* Top Left Badges */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1.5 sm:gap-2 z-10">
          {isNew && (
            <Badge className="bg-primary text-primary-foreground text-xs font-semibold">New</Badge>
          )}
          {isSale && (
            <Badge variant="destructive" className="text-xs font-semibold">Sale</Badge>
          )}
          {!inStock && (
            <Badge variant="secondary" className="bg-muted-foreground/80 text-xs">Pre-Order</Badge>
          )}
        </div>

        {/* Top Right Location Badge */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-xs">
            {location === 'hongkong' ? '🇭🇰 HK Stock' : '🌏 International'}
          </Badge>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            disabled={zoomLevel === 1}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            disabled={zoomLevel >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:hidden bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div 
        ref={thumbnailsRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
      >
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedIndex(idx);
              setZoomLevel(1);
              setPanPosition({ x: 0, y: 0 });
            }}
            className={cn(
              "relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
              selectedIndex === idx 
                ? "border-primary ring-2 ring-primary/30 scale-105" 
                : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
            )}
          >
            <img
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Thumbnail overlay for active state */}
            {selectedIndex === idx && (
              <motion.div 
                layoutId="thumbnail-highlight"
                className="absolute inset-0 border-2 border-primary rounded-lg"
              />
            )}
          </button>
        ))}
        
        {/* Video Thumbnail (if available) */}
        {hasVideo && onWatchReview && (
          <button
            onClick={onWatchReview}
            className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-red-500/50 hover:border-red-500 transition-all bg-gradient-to-br from-red-950 to-background flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-red-500/10" />
            <Play className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" />
            <span className="absolute bottom-1 left-1 right-1 text-[8px] font-semibold text-red-400">VIDEO</span>
          </button>
        )}
      </div>

      {/* Watch Review Button */}
      {onWatchReview && (
        <Button
          variant="outline"
          className="w-full border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-foreground"
          onClick={onWatchReview}
        >
          <Play className="h-4 w-4 mr-2 text-red-500" fill="currentColor" />
          Watch Expert Review
        </Button>
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 text-white hover:bg-white/10"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main Lightbox Image */}
            <motion.img
              key={selectedIndex}
              src={currentImage}
              alt={productName}
              className="max-w-full max-h-[85vh] object-contain"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Strip in Lightbox */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] p-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(idx);
                  }}
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all",
                    selectedIndex === idx 
                      ? "border-primary opacity-100" 
                      : "border-white/20 opacity-50 hover:opacity-80"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaGallery;