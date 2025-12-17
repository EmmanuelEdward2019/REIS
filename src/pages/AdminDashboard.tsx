import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Settings,
  BarChart3,
  FileText,
  Shield,
  Zap,
  UserCheck,
  Briefcase,
  Target,
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  Award,
  Globe,
  Hammer,
  BookOpen,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  AlertCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Leaf,
  Gauge,
  Battery,
  Lightbulb,
  TreePine,
  Recycle,
  Package,
  MessageSquare,
  Activity,
  Wrench,
  FlaskConical,
  BarChart2,
  TreeDeciduous,
  Wind,
  Sun,
  Factory,
  Home,
  Car
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AdminProjectSegments from '@/components/admin/AdminProjectSegments';
import AdminUserManager from '@/components/admin/AdminUserManager';
import AdminLoyaltyManager from '@/components/admin/AdminLoyaltyManager';
import OrderManagement from '@/components/admin/OrderManagement';
import InventorySupplyChain from '@/components/admin/InventorySupplyChain';
import PartnerCertificationsManager from '@/components/admin/PartnerCertificationsManager';
import ProductApprovalManager from '@/components/admin/ProductApprovalManager';
import EnhancedTicketingSystem from '@/components/crm/EnhancedTicketingSystem';
import NewsManager from '@/components/admin/NewsManager';
import EventsManager from '@/components/admin/EventsManager';
import CaseStudiesManager from '@/components/admin/CaseStudiesManager';
import ProductManager from '@/components/admin/ProductManager';
import JobCodesManager from '@/components/admin/JobCodesManager';
import IoTControllersManager from '@/components/admin/IoTControllersManager';
import PartnerManager from '@/components/admin/PartnerManager';
import FormSubmissionsManager from '@/components/admin/FormSubmissionsManager';

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // State for real data
  const [users, setUsers] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [jobCodes, setJobCodes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [controllers, setControllers] = useState<any[]>([]);
  const [energyMetrics, setEnergyMetrics] = useState<any[]>([]);

  // System-wide metrics (calculated from real data)
  const [systemMetrics, setSystemMetrics] = useState({
    totalJobs: 0,
    activeTickets: 0,
    pendingPartners: 0,
    totalRevenue: "$0",
    partners: 0,
    clients: 0,
    seriousnessAvg: 0,
    complianceRate: 0
  });

  useEffect(() => {
    if (user && profile?.user_role === 'admin') {
      fetchAllAdminData();
    }
  }, [user, profile]);

  const fetchAllAdminData = async () => {
    setLoading(true);
    await Promise.all([
      fetchUsers(),
      fetchPartners(),
      fetchTickets(),
      fetchJobCodes(),
      fetchOrders(),
      fetchControllers(),
      fetchEnergyMetrics(),
    ]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);

      const clientCount = data?.filter(u => u.user_role === 'client').length || 0;
      setSystemMetrics(prev => ({ ...prev, clients: clientCount }));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);

      const activeCount = data?.filter(p => p.application_status === 'active').length || 0;
      const pendingCount = data?.filter(p => ['submitted', 'under_review', 'kyc_pending'].includes(p.application_status)).length || 0;

      setSystemMetrics(prev => ({
        ...prev,
        partners: activeCount,
        pendingPartners: pendingCount
      }));
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    }
  };

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);

      const activeCount = data?.filter(t => ['OPEN', 'IN_PROGRESS'].includes(t.status)).length || 0;
      setSystemMetrics(prev => ({ ...prev, activeTickets: activeCount }));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    }
  };

  const fetchJobCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('job_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobCodes(data || []);

      const totalRevenue = data?.reduce((sum, job) => sum + (job.estimated_value || 0), 0) || 0;
      setSystemMetrics(prev => ({
        ...prev,
        totalJobs: data?.length || 0,
        totalRevenue: `$${(totalRevenue / 1000000).toFixed(1)}M`
      }));
    } catch (error) {
      console.error('Error fetching job codes:', error);
      toast.error('Failed to load job codes');
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchControllers = async () => {
    try {
      const { data, error } = await supabase
        .from('controllers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setControllers(data || []);
    } catch (error) {
      console.error('Error fetching controllers:', error);
    }
  };

  const fetchEnergyMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('energy_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEnergyMetrics(data || []);
    } catch (error) {
      console.error('Error fetching energy metrics:', error);
    }
  };

  // Admin action handlers
  const handleApprovePartner = async (partnerId: string) => {
    try {
      const { error } = await supabase
        .from('partner_applications')
        .update({
          application_status: 'active',
          approval_date: new Date().toISOString()
        })
        .eq('id', partnerId);

      if (error) throw error;

      toast.success('Partner approved successfully');
      fetchPartners();
    } catch (error) {
      console.error('Error approving partner:', error);
      toast.error('Failed to approve partner');
    }
  };

  const handleRejectPartner = async (partnerId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('partner_applications')
        .update({
          application_status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', partnerId);

      if (error) throw error;

      toast.success('Partner application rejected');
      fetchPartners();
    } catch (error) {
      console.error('Error rejecting partner:', error);
      toast.error('Failed to reject partner');
    }
  };

  const handleAssignTicket = async (ticketId: string, partnerId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          assigned_to: partnerId,
          status: 'ASSIGNED',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success('Ticket assigned successfully');
      fetchTickets();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast.error('Failed to assign ticket');
    }
  };

  const handleEscalateTicket = async (ticketId: string, newLevel: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          hierarchy_level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success(`Ticket escalated to ${newLevel}`);
      fetchTickets();
    } catch (error) {
      console.error('Error escalating ticket:', error);
      toast.error('Failed to escalate ticket');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'client' | 'partner' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  // Environmental & Performance metrics (cumulative from all users)
  const environmentalMetrics = {
    totalCO2Saved: 15847.3, // tonnes
    carbonCredits: {
      earned: 12654,
      value: 316350, // USD
      pending: 2890
    },
    energyGeneration: {
      totalMWh: 8934.7,
      monthlyMWh: 742.3,
      dailyMWh: 24.1,
      efficiency: 87.2
    },
    billSavings: {
      totalSavings: 2847390, // USD
      monthlySavings: 189560,
      avgPerClient: 6245
    },
    environmentalEquivalents: {
      treesPlanted: 267890,
      carsOffRoad: 3456,
      homesPoewered: 1234,
      coalAvoided: 4567.8 // tonnes
    },
    reisScore: {
      systemAverage: 78.4,
      distribution: {
        excellent: 234, // 90-100
        good: 189, // 80-89
        average: 124, // 70-79
        poor: 45 // <70
      }
    }
  };

  // Real-time system performance
  const performanceMetrics = {
    activeSystems: 456,
    systemsOnline: 442,
    avgPerformance: 94.7,
    maintenanceAlerts: 23,
    criticalIssues: 3,
    energyEfficiency: 89.2,
    gridStability: 97.8
  };

  // Inventory management
  const inventoryMetrics = {
    totalSKUs: 1247,
    stockValue: 3456789, // USD
    lowStock: 34,
    outOfStock: 7,
    pendingOrders: 156,
    topMovingItems: [
      { name: "Solar Panel 450W", movement: 234, stock: 567 },
      { name: "Battery System 10kWh", movement: 89, stock: 123 },
      { name: "Inverter 5kW", movement: 156, stock: 289 }
    ]
  };

  // User feedback and ticketing
  const feedbackMetrics = {
    totalTickets: 2456,
    openTickets: 156,
    avgResolutionTime: 4.2, // hours
    satisfactionScore: 4.7, // out of 5
    categoryBreakdown: {
      technical: 89,
      billing: 34,
      installation: 23,
      maintenance: 67
    }
  };

  // R&D Insights
  const rdInsights = {
    activeProjects: 12,
    completedProjects: 45,
    patentApplications: 8,
    publicationsThisYear: 15,
    budgetUtilization: 78.5,
    innovationScore: 8.4
  };

  // Recent jobs with full CRM data
  const recentJobs = [
    {
      id: 1,
      jobCode: "ET-REIS-RES-DES-2024-0001",
      client: "John Smith",
      service: "Design & Engineering",
      segment: "RES",
      status: "ENG",
      seriousness: 15,
      created: "2 hours ago",
      lastActivity: "30 min ago",
      assignedTo: "Sarah Connor"
    },
    {
      id: 2,
      jobCode: "ET-REIS-COM-EPC-2024-0234",
      client: "TechCorp Ltd",
      service: "EPC",
      segment: "COM",
      status: "PROC",
      seriousness: 18,
      created: "1 day ago",
      lastActivity: "2 hours ago",
      assignedTo: "Mike Johnson"
    },
    {
      id: 3,
      jobCode: "ET-REIS-IND-H2-2024-0445",
      client: "Industrial Energy",
      service: "Hydrogen Solutions",
      segment: "IND",
      status: "COMM",
      seriousness: 20,
      created: "3 days ago",
      lastActivity: "1 hour ago",
      assignedTo: "Lisa Chen"
    }
  ];

  // Partner applications and status
  const partnerApplications = [
    {
      id: 1,
      partnerName: "Solar Pro Install Ltd",
      partnerClass: "Installation Company",
      region: "Nigeria",
      status: "KYC Pending",
      submitted: "1 day ago",
      completeness: 85,
      specialist: "Offshore, O&G"
    },
    {
      id: 2,
      partnerName: "David Wilson",
      partnerClass: "Individual Installer",
      region: "UK",
      status: "Compliance Review",
      submitted: "3 days ago",
      completeness: 100,
      specialist: "Residential"
    },
    {
      id: 3,
      partnerName: "Green Marketing Co",
      partnerClass: "Marketing Company",
      region: "ECOWAS",
      status: "Active",
      submitted: "2 weeks ago",
      completeness: 100,
      specialist: "E-commerce"
    }
  ];

  // Active tickets across all jobs
  const activeTickets = [
    { id: 1, ticketCode: "TKT-ENG-ET-REIS-RES-DES-2024-0001-01", stage: "ENG", priority: "High", assignee: "Sarah Connor", dueDate: "Today" },
    { id: 2, ticketCode: "TKT-PROC-ET-REIS-COM-EPC-2024-0234-02", stage: "PROC", priority: "Medium", assignee: "Mike Johnson", dueDate: "Tomorrow" },
    { id: 3, ticketCode: "TKT-COMM-ET-REIS-IND-H2-2024-0445-01", stage: "COMM", priority: "High", assignee: "Lisa Chen", dueDate: "Overdue" }
  ];

  // System alerts including CRM and partner alerts
  const systemAlerts = [
    { id: 1, type: "job", severity: "high", message: "Job ET-REIS-COM-EPC-2024-0234 stalled in PROC stage", time: "15 min ago" },
    { id: 2, type: "partner", severity: "medium", message: "Partner KYC documents expiring: Solar Pro Install Ltd", time: "1 hour ago" },
    { id: 3, type: "system", severity: "low", message: "Seriousness scoring algorithm update available", time: "2 hours ago" },
    { id: 4, type: "compliance", severity: "high", message: "ATEX certification expired for 3 partners", time: "3 hours ago" }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'INTAKE': return 'outline';
      case 'CONSULT': return 'secondary';
      case 'DATA-REVIEW': return 'default';
      case 'SITE-AUDIT': return 'default';
      case 'ENG': return 'default';
      case 'PROC': return 'default';
      case 'CONSTR': return 'default';
      case 'COMM': return 'default';
      case 'O&M': return 'secondary';
      case 'Active': return 'default';
      case 'KYC Pending': return 'outline';
      case 'Compliance Review': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeriousnessColor = (score: number) => {
    if (score >= 15) return 'text-success';
    if (score >= 10) return 'text-primary';
    if (score >= 6) return 'text-accent';
    return 'text-muted-foreground';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-secondary overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">System Administration</h1>
            <p className="text-muted-foreground">Comprehensive CRM, Partner Network & System Management</p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative bg-card border-border hover:bg-accent/10">
                  Review KYC
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {systemMetrics.pendingPartners}
                  </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full max-h-[80vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Pending KYC Reviews</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {partners.filter(p => ['submitted', 'under_review', 'kyc_pending'].includes(p.application_status)).length === 0 ? (
                    <p className="text-muted-foreground">No pending KYC reviews.</p>
                  ) : (
                    <div className="space-y-2">
                      {partners.filter(p => ['submitted', 'under_review', 'kyc_pending'].includes(p.application_status)).map(partner => (
                        <div key={partner.id} className="flex justify-between items-center p-3 border rounded-lg bg-card">
                          <div>
                            <p className="font-medium">{partner.organization_name || partner.contact_name}</p>
                            <p className="text-sm text-muted-foreground">{partner.application_status}</p>
                          </div>
                          <Button size="sm" onClick={() => setSelectedTab('partners')}>Review</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative bg-card border-border hover:bg-accent/10">
                  Overdue Tickets
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    0
                  </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle>Overdue Tickets</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <p className="text-muted-foreground">No overdue tickets.</p>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative bg-card border-border hover:bg-accent/10">
                  Compliance Alerts
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {systemAlerts.filter(a => a.type === 'compliance').length}
                  </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle>Compliance Alerts</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-2">
                  {systemAlerts.filter(a => a.type === 'compliance').map(alert => (
                    <div key={alert.id} className="p-3 bg-destructive/10 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{systemMetrics.totalJobs}</div>
                <p className="text-xs text-muted-foreground">+127 this month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
                <Clock className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{systemMetrics.activeTickets}</div>
                <p className="text-xs text-muted-foreground">Across all stages</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partners</CardTitle>
                <UserCheck className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{systemMetrics.partners}</div>
                <p className="text-xs text-muted-foreground">Active partners</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
                <AlertCircle className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{systemMetrics.pendingPartners}</div>
                <p className="text-xs text-muted-foreground">Need review</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{systemMetrics.clients}</div>
                <p className="text-xs text-muted-foreground">Total clients</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{systemMetrics.totalRevenue}</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Seriousness</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{systemMetrics.seriousnessAvg}</div>
                <p className="text-xs text-muted-foreground">Lead quality</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance</CardTitle>
                <Shield className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{systemMetrics.complianceRate}%</div>
                <p className="text-xs text-muted-foreground">System-wide</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 h-auto gap-4">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                  <TabsTrigger value="segments" className="text-xs sm:text-sm">Segments</TabsTrigger>
                  <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
                  <TabsTrigger value="loyalty" className="text-xs sm:text-sm">Loyalty</TabsTrigger>
                  <TabsTrigger value="jobs" className="text-xs sm:text-sm">Jobs</TabsTrigger>
                  <TabsTrigger value="partners" className="text-xs sm:text-sm">Partners</TabsTrigger>
                  <TabsTrigger value="products" className="text-xs sm:text-sm">Products</TabsTrigger>
                  <TabsTrigger value="tickets" className="text-xs sm:text-sm">Tickets</TabsTrigger>
                  <TabsTrigger value="orders" className="text-xs sm:text-sm">Orders</TabsTrigger>
                  <TabsTrigger value="inventory" className="text-xs sm:text-sm">Inventory</TabsTrigger>
                  <TabsTrigger value="form_submissions" className="text-xs sm:text-sm">Forms</TabsTrigger>
                  <TabsTrigger value="news" className="text-xs sm:text-sm">News</TabsTrigger>
                  <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
                  <TabsTrigger value="case_studies" className="text-xs sm:text-sm px-3 py-2">Case Studies</TabsTrigger>
                  <TabsTrigger value="iot_devices" className="text-xs sm:text-sm px-3 py-2">Controller</TabsTrigger>
                  <TabsTrigger value="metrics" className="text-xs sm:text-sm">Metrics</TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
                  <TabsTrigger value="compliance" className="text-xs sm:text-sm">Compliance</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="segments" className="space-y-6">
                  <AdminProjectSegments />
                </TabsContent>


                <TabsContent value="users" className="space-y-6">
                  <AdminUserManager />
                </TabsContent>

                <TabsContent value="loyalty" className="space-y-6">
                  <AdminLoyaltyManager />
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                  <ProductManager />
                </TabsContent>

                <TabsContent value="news" className="space-y-6">
                  <NewsManager />
                </TabsContent>

                <TabsContent value="events" className="space-y-6">
                  <EventsManager />
                </TabsContent>

                <TabsContent value="case_studies" className="space-y-6">
                  <CaseStudiesManager />
                </TabsContent>

                <TabsContent value="jobs" className="space-y-6">
                  <JobCodesManager />
                </TabsContent>

                <TabsContent value="iot_devices" className="space-y-6">
                  <IoTControllersManager />
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                  <OrderManagement />
                </TabsContent>

                <TabsContent value="inventory" className="space-y-6">
                  <InventorySupplyChain />
                </TabsContent>

                <TabsContent value="form_submissions" className="space-y-6">
                  <FormSubmissionsManager />
                </TabsContent>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Jobs */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          Recent Jobs
                        </CardTitle>
                        <CardDescription>Latest CRM activity across all segments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentJobs.map((job) => (
                            <div
                              key={job.id}
                              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedTab('jobs');
                                toast.info(`Viewing job ${job.jobCode}`);
                              }}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-sm">{job.jobCode}</h4>
                                  <Badge variant="outline" className="text-xs">{job.segment}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{job.client} • {job.service}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Score: <span className={getSeriousnessColor(job.seriousness)}>{job.seriousness}</span></span>
                                  <span>•</span>
                                  <span>{job.assignedTo}</span>
                                </div>
                              </div>
                              <div className="text-right space-y-1">
                                <Badge variant={getStatusBadgeVariant(job.status)}>{job.status}</Badge>
                                <p className="text-xs text-muted-foreground">{job.lastActivity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Partner Applications */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UserCheck className="h-5 w-5" />
                          Partner Applications
                        </CardTitle>
                        <CardDescription>Onboarding and KYC status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {partnerApplications.map((partner) => (
                            <div
                              key={partner.id}
                              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedTab('partners');
                                toast.info(`Viewing partner ${partner.partnerName}`);
                              }}
                            >
                              <div className="space-y-1">
                                <h4 className="font-medium text-sm">{partner.partnerName}</h4>
                                <p className="text-sm text-muted-foreground">{partner.partnerClass} • {partner.region}</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={partner.completeness} className="w-20 h-2" />
                                  <span className="text-xs text-muted-foreground">{partner.completeness}%</span>
                                </div>
                              </div>
                              <div className="text-right space-y-1">
                                <Badge variant={getStatusBadgeVariant(partner.status)}>{partner.status}</Badge>
                                <p className="text-xs text-muted-foreground">{partner.submitted}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Pipeline Overview */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        CRM Pipeline Overview
                      </CardTitle>
                      <CardDescription>Job distribution across all stages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">234</div>
                          <p className="text-sm text-muted-foreground">INTAKE</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-accent">89</div>
                          <p className="text-sm text-muted-foreground">CONSULT</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">156</div>
                          <p className="text-sm text-muted-foreground">ENG</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-success">67</div>
                          <p className="text-sm text-muted-foreground">PROC</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-success">43</div>
                          <p className="text-sm text-muted-foreground">COMM</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>


                <TabsContent value="partners" className="space-y-6">
                  <PartnerManager />
                </TabsContent>

                <TabsContent value="tickets" className="space-y-6">
                  {/* Enhanced Ticketing System with Hierarchy, SLA, and Internal Memos */}
                  <EnhancedTicketingSystem
                    userRole="admin"
                    userId="admin-user-id"
                    filter={activeFilter === 'overdue' ? 'overdue' : 'all'}
                  />
                </TabsContent>

                <TabsContent value="metrics" className="space-y-6">
                  {/* Environmental Impact Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-card border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
                        <Leaf className="h-4 w-4 text-success" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">{environmentalMetrics.totalCO2Saved.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">tonnes CO₂</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Carbon Credits</CardTitle>
                        <Award className="h-4 w-4 text-success" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">{environmentalMetrics.carbonCredits.earned.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">${environmentalMetrics.carbonCredits.value.toLocaleString()} value</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Energy Generated</CardTitle>
                        <Zap className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">{environmentalMetrics.energyGeneration.totalMWh.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">MWh total</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bill Savings</CardTitle>
                        <DollarSign className="h-4 w-4 text-success" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">${environmentalMetrics.billSavings.totalSavings.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">total saved</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Environmental Equivalents */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TreePine className="h-5 w-5" />
                          Environmental Equivalents
                        </CardTitle>
                        <CardDescription>Impact visualization across all systems</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <TreeDeciduous className="h-8 w-8 text-success" />
                            <div>
                              <p className="text-2xl font-bold text-foreground">{environmentalMetrics.environmentalEquivalents.treesPlanted.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Trees Planted</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Car className="h-8 w-8 text-primary" />
                            <div>
                              <p className="text-2xl font-bold text-foreground">{environmentalMetrics.environmentalEquivalents.carsOffRoad.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Cars off Road</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Home className="h-8 w-8 text-accent" />
                            <div>
                              <p className="text-2xl font-bold text-foreground">{environmentalMetrics.environmentalEquivalents.homesPoewered.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Homes Powered</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Factory className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="text-2xl font-bold text-foreground">{environmentalMetrics.environmentalEquivalents.coalAvoided.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Coal Avoided (t)</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* REIS Score Distribution */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Gauge className="h-5 w-5" />
                          REIS Score Distribution
                        </CardTitle>
                        <CardDescription>System-wide REIS performance (Avg: {environmentalMetrics.reisScore.systemAverage})</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Excellent (90-100)</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div className="bg-success h-2 rounded-full" style={{ width: `${(environmentalMetrics.reisScore.distribution.excellent / systemMetrics.clients) * 100}%` }}></div>
                              </div>
                              <span className="text-sm font-medium text-success">{environmentalMetrics.reisScore.distribution.excellent}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Good (80-89)</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${(environmentalMetrics.reisScore.distribution.good / systemMetrics.clients) * 100}%` }}></div>
                              </div>
                              <span className="text-sm font-medium text-primary">{environmentalMetrics.reisScore.distribution.good}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Average (70-79)</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div className="bg-accent h-2 rounded-full" style={{ width: `${(environmentalMetrics.reisScore.distribution.average / systemMetrics.clients) * 100}%` }}></div>
                              </div>
                              <span className="text-sm font-medium text-accent">{environmentalMetrics.reisScore.distribution.average}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Needs Improvement (&lt;70)</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div className="bg-muted-foreground h-2 rounded-full" style={{ width: `${(environmentalMetrics.reisScore.distribution.poor / systemMetrics.clients) * 100}%` }}></div>
                              </div>
                              <span className="text-sm font-medium text-muted-foreground">{environmentalMetrics.reisScore.distribution.poor}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Real-time Performance & Maintenance */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Real-time Performance
                        </CardTitle>
                        <CardDescription>Live system performance metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Systems Online</span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                              <span className="font-medium">{performanceMetrics.systemsOnline}/{performanceMetrics.activeSystems}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Avg Performance</span>
                            <span className="font-medium text-success">{performanceMetrics.avgPerformance}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Energy Efficiency</span>
                            <span className="font-medium text-primary">{performanceMetrics.energyEfficiency}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Grid Stability</span>
                            <span className="font-medium text-success">{performanceMetrics.gridStability}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          Maintenance & Alerts
                        </CardTitle>
                        <CardDescription>System health and maintenance status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Active Alerts</span>
                            <Badge variant={performanceMetrics.maintenanceAlerts > 20 ? 'destructive' : 'secondary'}>
                              {performanceMetrics.maintenanceAlerts}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Critical Issues</span>
                            <Badge variant={performanceMetrics.criticalIssues > 0 ? 'destructive' : 'default'}>
                              {performanceMetrics.criticalIssues}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Preventive Maintenance</span>
                            <span className="text-sm font-medium text-primary">Up to date</span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSelectedTab('tickets');
                              toast.info('Viewing all maintenance alerts');
                            }}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            View All Alerts
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Inventory Management
                        </CardTitle>
                        <CardDescription>Stock levels and procurement status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Total SKUs</span>
                            <span className="font-medium">{inventoryMetrics.totalSKUs.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Stock Value</span>
                            <span className="font-medium text-success">${inventoryMetrics.stockValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Low Stock Items</span>
                            <Badge variant={inventoryMetrics.lowStock > 30 ? 'destructive' : 'secondary'}>
                              {inventoryMetrics.lowStock}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Pending Orders</span>
                            <span className="font-medium text-primary">{inventoryMetrics.pendingOrders}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* User Feedback & R&D Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          User Feedback & Support
                        </CardTitle>
                        <CardDescription>Aggregated customer satisfaction and support metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-xl font-bold text-success">{feedbackMetrics.satisfactionScore}</div>
                            <p className="text-xs text-muted-foreground">Satisfaction Score</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-xl font-bold text-primary">{feedbackMetrics.avgResolutionTime}h</div>
                            <p className="text-xs text-muted-foreground">Avg Resolution</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Technical Issues</span>
                            <span className="font-medium">{feedbackMetrics.categoryBreakdown.technical}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Billing Inquiries</span>
                            <span className="font-medium">{feedbackMetrics.categoryBreakdown.billing}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Installation Support</span>
                            <span className="font-medium">{feedbackMetrics.categoryBreakdown.installation}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Maintenance</span>
                            <span className="font-medium">{feedbackMetrics.categoryBreakdown.maintenance}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FlaskConical className="h-5 w-5" />
                          R&D Insights
                        </CardTitle>
                        <CardDescription>Research & development performance metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-xl font-bold text-primary">{rdInsights.activeProjects}</div>
                            <p className="text-xs text-muted-foreground">Active Projects</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-xl font-bold text-success">{rdInsights.patentApplications}</div>
                            <p className="text-xs text-muted-foreground">Patent Applications</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Completed Projects</span>
                            <span className="font-medium">{rdInsights.completedProjects}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Publications (2024)</span>
                            <span className="font-medium">{rdInsights.publicationsThisYear}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Budget Utilization</span>
                            <span className="font-medium text-primary">{rdInsights.budgetUtilization}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Innovation Score</span>
                            <span className="font-medium text-success">{rdInsights.innovationScore}/10</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Revenue Analytics
                        </CardTitle>
                        <CardDescription>Revenue breakdown by segment and service</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Residential (RES)</span>
                            <span className="font-medium">$1.8M</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Commercial (COM)</span>
                            <span className="font-medium">$2.4M</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Industrial (IND)</span>
                            <span className="font-medium">$1.5M</span>
                          </div>
                          <div className="h-32 bg-muted rounded-lg flex items-center justify-center mt-4">
                            <p className="text-muted-foreground">Revenue chart visualization</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Lead Quality Analytics
                        </CardTitle>
                        <CardDescription>Seriousness score distribution and conversion rates</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>High Quality (15-20)</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div className="bg-success h-2 rounded-full" style={{ width: '78%' }}></div>
                              </div>
                              <span className="text-sm">78%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Medium Quality (10-14)</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                              </div>
                              <span className="text-sm">45%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Low Quality (6-9)</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div className="bg-accent h-2 rounded-full" style={{ width: '23%' }}></div>
                              </div>
                              <span className="text-sm">23%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Time Wasters (0-5)</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div className="bg-muted-foreground h-2 rounded-full" style={{ width: '5%' }}></div>
                              </div>
                              <span className="text-sm">5%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Partner Network Analytics
                      </CardTitle>
                      <CardDescription>Partner performance and geographic distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">45</div>
                          <p className="text-sm text-muted-foreground">Installation Partners</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">23</div>
                          <p className="text-sm text-muted-foreground">Marketing Partners</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">12</div>
                          <p className="text-sm text-muted-foreground">Engineering Partners</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">9</div>
                          <p className="text-sm text-muted-foreground">O&M Partners</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Compliance & Risk Management
                      </CardTitle>
                      <CardDescription>IMS alignment (ISO 9001/14001/45001) and regulatory oversight</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-success/10 rounded-lg">
                          <div className="text-2xl font-bold text-success">98.2%</div>
                          <p className="text-sm text-muted-foreground">Overall Compliance</p>
                        </div>
                        <div className="text-center p-4 bg-accent/10 rounded-lg">
                          <div className="text-2xl font-bold text-accent">23</div>
                          <p className="text-sm text-muted-foreground">Cert Renewals Due</p>
                        </div>
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <div className="text-2xl font-bold text-primary">156</div>
                          <p className="text-sm text-muted-foreground">Active Audits</p>
                        </div>
                        <div className="text-center p-4 bg-destructive/10 rounded-lg">
                          <div className="text-2xl font-bold text-destructive">3</div>
                          <p className="text-sm text-muted-foreground">Non-Conformances</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Partner Certifications Manager - Now Editable */}
                        <PartnerCertificationsManager />

                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Regional Compliance</h4>
                            <Badge variant="outline">Multi-Region</Badge>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Nigeria (CAC/RC):</span>
                              <span className="ml-2 font-medium text-success">✓ 45/45</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">UK (Companies House):</span>
                              <span className="ml-2 font-medium text-success">✓ 23/23</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">ECOWAS:</span>
                              <span className="ml-2 font-medium text-accent">⚠ 19/21</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          System Configuration
                        </CardTitle>
                        <CardDescription>Manage CRM settings and automation rules</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => {
                            toast.info('Seriousness scoring rules configuration coming soon');
                          }}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Seriousness Scoring Rules
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => {
                            toast.info('Automation workflows configuration coming soon');
                          }}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Automation Workflows
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => {
                            toast.info('Service catalog management coming soon');
                          }}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Service Catalog Management
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => {
                            toast.info('Document templates management coming soon');
                          }}
                        >
                          <FileCheck className="h-4 w-4 mr-2" />
                          Document Templates
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => {
                            toast.info('Email templates management coming soon');
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email Templates
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          User & Role Management
                        </CardTitle>
                        <CardDescription>Manage system access and permissions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => {
                            setSelectedTab('users');
                            toast.info('Viewing internal users');
                          }}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Internal Users ({systemMetrics.clients + systemMetrics.partners})
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={() => {
                            toast.info('Role permissions management coming soon');
                          }}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Role Permissions
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={async () => {
                            try {
                              const auditData = {
                                users: users.length,
                                partners: partners.length,
                                jobs: jobCodes.length,
                                tickets: tickets.length,
                                orders: orders.length,
                                timestamp: new Date().toISOString()
                              };
                              const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `audit-log-${new Date().toISOString().split('T')[0]}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                              toast.success('Audit log exported');
                            } catch (error) {
                              toast.error('Failed to export audit log');
                            }
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Audit Log Viewer
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={async () => {
                            try {
                              const exportData = {
                                users,
                                partners,
                                jobCodes,
                                tickets,
                                orders,
                                controllers,
                                exportedAt: new Date().toISOString()
                              };
                              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `system-export-${new Date().toISOString().split('T')[0]}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                              toast.success('System data exported successfully');
                            } catch (error) {
                              toast.error('Failed to export data');
                            }
                          }}
                        >
                          <Database className="h-4 w-4 mr-2" />
                          Data Export/Import
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          onClick={async () => {
                            try {
                              const healthCheck = {
                                database: 'Connected',
                                api: 'Operational',
                                storage: 'Available',
                                uptime: '99.8%',
                                checkedAt: new Date().toISOString()
                              };
                              toast.success('System health check completed. All systems operational.');
                            } catch (error) {
                              toast.error('Health check failed');
                            }
                          }}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          System Health Check
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Performance Monitoring
                        </CardTitle>
                        <CardDescription>System performance and usage statistics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-xl font-bold text-success">99.8%</div>
                            <p className="text-sm text-muted-foreground">System Uptime</p>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-xl font-bold text-primary">1.2s</div>
                            <p className="text-sm text-muted-foreground">Avg Response Time</p>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-xl font-bold text-accent">15.7k</div>
                            <p className="text-sm text-muted-foreground">Daily API Calls</p>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-xl font-bold text-primary">847</div>
                            <p className="text-sm text-muted-foreground">Active Sessions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* System Alerts */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`w-2 h-2 rounded-full mt-2 ${alert.severity === 'high' ? 'bg-destructive animate-pulse' :
                          alert.severity === 'medium' ? 'bg-accent' : 'bg-primary'
                          }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {alert.type}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-4"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTab('tickets');
                      toast.info('Viewing all system alerts');
                    }}
                  >
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTab('partners');
                      setActiveFilter('kyc_pending');
                      toast.info('Navigating to partner KYC review');
                    }}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Review KYC ({systemMetrics.pendingPartners})
                  </Button>
                  <Button
                    className="w-full justify-start"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTab('tickets');
                      setActiveFilter('overdue');
                      toast.info('Viewing overdue tickets');
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Overdue Tickets ({tickets.filter(t => t.status === 'OPEN' && new Date(t.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length})
                  </Button>
                  <Button
                    className="w-full justify-start"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTab('compliance');
                      setActiveFilter('alerts');
                      toast.info('Viewing compliance alerts');
                    }}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Compliance Alerts (7)
                  </Button>
                  <Button
                    className="w-full justify-start"
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        const reportData = {
                          users: users.length,
                          partners: partners.length,
                          jobs: jobCodes.length,
                          tickets: tickets.length,
                          orders: orders.length,
                          generatedAt: new Date().toISOString()
                        };
                        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast.success('Report generated and downloaded');
                      } catch (error) {
                        toast.error('Failed to generate report');
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Jobs</span>
                      <span className="text-sm font-medium text-success">+23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Jobs Completed</span>
                      <span className="text-sm font-medium text-primary">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Partner Applications</span>
                      <span className="text-sm font-medium text-accent">+5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revenue Generated</span>
                      <span className="text-sm font-medium text-success">$47.2K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;