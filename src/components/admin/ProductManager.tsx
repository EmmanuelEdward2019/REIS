import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import FormDialog from '@/components/common/FormDialog';
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    Package,
    DollarSign,
    TrendingUp,
    AlertCircle,
    Loader2,
    CheckCircle,
    XCircle,
    Image as ImageIcon
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string | null;
    category: string;
    subcategory: string | null;
    price_ngn: number;
    price_gbp: number;
    brand: string | null;
    sku: string;
    stock_quantity: number;
    low_stock_threshold: number | null;
    specifications: any;
    images: string[] | null;
    supplier_partner_id: string | null;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface ProductFormData {
    name: string;
    description: string;
    category: string;
    subcategory: string;
    price_ngn: string;
    price_gbp: string;
    brand: string;
    sku: string;
    stock_quantity: string;
    low_stock_threshold: string;
    is_active: boolean;
    is_featured: boolean;
}

const ProductManager = () => {
    const { user, profile } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        category: 'solar_panels',
        subcategory: '',
        price_ngn: '',
        price_gbp: '',
        brand: '',
        sku: '',
        stock_quantity: '0',
        low_stock_threshold: '10',
        is_active: true,
        is_featured: false,
    });

    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user, profile]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (profile?.user_role === 'partner') {
                query = query.eq('partner_id', user?.id);
            }

            const { data, error } = await query;

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.name || !formData.sku) {
                toast.error('Please fill in product name and SKU');
                return;
            }

            const productData: any = {
                name: formData.name,
                description: formData.description || null,
                category: formData.category,
                subcategory: formData.subcategory || null,
                price_ngn: parseFloat(formData.price_ngn) || 0,
                price_gbp: parseFloat(formData.price_gbp) || 0,
                brand: formData.brand || null,
                sku: formData.sku,
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                low_stock_threshold: parseInt(formData.low_stock_threshold) || 10,
                is_active: formData.is_active,
                is_featured: formData.is_featured,
            };

            if (profile?.user_role === 'partner') {
                productData.partner_id = user?.id;
            }

            const { error } = await supabase
                .from('products')
                .insert([productData]);

            if (error) throw error;

            toast.success('Product created successfully');
            setShowAddDialog(false);
            resetForm();
            fetchProducts();
        } catch (error: any) {
            console.error('Error creating product:', error);
            toast.error(error.message || 'Failed to create product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('products')
                .update({
                    name: formData.name,
                    description: formData.description || null,
                    category: formData.category,
                    subcategory: formData.subcategory || null,
                    price_ngn: parseFloat(formData.price_ngn) || 0,
                    price_gbp: parseFloat(formData.price_gbp) || 0,
                    brand: formData.brand || null,
                    sku: formData.sku,
                    stock_quantity: parseInt(formData.stock_quantity) || 0,
                    low_stock_threshold: parseInt(formData.low_stock_threshold) || 10,
                    is_active: formData.is_active,
                    is_featured: formData.is_featured,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingProduct.id);

            if (error) throw error;

            toast.success('Product updated successfully');
            setShowEditDialog(false);
            setEditingProduct(null);
            resetForm();
            fetchProducts();
        } catch (error: any) {
            console.error('Error updating product:', error);
            toast.error(error.message || 'Failed to update product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async (product: Product) => {
        if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', product.id);

            if (error) throw error;

            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error: any) {
            console.error('Error deleting product:', error);
            toast.error(error.message || 'Failed to delete product');
        }
    };

    const toggleProductStatus = async (product: Product) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_active: !product.is_active })
                .eq('id', product.id);

            if (error) throw error;

            toast.success(`Product ${!product.is_active ? 'activated' : 'deactivated'}`);
            fetchProducts();
        } catch (error: any) {
            console.error('Error toggling product status:', error);
            toast.error('Failed to update product status');
        }
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            category: product.category,
            subcategory: product.subcategory || '',
            price_ngn: product.price_ngn.toString(),
            price_gbp: product.price_gbp.toString(),
            brand: product.brand || '',
            sku: product.sku,
            stock_quantity: product.stock_quantity.toString(),
            low_stock_threshold: product.low_stock_threshold?.toString() || '10',
            is_active: product.is_active,
            is_featured: product.is_featured,
        });
        setShowEditDialog(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: 'solar_panels',
            subcategory: '',
            price_ngn: '',
            price_gbp: '',
            brand: '',
            sku: '',
            stock_quantity: '0',
            low_stock_threshold: '10',
            is_active: true,
            is_featured: false,
        });
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && product.is_active) ||
            (statusFilter === 'inactive' && !product.is_active) ||
            (statusFilter === 'low_stock' && product.stock_quantity <= (product.low_stock_threshold || 10));

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStockBadge = (product: Product) => {
        if (product.stock_quantity === 0) {
            return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Out of Stock</Badge>;
        }
        if (product.stock_quantity <= (product.low_stock_threshold || 10)) {
            return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Low Stock</Badge>;
        }
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">In Stock</Badge>;
    };

    // Statistics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.is_active).length;
    const lowStockProducts = products.filter(p => p.stock_quantity <= (p.low_stock_threshold || 10)).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price_ngn * p.stock_quantity), 0);

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
                                <p className="text-2xl font-bold">{totalProducts}</p>
                                <p className="text-sm text-muted-foreground">Total Products</p>
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
                                <p className="text-2xl font-bold">{activeProducts}</p>
                                <p className="text-sm text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{lowStockProducts}</p>
                                <p className="text-sm text-muted-foreground">Low Stock</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">₦{(totalValue / 1000000).toFixed(1)}M</p>
                                <p className="text-sm text-muted-foreground">Inventory Value</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Product Management Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Product Catalog
                            </CardTitle>
                            <CardDescription>
                                Manage solar panels, inverters, batteries, and accessories
                            </CardDescription>
                        </div>
                        <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="solar_panels">Solar Panels</SelectItem>
                                <SelectItem value="inverters">Inverters</SelectItem>
                                <SelectItem value="batteries">Batteries</SelectItem>
                                <SelectItem value="charge_controllers">Charge Controllers</SelectItem>
                                <SelectItem value="mounting">Mounting & Racking</SelectItem>
                                <SelectItem value="cables">Cables & Connectors</SelectItem>
                                <SelectItem value="monitoring">Monitoring Systems</SelectItem>
                                <SelectItem value="accessories">Accessories</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="low_stock">Low Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Products Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Price (NGN)</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No products found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{product.name}</div>
                                                        {product.brand && (
                                                            <div className="text-sm text-muted-foreground">{product.brand}</div>
                                                        )}
                                                        {product.is_featured && (
                                                            <Badge variant="outline" className="text-xs">Featured</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{product.category.replace('_', ' ')}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-sm">{product.sku}</code>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3" />
                                                        {product.price_ngn.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium">{product.stock_quantity}</div>
                                                        {getStockBadge(product)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {product.is_active ? (
                                                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => toggleProductStatus(product)}
                                                        >
                                                            {product.is_active ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEditDialog(product)}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteProduct(product)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Product Dialog */}
            <FormDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                title="Add New Product"
                description="Add a new product to the catalog"
                onSubmit={handleCreateProduct}
                submitLabel="Create Product"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="500W Monocrystalline Solar Panel"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                                id="brand"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                placeholder="SunPower"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Product description..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
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
                                    <SelectItem value="charge_controllers">Charge Controllers</SelectItem>
                                    <SelectItem value="mounting">Mounting & Racking</SelectItem>
                                    <SelectItem value="cables">Cables & Connectors</SelectItem>
                                    <SelectItem value="monitoring">Monitoring Systems</SelectItem>
                                    <SelectItem value="accessories">Accessories</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU *</Label>
                            <Input
                                id="sku"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                placeholder="SP-500W-MONO"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock_quantity">Stock Quantity</Label>
                            <Input
                                id="stock_quantity"
                                type="number"
                                value={formData.stock_quantity}
                                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                placeholder="100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price_ngn">Price (NGN) *</Label>
                            <Input
                                id="price_ngn"
                                type="number"
                                step="0.01"
                                value={formData.price_ngn}
                                onChange={(e) => setFormData({ ...formData, price_ngn: e.target.value })}
                                placeholder="150000"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_gbp">Price (GBP)</Label>
                            <Input
                                id="price_gbp"
                                type="number"
                                step="0.01"
                                value={formData.price_gbp}
                                onChange={(e) => setFormData({ ...formData, price_gbp: e.target.value })}
                                placeholder="120"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                            <Input
                                id="low_stock_threshold"
                                type="number"
                                value={formData.low_stock_threshold}
                                onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                                placeholder="10"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Active (visible in shop)
                            </Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="is_featured" className="cursor-pointer">
                                Featured product
                            </Label>
                        </div>
                    </div>
                </div>
            </FormDialog>

            {/* Edit Product Dialog - Similar structure */}
            <FormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                title="Edit Product"
                description="Update product information"
                onSubmit={handleUpdateProduct}
                submitLabel="Save Changes"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_name">Product Name *</Label>
                            <Input
                                id="edit_name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_brand">Brand</Label>
                            <Input
                                id="edit_brand"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_description">Description</Label>
                        <Textarea
                            id="edit_description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_category">Category *</Label>
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
                                    <SelectItem value="charge_controllers">Charge Controllers</SelectItem>
                                    <SelectItem value="mounting">Mounting & Racking</SelectItem>
                                    <SelectItem value="cables">Cables & Connectors</SelectItem>
                                    <SelectItem value="monitoring">Monitoring Systems</SelectItem>
                                    <SelectItem value="accessories">Accessories</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_sku">SKU *</Label>
                            <Input
                                id="edit_sku"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_stock_quantity">Stock Quantity</Label>
                            <Input
                                id="edit_stock_quantity"
                                type="number"
                                value={formData.stock_quantity}
                                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_price_ngn">Price (NGN) *</Label>
                            <Input
                                id="edit_price_ngn"
                                type="number"
                                step="0.01"
                                value={formData.price_ngn}
                                onChange={(e) => setFormData({ ...formData, price_ngn: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_price_gbp">Price (GBP)</Label>
                            <Input
                                id="edit_price_gbp"
                                type="number"
                                step="0.01"
                                value={formData.price_gbp}
                                onChange={(e) => setFormData({ ...formData, price_gbp: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_low_stock_threshold">Low Stock Alert</Label>
                            <Input
                                id="edit_low_stock_threshold"
                                type="number"
                                value={formData.low_stock_threshold}
                                onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="edit_is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="edit_is_active" className="cursor-pointer">
                                Active (visible in shop)
                            </Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="edit_is_featured"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="edit_is_featured" className="cursor-pointer">
                                Featured product
                            </Label>
                        </div>
                    </div>
                </div>
            </FormDialog>
        </div>
    );
};

export default ProductManager;
