import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Plus, Zap, Cpu, GitCompare } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/compare?product=${product.id}`);
    toast.success(`${product.name} added to comparison`);
  };

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback image for broken links
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMjAyMDIwIi8+CjxyZWN0IHg9IjEzMCIgeT0iMTMwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgcng9IjIwIiBmaWxsPSIjMzAzMDMwIi8+Cjwvc3ZnPg==';

  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 card-hover">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 p-6">
          {/* Background Glow on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500" />
          
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-secondary animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
          )}
          
          <img
            src={imageError ? fallbackImage : product.image}
            alt={product.name}
            className={cn(
              "object-contain w-full h-full transition-all duration-700 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground shadow-lg">New</Badge>
            )}
            {product.isSale && discount > 0 && (
              <Badge className="bg-gradient-to-r from-accent to-yellow-500 text-white shadow-lg">
                -{discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="bg-muted-foreground/90 text-background">Sold Out</Badge>
            )}
          </div>

          {/* Quick Add Button */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-primary/90 hover:bg-primary shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart();
                  }}
                  disabled={!product.inStock}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add to cart</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-xl shadow-lg"
                  onClick={handleCompare}
                >
                  <GitCompare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Compare</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Link>

      <CardContent className="p-5">
        {/* Brand */}
        <p className="text-xs font-medium text-primary mb-1">{product.brand}</p>
        
        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-base mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[48px]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Specs */}
        <div className="space-y-2 text-sm border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5" />
              Algorithm
            </span>
            <span className="font-medium text-xs bg-secondary px-2 py-0.5 rounded">{product.algorithm}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Hashrate
            </span>
            <span className="font-semibold text-primary">{product.hashrate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Power</span>
            <span className="font-medium">{product.power}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full mt-4 h-11 btn-shine"
          variant={product.inStock ? "default" : "secondary"}
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;