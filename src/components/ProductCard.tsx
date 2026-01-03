import { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Zap, Cpu, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Card className="group overflow-hidden hover-lift bg-card border-border/50 hover:border-primary/30 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground">New</Badge>
          )}
          {product.isSale && (
            <Badge variant="destructive">Sale</Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="bg-muted-foreground/80">Sold Out</Badge>
          )}
        </div>

        {/* Location Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
            {product.location === 'hongkong' ? '🇭🇰 HK Stock' : '🌏 Intl'}
          </Badge>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Brand */}
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        
        {/* Name */}
        <h3 className="font-display font-semibold text-lg mb-3 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
            <Cpu className="h-3 w-3 text-primary mb-1" />
            <span className="text-[10px] text-muted-foreground">{product.algorithm}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
            <TrendingUp className="h-3 w-3 text-primary mb-1" />
            <span className="text-[10px] text-muted-foreground">{product.hashrate}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
            <Zap className="h-3 w-3 text-primary mb-1" />
            <span className="text-[10px] text-muted-foreground">{product.power}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-display font-bold text-primary">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
