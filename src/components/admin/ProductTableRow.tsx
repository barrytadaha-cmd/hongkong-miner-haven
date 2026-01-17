import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Edit, Image, Check, X, DollarSign } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Product } from '@/lib/data';

interface ProductTableRowProps {
  product: Product;
  isAdmin: boolean;
  onRefetch: () => void;
  onEdit: (product: Product) => void;
  uploadingImage: string | null;
  handleImageUpload: (productId: string, file: File) => Promise<void>;
}

export default function ProductTableRow({
  product,
  isAdmin,
  onRefetch,
  onEdit,
  uploadingImage,
  handleImageUpload
}: ProductTableRowProps) {
  const { toast } = useToast();
  const [editingPrice, setEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(product.price.toString());
  const [savingPrice, setSavingPrice] = useState(false);
  const [togglingStock, setTogglingStock] = useState(false);

  const handleToggleStock = async () => {
    setTogglingStock(true);
    try {
      const newStock = product.inStock ? 'out-of-stock' : 'in-stock';
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: 'Stock updated',
        description: `${product.name} is now ${product.inStock ? 'out of stock' : 'in stock'}.`
      });

      onRefetch();
    } catch (error: any) {
      toast({
        title: 'Error updating stock',
        description: error.message,
        variant: 'destructive'
      });
    }
    setTogglingStock(false);
  };

  const handleSavePrice = async () => {
    setSavingPrice(true);
    try {
      const newPrice = parseFloat(tempPrice);
      if (isNaN(newPrice) || newPrice < 0) {
        throw new Error('Invalid price');
      }

      const { error } = await supabase
        .from('products')
        .update({ price: newPrice })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: 'Price updated',
        description: `${product.name} price updated to $${newPrice.toLocaleString()}.`
      });

      setEditingPrice(false);
      onRefetch();
    } catch (error: any) {
      toast({
        title: 'Error updating price',
        description: error.message,
        variant: 'destructive'
      });
    }
    setSavingPrice(false);
  };

  const handleDeleteProduct = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', product.id);

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
      onRefetch();
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="relative w-14 h-14 sm:w-16 sm:h-16">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded"
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(product.id, file);
              }}
              disabled={uploadingImage === product.id || !isAdmin}
            />
            {uploadingImage === product.id ? (
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            ) : (
              <Image className="h-4 w-4 text-white" />
            )}
          </label>
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-[200px]">
          <span className="font-medium text-sm line-clamp-2">{product.name}</span>
          <span className="text-xs text-muted-foreground block">{product.brand}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-xs">{product.category}</Badge>
      </TableCell>
      <TableCell>
        {editingPrice ? (
          <div className="flex items-center gap-1">
            <div className="relative">
              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(e.target.value)}
                className="w-24 h-8 pl-6 text-sm"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleSavePrice}
              disabled={savingPrice}
            >
              {savingPrice ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3 text-green-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setEditingPrice(false);
                setTempPrice(product.price.toString());
              }}
            >
              <X className="h-3 w-3 text-red-500" />
            </Button>
          </div>
        ) : (
          <div 
            className="cursor-pointer hover:text-primary transition-colors group flex items-center gap-1"
            onClick={() => setEditingPrice(true)}
          >
            <span className="font-medium">${product.price.toLocaleString()}</span>
            <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-1">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        <span className="text-sm">{product.hashrate}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={product.inStock}
            onCheckedChange={handleToggleStock}
            disabled={togglingStock || !isAdmin}
          />
          <Badge 
            variant={product.inStock ? 'default' : 'destructive'}
            className="text-xs"
          >
            {togglingStock ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : product.inStock ? 'In Stock' : 'Out'}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(product)}
            disabled={!isAdmin}
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDeleteProduct}
            disabled={!isAdmin}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}