import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
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
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Best Prices Guaranteed</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1]">
              Your Premier
              <span className="block text-gradient-gold">ASIC Miner</span>
              Provider
            </h1>

            <p className="text-lg text-white/70 max-w-lg leading-relaxed">
              Order your ASIC miner for home or professional mining operations. 
              Hong Kong warehouse with worldwide shipping and unbeatable prices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-shine bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg" asChild>
                <Link to="/shop">
                  Shop All Miners
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg backdrop-blur-sm" asChild>
                <Link to="/contact">Get B2B Quote</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Secure</p>
                  <p className="text-white/50 text-xs">Payment</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Fast</p>
                  <p className="text-white/50 text-xs">Shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Headphones className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">24/7</p>
                  <p className="text-white/50 text-xs">Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual - Featured Product Card */}
          <div className="relative hidden lg:block">
            <div className="relative animate-float">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl rounded-full scale-75" />
              
              {/* Main Card */}
              <div className="relative glass-card rounded-3xl p-8 border border-white/10">
                <div className="absolute -top-4 -right-4 best-price-badge shadow-lg">
                  Best Seller
                </div>
                
                <img 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=500&fit=crop" 
                  alt="Antminer S21 Pro - ASIC Bitcoin Miner" 
                  className="w-full max-w-sm mx-auto drop-shadow-2xl rounded-2xl"
                />
                
                {/* Floating Specs */}
                <div className="absolute top-8 left-8 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <p className="text-xl font-bold text-white">234 TH/s</p>
                  <p className="text-xs text-white/70">Hashrate</p>
                </div>
                
                <div className="mt-6 p-4 bg-white/5 rounded-2xl">
                  <p className="text-white/70 text-sm">Antminer S21 Pro</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-white">$2,980</p>
                    <p className="text-lg text-white/50 line-through">$3,499</p>
                  </div>
                  <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-white" asChild>
                    <Link to="/product/1">View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;