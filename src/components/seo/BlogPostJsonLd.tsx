import { Helmet } from 'react-helmet-async';

interface RelatedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  hashrate?: string;
  algorithm?: string;
}

interface BlogPostJsonLdProps {
  post: {
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    authorAvatar?: string;
    date: string;
    slug: string;
    category?: string;
    tags?: string[];
    readTime?: string;
  };
  relatedProducts?: RelatedProduct[];
  baseUrl?: string;
}

export const BlogPostJsonLd = ({ 
  post, 
  relatedProducts = [], 
  baseUrl = 'https://minerhaolan.lovable.app' 
}: BlogPostJsonLdProps) => {
  const articleUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`;

  // Parse date string to ISO format
  const publishDate = new Date(post.date).toISOString();

  // Build the @graph array with Article and related Products
  const graphItems: any[] = [
    {
      "@type": "Article",
      "@id": articleUrl,
      "headline": post.title,
      "description": post.excerpt,
      "image": imageUrl,
      "datePublished": publishDate,
      "dateModified": publishDate,
      "author": {
        "@type": "Person",
        "name": post.author,
        ...(post.authorAvatar && { "image": post.authorAvatar })
      },
      "publisher": {
        "@type": "Organization",
        "name": "MinerHaolan",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/favicon.ico`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl
      },
      ...(post.tags && post.tags.length > 0 && {
        "keywords": post.tags.join(", ")
      }),
      ...(post.category && {
        "articleSection": post.category
      }),
      // Link to related products using @id canonicalization
      ...(relatedProducts.length > 0 && {
        "mentions": relatedProducts.map(product => ({
          "@type": "Product",
          "@id": `${baseUrl}/product/${product.id}`
        }))
      })
    }
  ];

  // Add full Product entities to the graph for SEO canonicalization
  relatedProducts.forEach(product => {
    const productUrl = `${baseUrl}/product/${product.id}`;
    const productImage = product.image.startsWith('http') 
      ? product.image 
      : `${baseUrl}${product.image}`;
    
    const sku = product.name
      .toUpperCase()
      .replace(/\s+/g, '-')
      .replace(/[^A-Z0-9-]/g, '')
      .substring(0, 20);

    graphItems.push({
      "@type": "Product",
      "@id": productUrl,
      "name": `${product.brand} ${product.name}${product.hashrate ? ` ${product.hashrate}` : ''}${product.algorithm ? ` ${product.algorithm}` : ''} Miner`,
      "image": productImage,
      "brand": {
        "@type": "Brand",
        "name": product.brand
      },
      "sku": sku,
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "USD",
        "price": product.price,
        "availability": "https://schema.org/InStock"
      }
    });
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graphItems
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

export default BlogPostJsonLd;
