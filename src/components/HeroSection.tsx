import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import heroMobileBg from '@/assets/hero-mobile-bg.webp';

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Mobile Background Video/Animation with 3D Effect */}
      <div className="absolute inset-0 lg:hidden" style={{ perspective: '1000px' }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1, rotateX: 5 }}
          animate={{ 
            scale: [1.1, 1.15, 1.1],
            rotateX: [5, 3, 5],
            z: [0, 20, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ 
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
          }}
        >
          <img 
            src={heroMobileBg} 
            alt="" 
            className="w-full h-full object-cover"
          />
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

      {/* Animated Background Elements - Desktop Only */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid Pattern - Desktop Only */}
      <div className="absolute inset-0 opacity-[0.03] hidden lg:block" style={{
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
              
              {/* Main Card */}
              <motion.div 
                className="relative glass-card rounded-3xl p-8 border border-white/10"
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div 
                  className="absolute -top-4 -right-4 best-price-badge shadow-lg"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 4px 14px rgba(245, 158, 11, 0.3)',
                      '0 6px 20px rgba(245, 158, 11, 0.5)',
                      '0 4px 14px rgba(245, 158, 11, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Best Seller
                </motion.div>
                
                <img 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=500&fit=crop" 
                  alt="Antminer S21 Pro - ASIC Bitcoin Miner available at Miner Haolan" 
                  className="w-full max-w-sm mx-auto drop-shadow-2xl rounded-2xl"
                />
                
                {/* Floating Specs */}
                <motion.div 
                  className="absolute top-8 left-8 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-xl"
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <p className="text-xl font-bold text-primary-foreground">234 TH/s</p>
                  <p className="text-xs text-primary-foreground/70">Hashrate</p>
                </motion.div>
                
                <div className="mt-6 p-4 bg-white/5 rounded-2xl">
                  <p className="text-white/70 text-sm">Antminer S21 Pro</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-white">$2,980</p>
                    <p className="text-lg text-white/50 line-through">$3,499</p>
                  </div>
                  <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" asChild>
                    <Link to="/product/1">View Details</Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;