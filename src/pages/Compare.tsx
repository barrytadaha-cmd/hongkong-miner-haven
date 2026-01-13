import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products as staticProducts } from '@/lib/data';
import { useDBProducts, useHasDBProducts } from '@/hooks/useProducts';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
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
} from 'lucide-react';

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: hasDBProducts } = useHasDBProducts();
  const { data: dbProducts } = useDBProducts();
  const products = hasDBProducts && dbProducts?.length ? dbProducts : staticProducts;
  const { addItem } = useCart();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

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
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
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
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Compare ASIC Miners
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select up to 3 miners to compare their specifications, performance, and pricing side-by-side.
            </p>
          </div>

          {/* Product Selector */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Miners to Compare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <Select onValueChange={handleAddProduct}>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Add a miner to compare..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter(p => !selectedProducts.includes(p.id))
                        .map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - ${product.price.toLocaleString()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2">
                    {selectedProductData.map(product => (
                      <Badge
                        key={product!.id}
                        variant="secondary"
                        className="py-2 px-3 gap-2"
                      >
                        {product!.name}
                        <button onClick={() => handleRemoveProduct(product!.id)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
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
          </div>

          {/* Comparison Table */}
          {selectedProductData.length === 0 ? (
            <div className="text-center py-20">
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
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 w-48 font-semibold">Specification</th>
                    {selectedProductData.map((product, idx) => (
                      <th key={product!.id} className="p-4 text-center">
                        <div className="relative">
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
                        </div>
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
                      <td key={product!.id} className="p-4 text-center text-sm text-muted-foreground">
                        {product!.specs.noise}
                      </td>
                    ))}
                  </tr>

                  {/* Stock Status */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium">Availability</td>
                    {selectedProductData.map(product => (
                      <td key={product!.id} className="p-4 text-center">
                        {product!.inStock ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pre-Order</Badge>
                        )}
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
                          className="w-full max-w-[200px]"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
