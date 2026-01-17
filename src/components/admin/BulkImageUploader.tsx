import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Image, CheckCircle, XCircle, Loader2, FileImage, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
}

interface UploadItem {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'no-match';
  matchedProduct?: Product;
  error?: string;
  progress: number;
}

interface BulkImageUploaderProps {
  products: Product[];
  onUploadComplete?: () => void;
}

// Compress image before upload
async function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Compression failed'));
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Match filename to product
function matchFileToProduct(filename: string, products: Product[]): Product | undefined {
  const cleanName = filename.toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\d+$/, '')
    .trim();

  // Try exact slug match first
  let match = products.find(p => 
    p.slug.toLowerCase() === cleanName ||
    cleanName.includes(p.slug.toLowerCase())
  );

  if (!match) {
    // Try fuzzy name match
    match = products.find(p => {
      const productName = p.name.toLowerCase().replace(/[-_]/g, ' ');
      return cleanName.includes(productName) || 
             productName.includes(cleanName) ||
             cleanName.split(' ').every(word => productName.includes(word));
    });
  }

  if (!match) {
    // Try partial match on key terms
    const keywords = cleanName.split(' ').filter(w => w.length > 2);
    match = products.find(p => {
      const productName = p.name.toLowerCase();
      return keywords.filter(kw => productName.includes(kw)).length >= 2;
    });
  }

  return match;
}

export function BulkImageUploader({ products, onUploadComplete }: BulkImageUploaderProps) {
  const { toast } = useToast();
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const items: UploadItem[] = acceptedFiles.map(file => {
      const matchedProduct = matchFileToProduct(file.name, products);
      return {
        file,
        status: matchedProduct ? 'pending' : 'no-match',
        matchedProduct,
        progress: 0,
      };
    });
    setUploadItems(prev => [...prev, ...items]);
  }, [products]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    },
    multiple: true,
  });

  const removeItem = (index: number) => {
    setUploadItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setUploadItems([]);
  };

  const uploadAll = async () => {
    const pendingItems = uploadItems.filter(item => item.status === 'pending');
    if (pendingItems.length === 0) {
      toast({ title: 'No files to upload', description: 'Add matched files first', variant: 'destructive' });
      return;
    }

    setIsUploading(true);

    for (let i = 0; i < uploadItems.length; i++) {
      const item = uploadItems[i];
      if (item.status !== 'pending' || !item.matchedProduct) continue;

      setUploadItems(prev => prev.map((it, idx) => 
        idx === i ? { ...it, status: 'uploading', progress: 10 } : it
      ));

      try {
        // Compress image
        const compressed = await compressImage(item.file);
        
        setUploadItems(prev => prev.map((it, idx) => 
          idx === i ? { ...it, progress: 40 } : it
        ));

        // Generate unique filename
        const timestamp = Date.now();
        const ext = item.file.name.split('.').pop();
        const fileName = `${item.matchedProduct.slug}-${timestamp}.${ext}`;
        const filePath = `${item.matchedProduct.id}/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, compressed, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        setUploadItems(prev => prev.map((it, idx) => 
          idx === i ? { ...it, progress: 70 } : it
        ));

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        // Get current max sort order
        const { data: existingImages } = await supabase
          .from('product_images')
          .select('sort_order')
          .eq('product_id', item.matchedProduct.id)
          .order('sort_order', { ascending: false })
          .limit(1);

        const nextSortOrder = (existingImages?.[0]?.sort_order ?? -1) + 1;

        // Insert into database
        const { error: dbError } = await supabase
          .from('product_images')
          .insert({
            product_id: item.matchedProduct.id,
            image_url: urlData.publicUrl,
            is_primary: nextSortOrder === 0,
            sort_order: nextSortOrder,
          });

        if (dbError) throw dbError;

        setUploadItems(prev => prev.map((it, idx) => 
          idx === i ? { ...it, status: 'success', progress: 100 } : it
        ));

      } catch (error) {
        console.error('Upload error:', error);
        setUploadItems(prev => prev.map((it, idx) => 
          idx === i ? { 
            ...it, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed',
            progress: 0 
          } : it
        ));
      }
    }

    setIsUploading(false);
    
    const successCount = uploadItems.filter(i => i.status === 'success').length;
    toast({
      title: 'Upload complete',
      description: `Successfully uploaded ${successCount} images`,
    });

    onUploadComplete?.();
  };

  const pendingCount = uploadItems.filter(i => i.status === 'pending').length;
  const successCount = uploadItems.filter(i => i.status === 'success').length;
  const errorCount = uploadItems.filter(i => i.status === 'error').length;
  const noMatchCount = uploadItems.filter(i => i.status === 'no-match').length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Bulk Image Uploader
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive 
              ? 'Drop images here...' 
              : 'Drag & drop product images, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Filename should contain product name for auto-matching (e.g., antminer-s21-pro-1.jpg)
          </p>
        </div>

        {/* Stats */}
        {uploadItems.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{uploadItems.length} total</Badge>
            {pendingCount > 0 && <Badge variant="secondary">{pendingCount} ready</Badge>}
            {successCount > 0 && <Badge className="bg-green-500">{successCount} uploaded</Badge>}
            {errorCount > 0 && <Badge variant="destructive">{errorCount} failed</Badge>}
            {noMatchCount > 0 && <Badge variant="outline" className="text-orange-500 border-orange-500">{noMatchCount} no match</Badge>}
          </div>
        )}

        {/* File List */}
        {uploadItems.length > 0 && (
          <ScrollArea className="h-64 border rounded-lg">
            <div className="p-2 space-y-2">
              {uploadItems.map((item, index) => (
                <div 
                  key={`${item.file.name}-${index}`}
                  className="flex items-center gap-3 p-2 rounded bg-muted/50"
                >
                  <Image className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.file.name}</p>
                    {item.matchedProduct ? (
                      <p className="text-xs text-green-600">→ {item.matchedProduct.name}</p>
                    ) : (
                      <p className="text-xs text-orange-500">No matching product found</p>
                    )}
                    {item.status === 'uploading' && (
                      <Progress value={item.progress} className="h-1 mt-1" />
                    )}
                    {item.error && (
                      <p className="text-xs text-destructive">{item.error}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {item.status === 'pending' && (
                      <Badge variant="secondary" className="text-xs">Ready</Badge>
                    )}
                    {item.status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    {item.status === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {item.status === 'error' && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    {item.status === 'no-match' && (
                      <Badge variant="outline" className="text-xs text-orange-500">No Match</Badge>
                    )}
                  </div>

                  {!isUploading && item.status !== 'success' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Actions */}
        {uploadItems.length > 0 && (
          <div className="flex gap-2">
            <Button 
              onClick={uploadAll} 
              disabled={isUploading || pendingCount === 0}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {pendingCount} Matched Images
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clearAll} disabled={isUploading}>
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
