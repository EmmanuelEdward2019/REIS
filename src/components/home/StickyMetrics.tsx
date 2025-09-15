import React from 'react';
import { TrendingUp, Zap, Shield } from 'lucide-react';

const StickyMetrics = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <div className="text-lg sm:text-xl font-bold text-foreground">50+ GW</div>
              <div className="text-xs text-muted-foreground">Deployed</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-4 h-4 text-accent" />
            <div>
              <div className="text-lg sm:text-xl font-bold text-foreground">1M+ Tons</div>
              <div className="text-xs text-muted-foreground">CO₂ Saved</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-4 h-4 text-success" />
            <div>
              <div className="text-lg sm:text-xl font-bold text-foreground">25+ Countries</div>
              <div className="text-xs text-muted-foreground">Global Reach</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyMetrics;