import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { products as staticProducts } from '@/lib/data';
import { useDBProducts, useHasDBProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MinerVisualizer from '@/components/MinerVisualizer';
import Layout from '@/components/Layout';
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
  Calculator,
  MessageSquare,
  DollarSign,
  Clock,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Scroll-triggered section component
function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Spec Card with animation
function SpecCard({ icon: Icon, label, value, delay = 0 }: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 hover:border-primary/30 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon className="h-8 w-8 text-primary mb-4" />
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-display font-bold">{value}</p>
    </motion.div>
  );
}

// Profitability Calculator
function ProfitabilityCalculator({ hashrate, power, price }: { hashrate: string; power: string; price: number }) {
  const [electricityCost, setElectricityCost] = useState(0.08);
  const [btcPrice, setBtcPrice] = useState(100000);
  
  // Parse hashrate (simplified calculation)
  const hashrateNum = parseFloat(hashrate.replace(/[^0-9.]/g, '')) || 0;
  const powerNum = parseFloat(power.replace(/[^0-9.]/g, '')) || 0;
  
  // Simplified profitability estimate (this would use real data in production)
  const dailyBTC = hashrateNum * 0.00000001; // Simplified
  const dailyRevenue = dailyBTC * btcPrice;
  const dailyPowerCost = (powerNum / 1000) * 24 * electricityCost;
  const dailyProfit = dailyRevenue - dailyPowerCost;
  const monthlyProfit = dailyProfit * 30;
  const roiDays = dailyProfit > 0 ? Math.ceil(price / dailyProfit) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="electricity">Electricity Cost ($/kWh)</Label>
          <Input
            id="electricity"
            type="number"
            step="0.01"
            value={electricityCost}
            onChange={(e) => setElectricityCost(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="btcprice">BTC Price ($)</Label>
          <Input
            id="btcprice"
            type="number"
            value={btcPrice}
            onChange={(e) => setBtcPrice(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground mb-1">Daily Profit</p>
          <p className={`text-xl font-bold ${dailyProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${dailyProfit.toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground mb-1">Monthly Profit</p>
          <p className={`text-xl font-bold ${monthlyProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${monthlyProfit.toFixed(0)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground mb-1">ROI</p>
          <p className="text-xl font-bold text-primary">
            {roiDays > 0 ? `${roiDays} days` : 'N/A'}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        * Estimates based on current difficulty. Actual results may vary.
      </p>
    </div>
  );
}

export default function ProductDetailApple() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const { data: hasDBProducts } = useHasDBProducts();
  const { data: dbProducts } = useDBProducts();
  const products = hasDBProducts && dbProducts?.length ? dbProducts : staticProducts;

  const product = products.find(p => p.id === id);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product, products]);

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

  // JSON-LD Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": { "@type": "Brand", "name": product.brand },
    "image": product.images[0],
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "MinerHaolan" }
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{product.name} | MinerHaolan Hong Kong</title>
        <meta name="description" content={`Buy ${product.name} - ${product.hashrate} ${product.algorithm} miner. ${product.efficiency} efficiency. Fast Hong Kong shipping.`} />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>

      {/* Hero Section - Sticky 3D Model */}
      <section ref={heroRef} className="relative min-h-screen">
        {/* Sticky 3D Visualizer */}
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="absolute inset-0"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            
            {/* 3D Model */}
            <div className="absolute inset-0 pt-20">
              <MinerVisualizer />
            </div>
          </motion.div>

          {/* Floating Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-center"
          >
            <Badge variant="outline" className="mb-4">
              {product.brand}
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              {product.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {product.hashrate} • {product.algorithm}
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-muted-foreground"
            >
              <ChevronRight className="h-6 w-6 rotate-90 mx-auto" />
              <span className="text-sm">Scroll to explore</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll spacer */}
        <div className="h-[50vh]" />
      </section>

      {/* Key Specs Section */}
      <section className="py-24 relative z-10 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-4">
              Built for Performance
            </h2>
            <p className="text-muted-foreground text-center text-xl mb-16 max-w-2xl mx-auto">
              Industry-leading specifications designed for maximum profitability
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <SpecCard icon={TrendingUp} label="Hashrate" value={product.hashrate} delay={0} />
            <SpecCard icon={Zap} label="Power" value={product.power} delay={0.1} />
            <SpecCard icon={Cpu} label="Algorithm" value={product.algorithm} delay={0.2} />
            <SpecCard icon={Award} label="Efficiency" value={product.efficiency} delay={0.3} />
          </div>
        </div>
      </section>

      {/* Visual Feature Reveals */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Feature 1 */}
          <ScrollReveal className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Efficiency</Badge>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-6">
                {product.efficiency} Efficiency
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Industry-leading power efficiency means lower operating costs and higher profit margins. 
                Every joule counts when mining at scale.
              </p>
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground">Monthly Savings</p>
                  <p className="text-2xl font-bold text-green-500">Up to $200+</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 backdrop-blur">
                  <span className="text-sm text-muted-foreground">Power Consumption</span>
                  <span className="font-bold">{product.power}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Feature 2 */}
          <ScrollReveal className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 lg:order-1 relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-7xl font-display font-bold text-accent mb-2">{product.hashrate}</p>
                  <p className="text-muted-foreground">Raw Hashing Power</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">Performance</Badge>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Unmatched Hashrate
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Deliver {product.hashrate} of pure computational power to the network. 
                More hashrate means more blocks solved and more rewards earned.
              </p>
              <div className="flex flex-wrap gap-2">
                {product.coins.map(coin => (
                  <Badge key={coin} variant="secondary">{coin}</Badge>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Feature 3 - Cooling */}
          <ScrollReveal className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20">Cooling</Badge>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Advanced Thermal Management
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                {product.specs.cooling} system maintains optimal operating temperature 
                for sustained performance and extended hardware lifespan.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <Thermometer className="h-5 w-5 text-blue-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Operating Temp</p>
                  <p className="font-semibold">{product.specs.temperature}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <Volume2 className="h-5 w-5 text-blue-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Noise Level</p>
                  <p className="font-semibold">{product.specs.noise}</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-500/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-40 h-40 rounded-full border-4 border-blue-500/30 border-t-blue-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">❄️</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Profitability Calculator */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center mb-12">
              <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Profitability Calculator
              </h2>
              <p className="text-muted-foreground">
                Estimate your potential returns based on current market conditions
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-background rounded-2xl p-8 border border-border">
              <ProfitabilityCalculator
                hashrate={product.hashrate}
                power={product.power}
                price={product.price}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Purchase Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Product Image */}
                <div className="aspect-square rounded-3xl overflow-hidden bg-muted/50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Purchase Options */}
                <div className="space-y-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    <h2 className="font-display text-3xl font-bold mb-4">{product.name}</h2>
                    
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-4xl font-display font-bold text-primary">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xl text-muted-foreground line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
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
                          <Clock className="h-5 w-5 text-orange-500" />
                          <span className="text-orange-500 font-medium">Pre-order Available</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center border border-border rounded-xl p-1 w-fit">
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

                    <div className="flex flex-col gap-3">
                      <Button
                        size="lg"
                        className="w-full h-14 text-lg"
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>

                      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
                        <DialogTrigger asChild>
                          <Button size="lg" variant="outline" className="w-full h-14 text-lg">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Request Quote
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request a Quote</DialogTitle>
                            <DialogDescription>
                              Get a custom quote for bulk orders or special requirements.
                            </DialogDescription>
                          </DialogHeader>
                          <form className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="quote-email">Email</Label>
                              <Input id="quote-email" type="email" placeholder="your@email.com" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quote-quantity">Quantity Needed</Label>
                              <Input id="quote-quantity" type="number" placeholder="10" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quote-message">Additional Notes</Label>
                              <Textarea id="quote-message" placeholder="Any special requirements..." />
                            </div>
                            <Button type="submit" className="w-full">Submit Request</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                    <div className="text-center">
                      <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Fast Shipping</p>
                    </div>
                    <div className="text-center">
                      <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">180 Day Warranty</p>
                    </div>
                    <div className="text-center">
                      <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Secure Packaging</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Detailed Specs */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-center mb-12">
              Full Specifications
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  Mining Specifications
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Manufacturer', value: product.brand },
                    { label: 'Model', value: product.name },
                    { label: 'Algorithm', value: product.algorithm },
                    { label: 'Hashrate', value: product.hashrate },
                    { label: 'Power Consumption', value: product.power },
                    { label: 'Efficiency', value: product.efficiency }
                  ].map((spec) => (
                    <div key={spec.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Physical Specifications
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Dimensions', value: product.specs.dimensions },
                    { label: 'Weight', value: product.specs.weight },
                    { label: 'Noise Level', value: product.specs.noise },
                    { label: 'Operating Temp', value: product.specs.temperature },
                    { label: 'Voltage', value: product.specs.voltage },
                    { label: 'Interface', value: product.specs.interface }
                  ].map((spec) => (
                    <div key={spec.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="font-display text-3xl font-bold text-center mb-12">
                You May Also Like
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </Layout>
  );
}
