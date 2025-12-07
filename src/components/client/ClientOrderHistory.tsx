import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    Search,
    Filter,
    Eye,
    Download,
    RefreshCw,
    ShoppingCart,
    Loader2,
    Calendar,
    DollarSign,
    Truck,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';

interface Order {
    id: string;
    order_number: string;
    status: string;
    payment_status: string;
    total_amount: number;
    currency: string;
    created_at: string;
    shipping_address: any;
    order_items?: OrderItem[];
}

interface OrderItem {
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    products: {
        name: string;
        brand?: string;
        model?: string;
    };
}

const ClientOrderHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;

        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            total_price,
            products (
              name,
              brand,
              model
            )
          )
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailDialog(true);
    };

    const handleReorder = async (order: Order) => {
        if (!order.order_items || order.order_items.length === 0) {
            toast.error('Cannot reorder - no items found');
            return;
        }

        try {
            // Add items to cart (simplified - in real app, use CartContext)
            toast.success('Items added to cart');
            navigate('/shop');
        } catch (error) {
            console.error('Error reordering:', error);
            toast.error('Failed to add items to cart');
        }
    };

    const handleDownloadInvoice = (order: Order) => {
        // In a real implementation, this would generate/download a PDF invoice
        toast.info(`Invoice download for order ${order.order_number} coming soon`);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
            confirmed: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: CheckCircle },
            processing: { className: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: RefreshCw },
            shipped: { className: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: Truck },
            delivered: { className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
            cancelled: { className: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {status}
            </Badge>
        );
    };

    const getPaymentStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
            paid: { className: 'bg-success/10 text-success border-success/20' },
            failed: { className: 'bg-destructive/10 text-destructive border-destructive/20' },
            refunded: { className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return (
            <Badge variant="outline" className={config.className}>
                {status}
            </Badge>
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Statistics
    const totalOrders = orders.length;
    const totalSpent = orders
        .filter(o => o.payment_status === 'paid')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalOrders}</p>
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <DollarSign className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{pendingOrders}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <CheckCircle className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{completedOrders}</p>
                                <p className="text-sm text-muted-foreground">Completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order History
                            </CardTitle>
                            <CardDescription>
                                View and manage your purchase history
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={fetchOrders}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button onClick={() => navigate('/shop')}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Orders Table */}
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'No orders match your current filters.'
                                    : "You haven't made any purchases yet."}
                            </p>
                            <Button onClick={() => navigate('/shop')}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Browse Shop
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order Number</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <code className="text-sm font-mono">{order.order_number}</code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {order.order_items?.length || 0} items
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {order.currency} {Number(order.total_amount).toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewOrder(order)}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDownloadInvoice(order)}
                                                    >
                                                        <Download className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReorder(order)}
                                                    >
                                                        <ShoppingCart className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Order {selectedOrder?.order_number}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Order Information</h4>
                                    <p className="text-sm">Status: {getStatusBadge(selectedOrder.status)}</p>
                                    <p className="text-sm">Payment: {getPaymentStatusBadge(selectedOrder.payment_status)}</p>
                                    <p className="text-sm">Date: {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Total Amount</h4>
                                    <p className="text-2xl font-bold">
                                        {selectedOrder.currency} {Number(selectedOrder.total_amount).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Order Items</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit Price</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedOrder.order_items?.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{item.products.name}</div>
                                                        {item.products.brand && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {item.products.brand} {item.products.model}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>
                                                    {selectedOrder.currency} {Number(item.unit_price).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {selectedOrder.currency} {Number(item.total_price).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {selectedOrder.shipping_address && (
                                <div>
                                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {JSON.stringify(selectedOrder.shipping_address)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ClientOrderHistory;
