import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Zap
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const AdminDashboard = () => {
  const fleetMetrics = {
    totalSystems: 247,
    activeProjects: 18,
    totalCapacity: "47.3 MW",
    carbonSaved: "2,847 tons",
    clients: 156,
    revenue: "$2.4M"
  };

  const recentProjects = [
    { id: 1, name: "Solar Farm Alpha", client: "GreenTech Industries", status: "active", capacity: "5.2 MW" },
    { id: 2, name: "Residential Complex B", client: "Urban Developments", status: "pending", capacity: "1.8 MW" },
    { id: 3, name: "Industrial Park C", client: "Manufacturing Corp", status: "completed", capacity: "3.7 MW" },
  ];

  const systemAlerts = [
    { id: 1, severity: "high", message: "System offline: Wind Farm Delta", time: "15 min ago" },
    { id: 2, severity: "medium", message: "Maintenance due: Solar Array 12", time: "2 hours ago" },
    { id: 3, severity: "low", message: "Performance optimization available", time: "1 day ago" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive fleet management and analytics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Systems</CardTitle>
                <Building2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{fleetMetrics.totalSystems}</div>
                <p className="text-xs text-muted-foreground">+5 this month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Clock className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{fleetMetrics.activeProjects}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                <Zap className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{fleetMetrics.totalCapacity}</div>
                <p className="text-xs text-muted-foreground">Installed capacity</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{fleetMetrics.carbonSaved}</div>
                <p className="text-xs text-muted-foreground">CO₂ offset</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{fleetMetrics.clients}</div>
                <p className="text-xs text-muted-foreground">Active clients</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{fleetMetrics.revenue}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="fleet" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="fleet">Fleet</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="cms">CMS</TabsTrigger>
                </TabsList>

                <TabsContent value="fleet" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Fleet Performance Overview
                      </CardTitle>
                      <CardDescription>Real-time monitoring of all renewable energy systems</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center mb-6">
                        <p className="text-muted-foreground">Fleet performance dashboard will be implemented here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle>Recent Projects</CardTitle>
                      <CardDescription>Latest installations and project updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentProjects.map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div>
                              <h4 className="font-medium">{project.name}</h4>
                              <p className="text-sm text-muted-foreground">{project.client} • {project.capacity}</p>
                            </div>
                            <Badge variant={
                              project.status === 'active' ? 'default' :
                              project.status === 'completed' ? 'secondary' : 'outline'
                            }>
                              {project.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle>Fleet Analytics</CardTitle>
                      <CardDescription>Comprehensive performance analysis and carbon savings index</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Advanced fleet analytics will be implemented here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Compliance & Lifecycle Tracking
                      </CardTitle>
                      <CardDescription>Monitor regulatory compliance and system lifecycle</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-success/10 rounded-lg">
                          <div className="text-2xl font-bold text-success">98.5%</div>
                          <p className="text-sm text-muted-foreground">Compliance Rate</p>
                        </div>
                        <div className="text-center p-4 bg-accent/10 rounded-lg">
                          <div className="text-2xl font-bold text-accent">12</div>
                          <p className="text-sm text-muted-foreground">Pending Reviews</p>
                        </div>
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <div className="text-2xl font-bold text-primary">247</div>
                          <p className="text-sm text-muted-foreground">Systems Tracked</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Inventory Management
                      </CardTitle>
                      <CardDescription>Track components, parts, and maintenance supplies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">1,247</div>
                            <p className="text-xs text-muted-foreground">Solar Panels</p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">89</div>
                            <p className="text-xs text-muted-foreground">Inverters</p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">156</div>
                            <p className="text-xs text-muted-foreground">Batteries</p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold">23</div>
                            <p className="text-xs text-muted-foreground">Turbines</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cms" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Content Management System
                      </CardTitle>
                      <CardDescription>Multi-role content management and approvals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button className="w-full justify-start" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Manage Content
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Pending Approvals (5)
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          User Management
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          System Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
                  <div className="space-y-4">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.severity === 'high' ? 'bg-accent animate-pulse' : 
                          alert.severity === 'medium' ? 'bg-accent' : 'bg-primary'
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

              {/* Quick Stats */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Online Systems</span>
                      <span className="text-sm font-medium text-success">243/247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Under Maintenance</span>
                      <span className="text-sm font-medium text-accent">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Uptime</span>
                      <span className="text-sm font-medium text-success">99.2%</span>
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