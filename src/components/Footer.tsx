import { Link } from 'react-router-dom';
import { Cpu, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Cpu className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl">
                  Miner<span className="text-primary">Hoalan</span>
                </span>
                <span className="text-[10px] text-muted-foreground -mt-1">Hong Kong</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your trusted partner for ASIC cryptocurrency mining hardware in Asia and worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=bitcoin" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Bitcoin Miners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=litecoin" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Litecoin Miners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=kaspa" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Kaspa Miners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home Miners
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Unit 1205, 12/F, Tower 1<br />
                  Lippo Centre, 89 Queensway<br />
                  Admiralty, Hong Kong
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+85212345678" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  +852 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:info@minerhoalan.hk" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  info@minerhoalan.hk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} MinerHoalan. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
