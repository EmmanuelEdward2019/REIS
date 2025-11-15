import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { useRegion, getAvailableRegions, RegionData } from '@/contexts/RegionContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RegionSelectorProps {
  variant?: 'icon' | 'button';
  className?: string;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ variant = 'icon', className = '' }) => {
  const { region, setRegion, isLoading } = useRegion();
  const [open, setOpen] = useState(false);
  const availableRegions = getAvailableRegions();

  const handleRegionSelect = (selectedRegion: RegionData) => {
    setRegion(selectedRegion);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button variant="ghost" size="sm" className={`p-2 transition-colors ${className}`} title="Region & Language">
            <Globe className="w-5 h-5" />
          </Button>
        ) : (
          <Button variant="outline" className={className}>
            <Globe className="w-4 h-4 mr-2" />
            {isLoading ? 'Detecting...' : `${region.country} (${region.currency})`}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[70vh]">
        <DialogHeader>
          <DialogTitle className="text-lg">Select Region</DialogTitle>
          <DialogDescription className="text-xs">
            Choose your country for currency and language
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[350px] pr-3">
          <div className="grid grid-cols-1 gap-2">
            {availableRegions.map((availableRegion) => (
              <button
                key={availableRegion.countryCode}
                onClick={() => handleRegionSelect(availableRegion)}
                className={`flex items-center justify-between p-3 rounded-md border transition-all hover:border-primary hover:bg-accent/50 ${
                  region.countryCode === availableRegion.countryCode
                    ? 'border-primary bg-accent'
                    : 'border-border'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium text-sm text-foreground">{availableRegion.country}</div>
                  <div className="text-xs text-muted-foreground">
                    {availableRegion.currency} ({availableRegion.currencySymbol}) • {availableRegion.language}
                  </div>
                </div>
                {region.countryCode === availableRegion.countryCode && (
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Prices and content will be displayed in your selected currency and language.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegionSelector;

