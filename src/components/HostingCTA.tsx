import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Server, Zap, Shield, ArrowRight } from 'lucide-react';

const HostingCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              We are ready for them!
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-6">
              Looking for professional hosting for your ASIC miners? Our partner facilities 
              offer competitive electricity rates starting at $0.04/kWh with 24/7 monitoring.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                <span className="text-sm">24/7 Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm">$0.04/kWh</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Secure Facility</span>
              </div>
            </div>

            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Request Hosting Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="relative hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm text-primary-foreground/70">Miners Hosted</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">99.9%</p>
                  <p className="text-sm text-primary-foreground/70">Uptime</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-sm text-primary-foreground/70">Locations</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">24/7</p>
                  <p className="text-sm text-primary-foreground/70">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostingCTA;