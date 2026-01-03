import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Phone } from 'lucide-react';

const HelpSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image/Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-navy to-navy/80 rounded-2xl p-8 text-navy-foreground">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold mb-2">
                    Do you have a question? We're here to help.
                  </h3>
                  <p className="text-navy-foreground/70">
                    Get quick answers from our expert team.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <p className="text-navy-foreground/60">
                  "Can you help me choose the right miner for my budget?"
                </p>
                <p className="text-navy-foreground/60">
                  "What's the warranty on Bitmain products?"
                </p>
                <p className="text-navy-foreground/60">
                  "Do you ship to Australia?"
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Contact options */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Need assistance?</p>
              <h2 className="font-display text-3xl font-bold mb-4">
                We are happy to help you!
              </h2>
              <p className="text-muted-foreground">
                Our team is available Monday to Friday, 9AM - 6PM (HKT). 
                Reach out through any of these channels.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <Phone className="h-5 w-5 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Call Sales/Support</h4>
                <a href="tel:+14076764098" className="text-sm text-primary hover:underline">
                  +1 407 676 4098
                </a>
              </div>
              
              <div className="p-4 bg-card border border-border rounded-lg">
                <Mail className="h-5 w-5 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Email Us</h4>
                <a href="mailto:support@minerhaolan.com" className="text-sm text-primary hover:underline">
                  support@minerhaolan.com
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E]" asChild>
                <a href="https://wa.me/14076764098" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/faq">
                  View FAQ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;