import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml; charset=utf-8',
};

interface Product {
  id: string;
  name: string;
  brand: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  stock: string | null;
  hashrate: string | null;
  algorithm: string | null;
  power: string | null;
  efficiency: string | null;
}

interface ProductImage {
  product_id: string;
  image_url: string;
  is_primary: boolean | null;
}

Deno.serve(async (req) => {
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
      .order('name');

    if (productsError) throw productsError;

    // Fetch all product images
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*');

    if (imagesError) throw imagesError;

    // Create image map
    const imageMap = new Map<string, string>();
    (images as ProductImage[])?.forEach(img => {
      if (img.is_primary || !imageMap.has(img.product_id)) {
        imageMap.set(img.product_id, img.image_url);
      }
    });

    const baseUrl = 'https://minerhaolan.lovable.app';
    const now = new Date().toISOString();

    // Generate XML feed
    const xmlItems = (products as Product[])?.map(product => {
      const imageUrl = imageMap.get(product.id) || '/placeholder.svg';
      const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
      
      // Generate SKU: Brand abbreviation + Model
      const sku = `${(product.brand || 'GEN').substring(0, 3).toUpperCase()}-${product.name
        .toUpperCase()
        .replace(/\s+/g, '-')
        .replace(/[^A-Z0-9-]/g, '')
        .substring(0, 20)}`;

      // Build title: Brand + Model + Hashrate + Algorithm
      const title = [
        product.brand,
        product.name,
        product.hashrate,
        product.algorithm ? `${product.algorithm} Miner` : 'Miner'
      ].filter(Boolean).join(' ');

      // Build description with tech specs
      const description = [
        product.description,
        product.hashrate && `Hashrate: ${product.hashrate}`,
        product.power && `Power: ${product.power}`,
        product.efficiency && `Efficiency: ${product.efficiency}`
      ].filter(Boolean).join('. ').substring(0, 5000);

      // Map stock status
      const availability = product.stock === 'out-of-stock' 
        ? 'out_of_stock' 
        : product.stock === 'pre-order' 
          ? 'preorder' 
          : 'in_stock';

      // Map category to Google taxonomy
      // 4285 = Business & Industrial > Mining & Quarrying
      const googleCategory = '4285';

      return `
    <item>
      <g:id><![CDATA[${sku}]]></g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${baseUrl}/product/${product.id}</g:link>
      <g:image_link>${fullImageUrl}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price.toFixed(2)} USD</g:price>
      ${product.original_price && product.original_price > product.price 
        ? `<g:sale_price>${product.price.toFixed(2)} USD</g:sale_price>` 
        : ''}
      <g:brand><![CDATA[${product.brand || 'Generic'}]]></g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type><![CDATA[Cryptocurrency Mining Hardware > ${product.category}]]></g:product_type>
      <g:mpn><![CDATA[${sku}]]></g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>0 USD</g:price>
      </g:shipping>
    </item>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>MinerHaolan - Cryptocurrency Mining Hardware</title>
    <link>${baseUrl}</link>
    <description>Premium cryptocurrency mining hardware. Authorized dealer for Bitmain, MicroBT, Canaan, IceRiver and more.</description>
    <lastBuildDate>${now}</lastBuildDate>
    ${xmlItems}
  </channel>
</rss>`;

    return new Response(xml, { 
      headers: corsHeaders,
      status: 200 
    });

  } catch (error) {
    console.error('Error generating feed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Error generating feed: ${errorMessage}</message>
</error>`,
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
        status: 500 
      }
    );
  }
});
