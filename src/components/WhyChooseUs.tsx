import { Package, HeadphonesIcon, Globe, Wrench, ShieldCheck, Bitcoin } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Hong Kong Hub',
    description: 'Strategic location for fast shipping to Asia, Australia, Europe, and the Americas.',
  },
  {
    icon: Package,
    title: 'Extensive Stock',
    description: 'Large inventory of Bitmain, MicroBT, and other leading ASIC manufacturers.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Expert technical support in English, Cantonese, and Mandarin.',
  },
  {
    icon: Wrench,
    title: 'Repair Services',
    description: 'In-house repair facility for hashboard repairs and maintenance.',
  },
  {
    icon: ShieldCheck,
    title: 'B2B Specialist',
    description: 'Bulk pricing, custom payment terms, and dedicated account managers.',
  },
  {
    icon: Bitcoin,
    title: 'Crypto Payments',
    description: 'Accept BTC, ETH, USDT for seamless cryptocurrency transactions.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Why Choose MinerHoalan?
          </h2>
          <p className="text-muted-foreground">
            We're not just a vendor – we're your long-term mining partner with 
            comprehensive services and industry expertise.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
