import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyBuyButtonProps {
  productName: string;
  price: number;
  inStock: boolean;
  onAddToCart: (quantity: number) => void;
}

const StickyBuyButton = ({ productName, price, inStock, onAddToCart }: StickyBuyButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky button after scrolling past the main product section (about 600px)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
          <div className="bg-background/95 backdrop-blur-md border-t border-border p-4 shadow-2xl">
            <div className="container mx-auto flex items-center gap-3">
              {/* Price */}
              <div className="flex-shrink-0">
                <p className="text-lg font-bold text-primary">
                  ${price.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {productName}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="flex-1 h-11"
                onClick={() => onAddToCart(quantity)}
                disabled={!inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBuyButton;
