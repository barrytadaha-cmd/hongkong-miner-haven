import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDBProducts, useHasDBProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { products as staticProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Database, LogOut } from 'lucide-react';
import OrderManagement from '@/components/admin/OrderManagement';
import OrderStatistics from '@/components/admin/OrderStatistics';
import AIProductDescription from '@/components/AIProductDescription';
import ProductEditModal from '@/components/admin/ProductEditModal';
import ProductTableRow from '@/components/admin/ProductTableRow';
import Layout from '@/components/Layout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

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

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const { data: dbProducts, isLoading: productsLoading, refetch } = useDBProducts();
  const { data: hasProducts, refetch: refetchHasProducts } = useHasDBProducts();
  const { toast } = useToast();
  
  const [migrating, setMigrating] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof dbProducts extends (infer T)[] | undefined ? T | null : never>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  
  // Form state
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
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, authLoading, isAdmin, navigate]);

  const handleMigrateProducts = async () => {
    setMigrating(true);
    
    try {
      for (const product of staticProducts) {
        // Insert product
        const { data: insertedProduct, error: productError } = await supabase
          .from('products')
          .insert({
            name: product.name,
            brand: product.brand,
            algorithm: product.algorithm,
            hashrate: product.hashrate,
            power: product.power,
            efficiency: product.efficiency,
            price: product.price,
            original_price: product.originalPrice || null,
            category: product.category,
            type: product.type || null,
            stock: product.inStock ? 'in-stock' : 'out-of-stock',
            location: product.location,
            description: product.description,
            coins: product.coins,
            is_new: product.isNew || false
          })
          .select()
          .single();

        if (productError) {
          console.error('Error inserting product:', productError);
          continue;
        }

        // Insert images
        for (let i = 0; i < product.images.length; i++) {
          await supabase.from('product_images').insert({
            product_id: insertedProduct.id,
            image_url: product.images[i],
            is_primary: i === 0,
            sort_order: i
          });
        }

        // Insert specs
        await supabase.from('product_specs').insert({
          product_id: insertedProduct.id,
          dimensions: product.specs.dimensions,
          weight: product.specs.weight,
          noise: product.specs.noise,
          temperature: product.specs.temperature,
          voltage: product.specs.voltage,
          interface: product.specs.interface,
          cooling: product.specs.cooling
        });
      }

      toast({
        title: 'Migration complete!',
        description: `${staticProducts.length} products have been migrated to the database.`
      });
      
      refetch();
      refetchHasProducts();
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: 'Migration failed',
        description: 'An error occurred during migration.',
        variant: 'destructive'
      });
    }
    
    setMigrating(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProduct(true);

    try {
      const { data: insertedProduct, error } = await supabase
        .from('products')
        .insert({
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
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Product added!',
        description: 'The product has been added successfully.'
      });

      setDialogOpen(false);
      setFormData({
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
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error adding product',
        description: error.message,
        variant: 'destructive'
      });
    }

    setAddingProduct(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting product',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Product deleted',
        description: 'The product has been removed.'
      });
      refetch();
    }
  };

  const handleImageUpload = async (productId: string, file: File) => {
    setUploadingImage(productId);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Check if there are existing images
      const { data: existingImages } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId);

      const isPrimary = !existingImages || existingImages.length === 0;

      await supabase.from('product_images').insert({
        product_id: productId,
        image_url: publicUrl,
        is_primary: isPrimary,
        sort_order: existingImages?.length || 0
      });

      toast({
        title: 'Image uploaded!',
        description: 'The image has been added to the product.'
      });

      refetch();
    } catch (error: any) {
      toast({
        title: 'Error uploading image',
        description: error.message,
        variant: 'destructive'
      });
    }

    setUploadingImage(null);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and images</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Migration Card */}
        {!hasProducts && (
          <Card className="mb-8 border-dashed border-2 border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Migrate Existing Products
              </CardTitle>
              <CardDescription>
                Import the {staticProducts.length} existing products from the codebase into the database for dynamic management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleMigrateProducts} disabled={migrating || !isAdmin}>
                {migrating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {migrating ? 'Migrating...' : `Import ${staticProducts.length} Products`}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Order Statistics */}
        <div className="mb-8">
          <OrderStatistics />
        </div>

        {/* Order Management */}
        <div className="mb-8">
          <OrderManagement />
        </div>

        {/* Add Product */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products ({dbProducts?.length || 0})</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!isAdmin}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the product details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
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
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original_price">Original Price (for sale)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="algorithm">Algorithm</Label>
                    <Input
                      id="algorithm"
                      value={formData.algorithm}
                      onChange={(e) => setFormData({ ...formData, algorithm: e.target.value })}
                      placeholder="SHA256, SCRYPT, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hashrate">Hashrate</Label>
                    <Input
                      id="hashrate"
                      value={formData.hashrate}
                      onChange={(e) => setFormData({ ...formData, hashrate: e.target.value })}
                      placeholder="200 TH/s"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="power">Power Consumption</Label>
                    <Input
                      id="power"
                      value={formData.power}
                      onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                      placeholder="3500W"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="efficiency">Efficiency</Label>
                    <Input
                      id="efficiency"
                      value={formData.efficiency}
                      onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                      placeholder="17.5 J/TH"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Status</Label>
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
                    <Label htmlFor="location">Warehouse</Label>
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
                    <Label htmlFor="coins">Supported Coins</Label>
                    <Input
                      id="coins"
                      value={formData.coins}
                      onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                      placeholder="Bitcoin, Bitcoin Cash"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
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
                    id="is_new"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  />
                  <Label htmlFor="is_new">Mark as New</Label>
                </div>
                <Button type="submit" className="w-full" disabled={addingProduct}>
                  {addingProduct && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Hashrate</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dbProducts?.map((product) => (
                    <ProductTableRow 
                      key={product.id} 
                      product={product} 
                      isAdmin={isAdmin}
                      onRefetch={refetch}
                      onEdit={(p) => {
                        setSelectedProduct(p);
                        setEditDialogOpen(true);
                      }}
                      uploadingImage={uploadingImage}
                      handleImageUpload={handleImageUpload}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Product Edit Modal */}
        <ProductEditModal
          product={selectedProduct}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={() => refetch()}
          isAdmin={isAdmin}
        />
      </div>
    </Layout>
  );
}
