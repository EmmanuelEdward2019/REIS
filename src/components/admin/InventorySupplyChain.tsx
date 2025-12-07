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
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// --- Forms ---

const ProductForm: React.FC<{ product?: any; onSave: (data: any) => void }> = ({ product, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'solar_panels',
    stock_quantity: product?.stock_quantity?.toString() || '0',
    min_stock_level: product?.min_stock_level?.toString() || '10',
    price: product?.price?.toString() || '0',
    currency: product?.currency || 'NGN'
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solar_panels">Solar Panels</SelectItem>
              <SelectItem value="inverters">Inverters</SelectItem>
              <SelectItem value="batteries">Batteries</SelectItem>
              <SelectItem value="cables">Cables</SelectItem>
              <SelectItem value="mounting">Mounting</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="min_stock_level">Min Level</Label>
          <Input
            id="min_stock_level"
            type="number"
            value={formData.min_stock_level}
            onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Unit Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(formData)}>
          {product ? 'Update' : 'Create'}
        </Button>
      </DialogFooter>
    </div>
  );
};

const WarehouseForm: React.FC<{ warehouse?: any; onSave: (data: any) => void }> = ({ warehouse, onSave }) => {
  const [formData, setFormData] = useState({
    name: warehouse?.name || '',
    code: warehouse?.code || '',
    address: warehouse?.address || '',
    capacity_sqm: warehouse?.capacity_sqm?.toString() || '',
    location: warehouse?.location ? JSON.stringify(warehouse.location) : '',
    is_active: warehouse?.is_active !== undefined ? warehouse.is_active : true
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Warehouse Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">Warehouse Code *</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="capacity_sqm">Capacity (sqm)</Label>
        <Input
          id="capacity_sqm"
          type="number"
          value={formData.capacity_sqm}
          onChange={(e) => setFormData({ ...formData, capacity_sqm: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(formData)}>
          {warehouse ? 'Update' : 'Create'}
        </Button>
      </DialogFooter>
    </div>
  );
};

const SupplierForm: React.FC<{ supplier?: any; onSave: (data: any) => void }> = ({ supplier, onSave }) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    code: supplier?.code || '',
    contact_person: supplier?.contact_person || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    rating: supplier?.rating?.toString() || '3',
    is_active: supplier?.is_active !== undefined ? supplier.is_active : true
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Supplier Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Supplier Code *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact_person">Contact Person</Label>
        <Input
          id="contact_person"
          value={formData.contact_person}
          onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rating">Rating (1-5)</Label>
        <Input
          id="rating"
          type="number"
          min="1"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(formData)}>
          {supplier ? 'Update' : 'Create'}
        </Button>
      </DialogFooter>
    </div>
  );
};

const PurchaseOrderForm: React.FC<{ po?: any; suppliers: any[]; onSave: (data: any) => void }> = ({ po, suppliers, onSave }) => {
  const [formData, setFormData] = useState({
    supplier_id: po?.supplier_id || '',
    po_number: po?.po_number || `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    total_amount: po?.total_amount?.toString() || '0',
    currency: po?.currency || 'NGN',
    expected_delivery: po?.expected_delivery ? new Date(po.expected_delivery).toISOString().split('T')[0] : '',
    status: po?.status || 'draft'
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="po_number">PO Number *</Label>
          <Input
            id="po_number"
            value={formData.po_number}
            onChange={(e) => setFormData({ ...formData, po_number: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier_id">Supplier *</Label>
          <Select
            value={formData.supplier_id}
            onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="total_amount">Total Amount</Label>
          <Input
            id="total_amount"
            type="number"
            value={formData.total_amount}
            onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expected_delivery">Expected Delivery</Label>
          <Input
            id="expected_delivery"
            type="date"
            value={formData.expected_delivery}
            onChange={(e) => setFormData({ ...formData, expected_delivery: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(formData)}>
          {po ? 'Update' : 'Create'}
        </Button>
      </DialogFooter>
    </div>
  );
};

const BOMForm: React.FC<{ bom?: any; onSave: (data: any) => void }> = ({ bom, onSave }) => {
  const [formData, setFormData] = useState({
    name: bom?.name || '',
    code: bom?.code || '',
    description: bom?.description || '',
    version: bom?.version || '1.0',
    is_active: bom?.is_active !== undefined ? bom.is_active : true
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">BOM Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">BOM Code *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2 pt-8">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(formData)}>
          {bom ? 'Update' : 'Create'}
        </Button>
      </DialogFooter>
    </div>
  );
};

// --- Main Component ---

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
  const [dialogType, setDialogType] = useState<'product' | 'warehouse' | 'supplier' | 'po' | 'bom'>('warehouse');
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

  const handleSaveProduct = async (data: any) => {
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('products')
          .update({
            name: data.name,
            category: data.category,
            stock_quantity: parseInt(data.stock_quantity),
            min_stock_level: parseInt(data.min_stock_level),
            price: parseFloat(data.price),
            currency: data.currency,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedItem.id);
        if (error) throw error;
        toast({ title: 'Product updated successfully' });
      } else {
        // Note: Products are usually created in ProductManager, but we allow edits here
        // If we want to allow creation here, we need to handle all fields
        toast({ title: 'Please use Product Manager to create new products', variant: 'destructive' });
        return;
      }
      setDialogOpen(false);
      setSelectedItem(null);
      fetchProducts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSaveSupplier = async (data: any) => {
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('suppliers')
          .update({
            name: data.name,
            code: data.code,
            contact_person: data.contact_person,
            email: data.email,
            phone: data.phone,
            rating: parseInt(data.rating),
            is_active: data.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedItem.id);
        if (error) throw error;
        toast({ title: 'Supplier updated successfully' });
      } else {
        const { error } = await supabase
          .from('suppliers')
          .insert([{
            name: data.name,
            code: data.code,
            contact_person: data.contact_person,
            email: data.email,
            phone: data.phone,
            rating: parseInt(data.rating),
            is_active: true
          }]);
        if (error) throw error;
        toast({ title: 'Supplier created successfully' });
      }
      setDialogOpen(false);
      setSelectedItem(null);
      fetchSuppliers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSavePO = async (data: any) => {
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('purchase_orders')
          .update({
            supplier_id: data.supplier_id,
            po_number: data.po_number,
            total_amount: parseFloat(data.total_amount),
            currency: data.currency,
            expected_delivery: data.expected_delivery || null,
            status: data.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedItem.id);
        if (error) throw error;
        toast({ title: 'Purchase Order updated successfully' });
      } else {
        const { error } = await supabase
          .from('purchase_orders')
          .insert([{
            supplier_id: data.supplier_id,
            po_number: data.po_number,
            total_amount: parseFloat(data.total_amount),
            currency: data.currency,
            expected_delivery: data.expected_delivery || null,
            status: data.status
          }]);
        if (error) throw error;
        toast({ title: 'Purchase Order created successfully' });
      }
      setDialogOpen(false);
      setSelectedItem(null);
      fetchPurchaseOrders();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSaveBOM = async (data: any) => {
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('boms')
          .update({
            name: data.name,
            code: data.code,
            description: data.description,
            version: data.version,
            is_active: data.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedItem.id);
        if (error) throw error;
        toast({ title: 'BOM updated successfully' });
      } else {
        const { error } = await supabase
          .from('boms')
          .insert([{
            name: data.name,
            code: data.code,
            description: data.description,
            version: data.version,
            is_active: true
          }]);
        if (error) throw error;
        toast({ title: 'BOM created successfully' });
      }
      setDialogOpen(false);
      setSelectedItem(null);
      fetchBOMs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
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
                    <TableHead>Actions</TableHead>
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
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => openDialog('product', product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
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
                            <Edit className="h-4 w-4" />
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
                      <Edit className="h-4 w-4" />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit' : 'Add'} {
                dialogType === 'warehouse' ? 'Warehouse' :
                  dialogType === 'supplier' ? 'Supplier' :
                    dialogType === 'po' ? 'Purchase Order' :
                      dialogType === 'bom' ? 'BOM' : 'Product'
              }
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update the' : 'Create a new'} {
                dialogType === 'warehouse' ? 'warehouse' :
                  dialogType === 'supplier' ? 'supplier' :
                    dialogType === 'po' ? 'purchase order' :
                      dialogType === 'bom' ? 'BOM' : 'product'
              } record
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {dialogType === 'warehouse' && (
              <WarehouseForm
                warehouse={selectedItem}
                onSave={async (data) => {
                  try {
                    if (selectedItem) {
                      const { error } = await supabase
                        .from('warehouses')
                        .update({
                          name: data.name,
                          code: data.code,
                          address: data.address,
                          capacity_sqm: data.capacity_sqm ? parseFloat(data.capacity_sqm) : null,
                          location: data.location ? JSON.parse(data.location) : { address: data.address },
                          is_active: data.is_active !== undefined ? data.is_active : true,
                          updated_at: new Date().toISOString()
                        })
                        .eq('id', selectedItem.id);
                      if (error) throw error;
                      toast({ title: 'Warehouse updated successfully' });
                    } else {
                      const { error } = await supabase
                        .from('warehouses')
                        .insert([{
                          name: data.name,
                          code: data.code,
                          address: data.address,
                          capacity_sqm: data.capacity_sqm ? parseFloat(data.capacity_sqm) : null,
                          location: data.location ? JSON.parse(data.location) : { address: data.address },
                          is_active: true
                        }]);
                      if (error) throw error;
                      toast({ title: 'Warehouse created successfully' });
                    }
                    setDialogOpen(false);
                    setSelectedItem(null);
                    fetchWarehouses();
                  } catch (error: any) {
                    toast({ title: 'Error', description: error.message, variant: 'destructive' });
                  }
                }}
              />
            )}
            {dialogType === 'product' && (
              <ProductForm
                product={selectedItem}
                onSave={handleSaveProduct}
              />
            )}
            {dialogType === 'supplier' && (
              <SupplierForm
                supplier={selectedItem}
                onSave={handleSaveSupplier}
              />
            )}
            {dialogType === 'po' && (
              <PurchaseOrderForm
                po={selectedItem}
                suppliers={suppliers}
                onSave={handleSavePO}
              />
            )}
            {dialogType === 'bom' && (
              <BOMForm
                bom={selectedItem}
                onSave={handleSaveBOM}
              />
            )}
          </div>

          {/* DialogFooter is handled inside the forms */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventorySupplyChain;