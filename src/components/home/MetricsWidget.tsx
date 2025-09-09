import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Leaf, DollarSign, Zap, TrendingUp, Calculator, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MetricsWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const metrics = [
    {
      icon: <Leaf className="w-5 h-5 text-success" />,
      label: "CO₂ Savings",
      value: "50,000+",
      unit: "tons/year",
      description: "Carbon emissions prevented through renewable energy solutions",
      trend: "+23%"
    },
    {
      icon: <DollarSign className="w-5 h-5 text-primary" />,
      label: "Cost Savings",
      value: "₦2.5B+",
      unit: "annually",
      description: "Savings achieved compared to diesel generators",
      trend: "+18%"
    },
    {
      icon: <Zap className="w-5 h-5 text-accent" />,
      label: "Energy Generated",
      value: "150",
      unit: "GWh/year",
      description: "Clean energy generated across all installations",
      trend: "+31%"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Real Impact Metrics
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See how our REIS solutions are transforming energy infrastructure across Nigeria
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {metric.icon}
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{metric.label}</h3>
                    <p className="text-xs text-muted-foreground">{metric.unit}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.trend}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <p className="text-xs text-muted-foreground line-clamp-2">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="mr-4">
              <Calculator className="w-4 h-4 mr-2" />
              View Detailed Calculator
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <div className="mx-auto w-full max-w-4xl">
              <DrawerHeader>
                <DrawerTitle>Energy Calculator Preview</DrawerTitle>
                <DrawerDescription>
                  Get quick estimates for your renewable energy project
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Leaf className="w-5 h-5 text-success" />
                      <h4 className="font-semibold">CO₂ Savings Calculator</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Estimate CO₂ emissions avoided by using REIS systems vs. diesel generators
                    </p>
                    <Link to="/calculators">
                      <Button size="sm" variant="outline" className="w-full">
                        Calculate <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">Bill Savings Tool</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Compare monthly/annual costs of diesel vs. REIS solutions
                    </p>
                    <Link to="/calculators">
                      <Button size="sm" variant="outline" className="w-full">
                        Calculate <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Zap className="w-5 h-5 text-accent" />
                      <h4 className="font-semibold">Energy Simulator</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Estimate daily/monthly/yearly energy output by location
                    </p>
                    <Link to="/calculators">
                      <Button size="sm" variant="outline" className="w-full">
                        Simulate <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </Card>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Link to="/calculators">
                    <Button>
                      Access Full Calculator Suite
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
        
        <Link to="/calculators">
          <Button>
            Try Our Calculators
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MetricsWidget;