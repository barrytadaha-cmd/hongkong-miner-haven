import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Dennis',
    text: "Top-notch service, good personal contact, and immediate help should any minor issues arise. At Miner Haolan, everything just works, I'm happy to use them again! The S19k Pro arrived way ahead of schedule, works flawlessly, and is a joy to use.",
    rating: 5,
    source: 'Trustpilot'
  },
  {
    name: 'Rene',
    text: "I'm completely satisfied! The service was competent and friendly, easy to reach at any time, and very helpful. After payment, delivery was lightning fast – faster than expected! A completely reliable provider.",
    rating: 5,
    source: 'Google'
  },
  {
    name: 'Tom',
    text: "Everything went great. Very friendly and professional support. The miner was shipped on Tuesday, and by Friday morning, it was up and running. Contact with customs was also professionally handled. What more could you want?",
    rating: 5,
    source: 'Trustpilot'
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground">
            Join thousands of satisfied miners who trust Miner Haolan for their hardware needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ 
                scale: 1.03, 
                rotateY: 3,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-xl h-full">
                <CardContent className="p-4 md:p-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                  >
                    <Quote className="h-6 w-6 md:h-8 md:w-8 text-primary/30 mb-4" />
                  </motion.div>
                  <p className="text-foreground mb-6 leading-relaxed text-sm md:text-base">{testimonial.text}</p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + i * 0.05 + 0.4 }}
                      >
                        <Star className="h-4 w-4 fill-accent text-accent" />
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{testimonial.name}</p>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {testimonial.source}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;