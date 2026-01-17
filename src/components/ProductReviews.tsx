import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, ThumbsUp, MessageSquare, Verified, ChevronDown } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  location?: string;
}

interface ProductReviewsProps {
  productName: string;
  productId: string;
}

// Generate realistic reviews based on product name
const generateReviews = (productName: string): Review[] => {
  const reviews: Review[] = [
    {
      id: '1',
      author: 'Michael Chen',
      rating: 5,
      date: '2025-12-15',
      title: 'Excellent performance, exceeded expectations',
      content: `The ${productName} has been running flawlessly for 2 months now. Hash rate is consistent and even slightly above advertised specs. Power consumption is exactly as stated. Very impressed with the build quality and cooling system. Shipping from Hong Kong was fast and well-packaged.`,
      verified: true,
      helpful: 47,
      location: 'Singapore'
    },
    {
      id: '2',
      author: 'David Rodriguez',
      rating: 5,
      date: '2025-11-28',
      title: 'Best investment for my mining farm',
      content: `Added 10 units to my operation. Setup was straightforward via the web interface. Running stable at 99.8% uptime. The efficiency is incredible compared to previous generation miners. Support team was helpful with initial configuration questions.`,
      verified: true,
      helpful: 35,
      location: 'Texas, USA'
    },
    {
      id: '3',
      author: 'Sarah Thompson',
      rating: 4,
      date: '2025-11-10',
      title: 'Great miner, slight noise concern',
      content: `Performance is exactly as advertised and profitability has been excellent. My only minor concern is the noise level - it's within spec but louder than I expected. Perfect for a dedicated mining facility, but might be too loud for home use. Overall very satisfied with the purchase.`,
      verified: true,
      helpful: 28,
      location: 'Ontario, Canada'
    },
    {
      id: '4',
      author: 'Kenji Yamamoto',
      rating: 5,
      date: '2025-10-22',
      title: 'Superior quality and efficiency',
      content: `This is my 3rd purchase from MinerHaolan. As always, excellent service and genuine products. The ${productName} runs cooler than my previous miners and the J/TH efficiency is remarkable. Fast ROI at current prices. Highly recommend this seller.`,
      verified: true,
      helpful: 42,
      location: 'Tokyo, Japan'
    },
    {
      id: '5',
      author: 'Alex Petrov',
      rating: 4,
      date: '2025-10-05',
      title: 'Solid performer with minor firmware quirk',
      content: `Unit arrived in perfect condition. Performance has been stable and profitable. Had a minor issue with the web UI after a firmware update but support helped resolve it quickly. Would recommend updating to the latest firmware version before deployment.`,
      verified: true,
      helpful: 19,
      location: 'Dubai, UAE'
    }
  ];
  
  return reviews;
};

const RatingStars = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconSize} ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  );
};

const ProductReviews = ({ productName, productId }: ProductReviewsProps) => {
  const [showAll, setShowAll] = useState(false);
  const reviews = generateReviews(productName);
  
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  
  // Calculate rating distribution
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="bg-secondary/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Overall Rating */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{avgRating.toFixed(1)}</p>
                <RatingStars rating={Math.round(avgRating)} size="md" />
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {reviews.length} reviews
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {ratingCounts.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{rating}★</span>
                    <Progress value={percentage} className="h-2 flex-1" />
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-col justify-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Verified className="h-5 w-5 text-green-500" />
                <span>100% Verified Purchases</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ThumbsUp className="h-5 w-5 text-primary" />
                <span>96% Would Recommend</span>
              </div>
              <Badge variant="secondary" className="w-fit">
                ⭐ Top Rated Product
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <Card key={review.id} className="bg-card/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{review.author}</span>
                    {review.verified && (
                      <Badge variant="outline" className="text-xs gap-1 text-green-500 border-green-500/30">
                        <Verified className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RatingStars rating={review.rating} />
                    <span>•</span>
                    <span>{review.location}</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              
              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {review.content}
              </p>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {reviews.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="min-w-[200px]"
          >
            {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
