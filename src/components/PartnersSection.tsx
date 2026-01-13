import { motion } from 'framer-motion';
import antminerLogo from '@/assets/antminer-logo.png';
import microbtLogo from '@/assets/microbt-logo.png';
import goldshellLogo from '@/assets/goldshell-logo.webp';
import iceriverLogo from '@/assets/iceriver-logo.avif';

const partners = [
  {
    name: 'Antminer',
    logo: antminerLogo,
  },
  {
    name: 'MicroBT',
    logo: microbtLogo,
  },
  {
    name: 'Goldshell',
    logo: goldshellLogo,
  },
  {
    name: 'IceRiver',
    logo: iceriverLogo,
  },
];

const PartnersSection = () => {
  return (
    <section className="py-16 border-y border-border bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-display text-2xl font-semibold text-center mb-10 text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Partners
        </motion.h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <motion.div 
              key={partner.name} 
              className="hover:scale-110 transition-all duration-300"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.15,
                y: -10,
                rotateY: 10,
                transition: { type: "spring", stiffness: 300 }
              }}
              animate={{
                y: [0, -8, 0],
              }}
              style={{
                animationDelay: `${index * 0.2}s`,
                perspective: 1000
              }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3
                }}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="h-16 md:h-24 lg:h-28 w-auto object-contain max-w-[200px] md:max-w-[280px]"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Floating background elements */}
        <div className="relative">
          <motion.div
            className="absolute -top-32 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -top-40 right-1/3 w-32 h-32 bg-secondary/10 rounded-full blur-xl"
            animate={{
              y: [0, 25, 0],
              x: [0, -20, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;