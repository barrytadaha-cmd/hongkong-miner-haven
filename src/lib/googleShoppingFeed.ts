/**
 * Google Shopping XML Feed Generator
 * Server-side utility for generating compliant product feeds
 * Google Category ID 4285: Industrial > Mining
 */

export interface ShoppingProduct {
  id: string;
  sku: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  price: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  condition: 'new' | 'refurbished' | 'used';
  brand: string;
  gtin?: string;
  mpn?: string;
  googleProductCategory: string;
  productType?: string;
  customLabel0?: string;
  customLabel1?: string;
  shipping?: {
    country: string;
    price: string;
  };
}

const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const generateGoogleShoppingFeed = (
  products: ShoppingProduct[],
  siteUrl: string = 'https://minerhaolan.shop'
): string => {
  const feedDate = new Date().toISOString();
  
  const itemsXml = products.map(product => `
    <item>
      <g:id>${escapeXml(product.sku)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      <g:description>${escapeXml(product.description.slice(0, 5000))}</g:description>
      <g:link>${escapeXml(`${siteUrl}/shop/${product.id}`)}</g:link>
      <g:image_link>${escapeXml(product.imageLink.startsWith('http') ? product.imageLink : `${siteUrl}${product.imageLink}`)}</g:image_link>
      <g:availability>${product.availability}</g:availability>
      <g:price>${product.price.toFixed(2)} ${product.currency}</g:price>
      <g:condition>${product.condition}</g:condition>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      <g:google_product_category>4285</g:google_product_category>
      <g:product_type>${escapeXml(product.productType || 'Industrial > Crypto Mining Equipment')}</g:product_type>
      ${product.mpn ? `<g:mpn>${escapeXml(product.mpn)}</g:mpn>` : ''}
      ${product.gtin ? `<g:gtin>${escapeXml(product.gtin)}</g:gtin>` : '<g:identifier_exists>false</g:identifier_exists>'}
      ${product.customLabel0 ? `<g:custom_label_0>${escapeXml(product.customLabel0)}</g:custom_label_0>` : ''}
      ${product.customLabel1 ? `<g:custom_label_1>${escapeXml(product.customLabel1)}</g:custom_label_1>` : ''}
      ${product.shipping ? `
      <g:shipping>
        <g:country>${product.shipping.country}</g:country>
        <g:price>${product.shipping.price}</g:price>
      </g:shipping>` : ''}
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>MinerHaolan - Crypto Mining Equipment</title>
    <link>${siteUrl}</link>
    <description>Premium ASIC miners and cryptocurrency mining equipment. Bitcoin, Kaspa, Litecoin miners with worldwide shipping.</description>
    <lastBuildDate>${feedDate}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;
};

/**
 * Transform database products to Google Shopping format
 */
export interface DBProductForFeed {
  id: string;
  name: string;
  brand: string | null;
  description: string | null;
  price: number;
  stock: string | null;
  category: string;
  algorithm: string | null;
  hashrate: string | null;
}

export const transformProductsForFeed = (
  products: DBProductForFeed[],
  primaryImages: Record<string, string>
): ShoppingProduct[] => {
  return products.map(product => ({
    id: product.id,
    sku: `MH-${product.id.slice(0, 8).toUpperCase()}`,
    title: `${product.name} - ${product.hashrate || ''} ${product.algorithm || ''} Miner`.trim(),
    description: product.description || `${product.name} cryptocurrency mining hardware from ${product.brand}`,
    link: `/shop/${product.id}`,
    imageLink: primaryImages[product.id] || '/placeholder.svg',
    price: product.price,
    currency: 'USD',
    availability: product.stock === 'in-stock' ? 'in_stock' : 
                  product.stock === 'pre-order' ? 'preorder' : 'out_of_stock',
    condition: 'new',
    brand: product.brand || 'Generic',
    googleProductCategory: '4285',
    productType: getCategoryProductType(product.category),
    mpn: product.name.replace(/\s+/g, '-').toUpperCase(),
    customLabel0: product.category,
    customLabel1: product.algorithm || undefined,
    shipping: {
      country: 'US',
      price: '0 USD'
    }
  }));
};

const getCategoryProductType = (category: string): string => {
  const categoryMap: Record<string, string> = {
    bitcoin: 'Industrial > Mining Equipment > Bitcoin ASIC Miners',
    litecoin: 'Industrial > Mining Equipment > Scrypt ASIC Miners',
    kaspa: 'Industrial > Mining Equipment > Kaspa KHeavyHash Miners',
    zcash: 'Industrial > Mining Equipment > Equihash ASIC Miners',
    ethereum: 'Industrial > Mining Equipment > EtHash ASIC Miners',
    home: 'Industrial > Mining Equipment > Home Mining Devices',
    heater: 'Industrial > Mining Equipment > Bitcoin Heaters',
    altcoin: 'Industrial > Mining Equipment > Altcoin ASIC Miners'
  };
  return categoryMap[category] || 'Industrial > Mining Equipment';
};

/**
 * Generate Product Schema for embedding in blog posts
 * Designed to be nested inside Article schema for SEO
 */
export interface ProductSchemaData {
  name: string;
  description: string;
  image: string;
  sku: string;
  brand: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
  category?: string;
}

export const generateProductSchema = (product: ProductSchemaData) => ({
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "sku": product.sku,
  "brand": {
    "@type": "Brand",
    "name": product.brand
  },
  "offers": {
    "@type": "Offer",
    "url": product.url,
    "priceCurrency": product.currency || "USD",
    "price": product.price,
    "availability": `https://schema.org/${product.availability || 'InStock'}`,
    "seller": {
      "@type": "Organization",
      "name": "MinerHaolan"
    }
  }
});

/**
 * Generate Article schema with nested Product mentions
 */
export const generateArticleWithProductsSchema = (
  article: {
    headline: string;
    description: string;
    image: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    url: string;
  },
  mentionedProducts: ProductSchemaData[]
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.headline,
  "description": article.description,
  "image": article.image,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "MinerHaolan",
    "logo": {
      "@type": "ImageObject",
      "url": "https://minerhaolan.shop/logo.png"
    }
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  },
  "mentions": mentionedProducts.map(generateProductSchema)
});
