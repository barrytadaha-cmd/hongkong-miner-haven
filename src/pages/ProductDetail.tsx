import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
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
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <Layout>
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </main>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  const categoryName = product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <Layout>
      <Helmet>
        <title>{product.name} | MinerHoalan Hong Kong</title>
        <meta name="description" content={`Buy ${product.name} - ${product.hashrate} ${product.algorithm} miner with ${product.efficiency} efficiency. Fast shipping from Hong Kong.`} />
      </Helmet>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">
              {categoryName} Miners
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
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
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                    {product.location === 'hongkong' ? '🇭🇰 Hong Kong Stock' : '🌏 International'}
                  </Badge>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
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
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Brand */}
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              
              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-xl text-center">
                  <Cpu className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Algorithm</p>
                  <p className="font-semibold">{product.algorithm}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl text-center">
                  <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Hashrate</p>
                  <p className="font-semibold">{product.hashrate}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl text-center">
                  <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Power</p>
                  <p className="font-semibold">{product.power}</p>
                </div>
              </div>

              {/* Available Coins */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Available Coins</p>
                <div className="flex flex-wrap gap-2">
                  {product.coins.map((coin) => (
                    <Badge key={coin} variant="secondary">{coin}</Badge>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-display font-bold text-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.isSale && product.originalPrice && (
                  <Badge variant="destructive" className="ml-2">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.inStock ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-green-500 font-medium">In Stock - Ready to Ship</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-orange-500 font-medium">Pre-order Available</span>
                  </>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Warranty Included</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Package className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Secure Packaging</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="shipping" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Shipping & Delivery
              </TabsTrigger>
              <TabsTrigger 
                value="hosting" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Hosting Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <h3 className="text-xl font-semibold mt-6 mb-4 text-foreground">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Industry-leading {product.efficiency} energy efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Powerful {product.hashrate} hashrate for maximum profitability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Advanced thermal management with {product.specs.cooling}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Easy setup and management via web interface</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold mb-4">Mining Specifications</h3>
                  <div className="divide-y divide-border">
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Manufacturer</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Algorithm</span>
                      <span className="font-medium">{product.algorithm}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Hashrate</span>
                      <span className="font-medium">{product.hashrate}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Power Consumption</span>
                      <span className="font-medium">{product.power}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span className="font-medium">{product.efficiency}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold mb-4">Physical Specifications</h3>
                  <div className="divide-y divide-border">
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Package className="h-4 w-4" /> Dimensions
                      </span>
                      <span className="font-medium">{product.specs.dimensions}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium">{product.specs.weight}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Volume2 className="h-4 w-4" /> Noise Level
                      </span>
                      <span className="font-medium">{product.specs.noise}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Thermometer className="h-4 w-4" /> Operating Temp
                      </span>
                      <span className="font-medium">{product.specs.temperature}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Voltage
                      </span>
                      <span className="font-medium">{product.specs.voltage}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Wifi className="h-4 w-4" /> Interface
                      </span>
                      <span className="font-medium">{product.specs.interface}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      All orders are shipped from our warehouse in <strong className="text-foreground">Hong Kong</strong>. 
                      We use trusted carriers including DHL, FedEx, and UPS for international deliveries.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Asia Pacific: 3-5 business days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Europe: 7-10 business days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>North America: 7-14 business days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Rest of World: 10-21 business days</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customs & Import Duties</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Import duties and taxes may apply depending on your country. We provide full commercial 
                      invoices and can advise on customs requirements for your location.
                    </p>
                    <p>
                      For B2B orders, we can arrange DDP (Delivered Duty Paid) shipping where we handle all 
                      customs clearance and duties for a seamless delivery experience.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hosting" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hosting Services</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Don't have the infrastructure to run your miners? We partner with professional mining 
                      facilities across Asia offering competitive hosting rates.
                    </p>
                    <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                      <h4 className="font-semibold text-foreground">Hosting Benefits</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span>Electricity from $0.04/kWh</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span>24/7 security and monitoring</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-primary" />
                          <span>Optimal cooling infrastructure</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <span>Professional maintenance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hosting Locations</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="space-y-3">
                      <div className="p-3 border border-border rounded-lg">
                        <p className="font-medium text-foreground">Kazakhstan</p>
                        <p className="text-sm">$0.04/kWh • 100MW+ capacity</p>
                      </div>
                      <div className="p-3 border border-border rounded-lg">
                        <p className="font-medium text-foreground">Malaysia</p>
                        <p className="text-sm">$0.05/kWh • 50MW capacity</p>
                      </div>
                      <div className="p-3 border border-border rounded-lg">
                        <p className="font-medium text-foreground">Paraguay</p>
                        <p className="text-sm">$0.035/kWh • Hydroelectric power</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/contact">Contact Us for Hosting Quote</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold mb-8">Related Products</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default ProductDetail;
