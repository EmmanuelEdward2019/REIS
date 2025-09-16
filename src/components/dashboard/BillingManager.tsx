import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  CreditCard,
  Plus,
  Download,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BillingRecord {
  id: string;
  invoice_number: string;
  service_type: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string;
  paid_date: string;
  payment_method: string;
  created_at: string;
}

interface BillingManagerProps {
  userRole?: 'client' | 'partner' | 'admin';
}

const BillingManager: React.FC<BillingManagerProps> = ({ userRole = 'admin' }) => {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    service_type: 'installation',
    description: '',
    amount: 0,
    due_date: ''
  });

  useEffect(() => {
    fetchBillingRecords();
  }, []);

  const fetchBillingRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('billing')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBillingRecords(data || []);
    } catch (error) {
      console.error('Error fetching billing records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const invoiceNumber = `INV-${Date.now()}`;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const billingData = {
        invoice_number: invoiceNumber,
        ...formData,
        currency: 'NGN',
        status: 'pending',
        user_id: user.id
      };

      const { error } = await supabase
        .from('billing')
        .insert([billingData]);
      
      if (error) throw error;

      // Reset form
      setFormData({
        service_type: 'installation',
        description: '',
        amount: 0,
        due_date: ''
      });
      
      setShowAddDialog(false);
      fetchBillingRecords();
    } catch (error) {
      console.error('Error creating billing record:', error);
    }
  };

  const updatePaymentStatus = async (id: string, status: string, paymentMethod: string = '') => {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'paid') {
        updateData.paid_date = new Date().toISOString().split('T')[0];
        updateData.payment_method = paymentMethod || 'bank_transfer';
      }

      const { error } = await supabase
        .from('billing')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      fetchBillingRecords();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-accent" />;
      case 'overdue': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTotalAmount = (status?: string) => {
    const filtered = status && status !== 'all' 
      ? billingRecords.filter(record => record.status === status)
      : billingRecords;
    
    return filtered.reduce((sum, record) => sum + record.amount, 0);
  };

  const getStatusCounts = () => {
    return {
      total: billingRecords.length,
      pending: billingRecords.filter(r => r.status === 'pending').length,
      paid: billingRecords.filter(r => r.status === 'paid').length,
      overdue: billingRecords.filter(r => r.status === 'overdue').length
    };
  };

  const handlePayNow = (record: BillingRecord) => {
    // In a real application, this would integrate with a payment gateway
    const confirmed = confirm(`Process payment of ₦${record.amount.toLocaleString()} for ${record.description}?`);
    if (confirmed) {
      updatePaymentStatus(record.id, 'paid', 'online_payment');
    }
  };

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = 
      record.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.service_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {userRole === 'client' ? 'My Billing & Payments' : 'Billing Management'}
          </h2>
          <p className="text-muted-foreground">
            {userRole === 'client' 
              ? 'View and pay your invoices' 
              : 'Manage invoices and track payments'
            }
          </p>
        </div>
        {userRole !== 'client' && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="service_type">Service Type</Label>
                <Select 
                  value={formData.service_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="product">Product Purchase</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the service or product..."
                  required
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Create Invoice
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <div className="text-xs text-muted-foreground">
              ₦{getTotalAmount().toLocaleString()} total value
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{statusCounts.pending}</div>
            <div className="text-xs text-muted-foreground">
              ₦{getTotalAmount('pending').toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{statusCounts.paid}</div>
            <div className="text-xs text-muted-foreground">
              ₦{getTotalAmount('paid').toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{statusCounts.overdue}</div>
            <div className="text-xs text-muted-foreground">
              ₦{getTotalAmount('overdue').toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Billing Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Invoices ({filteredRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <div className="font-mono text-sm">{record.invoice_number}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium capitalize">
                          {record.service_type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {record.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono">
                        ₦{record.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(record.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(record.status)}
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.due_date ? (
                        <div className={`text-sm ${
                          new Date(record.due_date) < new Date() && record.status === 'pending'
                            ? 'text-destructive font-medium'
                            : 'text-muted-foreground'
                        }`}>
                          {new Date(record.due_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.paid_date ? (
                        <div className="text-sm">
                          <div>{new Date(record.paid_date).toLocaleDateString()}</div>
                          {record.payment_method && (
                            <div className="text-xs text-muted-foreground capitalize">
                              {record.payment_method.replace('_', ' ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {record.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayNow(record)}
                            className="text-xs"
                          >
                            Pay Now
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // In a real app, this would generate and download a PDF
                            alert('Invoice download feature would be implemented here');
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {record.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePaymentStatus(record.id, 'paid')}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Invoices Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No invoices match your search criteria.' 
                  : 'Create your first invoice to start tracking payments.'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Invoice
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingManager;