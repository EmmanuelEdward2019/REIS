import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Package, 
  Warehouse, 
  ShoppingCart, 
  TrendingDown, 
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Building,
  Users,
  FileText,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  category: string;
  stock_quantity: number;
  min_stock_level: number;
  price: number;
  currency: string;
}

interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: any;
  address?: string;
  capacity_sqm?: number;
  is_active: boolean;
}

interface Supplier {
  id: string;
  name: string;
  code: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  rating: number;
  is_active: boolean;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  status: string;
  total_amount: number;
  currency: string;
  expected_delivery?: string;
  actual_delivery?: string;
  created_at: string;
  suppliers: {
    name: string;
    code: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    rating: number;
  };
}

interface BOM {
  id: string;
  name: string;
  code: string;
  description?: string;
  version: string;
  is_active: boolean;
}

const InventorySupplyChain = () => {
  const [activeTab, setActiveTab] = useState('stock-ledger');
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [boms, setBoms] = useState<BOM[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'warehouse' | 'supplier' | 'po' | 'bom'>('warehouse');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchWarehouses(),
        fetchSuppliers(),
        fetchPurchaseOrders(),
        fetchBOMs()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    setProducts(data || []);
  };

  const fetchWarehouses = async () => {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('name');
    
    if (error) throw error;
    setWarehouses(data || []);
  };

  const fetchSuppliers = async () => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    setSuppliers(data || []);
  };

  const fetchPurchaseOrders = async () => {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        suppliers (
          name,
          code,
          contact_person,
          email,
          phone,
          rating
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setPurchaseOrders(data || []);
  };

  const fetchBOMs = async () => {
    const { data, error } = await supabase
      .from('boms')
      .select('*')
      .order('name');
    
    if (error) throw error;
    setBoms(data || []);
  };

  const openDialog = (type: typeof dialogType, item?: any) => {
    setDialogType(type);
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity === 0) return { status: 'out-of-stock', color: 'bg-destructive' };
    if (quantity <= minLevel) return { status: 'low-stock', color: 'bg-accent' };
    return { status: 'in-stock', color: 'bg-success' };
  };

  const getSupplierRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-success';
    if (rating >= 3) return 'text-accent';
    return 'text-destructive';
  };

  const getPOStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-secondary';
      case 'approved': return 'bg-primary';
      case 'sent': return 'bg-accent';
      case 'received': return 'bg-success';
      case 'cancelled': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inventory & Supply Chain</h2>
          <p className="text-muted-foreground">Manage stock, warehouses, suppliers, and procurement</p>
        </div>
        <Button onClick={fetchAllData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-xl font-bold">
                  {products.filter(p => p.stock_quantity <= p.min_stock_level).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Warehouses</p>
                <p className="text-xl font-bold">{warehouses.filter(w => w.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Active POs</p>
                <p className="text-xl font-bold">
                  {purchaseOrders.filter(po => ['approved', 'sent'].includes(po.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stock-ledger">Stock Ledger</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="boms">BOMs & Kits</TabsTrigger>
        </TabsList>

        {/* Stock Ledger Tab */}
        <TabsContent value="stock-ledger" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Ledger</CardTitle>
              <CardDescription>Monitor inventory levels and reorder points</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock_quantity, product.min_stock_level);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.brand && (
                              <p className="text-sm text-muted-foreground">{product.brand} {product.model}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-mono">{product.stock_quantity}</TableCell>
                        <TableCell className="font-mono">{product.min_stock_level}</TableCell>
                        <TableCell>
                          <Badge className={stockStatus.color}>
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.currency} {Number(product.price).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">
                          {product.currency} {(product.stock_quantity * Number(product.price)).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warehouses Tab */}
        <TabsContent value="warehouses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Warehouse Management</h3>
            <Button onClick={() => openDialog('warehouse')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouses.map((warehouse) => (
              <Card key={warehouse.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                    <Badge variant={warehouse.is_active ? "default" : "secondary"}>
                      {warehouse.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>Code: {warehouse.code}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <Building className="h-4 w-4 inline mr-2" />
                      {warehouse.address || 'No address'}
                    </p>
                    {warehouse.capacity_sqm && (
                      <p className="text-sm">
                        Capacity: {warehouse.capacity_sqm} sqm
                      </p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => openDialog('warehouse', warehouse)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchase-orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Purchase Orders & GRNs</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => openDialog('supplier')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
              <Button onClick={() => openDialog('po')}>
                <Plus className="h-4 w-4 mr-2" />
                Create PO
              </Button>
            </div>
          </div>

          {/* Suppliers Section */}
          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((supplier) => (
                  <Card key={supplier.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{supplier.name}</h4>
                      <Badge variant={supplier.is_active ? "default" : "secondary"}>
                        {supplier.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Code: {supplier.code}</p>
                    <p className="text-sm text-muted-foreground mb-2">{supplier.contact_person}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${getSupplierRatingColor(supplier.rating)}`}>
                        Rating: {supplier.rating}/5
                      </span>
                      <Button variant="outline" size="sm" onClick={() => openDialog('supplier', supplier)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-mono">{po.po_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{po.suppliers.name}</p>
                          <p className="text-sm text-muted-foreground">{po.suppliers.code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPOStatusColor(po.status)}>
                          {po.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{po.currency} {Number(po.total_amount).toLocaleString()}</TableCell>
                      <TableCell>
                        {po.expected_delivery ? new Date(po.expected_delivery).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>{new Date(po.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openDialog('po', po)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOMs & Kits Tab */}
        <TabsContent value="boms" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">BOMs & Kits (EPC Bundles)</h3>
            <Button onClick={() => openDialog('bom')}>
              <Plus className="h-4 w-4 mr-2" />
              Create BOM
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boms.map((bom) => (
              <Card key={bom.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bom.name}</CardTitle>
                    <Badge variant={bom.is_active ? "default" : "secondary"}>
                      {bom.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Code: {bom.code} • Version: {bom.version}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {bom.description || 'No description'}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openDialog('bom', bom)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Generic Dialog for CRUD operations */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit' : 'Add'} {dialogType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update the' : 'Create a new'} {dialogType.replace('-', ' ')} record
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Forms for {dialogType} management will be implemented here
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button>
              {selectedItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventorySupplyChain;