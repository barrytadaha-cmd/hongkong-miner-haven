import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDBProduct, useDBProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import ImageLightbox from '@/components/ImageLightbox';
import ImageZoom from '@/components/ImageZoom';
import ProductDetailSkeleton from '@/components/ProductDetailSkeleton';
import ProfitabilityCalculator from '@/components/ProfitabilityCalculator';
import VideoReviewModal from '@/components/VideoReviewModal';
import ProductReviews from '@/components/ProductReviews';
import StickyBuyButton from '@/components/StickyBuyButton';
import ProductCard from '@/components/ProductCard';
import { 
  ShoppingCart, 
  ChevronRight, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  Zap,
  Cpu,
  TrendingUp,
  Thermometer,
  Volume2,
  Package,
  Wifi,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Fetch product from database
  const { data: product, isLoading, error } = useDBProduct(id || '');
  
  // Fetch all products for related section
  const { data: allProducts } = useDBProducts();

  // Get related products based on algorithm or category
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter(p => 
        p.id !== product.id && 
        (p.algorithm === product.algorithm || p.category === product.category)
      )
      .slice(0, 4);
  }, [product, allProducts]);

  if (isLoading) {
    return (
      <Layout>
        <ProductDetailSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Error Loading Product</h1>
            <p className="text-muted-foreground mb-8">There was an error loading this product.</p>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </main>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </main>
      </Layout>
    );
  }

  const handleAddToCart = (qty?: number) => {
    const addQty = qty || quantity;
    for (let i = 0; i < addQty; i++) {
      addItem(product);
    }
    toast.success(`${addQty}x ${product.name} added to cart`);
  };

  const categoryName = product.category.charAt(0).toUpperCase() + product.category.slice(1);

  // JSON-LD Product Schema for SEO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description || `${product.name} - ${product.hashrate} ${product.algorithm} miner with ${product.efficiency} efficiency.`,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "sku": product.id,
    "mpn": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://minerhaolan.lovable.app/product/${product.id}`,
      "priceCurrency": "USD",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "seller": {
        "@type": "Organization",
        "name": "MinerHaolan"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "5"
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{product.name} | MinerHaolan Hong Kong</title>
        <meta name="description" content={`Buy ${product.name} - ${product.hashrate} ${product.algorithm} miner with ${product.efficiency} efficiency. Fast shipping from Hong Kong.`} />
        <meta property="og:title" content={`${product.name} | MinerHaolan`} />
        <meta property="og:description" content={`${product.hashrate} ${product.algorithm} miner - $${product.price.toLocaleString()}`} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="USD" />
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>

      <main className="pt-20 pb-12 lg:pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb - scrollable on mobile */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-8 overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
            <Link to="/" className="hover:text-primary transition-colors flex-shrink-0">Home</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <Link to="/shop" className="hover:text-primary transition-colors flex-shrink-0">Shop</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors flex-shrink-0">
              {categoryName}
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-foreground truncate max-w-[150px] sm:max-w-none">{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 mb-12 lg:mb-16">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image with Magnifying Glass Zoom */}
              <div 
                className="relative aspect-square rounded-xl lg:rounded-2xl overflow-hidden bg-muted cursor-zoom-in group"
                onClick={() => setLightboxOpen(true)}
              >
                <ImageZoom
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full"
                  zoomLevel={2.5}
                  lensSize={120}
                  showBrandWatermark={true}
                />
                
                {/* Badges */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1.5 sm:gap-2 z-10">
                  {product.isNew && (
                    <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>
                  )}
                  {product.isSale && (
                    <Badge variant="destructive" className="text-xs">Sale</Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="secondary" className="bg-muted-foreground/80 text-xs">Sold Out</Badge>
                  )}
                </div>

                {/* Location Badge */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
                  <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-xs">
                    {product.location === 'hongkong' ? '🇭🇰 HK Stock' : '🌏 International'}
                  </Badge>
                </div>
              </div>

              {/* Thumbnails - horizontal scroll on mobile */}
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Thumbnail watermark */}
                    <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 font-bold text-[6px] sm:text-[8px] px-0.5 sm:px-1 py-0.5 tracking-wide bg-background/80 backdrop-blur-sm rounded text-primary border border-primary/20 select-none pointer-events-none">
                      MH
                    </div>
                  </button>
                ))}
              </div>

              {/* Lightbox */}
              <ImageLightbox
                images={product.images}
                initialIndex={selectedImage}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                alt={product.name}
              />

              {/* Watch Review Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setVideoModalOpen(true)}
              >
                <Play className="h-4 w-4 mr-2 text-red-500" />
                Watch Expert Review
              </Button>

              {/* Video Modal */}
              <VideoReviewModal
                isOpen={videoModalOpen}
                onClose={() => setVideoModalOpen(false)}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-5">
              {/* Brand */}
              <p className="text-xs sm:text-sm text-muted-foreground">{product.brand}</p>
              
              {/* Title */}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">{product.name}</h1>

              {/* Quick Specs - responsive grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="p-2.5 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl text-center">
                  <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Algorithm</p>
                  <p className="font-semibold text-xs sm:text-sm truncate">{product.algorithm}</p>
                </div>
                <div className="p-2.5 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl text-center">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Hashrate</p>
                  <p className="font-semibold text-xs sm:text-sm truncate">{product.hashrate}</p>
                </div>
                <div className="p-2.5 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl text-center">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Power</p>
                  <p className="font-semibold text-xs sm:text-sm truncate">{product.power}</p>
                </div>
              </div>

              {/* Available Coins */}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Available Coins</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.coins.map((coin) => (
                    <Badge key={coin} variant="secondary" className="text-xs">{coin}</Badge>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-base sm:text-lg lg:text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.isSale && product.originalPrice && (
                  <Badge variant="destructive" className="ml-1 sm:ml-2 text-xs">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    <span className="text-green-500 font-medium text-sm sm:text-base">In Stock - Ready to Ship</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-orange-500 font-medium text-sm sm:text-base">Pre-order Available</span>
                  </>
                )}
              </div>

              {/* Quantity & Add to Cart - stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex items-center justify-center sm:justify-start border border-border rounded-lg w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-11 sm:w-11"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-11 sm:w-11"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
                  onClick={() => handleAddToCart()}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg sm:rounded-xl">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-1" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-1" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-1" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Secure Pack</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mb-12 lg:mb-16">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap -mx-4 px-4 lg:mx-0 lg:px-0">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                Specs
              </TabsTrigger>
              <TabsTrigger 
                value="shipping" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                Shipping
              </TabsTrigger>
              <TabsTrigger 
                value="hosting" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                Hosting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-5 sm:mt-8">
              <div className="prose prose-invert max-w-none">
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold mt-4 sm:mt-6 mb-3 sm:mb-4 text-foreground">Key Features</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground text-sm sm:text-base">Industry-leading {product.efficiency} energy efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground text-sm sm:text-base">Powerful {product.hashrate} hashrate for maximum profitability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground text-sm sm:text-base">Advanced thermal management with {product.specs.cooling}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground text-sm sm:text-base">Easy setup and management via web interface</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-5 sm:mt-8">
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Mining Specifications</h3>
                  <div className="divide-y divide-border text-sm sm:text-base">
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground">Manufacturer</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium truncate ml-4 max-w-[150px] sm:max-w-none">{product.name}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground">Algorithm</span>
                      <span className="font-medium">{product.algorithm}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground">Hashrate</span>
                      <span className="font-medium">{product.hashrate}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground">Power</span>
                      <span className="font-medium">{product.power}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span className="font-medium">{product.efficiency}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Physical Specifications</h3>
                  <div className="divide-y divide-border text-sm sm:text-base">
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                        <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Dimensions
                      </span>
                      <span className="font-medium text-right max-w-[120px] sm:max-w-none">{product.specs.dimensions}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium">{product.specs.weight}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                        <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Noise
                      </span>
                      <span className="font-medium">{product.specs.noise}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                        <Thermometer className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Temp
                      </span>
                      <span className="font-medium">{product.specs.temperature}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                        <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Voltage
                      </span>
                      <span className="font-medium">{product.specs.voltage}</span>
                    </div>
                    <div className="flex justify-between py-2.5 sm:py-3">
                      <span className="text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                        <Wifi className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Interface
                      </span>
                      <span className="font-medium">{product.specs.interface}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-5 sm:mt-8">
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Shipping Information</h3>
                  <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
                    <p>
                      All orders are shipped from our warehouse in <strong className="text-foreground">Hong Kong</strong>. 
                      We use trusted carriers including DHL, FedEx, and UPS.
                    </p>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span>Asia Pacific: 3-5 days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span>Europe: 7-10 days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span>North America: 7-14 days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span>Rest of World: 10-21 days</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Customs & Import Duties</h3>
                  <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
                    <p>
                      Import duties and taxes may apply depending on your country. We provide full commercial 
                      invoices and can advise on customs requirements.
                    </p>
                    <p>
                      For B2B orders, we can arrange DDP (Delivered Duty Paid) shipping for seamless delivery.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hosting" className="mt-5 sm:mt-8">
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Hosting Services</h3>
                  <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
                    <p>
                      Don't have the infrastructure to run your miners? We partner with professional mining 
                      facilities across Asia offering competitive hosting rates.
                    </p>
                    <div className="p-3 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl space-y-2 sm:space-y-3">
                      <h4 className="font-semibold text-foreground text-sm sm:text-base">Hosting Benefits</h4>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <span>Electricity from $0.04/kWh</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <span>24/7 security and monitoring</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <span>Optimal cooling infrastructure</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <span>Professional maintenance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Hosting Locations</h3>
                  <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="p-2.5 sm:p-3 border border-border rounded-lg">
                        <p className="font-medium text-foreground">Kazakhstan</p>
                        <p className="text-xs sm:text-sm">$0.04/kWh • 100MW+ capacity</p>
                      </div>
                      <div className="p-2.5 sm:p-3 border border-border rounded-lg">
                        <p className="font-medium text-foreground">Malaysia</p>
                        <p className="text-xs sm:text-sm">$0.05/kWh • 50MW capacity</p>
                      </div>
                      <div className="p-2.5 sm:p-3 border border-border rounded-lg">
                        <p className="font-medium text-foreground">Paraguay</p>
                        <p className="text-xs sm:text-sm">$0.035/kWh • Hydroelectric</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full text-sm" asChild>
                      <Link to="/contact">Contact for Hosting Quote</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Profitability Calculator */}
          <section className="mb-12 lg:mb-16">
            <ProfitabilityCalculator
              hashrate={product.hashrate}
              power={product.power}
              algorithm={product.algorithm}
              productName={product.name}
            />
          </section>

          {/* Customer Reviews */}
          <section className="mb-12 lg:mb-16">
            <ProductReviews productName={product.name} productId={product.id} />
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mb-24 lg:mb-16">
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-8">Related Products</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Sticky Buy Button for Mobile */}
      <StickyBuyButton
        productName={product.name}
        price={product.price}
        inStock={product.inStock}
        onAddToCart={handleAddToCart}
      />
    </Layout>
  );
};

export default ProductDetail;
