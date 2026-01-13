import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AIProductDescriptionProps {
  product: {
    name: string;
    brand: string;
    algorithm: string;
    hashrate: string;
    power: string;
    efficiency: string;
    price: number;
    category: string;
    coins: string[];
    description?: string;
  };
  onDescriptionGenerated?: (description: string) => void;
}

const AIProductDescription = ({ product, onDescriptionGenerated }: AIProductDescriptionProps) => {
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateDescription = async () => {
    setIsGenerating(true);
    setGeneratedDescription('');

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

      const productInfo = `
Product: ${product.name}
Brand: ${product.brand}
Algorithm: ${product.algorithm}
Hashrate: ${product.hashrate}
Power Consumption: ${product.power}
Efficiency: ${product.efficiency}
Price: $${product.price.toLocaleString()}
Category: ${product.category}
Minable Coins: ${product.coins.join(', ')}
Current Description: ${product.description || 'None'}
`;

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: 'product-description',
          messages: [
            {
              role: 'user',
              content: `Generate a compelling product description for this ASIC miner:\n${productInfo}`
            }
          ],
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error('Failed to generate description');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullDescription = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullDescription += content;
              setGeneratedDescription(fullDescription);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (onDescriptionGenerated && fullDescription) {
        onDescriptionGenerated(fullDescription);
      }
      toast.success('Description generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedDescription);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Product Description
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate compelling product descriptions using AI. The generated copy will highlight key features and benefits.
        </p>

        {generatedDescription && (
          <div className="space-y-2">
            <Textarea
              value={generatedDescription}
              onChange={(e) => setGeneratedDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={generateDescription}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : generatedDescription ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Description
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Description
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIProductDescription;
