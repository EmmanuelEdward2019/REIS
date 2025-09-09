import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { MessageCircle, BarChart3, Leaf, Zap, TrendingUp, DollarSign, Award, TreePine } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const StickyFooter = () => {
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  const metrics = [
    {
      icon: <Leaf className="w-6 h-6 text-success" />,
      value: "2,847",
      label: "CO₂ Saved (tons)",
      trend: "+12%"
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      value: "15.2M",
      label: "kWh Generated",
      trend: "+8%"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      value: "98.7%",
      label: "System Uptime",
      trend: "+0.3%"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-secondary" />,
      value: "₦847M",
      label: "Cost Savings",
      trend: "+15%"
    },
    {
      icon: <Award className="w-6 h-6 text-accent" />,
      value: "12,654",
      label: "Carbon Credits",
      subtitle: "$316K value",
      trend: "+22%"
    },
    {
      icon: <TreePine className="w-6 h-6 text-success" />,
      value: "73,428",
      label: "Trees Equivalent",
      subtitle: "System-wide impact",
      trend: "+18%"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-row gap-3 justify-center">
          <Button 
            variant="outline"
            className="flex-1 max-w-[200px] px-6 py-3 text-sm font-medium bg-background text-foreground border-border hover:bg-muted rounded-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask a Question
          </Button>
          
          <Drawer open={isMetricsOpen} onOpenChange={setIsMetricsOpen}>
            <DrawerTrigger asChild>
              <Button 
                className="flex-1 max-w-[200px] px-6 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Energy Metrics
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <div className="mx-auto w-full max-w-6xl">
                <DrawerHeader className="text-center">
                  <DrawerTitle className="text-2xl font-bold">Energy Impact Metrics</DrawerTitle>
                  <DrawerDescription className="text-base">
                    Real-time performance data from our renewable energy systems
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-6 pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metrics.map((metric, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-border/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {metric.icon}
                              <div>
                                <h3 className="font-semibold text-foreground text-sm">{metric.label}</h3>
                                {metric.subtitle && (
                                  <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                                )}
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs px-2 py-1">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {metric.trend}
                            </Badge>
                          </div>
                          <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Data updated in real-time across all REIS installations
                    </p>
                    <div className="flex justify-center gap-4">
                      <Badge variant="outline" className="px-3 py-1">
                        <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                        Live Data Feed
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        All Systems Online
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default StickyFooter;