import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Wifi,
  WifiOff,
  Settings,
  Plus,
  Edit,
  Trash2,
  Activity,
  MapPin,
  Calendar,
  Zap,
  Battery,
  Sun,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
}

const IoTControllerManager: React.FC = () => {
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingController, setEditingController] = useState<Controller | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    controller_id: '',
    device_name: '',
    device_type: 'solar_inverter',
    ip_address: '',
    location_address: '',
    firmware_version: ''
  });

  useEffect(() => {
    fetchControllers();
    // Set up real-time subscription
    const channel = supabase
      .channel('controllers-changes')
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
      const { data, error } = await supabase
        .from('controllers')
        .select('*')
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
    } catch (error) {
      console.error('Error fetching controllers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const controllerData = {
        controller_id: formData.controller_id,
        device_name: formData.device_name,
        device_type: formData.device_type,
        ip_address: formData.ip_address,
        firmware_version: formData.firmware_version,
        location: {
          address: formData.location_address
        },
        is_online: false,
        is_active: true,
        installation_date: new Date().toISOString().split('T')[0],
        warranty_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 5).toISOString().split('T')[0], // 5 years
        user_id: user.id
      };

      if (editingController) {
        const { error } = await supabase
          .from('controllers')
          .update(controllerData)
          .eq('id', editingController.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('controllers')
          .insert([controllerData]);
        
        if (error) throw error;
      }

      // Reset form
      setFormData({
        controller_id: '',
        device_name: '',
        device_type: 'solar_inverter',
        ip_address: '',
        location_address: '',
        firmware_version: ''
      });
      
      setShowAddDialog(false);
      setEditingController(null);
      fetchControllers();
    } catch (error) {
      console.error('Error saving controller:', error);
    }
  };

  const handleEdit = (controller: Controller) => {
    setEditingController(controller);
    setFormData({
      controller_id: controller.controller_id,
      device_name: controller.device_name,
      device_type: controller.device_type,
      ip_address: controller.ip_address || '',
      location_address: controller.location?.address || '',
      firmware_version: controller.firmware_version || ''
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (controllerId: string) => {
    if (!confirm('Are you sure you want to delete this controller?')) return;
    
    try {
      const { error } = await supabase
        .from('controllers')
        .delete()
        .eq('id', controllerId);
      
      if (error) throw error;
      fetchControllers();
    } catch (error) {
      console.error('Error deleting controller:', error);
    }
  };

  const toggleActiveStatus = async (controller: Controller) => {
    try {
      const { error } = await supabase
        .from('controllers')
        .update({ is_active: !controller.is_active })
        .eq('id', controller.id);
      
      if (error) throw error;
      fetchControllers();
    } catch (error) {
      console.error('Error updating controller status:', error);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'solar_inverter':
        return <Sun className="h-4 w-4" />;
      case 'battery_system':
        return <Battery className="h-4 w-4" />;
      case 'energy_meter':
        return <Zap className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatLastSeen = (timestamp: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

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
          <h2 className="text-2xl font-bold text-foreground">IoT Controllers</h2>
          <p className="text-muted-foreground">Manage your energy monitoring devices</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingController(null);
              setFormData({
                controller_id: '',
                device_name: '',
                device_type: 'solar_inverter',
                ip_address: '',
                location_address: '',
                firmware_version: ''
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Controller
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingController ? 'Edit Controller' : 'Add New Controller'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="controller_id">Controller ID</Label>
                <Input
                  id="controller_id"
                  value={formData.controller_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, controller_id: e.target.value }))}
                  placeholder="CTRL-001"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="device_name">Device Name</Label>
                <Input
                  id="device_name"
                  value={formData.device_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, device_name: e.target.value }))}
                  placeholder="Main Solar Inverter"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="device_type">Device Type</Label>
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
                <Label htmlFor="ip_address">IP Address</Label>
                <Input
                  id="ip_address"
                  value={formData.ip_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, ip_address: e.target.value }))}
                  placeholder="192.168.1.100"
                />
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
              
              <div>
                <Label htmlFor="firmware_version">Firmware Version</Label>
                <Input
                  id="firmware_version"
                  value={formData.firmware_version}
                  onChange={(e) => setFormData(prev => ({ ...prev, firmware_version: e.target.value }))}
                  placeholder="v2.1.4"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingController ? 'Update' : 'Add'} Controller
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
      </div>

      {/* Controllers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {controllers.map((controller) => (
          <Card key={controller.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(controller.device_type)}
                  <CardTitle className="text-lg">{controller.device_name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  {controller.is_online ? (
                    <Wifi className="h-4 w-4 text-success" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  {controller.is_active ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-accent" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Controller ID</span>
                <span className="text-sm font-mono">{controller.controller_id}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex gap-2">
                  <Badge variant={controller.is_online ? "default" : "secondary"}>
                    {controller.is_online ? "Online" : "Offline"}
                  </Badge>
                  <Badge variant={controller.is_active ? "default" : "secondary"}>
                    {controller.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm capitalize">{controller.device_type.replace('_', ' ')}</span>
              </div>
              
              {controller.ip_address && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IP Address</span>
                  <span className="text-sm font-mono">{controller.ip_address}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Seen</span>
                <span className="text-sm">{formatLastSeen(controller.last_heartbeat)}</span>
              </div>
              
              {controller.location?.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{controller.location.address}</span>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(controller)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActiveStatus(controller)}
                >
                  {controller.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(controller.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {controllers.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Controllers Found</h3>
            <p className="text-muted-foreground mb-4">
              Add your first IoT controller to start monitoring your energy systems.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Controller
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IoTControllerManager;