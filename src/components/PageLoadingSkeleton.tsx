import { motion } from 'framer-motion';
import ProductCardSkeleton from './ProductCardSkeleton';

interface PageLoadingSkeletonProps {
  type?: 'shop' | 'product' | 'home';
  count?: number;
}

const PageLoadingSkeleton = ({ type = 'shop', count = 8 }: PageLoadingSkeletonProps) => {
  if (type === 'product') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image Skeleton */}
          <div className="relative">
            <motion.div 
              className="aspect-square bg-gradient-to-br from-secondary via-secondary/80 to-secondary/60 rounded-2xl overflow-hidden"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* 3D rotating cube */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative w-32 h-32"
                  animate={{ 
                    rotateX: [0, 360],
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/10 rounded-xl border border-primary/30"
                    style={{ transform: 'translateZ(64px)' }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-xl border border-primary/20"
                    style={{ transform: 'rotateY(90deg) translateZ(64px)' }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-accent/30 to-transparent rounded-xl border border-accent/20"
                    style={{ transform: 'rotateX(90deg) translateZ(64px)' }}
                  />
                </motion.div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </motion.div>

            {/* Thumbnail skeletons */}
            <div className="flex gap-3 mt-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-20 h-20 bg-secondary rounded-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <motion.div 
                className="h-4 w-24 bg-primary/20 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div 
                className="h-10 w-3/4 bg-muted rounded"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
            </div>

            <motion.div 
              className="h-8 w-32 bg-muted rounded"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />

            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="h-4 bg-muted rounded"
                  style={{ width: `${100 - i * 10}%` }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 + i * 0.1 }}
                />
              ))}
            </div>

            <motion.div 
              className="h-14 w-full bg-primary/20 rounded-lg"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                boxShadow: [
                  '0 0 0 rgba(var(--primary), 0)',
                  '0 0 30px rgba(var(--primary), 0.3)',
                  '0 0 0 rgba(var(--primary), 0)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'home') {
    return (
      <div className="space-y-16">
        {/* Hero Skeleton */}
        <motion.div 
          className="h-[70vh] bg-gradient-to-br from-secondary via-secondary/80 to-secondary/60 relative overflow-hidden"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative w-40 h-40"
              animate={{ 
                rotateX: [0, 360],
                rotateY: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/10 rounded-2xl border border-primary/30"
                style={{ transform: 'translateZ(80px)' }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-2xl border border-primary/20"
                style={{ transform: 'rotateY(90deg) translateZ(80px)' }}
              />
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </motion.div>

        {/* Products Grid Skeleton */}
        <div className="container mx-auto px-4">
          <motion.div 
            className="h-8 w-48 bg-muted rounded mx-auto mb-8"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCardSkeleton />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Shop grid skeleton
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            delay: i * 0.05,
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
};

export default PageLoadingSkeleton;
