import { supabase } from '@/integrations/supabase/client';

type FirecrawlResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
};

type ScrapeOptions = {
  formats?: ('markdown' | 'html' | 'rawHtml' | 'links' | 'screenshot')[];
  onlyMainContent?: boolean;
  waitFor?: number;
  location?: { country?: string; languages?: string[] };
};

export const firecrawlApi = {
  async scrape(url: string, options?: ScrapeOptions): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
      body: { url, options },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async extractProductInfo(url: string): Promise<{
    success: boolean;
    error?: string;
    specs?: Record<string, string>;
    images?: string[];
    description?: string;
    name?: string;
    price?: string;
  }> {
    const result = await this.scrape(url, {
      formats: ['markdown', 'html', 'links'],
      onlyMainContent: true,
      waitFor: 3000,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const html = result.data?.html || result.html || '';
    const markdown = result.data?.markdown || result.markdown || '';
    const links = result.data?.links || result.links || [];

    // Extract images from links
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const images = links.filter((link: string) => 
      imageExtensions.some(ext => link.toLowerCase().includes(ext)) &&
      (link.includes('product') || link.includes('miner') || link.includes('image'))
    );

    // Parse specs from markdown/html
    const specs: Record<string, string> = {};
    const specPatterns = [
      /hashrate[:\s]*([0-9.]+\s*[TGMK]?H\/s)/gi,
      /power[:\s]*([0-9.]+\s*W)/gi,
      /algorithm[:\s]*(\w+)/gi,
      /weight[:\s]*([0-9.]+\s*kg)/gi,
      /dimensions[:\s]*([0-9x×\s]+mm)/gi,
      /noise[:\s]*([0-9.]+\s*dB)/gi,
      /efficiency[:\s]*([0-9.]+\s*J\/[TG]H)/gi,
    ];

    specPatterns.forEach(pattern => {
      const match = markdown.match(pattern);
      if (match) {
        const key = pattern.source.split('[')[0].replace(/\\/g, '');
        specs[key] = match[1] || match[0];
      }
    });

    // Extract name from title or h1
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i) || 
                       html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const name = titleMatch ? titleMatch[1].trim() : undefined;

    // Extract price
    const priceMatch = markdown.match(/\$[\d,]+(?:\.\d{2})?/) ||
                       html.match(/\$[\d,]+(?:\.\d{2})?/);
    const price = priceMatch ? priceMatch[0] : undefined;

    // Use first paragraph as description
    const descMatch = markdown.match(/^(?!#)(.{50,300}\.)/m);
    const description = descMatch ? descMatch[1] : undefined;

    return {
      success: true,
      specs,
      images: images.slice(0, 10),
      description,
      name,
      price,
    };
  }
};
