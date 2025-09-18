import React, { useState } from 'react';
import { X, BarChart3, Leaf, Zap, TrendingUp, DollarSign, Award, TreePine } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FloatingEnergyMetrics = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const metrics = [
    {
      icon: <Leaf className="w-4 h-4 text-success" />,
      value: "2,847",
      label: "CO₂ Saved (tons)"
    },
    {
      icon: <Zap className="w-4 h-4 text-accent" />,
      value: "15.2M",
      label: "kWh Generated"
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-primary" />,
      value: "98.7%",
      label: "System Uptime"
    },
    {
      icon: <DollarSign className="w-4 h-4 text-secondary" />,
      value: "₦847M",
      label: "Cost Savings"
    },
    {
      icon: <Award className="w-4 h-4 text-accent" />,
      value: "12,654",
      label: "Carbon Credits",
      subtitle: "$316K value"
    },
    {
      icon: <TreePine className="w-4 h-4 text-success" />,
      value: "73,428",
      label: "Trees Equivalent",
      subtitle: "System-wide impact"
    }
  ];

  if (!isExpanded) {
    return (
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-30">
        <Card 
          className="bg-background/95 backdrop-blur-md border border-border/50 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => setIsExpanded(true)}
        >
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">Energy Metrics</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-30 w-64 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <Card className="bg-background/95 backdrop-blur-md border border-border/50 shadow-xl">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Live Energy Metrics</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Live Data Indicator */}
          <div className="flex items-center space-x-2 mb-4 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Live Data Feed</span>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {metric.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-bold text-foreground leading-tight">
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground leading-tight">
                    {metric.label}
                  </div>
                  {metric.subtitle && (
                    <div className="text-xs text-muted-foreground/80 leading-tight">
                      {metric.subtitle}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-border/30">
            <div className="text-xs text-muted-foreground text-center">
              System-wide Impact • Real-time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingEnergyMetrics;