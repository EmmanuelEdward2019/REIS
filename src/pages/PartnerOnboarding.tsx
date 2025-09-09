import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { 
  MapPin, 
  Building, 
  User, 
  Wrench, 
  Award, 
  FileText, 
  CreditCard,
  Upload,
  CheckCircle,
  AlertCircle,
  Globe,
  Briefcase,
  Users,
  Zap
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';

interface OnboardingData {
  // Location & Coverage
  baseLocation: {
    city: string;
    state: string;
    country: string;
  };
  regionalCoverage: string[];
  serviceRadius: string;
  
  // Partner Classification
  partnerClass: string;
  fieldSpecialty: string[];
  
  // Services
  servicesProvided: string[];
  servicesNeeded: string[];
  
  // Capacity & Competence
  headcount: string;
  weeklyCapacity: string;
  maxConcurrentProjects: string;
  toolsEquipment: string[];
  lastThreeProjects: Array<{
    name: string;
    size: string;
    date: string;
  }>;
  
  // Compliance & Certifications
  companyDocs: {
    [key: string]: File | null;
  };
  individualDocs: {
    [key: string]: File | null;
  };
  certifications: string[];
  
  // Commercial
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    sortCode: string;
    currency: string;
  };
  
  // Listings (if applicable)
  products: Array<{
    sku: string;
    brand: string;
    specification: string;
    warranty: string;
    price: string;
    stock: string;
  }>;
  
  // Legal
  legalConsents: {
    terms: boolean;
    dataProcessing: boolean;
    antiBribery: boolean;
    sanctions: boolean;
  };
}

const PartnerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [seriousnessScore, setSeriousnessScore] = useState(0);
  const [partnerId, setPartnerId] = useState('');
  const navigate = useNavigate();
  
  const [data, setData] = useState<OnboardingData>({
    baseLocation: { city: '', state: '', country: '' },
    regionalCoverage: [],
    serviceRadius: '',
    partnerClass: '',
    fieldSpecialty: [],
    servicesProvided: [],
    servicesNeeded: [],
    headcount: '',
    weeklyCapacity: '',
    maxConcurrentProjects: '',
    toolsEquipment: [],
    lastThreeProjects: [
      { name: '', size: '', date: '' },
      { name: '', size: '', date: '' },
      { name: '', size: '', date: '' }
    ],
    companyDocs: {},
    individualDocs: {},
    certifications: [],
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      sortCode: '',
      currency: 'NGN'
    },
    products: [],
    legalConsents: {
      terms: false,
      dataProcessing: false,
      antiBribery: false,
      sanctions: false
    }
  });

  // Generate Partner ID on component mount
  useEffect(() => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    setPartnerId(`PTNR-${year}-${randomNum}`);
  }, []);

  // Calculate seriousness score
  useEffect(() => {
    let score = 0;
    
    // Basic info completion
    if (data.baseLocation.city && data.baseLocation.country) score += 2;
    if (data.partnerClass) score += 2;
    if (data.fieldSpecialty.length > 0) score += 2;
    if (data.servicesProvided.length > 0) score += 3;
    if (data.headcount && data.weeklyCapacity) score += 3;
    if (data.lastThreeProjects.some(p => p.name)) score += 3;
    if (Object.keys(data.companyDocs).length > 0 || Object.keys(data.individualDocs).length > 0) score += 3;
    if (data.bankDetails.accountName && data.bankDetails.accountNumber) score += 2;
    
    setSeriousnessScore(score);
  }, [data]);

  const totalSteps = 10;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const partnerClasses = [
    'Renewable Energy Installation Company',
    'Individual Installer', 
    'Renewable Products Marketing Company',
    'Individual Products Marketer',
    'System Integrator / Contractor',
    'Engineering/Consultancy',
    'Logistics / Warehousing',
    'E-commerce Reseller',
    'Manufacturer / OEM',
    'Other'
  ];

  const fieldSpecialties = [
    'Oil & Gas sector',
    'Offshore / Onshore',
    'Industrial',
    'Commercial', 
    'Residential',
    'Business Marketing / E-commerce',
    'SCADA/Controls/AI',
    'Energy Storage / Hydrogen',
    'Grid Connection / Protection',
    'O&M / Service'
  ];

  const servicesProvided = [
    'Installation services',
    'Contracting / EPC sub-contracts',
    'Product sales',
    'Commissioning / Testing',
    'O&M / Warranty service',
    'Consultancy / Design',
    'Logistics / Warehousing',
    'Training delivery',
    'Other'
  ];

  const servicesNeeded = [
    'Professional training',
    'E-commerce services',
    'Consultation',
    'Access to product catalog',
    'Marketing collateral',
    'Financing / credit terms'
  ];

  const regions = [
    'UK', 'Nigeria', 'ECOWAS', 'EU', 'Ghana', 'Kenya', 'South Africa', 'Other'
  ];

  const currencies = ['NGN', 'GBP', 'USD', 'EUR'];

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedData = (parent: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [parent]: { ...(prev[parent as keyof OnboardingData] as any), [field]: value }
    }));
  };

  const handleArrayToggle = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    updateData(field, newArray);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitOnboarding = async () => {
    if (seriousnessScore < 10) {
      toast({
        title: "Incomplete Application",
        description: "Please complete more sections to improve your application score.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: `Your Partner ID is ${partnerId}. Application is under KYC review.`
    });

    setTimeout(() => {
      navigate('/partners-dashboard');
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Regional Coverage
              </CardTitle>
              <CardDescription>Where are you based and what regions do you serve?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={data.baseLocation.city}
                    onChange={(e) => updateNestedData('baseLocation', 'city', e.target.value)}
                    placeholder="Lagos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Region</Label>
                  <Input
                    id="state"
                    value={data.baseLocation.state}
                    onChange={(e) => updateNestedData('baseLocation', 'state', e.target.value)}
                    placeholder="Lagos State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={data.baseLocation.country}
                    onChange={(e) => updateNestedData('baseLocation', 'country', e.target.value)}
                    placeholder="Nigeria"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Regional Coverage (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {regions.map(region => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={region}
                        checked={data.regionalCoverage.includes(region)}
                        onCheckedChange={() => handleArrayToggle(data.regionalCoverage, region, 'regionalCoverage')}
                      />
                      <Label htmlFor={region} className="text-sm">{region}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-radius">Service Radius (km)</Label>
                <Input
                  id="service-radius"
                  value={data.serviceRadius}
                  onChange={(e) => updateData('serviceRadius', e.target.value)}
                  placeholder="500"
                  type="number"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Partner Classification
              </CardTitle>
              <CardDescription>What type of partner are you and what's your specialty?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Partner Class</Label>
                <div className="grid grid-cols-1 gap-2">
                  {partnerClasses.map(cls => (
                    <div key={cls} className="flex items-center space-x-2">
                      <Checkbox
                        id={cls}
                        checked={data.partnerClass === cls}
                        onCheckedChange={(checked) => checked && updateData('partnerClass', cls)}
                      />
                      <Label htmlFor={cls} className="text-sm">{cls}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Field of Specialty (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {fieldSpecialties.map(specialty => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty}
                        checked={data.fieldSpecialty.includes(specialty)}
                        onCheckedChange={() => handleArrayToggle(data.fieldSpecialty, specialty, 'fieldSpecialty')}
                      />
                      <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Services You Provide & Need
              </CardTitle>
              <CardDescription>What services do you offer and what do you need from us?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Services You Provide (for us)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {servicesProvided.map(service => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={`provided-${service}`}
                        checked={data.servicesProvided.includes(service)}
                        onCheckedChange={() => handleArrayToggle(data.servicesProvided, service, 'servicesProvided')}
                      />
                      <Label htmlFor={`provided-${service}`} className="text-sm">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Services You Need (from us)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {servicesNeeded.map(service => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={`needed-${service}`}
                        checked={data.servicesNeeded.includes(service)}
                        onCheckedChange={() => handleArrayToggle(data.servicesNeeded, service, 'servicesNeeded')}
                      />
                      <Label htmlFor={`needed-${service}`} className="text-sm">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Competence & Capacity
              </CardTitle>
              <CardDescription>Tell us about your team and capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headcount">Total Headcount</Label>
                  <Input
                    id="headcount"
                    value={data.headcount}
                    onChange={(e) => updateData('headcount', e.target.value)}
                    placeholder="25"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekly-capacity">Weekly Capacity (kW/MW)</Label>
                  <Input
                    id="weekly-capacity" 
                    value={data.weeklyCapacity}
                    onChange={(e) => updateData('weeklyCapacity', e.target.value)}
                    placeholder="500 kW"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-projects">Max Concurrent Projects</Label>
                  <Input
                    id="max-projects"
                    value={data.maxConcurrentProjects}
                    onChange={(e) => updateData('maxConcurrentProjects', e.target.value)}
                    placeholder="5"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Last 3 Projects (References)</Label>
                {data.lastThreeProjects.map((project, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded-lg">
                    <Input
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => {
                        const newProjects = [...data.lastThreeProjects];
                        newProjects[index].name = e.target.value;
                        updateData('lastThreeProjects', newProjects);
                      }}
                    />
                    <Input
                      placeholder="Size (kW/MW)"
                      value={project.size}
                      onChange={(e) => {
                        const newProjects = [...data.lastThreeProjects];
                        newProjects[index].size = e.target.value;
                        updateData('lastThreeProjects', newProjects);
                      }}
                    />
                    <Input
                      type="date"
                      value={project.date}
                      onChange={(e) => {
                        const newProjects = [...data.lastThreeProjects];
                        newProjects[index].date = e.target.value;
                        updateData('lastThreeProjects', newProjects);
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Compliance & Certifications
              </CardTitle>
              <CardDescription>Upload your documents and certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Required Documents</h4>
                  {[
                    'Company Registration (CAC/RC)',
                    'Tax Identification (TIN/VAT)',
                    'Insurance Certificate',
                    'ISO Certifications',
                    'Professional Licenses'
                  ].map(doc => (
                    <div key={doc} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{doc}</span>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Sector-Specific Requirements</h4>
                  {data.fieldSpecialty.includes('Offshore / Onshore') && (
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <p className="text-sm font-medium text-accent mb-2">Offshore Requirements:</p>
                      <ul className="text-sm space-y-1">
                        <li>• BOSIET/FOET Certification</li>
                        <li>• Offshore Medical Certificate</li>
                        <li>• ATEX/IECEx Training</li>
                      </ul>
                    </div>
                  )}

                  {data.fieldSpecialty.includes('Oil & Gas sector') && (
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <p className="text-sm font-medium text-destructive mb-2">Oil & Gas Requirements:</p>
                      <ul className="text-sm space-y-1">
                        <li>• DPR Approvals</li>
                        <li>• Hot-Work Permits</li>
                        <li>• Hazardous Area Experience</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Commercial & Payout Details
              </CardTitle>
              <CardDescription>Set up your payment and commission details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input
                    id="account-name"
                    value={data.bankDetails.accountName}
                    onChange={(e) => updateNestedData('bankDetails', 'accountName', e.target.value)}
                    placeholder="ABC Energy Solutions Ltd"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    value={data.bankDetails.accountNumber}
                    onChange={(e) => updateNestedData('bankDetails', 'accountNumber', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    value={data.bankDetails.bankName}
                    onChange={(e) => updateNestedData('bankDetails', 'bankName', e.target.value)}
                    placeholder="First Bank Nigeria"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort-code">Sort Code / Routing Number</Label>
                  <Input
                    id="sort-code"
                    value={data.bankDetails.sortCode}
                    onChange={(e) => updateNestedData('bankDetails', 'sortCode', e.target.value)}
                    placeholder="123456"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <select 
                  id="currency"
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={data.bankDetails.currency}
                  onChange={(e) => updateNestedData('bankDetails', 'currency', e.target.value)}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Commission Structure</h4>
                <ul className="text-sm space-y-1">
                  <li>• Installation Services: 5-10% of project value</li>
                  <li>• Product Sales: 2-15% margin depending on category</li>
                  <li>• Referrals: 2% of successful conversions</li>
                  <li>• Training Delivery: 20-30% of course fees</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Legal & Consent
              </CardTitle>
              <CardDescription>Review and accept the legal requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={data.legalConsents.terms}
                    onCheckedChange={(checked) => updateNestedData('legalConsents', 'terms', checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I accept the <Button variant="link" className="p-0 h-auto">Partner Terms & Conditions</Button>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Includes service agreements, quality standards, and performance expectations
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="data-processing"
                    checked={data.legalConsents.dataProcessing}
                    onCheckedChange={(checked) => updateNestedData('legalConsents', 'dataProcessing', checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="data-processing" className="text-sm leading-relaxed">
                      I consent to data processing under <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      For partner management, payments, and compliance reporting
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="anti-bribery"
                    checked={data.legalConsents.antiBribery}
                    onCheckedChange={(checked) => updateNestedData('legalConsents', 'antiBribery', checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="anti-bribery" className="text-sm leading-relaxed">
                      I attest compliance with Anti-Bribery and Anti-Money Laundering policies
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      No corrupt practices, kickbacks, or suspicious financial activities
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="sanctions"
                    checked={data.legalConsents.sanctions}
                    onCheckedChange={(checked) => updateNestedData('legalConsents', 'sanctions', checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="sanctions" className="text-sm leading-relaxed">
                      I confirm no sanctions, PEP status, or adverse regulatory findings
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Clean compliance record with no legal or regulatory issues
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">ISO Compliance Requirements</h4>
                <p className="text-sm text-muted-foreground">
                  By accepting partnership, you agree to align with ISO 9001 (Quality), ISO 14001 (Environmental), 
                  and ISO 45001 (Health & Safety) management systems where applicable to your services.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Application Summary
              </CardTitle>
              <CardDescription>Review your application before submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-2">Partner Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>ID:</strong> {partnerId}</p>
                      <p><strong>Class:</strong> {data.partnerClass}</p>
                      <p><strong>Location:</strong> {data.baseLocation.city}, {data.baseLocation.country}</p>
                      <p><strong>Coverage:</strong> {data.regionalCoverage.join(', ')}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-2">Services</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Provided:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.servicesProvided.map(service => (
                            <Badge key={service} variant="secondary" className="text-xs">{service}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong>Needed:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.servicesNeeded.map(service => (
                            <Badge key={service} variant="outline" className="text-xs">{service}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-2">Capacity</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Team Size:</strong> {data.headcount} people</p>
                      <p><strong>Weekly Capacity:</strong> {data.weeklyCapacity}</p>
                      <p><strong>Max Projects:</strong> {data.maxConcurrentProjects}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-2">Application Score</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            seriousnessScore >= 15 ? 'bg-success' :
                            seriousnessScore >= 10 ? 'bg-accent' : 'bg-destructive'
                          }`}
                          style={{ width: `${(seriousnessScore / 20) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{seriousnessScore}/20</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {seriousnessScore >= 15 ? 'Excellent - Fast-track approval' :
                       seriousnessScore >= 10 ? 'Good - Standard review process' :
                       'Needs improvement - Additional information required'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                {data.legalConsents.terms && data.legalConsents.dataProcessing && 
                 data.legalConsents.antiBribery && data.legalConsents.sanctions ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="text-sm">
                  {data.legalConsents.terms && data.legalConsents.dataProcessing && 
                   data.legalConsents.antiBribery && data.legalConsents.sanctions
                    ? 'All legal requirements accepted'
                    : 'Please complete all legal consents'}
                </span>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Partner Onboarding</h1>
                <p className="text-muted-foreground">Complete your partner registration</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Partner ID</p>
                <p className="font-mono font-medium">{partnerId}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>Application Score: {seriousnessScore}/20</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep === totalSteps ? (
              <Button 
                onClick={submitOnboarding}
                disabled={
                  seriousnessScore < 10 || 
                  !data.legalConsents.terms || 
                  !data.legalConsents.dataProcessing ||
                  !data.legalConsents.antiBribery || 
                  !data.legalConsents.sanctions
                }
                className="min-w-32"
              >
                Submit Application
              </Button>
            ) : (
              <Button onClick={nextStep} className="min-w-32">
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartnerOnboarding;