import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  name: string;
  brand: string | null;
  price: number;
  original_price: number | null;
  description: string | null;
  category: string;
  stock: string | null;
  algorithm: string | null;
  hashrate: string | null;
  power: string | null;
}

interface ProductImage {
  product_id: string;
  image_url: string;
  is_primary: boolean | null;
  sort_order: number | null;
}

function escapeXml(str: string | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getCategoryPath(category: string): string {
  const categoryMap: Record<string, string> = {
    'bitcoin': 'Electronics > Computers > Computer Components > Computer Hardware',
    'litecoin': 'Electronics > Computers > Computer Components > Computer Hardware',
    'kaspa': 'Electronics > Computers > Computer Components > Computer Hardware',
    'alephium': 'Electronics > Computers > Computer Components > Computer Hardware',
    'zcash': 'Electronics > Computers > Computer Components > Computer Hardware',
    'ethereum': 'Electronics > Computers > Computer Components > Computer Hardware',
    'monero': 'Electronics > Computers > Computer Components > Computer Hardware',
    'dogecoin': 'Electronics > Computers > Computer Components > Computer Hardware',
    'heaters': 'Home & Garden > Heating, Cooling & Air > Space Heaters',
    'home-miners': 'Electronics > Computers > Computer Components > Computer Hardware',
    'lottery-miners': 'Electronics > Computers > Computer Components > Computer Hardware',
  };
  return categoryMap[category] || 'Electronics > Computers > Computer Components > Computer Hardware';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    // Fetch all product images
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*');

    if (imagesError) throw imagesError;

    // Group images by product
    const imagesByProduct: Record<string, ProductImage[]> = {};
    (images || []).forEach((img: ProductImage) => {
      if (!imagesByProduct[img.product_id]) {
        imagesByProduct[img.product_id] = [];
      }
      imagesByProduct[img.product_id].push(img);
    });

    const baseUrl = 'https://minerhaolan.lovable.app';
    const now = new Date().toISOString();

    // Generate XML feed
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">
  <title>MinerHaolan - ASIC Miners Hong Kong</title>
  <link href="${baseUrl}" rel="alternate" type="text/html"/>
  <updated>${now}</updated>
  <author>
    <name>MinerHaolan</name>
  </author>
  <id>${baseUrl}/feed</id>
`;

    for (const product of (products || []) as Product[]) {
      const productImages = imagesByProduct[product.id] || [];
      const primaryImage = productImages.find(img => img.is_primary) || productImages[0];
      const imageUrl = primaryImage?.image_url 
        ? (primaryImage.image_url.startsWith('http') 
            ? primaryImage.image_url 
            : `${baseUrl}${primaryImage.image_url}`)
        : `${baseUrl}/products/antminer-s21-pro-1.jpg`;

      const additionalImages = productImages
        .filter(img => !img.is_primary)
        .slice(0, 9)
        .map(img => img.image_url.startsWith('http') ? img.image_url : `${baseUrl}${img.image_url}`);

      const availability = product.stock === 'in-stock' ? 'in_stock' : 
                          product.stock === 'pre-order' ? 'preorder' : 'out_of_stock';

      const description = product.description || 
        `${product.name} - ${product.hashrate || ''} ${product.algorithm || ''} miner with ${product.power || ''} power consumption. Professional cryptocurrency mining hardware from ${product.brand || 'top manufacturer'}.`;

      xml += `
  <entry>
    <g:id>${escapeXml(product.id)}</g:id>
    <g:title>${escapeXml(product.name)}</g:title>
    <g:description>${escapeXml(description)}</g:description>
    <g:link>${baseUrl}/product/${product.id}</g:link>
    <g:image_link>${escapeXml(imageUrl)}</g:image_link>`;

      // Add additional images
      for (const addImg of additionalImages) {
        xml += `
    <g:additional_image_link>${escapeXml(addImg)}</g:additional_image_link>`;
      }

      xml += `
    <g:availability>${availability}</g:availability>
    <g:price>${product.price.toFixed(2)} USD</g:price>`;

      if (product.original_price && product.original_price > product.price) {
        xml += `
    <g:sale_price>${product.price.toFixed(2)} USD</g:sale_price>`;
      }

      xml += `
    <g:brand>${escapeXml(product.brand || 'Unknown')}</g:brand>
    <g:condition>new</g:condition>
    <g:google_product_category>${getCategoryPath(product.category)}</g:google_product_category>
    <g:product_type>ASIC Miners > ${escapeXml(product.category.charAt(0).toUpperCase() + product.category.slice(1))}</g:product_type>
    <g:identifier_exists>false</g:identifier_exists>
    <g:shipping>
      <g:country>HK</g:country>
      <g:service>Standard</g:service>
      <g:price>0 USD</g:price>
    </g:shipping>
    <g:custom_label_0>${escapeXml(product.algorithm || 'Other')}</g:custom_label_0>
    <g:custom_label_1>${escapeXml(product.hashrate || '')}</g:custom_label_1>
    <g:custom_label_2>${escapeXml(product.power || '')}</g:custom_label_2>
  </entry>`;
    }

    xml += `
</feed>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating feed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate product feed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
