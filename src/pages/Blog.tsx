import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    id: 1,
    title: 'Bitcoin Mining with Solar Panels: A Complete Guide',
    excerpt: 'Learn how to combine photovoltaic systems with ASIC miners for eco-friendly and cost-effective mining operations.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
    category: 'Guides',
    date: 'Dec 15, 2025',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: 'ASIC Miner Manufacturers: The Complete Guide for 2026',
    excerpt: 'Compare Bitmain, MicroBT, Canaan, and other leading manufacturers. Learn which brand is right for your needs.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    category: 'Industry',
    date: 'Dec 10, 2025',
    readTime: '12 min read',
  },
  {
    id: 3,
    title: 'Antminer S21 Pro Review: Is 234 TH/s Worth It?',
    excerpt: 'Our hands-on review of Bitmain\'s latest flagship miner. Performance tests, noise levels, and profitability analysis.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
    category: 'Reviews',
    date: 'Dec 5, 2025',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Home Mining in 2026: Is It Still Profitable?',
    excerpt: 'Analysis of home mining profitability with current difficulty levels and electricity costs across different regions.',
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=600&h=400&fit=crop',
    category: 'Analysis',
    date: 'Nov 28, 2025',
    readTime: '10 min read',
  },
  {
    id: 5,
    title: 'Kaspa Mining: Why KHeavyHash Miners Are Selling Out',
    excerpt: 'Understanding the Kaspa blockchain and why miners are rushing to get KS5 and other KHeavyHash ASICs.',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600&h=400&fit=crop',
    category: 'Altcoins',
    date: 'Nov 20, 2025',
    readTime: '7 min read',
  },
  {
    id: 6,
    title: 'Setting Up a Mining Farm in Hong Kong: Legal Guide',
    excerpt: 'Everything you need to know about regulations, electricity contracts, and licensing for commercial mining in HK.',
    image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&h=400&fit=crop',
    category: 'Business',
    date: 'Nov 15, 2025',
    readTime: '15 min read',
  },
];

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Mining Blog | MinerHoalan</title>
        <meta name="description" content="Expert guides, reviews, and industry analysis for cryptocurrency miners. Stay updated with the latest mining hardware and strategies." />
      </Helmet>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Mining Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert insights, hardware reviews, and guides to help you maximize 
              your mining operations.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Card className="overflow-hidden hover:border-primary/30 transition-colors">
              <div className="grid lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">{blogPosts[0].category}</Badge>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {blogPosts[0].date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {blogPosts[0].readTime}
                    </span>
                  </div>
                  <Button className="w-fit group">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer">
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
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Blog;
