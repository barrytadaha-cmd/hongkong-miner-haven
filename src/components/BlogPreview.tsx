import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'The best mining computers for Bitcoin',
    excerpt: 'Comprehensive guide to choosing the right ASIC miner for your needs.',
    date: '2025-12-15',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    category: 'Mining Guide',
  },
  {
    id: 2,
    title: 'Mining KAS: What is Kaspa — Tips & Tricks',
    excerpt: 'Everything you need to know about Kaspa mining and profitability.',
    date: '2025-12-10',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
    category: 'Cryptocurrency',
  },
  {
    id: 3,
    title: 'Miner Haolan Center — S19 Bitcoin',
    excerpt: 'A look inside our Hong Kong mining facility and hosting services.',
    date: '2025-12-05',
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=400&h=250&fit=crop',
    category: 'Company News',
  },
];

const BlogPreview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Mining Blog
          </h2>
          <Button variant="outline" asChild>
            <Link to="/blog">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;