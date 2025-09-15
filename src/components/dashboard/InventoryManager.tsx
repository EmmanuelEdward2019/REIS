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
  Package,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Calendar,
  Wrench,
  DollarSign,
  Search,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface InventoryItem {
  id: string;
  controller_id: string;
  component_type: string;
  component_name: string;
  brand: string;
  model: string;
  serial_number: string;
  quantity: number;
  unit_cost: number;
  installation_date: string;
  warranty_start: string;
  warranty_end: string;
  maintenance_schedule: string;
  last_maintenance: string;
  next_maintenance: string;
  condition: string;
  notes: string;
}

interface Controller {
  id: string;
  device_name: string;
  controller_id: string;
}

const InventoryManager: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    controller_id: '',
    component_type: 'solar_panel',
    component_name: '',
    brand: '',
    model: '',
    serial_number: '',
    quantity: 1,
    unit_cost: 0,
    installation_date: '',
    warranty_start: '',
    warranty_end: '',
    maintenance_schedule: 'annually',
    condition: 'good',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch controllers
      const { data: controllersData, error: controllersError } = await supabase
        .from('controllers')
        .select('id, device_name, controller_id')
        .eq('is_active', true);

      if (controllersError) throw controllersError;
      setControllers(controllersData || []);

      // Fetch inventory
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select(`
          *,
          controllers (
            device_name,
            controller_id
          )
        `)
        .order('created_at', { ascending: false });

      if (inventoryError) throw inventoryError;
      setInventory(inventoryData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const itemData = {
        ...formData,
        next_maintenance: calculateNextMaintenance(formData.maintenance_schedule)
      };

      if (editingItem) {
        const { error } = await supabase
          .from('inventory')
          .update(itemData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('inventory')
          .insert([itemData]);
        
        if (error) throw error;
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const calculateNextMaintenance = (schedule: string) => {
    const today = new Date();
    switch (schedule) {
      case 'monthly':
        return new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
      case 'quarterly':
        return new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];
      case 'biannually':
        return new Date(today.setMonth(today.getMonth() + 6)).toISOString().split('T')[0];
      case 'annually':
        return new Date(today.setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0];
      default:
        return new Date(today.setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0];
    }
  };

  const resetForm = () => {
    setFormData({
      controller_id: '',
      component_type: 'solar_panel',
      component_name: '',
      brand: '',
      model: '',
      serial_number: '',
      quantity: 1,
      unit_cost: 0,
      installation_date: '',
      warranty_start: '',
      warranty_end: '',
      maintenance_schedule: 'annually',
      condition: 'good',
      notes: ''
    });
    setShowAddDialog(false);
    setEditingItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      controller_id: item.controller_id,
      component_type: item.component_type,
      component_name: item.component_name,
      brand: item.brand || '',
      model: item.model || '',
      serial_number: item.serial_number || '',
      quantity: item.quantity,
      unit_cost: item.unit_cost || 0,
      installation_date: item.installation_date || '',
      warranty_start: item.warranty_start || '',
      warranty_end: item.warranty_end || '',
      maintenance_schedule: item.maintenance_schedule || 'annually',
      condition: item.condition,
      notes: item.notes || ''
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;
    
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'fair': return 'text-accent';
      case 'poor': return 'text-muted-foreground';
      case 'faulty': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'default';
      case 'good': return 'default';
      case 'fair': return 'secondary';
      case 'poor': return 'outline';
      case 'faulty': return 'destructive';
      default: return 'secondary';
    }
  };

  const isMaintenanceDue = (nextMaintenance: string) => {
    if (!nextMaintenance) return false;
    const dueDate = new Date(nextMaintenance);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7;
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.component_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCondition = filterCondition === 'all' || item.condition === filterCondition;
    
    return matchesSearch && matchesCondition;
  });

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
          <h2 className="text-2xl font-bold text-foreground">Inventory Management</h2>
          <p className="text-muted-foreground">Track and manage system components and maintenance</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Component' : 'Add New Component'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="controller_id">Controller</Label>
                  <Select 
                    value={formData.controller_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, controller_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select controller" />
                    </SelectTrigger>
                    <SelectContent>
                      {controllers.map((controller) => (
                        <SelectItem key={controller.id} value={controller.id}>
                          {controller.device_name} ({controller.controller_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="component_type">Component Type</Label>
                  <Select 
                    value={formData.component_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, component_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solar_panel">Solar Panel</SelectItem>
                      <SelectItem value="battery">Battery</SelectItem>
                      <SelectItem value="inverter">Inverter</SelectItem>
                      <SelectItem value="charge_controller">Charge Controller</SelectItem>
                      <SelectItem value="cable">Cable</SelectItem>
                      <SelectItem value="mounting">Mounting Hardware</SelectItem>
                      <SelectItem value="fuse">Fuse/Breaker</SelectItem>
                      <SelectItem value="meter">Meter</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="component_name">Component Name</Label>
                <Input
                  id="component_name"
                  value={formData.component_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, component_name: e.target.value }))}
                  placeholder="e.g., Main Solar Panel Array"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="e.g., SunPower"
                  />
                </div>
                
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g., SPR-X22-360"
                  />
                </div>
                
                <div>
                  <Label htmlFor="serial_number">Serial Number</Label>
                  <Input
                    id="serial_number"
                    value={formData.serial_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, serial_number: e.target.value }))}
                    placeholder="e.g., SN123456789"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="unit_cost">Unit Cost (₦)</Label>
                  <Input
                    id="unit_cost"
                    type="number"
                    step="0.01"
                    value={formData.unit_cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit_cost: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="installation_date">Installation Date</Label>
                  <Input
                    id="installation_date"
                    type="date"
                    value={formData.installation_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, installation_date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="warranty_start">Warranty Start</Label>
                  <Input
                    id="warranty_start"
                    type="date"
                    value={formData.warranty_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, warranty_start: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="warranty_end">Warranty End</Label>
                  <Input
                    id="warranty_end"
                    type="date"
                    value={formData.warranty_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, warranty_end: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maintenance_schedule">Maintenance Schedule</Label>
                  <Select 
                    value={formData.maintenance_schedule} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, maintenance_schedule: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="biannually">Bi-annually</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="faulty">Faulty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this component..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingItem ? 'Update' : 'Add'} Component
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCondition} onValueChange={setFilterCondition}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
            <SelectItem value="faulty">Faulty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Items ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Controller</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Maintenance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.component_name}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {item.component_type.replace('_', ' ')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {(item as any).controllers?.device_name || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {item.brand && <div>{item.brand}</div>}
                        {item.model && <div className="text-muted-foreground">{item.model}</div>}
                        {item.serial_number && (
                          <div className="font-mono text-xs">{item.serial_number}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{item.quantity}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.unit_cost > 0 && (
                        <div className="text-sm">
                          <div>₦{item.unit_cost.toLocaleString()}</div>
                          <div className="text-muted-foreground">
                            Total: ₦{(item.unit_cost * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getConditionBadge(item.condition)}>
                        {item.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {item.next_maintenance && (
                          <div className={`flex items-center gap-1 ${
                            isMaintenanceDue(item.next_maintenance) ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            {isMaintenanceDue(item.next_maintenance) && (
                              <AlertTriangle className="h-4 w-4" />
                            )}
                            <span>
                              Due: {new Date(item.next_maintenance).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="text-muted-foreground capitalize">
                          {item.maintenance_schedule}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Inventory Items</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterCondition !== 'all' 
                  ? 'No items match your search criteria.' 
                  : 'Start by adding components to track your system inventory.'}
              </p>
              {!searchTerm && filterCondition === 'all' && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Component
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;