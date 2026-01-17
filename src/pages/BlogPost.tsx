import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Tag } from 'lucide-react';
import { getPostBySlug, getRelatedPosts, productLinks } from '@/lib/blogData';
import { generateArticleWithProductsSchema, ProductSchemaData } from '@/lib/googleShoppingFeed';
import Layout from '@/components/Layout';
import LivePriceTicker from '@/components/blog/LivePriceTicker';
import StickySidebar from '@/components/blog/StickySidebar';
import AIOSummaryBox from '@/components/blog/AIOSummaryBox';
import ProfitabilityCalculator from '@/components/blog/ProfitabilityCalculator';

// Map of article slugs to their mentioned products for schema injection
const articleProductsMap: Record<string, ProductSchemaData[]> = {
  'antminer-s21-pro-vs-s21-xp-hydro-2026-roi-showdown': [
    {
      name: 'Antminer S21 Pro',
      description: 'Air-cooled Bitcoin miner with 234 TH/s hashrate and 15.0 J/TH efficiency',
      image: 'https://minerhaolan.shop/products/antminer-s21-pro-1.jpg',
      sku: 'MH-S21-PRO',
      brand: 'Bitmain',
      price: 2980,
      url: 'https://minerhaolan.shop/shop?search=antminer+s21+pro',
      availability: 'InStock'
    },
    {
      name: 'Antminer S21 XP Hydro',
      description: 'Liquid-cooled Bitcoin miner with 473 TH/s hashrate and industry-leading 12.0 J/TH efficiency',
      image: 'https://minerhaolan.shop/products/antminer-s21-hyd-1.png',
      sku: 'MH-S21-XP-HYD',
      brand: 'Bitmain',
      price: 8500,
      url: 'https://minerhaolan.shop/shop?search=s21+xp+hyd',
      availability: 'InStock'
    }
  ],
  'kaspa-mining-2026-iceriver-ks5m-vs-ks0-ultra': [
    {
      name: 'IceRiver KS5M',
      description: 'Industrial Kaspa miner with 15 TH/s KHeavyHash performance at 3400W',
      image: 'https://minerhaolan.shop/products/iceriver-ks3m-1.png',
      sku: 'MH-KS5M',
      brand: 'IceRiver',
      price: 1599,
      url: 'https://minerhaolan.shop/shop?search=ks5m',
      availability: 'InStock'
    },
    {
      name: 'IceRiver KS0 Ultra',
      description: 'Silent home Kaspa miner with 400 GH/s at only 100W and 10dB noise level',
      image: 'https://minerhaolan.shop/products/iceriver-ks3m-1.png',
      sku: 'MH-KS0-ULTRA',
      brand: 'IceRiver',
      price: 129,
      url: 'https://minerhaolan.shop/shop?search=ks0+ultra',
      availability: 'InStock'
    }
  ],
  'monero-mining-antminer-x9-revolution-2026': [
    {
      name: 'Antminer X9',
      description: 'Revolutionary RandomX ASIC delivering 1 MH/s Monero hashrate - equivalent to 40+ Ryzen 9 CPUs',
      image: 'https://minerhaolan.shop/products/antminer-l9-1.jpg',
      sku: 'MH-X9',
      brand: 'Bitmain',
      price: 4999,
      url: 'https://minerhaolan.shop/shop?search=antminer+x9',
      availability: 'InStock'
    }
  ]
};

// Map of article slugs to AIO summary content
const articleAIOSummaries: Record<string, { summary: string; bullets?: string[] }> = {
  'antminer-s21-pro-vs-s21-xp-hydro-2026-roi-showdown': {
    summary: 'Winner for Home: S21 Pro (Air). Winner for Farms: S21 XP (Hydro).',
    bullets: [
      'S21 Pro: 234 TH/s, 15.0 J/TH, simple air-cooled setup',
      'S21 XP Hydro: 473 TH/s, 12.0 J/TH, requires 3-phase power and DN10 connectors',
      'Hydro achieves 20% better efficiency due to water\'s 4x heat capacity vs air'
    ]
  },
  'kaspa-mining-2026-iceriver-ks5m-vs-ks0-ultra': {
    summary: 'KS5M is for profit maximization (15 TH/s). KS0 Ultra is for silent home use (100W).',
    bullets: [
      'KS5M: 15 TH/s at 75dB — industrial scale operation',
      'KS0 Ultra: 400 GH/s at 10dB — whisper quiet for apartments',
      'High-power machines accelerate network difficulty, shortening older unit lifespan'
    ]
  },
  'monero-mining-antminer-x9-revolution-2026': {
    summary: 'The X9 breaks RandomX ASIC resistance. 1 Unit = 40+ CPUs.',
    bullets: [
      'X9 delivers 1 MH/s at 2472W — equivalent to 42 Ryzen 9 7950X CPUs',
      '65% less power consumption vs equivalent CPU hashpower',
      '83% lower hardware cost for the same performance'
    ]
  }
};

// Map of articles to their featured product for sticky sidebar
const articleStickyProducts: Record<string, string> = {
  'antminer-s21-pro-vs-s21-xp-hydro-2026-roi-showdown': 'S21 Pro',
  'kaspa-mining-2026-iceriver-ks5m-vs-ks0-ultra': 'KS5M',
  'monero-mining-antminer-x9-revolution-2026': 'X9'
};

// Map of articles to inline product tickers
const articlePriceTickers: Record<string, string[]> = {
  'antminer-s21-pro-vs-s21-xp-hydro-2026-roi-showdown': ['S21 Pro', 'S21 XP Hyd'],
  'kaspa-mining-2026-iceriver-ks5m-vs-ks0-ultra': ['KS5M', 'KS0 Ultra'],
  'monero-mining-antminer-x9-revolution-2026': ['X9']
};

