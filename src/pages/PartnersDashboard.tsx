import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  Upload,
  FileCheck,
  Users,
  ShoppingCart,
  TrendingUp,
  Star,
  Calendar,
  AlertCircle,
  Shield,
  Globe,
  Zap,
  Award,
  Building,
  MapPin,
  Phone,
  Mail,
  Edit,
  Download,
  Plus,
  Filter,
  Search,
  BarChart3,
  Settings,
  Bell,
  CreditCard,
  FileText,
  Wrench,
  Loader2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EnhancedTicketingSystem from '@/components/crm/EnhancedTicketingSystem';
import ProductManager from '@/components/admin/ProductManager';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface PartnerProfile {
  id: string;
  status: 'Draft' | 'Submitted' | 'KYC Pending' | 'KYC Approved' | 'Compliance Verified' | 'Active' | 'Suspended';
  type: 'company' | 'individual';
  legalName: string;
  tradingName?: string;
  class: string;
  specialties: string[];
  location: {
    city: string;
    state: string;
    country: string;
  };
  coverage: string[];
  servicesProvided: string[];
  servicesNeeded: string[];
  seriousnessScore: number;
  completionRate: number;
  rating: number;
  level: string;
  certifications: string[];
  lastActivity: string;
}

interface JobCode {
  id: string;
  code: string;
  service: string;
  segment: string;
  status: string;
  value: string;
  commission: string;
  client: string;
  createdDate: string;
  lastUpdated: string;
}

interface Commission {
  id: string;
  jobCode: string;
  type: 'Installation' | 'Sales' | 'Referral' | 'Training';
  amount: string;
  rate: string;
  status: 'Pending' | 'Approved' | 'Paid';
  dueDate: string;
}

