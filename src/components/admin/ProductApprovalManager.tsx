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
import { Package, CheckCircle, XCircle, Eye, Loader2, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PendingProduct {
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
  supplier_partner_id: string;
  approval_status: string;
  approval_notes: string | null;
  created_at: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  partner_name: string;
}

const ProductApprovalManager = () => {
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    fetchPendingProducts();
  }, [filterStatus]);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('pending_partner_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('approval_status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product: PendingProduct) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  const handleApprovalClick = (product: PendingProduct, action: 'approve' | 'reject') => {
    setSelectedProduct(product);
    setApprovalAction(action);
    setApprovalNotes('');
    setApprovalDialogOpen(true);
  };

  const handleApproval = async () => {
    if (!selectedProduct) return;

    try {
      setProcessing(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates: any = {
        approval_status: approvalAction === 'approve' ? 'approved' : 'rejected',
        approval_notes: approvalNotes || null,
        approved_by: user.id,
        approved_at: new Date().toISOString()
      };

      // If approving, also set is_active to true
      if (approvalAction === 'approve') {
        updates.is_active = true;
      }

      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', selectedProduct.id);

      if (error) throw error;

      toast({
        title: approvalAction === 'approve' ? 'Product Approved' : 'Product Rejected',
        description: `${selectedProduct.name} has been ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully`
      });

      setApprovalDialogOpen(false);
      setSelectedProduct(null);
      setApprovalNotes('');
      fetchPendingProducts();
    } catch (error: any) {
      console.error('Error processing approval:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process approval',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Partner Product Approvals
              </CardTitle>
              <CardDescription>
                Review and approve products submitted by partners
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No products found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (NGN)</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.company_name}</p>
                        <p className="text-sm text-muted-foreground">{product.partner_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>₦{product.price_ngn.toLocaleString()}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>{getStatusBadge(product.approval_status)}</TableCell>
                    <TableCell>
                      {new Date(product.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewProduct(product)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {product.approval_status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApprovalClick(product, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleApprovalClick(product, 'reject')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
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

      {/* View Product Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Review complete product information
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product Name</Label>
                  <p className="text-sm font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label>Brand</Label>
                  <p className="text-sm font-medium">{selectedProduct.brand}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <p className="text-sm font-medium">{selectedProduct.category}</p>
                </div>
                <div>
                  <Label>SKU</Label>
                  <p className="text-sm font-medium">{selectedProduct.sku}</p>
                </div>
                <div>
                  <Label>Price (NGN)</Label>
                  <p className="text-sm font-medium">₦{selectedProduct.price_ngn.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Price (GBP)</Label>
                  <p className="text-sm font-medium">£{selectedProduct.price_gbp.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Stock Quantity</Label>
                  <p className="text-sm font-medium">{selectedProduct.stock_quantity}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  {getStatusBadge(selectedProduct.approval_status)}
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <p className="text-sm mt-1">{selectedProduct.description}</p>
              </div>

              {selectedProduct.specifications && (
                <div>
                  <Label>Specifications</Label>
                  <pre className="text-sm mt-1 bg-muted p-3 rounded">
                    {JSON.stringify(selectedProduct.specifications, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <Label>Partner Information</Label>
                <div className="text-sm mt-1 space-y-1">
                  <p><strong>Company:</strong> {selectedProduct.company_name}</p>
                  <p><strong>Contact:</strong> {selectedProduct.partner_name}</p>
                  <p><strong>Email:</strong> {selectedProduct.email}</p>
                  <p><strong>Phone:</strong> {selectedProduct.phone_number}</p>
                </div>
              </div>

              {selectedProduct.approval_notes && (
                <div>
                  <Label>Approval Notes</Label>
                  <p className="text-sm mt-1">{selectedProduct.approval_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve Product' : 'Reject Product'}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve'
                ? 'This product will be published to the shop and visible to customers.'
                : 'This product will be rejected and the partner will be notified.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Product</Label>
              <p className="text-sm font-medium">{selectedProduct?.name}</p>
            </div>
            <div>
              <Label htmlFor="notes">Notes {approvalAction === 'reject' && '(Required)'}</Label>
              <Textarea
                id="notes"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder={
                  approvalAction === 'approve'
                    ? 'Optional notes about the approval...'
                    : 'Please provide a reason for rejection...'
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialogOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproval}
              disabled={processing || (approvalAction === 'reject' && !approvalNotes)}
              variant={approvalAction === 'approve' ? 'default' : 'destructive'}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : approvalAction === 'approve' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductApprovalManager;

