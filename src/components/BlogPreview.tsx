import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogPosts } from '@/lib/blogData';
const BlogPreview = () => {
  const featuredPosts = blogPosts.slice(0, 3);
  return <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <h2 className="font-display text-3xl font-extrabold md:text-5xl">
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
          {featuredPosts.map(post => <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" />
                    {post.date}
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
            </Link>)}
        </div>
      </div>
    </section>;
};
export default BlogPreview;