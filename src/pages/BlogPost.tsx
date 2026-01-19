import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, ArrowLeft, Tag, User, Share2, BookOpen, ChevronUp } from 'lucide-react';
import { useBlogPost, useRelatedPosts } from '@/hooks/useBlogPosts';
import Layout from '@/components/Layout';
import { useState, useEffect, useMemo } from 'react';

// Enhanced markdown renderer with better semantic HTML
const renderMarkdown = (content: string) => {
  return content
    // Headers with proper IDs for anchor links
    .replace(/^### (.*$)/gim, (_, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `<h3 id="${id}" class="text-xl font-bold mt-8 mb-4 scroll-mt-24">${text}</h3>`;
    })
    .replace(/^## (.*$)/gim, (_, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `<h2 id="${id}" class="text-2xl font-bold mt-10 mb-4 scroll-mt-24">${text}</h2>`;
    })
    .replace(/^# (.*$)/gim, (_, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `<h1 id="${id}" class="text-3xl font-bold mt-10 mb-4 scroll-mt-24">${text}</h1>`;
    })
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Underline
    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
    // Code blocks with syntax highlighting class
    .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4 text-sm"><code class="language-$1">$2</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Blockquotes with better styling
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">$1</blockquote>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal mb-2">$1</li>')
    // Unordered lists
    .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc mb-2">$1</li>')
    // Images with figure and figcaption
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="my-6"><img src="$2" alt="$1" class="rounded-lg w-full" loading="lazy" /><figcaption class="text-sm text-muted-foreground text-center mt-2">$1</figcaption></figure>')
    // Links with proper attributes
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
    // Horizontal rule
    .replace(/^---$/gim, '<hr class="my-8 border-border" />')
    // Line breaks (preserve paragraphs)
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/\n/g, '<br/>');
};

// Extract headings for table of contents
const extractHeadings = (content: string) => {
  const headingRegex = /^(#{1,3}) (.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });
  }
  
  return headings;
};

// Calculate reading time from content
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const { data: post, isLoading } = useBlogPost(slug || '');
  const { data: relatedPosts = [] } = useRelatedPosts(post || null, 3);

  // Table of contents
  const headings = useMemo(() => {
    if (!post?.content) return [];
    return extractHeadings(post.content);
  }, [post?.content]);

  // Show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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
        <Helmet>
          <title>Article Not Found | MinerHaolan Blog</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>
        </main>
      </Layout>
    );
  }

  // Enhanced structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": {
      "@type": "ImageObject",
      "url": post.image,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://minerhaolan.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MinerHaolan",
      "logo": {
        "@type": "ImageObject",
        "url": "https://minerhaolan.com/logo.png",
        "width": 200,
        "height": 60
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://minerhaolan.com/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": `PT${calculateReadingTime(post.content)}M`
  };

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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://minerhaolan.com/blog/${post.slug}`
      }
    ]
  };

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | MinerHaolan - Crypto Mining Experts</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(", ")} />
        <meta name="author" content={post.author} />
        <link rel="canonical" href={`https://minerhaolan.com/blog/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://minerhaolan.com/blog/${post.slug}`} />
        <meta property="og:site_name" content="MinerHaolan" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.image} />
        <meta name="twitter:image:alt" content={post.title} />
        <meta name="twitter:site" content="@MinerHaolan" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4" itemScope itemType="https://schema.org/Article">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/" itemProp="item" className="hover:text-primary transition-colors">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/blog" itemProp="item" className="hover:text-primary transition-colors">
                  <span itemProp="name">Blog</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" className="text-foreground font-medium line-clamp-1">{post.title}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

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
          <figure className="aspect-[21/9] rounded-xl overflow-hidden mb-8">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
              itemProp="image"
              loading="eager"
              width="1200"
              height="514"
            />
          </figure>

          <div className="grid lg:grid-cols-[1fr_280px] gap-8 max-w-6xl mx-auto">
            <div>
              {/* Article Header */}
              <header className="mb-12">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Link to={`/blog?category=${post.category.toLowerCase()}`}>
                    <Badge className="cursor-pointer hover:bg-primary/90">
                      {post.category}
                    </Badge>
                  </Link>
                </div>
                
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6" itemProp="headline">
                  {post.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8" itemProp="description">
                  {post.excerpt}
                </p>

                {/* Author & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-border">
                  <div className="flex items-center gap-3" itemProp="author" itemScope itemType="https://schema.org/Person">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      className="w-12 h-12 rounded-full object-cover"
                      loading="lazy"
                      width="48"
                      height="48"
                    />
                    <div>
                      <p className="font-medium" itemProp="name">{post.author}</p>
                      <p className="text-sm text-muted-foreground">Author</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <time dateTime={post.date} itemProp="datePublished" className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </time>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span itemProp="timeRequired">{post.readTime}</span>
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <div 
                className="prose prose-lg dark:prose-invert prose-headings:font-display prose-a:text-primary max-w-none"
                itemProp="articleBody"
                dangerouslySetInnerHTML={{ __html: `<p class="mb-4 leading-relaxed">${renderMarkdown(post.content)}</p>` }}
              />

              {/* Tags */}
              <footer className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap items-center gap-2" itemProp="keywords">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map(tag => (
                    <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </footer>
            </div>

            {/* Sidebar - Table of Contents */}
            {headings.length > 3 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  <Card>
                    <CardContent className="p-4">
                      <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Table of Contents
                      </h2>
                      <nav aria-label="Table of contents">
                        <ul className="space-y-2 text-sm">
                          {headings.map((heading, index) => (
                            <li 
                              key={index} 
                              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                            >
                              <a 
                                href={`#${heading.id}`}
                                className="text-muted-foreground hover:text-primary transition-colors line-clamp-2"
                              >
                                {heading.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            )}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="container mx-auto px-4 mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedPosts.map(relatedPost => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <article>
                    <Card className="overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer h-full">
                      <figure className="aspect-video overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          width="400"
                          height="225"
                        />
                      </figure>
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3">{relatedPost.category}</Badge>
                        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                      </CardContent>
                    </Card>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </Layout>
  );
};

export default BlogPost;