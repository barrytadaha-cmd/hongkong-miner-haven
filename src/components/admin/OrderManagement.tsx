import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, Truck, RefreshCw, ChevronDown, ChevronUp, Search, Filter, Calendar, X, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  shipping_postal_code: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  user_email?: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const orderStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter (order ID)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(searchLower);
        const matchesTracking = order.tracking_number?.toLowerCase().includes(searchLower);
        if (!matchesId && !matchesTracking) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      // Date range filter
      const orderDate = new Date(order.created_at);
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (orderDate < fromDate) return false;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (orderDate > toDate) return false;
      }

      return true;
    });
  }, [orders, searchQuery, statusFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFrom || dateTo;

  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast({
        title: 'No orders to export',
        description: 'Apply different filters or wait for orders to appear.',
        variant: 'destructive',
      });
      return;
    }

    // Build CSV content
    const headers = [
      'Order ID',
      'Date',
      'Status',
      'Total Amount',
      'Tracking Number',
      'Shipping Address',
      'City',
      'Country',
      'Postal Code',
      'Items',
      'Notes'
    ];

    const rows = filteredOrders.map((order) => {
      const items = order.order_items
        .map((item) => `${item.product_name} (x${item.quantity})`)
        .join('; ');

      return [
        order.id,
        new Date(order.created_at).toISOString(),
        order.status,
        order.total_amount.toString(),
        order.tracking_number || '',
        order.shipping_address || '',
        order.shipping_city || '',
        order.shipping_country || '',
        order.shipping_postal_code || '',
        items,
        order.notes || ''
      ];
    });

    // Escape CSV fields
    const escapeField = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map(escapeField).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export complete',
      description: `${filteredOrders.length} orders exported to CSV.`,
    });
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching orders',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setOrders((data as Order[]) || []);
      // Initialize tracking inputs
      const trackingMap: Record<string, string> = {};
      data?.forEach((order: Order) => {
        trackingMap[order.id] = order.tracking_number || '';
      });
      setTrackingInputs(trackingMap);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, userEmail?: string) => {
    setUpdatingOrder(orderId);

    const order = orders.find(o => o.id === orderId);
    const oldStatus = order?.status;

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Status updated',
        description: `Order status changed to ${newStatus}`,
      });

      // Send email notification
      if (oldStatus !== newStatus) {
        sendStatusNotification(orderId, newStatus, order?.tracking_number || null);
      }
    }

    setUpdatingOrder(null);
  };

  const updateTrackingNumber = async (orderId: string) => {
    const trackingNumber = trackingInputs[orderId];
    setUpdatingOrder(orderId);

    const { error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber || null })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Error updating tracking',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Tracking updated',
        description: 'Tracking number has been saved.',
      });

      // Send notification if tracking was added
      if (trackingNumber) {
        const order = orders.find(o => o.id === orderId);
        sendStatusNotification(orderId, order?.status || 'shipped', trackingNumber);
      }
    }

    setUpdatingOrder(null);
  };

  const sendStatusNotification = async (orderId: string, status: string, trackingNumber: string | null) => {
    try {
      const response = await supabase.functions.invoke('send-order-notification', {
        body: { orderId, status, trackingNumber },
      });

      if (response.error) {
        console.error('Email notification error:', response.error);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Management
              </CardTitle>
              <CardDescription>
                View and manage all customer orders ({filteredOrders.length} of {orders.length} orders)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={fetchOrders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID or Tracking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    <span className="capitalize">{status}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date From */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[150px]"
                placeholder="From"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[150px]"
                placeholder="To"
              />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Collapsible
                key={order.id}
                open={expandedOrder === order.id}
                onOpenChange={(open) => setExpandedOrder(open ? order.id : null)}
              >
                <div className="border border-border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 text-left hover:bg-muted/50 transition-colors">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">${order.total_amount.toLocaleString()}</span>
                        <Badge className={statusColors[order.status] || ''}>
                          <span className="capitalize">{order.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/30 space-y-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Items</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-center">Qty</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.order_items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.product_name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">${item.unit_price.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-medium">
                                  ${(item.unit_price * item.quantity).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Shipping Address */}
                      {order.shipping_address && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Shipping Address</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.shipping_address}<br />
                            {[order.shipping_city, order.shipping_postal_code, order.shipping_country]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        </div>
                      )}

                      {/* Notes */}
                      {order.notes && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Notes</h4>
                          <p className="text-sm text-muted-foreground">{order.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                        {/* Status Update */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Update Status</label>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                            disabled={updatingOrder === order.id}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {orderStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  <span className="capitalize">{status}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Tracking Number */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tracking Number</label>
                          <div className="flex gap-2">
                            <Input
                              value={trackingInputs[order.id] || ''}
                              onChange={(e) => setTrackingInputs({
                                ...trackingInputs,
                                [order.id]: e.target.value,
                              })}
                              placeholder="Enter tracking number"
                            />
                            <Button
                              size="sm"
                              onClick={() => updateTrackingNumber(order.id)}
                              disabled={updatingOrder === order.id}
                            >
                              {updatingOrder === order.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Truck className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
