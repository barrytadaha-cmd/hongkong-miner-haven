import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Package, ArrowRight, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StickySidebarProps {
  productName: string;
  className?: string;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  stock: string | null;
  hashrate: string | null;
  power: string | null;
  efficiency: string | null;
  brand: string | null;
}

interface ProductImage {
  image_url: string;
  is_primary: boolean | null;
}

const StickySidebar = ({ productName, className = '' }: StickySidebarProps) => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [image, setImage] = useState<string>('/placeholder.svg');
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('id, name, price, original_price, stock, hashrate, power, efficiency, brand')
          .ilike('name', `%${productName}%`)
          .limit(1)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // Fetch primary image
        if (productData) {
          const { data: imageData } = await supabase
            .from('product_images')
            .select('image_url, is_primary')
            .eq('product_id', productData.id)
            .order('is_primary', { ascending: false })
            .limit(1)
            .single();

          if (imageData) {
            setImage(imageData.image_url);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productName]);

  useEffect(() => {
    const handleScroll = () => {
      // Show sidebar after scrolling 400px
      setIsVisible(window.scrollY > 400 && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (loading || !product || isDismissed) return null;

  const isInStock = product.stock === 'in-stock';
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : 0;
  const searchQuery = encodeURIComponent(product.name.toLowerCase());

  return (
    <div 
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 hidden lg:block ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${className}`}
    >
      <Card className="w-72 shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 p-1 bg-muted rounded-full hover:bg-muted/80 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
        
        <CardContent className="p-4">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {hasDiscount && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                -{discountPercent}%
              </Badge>
            )}
            {isInStock && (
              <Badge className="absolute top-2 right-2 bg-green-500/90 text-white text-xs">
                <Package className="h-3 w-3 mr-1" />
                In Stock
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              <h4 className="font-semibold text-sm leading-tight">{product.name}</h4>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {product.hashrate && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Zap className="h-3 w-3 text-primary" />
                  {product.hashrate}
                </div>
              )}
              {product.power && (
                <div className="text-muted-foreground">
                  ⚡ {product.power}
                </div>
              )}
              {product.efficiency && (
                <div className="col-span-2 text-muted-foreground">
                  Efficiency: {product.efficiency}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="pt-2 border-t">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.original_price!.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <Link to={`/shop?search=${searchQuery}`} className="block">
              <Button className="w-full group" size="sm">
                View Product
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StickySidebar;
