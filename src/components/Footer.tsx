import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Newsletter */}
        <div className="border-b border-white/10 pb-12 mb-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl font-bold mb-3">Stay Updated</h3>
            <p className="text-navy-foreground/70 mb-6">
              Subscribe to our newsletter for the latest products, deals, and mining insights.
            </p>
            <form className="flex gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-navy-foreground placeholder:text-navy-foreground/50"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  All Miners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bitcoin" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Bitcoin Miners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=litecoin" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Litecoin Miners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=kaspa" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Kaspa Miners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Home Miners
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?type=air" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Air-Cooled Miners
                </Link>
              </li>
              <li>
                <Link to="/shop?type=hydro" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Hydro Miners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=heater" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Bitcoin Heaters
                </Link>
              </li>
              <li>
                <Link to="/shop?category=lottery" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Lottery Miners
                </Link>
              </li>
            </ul>
          </div>

          {/* Knowledge */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Knowledge</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/repair-warranty" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Repair & Warranty
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span className="text-navy-foreground/70 text-sm">
                  Unit 1205, 12/F, Tower 1<br />
                  Lippo Centre, 89 Queensway<br />
                  Admiralty, Hong Kong
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <a href="tel:+14076764098" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  +1 407 676 4098
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <a href="mailto:support@minerhaolan.com" className="text-navy-foreground/70 hover:text-accent transition-colors text-sm">
                  support@minerhaolan.com
                </a>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-navy-foreground/50 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-navy-foreground/50 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-navy-foreground/50 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-navy-foreground/50 hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl">
              Miner<span className="text-accent">Haolan</span>
            </span>
          </div>
          <p className="text-navy-foreground/50 text-sm">
            © {currentYear} Miner Haolan. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/faq" className="text-navy-foreground/50 hover:text-accent transition-colors text-sm">
              FAQ
            </Link>
            <Link to="/contact" className="text-navy-foreground/50 hover:text-accent transition-colors text-sm">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;