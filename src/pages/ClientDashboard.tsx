import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity,
  CreditCard,
  Package
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ModernEnergyMetrics from '@/components/dashboard/ModernEnergyMetrics';
import IoTControllerManager from '@/components/dashboard/IoTControllerManager';
import InventoryManager from '@/components/dashboard/InventoryManager';
import BillingManager from '@/components/dashboard/BillingManager';
import TicketingSystem, { TicketData } from '@/components/crm/TicketingSystem';
import ServiceCatalog from '@/components/crm/ServiceCatalog';
import DocumentManager from '@/components/crm/DocumentManager';
import { supabase } from '@/integrations/supabase/client';

// Mock user role - in real app this would come from auth context
type UserRole = 'CLIENT' | 'PROSPECT' | 'SDR' | 'SALES' | 'ENGINEER' | 'PM' | 'FINANCE' | 'OM';

const ClientDashboard = () => {
  const [userRole] = useState<UserRole>('CLIENT');
  const [currentView, setCurrentView] = useState<'overview' | 'controllers' | 'inventory' | 'billing' | 'tickets' | 'services' | 'documents'>('overview');
  const [controllers, setControllers] = useState([]);
  const [energyMetrics, setEnergyMetrics] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchControllers();
    fetchEnergyData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchControllers = async () => {
    try {
      const { data, error } = await supabase
        .from('controllers')
        .select('*')
        .eq('is_active', true)
        .limit(3);

      if (error) throw error;
      setControllers(data || []);
    } catch (error) {
      console.error('Error fetching controllers:', error);
    }
  };

  const fetchEnergyData = async () => {
    try {
      const { data, error } = await supabase
        .from('energy_metrics')
        .select(`
          *,
          controllers (
            device_name,
            is_online,
            is_active,
            last_heartbeat
          )
        `)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // If no data, create mock data for demo
      if (!data) {
        setEnergyMetrics({
          solar_generation_w: 3640,
          house_load_w: 945,
          battery_power_w: -2650,
          battery_level_percent: 42,
          battery_voltage_v: 53.3,
          battery_current_a: 49.7,
          battery_temp_c: 31,
          energy_generated_kwh_daily: 4.38,
          energy_used_kwh_daily: 9.94,
          efficiency_percent: 94.2,
          system_status: 'normal',
          controllers: {
            device_name: 'Main Solar System',
            is_online: true,
            is_active: true,
            last_heartbeat: new Date().toISOString()
          }
        });
      } else {
        setEnergyMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching energy data:', error);
    }
  };

  // Mock tickets data
  const mockTickets: TicketData[] = [
    {
      ticketCode: 'TKT-2024-000001',
      stage: 'INTAKE',
      status: 'COMPLETED',
      title: 'System Performance Question',
      description: 'Customer inquiry about solar panel efficiency',
      created: new Date('2024-01-15'),
      updated: new Date('2024-01-15'),
      priority: 'MEDIUM',
      notes: ['Initial inquiry received'],
      attachments: []
    }
  ];

  const handleTicketUpdate = (ticketCode: string, updates: Partial<TicketData>) => {
    console.log('Updating ticket:', ticketCode, updates);
  };

  const handleServiceSelect = (service: string) => {
    console.log('Service selected:', service);
  };

  const handleDocumentUpload = (files: FileList) => {
    console.log('Uploading files:', Array.from(files));
  };

  const handleDocumentAction = (documentId: string, action: 'download' | 'delete' | 'view') => {
    console.log(`Document ${action}:`, documentId);
  };

  const mockDocuments = [
    {
      id: '1',
      name: 'System Manual.pdf',
      type: 'manual' as const,
      category: 'system' as const,
      size: 2450000,
      uploadDate: new Date('2024-01-16'),
      uploadedBy: 'System',
      jobCode: 'ET-REIS-RES-AUD-2024-0123',
      status: 'approved' as const
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-secondary overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {userProfile?.full_name ? `Welcome, ${userProfile.full_name}` : 'Client Dashboard'}
                </h1>
                <p className="text-muted-foreground">
                  {userProfile?.service_class 
                    ? `${userProfile.service_class.charAt(0).toUpperCase() + userProfile.service_class.slice(1)} Energy System Dashboard`
                    : "Monitor your renewable energy systems in real-time"
                  }
                </p>
              </div>
              {userProfile?.service_class && (
                <Badge variant="outline" className="text-sm">
                  {userProfile.service_class.charAt(0).toUpperCase() + userProfile.service_class.slice(1)} Customer
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as typeof currentView)} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="controllers" className="text-xs sm:text-sm">Controllers</TabsTrigger>
                <TabsTrigger value="inventory" className="text-xs sm:text-sm">Inventory</TabsTrigger>
                <TabsTrigger value="billing" className="text-xs sm:text-sm">Billing</TabsTrigger>
                <TabsTrigger value="tickets" className="text-xs sm:text-sm">Support</TabsTrigger>
                <TabsTrigger value="services" className="text-xs sm:text-sm">Services</TabsTrigger>
                <TabsTrigger value="documents" className="text-xs sm:text-sm">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Modern Energy Metrics Dashboard */}
                {energyMetrics && (
                  <ModernEnergyMetrics 
                    data={energyMetrics}
                    controller={energyMetrics.controllers}
                    historicalData={[
                      { time: '03:00', generation: 0, consumption: 0.5 },
                      { time: '06:00', generation: 1.2, consumption: 0.8 },
                      { time: '09:00', generation: 3.5, consumption: 1.2 },
                      { time: '12:00', generation: 4.8, consumption: 1.8 },
                      { time: '15:00', generation: 4.2, consumption: 2.1 },
                      { time: '18:00', generation: 2.1, consumption: 3.2 },
                      { time: '21:00', generation: 0, consumption: 2.8 }
                    ]}
                  />
                )}

                {/* System Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-primary" />
                        Active Controllers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{controllers.length}</div>
                      <div className="text-xs text-muted-foreground">
                        {controllers.filter(c => c.is_online).length} online
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-accent" />
                        System Components
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">12</div>
                      <div className="text-xs text-muted-foreground">All operational</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4 text-success" />
                        Account Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold text-success">Active</div>
                      <div className="text-xs text-muted-foreground">Next billing: Dec 15</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="controllers" className="space-y-6">
                <IoTControllerManager />
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                <InventoryManager />
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <BillingManager />
              </TabsContent>

              <TabsContent value="tickets" className="space-y-6">
                <TicketingSystem 
                  tickets={mockTickets}
                  onTicketUpdate={handleTicketUpdate}
                  userRole={userRole}
                />
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <ServiceCatalog onServiceSelect={handleServiceSelect} />
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <DocumentManager 
                  documents={mockDocuments}
                  onUpload={handleDocumentUpload}
                  onAction={handleDocumentAction}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientDashboard;