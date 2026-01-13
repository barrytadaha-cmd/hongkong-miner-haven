import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const shippingCost = totalPrice > 5000 ? 0 : 150;
  const finalTotal = totalPrice + shippingCost;

  // Generate WhatsApp message with cart details - professionally formatted
  const generateWhatsAppMessage = (orderRef?: string): string => {
    const orderItems = items.map(item => 
      `   🔹 *${item.name}*\n      Qty: ${item.quantity} × $${item.price.toLocaleString()} = *$${(item.price * item.quantity).toLocaleString()}*`
    ).join('\n\n');

    const divider = '━━━━━━━━━━━━━━━━━━━━━━';

    const message = `🛒 *NEW ORDER REQUEST*
${orderRef ? `\n🔖 *Order Reference:* \`${orderRef}\`\n` : ''}
${divider}

📦 *ORDER ITEMS*

${orderItems}

${divider}

💰 *ORDER SUMMARY*

   📋 Subtotal: $${totalPrice.toLocaleString()}
   🚚 Shipping: ${shippingCost === 0 ? '_FREE_ ✨' : `$${shippingCost}`}
   
   💵 *TOTAL: $${finalTotal.toLocaleString()}*

${divider}

📍 *NEXT STEPS*

   1️⃣ Confirm product availability
   2️⃣ Receive payment details
   3️⃣ Complete payment
   4️⃣ Get tracking number

_Thank you for choosing *Miner Haolan*!_ 🙏

⏰ We typically respond within 1-2 hours during business hours.`;

    return message;
  };

  const saveOrderToDatabase = async () => {
    if (!user) {
      return null;
    }

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: finalTotal,
          status: 'pending' as const,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order.id;
    } catch (error) {
      console.error('Error saving order:', error);
      return null;
    }
  };

  const handleWhatsAppCheckout = async () => {
    setIsSubmitting(true);
    
    let orderRef: string | undefined;
    
    // Save order to database if user is logged in
    if (user) {
      const savedOrderId = await saveOrderToDatabase();
      if (savedOrderId) {
        orderRef = savedOrderId.slice(0, 8).toUpperCase();
        setOrderId(savedOrderId);
      }
    }

    const phoneNumber = '14076764098';
    const message = generateWhatsAppMessage(orderRef);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Show success state
    setOrderPlaced(true);
    setIsSubmitting(false);
    
    if (user && orderRef) {
      toast.success('Order saved! Complete your order via WhatsApp.');
    } else {
      toast.success('Complete your order via WhatsApp!');
    }
  };

  const handleClearAndReset = () => {
    clearCart();
    setOrderPlaced(false);
    setOrderId(null);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <main className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-6">Add some miners to get started</p>
              <Button asChild>
                <Link to="/shop">Browse Miners</Link>
              </Button>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Checkout | Miner Haolan</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="pb-16">
        {/* Hero */}
        <div className="bg-navy text-navy-foreground py-12">
          <div className="container mx-auto px-4">
            <Button variant="ghost" asChild className="mb-4 text-navy-foreground/70 hover:text-navy-foreground">
              <Link to="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Checkout</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-secondary rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain bg-background rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.brand} • {item.algorithm}</p>
                        <p className="text-sm text-muted-foreground">Hashrate: {item.hashrate}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="font-bold text-primary">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
                    </div>
                    {shippingCost === 0 && (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Free shipping on orders over $5,000!
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-display font-bold text-xl">
                    <span>Total</span>
                    <span className="text-primary">${finalTotal.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* WhatsApp Checkout */}
            <div className="lg:col-span-1">
              <Card className="sticky top-32">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    Complete via WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Click the button below to send your order to our sales team via WhatsApp. 
                    We'll confirm availability and provide payment options.
                  </p>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Instant response during business hours</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Secure payment options available</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Get answers to any questions</span>
                    </div>
                  </div>

                  {!user && (
                    <div className="p-3 rounded-lg bg-muted/50 border border-border mb-4">
                      <p className="text-xs text-muted-foreground">
                        <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to track your order and view order history.
                      </p>
                    </div>
                  )}

                  {orderPlaced ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="font-semibold text-green-500">Order Sent!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Complete your order in WhatsApp
                        </p>
                        {orderId && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Order Ref: {orderId.slice(0, 8).toUpperCase()}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleClearAndReset}
                      >
                        Clear Cart & Start New Order
                      </Button>
                      {user && (
                        <Button
                          variant="ghost"
                          className="w-full"
                          asChild
                        >
                          <Link to="/profile">View My Orders</Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                      onClick={handleWhatsAppCheckout}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <MessageCircle className="h-5 w-5 mr-2" />
                      )}
                      {isSubmitting ? 'Processing...' : 'Order via WhatsApp'}
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    Your order details will be sent to our sales team at +1 407 676 4098
                  </p>

                  <Separator />

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Prefer email?</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:sales@minerhaolan.com?subject=Order Inquiry&body=${encodeURIComponent(generateWhatsAppMessage())}`}>
                        Contact via Email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Checkout;