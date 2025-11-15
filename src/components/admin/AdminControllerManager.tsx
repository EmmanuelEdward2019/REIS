import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Plus, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Activity,
  Battery,
  Zap,
  Thermometer,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  MapPin,
  Calendar,
  Wrench,
  Loader2,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Controller {
  id: string;
  controller_id: string;
  device_name: string;
  device_type: string;
  ip_address: string | null;
  is_online: boolean;
  is_active: boolean;
  last_heartbeat: string | null;
  installation_date: string | null;
  warranty_expiry: string | null;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  } | null;
  firmware_version: string | null;
  user_id: string;
  profiles?: {
    full_name?: string;
    service_class?: string;
  } | null;
}

const AdminControllerManager = () => {
  const { user } = useAuth();
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedController, setSelectedController] = useState<Controller | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [formData, setFormData] = useState({
    controller_id: '',
    device_name: '',
    device_type: 'solar_inverter',
    ip_address: '',
    location_address: '',
    firmware_version: '',
    user_id: '',
    installation_date: '',
    warranty_expiry: ''
  });

  useEffect(() => {
    fetchControllers();
    // Set up real-time subscription
    const channel = supabase
      .channel('admin-controllers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'controllers'
        },
        () => {
          fetchControllers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchControllers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('controllers')
        .select(`
          *,
          profiles (
            full_name,
            service_class
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setControllers((data || []).map(controller => ({
        ...controller,
        ip_address: controller.ip_address as string || null,
        location: controller.location as { address: string; lat?: number; lng?: number } || null,
        firmware_version: controller.firmware_version || null,
        last_heartbeat: controller.last_heartbeat || null,
        installation_date: controller.installation_date || null,
        warranty_expiry: controller.warranty_expiry || null
      })));
    } catch (error: any) {
      console.error('Error fetching controllers:', error);
      toast.error('Failed to load controllers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const controllerData = {
        controller_id: formData.controller_id,
        device_name: formData.device_name,
        device_type: formData.device_type,
        ip_address: formData.ip_address || null,
        firmware_version: formData.firmware_version || null,
        location: formData.location_address ? {
          address: formData.location_address
        } : null,
        is_online: false,
        is_active: true,
        installation_date: formData.installation_date || new Date().toISOString().split('T')[0],
        warranty_expiry: formData.warranty_expiry || null,
        user_id: formData.user_id || user.id
      };

      const { error } = await supabase
        .from('controllers')
        .insert([controllerData]);

      if (error) throw error;

      toast.success('Controller created successfully');
      setShowAddDialog(false);
      resetForm();
      fetchControllers();
    } catch (error: any) {
      console.error('Error creating controller:', error);
      toast.error(error.message || 'Failed to create controller');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedController) return;

    try {
      const controllerData = {
        controller_id: formData.controller_id,
        device_name: formData.device_name,
        device_type: formData.device_type,
        ip_address: formData.ip_address || null,
        firmware_version: formData.firmware_version || null,
        location: formData.location_address ? {
          address: formData.location_address
        } : null,
        installation_date: formData.installation_date || null,
        warranty_expiry: formData.warranty_expiry || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('controllers')
        .update(controllerData)
        .eq('id', selectedController.id);

      if (error) throw error;

      toast.success('Controller updated successfully');
      setShowEditDialog(false);
      setSelectedController(null);
      resetForm();
      fetchControllers();
    } catch (error: any) {
      console.error('Error updating controller:', error);
      toast.error(error.message || 'Failed to update controller');
    }
  };

  const handleDelete = async (controllerId: string) => {
    if (!confirm('Are you sure you want to delete this controller? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('controllers')
        .delete()
        .eq('id', controllerId);

      if (error) throw error;

      toast.success('Controller deleted successfully');
      fetchControllers();
    } catch (error: any) {
      console.error('Error deleting controller:', error);
      toast.error(error.message || 'Failed to delete controller');
    }
  };

  const handleEdit = (controller: Controller) => {
    setSelectedController(controller);
    setFormData({
      controller_id: controller.controller_id,
      device_name: controller.device_name,
      device_type: controller.device_type,
      ip_address: controller.ip_address || '',
      location_address: controller.location?.address || '',
      firmware_version: controller.firmware_version || '',
      user_id: controller.user_id,
      installation_date: controller.installation_date || '',
      warranty_expiry: controller.warranty_expiry || ''
    });
    setShowEditDialog(true);
  };

  const handleView = (controller: Controller) => {
    setSelectedController(controller);
    setShowViewDialog(true);
  };

  const toggleActiveStatus = async (controller: Controller) => {
    try {
      const { error } = await supabase
        .from('controllers')
        .update({ is_active: !controller.is_active, updated_at: new Date().toISOString() })
        .eq('id', controller.id);

      if (error) throw error;

      toast.success(`Controller ${!controller.is_active ? 'activated' : 'deactivated'}`);
      fetchControllers();
    } catch (error: any) {
      console.error('Error updating controller status:', error);
      toast.error('Failed to update controller status');
    }
  };

  const resetForm = () => {
    setFormData({
      controller_id: '',
      device_name: '',
      device_type: 'solar_inverter',
      ip_address: '',
      location_address: '',
      firmware_version: '',
      user_id: '',
      installation_date: '',
      warranty_expiry: ''
    });
  };

  const formatLastSeen = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const filteredControllers = controllers.filter(controller => {
    const matchesSearch = 
      controller.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      controller.controller_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      controller.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      controller.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'online' && controller.is_online) ||
      (statusFilter === 'offline' && !controller.is_online) ||
      (statusFilter === 'active' && controller.is_active) ||
      (statusFilter === 'inactive' && !controller.is_active);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isOnline: boolean, isActive: boolean) => {
    if (!isOnline) {
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Offline</Badge>;
    }
    if (!isActive) {
      return <Badge className="bg-accent/10 text-accent border-accent/20">Inactive</Badge>;
    }
    return <Badge className="bg-success/10 text-success border-success/20">Operational</Badge>;
  };

  const getSegmentColor = (segment: string | undefined) => {
    switch (segment?.toLowerCase()) {
      case 'residential':
        return 'text-blue-600';
      case 'commercial':
        return 'text-green-600';
      case 'industrial':
        return 'text-purple-600';
      default:
        return 'text-muted-foreground';
    }
  };


  return (
    <div className="space-y-6">
      {/* Controller Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{controllers.length}</p>
                <p className="text-sm text-muted-foreground">Total Controllers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {controllers.filter(c => c.is_online).length}
                </p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Wrench className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {controllers.filter(c => !c.is_active).length}
                </p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {controllers.filter(c => !c.is_online && c.is_active).length}
                </p>
                <p className="text-sm text-muted-foreground">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controller Management Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Controller Inventory
              </CardTitle>
              <CardDescription>
                Manage all customer solar controllers and monitor their status
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Controller
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Controller</DialogTitle>
                  <DialogDescription>
                    Create a new IoT controller for monitoring renewable energy systems
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="controller_id">Controller ID *</Label>
                      <Input
                        id="controller_id"
                        value={formData.controller_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, controller_id: e.target.value }))}
                        placeholder="CTRL-001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="device_name">Device Name *</Label>
                      <Input
                        id="device_name"
                        value={formData.device_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, device_name: e.target.value }))}
                        placeholder="Main Solar Inverter"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="device_type">Device Type *</Label>
                      <Select 
                        value={formData.device_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, device_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solar_inverter">Solar Inverter</SelectItem>
                          <SelectItem value="battery_system">Battery System</SelectItem>
                          <SelectItem value="energy_meter">Energy Meter</SelectItem>
                          <SelectItem value="charge_controller">Charge Controller</SelectItem>
                          <SelectItem value="monitoring_device">Monitoring Device</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="user_id">User ID</Label>
                      <Input
                        id="user_id"
                        value={formData.user_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                        placeholder="Leave empty to use current user"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ip_address">IP Address</Label>
                      <Input
                        id="ip_address"
                        value={formData.ip_address}
                        onChange={(e) => setFormData(prev => ({ ...prev, ip_address: e.target.value }))}
                        placeholder="192.168.1.100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firmware_version">Firmware Version</Label>
                      <Input
                        id="firmware_version"
                        value={formData.firmware_version}
                        onChange={(e) => setFormData(prev => ({ ...prev, firmware_version: e.target.value }))}
                        placeholder="v2.1.4"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location_address">Installation Location</Label>
                    <Input
                      id="location_address"
                      value={formData.location_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
                      placeholder="Building A, Floor 3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="warranty_expiry">Warranty Expiry</Label>
                      <Input
                        id="warranty_expiry"
                        type="date"
                        value={formData.warranty_expiry}
                        onChange={(e) => setFormData(prev => ({ ...prev, warranty_expiry: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Controller
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search controllers, customers, or locations..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Controllers Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredControllers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No controllers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device & Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredControllers.map((controller) => (
                    <TableRow key={controller.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{controller.device_name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {controller.controller_id} • {controller.device_type.replace('_', ' ')}
                          </div>
                          {controller.profiles?.full_name && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className={getSegmentColor(controller.profiles.service_class)}>
                                {controller.profiles.full_name}
                              </span>
                              {controller.profiles.service_class && (
                                <>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-muted-foreground">
                                    {controller.profiles.service_class}
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {getStatusBadge(controller.is_online, controller.is_active)}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Activity className="h-3 w-3" />
                            {controller.is_online ? 'Online' : 'Offline'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {controller.location?.address ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {controller.location.address}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {formatLastSeen(controller.last_heartbeat)}
                          </div>
                          {controller.firmware_version && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {controller.firmware_version}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleView(controller)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(controller)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => toggleActiveStatus(controller)}
                            title={controller.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {controller.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(controller.id)}
                          >
                            <Trash2 className="h-3 w-3" />
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

      {/* Edit Controller Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Controller</DialogTitle>
            <DialogDescription>
              Update controller information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_controller_id">Controller ID *</Label>
                <Input
                  id="edit_controller_id"
                  value={formData.controller_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, controller_id: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_device_name">Device Name *</Label>
                <Input
                  id="edit_device_name"
                  value={formData.device_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, device_name: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_device_type">Device Type *</Label>
                <Select 
                  value={formData.device_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, device_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar_inverter">Solar Inverter</SelectItem>
                    <SelectItem value="battery_system">Battery System</SelectItem>
                    <SelectItem value="energy_meter">Energy Meter</SelectItem>
                    <SelectItem value="charge_controller">Charge Controller</SelectItem>
                    <SelectItem value="monitoring_device">Monitoring Device</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_user_id">User ID</Label>
                <Input
                  id="edit_user_id"
                  value={formData.user_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_ip_address">IP Address</Label>
                <Input
                  id="edit_ip_address"
                  value={formData.ip_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, ip_address: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit_firmware_version">Firmware Version</Label>
                <Input
                  id="edit_firmware_version"
                  value={formData.firmware_version}
                  onChange={(e) => setFormData(prev => ({ ...prev, firmware_version: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit_location_address">Installation Location</Label>
              <Input
                id="edit_location_address"
                value={formData.location_address}
                onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_installation_date">Installation Date</Label>
                <Input
                  id="edit_installation_date"
                  type="date"
                  value={formData.installation_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, installation_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit_warranty_expiry">Warranty Expiry</Label>
                <Input
                  id="edit_warranty_expiry"
                  type="date"
                  value={formData.warranty_expiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, warranty_expiry: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setShowEditDialog(false);
                setSelectedController(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="submit">
                Update Controller
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Controller Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Controller Details</DialogTitle>
            <DialogDescription>
              View detailed information about this controller
            </DialogDescription>
          </DialogHeader>
          {selectedController && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Controller ID</Label>
                  <p className="font-medium">{selectedController.controller_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Device Name</Label>
                  <p className="font-medium">{selectedController.device_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Device Type</Label>
                  <p className="font-medium">{selectedController.device_type.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedController.is_online, selectedController.is_active)}
                  </div>
                </div>
                {selectedController.ip_address && (
                  <div>
                    <Label className="text-muted-foreground">IP Address</Label>
                    <p className="font-medium font-mono">{selectedController.ip_address}</p>
                  </div>
                )}
                {selectedController.firmware_version && (
                  <div>
                    <Label className="text-muted-foreground">Firmware Version</Label>
                    <p className="font-medium">{selectedController.firmware_version}</p>
                  </div>
                )}
                {selectedController.location?.address && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="font-medium">{selectedController.location.address}</p>
                  </div>
                )}
                {selectedController.installation_date && (
                  <div>
                    <Label className="text-muted-foreground">Installation Date</Label>
                    <p className="font-medium">{new Date(selectedController.installation_date).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedController.warranty_expiry && (
                  <div>
                    <Label className="text-muted-foreground">Warranty Expiry</Label>
                    <p className="font-medium">{new Date(selectedController.warranty_expiry).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Last Heartbeat</Label>
                  <p className="font-medium">{formatLastSeen(selectedController.last_heartbeat)}</p>
                </div>
                {selectedController.profiles?.full_name && (
                  <div>
                    <Label className="text-muted-foreground">Customer</Label>
                    <p className="font-medium">{selectedController.profiles.full_name}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowViewDialog(false);
              setSelectedController(null);
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminControllerManager;