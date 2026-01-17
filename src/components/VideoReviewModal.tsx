import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';

interface VideoReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  videoId?: string;
}

// Map product names to YouTube video IDs (real mining hardware reviews)
// Sources: VoskCoin, Hobbyist Miner, Mining Chamber, Brandon Coin
const PRODUCT_VIDEO_MAP: Record<string, { videoId: string; channel: string }> = {
  'Antminer S21 Pro': { videoId: 'qD7qUKZ8g0M', channel: 'VoskCoin' },
  'Antminer S21 XP': { videoId: 'Fy-JnQU1_nM', channel: 'VoskCoin' },
  'Antminer S21': { videoId: 'qD7qUKZ8g0M', channel: 'VoskCoin' },
  'Antminer S19': { videoId: '0yWX6q8RQNQ', channel: 'Mining Chamber' },
  'Antminer L9': { videoId: '3xt8N9RSTRI', channel: 'VoskCoin' },
  'Antminer L7': { videoId: 'IbNXJEpSN7w', channel: 'VoskCoin' },
  'Antminer KS5': { videoId: 'RQz4cqZ0qsE', channel: 'Hobbyist Miner' },
  'IceRiver KS5': { videoId: 'RQz4cqZ0qsE', channel: 'Hobbyist Miner' },
  'IceRiver KS3': { videoId: 'pXvKcTifMw4', channel: 'Hobbyist Miner' },
  'IceRiver KS0': { videoId: 'S4HZBLPuN6c', channel: 'VoskCoin' },
  'Goldshell': { videoId: 'a6gPAJ2JZZA', channel: 'VoskCoin' },
  'Whatsminer': { videoId: 'N_hBKRxj8Os', channel: 'Mining Chamber' },
  'Avalon': { videoId: 'HbX8qKjYVJA', channel: 'Brandon Coin' },
  'BitAxe': { videoId: 'lHcmnxY1P_Q', channel: 'VoskCoin' },
};

const getVideoInfo = (productName: string): { videoId: string; channel: string } | null => {
  // Find a matching video ID
  for (const [key, info] of Object.entries(PRODUCT_VIDEO_MAP)) {
    if (productName.toLowerCase().includes(key.toLowerCase())) {
      return info;
    }
  }
  return null;
};

const VideoReviewModal = ({ isOpen, onClose, productName, videoId }: VideoReviewModalProps) => {
  const videoInfo = getVideoInfo(productName);
  const effectiveVideoId = videoId || videoInfo?.videoId;
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
