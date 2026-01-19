import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, X, Filter, Loader2, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { blogCategories, blogTags } from '@/lib/blogData';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import Layout from '@/components/Layout';
import PartnersSection from '@/components/PartnersSection';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const activeTag = searchParams.get('tag');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: blogPosts = [], isLoading } = useBlogPosts();

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (activeCategory) {
      posts = posts.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());
    }
    
    // Apply tag filter
    if (activeTag) {
      posts = posts.filter(post => post.tags.includes(activeTag));
    }
    
    return posts;
  }, [blogPosts, activeCategory, activeTag, searchQuery]);

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
  const otherPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  // Generate JSON-LD for blog listing
  const blogListingSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "MinerHaolan Mining Blog",
    "description": "Expert cryptocurrency mining guides, ASIC hardware reviews, profitability analysis, and industry news from Hong Kong's leading mining hardware supplier.",
    "url": "https://minerhaolan.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "MinerHaolan",
      "logo": {
        "@type": "ImageObject",
        "url": "https://minerhaolan.com/logo.png"
      }
    },
    "blogPost": blogPosts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.image,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "url": `https://minerhaolan.com/blog/${post.slug}`
    }))
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://minerhaolan.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://minerhaolan.com/blog"
      }
    ]
  };

  // FAQ schema for common mining questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the most profitable cryptocurrency to mine in 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bitcoin remains the most profitable for large-scale operations with efficient ASICs like the Antminer S21 XP. For smaller setups, Kaspa and Litecoin offer good returns with lower initial investment."
        }
      },
      {
        "@type": "Question",
        "name": "How do I choose the right ASIC miner?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Consider hashrate, power efficiency (J/TH), noise levels, and cooling requirements. Compare total cost of ownership including electricity costs in your region."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between air-cooled and hydro-cooled miners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Air-cooled miners use fans and are easier to set up but louder. Hydro-cooled miners use liquid cooling for better efficiency and lower noise, but require more complex infrastructure."
        }
      }
    ]
  };

  return (
    <Layout>
      <Helmet>
        <title>Crypto Mining Blog - ASIC Reviews, Guides & Profitability Tips | MinerHaolan</title>
        <meta name="description" content="Expert cryptocurrency mining guides, ASIC hardware reviews, Bitcoin & altcoin profitability analysis. Learn from Hong Kong's trusted mining equipment experts." />
        <meta name="keywords" content="crypto mining blog, ASIC miner reviews, Bitcoin mining guide, mining profitability, Antminer, Whatsminer, mining hardware" />
        <link rel="canonical" href="https://minerhaolan.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Crypto Mining Blog - Expert Guides & Hardware Reviews | MinerHaolan" />
        <meta property="og:description" content="Expert cryptocurrency mining guides, ASIC hardware reviews, and profitability analysis from Hong Kong's leading mining hardware supplier." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://minerhaolan.com/blog" />
        <meta property="og:image" content="https://minerhaolan.com/og-blog.jpg" />
        <meta property="og:site_name" content="MinerHaolan" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crypto Mining Blog | MinerHaolan" />
        <meta name="twitter:description" content="Expert mining guides, hardware reviews, and profitability tips." />
        <meta name="twitter:image" content="https://minerhaolan.com/og-blog.jpg" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="MinerHaolan" />
        <meta name="language" content="English" />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(blogListingSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/" itemProp="item" className="hover:text-primary transition-colors">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" className="text-foreground font-medium">Blog</span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>

          {/* Header with SEO-optimized content */}
          <header className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Crypto Mining Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Expert insights, ASIC hardware reviews, profitability calculators, and 
              step-by-step guides to maximize your cryptocurrency mining ROI.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search blog articles"
              />
            </div>
          </header>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              {(activeCategory || activeTag || searchQuery) && (
                <>
                  <span className="text-sm text-muted-foreground">Filtering by:</span>
                  {activeCategory && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {activeCategory}
                      <button onClick={() => setSearchParams(prev => { prev.delete('category'); return prev; })} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {activeTag && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {activeTag}
                      <button onClick={() => setSearchParams(prev => { prev.delete('tag'); return prev; })} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
                </>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <aside id="filter-panel" className="bg-muted/50 rounded-lg p-6 mb-8" aria-label="Blog filters">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Categories */}
                <div>
                  <h2 className="font-semibold mb-4">Categories</h2>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                    {blogCategories.map(category => (
                      <Badge 
                        key={category.id}
                        variant={activeCategory === category.name.toLowerCase() ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSearchParams({ category: category.name.toLowerCase() })}
                        role="button"
                        aria-pressed={activeCategory === category.name.toLowerCase()}
                      >
                        {category.name} ({category.count})
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <h2 className="font-semibold mb-4">Popular Tags</h2>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
                    {blogTags.slice(0, 12).map(tag => (
                      <Badge 
                        key={tag}
                        variant={activeTag === tag ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => setSearchParams({ tag })}
                        role="button"
                        aria-pressed={activeTag === tag}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {isLoading ? (
            <div className="flex justify-center py-16" aria-live="polite" aria-busy="true">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="sr-only">Loading articles...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16" role="status">
              <p className="text-xl text-muted-foreground mb-4">No articles found</p>
              <Button onClick={clearFilters}>Clear filters</Button>
            </div>
          ) : (
            <>
              {/* Results count for accessibility */}
              <p className="sr-only" role="status">{filteredPosts.length} articles found</p>

              {/* Featured Post */}
              {featuredPost && (
                <section className="mb-16" aria-labelledby="featured-heading">
                  <h2 id="featured-heading" className="sr-only">Featured Article</h2>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <article>
                      <Card className="overflow-hidden hover:border-primary/30 transition-colors">
                        <div className="grid lg:grid-cols-2">
                          <figure className="aspect-video lg:aspect-auto">
                            <img
                              src={featuredPost.image}
                              alt={featuredPost.title}
                              className="w-full h-full object-cover"
                              loading="eager"
                              width="600"
                              height="400"
                            />
                          </figure>
                          <CardContent className="p-8 flex flex-col justify-center">
                            <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                            <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors">
                              {featuredPost.title}
                            </h3>
                            <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {featuredPost.author}
                              </span>
                              <time dateTime={featuredPost.date} className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {featuredPost.date}
                              </time>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {featuredPost.readTime}
                              </span>
                            </div>
                            <Button className="w-fit group">
                              Read Article
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    </article>
                  </Link>
                </section>
              )}

              {/* Posts Grid */}
              <section aria-labelledby="articles-heading">
                <h2 id="articles-heading" className="sr-only">All Articles</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
        <PartnersSection />
      </main>
    </Layout>
  );
};

// Extracted component for better performance and readability
const BlogPostCard = ({ post }: { post: BlogPost }) => (
  <Link to={`/blog/${post.slug}`}>
    <article>
      <Card className="overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer h-full">
        <figure className="aspect-video overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            width="400"
            height="225"
          />
        </figure>
        <CardContent className="p-6">
          <Badge variant="secondary" className="mb-3">{post.category}</Badge>
          <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
          <footer className="flex items-center gap-4 text-xs text-muted-foreground">
            <time dateTime={post.date} className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.date}
            </time>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </footer>
        </CardContent>
      </Card>
    </article>
  </Link>
);

export default Blog;