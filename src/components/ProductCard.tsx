import { Link } from 'react-router-dom';
import { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Plus } from 'lucide-react';
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
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary p-4">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground">New</Badge>
            )}
            {product.isSale && (
              <Badge className="bg-accent text-accent-foreground">On Sale</Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="bg-muted-foreground text-background">Sold Out</Badge>
            )}
          </div>

          {/* Quick Add Button */}
          <Button
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            disabled={!product.inStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-base mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[48px]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Specs */}
        <div className="space-y-2 text-sm border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Algorithm</span>
            <span className="font-medium">{product.algorithm}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hashrate</span>
            <span className="font-medium">{product.hashrate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Power</span>
            <span className="font-medium">{product.power}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full mt-4"
          variant="outline"
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