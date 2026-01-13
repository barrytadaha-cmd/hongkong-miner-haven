import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown, Search, User, MapPin, Award, Phone, Settings, GitCompare, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    totalItems,
    setIsOpen
  } = useCart();
  const {
    user,
    isAdmin,
    signOut
  } = useAuth();
  const location = useLocation();
  const bitcoinMiners = [{
    name: 'All Bitcoin Miners',
    path: '/shop?category=bitcoin'
  }, {
    name: 'Air-Cooled Miners',
    path: '/shop?category=bitcoin&type=air'
  }, {
    name: 'Hydro Miners',
    path: '/shop?category=bitcoin&type=hydro'
  }, {
    name: 'Immersion Miners',
    path: '/shop?category=bitcoin&type=immersion'
  }];
  const altcoinMiners = [{
    name: 'Litecoin Miners',
    path: '/shop?category=litecoin'
  }, {
    name: 'Kaspa Miners',
    path: '/shop?category=kaspa'
  }, {
    name: 'Zcash Miners',
    path: '/shop?category=zcash'
  }, {
    name: 'Ethereum Miners',
    path: '/shop?category=ethereum'
  }];
  const knowledge = [{
    name: 'Blog',
    path: '/blog'
  }, {
    name: 'FAQ',
    path: '/faq'
  }, {
    name: 'Mining Guide',
    path: '/blog'
  }, {
    name: 'Repair & Warranty',
    path: '/repair-warranty'
  }];
  return <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-navy text-navy-foreground text-sm py-2">
        <div className="container mx-auto px-4 items-center justify-between flex flex-col">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Hong Kong HQ
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-accent" />
              Best Price Guarantee
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Service & Support
            </span>
          </div>
          <div className="gap-4 flex items-center justify-center">
            
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight">
                  Miner<span className="text-primary">Haolan</span>
                </span>
                <span className="text-[10px] text-muted-foreground -mt-1">Hong Kong</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium gap-1">
                    Buy ASIC Miner
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-popover">
                  <DropdownMenuItem asChild>
                    <Link to="/shop" className="cursor-pointer font-medium">
                      All Miners
                    </Link>
                  </DropdownMenuItem>
                  {bitcoinMiners.map(item => <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.path} className="cursor-pointer">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium gap-1">
                    Bitcoin Miner
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-popover">
                  {bitcoinMiners.map(item => <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.path} className="cursor-pointer">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium gap-1">
                    Altcoin Miner
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-popover">
                  {altcoinMiners.map(item => <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.path} className="cursor-pointer">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium gap-1">
                    Knowledge
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-popover">
                  {knowledge.map(item => <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.path} className="cursor-pointer">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/compare">
                <Button variant="ghost" className="text-sm font-medium gap-1">
                  <GitCompare className="h-4 w-4" />
                  Compare
                </Button>
              </Link>

              <Link to="/contact">
                <Button variant="ghost" className="text-sm font-medium">
                  Contact
                </Button>
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchOpen ? <div className="hidden md:flex items-center gap-2">
                  <Input type="search" placeholder="Search miners..." className="w-48" autoFocus onBlur={() => setSearchOpen(false)} />
                </div> : <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? <>
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">My Account</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                          <UserCircle className="h-4 w-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer flex items-center gap-2 text-primary">
                            <Settings className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                        Sign Out
                      </DropdownMenuItem>
                    </> : <>
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">Welcome!</p>
                        <p className="text-xs text-muted-foreground">Create your personal account</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/auth" className="cursor-pointer flex items-center gap-2">
                          <UserCircle className="h-4 w-4" />
                          Sign In / Create Account
                        </Link>
                      </DropdownMenuItem>
                    </>}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                    {totalItems}
                  </Badge>}
              </Button>

              <Button className="hidden sm:flex bg-primary hover:bg-primary/90" asChild>
                <Link to="/shop">Buy ASIC Miner</Link>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && <div className="lg:hidden py-4 border-t border-border animate-fade-in">
              <nav className="flex flex-col gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-sm font-medium px-4">
                      Buy ASIC Miner
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-popover">
                    <DropdownMenuItem asChild>
                      <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="cursor-pointer font-medium">
                        All Miners
                      </Link>
                    </DropdownMenuItem>
                    {bitcoinMiners.map(item => <DropdownMenuItem key={item.name} asChild>
                        <Link to={item.path} onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-sm font-medium px-4">
                      Bitcoin Miner
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-popover">
                    {bitcoinMiners.map(item => <DropdownMenuItem key={item.name} asChild>
                        <Link to={item.path} onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-sm font-medium px-4">
                      Altcoin Miner
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-popover">
                    {altcoinMiners.map(item => <DropdownMenuItem key={item.name} asChild>
                        <Link to={item.path} onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-sm font-medium px-4">
                      Knowledge
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-popover">
                    {knowledge.map(item => <DropdownMenuItem key={item.name} asChild>
                        <Link to={item.path} onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/compare" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm font-medium px-4 gap-1">
                    <GitCompare className="h-4 w-4" />
                    Compare
                  </Button>
                </Link>

                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm font-medium px-4">
                    Contact
                  </Button>
                </Link>

                {/* Mobile Search */}
                <div className="px-4 pt-2">
                  <Input type="search" placeholder="Search miners..." className="w-full" />
                </div>
              </nav>
            </div>}
        </div>
      </div>
    </header>;
};
export default Header;