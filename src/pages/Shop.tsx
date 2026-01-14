import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products as staticProducts, categories } from '@/lib/data';
import { useDBProducts, useHasDBProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import PageLoadingSkeleton from '@/components/PageLoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, X, Cpu, Zap, Droplets, Wind } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import PartnersSection from '@/components/PartnersSection';
import { motion, AnimatePresence } from 'framer-motion';

const minerTypes = [
  { id: 'all', name: 'All Types', icon: Cpu },
  { id: 'air', name: 'Air Cooled', icon: Wind },
  { id: 'hydro', name: 'Hydro Cooled', icon: Droplets },
  { id: 'immersion', name: 'Immersion', icon: Zap },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCoin, setSelectedCoin] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Update search state when URL changes (e.g., from hero search)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // Check if database has products
  const { data: hasDBProducts, isLoading: checkingDB } = useHasDBProducts();
  const { data: dbProducts, isLoading: loadingProducts } = useDBProducts();

  // Use database products if available, otherwise fall back to static
  const products = hasDBProducts && dbProducts?.length ? dbProducts : staticProducts;

  const activeCategory = searchParams.get('category') || 'all';

  // Get unique brands, coins, and types
  const brands = useMemo(() => {
    const brandList = [...new Set(products.map(p => p.brand))].filter(Boolean);
    return brandList.sort();
  }, [products]);

  const coins = useMemo(() => {
    const coinSet = new Set<string>();
    products.forEach(p => {
      p.coins?.forEach(coin => coinSet.add(coin));
    });
    return [...coinSet].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Coin filter
    if (selectedCoin !== 'all') {
      filtered = filtered.filter(p => p.coins?.includes(selectedCoin));
    }

    // Type filter (air/hydro/immersion)
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.algorithm.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - show in-stock first, then new items
        filtered = [...filtered].sort((a, b) => {
          if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
          if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
          return 0;
        });
    }

    return filtered;
  }, [products, activeCategory, selectedBrand, selectedCoin, selectedType, search, sortBy]);

  // Calculate category counts from current products
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Calculate brand counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Calculate type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach(p => {
      if (p.type) {
        counts[p.type] = (counts[p.type] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearch('');
    setSortBy('featured');
    setSelectedBrand('all');
    setSelectedCoin('all');
    setSelectedType('all');
    handleCategoryChange('all');
  };

  const activeFiltersCount = [
    activeCategory !== 'all',
    selectedBrand !== 'all',
    selectedCoin !== 'all',
    selectedType !== 'all',
    !!search
  ].filter(Boolean).length;

  const isLoading = checkingDB || loadingProducts;

  return (
    <Layout>
      <Helmet>
        <title>Shop ASIC Miners | MinerHoalan Hong Kong</title>
        <meta name="description" content="Browse our selection of Bitcoin, Litecoin, Kaspa and other ASIC miners. Fast shipping from Hong Kong with warranty." />
      </Helmet>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">ASIC Miner Shop</h1>
            <p className="text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading products...
                </span>
              ) : (
                `${filteredProducts.length} miners available for purchase`
              )}
            </p>
          </div>

          {/* Mobile Filter Card */}
          <div className="lg:hidden mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-lg">Browse Miners</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {showFilters ? 'Hide' : 'Filters'}
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Collapsible Filters Section */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                        {/* Category Filter */}
                        <div className="space-y-2">
                          <Label htmlFor="mobile-category">Coin Category</Label>
                          <Select value={activeCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger id="mobile-category">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories ({categoryCounts.all || 0})</SelectItem>
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name} ({categoryCounts[cat.id] || 0})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Brand Filter */}
                        <div className="space-y-2">
                          <Label htmlFor="mobile-brand">Brand</Label>
                          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                            <SelectTrigger id="mobile-brand">
                              <SelectValue placeholder="All Brands" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Brands</SelectItem>
                              {brands.map(brand => (
                                <SelectItem key={brand} value={brand}>
                                  {brand} ({brandCounts[brand] || 0})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Coin Filter */}
                        <div className="space-y-2">
                          <Label htmlFor="mobile-coin">Coin Type</Label>
                          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                            <SelectTrigger id="mobile-coin">
                              <SelectValue placeholder="All Coins" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Coins</SelectItem>
                              {coins.map(coin => (
                                <SelectItem key={coin} value={coin}>
                                  {coin}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Miner Type Filter */}
                        <div className="space-y-2">
                          <Label htmlFor="mobile-type">Miner Type</Label>
                          <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger id="mobile-type">
                              <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                              {minerTypes.map(type => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name} {type.id !== 'all' && `(${typeCounts[type.id] || 0})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Sort Filter */}
                        <div className="space-y-2">
                          <Label htmlFor="mobile-sort">Sort By</Label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger id="mobile-sort">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="featured">Featured</SelectItem>
                              <SelectItem value="price-asc">Price: Low to High</SelectItem>
                              <SelectItem value="price-desc">Price: High to Low</SelectItem>
                              <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="flex items-end sm:col-span-2">
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-2" />
                            Clear All Filters
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search miners by name, brand..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  {search && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearch('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeCategory !== 'all' && (
                      <Badge variant="secondary" className="py-1.5 px-3 gap-2">
                        {categories.find(c => c.id === activeCategory)?.name}
                        <button onClick={() => handleCategoryChange('all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedBrand !== 'all' && (
                      <Badge variant="secondary" className="py-1.5 px-3 gap-2">
                        {selectedBrand}
                        <button onClick={() => setSelectedBrand('all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedCoin !== 'all' && (
                      <Badge variant="secondary" className="py-1.5 px-3 gap-2">
                        {selectedCoin}
                        <button onClick={() => setSelectedCoin('all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedType !== 'all' && (
                      <Badge variant="secondary" className="py-1.5 px-3 gap-2">
                        {minerTypes.find(t => t.id === selectedType)?.name}
                        <button onClick={() => setSelectedType('all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {search && (
                      <Badge variant="secondary" className="py-1.5 px-3 gap-2">
                        "{search}"
                        <button onClick={() => setSearch('')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Desktop Filters Bar */}
          <div className="hidden lg:flex flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search miners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearch('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Brand Filter */}
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>
                    {brand} ({brandCounts[brand] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Coin Filter */}
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Coins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coins</SelectItem>
                {coins.map(coin => (
                  <SelectItem key={coin} value={coin}>
                    {coin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Miner Type" />
              </SelectTrigger>
              <SelectContent>
                {minerTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="w-64 shrink-0 hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-4">Coin Categories</h3>
                  <div className="space-y-2">
                    <Button
                      variant={activeCategory === 'all' ? 'default' : 'ghost'}
                      className="w-full justify-between"
                      onClick={() => handleCategoryChange('all')}
                    >
                      All Products
                      <Badge variant="secondary" className="ml-2">
                        {categoryCounts.all || 0}
                      </Badge>
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={activeCategory === cat.id ? 'default' : 'ghost'}
                        className="w-full justify-between"
                        onClick={() => handleCategoryChange(cat.id)}
                      >
                        {cat.name}
                        <Badge variant="secondary" className="ml-2">
                          {categoryCounts[cat.id] || 0}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="font-semibold mb-4">Brands</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedBrand === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => setSelectedBrand('all')}
                    >
                      All Brands
                    </Button>
                    {brands.map((brand) => (
                      <Button
                        key={brand}
                        variant={selectedBrand === brand ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => setSelectedBrand(brand)}
                      >
                        {brand}
                        <Badge variant="secondary" className="ml-2">
                          {brandCounts[brand] || 0}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Miner Types */}
                <div>
                  <h3 className="font-semibold mb-4">Miner Type</h3>
                  <div className="space-y-2">
                    {minerTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          variant={selectedType === type.id ? 'default' : 'ghost'}
                          size="sm"
                          className="w-full justify-between"
                          onClick={() => setSelectedType(type.id)}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.name}
                          </span>
                          {type.id !== 'all' && (
                            <Badge variant="secondary" className="ml-2">
                              {typeCounts[type.id] || 0}
                            </Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters ({activeFiltersCount})
                    </Button>
                  </div>
                )}

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Need Help?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Not sure which miner is right for you? Our experts can help.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Sales
                  </Button>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              {isLoading ? (
                <PageLoadingSkeleton type="shop" count={8} />
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No miners found matching your criteria</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <PartnersSection />
      </main>
    </Layout>
  );
};

export default Shop;
