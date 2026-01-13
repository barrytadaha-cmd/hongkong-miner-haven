import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products as staticProducts } from '@/lib/data';
import { useDBProducts, useHasDBProducts } from '@/hooks/useProducts';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  ShoppingCart,
  Zap,
  TrendingUp,
  Cpu,
  ThermometerSun,
  Volume2,
  Package,
  Check,
  Minus,
  ChevronsUpDown,
  Search,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: hasDBProducts } = useHasDBProducts();
  const { data: dbProducts } = useDBProducts();
  const products = hasDBProducts && dbProducts?.length ? dbProducts : staticProducts;
  const { addItem } = useCart();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

  // Get unique categories and brands
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, [products]);

  const brands = useMemo(() => {
    const brandList = [...new Set(products.map(p => p.brand))];
    return brandList.sort();
  }, [products]);

  const maxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price));
  }, [products]);

  // Filter products based on all filters
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesBrand = brandFilter === 'all' || p.brand === brandFilter;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.algorithm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesBrand && matchesPrice && matchesSearch && !selectedProducts.includes(p.id);
    });
  }, [products, categoryFilter, brandFilter, priceRange, searchQuery, selectedProducts]);

  // Handle URL parameter for adding product from product card
  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId && !selectedProducts.includes(productId)) {
      const productExists = products.find(p => p.id === productId);
      if (productExists && selectedProducts.length < 3) {
        setSelectedProducts(prev => [...prev, productId]);
      }
      // Clear the URL parameter
      searchParams.delete('product');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, products, selectedProducts, setSearchParams]);

  const selectedProductData = useMemo(() => {
    return selectedProducts
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);
  }, [selectedProducts, products]);

  const handleAddProduct = (productId: string) => {
    if (selectedProducts.length >= 3) {
      toast.error('Maximum 3 products can be compared');
      return;
    }
    if (selectedProducts.includes(productId)) {
      toast.error('Product already in comparison');
      return;
    }
    setSelectedProducts([...selectedProducts, productId]);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const clearFilters = () => {
    setCategoryFilter('all');
    setBrandFilter('all');
    setPriceRange([0, maxPrice]);
    setSearchQuery('');
  };

  const parseNumericValue = (value: string): number => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const getBestValue = (key: 'hashrate' | 'power' | 'efficiency' | 'price', isLowerBetter = false) => {
    if (selectedProductData.length < 2) return null;
    
    const values = selectedProductData.map(p => {
      if (key === 'price') return p!.price;
      return parseNumericValue(p![key] || '0');
    });

    const bestValue = isLowerBetter ? Math.min(...values) : Math.max(...values);
    return selectedProductData.findIndex(p => {
      if (key === 'price') return p!.price === bestValue;
      return parseNumericValue(p![key] || '0') === bestValue;
    });
  };

  const bestHashrate = getBestValue('hashrate');
  const bestPower = getBestValue('power', true);
  const bestEfficiency = getBestValue('efficiency', true);
  const bestPrice = getBestValue('price', true);

  return (
    <Layout>
      <Helmet>
        <title>Compare ASIC Miners | Miner Haolan</title>
        <meta name="description" content="Compare ASIC miners side-by-side. Analyze hashrate, power consumption, efficiency, and price to find the best miner for your needs." />
      </Helmet>

      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Compare ASIC Miners
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select up to 3 miners to compare their specifications, performance, and pricing side-by-side.
            </p>
          </motion.div>

          {/* Product Selector with Filters */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg">Select Miners to Compare</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:w-auto w-full"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters Section */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                        {/* Category Filter */}
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>
                                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Brand Filter */}
                        <div className="space-y-2">
                          <Label htmlFor="brand">Brand</Label>
                          <Select value={brandFilter} onValueChange={setBrandFilter}>
                            <SelectTrigger id="brand">
                              <SelectValue placeholder="All Brands" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Brands</SelectItem>
                              {brands.map(brand => (
                                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</Label>
                          <Slider
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            max={maxPrice}
                            min={0}
                            step={100}
                            className="mt-2"
                          />
                        </div>

                        {/* Clear Filters Button */}
                        <div className="flex items-end sm:col-span-2 lg:col-span-4">
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-2" />
                            Clear All Filters
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search and Selected Products */}
                <div className="flex flex-wrap gap-4 items-center">
                  <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={searchOpen}
                        className="w-full sm:w-[300px] justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          Search and add miner...
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="Search miners by name, brand..." 
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>No miners found.</CommandEmpty>
                          <CommandGroup heading={`Available Miners (${filteredProducts.length})`}>
                            {filteredProducts
                              .slice(0, 10)
                              .map(product => (
                                <CommandItem
                                  key={product.id}
                                  value={`${product.name} ${product.brand}`}
                                  onSelect={() => handleAddProduct(product.id)}
                                  className="flex flex-col items-start gap-1 cursor-pointer"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-medium">{product.name}</span>
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      ${product.price.toLocaleString()}
                                    </Badge>
                                  </div>
                                  <div className="flex gap-2 text-xs text-muted-foreground">
                                    <span>{product.brand}</span>
                                    <span>•</span>
                                    <span>{product.algorithm}</span>
                                    <span>•</span>
                                    <span>{product.hashrate}</span>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence mode="popLayout">
                      {selectedProductData.map(product => (
                        <motion.div
                          key={product!.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          layout
                        >
                          <Badge
                            variant="secondary"
                            className="py-2 px-3 gap-2"
                          >
                            {product!.name}
                            <button onClick={() => handleRemoveProduct(product!.id)}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {selectedProducts.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProducts([])}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comparison Table */}
          {selectedProductData.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Select miners above to start comparing
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {products.slice(0, 3).map(p => (
                  <Button
                    key={p.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddProduct(p.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {p.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="overflow-x-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 w-48 font-semibold">Specification</th>
                    {selectedProductData.map((product, idx) => (
                      <th key={product!.id} className="p-4 text-center">
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <button
                            onClick={() => handleRemoveProduct(product!.id)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive/10 hover:bg-destructive/20"
                          >
                            <X className="h-3 w-3 text-destructive" />
                          </button>
                          <img
                            src={product!.images[0]}
                            alt={product!.name}
                            className="w-32 h-32 object-contain mx-auto mb-3 rounded-lg bg-muted"
                          />
                          <p className="font-semibold">{product!.name}</p>
                          <p className="text-sm text-muted-foreground">{product!.brand}</p>
                        </motion.div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr className="border-b border-border bg-muted/30">
                    <td className="p-4 font-medium">Price</td>
                    {selectedProductData.map((product, idx) => (
                      <td key={product!.id} className="p-4 text-center">
                        <div className={`font-display text-2xl font-bold ${idx === bestPrice ? 'text-green-500' : ''}`}>
                          ${product!.price.toLocaleString()}
                        </div>
                        {idx === bestPrice && selectedProductData.length > 1 && (
                          <Badge className="mt-1 bg-green-500/10 text-green-500 border-green-500/20">
                            Best Price
                          </Badge>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Algorithm */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      Algorithm
                    </td>
                    {selectedProductData.map(product => (
                      <td key={product!.id} className="p-4 text-center">
                        <Badge variant="outline">{product!.algorithm}</Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Hashrate */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      Hashrate
                    </td>
                    {selectedProductData.map((product, idx) => (
                      <td key={product!.id} className="p-4 text-center">
                        <span className={`font-semibold ${idx === bestHashrate ? 'text-primary' : ''}`}>
                          {product!.hashrate}
                        </span>
                        {idx === bestHashrate && selectedProductData.length > 1 && (
                          <Check className="h-4 w-4 text-primary inline ml-1" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Power */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      Power Consumption
                    </td>
                    {selectedProductData.map((product, idx) => (
                      <td key={product!.id} className="p-4 text-center">
                        <span className={`${idx === bestPower ? 'text-green-500 font-semibold' : ''}`}>
                          {product!.power}
                        </span>
                        {idx === bestPower && selectedProductData.length > 1 && (
                          <Check className="h-4 w-4 text-green-500 inline ml-1" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Efficiency */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                      Efficiency
                    </td>
                    {selectedProductData.map((product, idx) => (
                      <td key={product!.id} className="p-4 text-center">
                        <span className={`${idx === bestEfficiency ? 'text-green-500 font-semibold' : ''}`}>
                          {product!.efficiency}
                        </span>
                        {idx === bestEfficiency && selectedProductData.length > 1 && (
                          <Check className="h-4 w-4 text-green-500 inline ml-1" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Coins */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium">Supported Coins</td>
                    {selectedProductData.map(product => (
                      <td key={product!.id} className="p-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {product!.coins.slice(0, 3).map(coin => (
                            <Badge key={coin} variant="secondary" className="text-xs">
                              {coin}
                            </Badge>
                          ))}
                          {product!.coins.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{product!.coins.length - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Dimensions */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      Dimensions
                    </td>
                    {selectedProductData.map(product => (
                      <td key={product!.id} className="p-4 text-center text-sm text-muted-foreground">
                        {product!.specs.dimensions}
                      </td>
                    ))}
                  </tr>

                  {/* Noise */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      Noise Level
                    </td>
                    {selectedProductData.map(product => (
                      <td key={product!.id} className="p-4 text-center text-sm">
                        {product!.specs.noise}
                      </td>
                    ))}
                  </tr>

                  {/* Add to Cart */}
                  <tr>
                    <td className="p-4"></td>
                    {selectedProductData.map(product => (
                      <td key={product!.id} className="p-4 text-center">
                        <Button 
                          onClick={() => handleAddToCart(product!)}
                          disabled={!product!.inStock}
                          className="w-full"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product!.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </main>
    </Layout>
  );
}