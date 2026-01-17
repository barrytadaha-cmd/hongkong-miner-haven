import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import AIProductDescription from '@/components/AIProductDescription';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface ProductEditModalProps {
  product: {
    id: string;
    name: string;
    brand?: string;
    algorithm?: string;
    hashrate?: string;
    power?: string;
    efficiency?: string;
    price: number;
    originalPrice?: number;
    category: string;
    type?: string;
    inStock: boolean;
    location?: string;
    description?: string;
    coins?: string[];
    isNew?: boolean;
    image?: string;
    images?: string[];
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  isAdmin: boolean;
}

const categories = [
  { id: 'bitcoin', name: 'Bitcoin Miners' },
  { id: 'litecoin', name: 'Litecoin/Scrypt' },
  { id: 'kaspa', name: 'Kaspa Miners' },
  { id: 'zcash', name: 'Zcash/Equihash' },
  { id: 'ethereum', name: 'Ethereum/EtHash' },
  { id: 'home', name: 'Home Miners' },
  { id: 'heater', name: 'Bitcoin Heaters' },
  { id: 'altcoin', name: 'Altcoin Miners' }
];

export default function ProductEditModal({ 
  product, 
  open, 
  onOpenChange, 
  onSave,
  isAdmin 
}: ProductEditModalProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    algorithm: '',
    hashrate: '',
    power: '',
    efficiency: '',
    price: '',
    original_price: '',
    category: 'bitcoin',
    type: '',
    stock: 'in-stock',
    location: 'hongkong',
    description: '',
    coins: '',
    is_new: false
  });

  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        algorithm: product.algorithm || '',
        hashrate: product.hashrate || '',
        power: product.power || '',
        efficiency: product.efficiency || '',
        price: product.price?.toString() || '',
        original_price: product.originalPrice?.toString() || '',
        category: product.category || 'bitcoin',
        type: product.type || '',
        stock: product.inStock ? 'in-stock' : 'out-of-stock',
        location: product.location || 'hongkong',
        description: product.description || '',
        coins: product.coins?.join(', ') || '',
        is_new: product.isNew || false
      });
      loadProductImages();
    }
  }, [product, open]);

  const loadProductImages = async () => {
    if (!product) return;
    
    setLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProductImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
    setLoadingImages(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setSaving(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          brand: formData.brand || null,
          algorithm: formData.algorithm || null,
          hashrate: formData.hashrate || null,
          power: formData.power || null,
          efficiency: formData.efficiency || null,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          category: formData.category,
          type: formData.type || null,
          stock: formData.stock,
          location: formData.location,
          description: formData.description || null,
          coins: formData.coins ? formData.coins.split(',').map(c => c.trim()) : null,
          is_new: formData.is_new
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: 'Product updated!',
        description: 'The product has been saved successfully.'
      });

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error updating product',
        description: error.message,
        variant: 'destructive'
      });
    }

    setSaving(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Edit Product
          </DialogTitle>
          <DialogDescription>
            Update product details and manage images
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSave} className="space-y-6 px-6 pb-6">
            {/* Image Management Section */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <Label className="text-base font-semibold">Product Images</Label>
              {loadingImages ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <ImageUploader
                  productId={product.id}
                  images={productImages}
                  onImagesChange={loadProductImages}
                  isAdmin={isAdmin}
                />
              )}
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-brand">Brand</Label>
                <Input
                  id="edit-brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (USD) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-original_price">Original Price (for sale)</Label>
                <Input
                  id="edit-original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-algorithm">Algorithm</Label>
                <Input
                  id="edit-algorithm"
                  value={formData.algorithm}
                  onChange={(e) => setFormData({ ...formData, algorithm: e.target.value })}
                  placeholder="SHA256, SCRYPT, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hashrate">Hashrate</Label>
                <Input
                  id="edit-hashrate"
                  value={formData.hashrate}
                  onChange={(e) => setFormData({ ...formData, hashrate: e.target.value })}
                  placeholder="200 TH/s"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-power">Power Consumption</Label>
                <Input
                  id="edit-power"
                  value={formData.power}
                  onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                  placeholder="3500W"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-efficiency">Efficiency</Label>
                <Input
                  id="edit-efficiency"
                  value={formData.efficiency}
                  onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                  placeholder="17.5 J/TH"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock Status</Label>
                <Select
                  value={formData.stock}
                  onValueChange={(value) => setFormData({ ...formData, stock: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="pre-order">Pre-Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Warehouse</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hongkong">Hong Kong</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-coins">Supported Coins</Label>
                <Input
                  id="edit-coins"
                  value={formData.coins}
                  onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                  placeholder="Bitcoin, Bitcoin Cash"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            
            {/* AI Description Generator */}
            {formData.name && formData.price && (
              <AIProductDescription
                product={{
                  name: formData.name,
                  brand: formData.brand,
                  algorithm: formData.algorithm,
                  hashrate: formData.hashrate,
                  power: formData.power,
                  efficiency: formData.efficiency,
                  price: parseFloat(formData.price) || 0,
                  category: formData.category,
                  coins: formData.coins ? formData.coins.split(',').map(c => c.trim()) : [],
                  description: formData.description,
                }}
                onDescriptionGenerated={(desc) => setFormData({ ...formData, description: desc })}
              />
            )}
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-is_new"
                checked={formData.is_new}
                onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
              />
              <Label htmlFor="edit-is_new">Mark as New</Label>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={saving || !isAdmin}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
