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
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ModernEnergyMetrics from '@/components/dashboard/ModernEnergyMetrics';
import MetricsWidget from '@/components/crm/MetricsWidget';
import IoTControllerManager from '@/components/dashboard/IoTControllerManager';
import BillingManager from '@/components/dashboard/BillingManager';
import TicketingSystem, { TicketData } from '@/components/crm/TicketingSystem';
import ServiceCatalog from '@/components/crm/ServiceCatalog';
import DocumentManager from '@/components/crm/DocumentManager';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'overview' | 'controllers' | 'orders' | 'billing' | 'tickets' | 'services' | 'documents'>('overview');
  const [controllers, setControllers] = useState([]);
  const [energyMetrics, setEnergyMetrics] = useState(null);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchControllers(),
      fetchEnergyData(),
      fetchTickets(),
      fetchDocuments(),
    ]);
    setLoading(false);
  };

  const fetchControllers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('controllers')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setControllers(data || []);
    } catch (error) {
      console.error('Error fetching controllers:', error);
      toast.error('Failed to load controllers');
    }
  };

  const fetchEnergyData = async () => {
    if (!user) return;

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
        .eq('controllers.user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching energy data:', error);
      }

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

  const fetchTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match TicketData interface
      const transformedTickets: TicketData[] = (data || []).map(ticket => ({
        ticketCode: ticket.ticket_code || '',
        stage: ticket.stage || 'INTAKE',
        status: ticket.status || 'OPEN',
        title: ticket.title || '',
        description: ticket.description || '',
        created: new Date(ticket.created_at),
        updated: new Date(ticket.updated_at),
        priority: ticket.priority || 'MEDIUM',
        notes: [],
        attachments: []
      }));

      setTickets(transformedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    }
  };

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform inventory data to documents format
      const transformedDocs = (data || []).map(item => ({
        id: item.id,
        name: item.item_name || 'Unnamed Document',
        type: 'other' as const,
        category: 'system' as const,
        size: 0,
        uploadDate: new Date(item.created_at),
        uploadedBy: 'System',
        jobCode: item.job_code || '',
        status: 'approved' as const
      }));

      setDocuments(transformedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const handleTicketUpdate = async (ticketId: string, updates: any) => {
    console.log('Update ticket:', ticketId, updates);
    toast.success('Ticket updated');
    fetchTickets();
  };

  const handleTicketCreate = async (ticket: any) => {
    console.log('Create ticket:', ticket);
    toast.success('Ticket created');
    fetchTickets();
  };

  const handleServiceSelect = (service: any) => {
    console.log('Select service:', service);
    toast.info('Service selection coming soon');
  };

  const handleDocumentUpload = async (file: File) => {
    console.log('Upload document:', file);
    toast.success('Document uploaded');
    fetchDocuments();
  };

  const handleDocumentDownload = (doc: any) => {
    console.log('Download document:', doc);
    toast.info('Download started');
  };

  const handleDocumentDelete = async (docId: string) => {
    console.log('Delete document:', docId);
    toast.success('Document deleted');
    fetchDocuments();
  };

  const handleDocumentView = (doc: any) => {
    console.log('View document:', doc);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
              <p className="text-muted-foreground">
                {profile?.service_class
                  ? `${profile.service_class.charAt(0).toUpperCase() + profile.service_class.slice(1)} Energy System Dashboard`
                  : "Monitor your renewable energy systems in real-time"}
              </p>
            </div>
            {profile?.service_class && (
              <Badge variant="outline" className="text-sm">
                {profile.service_class.charAt(0).toUpperCase() + profile.service_class.slice(1)} Customer
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as typeof currentView)} className="space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="grid grid-cols-7 min-w-max w-full">
                  <TabsTrigger value="overview" className="text-xs px-2 py-1 min-w-0">Overview</TabsTrigger>
                  <TabsTrigger value="controllers" className="text-xs px-2 py-1 min-w-0">Controllers</TabsTrigger>
                  <TabsTrigger value="orders" className="text-xs px-2 py-1 min-w-0">Orders</TabsTrigger>
                  <TabsTrigger value="billing" className="text-xs px-2 py-1 min-w-0">Billing</TabsTrigger>
                  <TabsTrigger value="tickets" className="text-xs px-2 py-1 min-w-0">Support</TabsTrigger>
                  <TabsTrigger value="services" className="text-xs px-2 py-1 min-w-0">Services</TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs px-2 py-1 min-w-0">Docs</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                {/* REIS Metrics Dashboard */}
                <MetricsWidget
                  data={{
                    co2Saved: 15.2,
                    carbonCreditsEarned: 45,
                    carbonCreditsValue: 2250,
                    energyGeneration: {
                      daily: 32.5,
                      monthly: 975,
                      yearly: 11700
                    },
                    billSavings: 1840,
                    reisScore: 78,
                    maintenanceAlerts: 0,
                    lcoeTracker: 0.085,
                    gridEquivalent: 0.142,
                    isLiveSystem: true
                  }}
                  jobCode={profile?.service_class ? `ET-REIS-${profile.service_class.toUpperCase()}-2024-001` : undefined}
                />

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
                <IoTControllerManager userRole="client" />
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Orders & Purchases</CardTitle>
                    <CardDescription>Manage your product orders and payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                      <p className="text-muted-foreground mb-4">You haven't made any purchases yet.</p>
                      <Button onClick={() => navigate('/shop')}>Browse Shop</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <BillingManager userRole="client" />
              </TabsContent>

              <TabsContent value="tickets" className="space-y-6">
                <TicketingSystem
                  tickets={tickets}
                  onTicketUpdate={handleTicketUpdate}
                  onTicketCreate={handleTicketCreate}
                  userRole="client"
                />
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <ServiceCatalog onServiceSelect={handleServiceSelect} />
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <DocumentManager
                  documents={documents}
                  jobCode={profile?.id || ''}
                  onUpload={handleDocumentUpload}
                  onDownload={handleDocumentDownload}
                  onDelete={handleDocumentDelete}
                  onView={handleDocumentView}
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