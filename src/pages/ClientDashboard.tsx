import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Zap, 
  Leaf, 
  FileText, 
  Bell, 
  TrendingUp, 
  Battery,
  Sun,
  Wind,
  Download,
  Plus,
  User,
  Settings,
  Home,
  Building,
  Factory,
  Target,
  ClipboardList,
  DollarSign,
  TreePine,
  Activity,
  Wrench,
  MessageCircle,
  Calculator,
  Award,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Layout from '@/components/layout/Layout';
import MetricsWidget from '@/components/crm/MetricsWidget';
import JobCodeGenerator, { Segment, Service } from '@/components/crm/JobCodeGenerator';
import TicketingSystem, { TicketData } from '@/components/crm/TicketingSystem';
import ServiceCatalog from '@/components/crm/ServiceCatalog';
import DocumentManager from '@/components/crm/DocumentManager';
import QuestionnaireFlow from '@/components/crm/QuestionnaireFlow';

// Mock user role - in real app this would come from auth context
type UserRole = 'CLIENT' | 'PROSPECT' | 'SDR' | 'SALES' | 'ENGINEER' | 'PM' | 'FINANCE' | 'OM';

const ClientDashboard = () => {
  const [userRole] = useState<UserRole>('CLIENT'); // Mock role
  const [currentView, setCurrentView] = useState<'overview' | 'questionnaire' | 'services' | 'documents'>('overview');
  const [selectedSegment, setSelectedSegment] = useState<Segment>('RES');
  const [seriousnessScore, setSeriousnessScore] = useState(8);

  // Mock data - in real app this would come from APIs
  const mockJobData = {
    jobCode: 'ET-REIS-RES-AUD-2024-0123',
    segment: 'RES' as Segment,
    service: 'AUD' as Service,
    year: 2024,
    number: 123,
    created: new Date('2024-01-15'),
    status: 'ACTIVE' as const,
    seriousnessScore: seriousnessScore
  };

  const mockMetricsData = {
    co2Saved: 12.5,
    carbonCreditsEarned: 25,
    carbonCreditsValue: 1250,
    energyGeneration: {
      daily: 45,
      monthly: 1350,
      yearly: 16200
    },
    billSavings: 2800,
    reisScore: 87,
    maintenanceAlerts: 1,
    lcoeTracker: 0.045,
    gridEquivalent: 0.12,
    isLiveSystem: true
  };

  const mockTickets: TicketData[] = [
    {
      ticketCode: 'TKT-INTAKE-ET-REIS-RES-AUD-2024-0123-01',
      stage: 'INTAKE',
      status: 'COMPLETED',
      title: 'Initial Customer Intake',
      description: 'Customer inquiry received and basic information collected',
      created: new Date('2024-01-15'),
      updated: new Date('2024-01-15'),
      priority: 'MEDIUM',
      notes: ['Customer interested in residential solar', 'Budget range: $25k-50k'],
      attachments: []
    },
    {
      ticketCode: 'TKT-DATA-REVIEW-ET-REIS-RES-AUD-2024-0123-02',
      stage: 'DATA-REVIEW',
      status: 'IN_PROGRESS',
      title: 'Engineering Data Review',
      description: 'Review uploaded bills and property information',
      assignee: 'Sarah Johnson (Sales Engineer)',
      created: new Date('2024-01-16'),
      updated: new Date('2024-01-18'),
      dueDate: new Date('2024-01-22'),
      priority: 'HIGH',
      notes: ['Bills received for 18 months', 'Property specs look good for solar'],
      attachments: ['utility-bills.pdf', 'property-survey.pdf']
    }
  ];

  const mockDocuments = [
    {
      id: '1',
      name: 'Utility Bills - 2023.pdf',
      type: 'bill' as const,
      category: 'upload' as const,
      size: 2450000,
      uploadDate: new Date('2024-01-16'),
      uploadedBy: 'John Doe',
      jobCode: mockJobData.jobCode,
      status: 'approved' as const
    },
    {
      id: '2',
      name: 'Property Survey.pdf',
      type: 'other' as const,
      category: 'upload' as const,
      size: 1200000,
      uploadDate: new Date('2024-01-16'),
      uploadedBy: 'John Doe',
      jobCode: mockJobData.jobCode,
      status: 'pending' as const
    }
  ];

  const energyData = {
    totalGeneration: "2,847 kWh",
    co2Savings: "1.2 tons",
    costSavings: "$342",
    efficiency: "94.2%"
  };

  // Enhanced metrics data for comprehensive dashboard
  const co2CalculatorData = {
    monthlyKwh: 1350,
    systemType: 'solar',
    monthlyData: Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      co2Saved: 115 + (Math.random() * 20 - 10),
      cumulative: (i + 1) * 115
    }))
  };

  const carbonCreditData = {
    annualCredits: 12.5,
    creditValue: 312.5,
    pricePerCredit: 25,
    tenYearValue: 3600,
    yearlyProjection: Array.from({ length: 5 }, (_, i) => ({
      year: 2024 + i,
      credits: 12.5 * (1 - i * 0.01),
      value: 312.5 * (1 + i * 0.03) * (1 - i * 0.01)
    }))
  };

  const billSavingsData = {
    monthlyLoad: 1350,
    traditional: 607.5,
    reis: 162,
    monthlySavings: 445.5,
    annualSavings: 5346,
    roi: 18.2,
    yearlyData: Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      traditional: 607.5 * (1 + Math.random() * 0.1),
      reis: 162,
      savings: 445.5 * (1 + Math.random() * 0.1)
    }))
  };

  const energyGenerationData = {
    daily: 45.2,
    monthly: 1356,
    annual: 16272,
    efficiency: 91.5,
    monthlyData: Array.from({ length: 12 }, (_, i) => {
      const seasonalFactor = 0.8 + 0.4 * Math.sin((i - 2) * Math.PI / 6);
      return {
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        generation: 1356 * seasonalFactor,
        target: 1400,
        efficiency: 91.5 * (0.95 + Math.random() * 0.1)
      };
    }),
    hourlyData: Array.from({ length: 24 }, (_, hour) => {
      let generation = 0;
      if (hour >= 6 && hour <= 18) {
        const peakHour = 12;
        const distance = Math.abs(hour - peakHour);
        generation = 5.0 * Math.max(0, 1 - (distance / 6));
      }
      return {
        hour: `${hour}:00`,
        generation: generation.toFixed(1)
      };
    })
  };

  const environmentalEquivalents = {
    annualCO2: 1248,
    trees: 57,
    cars: 0.3,
    homes: 0.17,
    flights: 14,
    equivalents: [
      { icon: TreePine, value: 57, unit: "trees planted", color: "success" },
      { icon: Home, value: 0.17, unit: "homes powered", color: "primary" },
      { icon: Factory, value: 152, unit: "coal plant hours avoided", color: "warning" }
    ]
  };

  const realTimePerformance = {
    currentPower: 4.2,
    dailyGeneration: 42.3,
    systemStatus: 'optimal',
    uptime: 99.7,
    lastUpdate: new Date(),
    performanceData: Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      power: i >= 6 && i <= 18 ? 2 + Math.random() * 3 : 0,
      target: i >= 6 && i <= 18 ? 4.5 : 0
    }))
  };

  const maintenanceAlerts = [
    { id: 1, type: 'warning', priority: 'medium', title: 'Scheduled Maintenance Due', description: 'Panel cleaning recommended', dueDate: new Date(Date.now() + 86400000 * 3) },
    { id: 2, type: 'info', priority: 'low', title: 'Performance Report Available', description: 'Monthly report generated', dueDate: null },
    { id: 3, type: 'success', priority: 'low', title: 'System Update Complete', description: 'Firmware updated successfully', dueDate: null }
  ];

  const userTickets = [
    { id: 1, subject: 'System Performance Question', status: 'open', priority: 'medium', created: new Date(Date.now() - 86400000 * 2), lastUpdate: new Date(Date.now() - 86400000) },
    { id: 2, subject: 'Billing Inquiry', status: 'closed', priority: 'low', created: new Date(Date.now() - 86400000 * 7), lastUpdate: new Date(Date.now() - 86400000 * 5) },
    { id: 3, subject: 'Maintenance Scheduling', status: 'in_progress', priority: 'high', created: new Date(Date.now() - 86400000 * 1), lastUpdate: new Date() }
  ];

  const alerts = [
    { id: 1, type: "warning", message: "System maintenance scheduled for tomorrow", time: "2 hours ago" },
    { id: 2, type: "info", message: "Monthly report available for download", time: "1 day ago" },
    { id: 3, type: "success", message: "New efficiency record achieved!", time: "3 days ago" }
  ];

  const handleServiceSelect = (service: Service) => {
    console.log('Service selected:', service);
    // In real app: create new job, update job code, redirect to questionnaire
    setCurrentView('questionnaire');
  };

  const handleQuestionnaireComplete = (data: any) => {
    console.log('Questionnaire completed:', data);
    // In real app: save data, create tickets, update seriousness score
    setCurrentView('overview');
  };

  const handleUpdateScore = (points: number) => {
    setSeriousnessScore(prev => Math.min(20, prev + points));
  };

  const handleTicketUpdate = (ticketCode: string, updates: Partial<TicketData>) => {
    console.log('Updating ticket:', ticketCode, updates);
    // In real app: API call to update ticket
  };

  const handleDocumentUpload = (files: FileList) => {
    console.log('Uploading files:', Array.from(files));
    // In real app: upload to storage, create document records
  };

  const handleDocumentAction = (documentId: string, action: 'download' | 'delete' | 'view') => {
    console.log(`Document ${action}:`, documentId);
    // In real app: appropriate API calls
  };

  const handleJobCodeCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    // In real app: show toast notification
  };

  const getSegmentIcon = (segment: Segment) => {
    switch (segment) {
      case 'RES': return <Home className="h-5 w-5" />;
      case 'COM': return <Building className="h-5 w-5" />;
      case 'IND': return <Factory className="h-5 w-5" />;
    }
  };

  const getSegmentLabel = (segment: Segment) => {
    switch (segment) {
      case 'RES': return 'Residential';
      case 'COM': return 'Commercial';  
      case 'IND': return 'Industrial';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      'CLIENT': 'Customer',
      'PROSPECT': 'Prospect', 
      'SDR': 'Sales Development Rep',
      'SALES': 'Sales Engineer',
      'ENGINEER': 'Engineering',
      'PM': 'Project Manager',
      'FINANCE': 'Finance',
      'OM': 'Operations & Maintenance'
    };
    return labels[role];
  };

  // Widget Components
  const CO2SavingsWidget = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-success" />
          CO₂ Savings Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">115 kg</div>
              <div className="text-sm text-muted-foreground">Monthly CO₂ saved</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">1,380 kg</div>
              <div className="text-sm text-muted-foreground">Annual CO₂ saved</div>
            </div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={co2CalculatorData.monthlyData.slice(-6)}>
                <Line type="monotone" dataKey="co2Saved" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)} kg`, 'CO₂ Saved']} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CarbonCreditWidget = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TreePine className="h-5 w-5 text-success" />
          Carbon Credit Estimator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="text-xl font-bold text-success">{carbonCreditData.annualCredits}</div>
              <div className="text-xs text-muted-foreground">Credits/year</div>
            </div>
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="text-xl font-bold text-success">${carbonCreditData.creditValue}</div>
              <div className="text-xs text-muted-foreground">Annual value</div>
            </div>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-lg font-bold text-primary">${carbonCreditData.tenYearValue}</div>
            <div className="text-xs text-muted-foreground">10-year projection</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EnergyGenerationWidget = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Energy Generation Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-accent/10 rounded">
              <div className="text-lg font-bold text-accent">{energyGenerationData.daily} kWh</div>
              <div className="text-xs text-muted-foreground">Daily</div>
            </div>
            <div className="text-center p-2 bg-accent/10 rounded">
              <div className="text-lg font-bold text-accent">{energyGenerationData.monthly}</div>
              <div className="text-xs text-muted-foreground">Monthly</div>
            </div>
            <div className="text-center p-2 bg-accent/10 rounded">
              <div className="text-lg font-bold text-accent">{energyGenerationData.efficiency}%</div>
              <div className="text-xs text-muted-foreground">Efficiency</div>
            </div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyGenerationData.monthlyData.slice(-6)}>
                <Area type="monotone" dataKey="generation" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                <Tooltip formatter={(value: any) => [`${value.toFixed(0)} kWh`, 'Generation']} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BillSavingsWidget = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Bill Savings Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-xl font-bold text-primary">₦{billSavingsData.monthlySavings.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Monthly savings</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-xl font-bold text-primary">{billSavingsData.roi}%</div>
              <div className="text-xs text-muted-foreground">ROI</div>
            </div>
          </div>
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <div className="text-lg font-bold text-success">₦{billSavingsData.annualSavings.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">Annual savings</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EnvironmentalEquivalentsWidget = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TreePine className="h-5 w-5 text-success" />
          Environmental Equivalents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {environmentalEquivalents.equivalents.map((item, index) => (
            <div key={index} className={`text-center p-2 bg-${item.color}/10 rounded-lg`}>
              <item.icon className={`h-4 w-4 text-${item.color} mx-auto mb-1`} />
              <div className={`text-sm font-bold text-${item.color}`}>{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.unit}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const REISScoreWidget = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          REIS Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-4xl font-bold text-primary">{mockMetricsData.reisScore}</div>
            <div className="text-sm text-muted-foreground">Excellent</div>
          </div>
          <Progress value={mockMetricsData.reisScore} className="h-3" />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold">Efficiency</div>
              <div className="text-muted-foreground">94.2%</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Reliability</div>
              <div className="text-muted-foreground">99.1%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RealTimePerformanceWidget = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent" />
          Real-time Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-accent/10 rounded-lg">
              <div className="text-xl font-bold text-accent">{realTimePerformance.currentPower} kW</div>
              <div className="text-xs text-muted-foreground">Current power</div>
            </div>
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="text-xl font-bold text-success">{realTimePerformance.uptime}%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={realTimePerformance.performanceData.slice(-12)}>
                <Line type="monotone" dataKey="power" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)} kW`, 'Power']} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MaintenanceAlertsWidget = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-warning" />
          Maintenance & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {maintenanceAlerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                alert.type === 'warning' ? 'bg-warning' : 
                alert.type === 'success' ? 'bg-success' : 'bg-primary'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{alert.title}</p>
                <p className="text-xs text-muted-foreground truncate">{alert.description}</p>
                {alert.dueDate && (
                  <p className="text-xs text-warning">Due: {alert.dueDate.toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const UserFeedbackWidget = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          User Feedback/Ticketing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-primary/10 rounded">
              <div className="text-lg font-bold text-primary">{userTickets.filter(t => t.status === 'open').length}</div>
              <div className="text-xs text-muted-foreground">Open</div>
            </div>
            <div className="p-2 bg-warning/10 rounded">
              <div className="text-lg font-bold text-warning">{userTickets.filter(t => t.status === 'in_progress').length}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="p-2 bg-success/10 rounded">
              <div className="text-lg font-bold text-success">{userTickets.filter(t => t.status === 'closed').length}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
          </div>
          <div className="space-y-2">
            {userTickets.slice(0, 2).map((ticket) => (
              <div key={ticket.id} className="p-2 rounded bg-muted/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{ticket.subject}</p>
                  <Badge variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                    {ticket.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{ticket.status}</p>
              </div>
            ))}
          </div>
          <Button size="sm" className="w-full">Create Ticket</Button>
        </div>
      </CardContent>
    </Card>
  );

  // Special view for questionnaire
  if (currentView === 'questionnaire') {
    return (
      <Layout>
        <div className="min-h-screen bg-secondary py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('overview')}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <QuestionnaireFlow
              segment={selectedSegment}
              onComplete={handleQuestionnaireComplete}
              onUpdateScore={handleUpdateScore}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-secondary overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Eagle & Thistle CRM</h1>
                <Badge variant="outline" className="px-3 py-1 text-xs sm:text-sm">
                  {getRoleLabel(userRole)}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Comprehensive renewable energy project management
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('services')}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                  <span className="sm:hidden">Home</span>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Target className="h-4 w-4" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2 text-xs sm:text-sm">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Documents</span>
                  <span className="sm:hidden">Docs</span>
                </TabsTrigger>
                <TabsTrigger value="questionnaire" className="flex items-center gap-2 text-xs sm:text-sm">
                  <FileCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Questionnaire</span>
                  <span className="sm:hidden">Forms</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content Based on Current View */}
          {currentView === 'overview' && (
            <div className="space-y-8">
              {/* Segment Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Segment</CardTitle>
                  <CardDescription>Select your project category to see relevant services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['RES', 'COM', 'IND'] as Segment[]).map((segment) => (
                      <Card 
                        key={segment}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedSegment === segment ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedSegment(segment)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="flex flex-col items-center gap-4">
                            {getSegmentIcon(segment)}
                            <div>
                              <h3 className="font-semibold">{getSegmentLabel(segment)}</h3>
                              <p className="text-sm text-muted-foreground">
                                {segment === 'RES' && 'Homes & Small Properties'}
                                {segment === 'COM' && 'Businesses & Commercial'}
                                {segment === 'IND' && 'Industrial & Large Scale'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Dashboard Content - 3 columns */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Top Row - Primary Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CO2SavingsWidget />
                    <CarbonCreditWidget />
                    <EnergyGenerationWidget />
                  </div>

                  {/* Second Row - Financial & Environmental */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <BillSavingsWidget />
                    <EnvironmentalEquivalentsWidget />
                    <REISScoreWidget />
                  </div>

                  {/* Third Row - Performance & System Management */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RealTimePerformanceWidget />
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-primary" />
                          Quick Calculator Access
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Leaf className="h-4 w-4 mr-2" />
                            CO₂ Calculator
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <TreePine className="h-4 w-4 mr-2" />
                            Carbon Credits
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Zap className="h-4 w-4 mr-2" />
                            Energy Simulator
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Bill Savings
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Job Information & Metrics (Original Components) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <JobCodeGenerator 
                      jobData={mockJobData}
                      onCopyCode={handleJobCodeCopy}
                    />
                    <MetricsWidget 
                      data={mockMetricsData}
                      jobCode={mockJobData.jobCode}
                    />
                  </div>

                  {/* Ticketing System */}
                  <TicketingSystem
                    tickets={mockTickets}
                    jobCode={mockJobData.jobCode}
                    onTicketUpdate={handleTicketUpdate}
                  />
                </div>

                {/* Sidebar - Alerts & Actions */}
                <div className="space-y-6">
                  {/* Maintenance & Alerts */}
                  <MaintenanceAlertsWidget />

                  {/* User Feedback/Ticketing Summary */}
                  <UserFeedbackWidget />

                  {/* System Status Overview */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-success" />
                        System Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Overall Health</span>
                          <Badge variant="default" className="bg-success text-success-foreground">Excellent</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Performance</span>
                            <span>94.2%</span>
                          </div>
                          <Progress value={94.2} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Efficiency</span>
                            <span>91.5%</span>
                          </div>
                          <Progress value={91.5} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uptime</span>
                            <span>99.7%</span>
                          </div>
                          <Progress value={99.7} className="h-2" />
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
                        onClick={() => setCurrentView('services')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Request Service
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => setCurrentView('documents')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Bell className="h-4 w-4 mr-2" />
                        Configure Alerts
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {currentView === 'services' && (
            <ServiceCatalog 
              selectedSegment={selectedSegment}
              onServiceSelect={handleServiceSelect}
            />
          )}

          {currentView === 'documents' && (
            <DocumentManager
              documents={mockDocuments}
              jobCode={mockJobData.jobCode}
              onUpload={handleDocumentUpload}
              onDownload={(id) => handleDocumentAction(id, 'download')}
              onDelete={(id) => handleDocumentAction(id, 'delete')}
              onView={(id) => handleDocumentAction(id, 'view')}
            />
          )}

        </div>
      </div>
    </Layout>
  );
};

export default ClientDashboard;