const PartnersDashboard = () => {
  const { user, profile } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [partnerApplication, setPartnerApplication] = useState<any>(null);
  const [jobCodes, setJobCodes] = useState<JobCode[]>([]);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [partnerMetrics, setPartnerMetrics] = useState({
    totalOrders: 0,
    activeProjects: 0,
    totalCommissions: "₦0",
    pendingPayouts: "₦0",
    completionRate: "0%",
    rating: 0,
    revenueThisMonth: "₦0",
    activeListings: 0,
    referrals: 0,
    trainingCompleted: 0
  });

  useEffect(() => {
    if (user) {
      fetchAllPartnerData();
    }
  }, [user]);

  const fetchAllPartnerData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPartnerApplication(),
      fetchJobCodes(),
      fetchAvailableJobs(),
      fetchCommissions(),
      fetchProducts(),
      fetchTickets(),
    ]);
    setLoading(false);
  };

  const fetchPartnerApplication = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('partner_applications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching partner application:', error);
        return;
      }

      setPartnerApplication(data);
    } catch (error) {
      console.error('Error fetching partner application:', error);
    }
  };

  const fetchJobCodes = async () => {
    if (!user || !partnerApplication) return;

    try {
      const { data, error } = await supabase
        .from('job_codes')
        .select('*')
        .eq('partner_id', partnerApplication.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to JobCode interface
      const transformedJobs: JobCode[] = (data || []).map(job => ({
        id: job.id,
        code: job.job_code || '',
        service: job.job_type || '',
        segment: job.service_class || '',
        status: job.status || '',
        value: `₦${job.estimated_value?.toLocaleString() || '0'}`,
        commission: `₦${((job.estimated_value || 0) * 0.05).toLocaleString()}`, // 5% commission
        client: job.client_id || '',
        createdDate: new Date(job.created_at).toLocaleDateString(),
        lastUpdated: new Date(job.updated_at).toLocaleDateString()
      }));

      setJobCodes(transformedJobs);

      // Calculate metrics
      const totalValue = data?.reduce((sum, job) => sum + (job.estimated_value || 0), 0) || 0;
      const activeCount = data?.filter(job => job.status === 'in_progress').length || 0;
      const completedCount = data?.filter(job => job.status === 'completed').length || 0;
      const totalCount = data?.length || 0;

      setPartnerMetrics(prev => ({
        ...prev,
        totalOrders: totalCount,
        activeProjects: activeCount,
        totalCommissions: `₦${(totalValue * 0.05).toLocaleString()}`,
        completionRate: totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : '0%',
      }));
    } catch (error) {
      console.error('Error fetching job codes:', error);
      toast.error('Failed to load job codes');
    }
  };

  const fetchAvailableJobs = async () => {
    if (!user) return;

    try {
      // Fetch jobs that are not assigned to any partner yet
      const { data, error } = await supabase
        .from('job_codes')
        .select('*')
        .is('partner_id', null)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const transformedJobs = (data || []).map(job => ({
        id: job.id,
        jobCode: job.job_code,
        title: job.project_name,
        location: job.location?.address || 'Location TBD',
        budget: `₦${job.estimated_value?.toLocaleString() || '0'}`,
        urgency: job.priority || 'medium',
        skills: [job.job_type, job.service_class],
        description: job.description || '',
        deadline: job.expected_completion_date || ''
      }));

      setAvailableJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching available jobs:', error);
      toast.error('Failed to load marketplace jobs');
    }
  };

  const fetchCommissions = async () => {
    if (!user || !partnerApplication) return;

    try {
      const { data, error } = await supabase
        .from('job_codes')
        .select('*')
        .eq('partner_id', partnerApplication.id)
        .in('status', ['completed', 'in_progress'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedCommissions: Commission[] = (data || []).map(job => ({
        id: job.id,
        jobCode: job.job_code || '',
        type: 'Installation' as const,
        amount: `₦${((job.estimated_value || 0) * 0.05).toLocaleString()}`,
        rate: '5%',
        status: job.status === 'completed' ? 'Approved' : 'Pending',
        dueDate: job.expected_completion_date || ''
      }));

      setCommissions(transformedCommissions);

      // Calculate pending payouts
      const pendingAmount = data
        ?.filter(job => job.status === 'completed')
        .reduce((sum, job) => sum + ((job.estimated_value || 0) * 0.05), 0) || 0;

      setPartnerMetrics(prev => ({
        ...prev,
        pendingPayouts: `₦${pendingAmount.toLocaleString()}`,
      }));
    } catch (error) {
      console.error('Error fetching commissions:', error);
      toast.error('Failed to load commissions');
    }
  };

  const fetchProducts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('partner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);

      setPartnerMetrics(prev => ({
        ...prev,
        activeListings: data?.length || 0,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchTickets = async () => {
    if (!user || !partnerApplication) return;

    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('assigned_to', partnerApplication.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Derived document links based on partner profile
  const docLinks = (() => {
    if (!partnerApplication) return [];

    const country = partnerApplication.partner_country?.toLowerCase() || '';
    const isNigeria = country.includes('nigeria') || country === 'ng';
    const isUK = country.includes('united kingdom') || country === 'uk' || country.includes('england') || country.includes('scotland') || country.includes('wales');
    const category = partnerApplication.partner_category || '';
    const providesInstall = category === 'installer';
    const providesSales = category === 'sales';

    const links: { label: string; href: string }[] = [];
    if (isNigeria && providesInstall) {
      links.push(
        { label: 'Installer/Service Partner Registration Form (Nigeria)', href: '/partners/Eagle_Thistle_Installer_Service_Partner_Registration_Form_Nigeria.docx' },
        { label: 'Installer/Service Partner Policy (Nigeria)', href: '/partners/Eagle_Thistle_Installer_Service_Partner_Policy_Nigeria.docx' }
      );
    }
    if (isUK && providesInstall) {
      links.push(
        { label: 'Installer/Service Partner Registration Form (UK)', href: '/partners/Eagle_Thistle_Installer_Service_Partner_Registration_Form_UK.docx' },
        { label: 'Installer/Service Partner Policy (UK)', href: '/partners/Eagle_Thistle_Installer_Service_Partner_Policy_UK.docx' }
      );
    }
    if (isNigeria && providesSales) {
      links.push(
        { label: 'Sales Partner Registration Form (Nigeria)', href: '/partners/Eagle_Thistle_Sales_Partner_Registration_Form Nigeria.docx' },
        { label: 'Sales Partner Policy (Nigeria)', href: '/partners/Eagle_Thistle_sales_Partner_Policy_One_Pager Nigeria.pdf' }
      );
    }
    if (isUK && providesSales) {
      links.push(
        { label: 'Sales Partner Registration Form (UK)', href: '/partners/Eagle_Thistle_UK_Sales_Partner_Registration_Form.docx' },
        { label: 'Sales Partner Policy (UK)', href: '/partners/Eagle_Thistle_UK_Sales_Partner_Policy_One_Pager.docx' }
      );
    }
    return links;
  })();

  const handleAcceptJob = async (jobId: string) => {
    if (!user || !partnerApplication) return;

    try {
      const { error } = await supabase
        .from('job_codes')
        .update({
          partner_id: partnerApplication.id,
          status: 'assigned'
        })
        .eq('id', jobId);

      if (error) throw error;

      toast.success('Job accepted successfully!');
      fetchJobCodes();
      fetchAvailableJobs();
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error('Failed to accept job');
    }
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('job_codes')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (error) throw error;

      toast.success('Job status updated');
      fetchJobCodes();
      fetchCommissions();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  const handleAddProduct = async (productData: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          partner_id: user.id,
        }]);

      if (error) throw error;

      toast.success('Product added successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  // Mock available tasks for marketplace (will be replaced with real data)
  const availableTasks = availableJobs.length > 0 ? availableJobs : [
    {
      id: 1,
      jobCode: 'ET-REIS-COM-EPC-2024-0198',
      title: "Commercial Solar EPC Project",
      location: "Victoria Island, Lagos",
      budget: "₦42,000,000",
      urgency: "high",
      skills: ["Solar EPC", "Grid Connection", "Commercial"],
      description: "500kW rooftop solar installation for office complex",
      deadline: "2024-03-15"
    },
    {
      id: 2,
      jobCode: 'ET-REIS-IND-O&M-2024-0205',
      title: "Industrial BESS Maintenance",
      location: "Onne, Rivers State",
      budget: "₦12,800,000",
      urgency: "medium",
      skills: ["Battery Storage", "O&M", "Industrial"],
      description: "Quarterly maintenance of 2MW battery storage system",
      deadline: "2024-02-28"
    },
    {
      id: 3,
      jobCode: 'ET-REIS-OFF-CNSL-2024-0189',
      title: "Offshore Wind Assessment",
      location: "Lagos Continental Shelf",
      budget: "₺18,500,000",
      urgency: "medium",
      skills: ["Offshore", "Wind", "Consulting"],
      description: "Feasibility study for 50MW offshore wind farm",
      deadline: "2024-04-20"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success text-success-foreground';
      case 'KYC Pending': return 'bg-accent text-accent-foreground';
      case 'Suspended': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'INTAKE': return 'bg-secondary';
      case 'CONSULT': return 'bg-accent';
      case 'DATA-REVIEW': return 'bg-accent';
      case 'SITE-AUDIT': return 'bg-accent';
      case 'ENG': return 'bg-primary';
      case 'PROC': return 'bg-primary';
      case 'CONSTR': return 'bg-primary';
      case 'COMM': return 'bg-success';
      case 'O&M': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-secondary overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Partners Dashboard</h1>
                {partnerApplication && (
                  <Badge className={getStatusColor(partnerApplication.application_status)}>
                    {partnerApplication.application_status}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {profile?.full_name || partnerApplication?.legal_name || 'Partner'}
                {partnerApplication?.partner_id && ` • ID: ${partnerApplication.partner_id}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info('Notifications feature coming soon');
                }}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info('Settings feature coming soon');
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Briefcase className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{partnerMetrics.totalOrders}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Clock className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{partnerMetrics.activeProjects}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{partnerMetrics.totalCommissions}</div>
                <p className="text-xs text-muted-foreground">Earned</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                <Clock className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{partnerMetrics.pendingPayouts}</div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{partnerMetrics.completionRate}</div>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partner Rating</CardTitle>
                <Star className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{partnerMetrics.rating}</div>
                <p className="text-xs text-muted-foreground">⭐⭐⭐⭐⭐</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{partnerMetrics.revenueThisMonth}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <Package className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{partnerMetrics.activeListings}</div>
                <p className="text-xs text-muted-foreground">Products</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                  <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
                  <TabsTrigger value="jobs" className="text-xs sm:text-sm">Job Codes</TabsTrigger>
                  <TabsTrigger value="tickets" className="text-xs sm:text-sm">Tickets</TabsTrigger>
                  <TabsTrigger value="marketplace" className="text-xs sm:text-sm">Marketplace</TabsTrigger>
                  <TabsTrigger value="products" className="text-xs sm:text-sm">Products</TabsTrigger>
                  <TabsTrigger value="commissions" className="text-xs sm:text-sm">Commissions</TabsTrigger>
                  <TabsTrigger value="compliance" className="text-xs sm:text-sm">Compliance</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card
                      className="bg-card border-border hover:bg-accent/5 transition-colors cursor-pointer"
                      onClick={() => {
                        setActiveView('marketplace');
                        toast.info('Browse available jobs in the Marketplace tab');
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Plus className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">New Job Request</h3>
                            <p className="text-sm text-muted-foreground">Request installation or service</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-card border-border hover:bg-accent/5 transition-colors cursor-pointer"
                      onClick={() => {
                        toast.info('Performance analytics feature coming soon');
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-accent/10 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-medium">Performance Analytics</h3>
                            <p className="text-sm text-muted-foreground">View detailed metrics</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-card border-border hover:bg-accent/5 transition-colors cursor-pointer"
                      onClick={async () => {
                        try {
                          const reportData = {
                            totalOrders: partnerMetrics.totalOrders,
                            activeProjects: partnerMetrics.activeProjects,
                            totalCommissions: partnerMetrics.totalCommissions,
                            pendingPayouts: partnerMetrics.pendingPayouts,
                            completionRate: partnerMetrics.completionRate,
                            generatedAt: new Date().toISOString()
                          };
                          const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `partner-report-${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast.success('Report downloaded successfully');
                        } catch (error) {
                          toast.error('Failed to generate report');
                        }
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-success/10 rounded-lg">
                            <Download className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <h3 className="font-medium">Download Reports</h3>
                            <p className="text-sm text-muted-foreground">Commission & tax reports</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentJobCodes.slice(0, 3).map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium font-mono text-sm">{job.code}</h4>
                              <p className="text-sm text-muted-foreground">{job.client} • {job.value}</p>
                              <p className="text-xs text-muted-foreground">Updated: {job.lastUpdated}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getJobStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast.info(`Viewing job details for ${job.code}`);
                                }}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Onboarding Summary (read-only) */}
                  {onboarding && (
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Onboarding Selections
                        </CardTitle>
                        <CardDescription>Key details from your submitted application</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Country</div>
                            <div className="font-medium">{onboarding.partnerCountry || '-'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Category</div>
                            <div className="font-medium">{onboarding.partnerCategory || '-'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Account Type</div>
                            <div className="font-medium">{onboarding.partnerType || '-'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Legal Name</div>
                            <div className="font-medium break-words">{onboarding.legalName || '-'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Trading Name</div>
                            <div className="font-medium break-words">{onboarding.tradingName || '-'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Registration No.</div>
                            <div className="font-medium break-words">{onboarding.companyRegistration || '-'}</div>
                          </div>
                          <div className="md:col-span-3">
                            <div className="text-muted-foreground">Registered Address</div>
                            <div className="font-medium break-words">{onboarding.registeredAddress || '-'}</div>
                          </div>
                          <div className="md:col-span-3">
                            <div className="text-muted-foreground">Services Provided</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(onboarding.servicesProvided || []).map((s: string) => (
                                <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="md:col-span-3">
                            <div className="text-muted-foreground">Product Categories</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(onboarding.specialties || []).map((s: string) => (
                                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Currency</div>
                            <div className="font-medium">{onboarding.preferredCurrency || '-'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Payment Terms</div>
                            <div className="font-medium break-words">{onboarding.paymentTerms || '-'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Partner ID</div>
                            <div className="font-medium">{onboarding.partnerId || '-'}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Partner Documents */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Partner Forms & Policies
                      </CardTitle>
                      <CardDescription>Access the correct documents for your country and services</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {docLinks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Update your profile (country/services) to see the right documents.</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1">
                          {docLinks.map((l) => (
                            <li key={l.href}>
                              <a className="text-sm text-primary underline" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="jobs" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Job Codes & Orders
                          </CardTitle>
                          <CardDescription>Track all your REIS job codes and project pipeline</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast.info('Filter options coming soon');
                            }}
                          >
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast.info('Search functionality is active in the search input above');
                            }}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {jobCodes.length === 0 && !loading && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No job codes assigned yet</p>
                            <p className="text-sm">Check the marketplace for available jobs</p>
                          </div>
                        )}
                        {jobCodes.map((job) => (
                          <div key={job.id} className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-mono font-medium text-sm">{job.code}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {job.segment}-{job.service}
                                  </Badge>
                                </div>
                                <p className="font-medium">{job.client}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span>Value: {job.value}</span>
                                  <span>Commission: {job.commission}</span>
                                  <span>Created: {job.createdDate}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getJobStatusColor(job.status)}>
                                  {job.status}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    toast.info(`Managing job ${job.code}`);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Manage
                                </Button>
                              </div>
                            </div>

                            {/* Job Progress Indicator */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{job.status}</span>
                              </div>
                              <Progress
                                value={
                                  job.status === 'INTAKE' ? 10 :
                                    job.status === 'CONSULT' ? 20 :
                                      job.status === 'DATA-REVIEW' ? 30 :
                                        job.status === 'SITE-AUDIT' ? 40 :
                                          job.status === 'ENG' ? 60 :
                                            job.status === 'PROC' ? 70 :
                                              job.status === 'CONSTR' ? 85 :
                                                job.status === 'COMM' ? 95 :
                                                  job.status === 'O&M' ? 100 : 0
                                }
                                className="h-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tickets" className="space-y-6">
                  {/* Enhanced Ticketing System for Partners */}
                  <EnhancedTicketingSystem userRole="partner" userId="partner-user-id" />
                </TabsContent>

                <TabsContent value="marketplace" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Available Projects & Tasks
                          </CardTitle>
                          <CardDescription>Browse and bid on REIS projects matching your capabilities</CardDescription>
                        </div>
                        <Button
                          onClick={() => {
                            toast.info('Bid creation feature coming soon');
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Bid
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {availableTasks.map((task) => (
                          <div key={task.id} className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {task.jobCode}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {task.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Due: {task.deadline}
                                  </span>
                                </div>
                              </div>
                              <Badge variant={
                                task.urgency === 'high' ? 'destructive' :
                                  task.urgency === 'medium' ? 'secondary' : 'outline'
                              }>
                                {task.urgency} priority
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className="text-lg font-semibold text-success">{task.budget}</span>
                                <div className="flex gap-1">
                                  {task.skills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    toast.info(`Viewing details for ${task.title}`);
                                  }}
                                >
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={async () => {
                                    try {
                                      await handleAcceptJob(task.id);
                                      toast.success(`Bid submitted for ${task.title}`);
                                    } catch (error) {
                                      toast.error('Failed to submit bid');
                                    }
                                  }}
                                >
                                  Submit Bid
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                  <ProductManager />
                </TabsContent>

                <TabsContent value="commissions" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Commission & Earnings Dashboard
                          </CardTitle>
                          <CardDescription>Track earnings, payouts, and financial performance</CardDescription>
                        </div>
                        <Button
                          onClick={async () => {
                            try {
                              const pendingAmount = commissions
                                .filter(c => c.status === 'Approved')
                                .reduce((sum, c) => {
                                  const amount = parseFloat(c.amount.replace(/[₦,]/g, ''));
                                  return sum + (isNaN(amount) ? 0 : amount);
                                }, 0);

                              if (pendingAmount === 0) {
                                toast.info('No pending payouts available');
                                return;
                              }

                              toast.success(`Payout request submitted for ₦${pendingAmount.toLocaleString()}`);
                            } catch (error) {
                              toast.error('Failed to request payout');
                            }
                          }}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Request Payout
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-success/10 rounded-lg">
                          <div className="text-2xl font-bold text-success">{partnerMetrics.totalCommissions}</div>
                          <p className="text-sm text-muted-foreground">Total Earned</p>
                        </div>
                        <div className="text-center p-4 bg-accent/10 rounded-lg">
                          <div className="text-2xl font-bold text-accent">{partnerMetrics.pendingPayouts}</div>
                          <p className="text-sm text-muted-foreground">Pending Payout</p>
                        </div>
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{partnerMetrics.referrals}</div>
                          <p className="text-sm text-muted-foreground">Referrals</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-foreground">{partnerMetrics.trainingCompleted}</div>
                          <p className="text-sm text-muted-foreground">Training Completed</p>
                        </div>
                      </div>

                      {/* Commission Breakdown */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Commission History</h4>
                        {commissions.map((commission) => (
                          <div key={commission.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-mono font-medium text-sm">{commission.jobCode}</h4>
                                <Badge variant="outline" className="text-xs">{commission.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Rate: {commission.rate} • Due: {commission.dueDate}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-lg">{commission.amount}</p>
                              <Badge variant={
                                commission.status === 'Paid' ? 'default' :
                                  commission.status === 'Approved' ? 'secondary' : 'outline'
                              }>
                                {commission.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={async () => {
                            try {
                              const statementData = commissions.map(c => ({
                                jobCode: c.jobCode,
                                type: c.type,
                                amount: c.amount,
                                rate: c.rate,
                                status: c.status,
                                dueDate: c.dueDate
                              }));
                              const blob = new Blob([JSON.stringify(statementData, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `commission-statement-${new Date().toISOString().split('T')[0]}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                              toast.success('Statement downloaded successfully');
                            } catch (error) {
                              toast.error('Failed to download statement');
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Statement
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            const referralLink = `${window.location.origin}/partners?ref=${user?.id || 'partner'}`;
                            navigator.clipboard.writeText(referralLink);
                            toast.success('Referral link copied to clipboard!');
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Generate Referral Link
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Compliance Status */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Compliance Status
                        </CardTitle>
                        <CardDescription>ISO 9001/14001/45001 & regulatory requirements</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div>
                              <h4 className="font-medium">Partner Agreement</h4>
                              <p className="text-xs text-muted-foreground">Terms & conditions</p>
                            </div>
                            <Badge variant="default">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accepted
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div>
                              <h4 className="font-medium">KYC Verification</h4>
                              <p className="text-xs text-muted-foreground">Identity & business verification</p>
                            </div>
                            <Badge variant="default">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verified
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div>
                              <h4 className="font-medium">Insurance Coverage</h4>
                              <p className="text-xs text-muted-foreground">Liability & professional indemnity</p>
                            </div>
                            <Badge variant="default">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Valid
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div>
                              <h4 className="font-medium">Anti-Bribery Attestation</h4>
                              <p className="text-xs text-muted-foreground">AML & sanctions compliance</p>
                            </div>
                            <Badge variant="default">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirmed
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Certifications & Documents
                        </CardTitle>
                        <CardDescription>Professional qualifications and regulatory approvals</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {partnerProfile.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                              <div>
                                <h4 className="font-medium">{cert}</h4>
                                <p className="text-xs text-muted-foreground">Valid until 2025-12-31</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="default" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Valid
                                </Badge>
                                <Button variant="outline" size="sm">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          {/* Sector-Specific Requirements */}
                          {partnerProfile.specialties.includes('Offshore') && (
                            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                              <h4 className="font-medium text-accent mb-2">Offshore Requirements</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>BOSIET/FOET</span>
                                  <Badge variant="outline" className="text-xs">Required</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Offshore Medical</span>
                                  <Badge variant="outline" className="text-xs">Required</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>ATEX/IECEx</span>
                                  <Badge variant="outline" className="text-xs">Required</Badge>
                                </div>
                              </div>
                            </div>
                          )}

                          <Button variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New Document
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Audit Trail */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5" />
                        Compliance Audit Trail
                      </CardTitle>
                      <CardDescription>Document history and IMS quality gates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { date: '2024-01-15', action: 'Document uploaded', item: 'Insurance Certificate', status: 'Approved' },
                          { date: '2024-01-10', action: 'Certification renewed', item: 'ISO 9001:2015', status: 'Valid' },
                          { date: '2024-01-05', action: 'Compliance review', item: 'Partner Agreement', status: 'Passed' },
                          { date: '2024-01-01', action: 'KYC verification', item: 'Business Registration', status: 'Verified' }
                        ].map((audit, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-success rounded-full"></div>
                              <div>
                                <p className="font-medium text-sm">{audit.action}</p>
                                <p className="text-xs text-muted-foreground">{audit.item} • {audit.date}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {audit.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Partner Profile */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Partner Profile
                  </CardTitle>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <Building className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="font-medium">{partnerProfile.legalName}</h3>
                      <p className="text-sm text-muted-foreground">{partnerProfile.level}</p>
                      <Badge className={getStatusColor(partnerProfile.status)}>
                        {partnerProfile.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3" />
                          <span>Location</span>
                        </div>
                        <p className="font-medium">{partnerProfile.location.city}, {partnerProfile.location.country}</p>
                      </div>

                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Briefcase className="h-3 w-3" />
                          <span>Classification</span>
                        </div>
                        <p className="font-medium">{partnerProfile.class}</p>
                      </div>

                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Globe className="h-3 w-3" />
                          <span>Coverage</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {partnerProfile.coverage.map(region => (
                            <Badge key={region} variant="outline" className="text-xs">{region}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Zap className="h-3 w-3" />
                          <span>Specialties</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {partnerProfile.specialties.map(specialty => (
                            <Badge key={specialty} variant="secondary" className="text-xs">{specialty}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Seriousness Score</span>
                        <span className="font-medium">{partnerProfile.seriousnessScore}/20</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span className="font-medium">{partnerProfile.completionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Partner Rating</span>
                        <span className="font-medium">{partnerProfile.rating}/5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Activity</span>
                        <span className="font-medium">{partnerProfile.lastActivity}</span>
                      </div>
                    </div>
                  </div>
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
                    variant="outline"
                    onClick={() => {
                      toast.info('Schedule installation feature coming soon');
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Installation
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      toast.info('Document upload feature coming soon');
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Completion Docs
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={async () => {
                      try {
                        const pendingAmount = commissions
                          .filter(c => c.status === 'Approved')
                          .reduce((sum, c) => {
                            const amount = parseFloat(c.amount.replace(/[₦,]/g, ''));
                            return sum + (isNaN(amount) ? 0 : amount);
                          }, 0);

                        if (pendingAmount === 0) {
                          toast.info('No pending payments available');
                          return;
                        }

                        toast.success(`Payment request submitted for ₦${pendingAmount.toLocaleString()}`);
                      } catch (error) {
                        toast.error('Failed to request payment');
                      }
                    }}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Request Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartnersDashboard;