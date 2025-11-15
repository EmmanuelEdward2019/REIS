import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Package, Plus, Edit, Loader2, Eye, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price_ngn: number;
  price_gbp: number;
  brand: string;
  sku: string;
  stock_quantity: number;
  specifications: any;
  images: string[];
  is_active: boolean;
  approval_status: string;
  approval_notes: string | null;
  created_at: string;
}

const PartnerProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [partnerProfileId, setPartnerProfileId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    stock_quantity: 0,
    price_ngn: 0,
    price_gbp: 0,
  });

  useEffect(() => {
    fetchPartnerProfile();
  }, []);

  useEffect(() => {
    if (partnerProfileId) {
      fetchProducts();
    }
  }, [partnerProfileId]);

  const fetchPartnerProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('partner_applications')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setPartnerProfileId(data.id);
    } catch (error: any) {
      console.error('Error fetching partner profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load partner profile',
        variant: 'destructive'
      });
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_partner_id', partnerProfileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      stock_quantity: product.stock_quantity,
      price_ngn: product.price_ngn,
      price_gbp: product.price_gbp,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;

    try {
      setProcessing(true);

      const { error } = await supabase
        .from('products')
        .update({
          stock_quantity: formData.stock_quantity,
          price_ngn: formData.price_ngn,
          price_gbp: formData.price_gbp,
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      toast({
        title: 'Product Updated',
        description: 'Product information has been updated successfully'
      });

      setEditDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (status === 'rejected') {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    if (status === 'pending') {
      return <Badge variant="secondary">Pending Approval</Badge>;
    }
    if (status === 'approved' && isActive) {
      return <Badge variant="default">Active</Badge>;
    }
    if (status === 'approved' && !isActive) {
      return <Badge variant="outline">Inactive</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Products
              </CardTitle>
              <CardDescription>
                Manage your product listings and inventory
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No products yet</p>
              <p className="text-sm">
                Products from your partner application will appear here once submitted
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (NGN)</TableHead>
                  <TableHead>Price (GBP)</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>₦{product.price_ngn.toLocaleString()}</TableCell>
                    <TableCell>£{product.price_gbp.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{product.stock_quantity}</span>
                        {product.stock_quantity < 10 && (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.approval_status, product.is_active)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.approval_status === 'approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {product.approval_status === 'rejected' && product.approval_notes && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              toast({
                                title: 'Rejection Reason',
                                description: product.approval_notes || 'No reason provided'
                              });
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
            <DialogDescription>
              Update stock quantity and pricing for your product
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <Label>Product</Label>
                <p className="text-sm font-medium">{selectedProduct.name}</p>
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price_ngn">Price (NGN)</Label>
                  <Input
                    id="price_ngn"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_ngn}
                    onChange={(e) =>
                      setFormData({ ...formData, price_ngn: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="price_gbp">Price (GBP)</Label>
                  <Input
                    id="price_gbp"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_gbp}
                    onChange={(e) =>
                      setFormData({ ...formData, price_gbp: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="bg-muted p-3 rounded text-sm">
                <p className="font-medium mb-1">Note:</p>
                <p className="text-muted-foreground">
                  You can only update stock quantity and pricing. To change other product details,
                  please contact support.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerProductManager;

