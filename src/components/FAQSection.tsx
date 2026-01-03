import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'Where is your company located?',
    answer: 'Miner Haolan is headquartered in Hong Kong, with warehousing facilities for fast shipping across Asia and worldwide. Our central location allows us to serve customers globally with competitive shipping times.',
  },
  {
    question: 'Do I have to pay VAT?',
    answer: 'VAT and import duties vary by destination country. Orders shipped from Hong Kong may be subject to local customs duties and taxes. We provide all necessary documentation for customs clearance, and our team can advise on requirements for your location.',
  },
  {
    question: 'Is there a warranty?',
    answer: 'Yes! All new miners come with manufacturer warranty, typically 6-12 months depending on the brand. We also offer extended warranty packages and have an in-house repair facility in Hong Kong for post-warranty service.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers (SWIFT), cryptocurrency payments (BTC, ETH, USDT), and credit cards for orders under $5,000. For large B2B orders, we offer flexible payment terms and escrow services.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Orders from our Hong Kong warehouse typically ship within 1-3 business days. Delivery to Asia takes 3-5 days, to Europe 7-10 days, and to North America 7-14 days. Express shipping is available for urgent orders.',
  },
  {
    question: 'Do you offer hosting services?',
    answer: 'Yes! We partner with mining facilities across Asia offering competitive electricity rates starting at $0.04/kWh. Contact us for customized hosting solutions including setup, monitoring, and maintenance.',
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;