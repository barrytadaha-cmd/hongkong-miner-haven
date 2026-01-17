import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';

interface VideoReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  videoId?: string;
}

// Map product names to YouTube video IDs (popular reviews)
const PRODUCT_VIDEO_MAP: Record<string, string> = {
  'Antminer S21 Pro': 'dQw4w9WgXcQ', // Replace with actual video IDs
  'Antminer S21': 'dQw4w9WgXcQ',
  'Antminer S21 XP Hyd': 'dQw4w9WgXcQ',
  'Antminer L9': 'dQw4w9WgXcQ',
  'IceRiver KS5M': 'dQw4w9WgXcQ',
  'IceRiver KS0 Ultra': 'dQw4w9WgXcQ',
  'Antminer X9': 'dQw4w9WgXcQ',
};

const getVideoId = (productName: string): string | null => {
  // Find a matching video ID
  for (const [key, videoId] of Object.entries(PRODUCT_VIDEO_MAP)) {
    if (productName.toLowerCase().includes(key.toLowerCase())) {
      return videoId;
    }
  }
  return null;
};

const VideoReviewModal = ({ isOpen, onClose, productName, videoId }: VideoReviewModalProps) => {
  const effectiveVideoId = videoId || getVideoId(productName);
  const searchQuery = encodeURIComponent(`${productName} review`);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-background">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-red-500" />
            {productName} Review
          </DialogTitle>
        </DialogHeader>
        
        <div className="aspect-video bg-black/90 flex items-center justify-center">
          {effectiveVideoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${effectiveVideoId}?autoplay=1`}
              title={`${productName} Review`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="text-center p-8">
              <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No embedded video available for this product yet.
              </p>
              <Button asChild variant="outline">
                <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Search YouTube for Reviews
                </a>
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Watch expert reviews and unboxing videos
          </p>
          <Button variant="ghost" size="sm" asChild>
            <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer">
              More Reviews <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoReviewModal;
