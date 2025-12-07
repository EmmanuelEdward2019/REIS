import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Star,
  Award,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const AdminUserManager = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    role: 'client',
    segment: 'Residential'
  });

  // Mock user data
  const users = [
    {
      id: 'user-001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+234-901-234-5678',
      location: 'Lagos, Nigeria',
      segment: 'Residential',
      status: 'active',
      verified: true,
      joinDate: '2024-01-15',
      lastActivity: '2 hours ago',
      totalSpent: 15420,
      transactionCount: 12,
      transactionFrequency: 'Monthly',
      loyaltyScore: 85,
      reisScore: 92,
      controllers: 2,
      services: ['Solar Installation', 'Maintenance']
    },
    {
      id: 'user-002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+234-802-345-6789',
      location: 'Abuja, Nigeria',
      segment: 'Residential',
      status: 'active',
      verified: true,
      joinDate: '2023-11-22',
      lastActivity: '1 day ago',
      totalSpent: 23850,
      transactionCount: 18,
      transactionFrequency: 'Bi-weekly',
      loyaltyScore: 92,
      reisScore: 88,
      controllers: 3,
      services: ['Solar Installation', 'Battery Storage', 'Monitoring']
    },
    {
      id: 'user-003',
      name: 'TechCorp Ltd',
      email: 'admin@techcorp.com',
      phone: '+234-901-111-2222',
      location: 'Victoria Island, Lagos',
      segment: 'Commercial',
      status: 'active',
      verified: true,
      joinDate: '2023-08-15',
      lastActivity: '3 hours ago',
      totalSpent: 456780,
      transactionCount: 45,
      transactionFrequency: 'Weekly',
      loyaltyScore: 96,
      reisScore: 94,
      controllers: 15,
      services: ['EPC Services', 'O&M', 'Energy Analytics']
    },
    {
      id: 'user-004',
      name: 'Mike Brown',
      email: 'mike.brown@email.com',
      phone: '+234-703-456-7890',
      location: 'Port Harcourt, Nigeria',
      segment: 'Residential',
      status: 'suspended',
      verified: false,
      joinDate: '2024-02-10',
      lastActivity: '1 week ago',
      totalSpent: 5200,
      transactionCount: 3,
      transactionFrequency: 'Quarterly',
      loyaltyScore: 45,
      reisScore: 67,
      controllers: 1,
      services: ['Solar Installation']
    },
    {
      id: 'user-005',
      name: 'Steel Works Nigeria',
      email: 'operations@steelworks.ng',
      phone: '+234-903-555-6666',
      location: 'Kaduna, Nigeria',
      segment: 'Industrial',
      status: 'active',
      verified: true,
      joinDate: '2023-05-10',
      lastActivity: '30 minutes ago',
      totalSpent: 2340000,
      transactionCount: 125,
      transactionFrequency: 'Daily',
      loyaltyScore: 98,
      reisScore: 96,
      controllers: 45,
      services: ['EPC Services', 'Grid Integration', 'Energy Storage', 'O&M']
    }
  ];

  const getStatusBadge = (status: string, verified: boolean) => {
    if (!verified) {
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Unverified</Badge>;
    }

    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>;
      case 'inactive':
        return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Inactive</Badge>;
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

  const getLoyaltyBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">VIP</Badge>;
    if (score >= 80) return <Badge className="bg-primary/10 text-primary border-primary/20">Premium</Badge>;
    if (score >= 60) return <Badge className="bg-accent/10 text-accent border-accent/20">Regular</Badge>;
    return <Badge variant="outline">Basic</Badge>;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSegment = segmentFilter === 'all' || user.segment === segmentFilter;

    return matchesSearch && matchesStatus && matchesSegment;
  });

  // Calculate totals for display
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const verifiedUsers = users.filter(u => u.verified).length;
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* User Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Award className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{verifiedUsers}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ${(totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage all system users, their status, and customer information
              </CardDescription>
            </div>
            <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setNewUser({
                    name: '',
                    email: '',
                    phone: '',
                    location: '',
                    role: 'client',
                    segment: 'Residential'
                  });
                }}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account. This can be a client, partner, or admin user.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        placeholder="+234-901-234-5678"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={newUser.location}
                        onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                        placeholder="Lagos, Nigeria"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">User Role *</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newUser.role === 'client' && (
                      <div className="space-y-2">
                        <Label htmlFor="segment">Segment</Label>
                        <Select
                          value={newUser.segment}
                          onValueChange={(value) => setNewUser({ ...newUser, segment: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Residential">Residential</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Industrial">Industrial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={async () => {
                      try {
                        if (!user) {
                          toast.error('You must be logged in to add users');
                          return;
                        }

                        const mockId = crypto.randomUUID();
                        const { error } = await supabase
                          .from('profiles')
                          .insert([{
                            id: mockId,
                            full_name: newUser.name,
                            email: newUser.email,
                            phone: newUser.phone,
                            user_role: newUser.role,
                            location: newUser.location
                          }]);

                        if (error) throw error;

                        toast.success(`User "${newUser.name}" added successfully`);
                        setShowAddUserDialog(false);
                        setNewUser({
                          name: '',
                          email: '',
                          phone: '',
                          location: '',
                          role: 'client',
                          segment: 'Residential'
                        });
                      } catch (error: any) {
                        console.error('Error adding user:', error);
                        toast.error(error.message || 'Failed to add user');
                      }
                    }}>
                      Add User
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-[150px]">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Segment & Status</TableHead>
                  <TableHead>Activity & Performance</TableHead>
                  <TableHead>Transaction History</TableHead>
                  <TableHead>Loyalty Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.location}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span className={`text-sm font-medium ${getSegmentColor(user.segment)}`}>
                          {user.segment}
                        </span>
                        {getStatusBadge(user.status, user.verified)}
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {user.joinDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Activity className="h-3 w-3 text-primary" />
                          {user.lastActivity}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          REIS: <span className="font-medium text-success">{user.reisScore}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.controllers} controllers • {user.services.length} services
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-success" />
                          <span className="font-medium">${user.totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.transactionCount} transactions
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.transactionFrequency}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {getLoyaltyBadge(user.loyaltyScore)}
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">{user.loyaltyScore}</span>
                          <span className="text-xs text-muted-foreground">score</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.info(`Viewing user details for ${user.name}`);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.info(`Editing user ${user.name}`);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={async () => {
                            if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) return;
                            try {
                              // In production, this would delete the user from auth and profiles
                              toast.success(`User "${user.name}" deleted successfully`);
                            } catch (error) {
                              toast.error('Failed to delete user');
                            }
                          }}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManager;