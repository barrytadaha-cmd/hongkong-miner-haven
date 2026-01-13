import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Server, Zap, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HostingCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h2 
              className="font-display text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We are ready for them!
            </motion.h2>
            <motion.p 
              className="text-primary-foreground/80 text-lg mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Looking for professional hosting for your ASIC miners? Our partner facilities 
              offer competitive electricity rates starting at $0.04/kWh with 24/7 monitoring.
            </motion.p>
            
            <motion.div 
              className="grid sm:grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {[
                { icon: Server, label: '24/7 Monitoring' },
                { icon: Zap, label: '$0.04/kWh' },
                { icon: Shield, label: 'Secure Facility' },
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05, x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                  </motion.div>
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact">
                  Request Hosting Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.02,
                rotateX: 5,
                rotateY: 5,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '500+', label: 'Miners Hosted', delay: 0 },
                  { value: '99.9%', label: 'Uptime', delay: 0.1 },
                  { value: '3', label: 'Locations', delay: 0.2 },
                  { value: '24/7', label: 'Support', delay: 0.3 },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="bg-white/10 rounded-lg p-4 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + stat.delay }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                    animate={{
                      y: [0, -5, 0],
                    }}
                    style={{
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <motion.p 
                      className="text-3xl font-bold"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        type: "spring",
                        stiffness: 200,
                        delay: 0.6 + stat.delay 
                      }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/5 rounded-full"
              animate={{
                y: [0, 15, 0],
                x: [0, -10, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HostingCTA;