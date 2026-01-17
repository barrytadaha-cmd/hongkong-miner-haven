import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = 'https://minerhaolan.lovable.app';
    const now = new Date().toISOString();

    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, updated_at, category')
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    // Static pages with priorities
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/shop', priority: '0.9', changefreq: 'daily' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/faq', priority: '0.6', changefreq: 'weekly' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/compare', priority: '0.7', changefreq: 'weekly' },
      { url: '/repair-warranty', priority: '0.5', changefreq: 'monthly' },
    ];

    // Blog posts - hardcoded slugs from blogData.ts
    const blogSlugs = [
      'bitcoin-mining-solar-panels-complete-guide',
      'asic-miner-manufacturers-complete-guide-2026',
      'antminer-s21-pro-review',
      'home-mining-2026-still-profitable',
      'kaspa-mining-kheavyhash-guide',
      'mining-farm-hong-kong-legal-guide',
      'hydro-cooling-vs-air-cooling-miners',
      'litecoin-dogecoin-scrypt-mining-2026',
    ];

    // Algorithm landing pages
    const algorithms = [
      'sha256',
      'scrypt',
      'kheavyhash',
      'ethash',
      'blake3',
      'equihash',
      'randomx',
    ];

    // Categories for shop filters
    const categories = [
      'bitcoin',
      'litecoin',
      'kaspa',
      'alephium',
      'zcash',
      'ethereum',
      'dogecoin',
      'heaters',
      'home-miners',
    ];

    // Generate sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add product pages
    for (const product of (products || [])) {
      const lastmod = product.updated_at 
        ? new Date(product.updated_at).toISOString().split('T')[0]
        : now.split('T')[0];
      
      xml += `  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    // Add blog posts
    for (const slug of blogSlugs) {
      xml += `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    // Add algorithm landing pages
    for (const algo of algorithms) {
      xml += `  <url>
    <loc>${baseUrl}/miners/${algo}</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    // Add category filter pages
    for (const cat of categories) {
      xml += `  <url>
    <loc>${baseUrl}/shop?category=${cat}</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    console.log(`Sitemap generated with ${staticPages.length + (products?.length || 0) + blogSlugs.length + algorithms.length + categories.length} URLs`);

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
