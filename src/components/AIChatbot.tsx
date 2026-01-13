import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, MessageSquare, Loader2, Package, ShoppingCart, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { products as staticProducts } from '@/lib/data';
import { useDBProducts, useHasDBProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type ChatMode = 'recommendation' | 'order-inquiry';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('recommendation');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { data: hasDBProducts } = useHasDBProducts();
  const { data: dbProducts } = useDBProducts();
  const products = hasDBProducts && dbProducts?.length ? dbProducts : staticProducts;
  const { addItem } = useCart();

  const welcomeMessages: Record<ChatMode, string> = {
    'recommendation': "Hi! 👋 I'm your mining consultant. Tell me about your mining goals, budget, and preferences, and I'll help you find the perfect ASIC miner!",
    'order-inquiry': "Hello! 👋 I can help you with order inquiries. Please share your order ID or ask any questions about your orders."
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: welcomeMessages[mode] }]);
    }
  }, [isOpen, mode]);

  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);
    setMessages([{ role: 'assistant', content: welcomeMessages[newMode] }]);
  };

  const streamChat = async (userMessages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
    
    let orderData = null;
    if (mode === 'order-inquiry' && user) {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      orderData = orders;
    }

    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        type: mode === 'recommendation' ? 'product-recommendation' : 'order-inquiry',
        messages: userMessages,
        productData: mode === 'recommendation' ? products.slice(0, 20).map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          algorithm: p.algorithm,
          hashrate: p.hashrate,
          power: p.power,
          efficiency: p.efficiency,
          price: p.price,
          category: p.category,
          inStock: p.inStock,
          coins: p.coins
        })) : null,
        orderData,
      }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error('Failed to start stream');
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let assistantContent = '';

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
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === 'assistant' && prev.length > 1) {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
              }
              return [...prev, { role: 'assistant', content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await streamChat([...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) !== 0), userMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: 'Best Bitcoin miner under $3000', icon: '₿' },
    { label: 'Low noise home miner', icon: '🏠' },
    { label: 'Most efficient miner', icon: '⚡' },
    { label: 'Beginner setup advice', icon: '🎓' },
  ];

  return (
    <>
      {/* Chat Toggle Button with Enhanced Animation */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-50 bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg group"
            aria-label="Open AI Assistant"
          >
            {/* Animated Glow Ring */}
            <motion.span
              className="absolute inset-0 rounded-full bg-primary"
              animate={{
                scale: [1, 1.4, 1.4],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1.2],
                opacity: [0.4, 0, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
            
            {/* Animated Bot Icon */}
            <motion.div
              className="relative z-10"
              animate={{
                y: [0, -3, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 },
              }}
            >
              <Bot className="h-6 w-6" />
              {/* Sparkle Effect */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <Sparkles className="h-3 w-3 text-accent" />
              </motion.div>
            </motion.div>
            
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
              AI Mining Consultant
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-border/50 overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="p-2 rounded-full bg-primary/20"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.div>
                    <CardTitle className="text-base">AI Mining Assistant</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Mode Switcher */}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant={mode === 'recommendation' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('recommendation')}
                    className="flex-1 text-xs"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Product Help
                  </Button>
                  <Button
                    size="sm"
                    variant={mode === 'order-inquiry' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('order-inquiry')}
                    className="flex-1 text-xs"
                  >
                    <Package className="h-3 w-3 mr-1" />
                    Order Status
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages */}
                <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-muted rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {messages.length <= 1 && mode === 'recommendation' && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground">Quick questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickActions.map((action, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setInput(action.label);
                              }}
                            >
                              <span className="mr-1">{action.icon}</span>
                              {action.label}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={mode === 'recommendation' ? "Ask about miners..." : "Ask about your order..."}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;