import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Bitmain',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Bitmain_logo.svg/1200px-Bitmain_logo.svg.png',
  },
  {
    name: 'MicroBT',
    logo: 'https://www.microbt.com/static/img/logo.png',
  },
  {
    name: 'Canaan',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Canaan_Creative_logo.svg/2560px-Canaan_Creative_logo.svg.png',
  },
  {
    name: 'Goldshell',
    logo: 'https://www.goldshell.com/wp-content/uploads/2021/09/goldshell-logo.svg',
  },
  {
    name: 'IceRiver',
    logo: 'https://iceriver.io/wp-content/uploads/2023/12/logo.svg',
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
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 0.6, y: 0, scale: 1 }}
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
                  className="h-8 md:h-10 w-auto object-contain"
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