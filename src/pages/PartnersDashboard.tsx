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
  Wrench
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

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
  const [activeView, setActiveView] = useState('dashboard');
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile>({
    id: 'PTNR-2024-1234',
    status: 'Active',
    type: 'company',
    legalName: 'ABC Energy Solutions Ltd',
    tradingName: 'ABC Energy',
    class: 'Renewable Energy Installation Company',
    specialties: ['Commercial', 'Industrial', 'Solar Installation'],
    location: {
      city: 'Lagos',
      state: 'Lagos State', 
      country: 'Nigeria'
    },
    coverage: ['Nigeria', 'ECOWAS'],
    servicesProvided: ['Installation services', 'Commissioning / Testing', 'O&M / Warranty service'],
    servicesNeeded: ['Professional training', 'Access to product catalog'],
    seriousnessScore: 18,
    completionRate: 96,
    rating: 4.8,
    level: 'Gold Partner',
    certifications: ['ISO 9001:2015', 'COREN Registration', 'NICEIC Approved'],
    lastActivity: '2024-01-15'
  });

  const partnerMetrics = {
    totalOrders: 24,
    activeProjects: 8,
    totalCommissions: "₦7,380,000",
    pendingPayouts: "₦1,296,000",
    completionRate: "96%",
    rating: 4.8,
    revenueThisMonth: "₦2,450,000",
    activeListings: 12,
    referrals: 8,
    trainingCompleted: 5
  };

  const recentJobCodes: JobCode[] = [
    { 
      id: '1', 
      code: 'ET-REIS-COM-EPC-2024-0156', 
      service: 'EPC', 
      segment: 'COM', 
      status: 'ENG', 
      value: '₦15,750,000', 
      commission: '₦787,500', 
      client: 'TechCorp Manufacturing Ltd', 
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-15'
    },
    { 
      id: '2', 
      code: 'ET-REIS-IND-DES-2024-0089', 
      service: 'DES', 
      segment: 'IND', 
      status: 'PROC', 
      value: '₦28,500,000', 
      commission: '₦1,425,000', 
      client: 'Delta Steel Industries', 
      createdDate: '2024-01-08',
      lastUpdated: '2024-01-14'
    },
    { 
      id: '3', 
      code: 'ET-REIS-RES-AUD-2024-0234', 
      service: 'AUD', 
      segment: 'RES', 
      status: 'COMM', 
      value: '₦8,200,000', 
      commission: '₦410,000', 
      client: 'Residential Estate Project', 
      createdDate: '2024-01-05',
      lastUpdated: '2024-01-12'
    },
  ];

  const commissions: Commission[] = [
    { id: '1', jobCode: 'ET-REIS-COM-EPC-2024-0156', type: 'Installation', amount: '₦787,500', rate: '5%', status: 'Approved', dueDate: '2024-01-30' },
    { id: '2', jobCode: 'ET-REIS-IND-DES-2024-0089', type: 'Installation', amount: '₦1,425,000', rate: '5%', status: 'Pending', dueDate: '2024-02-15' },
    { id: '3', jobCode: 'ET-REIS-RES-AUD-2024-0234', type: 'Installation', amount: '₦410,000', rate: '5%', status: 'Paid', dueDate: '2024-01-25' },
  ];

  const availableTasks = [
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
      <div className="min-h-screen bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">Partners Dashboard</h1>
                <Badge className={getStatusColor(partnerProfile.status)}>
                  {partnerProfile.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {partnerProfile.legalName} • {partnerProfile.level} • ID: {partnerProfile.id}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Briefcase className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{partnerMetrics.totalOrders}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Clock className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{partnerMetrics.activeProjects}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{partnerMetrics.totalCommissions}</div>
                <p className="text-xs text-muted-foreground">Earned</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                <Clock className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{partnerMetrics.pendingPayouts}</div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{partnerMetrics.completionRate}</div>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partner Rating</CardTitle>
                <Star className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{partnerMetrics.rating}</div>
                <p className="text-xs text-muted-foreground">⭐⭐⭐⭐⭐</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{partnerMetrics.revenueThisMonth}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <Package className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{partnerMetrics.activeListings}</div>
                <p className="text-xs text-muted-foreground">Products</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="jobs">Job Codes</TabsTrigger>
                  <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="commissions">Commissions</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-card border-border hover:bg-accent/5 transition-colors cursor-pointer">
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

                    <Card className="bg-card border-border hover:bg-accent/5 transition-colors cursor-pointer">
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

                    <Card className="bg-card border-border hover:bg-accent/5 transition-colors cursor-pointer">
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
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
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
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button variant="outline" size="sm">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentJobCodes.map((job) => (
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
                                <Button variant="outline" size="sm">
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
                        <Button>
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
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                                <Button size="sm" variant="default">
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
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Product Listings & Sales
                          </CardTitle>
                          <CardDescription>Manage your REIS product catalog and sales performance</CardDescription>
                        </div>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {partnerProfile.servicesProvided.includes('Product sales') ? (
                        <div className="space-y-4">
                          {/* Product Categories */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { category: 'Solar Panels', count: 8, revenue: '₦2,400,000' },
                              { category: 'Inverters', count: 5, revenue: '₦1,800,000' },
                              { category: 'Batteries', count: 3, revenue: '₦900,000' },
                              { category: 'Accessories', count: 12, revenue: '₦650,000' }
                            ].map((item) => (
                              <Card key={item.category} className="p-4">
                                <div className="text-center">
                                  <h4 className="font-medium">{item.category}</h4>
                                  <p className="text-2xl font-bold text-primary">{item.count}</p>
                                  <p className="text-xs text-muted-foreground">Products</p>
                                  <p className="text-sm text-success mt-1">{item.revenue}</p>
                                </div>
                              </Card>
                            ))}
                          </div>

                          {/* Recent Sales */}
                          <div className="space-y-3">
                            <h4 className="font-medium">Recent Sales</h4>
                            {[
                              { product: '500W Monocrystalline Solar Panel', qty: 24, amount: '₦720,000', date: '2024-01-14' },
                              { product: '5kW Hybrid Inverter', qty: 2, amount: '₦480,000', date: '2024-01-12' },
                              { product: '10kWh Lithium Battery', qty: 1, amount: '₦350,000', date: '2024-01-10' }
                            ].map((sale, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium">{sale.product}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {sale.qty} • {sale.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-success">{sale.amount}</p>
                                  <Badge variant="outline" className="text-xs">Paid</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Product Sales Not Enabled</h3>
                          <p className="text-muted-foreground mb-4">
                            Enable product sales in your partner profile to start listing products
                          </p>
                          <Button variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Update Profile
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
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
                        <Button>
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
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download Statement
                        </Button>
                        <Button variant="outline" className="w-full">
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
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Installation
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Completion Docs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
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