import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, Bitcoin, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = totalPrice > 5000 ? 0 : 150;
  const finalTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Order placed successfully! You will receive a confirmation email shortly.');
    clearCart();
    navigate('/');
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-16">
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
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | MinerHoalan</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>

          <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name (Optional)</Label>
                      <Input id="company" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input id="address" required />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input id="state" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">Postal Code *</Label>
                        <Input id="zip" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input id="country" required />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="crypto" id="crypto" />
                        <Label htmlFor="crypto" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Bitcoin className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Cryptocurrency</p>
                            <p className="text-xs text-muted-foreground">BTC, ETH, USDT accepted</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="wire" id="wire" />
                        <Label htmlFor="wire" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Building2 className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Bank Transfer (SWIFT)</p>
                            <p className="text-xs text-muted-foreground">1-3 business days to confirm</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Credit Card</p>
                            <p className="text-xs text-muted-foreground">For orders under $5,000</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm text-primary font-semibold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
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
                        <p className="text-xs text-primary">Free shipping on orders over $5,000!</p>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between font-display font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${finalTotal.toLocaleString()}</span>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By placing this order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Checkout;
