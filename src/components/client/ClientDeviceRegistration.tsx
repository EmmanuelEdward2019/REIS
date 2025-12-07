import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import FormDialog from '@/components/common/FormDialog';
import {
    Cpu,
    Plus,
    Edit,
    Trash2,
    Wifi,
    WifiOff,
    Zap,
    Battery,
    Activity,
    MapPin,
    Calendar,
    CheckCircle,
    Loader2,
    AlertCircle
} from 'lucide-react';

interface Device {
    id: string;
    controller_id: string;
    device_type: string;
    model: string | null;
    firmware_version: string | null;
    location: string | null;
    installation_date: string | null;
    status: string;
    is_active: boolean;
    last_seen: string | null;
    created_at: string;
}

interface DeviceFormData {
    controller_id: string;
    device_type: string;
    model: string;
    firmware_version: string;
    location: string;
    installation_date: string;
}

const ClientDeviceRegistration = () => {
    const { user } = useAuth();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingDevice, setEditingDevice] = useState<Device | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<DeviceFormData>({
        controller_id: '',
        device_type: 'solar_inverter',
        model: '',
        firmware_version: '',
        location: '',
        installation_date: '',
    });

    useEffect(() => {
        if (user) {
            fetchDevices();
        }
    }, [user]);

    const fetchDevices = async () => {
        if (!user) return;

        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('controllers')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setDevices(data || []);
        } catch (error) {
            console.error('Error fetching devices:', error);
            toast.error('Failed to load devices');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterDevice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);

        try {
            if (!formData.controller_id || !formData.device_type) {
                toast.error('Please fill in device ID and type');
                return;
            }

            const { error } = await supabase
                .from('controllers')
                .insert([{
                    controller_id: formData.controller_id,
                    user_id: user.id,
                    device_type: formData.device_type,
                    model: formData.model || null,
                    firmware_version: formData.firmware_version || null,
                    location: formData.location || null,
                    installation_date: formData.installation_date || null,
                    status: 'offline',
                    is_active: true,
                }]);

            if (error) throw error;

            toast.success('Device registered successfully');
            setShowAddDialog(false);
            resetForm();
            fetchDevices();
        } catch (error: any) {
            console.error('Error registering device:', error);
            toast.error(error.message || 'Failed to register device');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateDevice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !editingDevice) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('controllers')
                .update({
                    controller_id: formData.controller_id,
                    device_type: formData.device_type,
                    model: formData.model || null,
                    firmware_version: formData.firmware_version || null,
                    location: formData.location || null,
                    installation_date: formData.installation_date || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingDevice.id)
                .eq('user_id', user.id);

            if (error) throw error;

            toast.success('Device updated successfully');
            setShowEditDialog(false);
            setEditingDevice(null);
            resetForm();
            fetchDevices();
        } catch (error: any) {
            console.error('Error updating device:', error);
            toast.error(error.message || 'Failed to update device');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDevice = async (device: Device) => {
        if (!user) return;

        if (!confirm(`Are you sure you want to remove device "${device.controller_id}"?`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('controllers')
                .delete()
                .eq('id', device.id)
                .eq('user_id', user.id);

            if (error) throw error;

            toast.success('Device removed successfully');
            fetchDevices();
        } catch (error: any) {
            console.error('Error deleting device:', error);
            toast.error(error.message || 'Failed to remove device');
        }
    };

    const toggleDeviceStatus = async (device: Device) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('controllers')
                .update({ is_active: !device.is_active })
                .eq('id', device.id)
                .eq('user_id', user.id);

            if (error) throw error;

            toast.success(`Device ${!device.is_active ? 'activated' : 'deactivated'}`);
            fetchDevices();
        } catch (error: any) {
            console.error('Error toggling device status:', error);
            toast.error('Failed to update device status');
        }
    };

    const openEditDialog = (device: Device) => {
        setEditingDevice(device);
        setFormData({
            controller_id: device.controller_id,
            device_type: device.device_type,
            model: device.model || '',
            firmware_version: device.firmware_version || '',
            location: device.location || '',
            installation_date: device.installation_date || '',
        });
        setShowEditDialog(true);
    };

    const resetForm = () => {
        setFormData({
            controller_id: '',
            device_type: 'solar_inverter',
            model: '',
            firmware_version: '',
            location: '',
            installation_date: '',
        });
    };

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
    const totalDevices = devices.length;
    const onlineDevices = devices.filter(d => d.status === 'online').length;
    const activeDevices = devices.filter(d => d.is_active).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Cpu className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalDevices}</p>
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
                                <p className="text-2xl font-bold">{onlineDevices}</p>
                                <p className="text-sm text-muted-foreground">Online</p>
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
                                <p className="text-2xl font-bold">{activeDevices}</p>
                                <p className="text-sm text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Devices Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Cpu className="h-5 w-5" />
                                My Devices
                            </CardTitle>
                            <CardDescription>
                                Register and manage your solar energy devices
                            </CardDescription>
                        </div>
                        <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Register Device
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {devices.length === 0 ? (
                        <div className="text-center py-12">
                            <Cpu className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Devices Registered</h3>
                            <p className="text-muted-foreground mb-4">
                                Register your first solar device to start monitoring
                            </p>
                            <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Register Device
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Device ID</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Model</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Installed</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Active</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {devices.map((device) => (
                                        <TableRow key={device.id}>
                                            <TableCell>
                                                <code className="text-sm font-mono">{device.controller_id}</code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getDeviceIcon(device.device_type)}
                                                    <span className="text-sm">{device.device_type.replace('_', ' ')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {device.model || <span className="text-muted-foreground text-sm">N/A</span>}
                                            </TableCell>
                                            <TableCell>
                                                {device.location ? (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <MapPin className="h-3 w-3" />
                                                        {device.location}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {device.installation_date ? (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(device.installation_date).toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(device.status)}</TableCell>
                                            <TableCell>
                                                {device.is_active ? (
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
                                                        onClick={() => toggleDeviceStatus(device)}
                                                    >
                                                        {device.is_active ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openEditDialog(device)}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteDevice(device)}
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

            {/* Register Device Dialog */}
            <FormDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                title="Register New Device"
                description="Add a new solar energy device to your account"
                onSubmit={handleRegisterDevice}
                submitLabel="Register Device"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="controller_id">Device ID *</Label>
                            <Input
                                id="controller_id"
                                value={formData.controller_id}
                                onChange={(e) => setFormData({ ...formData, controller_id: e.target.value })}
                                placeholder="DEVICE-2024-001"
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Rooftop - Main Building"
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
                </div>
            </FormDialog>

            {/* Edit Device Dialog */}
            <FormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                title="Edit Device"
                description="Update device information"
                onSubmit={handleUpdateDevice}
                submitLabel="Save Changes"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_controller_id">Device ID *</Label>
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
                </div>
            </FormDialog>
        </div>
    );
};

export default ClientDeviceRegistration;
