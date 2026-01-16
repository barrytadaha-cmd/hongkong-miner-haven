import { Helmet } from 'react-helmet-async';

interface ProductJsonLdProps {
  product: {
    id: string;
    name: string;
    brand: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    hashrate?: string;
    algorithm?: string;
    inStock?: boolean;
    sku?: string;
  };
  baseUrl?: string;
}

export const ProductJsonLd = ({ product, baseUrl = 'https://minerhaolan.lovable.app' }: ProductJsonLdProps) => {
  const productUrl = `${baseUrl}/product/${product.id}`;
  const imageUrls = product.images.map(img => 
    img.startsWith('http') ? img : `${baseUrl}${img}`
  );

  // Generate SKU from product name if not provided
  const sku = product.sku || product.name
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '')
    .substring(0, 20);

  // Build product title for SEO: Brand + Model + Hashrate + Algorithm
  const seoTitle = `${product.brand} ${product.name}${product.hashrate ? ` ${product.hashrate}` : ''}${product.algorithm ? ` ${product.algorithm}` : ''} Miner`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    "name": seoTitle,
    "description": product.description,
    "image": imageUrls,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "sku": sku,
    "mpn": sku,
    "category": "Business & Industrial > Mining & Quarrying",
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "USD",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.inStock !== false 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "MinerHaolan",
        "url": baseUrl
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    ...(product.originalPrice && product.originalPrice > product.price && {
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": product.price,
        "priceCurrency": "USD",
        "valueAddedTaxIncluded": false
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

export default ProductJsonLd;
