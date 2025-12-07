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
    Cpu,
    Wifi,
    WifiOff,
    Activity,
    AlertCircle,
    CheckCircle,
    Loader2,
    Zap,
    Battery,
    MapPin,
    User
} from 'lucide-react';

interface Controller {
    id: string;
    controller_id: string;
    user_id: string | null;
    device_type: string;
    model: string | null;
    firmware_version: string | null;
    location: string | null;
    installation_date: string | null;
    last_seen: string | null;
    status: string;
    is_active: boolean;
    configuration: any;
    created_at: string;
    updated_at: string;
    user_profile?: {
        full_name: string;
        phone: string | null;
    } | null;
}

interface ControllerFormData {
    controller_id: string;
    user_id: string;
    device_type: string;
    model: string;
    firmware_version: string;
    location: string;
    installation_date: string;
    status: 'online' | 'offline' | 'maintenance' | 'error';
    is_active: boolean;
}

const IoTControllersManager = () => {
    const { user } = useAuth();
    const [controllers, setControllers] = useState<Controller[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingController, setEditingController] = useState<Controller | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState<ControllerFormData>({
        controller_id: '',
        user_id: '',
        device_type: 'solar_inverter',
        model: '',
        firmware_version: '',
        location: '',
        installation_date: '',
        status: 'offline',
        is_active: true,
    });

    useEffect(() => {
        fetchControllers();
        fetchUsers();
    }, []);

    const fetchControllers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('controllers')
                .select(`
          *,
          user_profile:profiles!controllers_user_id_fkey(full_name, phone)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setControllers(data || []);
        } catch (error) {
            console.error('Error fetching controllers:', error);
            toast.error('Failed to load controllers');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, user_id, full_name, phone')
                .eq('user_role', 'client');

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleCreateController = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.controller_id || !formData.device_type) {
                toast.error('Please fill in controller ID and device type');
                return;
            }

            const { error } = await supabase
                .from('controllers')
                .insert([{
                    controller_id: formData.controller_id,
                    user_id: formData.user_id || null,
                    device_type: formData.device_type,
                    model: formData.model || null,
                    firmware_version: formData.firmware_version || null,
                    location: formData.location || null,
                    installation_date: formData.installation_date || null,
                    status: formData.status,
                    is_active: formData.is_active,
                }]);

            if (error) throw error;

            toast.success('Controller registered successfully');
            setShowAddDialog(false);
            resetForm();
            fetchControllers();
        } catch (error: any) {
            console.error('Error creating controller:', error);
            toast.error(error.message || 'Failed to register controller');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateController = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingController) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('controllers')
                .update({
                    controller_id: formData.controller_id,
                    user_id: formData.user_id || null,
                    device_type: formData.device_type,
                    model: formData.model || null,
                    firmware_version: formData.firmware_version || null,
                    location: formData.location || null,
                    installation_date: formData.installation_date || null,
                    status: formData.status,
                    is_active: formData.is_active,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingController.id);

            if (error) throw error;

            toast.success('Controller updated successfully');
            setShowEditDialog(false);
            setEditingController(null);
            resetForm();
            fetchControllers();
        } catch (error: any) {
            console.error('Error updating controller:', error);
            toast.error(error.message || 'Failed to update controller');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteController = async (controller: Controller) => {
        if (!confirm(`Are you sure you want to delete controller "${controller.controller_id}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('controllers')
                .delete()
                .eq('id', controller.id);

            if (error) throw error;

            toast.success('Controller deleted successfully');
            fetchControllers();
        } catch (error: any) {
            console.error('Error deleting controller:', error);
            toast.error(error.message || 'Failed to delete controller');
        }
    };

    const toggleControllerStatus = async (controller: Controller) => {
        try {
            const { error } = await supabase
                .from('controllers')
                .update({ is_active: !controller.is_active })
                .eq('id', controller.id);

            if (error) throw error;

            toast.success(`Controller ${!controller.is_active ? 'activated' : 'deactivated'}`);
            fetchControllers();
        } catch (error: any) {
            console.error('Error toggling controller status:', error);
            toast.error('Failed to update controller status');
        }
    };

    const openEditDialog = (controller: Controller) => {
        setEditingController(controller);
        setFormData({
            controller_id: controller.controller_id,
            user_id: controller.user_id || '',
            device_type: controller.device_type,
            model: controller.model || '',
            firmware_version: controller.firmware_version || '',
            location: controller.location || '',
            installation_date: controller.installation_date || '',
            status: controller.status as any,
            is_active: controller.is_active,
        });
        setShowEditDialog(true);
    };

    const resetForm = () => {
        setFormData({
            controller_id: '',
            user_id: '',
            device_type: 'solar_inverter',
            model: '',
            firmware_version: '',
            location: '',
            installation_date: '',
            status: 'offline',
            is_active: true,
        });
    };

    const filteredControllers = controllers.filter(ctrl => {
        const matchesSearch =
            ctrl.controller_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ctrl.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ctrl.user_profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || ctrl.status === statusFilter;
        const matchesType = typeFilter === 'all' || ctrl.device_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            online: { className: 'bg-success/10 text-success border-success/20', icon: Wifi },
            offline: { className: 'bg-muted/10 text-muted-foreground border-muted/20', icon: WifiOff },
            maintenance: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: AlertCircle },
            error: { className: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {status}
            </Badge>
        );
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'solar_inverter':
                return <Zap className="h-4 w-4" />;
            case 'battery_monitor':
                return <Battery className="h-4 w-4" />;
            case 'charge_controller':
                return <Activity className="h-4 w-4" />;
            default:
                return <Cpu className="h-4 w-4" />;
        }
    };

    // Statistics
    const totalControllers = controllers.length;
    const onlineControllers = controllers.filter(c => c.status === 'online').length;
    const offlineControllers = controllers.filter(c => c.status === 'offline').length;
    const errorControllers = controllers.filter(c => c.status === 'error').length;
    const activeControllers = controllers.filter(c => c.is_active).length;

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Cpu className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalControllers}</p>
                                <p className="text-sm text-muted-foreground">Total Devices</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <Wifi className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{onlineControllers}</p>
                                <p className="text-sm text-muted-foreground">Online</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted/10">
                                <WifiOff className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{offlineControllers}</p>
                                <p className="text-sm text-muted-foreground">Offline</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-destructive/10">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{errorControllers}</p>
                                <p className="text-sm text-muted-foreground">Errors</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{activeControllers}</p>
                                <p className="text-sm text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Controllers Management Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Cpu className="h-5 w-5" />
                                IoT Controllers
                            </CardTitle>
                            <CardDescription>
                                Manage solar inverters, battery monitors, and charge controllers
                            </CardDescription>
                        </div>
                        <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Register Device
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search controllers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="offline">Offline</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Device Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="solar_inverter">Solar Inverter</SelectItem>
                                <SelectItem value="battery_monitor">Battery Monitor</SelectItem>
                                <SelectItem value="charge_controller">Charge Controller</SelectItem>
                                <SelectItem value="energy_meter">Energy Meter</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Controllers Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Controller ID</TableHead>
                                        <TableHead>Device Type</TableHead>
                                        <TableHead>Model</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Last Seen</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Active</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredControllers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                                No controllers found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredControllers.map((ctrl) => (
                                            <TableRow key={ctrl.id}>
                                                <TableCell>
                                                    <code className="text-sm font-mono">{ctrl.controller_id}</code>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getDeviceIcon(ctrl.device_type)}
                                                        <span className="text-sm">{ctrl.device_type.replace('_', ' ')}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {ctrl.model || <span className="text-muted-foreground text-sm">N/A</span>}
                                                </TableCell>
                                                <TableCell>
                                                    {ctrl.user_profile ? (
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{ctrl.user_profile.full_name}</div>
                                                            {ctrl.user_profile.phone && (
                                                                <div className="text-sm text-muted-foreground">{ctrl.user_profile.phone}</div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">Unassigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {ctrl.location ? (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <MapPin className="h-3 w-3" />
                                                            {ctrl.location}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {ctrl.last_seen ? (
                                                        <span className="text-sm">
                                                            {new Date(ctrl.last_seen).toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">Never</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(ctrl.status)}</TableCell>
                                                <TableCell>
                                                    {ctrl.is_active ? (
                                                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => toggleControllerStatus(ctrl)}
                                                        >
                                                            {ctrl.is_active ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEditDialog(ctrl)}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteController(ctrl)}
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

            {/* Add Controller Dialog */}
            <FormDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                title="Register New Controller"
                description="Add a new IoT device to the system"
                onSubmit={handleCreateController}
                submitLabel="Register Device"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="controller_id">Controller ID *</Label>
                            <Input
                                id="controller_id"
                                value={formData.controller_id}
                                onChange={(e) => setFormData({ ...formData, controller_id: e.target.value })}
                                placeholder="CTRL-2024-001"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="device_type">Device Type *</Label>
                            <Select
                                value={formData.device_type}
                                onValueChange={(value) => setFormData({ ...formData, device_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solar_inverter">Solar Inverter</SelectItem>
                                    <SelectItem value="battery_monitor">Battery Monitor</SelectItem>
                                    <SelectItem value="charge_controller">Charge Controller</SelectItem>
                                    <SelectItem value="energy_meter">Energy Meter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                placeholder="SolarEdge SE5000H"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="firmware_version">Firmware Version</Label>
                            <Input
                                id="firmware_version"
                                value={formData.firmware_version}
                                onChange={(e) => setFormData({ ...formData, firmware_version: e.target.value })}
                                placeholder="v2.1.5"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="user_id">Assign to Client</Label>
                        <Select
                            value={formData.user_id}
                            onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select client (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Unassigned</SelectItem>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Lagos, Nigeria"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="installation_date">Installation Date</Label>
                            <Input
                                id="installation_date"
                                type="date"
                                value={formData.installation_date}
                                onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 pt-8">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Active device
                            </Label>
                        </div>
                    </div>
                </div>
            </FormDialog>

            {/* Edit Controller Dialog - Similar structure */}
            <FormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                title="Edit Controller"
                description="Update controller information"
                onSubmit={handleUpdateController}
                submitLabel="Save Changes"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_controller_id">Controller ID *</Label>
                            <Input
                                id="edit_controller_id"
                                value={formData.controller_id}
                                onChange={(e) => setFormData({ ...formData, controller_id: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_device_type">Device Type *</Label>
                            <Select
                                value={formData.device_type}
                                onValueChange={(value) => setFormData({ ...formData, device_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solar_inverter">Solar Inverter</SelectItem>
                                    <SelectItem value="battery_monitor">Battery Monitor</SelectItem>
                                    <SelectItem value="charge_controller">Charge Controller</SelectItem>
                                    <SelectItem value="energy_meter">Energy Meter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_model">Model</Label>
                            <Input
                                id="edit_model"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_firmware_version">Firmware Version</Label>
                            <Input
                                id="edit_firmware_version"
                                value={formData.firmware_version}
                                onChange={(e) => setFormData({ ...formData, firmware_version: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_user_id">Assign to Client</Label>
                        <Select
                            value={formData.user_id || ''}
                            onValueChange={(value) => setFormData({ ...formData, user_id: value === 'unassigned' ? '' : value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {(users || []).map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_location">Location</Label>
                            <Input
                                id="edit_location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_installation_date">Installation Date</Label>
                            <Input
                                id="edit_installation_date"
                                type="date"
                                value={formData.installation_date}
                                onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 pt-8">
                            <input
                                type="checkbox"
                                id="edit_is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="edit_is_active" className="cursor-pointer">
                                Active device
                            </Label>
                        </div>
                    </div>
                </div>
            </FormDialog>
        </div>
    );
};

export default IoTControllersManager;