// Map of articles to calculator miner specs
interface MinerSpec {
  name: string;
  hashrate: number;
  power: number;
  price: number;
  coin: 'BTC' | 'KAS' | 'XMR';
  dailyRevenue: number;
}

const articleCalculatorMiners: Record<string, MinerSpec[]> = {
  'antminer-s21-pro-vs-s21-xp-hydro-2026-roi-showdown': [
    { name: 'Antminer S21 Pro', hashrate: 234, power: 3510, price: 2980, coin: 'BTC', dailyRevenue: 28.50 },
    { name: 'Antminer S21 XP Hydro', hashrate: 473, power: 5676, price: 8500, coin: 'BTC', dailyRevenue: 57.60 },
  ],
  'kaspa-mining-2026-iceriver-ks5m-vs-ks0-ultra': [
    { name: 'IceRiver KS5M', hashrate: 15, power: 3400, price: 1599, coin: 'KAS', dailyRevenue: 12.75 },
    { name: 'IceRiver KS0 Ultra', hashrate: 0.4, power: 100, price: 129, coin: 'KAS', dailyRevenue: 0.34 },
  ],
  'monero-mining-antminer-x9-revolution-2026': [
    { name: 'Antminer X9', hashrate: 1, power: 2472, price: 4999, coin: 'XMR', dailyRevenue: 3.50 },
  ],
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = getPostBySlug(slug || '');

  if (!post) {
    return (
      <Layout>
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>
        </main>
      </Layout>
    );
  }

  const relatedPosts = getRelatedPosts(post, 3);
  
  // Get product schema data for this article
  const mentionedProducts = articleProductsMap[slug || ''] || [];
  const aioSummary = articleAIOSummaries[slug || ''];
  const stickyProduct = articleStickyProducts[slug || ''];
  const priceTickers = articlePriceTickers[slug || ''] || [];
  const calculatorMiners = articleCalculatorMiners[slug || ''] || [];

  // Generate enhanced schema with nested products
  const enhancedSchema = mentionedProducts.length > 0
    ? generateArticleWithProductsSchema(
        {
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          author: post.author,
          datePublished: post.date,
          url: `https://minerhaolan.shop/blog/${post.slug}`
        },
        mentionedProducts
      )
    : {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "datePublished": post.date,
        "publisher": {
          "@type": "Organization",
          "name": "MinerHaolan",
          "logo": {
            "@type": "ImageObject",
            "url": "https://minerhaolan.shop/logo.png"
          }
        }
      };

  // Process content to add product links
  const processedContent = post.content
    .replace(/\n/g, '<br/>')
    .replace(/## /g, '</p><h2>')
    .replace(/### /g, '</p><h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\|(.*?)\|/g, '<td>$1</td>') // Basic table support
    // Add product links
    .replace(/Antminer S21 Pro/g, `<a href="${productLinks['s21-pro']}" class="text-primary hover:underline font-medium">Antminer S21 Pro</a>`)
    .replace(/S21 XP Hydro/g, `<a href="${productLinks['s21-xp-hydro']}" class="text-primary hover:underline font-medium">S21 XP Hydro</a>`)
    .replace(/hydro infrastructure/gi, `<a href="${productLinks['s21-xp-hydro']}" class="text-primary hover:underline font-medium">hydro infrastructure</a>`)
    .replace(/IceRiver KS5M/g, `<a href="${productLinks['ks5m']}" class="text-primary hover:underline font-medium">IceRiver KS5M</a>`)
    .replace(/KS0 Ultra/g, `<a href="${productLinks['ks0-ultra']}" class="text-primary hover:underline font-medium">KS0 Ultra</a>`)
    .replace(/Antminer X9/g, `<a href="${productLinks['antminer-x9']}" class="text-primary hover:underline font-medium">Antminer X9</a>`);

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | MinerHaolan Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.image} />
        <script type="application/ld+json">
          {JSON.stringify(enhancedSchema)}
        </script>
      </Helmet>

      {/* Sticky Sidebar for featured product */}
      {stickyProduct && <StickySidebar productName={stickyProduct} />}

      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          {/* Hero Image */}
          <div className="aspect-[21/9] rounded-xl overflow-hidden mb-8">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Header */}
          <header className="max-w-3xl mx-auto mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <Link to={`/blog?category=${post.category.toLowerCase()}`}>
                <Badge className="cursor-pointer hover:bg-primary/90">
                  {post.category}
                </Badge>
              </Link>
              {post.featured && (
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              {post.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <img 
                  src={post.authorAvatar} 
                  alt={post.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </header>

          {/* AIO Summary Box for 2026 articles */}
          {aioSummary && (
            <div className="max-w-3xl mx-auto">
              <AIOSummaryBox 
                title="Quick Answer" 
                summary={aioSummary.summary}
                bullets={aioSummary.bullets}
              />
            </div>
          )}

          {/* Live Price Tickers */}
          {priceTickers.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-4">
              {priceTickers.map((productName, index) => (
                <LivePriceTicker key={index} productName={productName} />
              ))}
            </div>
          )}

          {/* Article Content */}
          <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-display prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-table:border-collapse prose-td:border prose-td:border-border prose-td:p-2 prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted">
            <div dangerouslySetInnerHTML={{ __html: processedContent }} />
          </div>

          {/* Profitability Calculator */}
          {calculatorMiners.length > 0 && (
            <div className="max-w-3xl mx-auto mt-12">
              <ProfitabilityCalculator miners={calculatorMiners} />
            </div>
          )}

          {/* Tags */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map(tag => (
                <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="container mx-auto px-4 mt-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedPosts.map(relatedPost => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <Card className="overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer h-full">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3">{relatedPost.category}</Badge>
                      <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
};

export default BlogPost;
