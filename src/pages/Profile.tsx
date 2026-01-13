import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Loader2, 
  User, 
  Package, 
  Settings, 
  MapPin, 
  Phone, 
  Mail,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  FileText
} from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  preferences: unknown;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  shipping_postal_code: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  order_items: {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
  }[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <CheckCircle2 className="h-4 w-4" />,
  processing: <Package className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();

      // Subscribe to real-time order updates
      const channel = supabase
        .channel('order-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === 'UPDATE') {
              setOrders((prev) =>
                prev.map((order) =>
                  order.id === payload.new.id
                    ? { ...order, ...payload.new }
                    : order
                )
              );
            } else if (payload.eventType === 'INSERT') {
              fetchOrders(); // Refresh to get order items
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user!.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
        postal_code: data.postal_code || '',
      });
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data as Order[]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        country: formData.country || null,
        postal_code: formData.postal_code || null,
      })
      .eq('user_id', user!.id);

    if (error) {
      toast({
        title: 'Error saving profile',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully.',
      });
    }

    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Helmet>
        <title>My Account | Miner Haolan</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">My Account</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and shipping address
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              value={formData.full_name}
                              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+1 234 567 890"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Shipping Address
                          </h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Street Address</Label>
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="123 Main Street"
                            />
                          </div>

                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="Hong Kong"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country">Country</Label>
                              <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                placeholder="Hong Kong SAR"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="postal_code">Postal Code</Label>
                              <Input
                                id="postal_code"
                                value={formData.postal_code}
                                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                placeholder="000000"
                              />
                            </div>
                          </div>
                        </div>

                        <Button type="submit" disabled={saving}>
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {formData.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formData.phone}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="text-sm text-muted-foreground">
                        <p>Total Orders: {orders.length}</p>
                        <p className="mt-1">
                          Member since: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and track your orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate('/shop')}>
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Collapsible key={order.id}>
                          <div className="border border-border rounded-lg overflow-hidden">
                            <CollapsibleTrigger className="w-full p-6 text-left hover:bg-muted/50 transition-colors">
                              <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="flex items-start gap-4">
                                  <ChevronDown className="h-5 w-5 text-muted-foreground mt-0.5 transition-transform [[data-state=open]_&]:rotate-180" />
                                  <div>
                                    <p className="font-medium">
                                      Order #{order.id.slice(0, 8).toUpperCase()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      })}
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                      ${order.total_amount.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <Badge className={statusColors[order.status] || ''}>
                                  {statusIcons[order.status]}
                                  <span className="ml-1 capitalize">{order.status}</span>
                                </Badge>
                              </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <div className="px-6 pb-6 pt-2 border-t border-border bg-muted/30">
                                {/* Order Items */}
                                <div className="space-y-3 mb-6">
                                  <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Items
                                  </h4>
                                  {order.order_items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm pl-6">
                                      <span>
                                        {item.product_name} × {item.quantity}
                                      </span>
                                      <span className="font-medium">
                                        ${(item.unit_price * item.quantity).toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {/* Shipping Address */}
                                {(order.shipping_address || order.shipping_city) && (
                                  <div className="mb-6">
                                    <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                                      <MapPin className="h-4 w-4" />
                                      Shipping Address
                                    </h4>
                                    <div className="text-sm text-muted-foreground pl-6 space-y-1">
                                      {order.shipping_address && <p>{order.shipping_address}</p>}
                                      <p>
                                        {[order.shipping_city, order.shipping_postal_code, order.shipping_country]
                                          .filter(Boolean)
                                          .join(', ')}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Tracking Number */}
                                {order.tracking_number && (
                                  <div className="mb-6">
                                    <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                                      <Truck className="h-4 w-4" />
                                      Tracking
                                    </h4>
                                    <p className="text-sm text-muted-foreground pl-6 font-mono">
                                      {order.tracking_number}
                                    </p>
                                  </div>
                                )}

                                {/* Order Notes */}
                                {order.notes && (
                                  <div>
                                    <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                                      <FileText className="h-4 w-4" />
                                      Notes
                                    </h4>
                                    <p className="text-sm text-muted-foreground pl-6">
                                      {order.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Notification preferences coming soon.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back.
                    </p>
                    <Button variant="destructive" disabled>
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </Layout>
  );
}
