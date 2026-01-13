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

import { motion } from 'framer-motion';

const CategoryCards = () => {
  return (
    <section className="py-16 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-display text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Discover Our Categories
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Link to={category.path}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border hover:border-primary/30 bg-gradient-to-br from-card to-card/80">
                  <CardContent className="p-3 md:p-4 flex flex-col items-center text-center">
                    <motion.div 
                      className="w-full aspect-square mb-3 md:mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden relative"
                      whileHover={{ rotateZ: 2 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </motion.div>
                    <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground hidden md:block">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;