import { products } from '@/lib/data';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
const FeaturedProducts = () => {
  const featuredProducts = products.filter(p => p.inStock).slice(0, 4);
  return <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl mb-2 font-extrabold md:text-5xl">
              Our Bestsellers
            </h2>
            <p className="text-muted-foreground">
              Discover our most popular mining products
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/shop">
              Show All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>;
};
export default FeaturedProducts;