import { motion } from 'framer-motion';

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header space */}
      <div className="h-20" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb skeleton - mobile */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Image Skeleton */}
          <div className="space-y-4">
            <motion.div 
              className="relative aspect-square bg-gradient-to-br from-secondary via-secondary/80 to-secondary/60 rounded-2xl overflow-hidden"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Branded logo animation */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                {/* MinerHaolan Logo text */}
                <motion.div
                  className="relative"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    className="text-3xl sm:text-4xl font-bold tracking-tight"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-primary">Miner</span>
                    <span className="text-foreground/40">Haolan</span>
                  </motion.div>
                  
                  {/* Animated underline */}
                  <motion.div
                    className="h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent rounded-full mt-2"
                    animate={{
                      scaleX: [0.5, 1, 0.5],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>

                {/* Loading indicator */}
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </motion.div>
              </div>

              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    'inset 0 0 0 rgba(var(--primary), 0)',
                    'inset 0 0 60px hsl(var(--primary) / 0.1)',
                    'inset 0 0 0 rgba(var(--primary), 0)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            {/* Thumbnail skeletons - horizontal scroll on mobile */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-auto lg:aspect-square bg-secondary rounded-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-5">
            {/* Brand */}
            <motion.div 
              className="h-4 w-20 bg-primary/20 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            
            {/* Title */}
            <div className="space-y-2">
              <motion.div 
                className="h-7 sm:h-9 w-full bg-muted rounded"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
              <motion.div 
                className="h-7 sm:h-9 w-2/3 bg-muted rounded"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.15 }}
              />
            </div>

            {/* Quick specs - 3 column grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="p-3 sm:p-4 bg-muted/30 rounded-xl"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 + i * 0.1 }}
                >
                  <div className="h-4 w-4 sm:h-5 sm:w-5 bg-primary/30 rounded mx-auto mb-2" />
                  <div className="h-3 w-12 bg-muted/50 rounded mx-auto mb-1" />
                  <div className="h-4 w-14 bg-muted rounded mx-auto" />
                </motion.div>
              ))}
            </div>

            {/* Coins */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted/50 rounded" />
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-6 w-14 bg-secondary rounded-full"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 + i * 0.1 }}
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            <motion.div 
              className="h-10 sm:h-12 w-36 bg-primary/20 rounded"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />

            {/* Stock status */}
            <motion.div 
              className="flex items-center gap-2"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.45 }}
            >
              <div className="h-5 w-5 bg-green-500/30 rounded-full" />
              <div className="h-5 w-32 bg-green-500/20 rounded" />
            </motion.div>

            {/* Add to cart section */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.div 
                className="h-11 w-28 bg-muted rounded-lg"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div 
                className="h-11 flex-1 bg-primary/30 rounded-lg"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  boxShadow: [
                    '0 0 0 hsl(var(--primary) / 0)',
                    '0 0 30px hsl(var(--primary) / 0.3)',
                    '0 0 0 hsl(var(--primary) / 0)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Trust badges */}
            <motion.div 
              className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/20 rounded-xl"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="h-4 w-4 sm:h-5 sm:w-5 bg-primary/30 rounded" />
                  <div className="h-3 w-16 bg-muted/50 rounded" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mt-12 sm:mt-16">
          <div className="flex gap-4 sm:gap-6 border-b border-border pb-0 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`h-10 flex-shrink-0 rounded-t ${i === 0 ? 'w-24 bg-primary/30' : 'w-20 bg-muted/30'}`}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 + i * 0.1 }}
              />
            ))}
          </div>
          
          {/* Tab content skeleton */}
          <div className="mt-6 sm:mt-8 space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-4 bg-muted rounded"
                style={{ width: `${100 - i * 15}%` }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 + i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
