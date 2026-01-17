import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Trash2, 
  Upload, 
  Star, 
  GripVertical, 
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface ImageUploaderProps {
  productId: string;
  images: ProductImage[];
  onImagesChange: () => void;
  isAdmin: boolean;
}

// Image compression utility
async function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export default function ImageUploader({ 
  productId, 
  images, 
  onImagesChange, 
  isAdmin 
}: ImageUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragOver, setDragOver] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;
    setDragOver(true);
  }, [isAdmin]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = async (files: FileList | File[]) => {
    if (!isAdmin) return;
    
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (validFiles.length === 0) {
      toast({
        title: 'Invalid files',
        description: 'Please upload image files only.',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const fileId = `${Date.now()}-${i}`;
        
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        // Compress the image
        setUploadProgress(prev => ({ ...prev, [fileId]: 20 }));
        const compressedBlob = await compressImage(file);
        
        setUploadProgress(prev => ({ ...prev, [fileId]: 50 }));

        // Generate filename
        const fileName = `${productId}/${Date.now()}-${i}.jpg`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, compressedBlob, {
            contentType: 'image/jpeg'
          });

        if (uploadError) throw uploadError;

        setUploadProgress(prev => ({ ...prev, [fileId]: 80 }));

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        // Determine if this should be primary
        const isPrimary = images.length === 0 && i === 0;

        // Insert into database
        await supabase.from('product_images').insert({
          product_id: productId,
          image_url: publicUrl,
          is_primary: isPrimary,
          sort_order: images.length + i
        });

        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      }

      toast({
        title: 'Images uploaded!',
        description: `${validFiles.length} image(s) have been added.`
      });

      onImagesChange();
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    if (!isAdmin) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [isAdmin, images.length, productId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: 'Image deleted',
        description: 'The image has been removed.'
      });

      onImagesChange();
    } catch (error: any) {
      toast({
        title: 'Error deleting image',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      // First, set all images as non-primary
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      // Then set the selected image as primary
      await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      toast({
        title: 'Primary image set',
        description: 'The primary image has been updated.'
      });

      onImagesChange();
    } catch (error: any) {
      toast({
        title: 'Error setting primary image',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Drag and drop reordering
  const handleItemDragStart = (e: React.DragEvent, imageId: string) => {
    if (!isAdmin) return;
    setDraggedItem(imageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDragOver = (e: React.DragEvent, imageId: string) => {
    e.preventDefault();
    if (!isAdmin || !draggedItem || draggedItem === imageId) return;
    setDragOverItem(imageId);
  };

  const handleItemDragEnd = async () => {
    if (!draggedItem || !dragOverItem || draggedItem === dragOverItem) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = images.findIndex(img => img.id === draggedItem);
    const dropIndex = images.findIndex(img => img.id === dragOverItem);

    if (draggedIndex === -1 || dropIndex === -1) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Reorder the images
    const newImages = [...images];
    const [removed] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, removed);

    // Update sort_order in database
    try {
      for (let i = 0; i < newImages.length; i++) {
        await supabase
          .from('product_images')
          .update({ sort_order: i })
          .eq('id', newImages[i].id);
      }

      toast({
        title: 'Order updated',
        description: 'Image order has been saved.'
      });

      onImagesChange();
    } catch (error: any) {
      toast({
        title: 'Error reordering',
        description: error.message,
        variant: 'destructive'
      });
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const imageTypes = [
    { index: 0, label: 'Hero Shot', desc: 'Front view, white bg' },
    { index: 1, label: 'Interface', desc: 'Ports & connections' },
    { index: 2, label: 'Spec Label', desc: 'Specs sticker' },
    { index: 3, label: 'Angled', desc: '45° perspective' },
    { index: 4, label: 'Deployment', desc: 'In environment' },
  ];

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center",
          dragOver 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-muted-foreground/25 hover:border-primary/50",
          !isAdmin && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={!isAdmin || uploading}
        />

        <div className="space-y-3">
          <div className={cn(
            "mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors",
            dragOver ? "bg-primary/20" : "bg-muted"
          )}>
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <Upload className={cn(
                "h-8 w-8 transition-colors",
                dragOver ? "text-primary" : "text-muted-foreground"
              )} />
            )}
          </div>

          <div>
            <p className="text-sm font-medium">
              {uploading ? 'Uploading & Compressing...' : 'Drag & drop images here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse • Auto-compressed to optimal size
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading || !isAdmin}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Select Images
          </Button>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 space-y-1">
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="flex items-center gap-2 text-xs">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                {progress === 100 ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <span className="text-muted-foreground w-8">{progress}%</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Type Guide */}
      <div className="flex flex-wrap gap-2 justify-center">
        {imageTypes.map((type, i) => (
          <Badge 
            key={type.index} 
            variant={images[i] ? "default" : "outline"}
            className={cn(
              "text-xs",
              images[i] ? "bg-green-500/20 text-green-400 border-green-500/30" : ""
            )}
          >
            {images[i] ? <Check className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {type.label}
          </Badge>
        ))}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              draggable={isAdmin}
              onDragStart={(e) => handleItemDragStart(e, img.id)}
              onDragOver={(e) => handleItemDragOver(e, img.id)}
              onDragEnd={handleItemDragEnd}
              className={cn(
                "relative group rounded-lg overflow-hidden border bg-background aspect-square",
                "transition-all duration-200",
                draggedItem === img.id && "opacity-50 scale-95",
                dragOverItem === img.id && "ring-2 ring-primary scale-105",
                isAdmin && "cursor-grab active:cursor-grabbing"
              )}
            >
              {/* Drag Handle */}
              {isAdmin && (
                <div className="absolute top-1 left-1 z-10 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-3 w-3 text-white" />
                </div>
              )}

              {/* Image Number */}
              <div className="absolute top-1 right-1 z-10 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{index + 1}</span>
              </div>

              {/* Image */}
              <img
                src={img.image_url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Primary Badge */}
              {img.is_primary && (
                <Badge className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                  <Star className="h-2.5 w-2.5 mr-0.5" />
                  Primary
                </Badge>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {!img.is_primary && isAdmin && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleSetPrimary(img.id)}
                  >
                    <Star className="h-3.5 w-3.5" />
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(img.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {/* Image Type Label */}
              {imageTypes[index] && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[9px] text-white/80 text-center truncate">
                    {imageTypes[index].label}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No images uploaded yet. Add at least 5 images for best results.
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{images.length} image{images.length !== 1 ? 's' : ''} uploaded</span>
          <span className={images.length >= 5 ? "text-green-500" : "text-amber-500"}>
            {images.length >= 5 ? '✓ Meets 5+ requirement' : `${5 - images.length} more needed`}
          </span>
        </div>
      )}
    </div>
  );
}
