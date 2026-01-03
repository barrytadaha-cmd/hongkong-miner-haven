import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 'crypto-miner',
    name: 'Crypto Miner',
    description: 'All ASIC miners for Bitcoin, Litecoin & more',
    image: 'https://asicminermarket.com/wp-content/uploads/2024/03/Antminer-S21-Pro.png',
    path: '/shop',
  },
  {
    id: 'lottery-miner',
    name: 'Lottery Bitcoin Miner',
    description: 'Solo mining with home-friendly devices',
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/Bitaxe-Supra.png',
    path: '/shop?category=home',
  },
  {
    id: 'bitcoin-heater',
    name: 'Bitcoin Heater',
    description: 'Heat your home while earning Bitcoin',
    image: 'https://asicminermarket.com/wp-content/uploads/2024/05/Avalon-Nano-3.png',
    path: '/shop?category=heater',
  },
  {
    id: 'home-miner',
    name: 'Home Miner',
    description: 'Quiet, efficient miners for residential use',
    image: 'https://asicminermarket.com/wp-content/uploads/2024/01/Bitaxe-Ultra.png',
    path: '/shop?category=home',
  },
  {
    id: 'solar-miner',
    name: 'Solar System Miners',
    description: 'Off-grid mining solutions',
    image: 'https://asicminermarket.com/wp-content/uploads/2024/03/Whatsminer-M60S.png',
    path: '/shop?category=solar',
  },
];

const CategoryCards = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          Discover Our Categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={category.path}>
              <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border hover:border-primary/30">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-full aspect-square mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground hidden md:block">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;