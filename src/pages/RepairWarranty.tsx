import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Wrench, Shield, Clock, Phone, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import PartnersSection from '@/components/PartnersSection';

const warrantyPlans = [
  {
    name: 'Standard Manufacturer Warranty',
    price: 0,
    period: '6-12 months',
    repairTime: '8-12 weeks',
    features: [
      { name: 'Basic coverage', included: true },
      { name: '6-12 month warranty', included: true },
      { name: 'Long repair times', included: true },
      { name: 'Free technical diagnosis', included: false },
      { name: 'Repair guarantee', included: false },
      { name: 'No additional costs', included: false },
      { name: 'Priority processing', included: false },
    ],
    popular: false,
    cta: 'Learn more',
    variant: 'outline' as const,
  },
  {
    name: 'Miner Haolan Premium Guarantee',
    price: 249,
    period: '18 months',
    repairTime: '3-5 weeks',
    features: [
      { name: 'Extended coverage', included: true },
      { name: '18 month warranty', included: true },
      { name: 'Fast repair times', included: true },
      { name: 'Free technical diagnosis', included: true },
      { name: 'Repair guarantee', included: true },
      { name: 'No additional costs', included: true },
      { name: '30 Hashcoins', included: true },
    ],
    popular: true,
    cta: 'Book now',
    variant: 'default' as const,
  },
  {
    name: 'Miner Haolan Ultra Premium',
    price: 399,
    period: '18 months',
    repairTime: '1-2 weeks',
    features: [
      { name: 'Full comprehensive coverage', included: true },
      { name: '18 month warranty', included: true },
      { name: 'Express repair times', included: true },
      { name: 'Free technical diagnosis', included: true },
      { name: 'Repair guarantee', included: true },
      { name: 'No additional costs', included: true },
      { name: 'Priority repair queue', included: true },
      { name: 'Dedicated support', included: true },
      { name: '2x Hashcoins', included: true },
    ],
    popular: false,
    cta: 'Choose Premium',
    variant: 'outline' as const,
  },
];

const services = [
  'Hashboard repair',
  'Replacement of defective components',
  'Fan repair or replacement',
  'Use of genuine original spare parts',
  'Transparent and attractive warranties',
  'Performance and overclocking testing',
  'Stress testing runs',
  'Fan and cooling for check',
  'Firmware & software update',
  'Power cord & AC/DC check & repair',
];

const RepairWarranty = () => {
  return (
    <Layout>
      <Helmet>
        <title>Repair & Warranty Service | Miner Haolan</title>
        <meta name="description" content="Premium warranty and repair service for your ASIC miners. Fast turnaround, genuine parts, and comprehensive coverage." />
      </Helmet>

      <main className="pb-16">
        {/* Hero */}
        <div className="bg-navy text-navy-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Repair & Warranty Service
            </h1>
            <p className="text-xl text-navy-foreground/80 max-w-2xl mx-auto">
              Premium warranty service for your ASIC miners
            </p>
          </div>
        </div>

        {/* Intro */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <p className="text-lg text-muted-foreground">
              We know how important uptime is. ASIC mining is very competitive, and every day you are not mining means income lost for now and forever. 
              That is why, in addition to the standard manufacturer warranty, we offer an exclusive premium warranty service that better protects your investment and significantly reduces your downtime.
            </p>
          </div>
        </section>

        {/* Warranty Comparison Table */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center mb-4">
              Warranty Service Comparison
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Compare our warranty services and choose the best protection.
            </p>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto mb-12">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold">Performance Features</th>
                    <th className="text-center p-4 font-semibold">Standard Manufacturer Warranty</th>
                    <th className="text-center p-4 font-semibold text-primary">Miner Haolan Premium+ Guarantee</th>
                    <th className="text-center p-4 font-semibold text-primary">Miner Haolan Ultra Premium Guarantee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4">Price</td>
                    <td className="text-center p-4">€0</td>
                    <td className="text-center p-4 font-semibold">€249.00</td>
                    <td className="text-center p-4 font-semibold">€399.00</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Warranty period</td>
                    <td className="text-center p-4">12 months</td>
                    <td className="text-center p-4">18 months</td>
                    <td className="text-center p-4">18 months</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Repair time</td>
                    <td className="text-center p-4">8-12 weeks</td>
                    <td className="text-center p-4">3-5 weeks</td>
                    <td className="text-center p-4">1-2 weeks</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Free technical diagnosis</td>
                    <td className="text-center p-4"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Repair guarantee</td>
                    <td className="text-center p-4"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">No additional costs</td>
                    <td className="text-center p-4"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Priority repair replacement</td>
                    <td className="text-center p-4"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                    <td className="text-center p-4">1x</td>
                    <td className="text-center p-4">2x</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {warrantyPlans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">€{plan.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.slice(0, 7).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <span className={!feature.included ? 'text-muted-foreground' : ''}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.variant}>
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Repair Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              Repair of all brands of miners
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
              Your mining hardware is in good care - professional, competent top service.
              <br />
              Our ASIC technicians can help you get hashrate on your Bitmain Antminers, MicroBT Whatsminers & more.
              <br />
              We are reliable, quality oriented, and work with clean and professional equipment. We can be easily reached by telephone and by Hong Kong.
            </p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Quick help for your mining hardware</p>
                <h2 className="font-display text-3xl font-bold mb-6">
                  Our services at a glance:
                </h2>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Repair service
                  </h3>
                  <ul className="space-y-2 ml-7">
                    {services.slice(0, 5).map((service, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-3 w-3" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Maintenance service
                  </h3>
                  <ul className="space-y-2 ml-7">
                    {services.slice(5).map((service, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-3 w-3" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex gap-4 justify-center mb-4">
                      <Badge variant="outline">Before</Badge>
                      <Badge>After</Badge>
                    </div>
                    <p className="text-muted-foreground">Professional hashboard repair service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-navy text-navy-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Technical problems? You're in safe hands with us.
            </h2>
            <p className="text-navy-foreground/70 mb-8 max-w-2xl mx-auto">
              Our team of experts is ready to help you get your miners back online.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              Does your miner need help? We're ready.
            </h2>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Request a repair now</Link>
            </Button>
          </div>
        </section>

        <PartnersSection />
      </main>
    </Layout>
  );
};

export default RepairWarranty;