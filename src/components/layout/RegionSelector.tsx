import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { useRegion, getAvailableRegions, RegionData } from '@/contexts/RegionContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RegionSelectorProps {
  variant?: 'icon' | 'button';
  className?: string;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

const RegionSelector: React.FC<RegionSelectorProps> = ({ variant = 'icon', className = '' }) => {
  const { region, setRegion, isLoading, changeLanguage } = useRegion();
  const [open, setOpen] = useState(false);
  const availableRegions = getAvailableRegions();

  const handleRegionSelect = (selectedRegion: RegionData) => {
    setRegion(selectedRegion);
    // We don't close immediately to allow checking language if needed, or we can close.
    // Let's close for better UX if they just want to switch region.
    setOpen(false);
  };

  const handleLanguageSelect = (langCode: string) => {
    changeLanguage(langCode);
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
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-lg">Preferences</DialogTitle>
          <DialogDescription className="text-xs">
            Customize your region, currency, and language settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="region" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="region">Region & Currency</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
          </TabsList>

          <TabsContent value="region" className="mt-4">
            <ScrollArea className="h-[350px] pr-3">
              <div className="grid grid-cols-1 gap-2">
                {availableRegions.map((availableRegion) => (
                  <button
                    key={availableRegion.countryCode}
                    onClick={() => handleRegionSelect(availableRegion)}
                    className={`flex items-center justify-between p-3 rounded-md border transition-all hover:border-primary hover:bg-accent/50 ${region.countryCode === availableRegion.countryCode
                        ? 'border-primary bg-accent'
                        : 'border-border'
                      }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm text-foreground">{availableRegion.country}</div>
                      <div className="text-xs text-muted-foreground">
                        {availableRegion.currency} ({availableRegion.currencySymbol})
                      </div>
                    </div>
                    {region.countryCode === availableRegion.countryCode && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="language" className="mt-4">
            <ScrollArea className="h-[350px] pr-3">
              <div className="grid grid-cols-1 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-md border transition-all hover:border-primary hover:bg-accent/50 ${region.languageCode === lang.code
                        ? 'border-primary bg-accent'
                        : 'border-border'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium text-sm text-foreground">{lang.name}</span>
                    </div>
                    {region.languageCode === lang.code && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Prices and content will be displayed based on your selection.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegionSelector;
