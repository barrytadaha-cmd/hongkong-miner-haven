import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import avalonMini3Image from '@/assets/avalon-mini-3-featured.jpg';
import { useDBProducts } from '@/hooks/useProducts';
import { useMemo } from 'react';

const FeaturedProduct = () => {
  const { data: dbProducts } = useDBProducts();
  
  // Find the Avalon MINI 3 product from database
  const avalonMini3 = useMemo(() => {
    return dbProducts?.find(p => p.name === 'Avalon MINI 3');
  }, [dbProducts]);

  const productLink = avalonMini3 ? `/product/${avalonMini3.id}` : '/shop?search=avalon+mini+3';

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12">
              <img 
                src={avalonMini3Image} 
                alt="Avalon MINI 3 - Bitcoin Heater" 
                className="w-full max-w-sm mx-auto"
              />
            </div>
            <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 rounded-full font-semibold">
              New Arrival
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              Featured Product
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Smart heating.{' '}
              <span className="text-primary">With Bitcoin.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground">
              The Avalon MINI 3 heats your home while mining Bitcoin. 
              More warmth, less cost. Revolutionary heating technology 
              that pays for itself.
            </p>

            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Silent operation - under 35 dB
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Heats rooms up to 25m²
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Earn Bitcoin while staying warm
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="group" asChild>
                <Link to={productLink}>
                  Buy Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/shop?category=heater">View All Heaters</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;