import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { algorithms } from '@/lib/algorithmData';
import { products as staticProducts } from '@/lib/data';
import { useDBProducts, useHasDBProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Cpu,
  TrendingUp,
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Coins,
  Calculator,
  BookOpen
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AlgorithmLanding() {
  const { algorithm } = useParams<{ algorithm: string }>();
  const algoData = algorithm ? algorithms[algorithm] : null;

  const { data: hasDBProducts } = useHasDBProducts();
  const { data: dbProducts } = useDBProducts();
  const products = hasDBProducts && dbProducts?.length ? dbProducts : staticProducts;

  const filteredProducts = useMemo(() => {
    if (!algoData) return [];
    return products.filter(p => p.category === algoData.category).slice(0, 6);
  }, [products, algoData]);

  if (!algoData) {
    return (
      <Layout>
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Algorithm Not Found</h1>
          <p className="text-muted-foreground mb-8">The algorithm you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/shop">Browse All Miners</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // JSON-LD FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": algoData.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // JSON-LD Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${algoData.name} ASIC Miners`,
    "itemListElement": filteredProducts.slice(0, 3).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD",
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
      }
    }))
  };

  return (
    <Layout>
      <Helmet>
        <title>{algoData.metaTitle}</title>
        <meta name="description" content={algoData.metaDescription} />
        <meta name="keywords" content={`${algoData.name} miner, ${algoData.coins.join(', ')}, ASIC miner, crypto mining, ${algoData.name} ASIC`} />
        <link rel="canonical" href={`https://minerhaolan.com/miners/${algorithm}`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{algoData.name} Miners</span>
          </nav>

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            {/* Algorithm Badge */}
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm border-primary/50">
                <Cpu className="h-3.5 w-3.5 mr-2" />
                {algoData.fullName}
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1 
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              {algoData.heroTitle}
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8 max-w-2xl"
            >
              {algoData.heroSubtitle}
            </motion.p>

            {/* Supported Coins */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-sm text-muted-foreground">Mine:</span>
              {algoData.coins.map((coin) => (
                <Badge key={coin} className="bg-accent/10 text-accent border-accent/20">
                  <Coins className="h-3 w-3 mr-1" />
                  {coin}
                </Badge>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to={`/shop?category=${algoData.category}`}>
                  Shop {algoData.name} Miners
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  Request Quote
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <div className="container mx-auto px-4 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, label: 'Products', value: `${filteredProducts.length}+ Models` },
              { icon: Zap, label: 'Best Efficiency', value: 'Top Rated' },
              { icon: Shield, label: 'Warranty', value: '180 Days' },
              { icon: CheckCircle2, label: 'In Stock', value: 'Ready to Ship' }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 text-center"
              >
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="font-display text-3xl font-bold">Understanding {algoData.name} Mining</h2>
            </div>
            
            <div className="prose prose-lg prose-invert max-w-none">
              {algoData.educationalIntro.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Buying Guide */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Buyer's Guide: What to Look For
              </h3>
              <ul className="space-y-4">
                {algoData.buyingGuide.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Top {algoData.name} Miners
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked selection of the most efficient and profitable {algoData.name} mining hardware
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to={`/shop?category=${algoData.category}`}>
                View All {algoData.name} Miners
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section with Schema */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Everything you need to know about {algoData.name} mining
            </p>

            <Accordion type="single" collapsible className="space-y-4">
              {algoData.faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="bg-background border border-border rounded-xl px-6 data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">Explore More</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/shop"
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
            >
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                All ASIC Miners
              </h3>
              <p className="text-sm text-muted-foreground">
                Browse our complete catalog of mining hardware
              </p>
            </Link>
            <Link
              to="/blog"
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
            >
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                Mining Guides
              </h3>
              <p className="text-sm text-muted-foreground">
                Learn about mining setup, optimization, and ROI
              </p>
            </Link>
            <Link
              to="/contact"
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
            >
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                Get Expert Advice
              </h3>
              <p className="text-sm text-muted-foreground">
                Contact our team for personalized recommendations
              </p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
