import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                         linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
              <span className="animate-pulse">●</span>
              Now shipping from Hong Kong
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Power Your Mining{' '}
              <span className="text-gradient">Empire</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Hong Kong's premier destination for ASIC cryptocurrency miners. 
              From home setups to industrial operations, we deliver cutting-edge 
              hardware with unmatched support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <Link to="/shop">
                  Browse Miners
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Get B2B Quote</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Fast Shipping</p>
                  <p className="text-xs text-muted-foreground">3-10 days global</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Warranty</p>
                  <p className="text-xs text-muted-foreground">Full manufacturer</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Support</p>
                  <p className="text-xs text-muted-foreground">24/7 technical</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square">
              {/* Glowing orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[80%] h-[80%] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl animate-pulse-glow" />
              </div>
              
              {/* Floating cards */}
              <div className="absolute top-10 left-10 glass-card p-4 rounded-xl animate-float" style={{ animationDelay: '0s' }}>
                <p className="text-2xl font-bold text-primary">234 TH/s</p>
                <p className="text-sm text-muted-foreground">Latest S21 Pro</p>
              </div>
              
              <div className="absolute bottom-20 right-10 glass-card p-4 rounded-xl animate-float" style={{ animationDelay: '2s' }}>
                <p className="text-2xl font-bold text-primary">$0.04</p>
                <p className="text-sm text-muted-foreground">Hosting /kWh</p>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card p-6 rounded-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop" 
                  alt="ASIC Miner" 
                  className="w-48 h-48 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
