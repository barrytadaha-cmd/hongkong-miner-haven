import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import CategoryCards from '@/components/CategoryCards';
import FeaturedProducts from '@/components/FeaturedProducts';
import FeaturedProduct from '@/components/FeaturedProduct';
import HostingCTA from '@/components/HostingCTA';
import BlogPreview from '@/components/BlogPreview';
import PartnersSection from '@/components/PartnersSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import HelpSection from '@/components/HelpSection';
import FAQSection from '@/components/FAQSection';

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Miner Haolan - Your Provider for ASIC Miners | Hong Kong</title>
        <meta name="description" content="Order your ASIC miner for home or professional projects. Best price guarantee for crypto mining hardware. Bitcoin, Litecoin, Kaspa miners with fast global shipping." />
        <meta name="keywords" content="ASIC miner, Bitcoin miner, cryptocurrency mining, Antminer, Whatsminer, Hong Kong, crypto hardware" />
        <meta property="og:title" content="Miner Haolan - Your Provider for ASIC Miners" />
        <meta property="og:description" content="Order your ASIC miner for home or professional projects. Best price guarantee for crypto mining hardware." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://minerhaolan.com" />
      </Helmet>
      
      <main>
        <HeroSection />
        <CategoryCards />
        <FeaturedProduct />
        <FeaturedProducts />
        <HostingCTA />
        <BlogPreview />
        <PartnersSection />
        <TestimonialsSection />
        <HelpSection />
        <FAQSection />
      </main>
    </Layout>
  );
};

export default Index;