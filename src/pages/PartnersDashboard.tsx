import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Calendar
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const PartnersDashboard = () => {
  const partnerMetrics = {
    totalOrders: 24,
    activeProjects: 8,
    totalCommissions: "$18,450",
    pendingPayouts: "$3,240",
    completionRate: "96%",
    rating: 4.8
  };

  const recentOrders = [
    { id: 1, project: "Residential Solar Install", client: "John Smith", status: "in-progress", value: "$25,000", commission: "$1,250" },
    { id: 2, project: "Commercial Battery System", client: "TechCorp Ltd", status: "completed", value: "$45,000", commission: "$2,250" },
    { id: 3, project: "Wind Farm Maintenance", client: "Green Energy Co", status: "pending", value: "$15,000", commission: "$750" },
  ];

  const availableTasks = [
    { id: 1, title: "Solar Panel Installation", location: "Austin, TX", budget: "$35,000", urgency: "high", skills: ["Solar", "Electrical"] },
    { id: 2, title: "Battery System Maintenance", location: "Dallas, TX", budget: "$8,000", urgency: "medium", skills: ["Battery", "Maintenance"] },
    { id: 3, title: "Wind Turbine Inspection", location: "Houston, TX", budget: "$12,000", urgency: "low", skills: ["Wind", "Inspection"] },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Partners Dashboard</h1>
            <p className="text-muted-foreground">Manage installations, marketplace, and commissions</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                  <TabsTrigger value="products">My Products</TabsTrigger>
                  <TabsTrigger value="commissions">Commissions</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        My Orders & Projects
                      </CardTitle>
                      <CardDescription>Track your installations and project progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{order.project}</h4>
                              <p className="text-sm text-muted-foreground">{order.client} • {order.value}</p>
                              <p className="text-sm text-success">Commission: {order.commission}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={
                                order.status === 'completed' ? 'default' :
                                order.status === 'in-progress' ? 'secondary' : 'outline'
                              }>
                                {order.status}
                              </Badge>
                              <Button variant="outline" size="sm">
                                {order.status === 'completed' ? 'View Details' : 'Update Status'}
                              </Button>
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
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Available Installation Tasks
                      </CardTitle>
                      <CardDescription>Browse and bid on available installation projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {availableTasks.map((task) => (
                          <div key={task.id} className="p-4 border border-border rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-muted-foreground">{task.location}</p>
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
                              <Button size="sm" variant="default">
                                Accept Task
                              </Button>
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
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        My Products
                      </CardTitle>
                      <CardDescription>Manage your product listings in the E&T marketplace</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Products Listed</h3>
                        <p className="text-muted-foreground mb-4">Start selling your renewable energy products</p>
                        <Button>Add New Product</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="commissions" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Commission Dashboard
                      </CardTitle>
                      <CardDescription>Track earnings, referrals, and payout requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-success/10 rounded-lg">
                          <div className="text-2xl font-bold text-success">$18,450</div>
                          <p className="text-sm text-muted-foreground">Total Earned</p>
                        </div>
                        <div className="text-center p-4 bg-accent/10 rounded-lg">
                          <div className="text-2xl font-bold text-accent">$3,240</div>
                          <p className="text-sm text-muted-foreground">Pending Payout</p>
                        </div>
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <div className="text-2xl font-bold text-primary">47</div>
                          <p className="text-sm text-muted-foreground">Referrals</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Button className="w-full">Request Payout</Button>
                        <Button variant="outline" className="w-full">Generate Referral Link</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5" />
                        Compliance & Certifications
                      </CardTitle>
                      <CardDescription>Manage certifications, terms & conditions, and competence proof</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">Terms & Conditions</h4>
                            <p className="text-sm text-muted-foreground">Partner agreement acceptance</p>
                          </div>
                          <Badge variant="default">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accepted
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">Professional Certifications</h4>
                            <p className="text-sm text-muted-foreground">Upload your professional certificates</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Certs
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">Insurance Documentation</h4>
                            <p className="text-sm text-muted-foreground">Liability and worker's compensation</p>
                          </div>
                          <Badge variant="secondary">
                            <Clock className="h-4 w-4 mr-1" />
                            Under Review
                          </Badge>
                        </div>
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
                    <Users className="h-5 w-5" />
                    Partner Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="font-medium">Certified Partner</h3>
                      <p className="text-sm text-muted-foreground">Level 3 • Gold Status</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span className="font-medium">96%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Response Time</span>
                        <span className="font-medium">2.3 hrs</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Customer Rating</span>
                        <span className="font-medium">4.8/5</span>
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