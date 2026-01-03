import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-navy">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-navy-foreground">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Your Provider for{' '}
              <span className="text-accent">ASIC Miners</span>
            </h1>

            <p className="text-lg text-navy-foreground/80 max-w-lg">
              Order your ASIC miner for home or professional projects. 
              Best price guarantee for your crypto mining hardware.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link to="/shop">
                  Buy ASIC Miner
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-navy-foreground/30 text-navy-foreground hover:bg-navy-foreground/10" asChild>
                <Link to="/contact">Get B2B Quote</Link>
              </Button>
            </div>
          </div>

          {/* Visual - Miner Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              
              {/* Main Image */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <img 
                  src="https://asicminermarket.com/wp-content/uploads/2024/03/Antminer-S21-Pro.png" 
                  alt="Antminer S21 Pro - ASIC Bitcoin Miner" 
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
                
                {/* Floating stats */}
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  234 TH/s
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-sm text-navy-foreground/70">Starting from</p>
                  <p className="text-2xl font-bold text-navy-foreground">$8,999</p>
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