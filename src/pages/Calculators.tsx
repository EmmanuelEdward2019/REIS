import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Calculator, Leaf, DollarSign, Zap, TreePine, Award, Download, TrendingUp, Factory, Car, Home } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Calculators = () => {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  

  const CO2Calculator = () => {
    const [monthlyKwh, setMonthlyKwh] = useState('');
    const [systemType, setSystemType] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
      const kwhValue = parseFloat(monthlyKwh);
      if (kwhValue && systemType) {
        // Enhanced CO2 calculation based on system type
        const emissionFactors: any = {
          'solar': 0.02, // kg CO2 per kWh
          'wind': 0.01,
          'hybrid': 0.015,
          'diesel': 0.92 // baseline for comparison
        };
        
        const co2Saved = kwhValue * (0.92 - emissionFactors[systemType]); // saved vs diesel
        const annualSaved = co2Saved * 12;
        const trees = Math.round(annualSaved / 21.77); // trees equivalent
        const cars = Math.round(annualSaved / 4600); // cars off road equivalent
        const homes = Math.round(annualSaved / 7300); // homes powered equivalent

        // Generate monthly projection data
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
          co2Saved: co2Saved + (Math.random() * co2Saved * 0.2 - co2Saved * 0.1), // ±10% variation
          cumulative: (i + 1) * co2Saved
        }));

        setResult({
          monthly: co2Saved.toFixed(2),
          annual: annualSaved.toFixed(2),
          trees,
          cars,
          homes,
          monthlyData,
          systemType
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="kwh">Average Monthly Energy Consumption (kWh)</Label>
            <Input
              id="kwh"
              type="number"
              value={monthlyKwh}
              onChange={(e) => setMonthlyKwh(e.target.value)}
              placeholder="Enter your monthly kWh usage"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="system-type">REIS System Type</Label>
            <Select value={systemType} onValueChange={setSystemType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select system type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar">Solar PV System</SelectItem>
                <SelectItem value="wind">Wind Turbine</SelectItem>
                <SelectItem value="hybrid">Solar + Battery Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={calculate} className="w-full">Calculate CO₂ Savings</Button>
        
        {result && (
          <div className="space-y-6">
            {/* Impact Summary */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-success">Your Environmental Impact</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{result.monthly} kg</div>
                  <div className="text-sm text-muted-foreground">CO₂ saved monthly</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{result.annual} kg</div>
                  <div className="text-sm text-muted-foreground">CO₂ saved annually</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{result.trees}</div>
                  <div className="text-sm text-muted-foreground">Trees equivalent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{result.cars}</div>
                  <div className="text-sm text-muted-foreground">Cars off road</div>
                </div>
              </div>
            </div>

            {/* Monthly Projection Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Monthly CO₂ Savings Projection</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value.toFixed(2)} kg`, 'CO₂ Saved']} />
                  <Line type="monotone" dataKey="co2Saved" stroke="hsl(var(--success))" strokeWidth={2} />
                  <Line type="monotone" dataKey="cumulative" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  const BillSavingsTool = () => {
    const [monthlyLoad, setMonthlyLoad] = useState('');
    const [energySource, setEnergySource] = useState('');
    const [location, setLocation] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
      const loadValue = parseFloat(monthlyLoad);
      if (loadValue && energySource && location) {
        // Enhanced cost calculations with location-based pricing
        const regionPricing: any = {
          'lagos': { diesel: 0.65, grid: 0.35, reis: 0.15 },
          'abuja': { diesel: 0.55, grid: 0.32, reis: 0.12 },
          'kano': { diesel: 0.60, grid: 0.28, reis: 0.10 },
          'port-harcourt': { diesel: 0.50, grid: 0.30, reis: 0.13 }
        };

        const pricing = regionPricing[location] || regionPricing['lagos'];
        const comparisonCost = loadValue * pricing[energySource];
        const reisCost = loadValue * pricing.reis;
        const monthlySavings = comparisonCost - reisCost;
        const annualSavings = monthlySavings * 12;
        
        // Generate yearly savings projection
        const yearlyData = Array.from({ length: 12 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
          traditional: comparisonCost * (1 + Math.random() * 0.1), // price volatility
          reis: reisCost,
          savings: monthlySavings * (1 + Math.random() * 0.1)
        }));

        setResult({
          traditional: comparisonCost.toFixed(2),
          reis: reisCost.toFixed(2),
          monthly: monthlySavings.toFixed(2),
          annual: annualSavings.toFixed(2),
          roi: ((annualSavings / (loadValue * 2.5)) * 100).toFixed(1), // estimated system cost factor
          yearlyData,
          energySource,
          location
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="load">Monthly Energy Load (kWh)</Label>
            <Input
              id="load"
              type="number"
              value={monthlyLoad}
              onChange={(e) => setMonthlyLoad(e.target.value)}
              placeholder="Enter monthly energy load"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="source">Compare Against</Label>
            <Select value={energySource} onValueChange={setEnergySource}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select comparison source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diesel">Diesel Generator</SelectItem>
                <SelectItem value="grid">National Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="kano">Kano</SelectItem>
                <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={calculate} className="w-full">Calculate Savings</Button>

        {result && (
          <div className="space-y-6">
            {/* Cost Comparison */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-primary">Monthly Cost Comparison</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <div className="text-xl font-bold text-destructive">₦{result.traditional}</div>
                  <div className="text-sm text-muted-foreground">{result.energySource} cost</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-xl font-bold text-success">₦{result.reis}</div>
                  <div className="text-sm text-muted-foreground">REIS cost</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-xl font-bold text-primary">₦{result.monthly}</div>
                  <div className="text-sm text-muted-foreground">Monthly savings</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">₦{result.annual}</div>
                  <div className="text-sm text-muted-foreground">Annual savings</div>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{result.roi}%</div>
                  <div className="text-sm text-muted-foreground">Estimated ROI</div>
                </div>
              </div>
            </div>

            {/* Annual Savings Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Annual Cost Comparison</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={result.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`₦${value.toFixed(2)}`, '']} />
                  <Bar dataKey="traditional" fill="hsl(var(--destructive))" name={result.energySource} />
                  <Bar dataKey="reis" fill="hsl(var(--success))" name="REIS" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  const EnergySimulator = () => {
    const [location, setLocation] = useState('');
    const [systemSize, setSystemSize] = useState('');
    const [systemType, setSystemType] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
      const sizeValue = parseFloat(systemSize);
      if (sizeValue && location && systemType) {
        // Enhanced calculation with system type and weather patterns
        const sunHours: any = {
          'abuja': { avg: 5.5, min: 4.2, max: 6.8 },
          'lagos': { avg: 4.8, min: 3.5, max: 6.1 },
          'kano': { avg: 6.2, min: 5.0, max: 7.4 },
          'port-harcourt': { avg: 4.2, min: 3.0, max: 5.4 }
        };

        const systemEfficiency: any = {
          'solar': 0.85,
          'wind': 0.75,
          'hybrid': 0.90
        };

        const locationData = sunHours[location] || sunHours['abuja'];
        const efficiency = systemEfficiency[systemType] || 0.85;
        
        const dailyGeneration = sizeValue * locationData.avg * efficiency;
        const monthlyGeneration = dailyGeneration * 30;
        const annualGeneration = dailyGeneration * 365;

        // Generate monthly generation data with seasonal variations
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
          const seasonalFactor = 0.8 + 0.4 * Math.sin((i - 2) * Math.PI / 6); // seasonal variation
          return {
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
            generation: dailyGeneration * 30 * seasonalFactor,
            efficiency: efficiency * 100 * (0.95 + Math.random() * 0.1)
          };
        });

        // Daily hourly generation pattern
        const hourlyData = Array.from({ length: 24 }, (_, hour) => {
          let generation = 0;
          if (hour >= 6 && hour <= 18) {
            const peakHour = 12;
            const distance = Math.abs(hour - peakHour);
            generation = sizeValue * Math.max(0, 1 - (distance / 6)) * efficiency;
          }
          return {
            hour: `${hour}:00`,
            generation: generation.toFixed(2)
          };
        });

        setResult({
          daily: dailyGeneration.toFixed(1),
          monthly: monthlyGeneration.toFixed(0),
          annual: annualGeneration.toFixed(0),
          efficiency: (efficiency * 100).toFixed(1),
          monthlyData,
          hourlyData,
          location,
          systemType
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select your location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="kano">Kano</SelectItem>
                <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="size">System Size (kW)</Label>
            <Input
              id="size"
              type="number"
              value={systemSize}
              onChange={(e) => setSystemSize(e.target.value)}
              placeholder="Enter system capacity in kW"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="system-type">System Type</Label>
            <Select value={systemType} onValueChange={setSystemType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select system type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar">Solar PV</SelectItem>
                <SelectItem value="wind">Wind Turbine</SelectItem>
                <SelectItem value="hybrid">Hybrid System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={calculate} className="w-full">Simulate Energy Output</Button>

        {result && (
          <div className="space-y-6">
            {/* Generation Summary */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-accent">Estimated Energy Generation</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{result.daily} kWh</div>
                  <div className="text-sm text-muted-foreground">Daily average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{result.monthly} kWh</div>
                  <div className="text-sm text-muted-foreground">Monthly average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{result.annual} kWh</div>
                  <div className="text-sm text-muted-foreground">Annual total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{result.efficiency}%</div>
                  <div className="text-sm text-muted-foreground">System efficiency</div>
                </div>
              </div>
            </div>

            {/* Monthly Generation Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Monthly Generation Forecast</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value.toFixed(0)} kWh`, 'Generation']} />
                  <Line type="monotone" dataKey="generation" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Generation Pattern */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Daily Generation Pattern</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={result.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" interval={2} />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value} kW`, 'Power Output']} />
                  <Bar dataKey="generation" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CarbonCreditEstimator = () => {
    const [annualGeneration, setAnnualGeneration] = useState('');
    const [projectType, setProjectType] = useState('');
    const [location, setLocation] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
      const generationValue = parseFloat(annualGeneration);
      if (generationValue && projectType && location) {
        // Carbon credit calculation based on avoided emissions
        const emissionFactor = 0.92; // kg CO2 per kWh avoided
        const annualCO2Avoided = generationValue * emissionFactor / 1000; // tons CO2
        
        // Credit pricing varies by project type and location
        const creditPricing: any = {
          'solar': { nigeria: 15, international: 25 },
          'wind': { nigeria: 18, international: 28 },
          'hybrid': { nigeria: 16, international: 26 }
        };

        const locationMultiplier = location === 'nigeria' ? 1 : 1.2;
        const basePrice = creditPricing[projectType]?.[location] || 15;
        const creditsValue = annualCO2Avoided * basePrice * locationMultiplier;
        
        // Generate 10-year projection
        const yearlyProjection = Array.from({ length: 10 }, (_, i) => ({
          year: 2024 + i,
          credits: annualCO2Avoided * (1 - i * 0.01), // slight degradation
          value: creditsValue * (1 + i * 0.03) * (1 - i * 0.01), // price growth minus degradation
          cumulative: annualCO2Avoided * (i + 1)
        }));

        setResult({
          annualCredits: annualCO2Avoided.toFixed(2),
          creditValue: creditsValue.toFixed(2),
          pricePerCredit: basePrice.toFixed(2),
          tenYearValue: (creditsValue * 10 * 1.15).toFixed(2),
          yearlyProjection
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="generation">Annual Generation (kWh)</Label>
            <Input
              id="generation"
              type="number"
              value={annualGeneration}
              onChange={(e) => setAnnualGeneration(e.target.value)}
              placeholder="Enter annual kWh generation"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="project-type">Project Type</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar">Solar PV Project</SelectItem>
                <SelectItem value="wind">Wind Power Project</SelectItem>
                <SelectItem value="hybrid">Hybrid Renewable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="credit-location">Market</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nigeria">Nigeria/ECOWAS</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={calculate} className="w-full">Estimate Carbon Credits</Button>

        {result && (
          <div className="space-y-6">
            {/* Credit Summary */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-success">Carbon Credit Potential</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{result.annualCredits}</div>
                  <div className="text-sm text-muted-foreground">Credits/year (tCO₂e)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">${result.pricePerCredit}</div>
                  <div className="text-sm text-muted-foreground">Price per credit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">${result.creditValue}</div>
                  <div className="text-sm text-muted-foreground">Annual value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">${result.tenYearValue}</div>
                  <div className="text-sm text-muted-foreground">10-year projection</div>
                </div>
              </div>
            </div>

            {/* 10-Year Projection Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-4">10-Year Carbon Credit Revenue Projection</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.yearlyProjection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`$${value.toFixed(0)}`, 'Revenue']} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--success))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  const EnvironmentalEquivalents = () => {
    const [co2Saved, setCO2Saved] = useState('');
    const [timeframe, setTimeframe] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
      const co2Value = parseFloat(co2Saved);
      if (co2Value && timeframe) {
        // Convert to annual if needed
        const annualCO2 = timeframe === 'monthly' ? co2Value * 12 : co2Value;
        
        // Environmental equivalents calculations
        const trees = Math.round(annualCO2 / 21.77); // trees planted and grown for 10 years
        const cars = Math.round(annualCO2 / 4600); // cars driven for 1 year
        const homes = Math.round(annualCO2 / 7300); // homes powered for 1 year
        const flights = Math.round(annualCO2 / 90); // short-haul flights avoided
        const oilBarrels = Math.round(annualCO2 / 317); // oil barrels not burned
        const smartphones = Math.round(annualCO2 / 0.07); // smartphones charged
        const coalPower = Math.round(annualCO2 / 820); // coal plant hours avoided

        const equivalents = [
          { icon: TreePine, value: trees, unit: "trees planted", color: "success", description: "Trees planted and grown for 10 years" },
          { icon: Car, value: cars, unit: "cars off road", color: "primary", description: "Average cars driven for 1 year" },
          { icon: Home, value: homes, unit: "homes powered", color: "accent", description: "Average homes powered for 1 year" },
          { icon: Factory, value: coalPower, unit: "coal plant hours", color: "warning", description: "Coal power plant operating hours avoided" }
        ];

        const detailedEquivalents = [
          { category: "Transportation", value: flights, unit: "short flights avoided", impact: "High" },
          { category: "Energy", value: oilBarrels, unit: "oil barrels saved", impact: "Medium" },
          { category: "Technology", value: smartphones, unit: "smartphones charged", impact: "Low" },
        ];

        setResult({
          annualCO2,
          equivalents,
          detailedEquivalents,
          impactScore: Math.min(100, Math.round(annualCO2 / 100))
        });
      }
    };

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="co2-input">CO₂ Saved (tonnes)</Label>
            <Input
              id="co2-input"
              type="number"
              value={co2Saved}
              onChange={(e) => setCO2Saved(e.target.value)}
              placeholder="Enter CO₂ saved"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={calculate} className="w-full">Calculate Equivalents</Button>

        {result && (
          <div className="space-y-6">
            {/* Main Equivalents */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.equivalents.map((item: any, index: number) => (
                <div key={index} className={`bg-${item.color}/10 border border-${item.color}/20 rounded-lg p-6 text-center`}>
                  <item.icon className={`w-8 h-8 text-${item.color} mx-auto mb-3`} />
                  <div className={`text-3xl font-bold text-${item.color} mb-2`}>{item.value.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mb-2">{item.unit}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              ))}
            </div>

            {/* Impact Visualization */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Environmental Impact Distribution</h4>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={result.equivalents}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ unit, value }) => `${value} ${unit}`}
                    >
                      {result.equivalents.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Impact Score */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
              <h4 className="font-semibold text-primary mb-4">Environmental Impact Score</h4>
              <div className="text-6xl font-bold text-primary mb-2">{result.impactScore}/100</div>
              <Progress value={result.impactScore} className="w-full mb-4" />
              <p className="text-muted-foreground">
                Your renewable energy contribution is making a {result.impactScore > 70 ? 'significant' : result.impactScore > 40 ? 'meaningful' : 'positive'} environmental impact!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCalculatorContent = (id: string) => {
    switch (id) {
      case 'co2-savings':
        return <CO2Calculator />;
      case 'carbon-credit':
        return <CarbonCreditEstimator />;
      case 'bill-savings':
        return <BillSavingsTool />;
      case 'energy-simulator':
        return <EnergySimulator />;
      case 'environmental-equivalents':
        return <EnvironmentalEquivalents />;
      case 'reis-badge':
        return (
          <div className="text-center py-8">
            <Award className="w-16 h-16 text-primary mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">REIS Impact Badge</h4>
            <p className="text-muted-foreground">Preview your sustainability score and impact metrics.</p>
            <Button className="mt-4">Coming Soon</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Hero Section with Metrics */}
        <section className="section-padding text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Energy <span className="text-primary">Metrics</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Real-time energy analytics and performance metrics from our renewable energy systems.
            </p>
            
            {/* Live Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-16">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-success mb-2">2,847</div>
                <div className="text-sm text-muted-foreground">CO₂ Saved (tons)</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">15.2M</div>
                <div className="text-sm text-muted-foreground">kWh Generated</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">98.7%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-warning mb-2">₦847M</div>
                <div className="text-sm text-muted-foreground">Cost Savings</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-success mb-2">12,654</div>
                <div className="text-sm text-muted-foreground">Carbon Credits</div>
                <div className="text-xs text-muted-foreground mt-1">$316K value</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">73,428</div>
                <div className="text-sm text-muted-foreground">Trees Equivalent</div>
                <div className="text-xs text-muted-foreground mt-1">System-wide impact</div>
              </div>
            </div>

            {/* Environmental Impact Summary */}
            <div className="mb-16">
              <Card className="bg-gradient-to-r from-success/10 to-primary/10 border border-success/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                    <TreePine className="h-6 w-6 text-success" />
                    Environmental Impact Across All Systems
                  </CardTitle>
                  <CardDescription>Cumulative environmental benefits from all REIS installations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                      <TreePine className="h-8 w-8 text-success mx-auto mb-3" />
                      <div className="text-3xl font-bold text-success mb-2">73,428</div>
                      <div className="text-sm text-muted-foreground">Trees Planted Equivalent</div>
                      <div className="text-xs text-success mt-1">Grown for 10 years</div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <Car className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-primary mb-2">3,456</div>
                      <div className="text-sm text-muted-foreground">Cars Off Road</div>
                      <div className="text-xs text-primary mt-1">Annual equivalent</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <Home className="h-8 w-8 text-accent mx-auto mb-3" />
                      <div className="text-3xl font-bold text-accent mb-2">2,178</div>
                      <div className="text-sm text-muted-foreground">Homes Powered</div>
                      <div className="text-xs text-accent mt-1">Annual equivalent</div>
                    </div>
                    <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                      <Factory className="h-8 w-8 text-warning mx-auto mb-3" />
                      <div className="text-3xl font-bold text-warning mb-2">5,432</div>
                      <div className="text-sm text-muted-foreground">Coal Avoided (t)</div>
                      <div className="text-xs text-warning mt-1">Tonnes of coal not burned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carbon Credits Market Value */}
            <div className="mb-16">
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                    <Award className="h-6 w-6 text-primary" />
                    Carbon Credits Market Performance
                  </CardTitle>
                  <CardDescription>Real carbon credit earnings across all REIS systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-success/10 rounded-lg border border-success/20">
                      <div className="text-4xl font-bold text-success mb-2">12,654</div>
                      <div className="text-lg text-muted-foreground mb-2">Credits Earned</div>
                      <div className="text-sm text-success">Verified carbon credits</div>
                    </div>
                    <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="text-4xl font-bold text-primary mb-2">$316,350</div>
                      <div className="text-lg text-muted-foreground mb-2">Market Value</div>
                      <div className="text-sm text-primary">Current USD value</div>
                    </div>
                    <div className="text-center p-6 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="text-4xl font-bold text-accent mb-2">2,890</div>
                      <div className="text-lg text-muted-foreground mb-2">Credits Pending</div>
                      <div className="text-sm text-accent">Awaiting verification</div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-sm text-muted-foreground">
                      Average credit price: <span className="font-semibold text-primary">$25.00</span> per tCO₂e
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Downloadables Section */}
        <section className="section-padding bg-muted/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Download className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Downloadables</h2>
            </div>
            <p className="text-muted-foreground mb-8">
              Access our library of resources to help you understand renewable energy solutions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Grant Readiness Checklist", type: "PDF Guide" },
                { title: "REIS Impact Infographic", type: "Visual Guide" },
                { title: "Carbon Savings Brochure", type: "Case Study" }
              ].map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Download className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{item.type}</p>
                    <Button variant="outline" size="sm">Download</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Calculators;