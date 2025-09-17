import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Wrench
} from 'lucide-react';

const AdminControllerManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedController, setSelectedController] = useState<any>(null);

  // Mock controller data
  const controllers = [
    {
      id: 'ctrl-001',
      deviceName: 'Solar Controller Alpha',
      deviceType: 'MPPT Controller',
      controllerId: 'SC-A-001',
      customerName: 'John Smith',
      customerSegment: 'Residential',
      location: 'Lagos, Nigeria',
      isOnline: true,
      isActive: true,
      status: 'operational',
      installationDate: '2024-01-15',
      lastHeartbeat: '2 minutes ago',
      firmwareVersion: 'v2.3.1',
      macAddress: '00:1B:44:11:3A:B7',
      ipAddress: '192.168.1.100',
      batteryLevel: 85,
      solarGeneration: 4.2, // kW
      energyToday: 28.5, // kWh
      systemTemp: 42, // °C
      efficiency: 94.2,
      alertsCount: 0,
      warrantyExpiry: '2027-01-15'
    },
    {
      id: 'ctrl-002',
      deviceName: 'Industrial Power Hub',
      deviceType: 'Grid-Tie Inverter',
      controllerId: 'IPH-002',
      customerName: 'TechCorp Ltd',
      customerSegment: 'Commercial',
      location: 'Victoria Island, Lagos',
      isOnline: true,
      isActive: true,
      status: 'operational',
      installationDate: '2023-08-22',
      lastHeartbeat: '1 minute ago',
      firmwareVersion: 'v3.1.0',
      macAddress: '00:1B:44:22:4B:C8',
      ipAddress: '192.168.1.101',
      batteryLevel: 92,
      solarGeneration: 180.5, // kW
      energyToday: 1240, // kWh
      systemTemp: 38, // °C
      efficiency: 96.8,
      alertsCount: 1,
      warrantyExpiry: '2026-08-22'
    },
    {
      id: 'ctrl-003',
      deviceName: 'Residential Energy Manager',
      deviceType: 'Hybrid Inverter',
      controllerId: 'REM-003',
      customerName: 'Sarah Johnson',
      customerSegment: 'Residential',
      location: 'Abuja, Nigeria',
      isOnline: false,
      isActive: true,
      status: 'maintenance',
      installationDate: '2024-03-10',
      lastHeartbeat: '2 hours ago',
      firmwareVersion: 'v2.2.8',
      macAddress: '00:1B:44:33:5C:D9',
      ipAddress: '192.168.1.102',
      batteryLevel: 67,
      solarGeneration: 0, // kW (offline)
      energyToday: 15.2, // kWh
      systemTemp: 35, // °C
      efficiency: 89.1,
      alertsCount: 3,
      warrantyExpiry: '2027-03-10'
    },
    {
      id: 'ctrl-004',
      deviceName: 'Mega Industrial Controller',
      deviceType: 'Central Inverter',
      controllerId: 'MIC-004',
      customerName: 'Steel Works Nigeria',
      customerSegment: 'Industrial',
      location: 'Kaduna, Nigeria',
      isOnline: true,
      isActive: true,
      status: 'operational',
      installationDate: '2023-11-05',
      lastHeartbeat: '30 seconds ago',
      firmwareVersion: 'v4.0.2',
      macAddress: '00:1B:44:44:6D:EA',
      ipAddress: '192.168.1.103',
      batteryLevel: 88,
      solarGeneration: 2150.8, // kW
      energyToday: 18420, // kWh
      systemTemp: 45, // °C
      efficiency: 97.3,
      alertsCount: 0,
      warrantyExpiry: '2026-11-05'
    }
  ];

  const getStatusBadge = (status: string, isOnline: boolean) => {
    if (!isOnline) {
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Offline</Badge>;
    }
    
    switch (status) {
      case 'operational':
        return <Badge className="bg-success/10 text-success border-success/20">Operational</Badge>;
      case 'maintenance':
        return <Badge className="bg-accent/10 text-accent border-accent/20">Maintenance</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Warning</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Residential':
        return 'text-blue-600';
      case 'Commercial':
        return 'text-green-600';
      case 'Industrial':
        return 'text-purple-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredControllers = controllers.filter(controller => {
    const matchesSearch = 
      controller.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      controller.controllerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      controller.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      controller.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'online' && controller.isOnline) ||
      (statusFilter === 'offline' && !controller.isOnline) ||
      (statusFilter === 'maintenance' && controller.status === 'maintenance') ||
      (statusFilter === 'operational' && controller.status === 'operational');

    return matchesSearch && matchesStatus;
  });

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
                  {controllers.filter(c => c.isOnline).length}
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
                  {controllers.filter(c => c.status === 'maintenance').length}
                </p>
                <p className="text-sm text-muted-foreground">Maintenance</p>
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
                  {controllers.reduce((sum, c) => sum + c.alertsCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Controller
            </Button>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device & Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>System Health</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredControllers.map((controller) => (
                  <TableRow key={controller.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{controller.deviceName}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {controller.controllerId} • {controller.deviceType}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={getSegmentColor(controller.customerSegment)}>
                            {controller.customerName}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {controller.location}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {getStatusBadge(controller.status, controller.isOnline)}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Activity className="h-3 w-3" />
                          {controller.isOnline ? 'Online' : 'Offline'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-primary" />
                          <span className="font-medium">{controller.solarGeneration}kW</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Battery className="h-3 w-3" />
                          {controller.batteryLevel}% • {controller.efficiency}% eff
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {controller.energyToday}kWh today
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3 text-accent" />
                          <span className="text-sm">{controller.systemTemp}°C</span>
                        </div>
                        {controller.alertsCount > 0 ? (
                          <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <AlertTriangle className="h-3 w-3" />
                            {controller.alertsCount} alerts
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-sm text-success">
                            <CheckCircle className="h-3 w-3" />
                            Healthy
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {controller.lastHeartbeat}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          v{controller.firmwareVersion}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminControllerManager;