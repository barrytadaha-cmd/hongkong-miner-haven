import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Hello! I am interested in your ASIC miners.');
  const phoneNumber = '+14076764098';

  const handleSend = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const quickMessages = [
    'I want to inquire about product prices',
    'I need help choosing a miner',
    'I want to track my order',
    'I have a technical question',
  ];

  return (
    <>
      {/* WhatsApp Toggle Button with Animation */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg group"
            aria-label="Chat on WhatsApp"
          >
            {/* Pulse Ring Animation */}
            <motion.span
              className="absolute inset-0 rounded-full bg-[#25D366]"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.7, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-[#25D366]"
              animate={{
                scale: [1, 1.3, 1.3],
                opacity: [0.5, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
            />
            
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <MessageCircle className="h-6 w-6 relative z-10" />
            </motion.div>
            
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
              Chat with us on WhatsApp
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message Preview Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-[#25D366]/30 overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="p-2 rounded-full bg-white/20"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-base text-white">WhatsApp Chat</CardTitle>
                      <p className="text-xs text-white/80">Typically replies instantly</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Preview Message Display */}
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Message Preview:</p>
                  <div className="bg-[#DCF8C6] rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                    {message || 'Type your message below...'}
                  </div>
                </div>

                {/* Quick Messages */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Quick messages:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickMessages.map((msg, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMessage(msg)}
                        className="text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                      >
                        {msg}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="resize-none"
                  rows={3}
                />

                {/* Send Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={handleSend}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-12"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send via WhatsApp
                  </Button>
                </motion.div>

                <p className="text-xs text-center text-muted-foreground">
                  Opens WhatsApp with your message
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppButton;