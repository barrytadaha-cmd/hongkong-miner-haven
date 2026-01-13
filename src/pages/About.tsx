import { Helmet } from 'react-helmet-async';
import { Building2, Users, Globe, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import PartnersSection from '@/components/PartnersSection';
const stats = [
  { label: 'Years in Business', value: '5+' },
  { label: 'Miners Sold', value: '10,000+' },
  { label: 'Countries Shipped', value: '50+' },
  { label: 'B2B Clients', value: '200+' },
];

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About Us | MinerHoalan Hong Kong</title>
        <meta name="description" content="Learn about MinerHoalan - Hong Kong's trusted ASIC miner supplier with 5+ years of experience serving miners worldwide." />
      </Helmet>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              About MinerHoalan
            </h1>
            <p className="text-xl text-muted-foreground">
              Hong Kong's trusted partner for cryptocurrency mining hardware since 2019. 
              We bridge the gap between top manufacturers and miners worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-card rounded-2xl border border-border">
                <p className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-display text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  MinerHoalan was founded in Hong Kong by a team of cryptocurrency enthusiasts 
                  and hardware engineers who saw the need for a reliable, customer-focused 
                  ASIC miner supplier in Asia.
                </p>
                <p>
                  Starting from a small warehouse in Kwun Tong, we've grown to become one of 
                  the region's leading distributors of mining hardware, serving everyone from 
                  home miners to enterprise-scale operations.
                </p>
                <p>
                  Our Hong Kong location gives us unique advantages: direct relationships with 
                  Chinese manufacturers, a business-friendly regulatory environment, and 
                  excellent logistics connections to ship anywhere in the world.
                </p>
              </div>
            </div>
            <div className="aspect-video bg-muted rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop"
                alt="Hong Kong skyline"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="font-display text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-card rounded-2xl border border-border text-center">
                <div className="p-4 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Reliability</h3>
                <p className="text-sm text-muted-foreground">
                  We only sell authentic hardware from verified manufacturers.
                </p>
              </div>
              <div className="p-6 bg-card rounded-2xl border border-border text-center">
                <div className="p-4 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Customer First</h3>
                <p className="text-sm text-muted-foreground">
                  Your success is our success. We're here to support your mining journey.
                </p>
              </div>
              <div className="p-6 bg-card rounded-2xl border border-border text-center">
                <div className="p-4 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  From Hong Kong to the world – we ship to 50+ countries.
                </p>
              </div>
              <div className="p-6 bg-card rounded-2xl border border-border text-center">
                <div className="p-4 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Our team has deep knowledge of mining hardware and operations.
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold mb-4">Visit Our Showroom</h2>
                <p className="text-muted-foreground mb-6">
                  We welcome customers to visit our Hong Kong showroom to see our inventory 
                  and speak with our technical team. Appointments recommended for B2B clients.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Address:</strong> Unit 1205, 12/F, Tower 1, Lippo Centre, 89 Queensway, Admiralty, Hong Kong</p>
                  <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM HKT</p>
                  <p><strong>Phone:</strong> +852 1234 5678</p>
                </div>
              </div>
              <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&h=340&fit=crop"
                  alt="Hong Kong office building"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <PartnersSection />
      </main>
    </Layout>
  );
};

export default About;
