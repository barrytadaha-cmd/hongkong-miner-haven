import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Cpu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const productCategories = [
    { name: 'All Miners', path: '/shop' },
    { name: 'Bitcoin Miners', path: '/shop?category=bitcoin' },
    { name: 'Litecoin Miners', path: '/shop?category=litecoin' },
    { name: 'Kaspa Miners', path: '/shop?category=kaspa' },
    { name: 'Home Miners', path: '/shop?category=home' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Cpu className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight">
                Miner<span className="text-primary">Hoalan</span>
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">Hong Kong</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.name === 'Shop' ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`text-sm font-medium gap-1 ${
                        location.pathname === link.path ? 'text-primary' : 'text-foreground/80'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {productCategories.map((cat) => (
                      <DropdownMenuItem key={cat.name} asChild>
                        <Link to={cat.path} className="cursor-pointer">
                          {cat.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={link.name} to={link.path}>
                  <Button
                    variant="ghost"
                    className={`text-sm font-medium ${
                      location.pathname === link.path ? 'text-primary' : 'text-foreground/80'
                    }`}
                  >
                    {link.name}
                  </Button>
                </Link>
              )
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>

            <Button className="hidden sm:flex" asChild>
              <Link to="/shop">Browse Miners</Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
