import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, X, Filter, Loader2 } from 'lucide-react';
import { blogCategories, blogTags } from '@/lib/blogData';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import Layout from '@/components/Layout';
import PartnersSection from '@/components/PartnersSection';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const activeTag = searchParams.get('tag');
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: blogPosts = [], isLoading } = useBlogPosts();

  const filteredPosts = useMemo(() => {
    if (activeCategory) {
      return blogPosts.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (activeTag) {
      return blogPosts.filter(post => post.tags.includes(activeTag));
    }
    return blogPosts;
  }, [blogPosts, activeCategory, activeTag]);

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
  const otherPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <Layout>
      <Helmet>
        <title>Mining Blog - Guides, Reviews & Industry News | MinerHaolan</title>
        <meta name="description" content="Expert guides, hardware reviews, and industry analysis for cryptocurrency miners. Stay updated with the latest mining hardware and strategies." />
        <meta property="og:title" content="Mining Blog | MinerHaolan" />
        <meta property="og:description" content="Expert insights, hardware reviews, and guides to help you maximize your mining operations." />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Mining Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert insights, hardware reviews, and guides to help you maximize 
              your mining operations.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              {(activeCategory || activeTag) && (
                <>
                  <span className="text-sm text-muted-foreground">Filtering by:</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {activeCategory || activeTag}
                    <button onClick={clearFilters} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogCategories.map(category => (
                      <Badge 
                        key={category.id}
                        variant={activeCategory === category.name.toLowerCase() ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSearchParams({ category: category.name.toLowerCase() })}
                      >
                        {category.name} ({category.count})
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <h3 className="font-semibold mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogTags.slice(0, 12).map(tag => (
                      <Badge 
                        key={tag}
                        variant={activeTag === tag ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => setSearchParams({ tag })}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No posts found</p>
              <Button onClick={clearFilters}>Clear filters</Button>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-16">
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <Card className="overflow-hidden hover:border-primary/30 transition-colors">
                      <div className="grid lg:grid-cols-2">
                        <div className="aspect-video lg:aspect-auto">
                          <img
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-8 flex flex-col justify-center">
                          <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors">
                            {featuredPost.title}
                          </h2>
                          <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {featuredPost.date}
                            </span>
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
                  </Link>
                </div>
              )}

              {/* Posts Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer h-full">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        <PartnersSection />
      </main>
    </Layout>
  );
};

export default Blog;