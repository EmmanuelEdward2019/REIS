import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Leaf, DollarSign, Zap, TreePine, Award, Download } from 'lucide-react';

const Calculators = () => {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  
  const calculators = [
    {
      id: 'co2-savings',
      title: 'CO₂ Savings Calculator',
      description: 'Estimate CO₂ emissions avoided by using REIS systems vs. diesel',
      icon: <Leaf className="w-6 h-6" />,
      color: 'success'
    },
    {
      id: 'carbon-credit',
      title: 'Carbon Credit Estimator', 
      description: 'Calculate tradable carbon credits based on emissions saved',
      icon: <TreePine className="w-6 h-6" />,
      color: 'success'
    },
    {
      id: 'bill-savings',
      title: 'Bill Savings Tool',
      description: 'Compare monthly/annual costs of diesel vs. REIS',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary'
    },
    {
      id: 'energy-simulator',
      title: 'Energy Generation Simulator',
      description: 'Estimate daily/monthly/yearly energy output by location',
      icon: <Zap className="w-6 h-6" />,
      color: 'accent'
    },
    {
      id: 'environmental-equivalents',
      title: 'Environmental Equivalents',
      description: 'Translates CO₂ saved into relatable visuals (trees planted, oil barrels avoided)',
      icon: <TreePine className="w-6 h-6" />,
      color: 'success'
    },
    {
      id: 'reis-badge',
      title: 'REIS Impact Badge Preview',
      description: 'Public version of REIS score with limited metrics',
      icon: <Award className="w-6 h-6" />,
      color: 'primary'
    }
  ];

  const CO2Calculator = () => {
    const [monthlyKwh, setMonthlyKwh] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
      const kwhValue = parseFloat(monthlyKwh);
      if (kwhValue) {
        const co2Saved = kwhValue * 0.92; // kg CO2 per kWh (diesel factor)
        const annualSaved = co2Saved * 12;
        setResult({
          monthly: co2Saved.toFixed(2),
          annual: annualSaved.toFixed(2),
          trees: Math.round(annualSaved / 21.77) // trees equivalent
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
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
          <Button onClick={calculate} className="w-full">Calculate CO₂ Savings</Button>
        </div>
        
        {result && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-success">Your Environmental Impact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </div>
        )}
      </div>
    );
  };

  const BillSavingsTool = () => {
    const [monthlyLoad, setMonthlyLoad] = useState('');
    const [energySource, setEnergySource] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
      const loadValue = parseFloat(monthlyLoad);
      if (loadValue && energySource) {
        const dieselCost = loadValue * 0.45; // ₦/kWh for diesel
        const reisCost = loadValue * 0.12; // ₦/kWh for REIS
        const savings = dieselCost - reisCost;
        const annualSavings = savings * 12;

        setResult({
          diesel: dieselCost.toFixed(2),
          reis: reisCost.toFixed(2),
          monthly: savings.toFixed(2),
          annual: annualSavings.toFixed(2)
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
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
            <Label htmlFor="source">Energy Source Comparison</Label>
            <Select value={energySource} onValueChange={setEnergySource}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select comparison source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diesel">Diesel Generator</SelectItem>
                <SelectItem value="grid">National Grid</SelectItem>
                <SelectItem value="hybrid">Hybrid System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculate} className="w-full">Calculate Savings</Button>
        </div>

        {result && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-primary">Cost Comparison</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-xl font-bold text-destructive">₦{result.diesel}</div>
                <div className="text-sm text-muted-foreground">Diesel cost/month</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-xl font-bold text-success">₦{result.reis}</div>
                <div className="text-sm text-muted-foreground">REIS cost/month</div>
              </div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">₦{result.monthly}</div>
              <div className="text-sm text-muted-foreground">Monthly savings</div>
              <div className="text-lg font-semibold text-primary mt-2">₦{result.annual} annual savings</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const EnergySimulator = () => {
    const [location, setLocation] = useState('');
    const [systemSize, setSystemSize] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
      const sizeValue = parseFloat(systemSize);
      if (sizeValue && location) {
        // Simplified calculation based on location
        const sunHours: any = {
          'abuja': 5.5,
          'lagos': 4.8,
          'kano': 6.2,
          'port-harcourt': 4.2
        };
        
        const dailyGeneration = sizeValue * (sunHours[location] || 5.0);
        const monthlyGeneration = dailyGeneration * 30;
        const annualGeneration = dailyGeneration * 365;

        setResult({
          daily: dailyGeneration.toFixed(1),
          monthly: monthlyGeneration.toFixed(0),
          annual: annualGeneration.toFixed(0)
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
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
          <Button onClick={calculate} className="w-full">Simulate Energy Output</Button>
        </div>

        {result && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-accent">Estimated Energy Generation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{result.daily} kWh</div>
                <div className="text-sm text-muted-foreground">Daily generation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{result.monthly} kWh</div>
                <div className="text-sm text-muted-foreground">Monthly generation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{result.annual} kWh</div>
                <div className="text-sm text-muted-foreground">Annual generation</div>
              </div>
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
      case 'bill-savings':
        return <BillSavingsTool />;
      case 'energy-simulator':
        return <EnergySimulator />;
      case 'carbon-credit':
        return (
          <div className="text-center py-8">
            <TreePine className="w-16 h-16 text-success mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Carbon Credit Estimator</h4>
            <p className="text-muted-foreground">Calculate potential carbon credit earnings from your REIS system.</p>
            <Button className="mt-4">Coming Soon</Button>
          </div>
        );
      case 'environmental-equivalents':
        return (
          <div className="text-center py-8">
            <TreePine className="w-16 h-16 text-success mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Environmental Equivalents</h4>
            <p className="text-muted-foreground">See your environmental impact in relatable terms.</p>
            <Button className="mt-4">Coming Soon</Button>
          </div>
        );
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
        {/* Hero Section */}
        <section className="section-padding text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Public <span className="text-primary">Calculators</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore interactive tools to understand the impact and benefits of renewable energy systems. 
              No login required - start calculating your sustainability metrics today.
            </p>
          </div>
        </section>

        {/* Calculators Grid */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {calculators.map((calc) => (
                <Card 
                  key={calc.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    activeCalculator === calc.id 
                      ? `border-${calc.color} bg-${calc.color}/5` 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  onClick={() => setActiveCalculator(activeCalculator === calc.id ? null : calc.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 p-3 rounded-full bg-${calc.color}/10 text-${calc.color} w-fit`}>
                      {calc.icon}
                    </div>
                    <CardTitle className="text-lg">{calc.title}</CardTitle>
                    <CardDescription>{calc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant={activeCalculator === calc.id ? "default" : "outline"} 
                      className="w-full"
                    >
                      {activeCalculator === calc.id ? "Close Calculator" : "Open Calculator"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active Calculator */}
            {activeCalculator && (
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Calculator className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle>
                        {calculators.find(c => c.id === activeCalculator)?.title}
                      </CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setActiveCalculator(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderCalculatorContent(activeCalculator)}
                </CardContent>
              </Card>
            )}
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