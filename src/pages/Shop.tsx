import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products as staticProducts, categories } from '@/lib/data';
import { useDBProducts, useHasDBProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PartnersSection from '@/components/PartnersSection';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Check if database has products
  const { data: hasDBProducts, isLoading: checkingDB } = useHasDBProducts();
  const { data: dbProducts, isLoading: loadingProducts } = useDBProducts();

  // Use database products if available, otherwise fall back to static
  const products = hasDBProducts && dbProducts?.length ? dbProducts : staticProducts;

  const activeCategory = searchParams.get('category') || 'all';

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
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
  }, [products, activeCategory, search, sortBy]);

  // Calculate category counts from current products
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading products...
                </span>
              ) : (
                `${filteredProducts.length} miners available for purchase`
              )}
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
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

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="sticky top-24">
                <h3 className="font-semibold mb-4">Categories</h3>
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

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
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

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No miners found matching your criteria</p>
                  <Button variant="outline" onClick={() => { setSearch(''); handleCategoryChange('all'); }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
