import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';
import heroMobileBg from '@/assets/hero-mobile-bg.webp';
import { products as staticProducts } from '@/lib/data';
import { useDBProducts, useHasDBProducts } from '@/hooks/useProducts';

// Generate random particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.2,
  }));
};

const FloatingParticles = () => {
  const particles = useMemo(() => generateParticles(30), []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Glowing accent particles */}
      {particles.slice(0, 10).map((particle) => (
        <motion.div
          key={`glow-${particle.id}`}
          className="absolute rounded-full bg-accent/60 blur-sm"
          style={{
            left: `${(particle.x + 30) % 100}%`,
            top: `${(particle.y + 20) % 100}%`,
            width: particle.size * 2,
            height: particle.size * 2,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration * 1.2,
            repeat: Infinity,
            delay: particle.delay + 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Check if database has products
  const { data: hasDBProducts } = useHasDBProducts();
  const { data: dbProducts } = useDBProducts();
  
  // Use database products if available, otherwise fall back to static
  const products = hasDBProducts && dbProducts?.length ? dbProducts : staticProducts;
  
  // Get featured products (with sale or new badge preferred)
  const featuredProducts = useMemo(() => {
    const featured = products.filter(p => p.isSale || p.isNew);
    return featured.length > 0 ? featured.slice(0, 5) : products.slice(0, 5);
  }, [products]);
  
  // Rotate products every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);
  
  const featuredProduct = featuredProducts[currentIndex];
  
  const discount = featuredProduct.originalPrice 
    ? Math.round((1 - featuredProduct.price / featuredProduct.originalPrice) * 100) 
    : 0;
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);

  return (
    <section ref={sectionRef} className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Mobile Background Video/Animation with 3D Parallax Effect */}
      <div className="absolute inset-0 lg:hidden" style={{ perspective: '1000px' }}>
        <motion.div
          className="absolute inset-0"
          style={{ 
            y: backgroundY,
            scale: backgroundScale,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
          }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ 
              rotateX: [5, 3, 5],
              z: [0, 20, 0],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <img 
              src={heroMobileBg} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
        {/* Animated glow overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
      </div>

      {/* Desktop Background with Parallax and 3D Effect */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block" style={{ perspective: '1000px' }}>
        <motion.div
          className="absolute inset-0"
          style={{ 
            y: backgroundY,
            scale: backgroundScale,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Animated background image for desktop */}
          <motion.div
            className="absolute inset-0"
            animate={{ 
              rotateX: [2, 0, 2],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <img 
              src={heroMobileBg} 
              alt="" 
              className="w-full h-full object-cover opacity-40"
            />
          </motion.div>
        </motion.div>
        
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/40" />
      </div>
      
      {/* Floating Particles - Both Mobile and Desktop */}
      <FloatingParticles />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-white">
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Best Prices Guaranteed</span>
            </motion.div>

            {/* Brand Name with 3D Effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] mb-4"
                style={{ 
                  textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)',
                  perspective: '1000px',
                }}
              >
                <motion.span 
                  className="block text-gradient-gold"
                  animate={{ 
                    textShadow: [
                      '0 0 20px rgba(245, 158, 11, 0.5)',
                      '0 0 40px rgba(245, 158, 11, 0.8)',
                      '0 0 20px rgba(245, 158, 11, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    transform: 'translateZ(50px)',
                  }}
                >
                  Miner Haolan
                </motion.span>
              </motion.h1>
            </motion.div>

            <motion.h2 
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your Premier
              <span className="block text-white/90">ASIC Miner Provider</span>
            </motion.h2>

            <motion.p 
              className="text-lg text-white/70 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Order your ASIC miner for home or professional mining operations. 
              Hong Kong warehouse with worldwide shipping and unbeatable prices.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button size="lg" className="btn-shine bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg" asChild>
                <Link to="/shop">
                  Shop All Miners
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg backdrop-blur-sm" asChild>
                <Link to="/contact">Get B2B Quote</Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Secure</p>
                  <p className="text-white/50 text-xs">Payment</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Fast</p>
                  <p className="text-white/50 text-xs">Shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Headphones className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">24/7</p>
                  <p className="text-white/50 text-xs">Support</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual - Featured Product Card */}
          <div className="relative hidden lg:block">
            <motion.div 
              className="relative"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl rounded-full scale-75"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [0.75, 0.85, 0.75],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Main Card - Matching ProductCard style */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={featuredProduct.id}
                  className="relative bg-card rounded-2xl border border-border overflow-hidden shadow-2xl shadow-primary/10"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Image Container */}
                  <Link to={`/product/${featuredProduct.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 p-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 hover:from-primary/5 hover:to-accent/5 transition-all duration-500" />
                      
                      <img 
                        src={featuredProduct.image} 
                        alt={`${featuredProduct.name} - ASIC Miner available at Miner Haolan`} 
                        className="object-contain w-full h-full transition-all duration-700 hover:scale-110"
                      />
                    
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {featuredProduct.isNew && (
                          <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-md shadow-lg">New</span>
                        )}
                        {featuredProduct.isSale && discount > 0 && (
                          <span className="bg-gradient-to-r from-accent to-yellow-500 text-white text-xs font-medium px-2.5 py-1 rounded-md shadow-lg">-{discount}%</span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    {/* Brand */}
                    <p className="text-xs font-medium text-primary mb-1">{featuredProduct.brand}</p>
                    
                    {/* Name */}
                    <Link to={`/product/${featuredProduct.id}`}>
                      <h3 className="font-semibold text-base mb-3 text-foreground hover:text-primary transition-colors">
                        {featuredProduct.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold text-foreground">${featuredProduct.price.toLocaleString()}</span>
                      {featuredProduct.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${featuredProduct.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Specs */}
                    <div className="space-y-2 text-sm border-t border-border pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Algorithm</span>
                        <span className="font-medium text-xs bg-secondary px-2 py-0.5 rounded">{featuredProduct.algorithm}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Hashrate</span>
                        <span className="font-semibold text-primary">{featuredProduct.hashrate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Power</span>
                        <span className="font-medium">{featuredProduct.power}</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Button className="w-full mt-4 h-11 btn-shine" asChild>
                      <Link to={`/product/${featuredProduct.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Progress Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`View product ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;