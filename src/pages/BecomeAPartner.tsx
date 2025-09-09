import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Users, Building, MapPin, Wrench, ShieldCheck, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PartnerType = 'company' | 'individual' | '';
type PartnerClass = 'installation-company' | 'individual-installer' | 'marketing-company' | 'individual-marketer' | 'system-integrator' | 'engineering-consultancy' | 'logistics-warehousing' | 'ecommerce-reseller' | 'manufacturer-oem' | 'other' | '';

const BecomeAPartner = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account & Identity
    email: '',
    phone: '',
    password: '',
    partnerType: '' as PartnerType,
    legalName: '',
    tradingName: '',
    country: '',
    
    // Location & Coverage
    baseCity: '',
    baseState: '',
    baseCountry: '',
    coverageRegions: [] as string[],
    serviceRadius: '',
    
    // Partner Class & Specialty
    partnerClass: '' as PartnerClass,
    specialties: [] as string[],
    
    // Services
    servicesProvided: [] as string[],
    servicesNeeded: [] as string[],
    
    // Capacity & Competence
    headcount: '',
    weeklyCapacity: '',
    tools: '',
    lastThreeProjects: '',
    hseProgram: false,
    
    // Compliance & Certifications
    companyRegistration: '',
    vatTin: '',
    insurance: '',
    certifications: [] as string[],
    
    // Commercial
    bankDetails: '',
    preferredCurrency: '',
    paymentTerms: '',
    
    // Legal & Consent
    termsAccepted: false,
    dataConsentAccepted: false,
    antiBriberyAttestation: false,
    sanctionsConfirmation: false
  });

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const partnerClasses = [
    { value: 'installation-company', label: 'Renewable Energy Installation Company' },
    { value: 'individual-installer', label: 'Individual Installer' },
    { value: 'marketing-company', label: 'Renewable Products Marketing Company' },
    { value: 'individual-marketer', label: 'Individual Products Marketer' },
    { value: 'system-integrator', label: 'System Integrator / Contractor' },
    { value: 'engineering-consultancy', label: 'Engineering/Consultancy' },
    { value: 'logistics-warehousing', label: 'Logistics / Warehousing' },
    { value: 'ecommerce-reseller', label: 'E-commerce Reseller' },
    { value: 'manufacturer-oem', label: 'Manufacturer / OEM' },
    { value: 'other', label: 'Other' }
  ];

  const specialties = [
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

  const servicesProvidedOptions = [
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

  const servicesNeededOptions = [
    'Professional training',
    'E-commerce services',
    'Consultation',
    'Access to product catalog',
    'Marketing collateral',
    'Financing / credit terms'
  ];

  const regions = ['UK', 'Nigeria', 'ECOWAS', 'EU', 'Other'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Partner Application Submitted",
      description: "Your application has been submitted for review. We'll contact you within 2-3 business days.",
    });
    // Here you would normally submit to your backend
    console.log('Submitted form data:', formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Account & Identity</h2>
              <p className="text-muted-foreground">Let's start with your basic information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+44 20 1234 5678"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                />
              </div>
              
              <div>
                <Label>Partner Type</Label>
                <Select value={formData.partnerType} onValueChange={(value) => handleInputChange('partnerType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select partner type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="legalName">
                  {formData.partnerType === 'company' ? 'Legal Company Name' : 'Full Name'}
                </Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  placeholder={formData.partnerType === 'company' ? 'ABC Renewable Energy Ltd' : 'John Smith'}
                />
              </div>
              
              {formData.partnerType === 'company' && (
                <div>
                  <Label htmlFor="tradingName">Trading Name (Optional)</Label>
                  <Input
                    id="tradingName"
                    value={formData.tradingName}
                    onChange={(e) => handleInputChange('tradingName', e.target.value)}
                    placeholder="ABC Solar"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Location & Coverage</h2>
              <p className="text-muted-foreground">Tell us about your location and service areas</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="baseCity">Base City</Label>
                <Input
                  id="baseCity"
                  value={formData.baseCity}
                  onChange={(e) => handleInputChange('baseCity', e.target.value)}
                  placeholder="London"
                />
              </div>
              
              <div>
                <Label htmlFor="baseState">State/Region</Label>
                <Input
                  id="baseState"
                  value={formData.baseState}
                  onChange={(e) => handleInputChange('baseState', e.target.value)}
                  placeholder="England"
                />
              </div>
              
              <div>
                <Label htmlFor="baseCountry">Country</Label>
                <Input
                  id="baseCountry"
                  value={formData.baseCountry}
                  onChange={(e) => handleInputChange('baseCountry', e.target.value)}
                  placeholder="United Kingdom"
                />
              </div>
              
              <div>
                <Label htmlFor="serviceRadius">Service Radius (km)</Label>
                <Input
                  id="serviceRadius"
                  type="number"
                  value={formData.serviceRadius}
                  onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
            
            <div>
              <Label>Coverage Regions (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {regions.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox
                      id={region}
                      checked={formData.coverageRegions.includes(region)}
                      onCheckedChange={() => handleArrayToggle('coverageRegions', region)}
                    />
                    <Label htmlFor={region}>{region}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Partner Class & Specialty</h2>
              <p className="text-muted-foreground">What type of partner are you?</p>
            </div>
            
            <div>
              <Label>Partner Class</Label>
              <Select value={formData.partnerClass} onValueChange={(value) => handleInputChange('partnerClass', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your partner class" />
                </SelectTrigger>
                <SelectContent>
                  {partnerClasses.map((cls) => (
                    <SelectItem key={cls.value} value={cls.value}>
                      {cls.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Field of Specialty (Select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={formData.specialties.includes(specialty)}
                      onCheckedChange={() => handleArrayToggle('specialties', specialty)}
                    />
                    <Label htmlFor={specialty}>{specialty}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Wrench className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Services</h2>
              <p className="text-muted-foreground">What services do you provide and need?</p>
            </div>
            
            <div>
              <Label>Services You Provide (Select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {servicesProvidedOptions.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`provided-${service}`}
                      checked={formData.servicesProvided.includes(service)}
                      onCheckedChange={() => handleArrayToggle('servicesProvided', service)}
                    />
                    <Label htmlFor={`provided-${service}`}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Services You Need (Select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {servicesNeededOptions.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`needed-${service}`}
                      checked={formData.servicesNeeded.includes(service)}
                      onCheckedChange={() => handleArrayToggle('servicesNeeded', service)}
                    />
                    <Label htmlFor={`needed-${service}`}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Capacity & Competence</h2>
              <p className="text-muted-foreground">Tell us about your capabilities</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="headcount">Team Size/Headcount</Label>
                <Input
                  id="headcount"
                  type="number"
                  value={formData.headcount}
                  onChange={(e) => handleInputChange('headcount', e.target.value)}
                  placeholder="10"
                />
              </div>
              
              <div>
                <Label htmlFor="weeklyCapacity">Weekly Install Capacity (kW/MW)</Label>
                <Input
                  id="weeklyCapacity"
                  value={formData.weeklyCapacity}
                  onChange={(e) => handleInputChange('weeklyCapacity', e.target.value)}
                  placeholder="500 kW"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="tools">Tools & Equipment Owned</Label>
              <Textarea
                id="tools"
                value={formData.tools}
                onChange={(e) => handleInputChange('tools', e.target.value)}
                placeholder="List your major tools and equipment..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="lastThreeProjects">Last Three Projects (Name, Size, Date)</Label>
              <Textarea
                id="lastThreeProjects"
                value={formData.lastThreeProjects}
                onChange={(e) => handleInputChange('lastThreeProjects', e.target.value)}
                placeholder="Project 1: ABC Solar Farm, 2MW, Jan 2024..."
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hseProgram"
                checked={formData.hseProgram}
                onCheckedChange={(checked) => handleInputChange('hseProgram', checked)}
              />
              <Label htmlFor="hseProgram">We have established HSE (Health, Safety & Environment) programs</Label>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Compliance & Certifications</h2>
              <p className="text-muted-foreground">Legal and regulatory requirements</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyRegistration">
                  {formData.partnerType === 'company' ? 'Company Registration Number' : 'National ID/Passport'}
                </Label>
                <Input
                  id="companyRegistration"
                  value={formData.companyRegistration}
                  onChange={(e) => handleInputChange('companyRegistration', e.target.value)}
                  placeholder={formData.partnerType === 'company' ? 'RC123456 or 12345678' : 'A1234567 or 12345678'}
                />
              </div>
              
              <div>
                <Label htmlFor="vatTin">VAT/TIN Number</Label>
                <Input
                  id="vatTin"
                  value={formData.vatTin}
                  onChange={(e) => handleInputChange('vatTin', e.target.value)}
                  placeholder="GB123456789 or 12345678-0001"
                />
              </div>
              
              <div>
                <Label htmlFor="insurance">Insurance Details</Label>
                <Input
                  id="insurance"
                  value={formData.insurance}
                  onChange={(e) => handleInputChange('insurance', e.target.value)}
                  placeholder="Policy number and coverage amount"
                />
              </div>
            </div>
            
            <div>
              <Label>Professional Certifications</Label>
              <Textarea
                value={formData.certifications.join('\n')}
                onChange={(e) => handleInputChange('certifications', e.target.value.split('\n').filter(Boolean))}
                placeholder="List your certifications (one per line)..."
                rows={4}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Commercial Details</h2>
              <p className="text-muted-foreground">Payment and financial information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bankDetails">Bank Account Details</Label>
                <Textarea
                  id="bankDetails"
                  value={formData.bankDetails}
                  onChange={(e) => handleInputChange('bankDetails', e.target.value)}
                  placeholder="Bank name, account number, sort code/routing number..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                <Select value={formData.preferredCurrency} onValueChange={(value) => handleInputChange('preferredCurrency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="paymentTerms">Preferred Payment Terms</Label>
              <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net-15">Net 15 days</SelectItem>
                  <SelectItem value="net-30">Net 30 days</SelectItem>
                  <SelectItem value="net-45">Net 45 days</SelectItem>
                  <SelectItem value="net-60">Net 60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Legal & Consent</h2>
              <p className="text-muted-foreground">Final agreements and submissions</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  I accept the Partner Terms & Conditions and Commission Agreement
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="dataConsentAccepted"
                  checked={formData.dataConsentAccepted}
                  onCheckedChange={(checked) => handleInputChange('dataConsentAccepted', checked)}
                />
                <Label htmlFor="dataConsentAccepted" className="text-sm">
                  I consent to data processing for partner management and business operations
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="antiBriberyAttestation"
                  checked={formData.antiBriberyAttestation}
                  onCheckedChange={(checked) => handleInputChange('antiBriberyAttestation', checked)}
                />
                <Label htmlFor="antiBriberyAttestation" className="text-sm">
                  I attest compliance with anti-bribery and anti-money laundering regulations
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="sanctionsConfirmation"
                  checked={formData.sanctionsConfirmation}
                  onCheckedChange={(checked) => handleInputChange('sanctionsConfirmation', checked)}
                />
                <Label htmlFor="sanctionsConfirmation" className="text-sm">
                  I confirm that I am not on any sanctions list or a Politically Exposed Person (PEP)
                </Label>
              </div>
            </div>
            
            <div className="bg-secondary/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Partner Type:</span> {formData.partnerType}
                </div>
                <div>
                  <span className="font-medium">Partner Class:</span> {formData.partnerClass}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {formData.baseCity}, {formData.baseCountry}
                </div>
                <div>
                  <span className="font-medium">Team Size:</span> {formData.headcount || 'Not specified'}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.phone && formData.partnerType && formData.legalName;
      case 2:
        return formData.baseCity && formData.baseCountry && formData.coverageRegions.length > 0;
      case 3:
        return formData.partnerClass && formData.specialties.length > 0;
      case 4:
        return formData.servicesProvided.length > 0;
      case 5:
        return formData.headcount && formData.weeklyCapacity;
      case 6:
        return formData.companyRegistration && formData.insurance;
      case 7:
        return formData.bankDetails && formData.preferredCurrency;
      case 8:
        return formData.termsAccepted && formData.dataConsentAccepted && formData.antiBriberyAttestation && formData.sanctionsConfirmation;
      default:
        return true;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Become a Partner</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our global network of renewable energy professionals and grow your business with us
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Form Card */}
          <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              {renderStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex items-center"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="flex items-center bg-gradient-to-r from-primary to-accent"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BecomeAPartner;