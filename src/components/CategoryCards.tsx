import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import categoryCryptoMiner from '@/assets/category-crypto-miner.png';
import categoryLotteryMiner from '@/assets/category-lottery-miner.png';
import categoryBitcoinHeater from '@/assets/category-bitcoin-heater.png';
import categoryHomeMiner from '@/assets/category-home-miner.png';
import categorySolarMiner from '@/assets/category-solar-miner.png';

const categories = [{
  id: 'crypto-miner',
  name: 'Crypto Miner',
  description: 'All ASIC miners for Bitcoin, Litecoin & more',
  image: categoryCryptoMiner,
  path: '/shop'
}, {
  id: 'lottery-miner',
  name: 'Lottery Bitcoin Miner',
  description: 'Solo mining with home-friendly devices',
  image: categoryLotteryMiner,
  path: '/shop?category=home'
}, {
  id: 'bitcoin-heater',
  name: 'Bitcoin Heater',
  description: 'Heat your home while earning Bitcoin',
  image: categoryBitcoinHeater,
  path: '/shop?category=heater'
}, {
  id: 'home-miner',
  name: 'Home Miner',
  description: 'Quiet, efficient miners for residential use',
  image: categoryHomeMiner,
  path: '/shop?category=home'
}, {
  id: 'solar-miner',
  name: 'Solar System Miners',
  description: 'Off-grid mining solutions',
  image: categorySolarMiner,
  path: '/shop?category=solar'
}];
import { motion } from 'framer-motion';
const CategoryCards = () => {
  return <section className="py-16 overflow-hidden bg-primary-foreground">
      <div className="container mx-auto px-4 bg-destructive-foreground">
        <motion.h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
          Discover Our Categories
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {categories.map((category, index) => <motion.div key={category.id} initial={{
          opacity: 0,
          y: 30,
          rotateX: -15
        }} whileInView={{
          opacity: 1,
          y: 0,
          rotateX: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} whileHover={{
          scale: 1.08,
          rotateY: 5,
          y: -8,
          transition: {
            duration: 0.3,
            ease: "easeOut"
          }
        }} style={{
          transformStyle: 'preserve-3d'
        }}>
              <Link to={category.path}>
                <Card className="group h-full transition-all duration-300 border-border hover:border-primary/50 bg-gradient-to-br from-card to-card/80 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]">
                  <CardContent className="p-3 md:p-4 flex flex-col items-center text-center">
                    <motion.div 
                      className="w-full aspect-square mb-3 md:mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center overflow-hidden relative"
                      whileHover={{
                        rotateZ: 2,
                        scale: 1.02
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                      />
                    </motion.div>
                    <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1 group-hover:text-primary transition-colors duration-300">{category.name}</h3>
                    <p className="text-xs text-muted-foreground hidden md:block group-hover:text-muted-foreground/80 transition-colors duration-300">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default CategoryCards;