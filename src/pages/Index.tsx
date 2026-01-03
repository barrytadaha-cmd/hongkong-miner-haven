import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhyChooseUs from '@/components/WhyChooseUs';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>MinerHoalan - Premium ASIC Miners in Hong Kong</title>
        <meta name="description" content="Hong Kong's premier destination for ASIC cryptocurrency miners. Bitcoin, Litecoin, Kaspa miners with fast global shipping and B2B support." />
      </Helmet>
      
      <main>
        <HeroSection />
        <FeaturedProducts />
        <WhyChooseUs />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  );
};

export default Index;
