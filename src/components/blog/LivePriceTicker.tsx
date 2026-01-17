import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Package, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LivePriceTickerProps {
  productName: string;
  productSlug?: string;
  className?: string;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: string | null;
  hashrate: string | null;
}

const LivePriceTicker = ({ productName, productSlug, className = '' }: LivePriceTickerProps) => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, stock, hashrate')
          .ilike('name', `%${productName}%`)
          .limit(1)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productName]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-muted/50 rounded-lg p-4 my-6 ${className}`}>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </div>
    );
  }

  if (!product) return null;

  const isInStock = product.stock === 'in-stock';
  const searchQuery = encodeURIComponent(product.name.toLowerCase());

  return (
    <div className={`bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-4 md:p-6 my-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Current Market Price</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-foreground">
                ${product.price.toLocaleString()}
              </span>
              <Badge 
                variant={isInStock ? "default" : "secondary"}
                className={isInStock ? "bg-green-500/20 text-green-600 border-green-500/30" : ""}
              >
                <Package className="h-3 w-3 mr-1" />
                {isInStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
            {product.hashrate && (
              <p className="text-xs text-muted-foreground mt-1">
                {product.name} • {product.hashrate}
              </p>
            )}
          </div>
        </div>
        
        <Link to={productSlug ? `/shop/${productSlug}` : `/shop?search=${searchQuery}`}>
          <Button size="sm" className="group">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LivePriceTicker;
