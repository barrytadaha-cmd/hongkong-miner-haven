import { Helmet } from 'react-helmet-async';
import { faqItems } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const FAQ = () => {
  return (
    <Layout>
      <Helmet>
        <title>FAQ | MinerHoalan Hong Kong</title>
        <meta name="description" content="Frequently asked questions about buying ASIC miners from MinerHoalan. Learn about shipping, payments, warranty, and more." />
      </Helmet>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about purchasing miners, shipping, 
              payments, and support.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto mb-16">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Still have questions */}
          <div className="max-w-xl mx-auto text-center p-8 bg-card rounded-2xl border border-border">
            <h2 className="font-display text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our team is happy to help with 
              any questions about our products or services.
            </p>
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default FAQ;
