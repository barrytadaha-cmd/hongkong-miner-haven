import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import trustpilotLogo from '@/assets/trustpilot-logo.png';

const testimonials = [
  { name: 'Dennis', text: "Top-notch service, good personal contact, and immediate help should any minor issues arise. At Miner Haolan, everything just works, I'm happy to use them again! The S19k Pro arrived way ahead of schedule, works flawlessly, and is a joy to use.", rating: 5, location: 'Germany' },
  { name: 'Rene', text: "I'm completely satisfied! The service was competent and friendly, easy to reach at any time, and very helpful. After payment, delivery was lightning fast – faster than expected! A completely reliable provider.", rating: 5, location: 'Netherlands' },
  { name: 'Tom', text: "Everything went great. Very friendly and professional support. The miner was shipped on Tuesday, and by Friday morning, it was up and running. Contact with customs was also professionally handled. What more could you want?", rating: 5, location: 'Austria' },
  { name: 'Michael K.', text: "Excellent experience from start to finish. The team helped me choose the right miner for my setup. Delivery was fast and the machine was perfectly packaged. Already ordered my second unit!", rating: 5, location: 'USA' },
  { name: 'Sarah L.', text: "Best crypto mining supplier I've dealt with. Competitive prices, genuine products, and outstanding customer support. They even helped me troubleshoot a minor issue remotely. Highly recommended!", rating: 5, location: 'UK' },
  { name: 'James W.', text: "Professional and reliable. Ordered 5 S21 units for my mining farm, all arrived in perfect condition within a week. The pricing was the best I could find anywhere. Will definitely be back!", rating: 5, location: 'Canada' },
  { name: 'Andreas B.', text: "Outstanding service! Quick response times, transparent communication, and exactly what they promised. My Antminer arrived faster than expected and is running smoothly. Five stars!", rating: 5, location: 'Switzerland' },
  { name: 'Liu Wei', text: "Very professional team. They provided detailed specs and helped calculate ROI before purchase. Shipping was tracked and the hardware quality is excellent. Trustworthy seller!", rating: 5, location: 'Singapore' },
  { name: 'Marco P.', text: "Ordered my first miner here and couldn't be happier. The customer service walked me through setup step by step. Machine arrived in 4 days to Italy!", rating: 5, location: 'Italy' },
  { name: 'Erik S.', text: "Fast shipping to Sweden, excellent packaging, and the miner was exactly as described. Already planning my next purchase. Great experience overall!", rating: 5, location: 'Sweden' },
  { name: 'Pierre D.', text: "Tres bien! Communication was excellent throughout the entire process. My S21 arrived quickly and has been mining flawlessly for 3 months now.", rating: 5, location: 'France' },
  { name: 'Carlos M.', text: "Incredible service! They helped me choose between different models and explained the ROI calculations. Delivery to Spain was faster than expected.", rating: 5, location: 'Spain' },
  { name: 'Yuki T.', text: "Professional handling from order to delivery. The team answered all my technical questions promptly. Highly recommend for Asian customers!", rating: 5, location: 'Japan' },
  { name: 'David R.', text: "Third time ordering from Miner Haolan. Consistency is key and they deliver every time. Fair prices and honest business practices.", rating: 5, location: 'Australia' },
  { name: 'Henrik L.', text: "Smooth transaction from Denmark. The miner was well-packaged and arrived in perfect condition. Customer support was responsive and helpful.", rating: 5, location: 'Denmark' },
  { name: 'Mohammed A.', text: "Best mining hardware supplier I've found. Competitive pricing, genuine products, and they handle all the shipping logistics perfectly.", rating: 5, location: 'UAE' },
  { name: 'Pavel K.', text: "Ordered 3 units for my mining operation. All arrived within a week, perfectly packaged. The team even helped with firmware updates!", rating: 5, location: 'Czech Republic' },
  { name: 'Bruno F.', text: "Excelente! From Brazil to receiving my miner took just 8 days. Great communication throughout. Will order again soon!", rating: 5, location: 'Brazil' },
  { name: 'Oscar N.', text: "Reliable and trustworthy. They provided tracking immediately after shipping and the miner arrived exactly when promised. Very satisfied!", rating: 5, location: 'Norway' },
  { name: 'Kim J.', text: "Fast delivery to South Korea. The Goldshell miner I ordered works perfectly. Customer service answered all my questions within hours.", rating: 5, location: 'South Korea' },
  { name: 'Stefan M.', text: "Ordered from Romania and was worried about customs. The team handled everything professionally. Miner arrived safe and sound!", rating: 5, location: 'Romania' },
  { name: 'Thomas H.', text: "Excellent experience buying my IceRiver miner. Fair pricing, quick shipping, and the unit performs exactly as specified. A+ service!", rating: 5, location: 'Belgium' },
  { name: 'Raj P.', text: "Very impressed with the professionalism. They provided detailed specs, helped calculate electricity costs, and shipping to India was seamless.", rating: 5, location: 'India' },
  { name: 'Alex V.', text: "My go-to supplier for mining hardware. Fourth order now and always the same excellent service. Prices are competitive and delivery is fast.", rating: 5, location: 'Portugal' },
  { name: 'Jan K.', text: "Great experience from Poland. The S19 Pro I ordered arrived in perfect condition. Setup was easy with their detailed instructions.", rating: 5, location: 'Poland' },
  { name: 'Mikael A.', text: "Trustworthy seller! Ordered 2 Antminers and both work flawlessly. Customer support helped me optimize settings for better efficiency.", rating: 5, location: 'Finland' },
  { name: 'Chris B.', text: "Fantastic service from start to finish. The team is knowledgeable and helped me choose the best miner for my budget and goals.", rating: 5, location: 'Ireland' },
  { name: 'Lucas G.', text: "Ordered from Argentina and was amazed by the shipping speed. The miner was double-boxed and arrived without any damage. Excellent!", rating: 5, location: 'Argentina' },
  { name: 'Victor S.', text: "Very professional operation. Clear communication, fair prices, and fast delivery. My Whatsminer M50 is performing above specs!", rating: 5, location: 'Greece' },
  { name: 'Martin O.', text: "Smooth transaction from Mexico. The customs documentation was perfect and my miner cleared without issues. Great vendor!", rating: 5, location: 'Mexico' },
  { name: 'Robert T.', text: "Bought my first ASIC here and the support was incredible. They answered all my newbie questions patiently. Miner works great!", rating: 5, location: 'New Zealand' },
  { name: 'Dmitri V.', text: "Excellent pricing compared to other vendors. My S21 arrived in pristine condition and hashrate matches the specs perfectly.", rating: 5, location: 'Estonia' },
  { name: 'Johan B.', text: "Third purchase from Miner Haolan. Always reliable, always professional. They're my only source for mining equipment now.", rating: 5, location: 'Iceland' },
  { name: 'Felix W.', text: "Outstanding customer service! Had a question about power requirements and they responded within an hour with detailed information.", rating: 5, location: 'Luxembourg' },
  { name: 'Antonio C.', text: "Delivery to Chile was faster than expected. The Goldshell KD5 I ordered is mining perfectly. Will definitely recommend to friends!", rating: 5, location: 'Chile' },
  { name: 'Sven E.', text: "Professional and reliable. The team helped me plan my entire mining setup. Five units ordered, five units delivered perfectly.", rating: 5, location: 'Austria' },
  { name: 'William H.', text: "Best experience buying mining hardware online. Clear pricing, no hidden fees, and my miner arrived ahead of schedule.", rating: 5, location: 'Scotland' },
  { name: 'Arjun S.', text: "Great communication throughout the process. They kept me updated on shipping status and the miner arrived exactly as described.", rating: 5, location: 'Malaysia' },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of satisfied miners who trust Miner Haolan for their hardware needs.
          </p>
          
          {/* Trustpilot Badge */}
          <motion.div 
            className="flex items-center justify-center gap-4 bg-card border border-border rounded-xl p-4 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg p-2">
              <img 
                src={trustpilotLogo} 
                alt="Trustpilot Rating" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Excellent</p>
              <p className="text-xs text-muted-foreground">Based on 500+ reviews</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Carousel Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevSlide}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextSlide}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative min-h-[400px] md:min-h-[320px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="grid md:grid-cols-3 gap-4 md:gap-6"
            >
              {currentTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${currentIndex}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
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
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                      >
                        <Quote className="h-6 w-6 md:h-8 md:w-8 text-primary/30 mb-4" />
                      </motion.div>
                      <p className="text-foreground mb-6 leading-relaxed text-sm md:text-base line-clamp-4">
                        {testimonial.text}
                      </p>
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-primary">500+</span>
            <span className="text-sm text-muted-foreground">Happy Customers</span>
          </div>
          <div className="w-px h-12 bg-border hidden md:block" />
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-primary">4.9</span>
            <span className="text-sm text-muted-foreground">Average Rating</span>
          </div>
          <div className="w-px h-12 bg-border hidden md:block" />
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-primary">98%</span>
            <span className="text-sm text-muted-foreground">Would Recommend</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
