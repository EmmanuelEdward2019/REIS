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
import { ArrowRight, ArrowLeft, Users, Building, MapPin, Wrench, ShieldCheck, DollarSign, FileText, CheckCircle, Upload, Zap, Globe, Award, Shield, Phone, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PartnerType = 'company' | 'individual' | '';
type PartnerClass = 'installation-company' | 'individual-installer' | 'marketing-company' | 'individual-marketer' | 'system-integrator' | 'engineering-consultancy' | 'logistics-warehousing' | 'ecommerce-reseller' | 'manufacturer-oem' | 'other' | '';

const BecomeAPartner = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Create Account
    email: '',
    phone: '',
    password: '',
    enable2FA: false,
    privacyNoticeAccepted: false,
    
    // Step 2: Partner Identity
    partnerType: '' as PartnerType,
    legalName: '',
    tradingName: '',
    countryOfRegistration: '',
    registeredAddress: '',
    directorsList: '',
    
    // Step 3: Location & Regional Coverage
    baseCity: '',
    baseState: '',
    baseCountry: '',
    coverageRegions: [] as string[],
    serviceRadius: '',
    serviceAreas: [] as string[],
    
    // Step 4: Partner Class
    partnerClass: '' as PartnerClass,
    otherClassDescription: '',
    
    // Step 5: Field of Specialty
    specialties: [] as string[],
    
    // Step 6: Services They Provide
    servicesProvided: [] as string[],
    productSkus: '',
    
    // Step 7: Services They Need
    servicesNeeded: [] as string[],
    trainingCourses: [] as string[],
    
    // Step 8: Competence & Capacity
    headcount: '',
    techniciansByGrade: '',
    weeklyCapacity: '',
    maxConcurrentProjects: '',
    toolsEquipment: '',
    hsePrograms: false,
    lastThreeProjects: '',
    
    // Step 9: Compliance & Certifications
    companyRegistration: '',
    vatTin: '',
    insurance: '',
    isoCertifications: [] as string[],
    manufacturerCertifications: [] as string[],
    electricalLicense: '',
    tradeLicense: '',
    nationalId: '',
    addressProof: '',
    atexCertifications: false,
    bosietCertification: false,
    dprApprovals: '',
    
    // Step 10: Commercial
    bankDetails: '',
    preferredCurrency: '',
    paymentTerms: '',
    commissionAgreementAccepted: false,
    
    // Step 11: Listings (for sales/marketing partners)
    productListings: [] as any[],
    returnPolicy: '',
    slaCommitments: '',
    mediaUploads: [] as string[],
    
    // Step 12: Legal & Consent
    termsAccepted: false,
    dataConsentAccepted: false,
    antiBriberyAttestation: false,
    sanctionsConfirmation: false,
    
    // Step 13: Summary & Submit (auto-generated fields)
    partnerId: '',
    applicationStatus: 'draft'
  });

  const totalSteps = 13;
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
    { value: 'other', label: 'Other (specify)' }
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
    'Consultation (technical, commercial, regulatory)',
    'Access to product catalog / distribution',
    'Marketing collateral / co-branding',
    'Financing / credit terms'
  ];

  const trainingCoursesOptions = [
    'PV Installer Level 1',
    'PV Installer Level 2',
    'Battery Systems',
    'HV Isolation',
    'SCADA Systems',
    'Hydrogen Safety',
    'Grid Protection',
    'Energy Storage Systems'
  ];

  const regions = ['UK', 'Nigeria', 'ECOWAS', 'EU', 'North America', 'Asia Pacific', 'Middle East', 'Other'];
  const currencies = ['GBP', 'USD', 'EUR', 'NGN', 'Other'];
  const isoStandards = ['ISO 9001', 'ISO 14001', 'ISO 45001'];
  const manufacturerCerts = ['SolarEdge Certified', 'Huawei Certified', 'ABB Certified', 'Schneider Electric', 'Tesla Certified', 'BYD Certified', 'Other'];

  // Branching logic helper functions
  const requiresCompanyFields = () => formData.partnerType === 'company';
  const requiresOffshoreFields = () => formData.specialties.includes('Offshore / Onshore');
  const requiresOilGasFields = () => formData.specialties.includes('Oil & Gas sector');
  const requiresInstallationFields = () => formData.servicesProvided.includes('Installation services');
  const requiresSalesFields = () => formData.servicesProvided.includes('Product sales');
  const requiresNigeriaCompliance = () => formData.coverageRegions.includes('Nigeria');
  const requiresUKCompliance = () => formData.coverageRegions.includes('UK');

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

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.phone && formData.password && formData.privacyNoticeAccepted;
      case 2:
        return formData.partnerType && formData.legalName && formData.countryOfRegistration;
      case 3:
        return formData.baseCity && formData.baseCountry && formData.coverageRegions.length > 0;
      case 4:
        return formData.partnerClass;
      case 5:
        return formData.specialties.length > 0;
      case 6:
        return formData.servicesProvided.length > 0;
      case 7:
        return formData.servicesNeeded.length > 0;
      case 8:
        return formData.headcount && (formData.weeklyCapacity || formData.partnerClass === 'engineering-consultancy');
      case 9:
        if (requiresCompanyFields()) {
          return formData.companyRegistration && formData.vatTin && formData.insurance;
        } else {
          return formData.nationalId && formData.addressProof;
        }
      case 10:
        return formData.bankDetails && formData.preferredCurrency && formData.commissionAgreementAccepted;
      case 11:
        if (requiresSalesFields()) {
          return formData.returnPolicy;
        }
        return true;
      case 12:
        return formData.termsAccepted && formData.dataConsentAccepted && formData.antiBriberyAttestation && formData.sanctionsConfirmation;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!canProceed()) {
      toast({
        title: "Incomplete Application",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Generate Partner ID
    const partnerId = `PTNR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    
    // Update form data with generated Partner ID
    const updatedFormData = {
      ...formData,
      partnerId,
      applicationStatus: 'submitted'
    };

    toast({
      title: "Partner Application Submitted Successfully!",
      description: `Your Partner ID is ${partnerId}. We'll review your application and contact you within 2-3 business days.`,
    });
    
    // Here you would normally submit to your backend
    console.log('Submitted form data:', updatedFormData);
    
    // Move to summary step
    setCurrentStep(13);
    setFormData(updatedFormData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Create Account</h2>
              <p className="text-muted-foreground">Start your partner journey with us</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address (will be verified)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number (OTP verification)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+44 20 1234 5678"
                  required
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
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enable2FA"
                    checked={formData.enable2FA}
                    onCheckedChange={(checked) => handleInputChange('enable2FA', checked)}
                  />
                  <Label htmlFor="enable2FA">Enable Two-Factor Authentication (recommended)</Label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacyNoticeAccepted"
                    checked={formData.privacyNoticeAccepted}
                    onCheckedChange={(checked) => handleInputChange('privacyNoticeAccepted', checked)}
                    required
                  />
                  <Label htmlFor="privacyNoticeAccepted" className="text-sm">
                    I accept the <span className="text-primary underline">Privacy Notice</span> *
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Partner Identity</h2>
              <p className="text-muted-foreground">Tell us about your business structure</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label>Are you registering as?</Label>
                <Select value={formData.partnerType} onValueChange={(value) => handleInputChange('partnerType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select registration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="legalName">
                  {formData.partnerType === 'company' ? 'Legal Company Name' : 'Full Legal Name'}
                </Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  placeholder={formData.partnerType === 'company' ? 'ABC Renewable Energy Ltd' : 'John Smith'}
                  required
                />
              </div>
              
              {formData.partnerType === 'company' && (
                <>
                  <div>
                    <Label htmlFor="tradingName">Trading Name (if different)</Label>
                    <Input
                      id="tradingName"
                      value={formData.tradingName}
                      onChange={(e) => handleInputChange('tradingName', e.target.value)}
                      placeholder="ABC Solar"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="directorsList">Directors/UBO List</Label>
                    <Textarea
                      id="directorsList"
                      value={formData.directorsList}
                      onChange={(e) => handleInputChange('directorsList', e.target.value)}
                      placeholder="List all directors and ultimate beneficial owners..."
                      rows={3}
                    />
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="countryOfRegistration">Country of Registration/Residence</Label>
                <Input
                  id="countryOfRegistration"
                  value={formData.countryOfRegistration}
                  onChange={(e) => handleInputChange('countryOfRegistration', e.target.value)}
                  placeholder="United Kingdom"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="registeredAddress">Registered Address</Label>
                <Textarea
                  id="registeredAddress"
                  value={formData.registeredAddress}
                  onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
                  placeholder="Full registered address..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Location & Regional Coverage</h2>
              <p className="text-muted-foreground">Define your operational areas</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="baseCity">Base Location (City)</Label>
                <Input
                  id="baseCity"
                  value={formData.baseCity}
                  onChange={(e) => handleInputChange('baseCity', e.target.value)}
                  placeholder="London"
                  required
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
                  required
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
              <Label>Regional Coverage (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
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

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Partner Class</h2>
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
            
            {formData.partnerClass === 'other' && (
              <div>
                <Label htmlFor="otherClassDescription">Please specify your partner class</Label>
                <Textarea
                  id="otherClassDescription"
                  value={formData.otherClassDescription}
                  onChange={(e) => handleInputChange('otherClassDescription', e.target.value)}
                  placeholder="Describe your business type..."
                  rows={3}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Field of Specialty</h2>
              <p className="text-muted-foreground">What sectors do you specialize in?</p>
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

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Wrench className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Services You Provide</h2>
              <p className="text-muted-foreground">What services can you offer to us?</p>
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
            
            {requiresSalesFields() && (
              <div>
                <Label htmlFor="productSkus">Product SKUs (list products you can sell)</Label>
                <Textarea
                  id="productSkus"
                  value={formData.productSkus}
                  onChange={(e) => handleInputChange('productSkus', e.target.value)}
                  placeholder="List product names, brands, specifications..."
                  rows={4}
                />
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Services You Need</h2>
              <p className="text-muted-foreground">What support do you need from us?</p>
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
            
            {formData.servicesNeeded.includes('Professional training') && (
              <div>
                <Label>Training Courses Needed</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {trainingCoursesOptions.map((course) => (
                    <div key={course} className="flex items-center space-x-2">
                      <Checkbox
                        id={`course-${course}`}
                        checked={formData.trainingCourses.includes(course)}
                        onCheckedChange={() => handleArrayToggle('trainingCourses', course)}
                      />
                      <Label htmlFor={`course-${course}`}>{course}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Competence & Capacity</h2>
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
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="techniciansByGrade">Technicians by Grade/Level</Label>
                <Input
                  id="techniciansByGrade"
                  value={formData.techniciansByGrade}
                  onChange={(e) => handleInputChange('techniciansByGrade', e.target.value)}
                  placeholder="L1: 5, L2: 3, L3: 2"
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
              
              <div>
                <Label htmlFor="maxConcurrentProjects">Max Concurrent Projects</Label>
                <Input
                  id="maxConcurrentProjects"
                  type="number"
                  value={formData.maxConcurrentProjects}
                  onChange={(e) => handleInputChange('maxConcurrentProjects', e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="toolsEquipment">Tools & Equipment Owned</Label>
              <Textarea
                id="toolsEquipment"
                value={formData.toolsEquipment}
                onChange={(e) => handleInputChange('toolsEquipment', e.target.value)}
                placeholder="List your major tools and equipment..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="lastThreeProjects">Last Three Projects (Name, Size, Date, Customer)</Label>
              <Textarea
                id="lastThreeProjects"
                value={formData.lastThreeProjects}
                onChange={(e) => handleInputChange('lastThreeProjects', e.target.value)}
                placeholder="Project 1: ABC Solar Farm, 2MW, Jan 2024, XYZ Company..."
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hsePrograms"
                checked={formData.hsePrograms}
                onCheckedChange={(checked) => handleInputChange('hsePrograms', checked)}
              />
              <Label htmlFor="hsePrograms">We have established HSE (Health, Safety & Environment) programs</Label>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Compliance & Certifications</h2>
              <p className="text-muted-foreground">Legal and regulatory requirements</p>
            </div>
            
            {requiresCompanyFields() ? (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Company Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyRegistration">
                      {requiresNigeriaCompliance() ? 'CAC/RC Number' : requiresUKCompliance() ? 'Companies House Number' : 'Company Registration Number'}
                    </Label>
                    <Input
                      id="companyRegistration"
                      value={formData.companyRegistration}
                      onChange={(e) => handleInputChange('companyRegistration', e.target.value)}
                      placeholder="RC123456 or 12345678"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="vatTin">VAT/TIN Number</Label>
                    <Input
                      id="vatTin"
                      value={formData.vatTin}
                      onChange={(e) => handleInputChange('vatTin', e.target.value)}
                      placeholder="VAT/TIN number"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Individual Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nationalId">National ID/Passport</Label>
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      placeholder="National ID or Passport number"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="addressProof">Proof of Address</Label>
                    <Input
                      id="addressProof"
                      value={formData.addressProof}
                      onChange={(e) => handleInputChange('addressProof', e.target.value)}
                      placeholder="Upload utility bill or bank statement"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="insurance">Insurance Coverage</Label>
                <Input
                  id="insurance"
                  value={formData.insurance}
                  onChange={(e) => handleInputChange('insurance', e.target.value)}
                  placeholder="Policy number and coverage amount"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="electricalLicense">Electrical License (if applicable)</Label>
                <Input
                  id="electricalLicense"
                  value={formData.electricalLicense}
                  onChange={(e) => handleInputChange('electricalLicense', e.target.value)}
                  placeholder="License number"
                />
              </div>
            </div>
            
            <div>
              <Label>ISO Certifications</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {isoStandards.map((iso) => (
                  <div key={iso} className="flex items-center space-x-2">
                    <Checkbox
                      id={iso}
                      checked={formData.isoCertifications.includes(iso)}
                      onCheckedChange={() => handleArrayToggle('isoCertifications', iso)}
                    />
                    <Label htmlFor={iso}>{iso}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Manufacturer Certifications</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {manufacturerCerts.map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={formData.manufacturerCertifications.includes(cert)}
                      onCheckedChange={() => handleArrayToggle('manufacturerCertifications', cert)}
                    />
                    <Label htmlFor={cert}>{cert}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {(requiresOffshoreFields() || requiresOilGasFields()) && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Sector-Specific Requirements</h3>
                
                {requiresOffshoreFields() && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bosietCertification"
                      checked={formData.bosietCertification}
                      onCheckedChange={(checked) => handleInputChange('bosietCertification', checked)}
                    />
                    <Label htmlFor="bosietCertification">BOSIET/FOET Certification</Label>
                  </div>
                )}
                
                {(requiresOffshoreFields() || requiresOilGasFields()) && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="atexCertifications"
                      checked={formData.atexCertifications}
                      onCheckedChange={(checked) => handleInputChange('atexCertifications', checked)}
                    />
                    <Label htmlFor="atexCertifications">ATEX/IECEx Certifications</Label>
                  </div>
                )}
                
                {requiresOilGasFields() && (
                  <div>
                    <Label htmlFor="dprApprovals">DPR/NUC Approvals (if applicable)</Label>
                    <Input
                      id="dprApprovals"
                      value={formData.dprApprovals}
                      onChange={(e) => handleInputChange('dprApprovals', e.target.value)}
                      placeholder="Approval numbers"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Commercial Terms</h2>
              <p className="text-muted-foreground">Payment and commercial arrangements</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bankDetails">Bank/Payee Details</Label>
                <Textarea
                  id="bankDetails"
                  value={formData.bankDetails}
                  onChange={(e) => handleInputChange('bankDetails', e.target.value)}
                  placeholder="Bank name, account number, sort code/routing number..."
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label>Preferred Currency</Label>
                <Select value={formData.preferredCurrency} onValueChange={(value) => handleInputChange('preferredCurrency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="paymentTerms">Preferred Payment Terms</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-30">Net 30 days</SelectItem>
                    <SelectItem value="net-15">Net 15 days</SelectItem>
                    <SelectItem value="net-7">Net 7 days</SelectItem>
                    <SelectItem value="upon-completion">Upon project completion</SelectItem>
                    <SelectItem value="milestone-based">Milestone-based payments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="commissionAgreementAccepted"
                checked={formData.commissionAgreementAccepted}
                onCheckedChange={(checked) => handleInputChange('commissionAgreementAccepted', checked)}
              />
              <Label htmlFor="commissionAgreementAccepted" className="text-sm">
                I accept the <span className="text-primary underline">Commission Agreement</span> terms *
              </Label>
            </div>
          </div>
        );
        
      case 11:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Product Listings</h2>
              <p className="text-muted-foreground">For sales and marketing partners</p>
            </div>
            
            {requiresSalesFields() ? (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="returnPolicy">Return Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={(e) => handleInputChange('returnPolicy', e.target.value)}
                    placeholder="Describe your return and warranty policy..."
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="slaCommitments">Service Level Commitments</Label>
                  <Textarea
                    id="slaCommitments"
                    value={formData.slaCommitments}
                    onChange={(e) => handleInputChange('slaCommitments', e.target.value)}
                    placeholder="Delivery times, response times, support commitments..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label>Product Media Uploads</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload product images, datasheets, and documentation</p>
                    <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, PNG (Max 5MB each)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Product Listings Required</h3>
                <p className="text-gray-500">Based on your selected services, product listings are not required.</p>
              </div>
            )}
          </div>
        );

      case 12:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Legal & Consent</h2>
              <p className="text-muted-foreground">Final legal confirmations</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                  className="mt-1"
                />
                <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
                  I accept the <span className="text-primary underline cursor-pointer">Partner Terms & Conditions</span> *
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="dataConsentAccepted"
                  checked={formData.dataConsentAccepted}
                  onCheckedChange={(checked) => handleInputChange('dataConsentAccepted', checked)}
                  className="mt-1"
                />
                <Label htmlFor="dataConsentAccepted" className="text-sm leading-relaxed">
                  I consent to the processing of my data as described in the <span className="text-primary underline cursor-pointer">Data Processing Agreement</span> *
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="antiBriberyAttestation"
                  checked={formData.antiBriberyAttestation}
                  onCheckedChange={(checked) => handleInputChange('antiBriberyAttestation', checked)}
                  className="mt-1"
                />
                <Label htmlFor="antiBriberyAttestation" className="text-sm leading-relaxed">
                  I attest that my organization complies with all applicable anti-bribery and anti-money laundering laws *
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="sanctionsConfirmation"
                  checked={formData.sanctionsConfirmation}
                  onCheckedChange={(checked) => handleInputChange('sanctionsConfirmation', checked)}
                  className="mt-1"
                />
                <Label htmlFor="sanctionsConfirmation" className="text-sm leading-relaxed">
                  I confirm that neither I nor my organization are subject to any sanctions or are politically exposed persons (PEPs) *
                </Label>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> All fields marked with * are mandatory. Your application will be reviewed by our compliance team within 2-3 business days. You will receive email updates on your application status.
              </p>
            </div>
          </div>
        );

      case 13:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
              <p className="text-muted-foreground">Your partner application has been received</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800 mb-2">
                  Partner ID: {formData.partnerId}
                </div>
                <p className="text-green-700 mb-4">
                  Please save this Partner ID for your records. You will need it for all future communications.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white rounded-lg">
                  <Phone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Email Verification</h3>
                  <p className="text-sm text-gray-600">Check your email for verification link</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg">
                  <Shield className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <h3 className="font-semibold">KYC Review</h3>
                  <p className="text-sm text-gray-600">1-2 business days</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Account Activation</h3>
                  <p className="text-sm text-gray-600">2-3 business days</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Questions about your application? Contact our partner support team.
              </p>
              <Button variant="outline" asChild>
                <a href="mailto:partners@company.com">Contact Partner Support</a>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Partner Registration</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Become a Partner
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our global network of renewable energy professionals and grow your business with industry-leading support.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Form Card */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                {renderStep()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  {currentStep > 1 && currentStep < 13 && (
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < 12 && (
                    <Button 
                      onClick={nextStep} 
                      disabled={!canProceed()}
                      className={currentStep === 1 ? "ml-auto" : ""}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  
                  {currentStep === 12 && (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!canProceed()}
                      className="bg-gradient-to-r from-primary to-accent hover:shadow-lg"
                    >
                      Submit Application
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BecomeAPartner;