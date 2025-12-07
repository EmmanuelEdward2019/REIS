import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Building2,
  Factory,
  Users,
  Search,
  Eye,
  Edit,
  Activity,
  Zap,
  Battery,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Plus
} from 'lucide-react';

const AdminProjectSegments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('residential');
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    systemSize: '',
    segment: 'residential'
  });

  // Mock data for customers by segment
  const segments = {
    residential: {
      title: 'Residential',
      icon: Home,
      count: 234,
      customers: [
        {
          id: 1,
          name: 'John Smith',
          email: 'john@email.com',
          phone: '+234-901-234-5678',
          location: 'Lagos, Nigeria',
          systemSize: '5.5kW',
          status: 'active',
          controllers: 2,
          lastActivity: '2 hours ago',
          totalSavings: '$2,340',
          reisScore: 85
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@email.com',
          phone: '+234-802-345-6789',
          location: 'Abuja, Nigeria',
          systemSize: '7.2kW',
          status: 'active',
          controllers: 3,
          lastActivity: '1 day ago',
          totalSavings: '$3,120',
          reisScore: 92
        },
        {
          id: 3,
          name: 'Mike Brown',
          email: 'mike@email.com',
          phone: '+234-703-456-7890',
          location: 'Port Harcourt, Nigeria',
          systemSize: '4.8kW',
          status: 'maintenance',
          controllers: 1,
          lastActivity: '3 days ago',
          totalSavings: '$1,890',
          reisScore: 78
        }
      ]
    },
    commercial: {
      title: 'Commercial',
      icon: Building2,
      count: 89,
      customers: [
        {
          id: 4,
          name: 'TechCorp Ltd',
          email: 'admin@techcorp.com',
          phone: '+234-901-111-2222',
          location: 'Victoria Island, Lagos',
          systemSize: '250kW',
          status: 'active',
          controllers: 15,
          lastActivity: '1 hour ago',
          totalSavings: '$45,600',
          reisScore: 88
        },
        {
          id: 5,
          name: 'GreenMart Stores',
          email: 'energy@greenmart.com',
          phone: '+234-802-333-4444',
          location: 'Ikeja, Lagos',
          systemSize: '180kW',
          status: 'active',
          controllers: 12,
          lastActivity: '4 hours ago',
          totalSavings: '$32,100',
          reisScore: 91
        }
      ]
    },
    industrial: {
      title: 'Industrial',
      icon: Factory,
      count: 34,
      customers: [
        {
          id: 6,
          name: 'Steel Works Nigeria',
          email: 'operations@steelworks.ng',
          phone: '+234-903-555-6666',
          location: 'Kaduna, Nigeria',
          systemSize: '2.5MW',
          status: 'active',
          controllers: 45,
          lastActivity: '30 min ago',
          totalSavings: '$234,500',
          reisScore: 94
        },
        {
          id: 7,
          name: 'Petromax Industries',
          email: 'facilities@petromax.com',
          phone: '+234-804-777-8888',
          location: 'Warri, Delta',
          systemSize: '1.8MW',
          status: 'monitoring',
          controllers: 32,
          lastActivity: '2 hours ago',
          totalSavings: '$187,300',
          reisScore: 89
        }
      ]
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-accent/10 text-accent border-accent/20">Maintenance</Badge>;
      case 'monitoring':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Monitoring</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getReisScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-accent';
    return 'text-muted-foreground';
  };

  const currentSegment = segments[selectedSegment as keyof typeof segments];
  const filteredCustomers = currentSegment.customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Segment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(segments).map(([key, segment]) => {
          const IconComponent = segment.icon;
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all ${selectedSegment === key
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
                }`}
              onClick={() => setSelectedSegment(key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedSegment === key ? 'bg-primary/10' : 'bg-muted/50'
                    }`}>
                    <IconComponent className={`h-6 w-6 ${selectedSegment === key ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{segment.title}</h3>
                    <p className="text-sm text-muted-foreground">{segment.count} customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Customer Management */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <currentSegment.icon className="h-5 w-5" />
                {currentSegment.title} Customers
              </CardTitle>
              <CardDescription>
                Manage {currentSegment.title.toLowerCase()} segment customers and their solar installations
              </CardDescription>
            </div>
            <Dialog open={showAddCustomerDialog} onOpenChange={setShowAddCustomerDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setNewCustomer({
                    name: '',
                    email: '',
                    phone: '',
                    location: '',
                    systemSize: '',
                    segment: selectedSegment
                  });
                }}>
                  <Users className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Create a new customer profile for the {selectedSegment} segment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      placeholder="+234-901-234-5678"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newCustomer.location}
                      onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                      placeholder="Lagos, Nigeria"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systemSize">System Size</Label>
                    <Input
                      id="systemSize"
                      value={newCustomer.systemSize}
                      onChange={(e) => setNewCustomer({ ...newCustomer, systemSize: e.target.value })}
                      placeholder="5.5kW"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segment">Segment *</Label>
                    <Select
                      value={newCustomer.segment}
                      onValueChange={(value) => setNewCustomer({ ...newCustomer, segment: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddCustomerDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={async () => {
                    try {
                      if (!user) {
                        toast.error('You must be logged in to add customers');
                        return;
                      }

                      // Generate a mock ID since we can't create auth users from client
                      const mockId = crypto.randomUUID();

                      // Create user profile
                      const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([{
                          id: mockId,
                          full_name: newCustomer.name,
                          email: newCustomer.email,
                          phone: newCustomer.phone,
                          user_role: 'client',
                          location: newCustomer.location
                        }]);

                      if (profileError) throw profileError;

                      toast.success(`Customer "${newCustomer.name}" added successfully`);
                      setShowAddCustomerDialog(false);
                      setNewCustomer({
                        name: '',
                        email: '',
                        phone: '',
                        location: '',
                        systemSize: '',
                        segment: selectedSegment
                      });
                      // Refresh the page or update local state
                      window.location.reload();
                    } catch (error: any) {
                      console.error('Error adding customer:', error);
                      toast.error(error.message || 'Failed to add customer');
                    }
                  }}>
                    Add Customer
                  </Button>
                </DialogFooter>
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Customer Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>System Details</TableHead>
                  <TableHead>Controllers</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{customer.name}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {customer.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-primary" />
                          <span className="font-medium">{customer.systemSize}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          {customer.totalSavings} saved
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Battery className="h-3 w-3 text-accent" />
                        <span className="font-medium">{customer.controllers}</span>
                        <span className="text-sm text-muted-foreground">devices</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          <span className={`font-medium ${getReisScoreColor(customer.reisScore)}`}>
                            {customer.reisScore}
                          </span>
                          <span className="text-sm text-muted-foreground">REIS</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{customer.lastActivity}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(customer.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.info(`Viewing customer details for ${customer.name}`);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.info(`Editing customer ${customer.name}`);
                          }}
                        >
                          <Edit className="h-3 w-3" />
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

export default AdminProjectSegments;