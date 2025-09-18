import React, { useState } from 'react';
import { X, BarChart3, Leaf, Zap, TrendingUp, DollarSign, Award, TreePine } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FloatingEnergyMetrics = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const metrics = [
    {
      icon: <Leaf className="w-3 h-3 text-emerald-400" />,
      value: "2,847",
      label: "CO₂ Saved (tons)"
    },
    {
      icon: <Zap className="w-3 h-3 text-blue-400" />,
      value: "15.2M",
      label: "kWh Generated"
    },
    {
      icon: <TrendingUp className="w-3 h-3 text-purple-400" />,
      value: "98.7%",
      label: "System Uptime"
    },
    {
      icon: <DollarSign className="w-3 h-3 text-amber-400" />,
      value: "₦847M",
      label: "Cost Savings"
    },
    {
      icon: <Award className="w-3 h-3 text-red-400" />,
      value: "12,654",
      label: "Carbon Credits",
      subtitle: "$316K value"
    },
    {
      icon: <TreePine className="w-3 h-3 text-cyan-400" />,
      value: "73,428",
      label: "Trees Equivalent",
      subtitle: "System-wide impact"
    }
  ];

  if (!isExpanded) {
    return (
      <div className="fixed top-1/2 right-16 transform -translate-y-1/2 z-30">
        <Card 
          className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => setIsExpanded(true)}
        >
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-medium text-white whitespace-nowrap">Energy Metrics</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed top-24 right-16 z-30 w-48">
      <Card className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-xl">
        <CardContent className="p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3 text-emerald-400" />
              <h3 className="text-xs font-semibold text-white">Live Metrics</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-4 w-4 p-0 hover:bg-slate-800 text-gray-400 hover:text-white"
            >
              <X className="w-2 h-2" />
            </Button>
          </div>

          {/* Live Data Indicator */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-gray-400">LIVE</span>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-1.5">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 p-1.5 rounded bg-slate-800/50 border-l-2 border-transparent hover:border-emerald-400/50 transition-all"
                style={{
                  borderLeftColor: index === 0 ? '#10b981' : 
                                  index === 1 ? '#3b82f6' : 
                                  index === 2 ? '#8b5cf6' : 
                                  index === 3 ? '#f59e0b' : 
                                  index === 4 ? '#ef4444' : '#06b6d4'
                }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {metric.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white leading-none">
                    {metric.value}
                  </div>
                  <div className="text-[10px] text-gray-400 leading-none mt-0.5">
                    {metric.label}
                  </div>
                  {metric.subtitle && (
                    <div className="text-[9px] text-gray-500 leading-none mt-0.5">
                      {metric.subtitle}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-2 pt-1.5 border-t border-slate-700/50">
            <div className="text-[9px] text-gray-500 text-center">
              System-wide • Real-time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingEnergyMetrics;