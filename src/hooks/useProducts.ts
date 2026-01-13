import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductSpecs } from '@/lib/data';

export interface DBProduct {
  id: string;
  name: string;
  brand: string | null;
  algorithm: string | null;
  hashrate: string | null;
  power: string | null;
  efficiency: string | null;
  price: number;
  original_price: number | null;
  category: string;
  type: string | null;
  stock: string | null;
  location: string | null;
  description: string | null;
  coins: string[] | null;
  is_new: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DBProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean | null;
  sort_order: number | null;
}

export interface DBProductSpecs {
  id: string;
  product_id: string;
  dimensions: string | null;
  weight: string | null;
  noise: string | null;
  temperature: string | null;
  voltage: string | null;
  interface: string | null;
  cooling: string | null;
}

// Default specs for products without specs
const defaultSpecs: ProductSpecs = {
  dimensions: '400 x 195 x 290 mm',
  weight: '14 kg',
  noise: '75 dB',
  temperature: '5-40°C',
  voltage: '200-240V',
  interface: 'Ethernet',
  cooling: '4 x Fans'
};

// Generate a placeholder image URL based on product details
export function generatePlaceholderImage(product: { name: string; category: string; hashrate?: string | null }): string {
  const text = encodeURIComponent(product.name);
  const category = product.category || 'miner';
  const hashrate = product.hashrate || '';
  
  // Use a placeholder service with product info
  return `https://placehold.co/600x600/1e293b/3b82f6?text=${text}%0A${encodeURIComponent(hashrate)}`;
}

// Convert DB product to frontend Product format
export function dbProductToProduct(
  dbProduct: DBProduct, 
  images: DBProductImage[], 
  specs: DBProductSpecs | null
): Product {
  const primaryImage = images.find(img => img.is_primary) || images[0];
  const imageUrl = primaryImage?.image_url || generatePlaceholderImage(dbProduct);
  const imageUrls = images.length > 0 
    ? images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(img => img.image_url)
    : [imageUrl];

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand || 'Unknown',
    algorithm: dbProduct.algorithm || 'N/A',
    hashrate: dbProduct.hashrate || 'N/A',
    power: dbProduct.power || 'N/A',
    efficiency: dbProduct.efficiency || 'N/A',
    price: Number(dbProduct.price),
    originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : undefined,
    image: imageUrl,
    images: imageUrls,
    category: dbProduct.category,
    type: (dbProduct.type as 'air' | 'hydro' | 'immersion') || undefined,
    inStock: dbProduct.stock === 'in-stock',
    isNew: dbProduct.is_new || false,
    isSale: dbProduct.original_price ? dbProduct.original_price > dbProduct.price : false,
    location: (dbProduct.location as 'hongkong' | 'international') || 'hongkong',
    description: dbProduct.description || '',
    specs: specs ? {
      dimensions: specs.dimensions || defaultSpecs.dimensions,
      weight: specs.weight || defaultSpecs.weight,
      noise: specs.noise || defaultSpecs.noise,
      temperature: specs.temperature || defaultSpecs.temperature,
      voltage: specs.voltage || defaultSpecs.voltage,
      interface: specs.interface || defaultSpecs.interface,
      cooling: specs.cooling || defaultSpecs.cooling
    } : defaultSpecs,
    coins: dbProduct.coins || []
  };
}

// Fetch all products from database
export function useDBProducts() {
  return useQuery({
    queryKey: ['db-products'],
    queryFn: async () => {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      const { data: images, error: imagesError } = await supabase
        .from('product_images')
        .select('*');

      if (imagesError) throw imagesError;

      const { data: specs, error: specsError } = await supabase
        .from('product_specs')
        .select('*');

      if (specsError) throw specsError;

      // Group images and specs by product_id
      const imagesByProduct: Record<string, DBProductImage[]> = {};
      images?.forEach(img => {
        if (!imagesByProduct[img.product_id]) {
          imagesByProduct[img.product_id] = [];
        }
        imagesByProduct[img.product_id].push(img);
      });

      const specsByProduct: Record<string, DBProductSpecs> = {};
      specs?.forEach(spec => {
        specsByProduct[spec.product_id] = spec;
      });

      // Convert to Product format
      return (products || []).map(p => 
        dbProductToProduct(p, imagesByProduct[p.id] || [], specsByProduct[p.id] || null)
      );
    }
  });
}

// Fetch single product
export function useDBProduct(id: string) {
  return useQuery({
    queryKey: ['db-product', id],
    queryFn: async () => {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (productError) throw productError;
      if (!product) return null;

      const { data: images } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id);

      const { data: specs } = await supabase
        .from('product_specs')
        .select('*')
        .eq('product_id', id)
        .maybeSingle();

      return dbProductToProduct(product, images || [], specs);
    },
    enabled: !!id
  });
}

// Check if database has products
export function useHasDBProducts() {
  return useQuery({
    queryKey: ['has-db-products'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return (count || 0) > 0;
    }
  });
}
