import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const ProductCardSkeleton = () => {
  return (
    <Card className="relative overflow-hidden bg-card border-border">
      {/* 3D effect container */}
      <div className="relative perspective-1000">
        <motion.div
          className="relative"
          initial={{ rotateX: 5, rotateY: -5 }}
          animate={{ 
            rotateX: [5, -5, 5],
            rotateY: [-5, 5, -5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Image skeleton with 3D depth */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary via-secondary/80 to-secondary/60 p-6">
            {/* Animated shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            
            {/* 3D floating cube animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative w-24 h-24"
                animate={{ 
                  rotateX: [0, 360],
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Cube faces */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg border border-primary/20"
                  style={{ transform: 'translateZ(48px)' }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg border border-primary/10"
                  style={{ transform: 'rotateY(90deg) translateZ(48px)' }}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg border border-accent/10"
                  style={{ transform: 'rotateX(90deg) translateZ(48px)' }}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
            </div>

            {/* Badge skeletons */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <div className="h-5 w-12 bg-primary/20 rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Brand skeleton */}
        <motion.div 
          className="h-3 w-16 bg-primary/20 rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Name skeleton */}
        <div className="space-y-2">
          <motion.div 
            className="h-5 w-full bg-muted rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
          />
          <motion.div 
            className="h-5 w-3/4 bg-muted rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>

        {/* Price skeleton */}
        <div className="flex items-baseline gap-2">
          <motion.div 
            className="h-7 w-24 bg-muted rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div 
            className="h-4 w-16 bg-muted/50 rounded"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
        </div>

        {/* Specs skeleton */}
        <div className="space-y-3 border-t border-border pt-4">
          {[0, 1, 2].map((i) => (
            <motion.div 
              key={i}
              className="flex items-center justify-between"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 + i * 0.1 }}
            >
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </motion.div>
          ))}
        </div>

        {/* Button skeleton */}
        <motion.div 
          className="h-11 w-full bg-primary/20 rounded-lg mt-4"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            boxShadow: [
              '0 0 0 rgba(var(--primary), 0)',
              '0 0 20px rgba(var(--primary), 0.2)',
              '0 0 0 rgba(var(--primary), 0)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;
