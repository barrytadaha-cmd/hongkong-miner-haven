import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml; charset=utf-8",
};

interface Product {
  id: string;
  name: string;
  brand: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: string | null;
  category: string;
  algorithm: string | null;
  hashrate: string | null;
  power: string | null;
  is_new: boolean | null;
}

interface ProductImage {
  product_id: string;
  image_url: string;
  is_primary: boolean | null;
}

const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const getCategoryProductType = (category: string): string => {
  const categoryMap: Record<string, string> = {
    bitcoin: "Industrial > Mining Equipment > Bitcoin ASIC Miners",
    litecoin: "Industrial > Mining Equipment > Scrypt ASIC Miners",
    kaspa: "Industrial > Mining Equipment > Kaspa KHeavyHash Miners",
    zcash: "Industrial > Mining Equipment > Equihash ASIC Miners",
    ethereum: "Industrial > Mining Equipment > EtHash ASIC Miners",
    home: "Industrial > Mining Equipment > Home Mining Devices",
    heater: "Industrial > Mining Equipment > Bitcoin Heaters",
    altcoin: "Industrial > Mining Equipment > Altcoin ASIC Miners",
  };
  return categoryMap[category] || "Industrial > Mining Equipment";
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Generating Google Shopping Feed...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("stock", "in-stock");

    if (productsError) {
      console.error("Error fetching products:", productsError);
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    console.log(`Found ${products?.length || 0} in-stock products`);

    // Fetch primary images for all products
    const { data: images, error: imagesError } = await supabase
      .from("product_images")
      .select("product_id, image_url, is_primary")
      .eq("is_primary", true);

    if (imagesError) {
      console.error("Error fetching images:", imagesError);
    }

    // Create image lookup map
    const imageMap: Record<string, string> = {};
    if (images) {
      images.forEach((img: ProductImage) => {
        imageMap[img.product_id] = img.image_url;
      });
    }

    const siteUrl = "https://minerhaolan.shop";
    const feedDate = new Date().toISOString();

    // Generate feed items
    const itemsXml = (products || [])
      .map((product: Product) => {
        const sku = `MH-${product.id.slice(0, 8).toUpperCase()}`;
        const title = `${product.name}${product.hashrate ? ` - ${product.hashrate}` : ""}${product.algorithm ? ` ${product.algorithm}` : ""} Miner`;
        const description = product.description || `${product.name} cryptocurrency mining hardware from ${product.brand || "MinerHaolan"}`;
        const imageUrl = imageMap[product.id] || "/placeholder.svg";
        const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`;
        const availability = product.stock === "in-stock" ? "in_stock" : product.stock === "pre-order" ? "preorder" : "out_of_stock";
        const mpn = product.name.replace(/\s+/g, "-").toUpperCase();

        return `    <item>
      <g:id>${escapeXml(sku)}</g:id>
      <g:title>${escapeXml(title.slice(0, 150))}</g:title>
      <g:description>${escapeXml(description.slice(0, 5000))}</g:description>
      <g:link>${escapeXml(`${siteUrl}/shop/${product.id}`)}</g:link>
      <g:image_link>${escapeXml(fullImageUrl)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price.toFixed(2)} USD</g:price>
      ${product.original_price && product.original_price > product.price ? `<g:sale_price>${product.price.toFixed(2)} USD</g:sale_price>` : ""}
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(product.brand || "Generic")}</g:brand>
      <g:google_product_category>4285</g:google_product_category>
      <g:product_type>${escapeXml(getCategoryProductType(product.category))}</g:product_type>
      <g:mpn>${escapeXml(mpn)}</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:custom_label_0>${escapeXml(product.category)}</g:custom_label_0>
      ${product.algorithm ? `<g:custom_label_1>${escapeXml(product.algorithm)}</g:custom_label_1>` : ""}
      ${product.is_new ? "<g:custom_label_2>new_arrival</g:custom_label_2>" : ""}
      <g:shipping>
        <g:country>US</g:country>
        <g:price>0 USD</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>HK</g:country>
        <g:price>0 USD</g:price>
      </g:shipping>
    </item>`;
      })
      .join("\n");

    const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>MinerHaolan - Crypto Mining Equipment</title>
    <link>${siteUrl}</link>
    <description>Premium ASIC miners and cryptocurrency mining equipment. Bitcoin, Kaspa, Litecoin miners with worldwide shipping from Hong Kong.</description>
    <lastBuildDate>${feedDate}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

    console.log(`Feed generated successfully with ${products?.length || 0} items`);

    return new Response(feedXml, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error generating feed:", errorMessage);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Failed to generate feed: ${errorMessage}</message>
</error>`,
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
