import { useState } from 'react';
import { firecrawlApi } from '@/lib/api/firecrawl';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Globe, 
  Loader2, 
  Search, 
  Package, 
  Image, 
  FileText, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Tag,
  Building2
} from 'lucide-react';

interface ScrapedData {
  name?: string;
  description?: string;
  price?: string;
  specs: Record<string, string>;
  images: string[];
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

const brands = [
  { id: 'bitmain', name: 'Bitmain (Antminer)' },
  { id: 'microbt', name: 'MicroBT (Whatsminer)' },
  { id: 'canaan', name: 'Canaan (Avalon)' },
  { id: 'iceriver', name: 'IceRiver' },
  { id: 'goldshell', name: 'Goldshell' },
  { id: 'elphapex', name: 'Elphapex' },
  { id: 'ipollo', name: 'iPollo' },
  { id: 'bitaxe', name: 'Bitaxe' },
  { id: 'heatbit', name: 'Heatbit' },
  { id: 'other', name: 'Other' }
];

export function ProductScraper() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing scraped data
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('bitcoin');
  const [selectedBrand, setSelectedBrand] = useState('');

  const handleScrape = async () => {
    if (!url.trim()) {
      toast({ title: 'Enter a URL', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setScrapedData(null);

    try {
      const result = await firecrawlApi.extractProductInfo(url);

      if (!result.success) {
        toast({ 
          title: 'Scraping failed', 
          description: result.error || 'Could not extract product info',
          variant: 'destructive' 
        });
        return;
      }

      const data: ScrapedData = {
        name: result.name,
        description: result.description,
        price: result.price,
        specs: result.specs || {},
        images: result.images || [],
      };

      setScrapedData(data);
      setEditedName(data.name || '');
      setEditedDescription(data.description || '');
      setEditedPrice(data.price?.replace(/[$,]/g, '') || '');
      setSelectedImages(data.images.slice(0, 5));

      toast({ title: 'Scraping complete', description: `Found ${data.images.length} images` });

    } catch (error) {
      console.error('Scrape error:', error);
      toast({ 
        title: 'Scraping failed', 
        description: 'Network error or invalid URL',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!editedName.trim()) {
      toast({ title: 'Product name required', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    try {
      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: editedName,
          description: editedDescription || null,
          price: parseFloat(editedPrice) || 0,
          category: categories.find(c => c.id === selectedCategory)?.name || 'Bitcoin Miners',
          brand: brands.find(b => b.id === selectedBrand)?.name || null,
          stock: 'in-stock',
          is_new: true,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Add images
      if (selectedImages.length > 0) {
        const imageInserts = selectedImages.map((imageUrl, index) => ({
          product_id: product.id,
          image_url: imageUrl,
          is_primary: index === 0,
          sort_order: index,
        }));

        await supabase.from('product_images').insert(imageInserts);
      }

      // Add specs
      if (scrapedData?.specs && Object.keys(scrapedData.specs).length > 0) {
        const specInserts = Object.entries(scrapedData.specs).map(([key, value]) => ({
          product_id: product.id,
          spec_key: key,
          spec_value: value,
        }));

        await supabase.from('product_specs').insert(specInserts);
      }

      toast({ title: 'Product created!', description: `${editedName} saved successfully` });

      // Reset form
      setUrl('');
      setScrapedData(null);
      setEditedName('');
      setEditedDescription('');
      setEditedPrice('');
      setSelectedImages([]);
      setSelectedCategory('bitcoin');
      setSelectedBrand('');

    } catch (error) {
      console.error('Save error:', error);
      toast({ 
        title: 'Save failed', 
        description: error instanceof Error ? error.message : 'Could not save product',
        variant: 'destructive' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleImage = (imageUrl: string) => {
    setSelectedImages(prev => 
      prev.includes(imageUrl)
        ? prev.filter(u => u !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Product Scraper (Firecrawl)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter manufacturer product URL (e.g., bitmain.com/product/...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleScrape} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Scraping product information...</p>
          </div>
        )}

        {/* Scraped Data */}
        {scrapedData && !isLoading && (
          <div className="space-y-4">
            <Separator />

            {/* Editable Fields */}
            <div className="grid gap-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4" />
                  Product Name
                </Label>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4" />
                  Price (USD)
                </Label>
                <Input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  Description
                </Label>
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              {/* Category & Brand Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4" />
                    Brand
                  </Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Specs */}
            {Object.keys(scrapedData.specs).length > 0 && (
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Extracted Specs
                </Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(scrapedData.specs).map(([key, value]) => (
                    <Badge key={key} variant="secondary">
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {scrapedData.images.length > 0 && (
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4" />
                  Found Images ({scrapedData.images.length}) - Click to select
                </Label>
                <ScrollArea className="h-32">
                  <div className="flex gap-2 pb-2">
                    {scrapedData.images.map((imgUrl, index) => (
                      <div
                        key={index}
                        onClick={() => toggleImage(imgUrl)}
                        className={`relative flex-shrink-0 w-24 h-24 rounded border-2 cursor-pointer overflow-hidden ${
                          selectedImages.includes(imgUrl) 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-transparent hover:border-muted-foreground/50'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {selectedImages.includes(imgUrl) && (
                          <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                            <CheckCircle className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedImages.length} images selected
                </p>
              </div>
            )}

            {scrapedData.images.length === 0 && (
              <div className="flex items-center gap-2 text-orange-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                No images found on this page
              </div>
            )}

            {/* Save Button */}
            <Button 
              onClick={handleSaveProduct} 
              disabled={isSaving || !editedName.trim()}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
