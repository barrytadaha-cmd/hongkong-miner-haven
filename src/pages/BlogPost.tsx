import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { useBlogPost, useRelatedPosts } from '@/hooks/useBlogPosts';
import Layout from '@/components/Layout';

// Simple markdown renderer for content
const renderMarkdown = (content: string) => {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Underline
    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-4">$1</blockquote>')
    // Lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-6 w-full" />')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener">$1</a>')
    // Line breaks (preserve paragraphs)
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br/>');
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading } = useBlogPost(slug || '');
  const { data: relatedPosts = [] } = useRelatedPosts(post || null, 3);

  if (isLoading) {
    return (
      <Layout>
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="aspect-[21/9] rounded-xl mb-8" />
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-4 py-6">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

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
          {JSON.stringify({
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
                "url": "https://minerhaolan.com/logo.png"
              }
            }
          })}
        </script>
      </Helmet>

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

          {/* Article Content */}
          <div 
            className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-display prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${renderMarkdown(post.content)}</p>` }}
          />

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