import React from 'react';
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
  Download
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const ClientDashboard = () => {
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

  return (
    <Layout>
      <div className="min-h-screen bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Client Dashboard</h1>
            <p className="text-muted-foreground">Monitor your renewable energy systems in real-time</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Generation</CardTitle>
                <Zap className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{energyData.totalGeneration}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Savings</CardTitle>
                <Leaf className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{energyData.co2Savings}</div>
                <p className="text-xs text-muted-foreground">Environmental impact</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{energyData.costSavings}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Efficiency</CardTitle>
                <Battery className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{energyData.efficiency}</div>
                <p className="text-xs text-muted-foreground">Optimal performance</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="lcoe">LCOE</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Energy Generation Overview
                      </CardTitle>
                      <CardDescription>Real-time system performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Interactive chart will be implemented here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sun className="h-5 w-5 text-accent" />
                          Solar Systems
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Rooftop Array A</span>
                            <Badge variant="secondary">Online</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Ground Mount B</span>
                            <Badge variant="secondary">Online</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Tracker System C</span>
                            <Badge className="bg-accent text-accent-foreground">Maintenance</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wind className="h-5 w-5 text-primary" />
                          Wind Systems
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Turbine 1</span>
                            <Badge variant="secondary">Online</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Turbine 2</span>
                            <Badge variant="secondary">Online</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Wind Farm Alpha</span>
                            <Badge variant="secondary">Online</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle>Advanced Analytics</CardTitle>
                      <CardDescription>Detailed performance insights and predictive analytics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Advanced analytics dashboard will be implemented here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Reports & Documentation
                      </CardTitle>
                      <CardDescription>Download ESG reports, CO₂ statements, and system documentation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">Monthly ESG Report - December 2024</h4>
                            <p className="text-sm text-muted-foreground">Environmental impact statement</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">CO₂ Savings Certificate</h4>
                            <p className="text-sm text-muted-foreground">Verified carbon offset documentation</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">System Performance Report</h4>
                            <p className="text-sm text-muted-foreground">Technical performance analysis</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="lcoe" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle>LCOE Tracker</CardTitle>
                      <CardDescription>Levelized Cost of Energy analysis and tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-foreground">$0.045</div>
                          <p className="text-sm text-muted-foreground">Current LCOE ($/kWh)</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-success">$0.12</div>
                          <p className="text-sm text-muted-foreground">Grid Equivalent</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-success">62%</div>
                          <p className="text-sm text-muted-foreground">Cost Savings</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
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
      </div>
    </Layout>
  );
};

export default ClientDashboard;