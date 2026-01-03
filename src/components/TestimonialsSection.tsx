import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground">
            Join thousands of satisfied miners who trust Miner Haolan for their hardware needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/30 transition-colors hover:shadow-lg">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;