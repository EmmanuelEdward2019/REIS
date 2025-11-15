import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface RegionData {
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;
  language: string;
  languageCode: string;
}

interface RegionContextType {
  region: RegionData;
  setRegion: (region: RegionData) => void;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
  changeLanguage: (languageCode: string) => void;
}

const defaultRegion: RegionData = {
  country: 'Nigeria',
  countryCode: 'NG',
  currency: 'NGN',
  currencySymbol: '₦',
  language: 'English',
  languageCode: 'en',
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

// Country to currency mapping
const countryToCurrency: Record<string, { currency: string; symbol: string; language: string; languageCode: string }> = {
  NG: { currency: 'NGN', symbol: '₦', language: 'English', languageCode: 'en' },
  GB: { currency: 'GBP', symbol: '£', language: 'English', languageCode: 'en' },
  US: { currency: 'USD', symbol: '$', language: 'English', languageCode: 'en' },
  CA: { currency: 'CAD', symbol: 'C$', language: 'English', languageCode: 'en' },
  FR: { currency: 'EUR', symbol: '€', language: 'French', languageCode: 'fr' },
  DE: { currency: 'EUR', symbol: '€', language: 'German', languageCode: 'de' },
  ES: { currency: 'EUR', symbol: '€', language: 'Spanish', languageCode: 'es' },
  IT: { currency: 'EUR', symbol: '€', language: 'Italian', languageCode: 'it' },
  GH: { currency: 'GHS', symbol: 'GH₵', language: 'English', languageCode: 'en' },
  KE: { currency: 'KES', symbol: 'KSh', language: 'English', languageCode: 'en' },
  ZA: { currency: 'ZAR', symbol: 'R', language: 'English', languageCode: 'en' },
  IN: { currency: 'INR', symbol: '₹', language: 'English', languageCode: 'en' },
  CN: { currency: 'CNY', symbol: '¥', language: 'Chinese', languageCode: 'zh' },
  JP: { currency: 'JPY', symbol: '¥', language: 'Japanese', languageCode: 'ja' },
  AU: { currency: 'AUD', symbol: 'A$', language: 'English', languageCode: 'en' },
};

// Country code to country name mapping
const countryNames: Record<string, string> = {
  NG: 'Nigeria',
  GB: 'United Kingdom',
  US: 'United States',
  CA: 'Canada',
  FR: 'France',
  DE: 'Germany',
  ES: 'Spain',
  IT: 'Italy',
  GH: 'Ghana',
  KE: 'Kenya',
  ZA: 'South Africa',
  IN: 'India',
  CN: 'China',
  JP: 'Japan',
  AU: 'Australia',
};

interface RegionProviderProps {
  children: ReactNode;
}

export const RegionProvider: React.FC<RegionProviderProps> = ({ children }) => {
  const [region, setRegionState] = useState<RegionData>(defaultRegion);
  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check if user has manually set a region preference
    const savedRegion = localStorage.getItem('userRegion');
    if (savedRegion) {
      try {
        const parsedRegion = JSON.parse(savedRegion);
        setRegionState(parsedRegion);
        // Set i18n language to match region
        i18n.changeLanguage(parsedRegion.languageCode);
        setIsLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse saved region:', e);
      }
    }

    // Detect region based on IP address
    detectRegion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount - do NOT add i18n as dependency to avoid infinite loop

  const detectRegion = async () => {
    try {
      // Using ipapi.co for geolocation (free tier: 1000 requests/day)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code) {
        const countryCode = data.country_code;
        const currencyData = countryToCurrency[countryCode] || countryToCurrency['NG'];
        const countryName = countryNames[countryCode] || data.country_name || 'Nigeria';
        
        const detectedRegion: RegionData = {
          country: countryName,
          countryCode: countryCode,
          currency: currencyData.currency,
          currencySymbol: currencyData.symbol,
          language: currencyData.language,
          languageCode: currencyData.languageCode,
        };
        
        setRegionState(detectedRegion);
      }
    } catch (error) {
      console.error('Failed to detect region:', error);
      // Fallback to default region
      setRegionState(defaultRegion);
    } finally {
      setIsLoading(false);
    }
  };

  const setRegion = (newRegion: RegionData) => {
    setRegionState(newRegion);
    // Save user preference
    localStorage.setItem('userRegion', JSON.stringify(newRegion));
    // Change i18n language to match region
    i18n.changeLanguage(newRegion.languageCode);
  };

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    // Update region with new language
    const updatedRegion = { ...region, languageCode };
    setRegionState(updatedRegion);
    localStorage.setItem('userRegion', JSON.stringify(updatedRegion));
  };

  const formatCurrency = (amount: number): string => {
    return `${region.currencySymbol}${amount.toLocaleString(region.languageCode, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <RegionContext.Provider value={{ region, setRegion, isLoading, formatCurrency, changeLanguage }}>
      {children}
    </RegionContext.Provider>
  );
};

// Helper function to get all available regions
export const getAvailableRegions = (): RegionData[] => {
  return Object.entries(countryToCurrency).map(([code, data]) => ({
    country: countryNames[code] || code,
    countryCode: code,
    currency: data.currency,
    currencySymbol: data.symbol,
    language: data.language,
    languageCode: data.languageCode,
  }));
};

