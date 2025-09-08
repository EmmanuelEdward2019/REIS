import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ClipboardList
} from 'lucide-react';
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
      <div className="min-h-screen bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">Eagle & Thistle CRM</h1>
                <Badge variant="outline" className="px-3 py-1">
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="questionnaire" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Questionnaire
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Job Information */}
                  <JobCodeGenerator 
                    jobData={mockJobData}
                    onCopyCode={handleJobCodeCopy}
                  />

                  {/* Metrics Widget */}
                  <MetricsWidget 
                    data={mockMetricsData}
                    jobCode={mockJobData.jobCode}
                  />

                  {/* Ticketing System */}
                  <TicketingSystem
                    tickets={mockTickets}
                    jobCode={mockJobData.jobCode}
                    onTicketUpdate={handleTicketUpdate}
                  />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Alerts */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Recent Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {alerts.map((alert) => (
                          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              alert.type === 'warning' ? 'bg-accent' : 
                              alert.type === 'success' ? 'bg-success' : 'bg-primary'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{alert.message}</p>
                              <p className="text-xs text-muted-foreground">{alert.time}</p>
                            </div>
                          </div>
                        ))}
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
                        Request New Service
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
                        Generate Report
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