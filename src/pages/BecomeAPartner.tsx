import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Users, Building, MapPin, Wrench, ShieldCheck, DollarSign, FileText, CheckCircle, Upload, Zap, Globe, Award, Shield, Phone, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileUpload } from '@/components/ui/file-upload';
import { uploadFiles, UploadedFile } from '@/utils/fileUpload';

type PartnerType = 'company' | 'individual' | '';
type PartnerClass = 'installation-company' | 'individual-installer' | 'marketing-company' | 'individual-marketer' | 'system-integrator' | 'engineering-consultancy' | 'logistics-warehousing' | 'ecommerce-reseller' | 'manufacturer-oem' | 'other' | '';
type PartnerCountry = 'NG' | 'UK' | '';
type PartnerCategory = 'installer' | 'sales' | '';

const BecomeAPartner = () => {
  const { toast } = useToast();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [progressSaved, setProgressSaved] = useState(false);

  // LocalStorage key for saving progress
  const STORAGE_KEY = 'partner_application_progress';

  // Form data state - must be declared before useEffects that reference it
  const [formData, setFormData] = useState({
    // Step 0: Country & Category
    partnerCountry: '' as PartnerCountry,
    partnerCategory: '' as PartnerCategory,
    policyAccepted: false,
    nin: '',
    ninVerified: false,
    // Step 1: Create Account
    email: '',
    phone: '',
    phoneVerified: false,
    otpCode: '',
    otpSent: false,
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
    primaryContact: '',
    primaryContactEmail: '',
    primaryContactPhone: '',

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
    hseWorkingAtHeight: false,
    hseLOTO: false,
    hseFirstAid: false,
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
    addressProofFiles: [] as UploadedFile[],
    mcsNumbers: '',
    eoriNumber: '',
    atexCertifications: false,
    bosietCertification: false,
    dprApprovals: '',

    // Step 10: Commercial
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankSortCode: '',
    bankSwiftBic: '',
    preferredCurrency: '',
    paymentTerms: '',
    commissionAgreementAccepted: false,
    feesAcknowledged: false,
    payoutPolicyAccepted: false,

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
    nonCircumventionAccepted: false,

    // Step 13: Summary & Submit (auto-generated fields)
    partnerId: '',
    applicationStatus: 'draft'
  });

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        const { formData: savedFormData, step } = JSON.parse(savedProgress);
        if (savedFormData) {
          // Don't restore password for security
          const { password, ...restData } = savedFormData;
          setFormData(prev => ({
            ...prev,
            ...restData,
            password: '' // Clear password
          }));
          setCurrentStep(step || 0);
          toast({
            title: "Progress Restored",
            description: "Your previous progress has been loaded. You can continue where you left off.",
          });
        }
      }
    } catch (e) {
      console.error('Error loading saved progress:', e);
    }
  }, []);

  // Auto-save progress to localStorage whenever formData or currentStep changes
  useEffect(() => {
    const saveProgress = () => {
      try {
        // Don't save password
        const { password, ...dataToSave } = formData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          formData: dataToSave,
          step: currentStep,
          savedAt: new Date().toISOString()
        }));
        setProgressSaved(true);
        setTimeout(() => setProgressSaved(false), 2000);
      } catch (e) {
        console.error('Error saving progress:', e);
      }
    };

    // Debounce save to avoid too frequent writes
    const timeoutId = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, currentStep]);

  // Clear saved progress after successful submission
  const clearSavedProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing saved progress:', e);
    }
  };

  // Check if user is already logged in and has an application
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (user) {
        const { data, error } = await (supabase as any)
          .from('partner_applications')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setExistingApplication(data);
          // If application is already submitted, redirect to partner dashboard
          if (data.application_status !== 'draft') {
            toast({
              title: "Application Already Submitted",
              description: "Redirecting to your partner dashboard...",
            });
            setTimeout(() => navigate('/partners-dashboard'), 2000);
          }
        }
      }
    };
    checkExistingApplication();
  }, [user, navigate, toast]);

  const totalSteps = 14;
  const getPolicyLink = () => {
    if (formData.partnerCountry === 'NG' && formData.partnerCategory === 'installer') {
      return '/partners/Eagle_Thistle_Installer_Service_Partner_Policy_Nigeria.docx';
    }
    if (formData.partnerCountry === 'UK' && formData.partnerCategory === 'installer') {
      return '/partners/Eagle_Thistle_Installer_Service_Partner_Policy_UK.docx';
    }
    if (formData.partnerCountry === 'NG' && formData.partnerCategory === 'sales') {
      return '/partners/Eagle_Thistle_sales_Partner_Policy_One_Pager Nigeria.pdf';
    }
    if (formData.partnerCountry === 'UK' && formData.partnerCategory === 'sales') {
      return '/partners/Eagle_Thistle_UK_Sales_Partner_Policy_One_Pager.docx';
    }
    return '';
  };

  const getRegistrationFormLink = () => {
    if (formData.partnerCountry === 'NG' && formData.partnerCategory === 'installer') {
      return '/partners/Eagle_Thistle_Installer_Service_Partner_Registration_Form_Nigeria.docx';
    }
    if (formData.partnerCountry === 'UK' && formData.partnerCategory === 'installer') {
      return '/partners/Eagle_Thistle_Installer_Service_Partner_Registration_Form_UK.docx';
    }
    if (formData.partnerCountry === 'NG' && formData.partnerCategory === 'sales') {
      return '/partners/Eagle_Thistle_Sales_Partner_Registration_Form Nigeria.docx';
    }
    if (formData.partnerCountry === 'UK' && formData.partnerCategory === 'sales') {
      return '/partners/Eagle_Thistle_UK_Sales_Partner_Registration_Form.docx';
    }
    return '';
  };

  const verifyNIN = async () => {
    // Validate NIN format (Nigerian NIN is exactly 11 digits)
    if (!formData.nin || !isValidNIN(formData.nin)) {
      toast({
        title: 'Invalid NIN Format',
        description: 'Nigerian NIN must be exactly 11 digits.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Mock NIN verification - records NIN for admin manual verification
      // In production, integrate with VerifyMe, YouVerify, or Smile Identity API
      await new Promise(resolve => setTimeout(resolve, 1500));

      handleInputChange('ninVerified', true);
      toast({
        title: 'NIN Recorded',
        description: 'Your NIN has been recorded and will be verified by our team during KYC review.'
      });
    } catch (e) {
      handleInputChange('ninVerified', false);
      toast({
        title: 'Verification Error',
        description: 'Unable to process NIN. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOTP = async () => {
    if (!formData.phone || !isValidPhone(formData.phone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Mock OTP sending - In production, use Twilio, Africa's Talking, or similar
      await new Promise(resolve => setTimeout(resolve, 1000));

      handleInputChange('otpSent', true);
      toast({
        title: 'OTP Sent',
        description: `A verification code has been sent to ${formData.phone}. For demo: use code 123456`
      });
    } catch (e) {
      toast({
        title: 'Failed to Send OTP',
        description: 'Unable to send verification code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOTP = async () => {
    if (!formData.otpCode || formData.otpCode.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit verification code.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Mock OTP verification - accepts "123456" for demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (formData.otpCode === '123456') {
        handleInputChange('phoneVerified', true);
        toast({
          title: 'Phone Verified',
          description: 'Your phone number has been verified successfully.'
        });
      } else {
        toast({
          title: 'Invalid Code',
          description: 'The verification code is incorrect. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (e) {
      toast({
        title: 'Verification Failed',
        description: 'Unable to verify code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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
  const requiresProductListings = () => {
    // Show product listings for sales partners, manufacturers, and e-commerce resellers
    return formData.partnerCategory === 'sales' ||
      formData.partnerClass === 'manufacturer-oem' ||
      formData.partnerClass === 'ecommerce-reseller' ||
      formData.servicesProvided.includes('Product sales');
  };
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

  const handleFileUpload = async (files: File[], field: string) => {
    if (!user) {
      toast({ title: 'Error', description: 'Please log in to upload files', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const uploadedFiles = await uploadFiles(files, 'partner-documents', user.id);

      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof typeof prev] as UploadedFile[]), ...uploadedFiles]
      }));

      toast({ title: 'Success', description: `${files.length} file(s) uploaded successfully` });
    } catch (error: any) {
      console.error('File upload error:', error);
      toast({ title: 'Upload Failed', description: error.message || 'Failed to upload files', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileRemove = (field: string, index: number) => {
    setFormData(prev => {
      const currentFiles = prev[field as keyof typeof prev] as UploadedFile[];
      return {
        ...prev,
        [field]: currentFiles.filter((_, i) => i !== index)
      };
    });
  };

  // Validation helpers
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[+]?[0-9]{10,15}$/.test(phone.replace(/[\s-]/g, ''));
  const isValidNIN = (nin: string) => /^[0-9]{11}$/.test(nin);
  const isValidPassword = (password: string) => password.length >= 8;

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        // Require country, category, policy acceptance
        if (!formData.partnerCountry || !formData.partnerCategory) return false;
        if (!formData.policyAccepted) return false;
        // For Nigeria, require NIN (verification is optional for now - admin can verify manually)
        if (formData.partnerCountry === 'NG' && !formData.nin) return false;
        return true;
      case 1:
        // Create Account - validate email, phone, password
        if (!formData.email || !isValidEmail(formData.email)) return false;
        if (!formData.phone || !isValidPhone(formData.phone)) return false;
        if (!formData.password || !isValidPassword(formData.password)) return false;
        if (!formData.privacyNoticeAccepted) return false;
        return true;
      case 2:
        // Dynamic registration - require core identity fields
        if (!formData.legalName) return false;
        // For company type, require registration number
        if (formData.partnerType === 'company' && !formData.companyRegistration) return false;
        return true;
      case 3:
        return formData.baseCity && formData.baseCountry && formData.coverageRegions.length > 0;
      case 4:
        return !!formData.partnerClass;
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
          return formData.nationalId && formData.addressProofFiles.length > 0;
        }
      case 10:
        return formData.bankName && formData.bankAccountNumber && formData.preferredCurrency && formData.commissionAgreementAccepted;
      case 11:
        if (requiresProductListings()) {
          return formData.productSkus && formData.returnPolicy;
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

  const handleSubmit = async () => {
    if (!canProceed()) {
      toast({
        title: "Incomplete Application",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let userId = user?.id;

      // Step 1: Create auth account if not logged in
      if (!user) {
        const { data: authData, error: authError } = await signUp(
          formData.email,
          formData.password,
          {
            full_name: formData.partnerType === 'individual'
              ? `${formData.legalName}`
              : formData.primaryContact,
            user_role: 'partner',
            phone: formData.phone,
          }
        );

        if (authError) {
          throw new Error(authError.message);
        }

        userId = authData?.user?.id;
      }

      if (!userId) {
        throw new Error('Failed to create user account');
      }

      // Step 2: Prepare partner application data
      const applicationData = {
        user_id: userId,
        application_status: 'submitted',
        submission_date: new Date().toISOString(),

        // Basic Information
        partner_type: formData.partnerType,
        partner_country: formData.partnerCountry,
        partner_category: formData.partnerCategory,
        legal_name: formData.legalName,
        trading_name: formData.tradingName || null,

        // Contact Information
        email: formData.email,
        phone: formData.phone,
        website: null,
        address: {
          street: formData.registeredAddress,
          city: formData.baseCity,
          state: formData.baseState,
          country: formData.baseCountry,
        },

        // Company Details
        registration_number: formData.companyRegistration || null,
        tax_id: formData.vatTin || null,

        // Individual Details
        first_name: formData.partnerType === 'individual' ? formData.legalName.split(' ')[0] : null,
        last_name: formData.partnerType === 'individual' ? formData.legalName.split(' ').slice(1).join(' ') : null,
        national_id: formData.nationalId || null,

        // Business Profile
        service_areas: formData.serviceAreas,

        // Capabilities & Certifications
        services_provided: formData.servicesProvided,
        certifications: formData.isoCertifications.concat(formData.manufacturerCertifications),

        // Financial Information
        bank_name: formData.bankName || null,
        bank_account_number: formData.bankAccountNumber || null,
        bank_routing_number: formData.bankSortCode || null,
        bank_swift_code: formData.bankSwiftBic || null,
        payment_terms: formData.paymentTerms || null,

        // Insurance & Compliance
        health_safety_policy: formData.hsePrograms,

        // Agreement & Terms
        terms_accepted: formData.termsAccepted,
        terms_accepted_at: formData.termsAccepted ? new Date().toISOString() : null,
        privacy_accepted: formData.privacyNoticeAccepted,
        privacy_accepted_at: formData.privacyNoticeAccepted ? new Date().toISOString() : null,
        code_of_conduct_accepted: formData.antiBriberyAttestation,

        // KYC Status
        kyc_status: 'pending',
      };

      // Step 3: Insert partner application
      const { data: partnerData, error: partnerError } = await supabase
        .from('partner_applications')
        .insert([applicationData])
        .select()
        .single();

      if (partnerError) {
        throw new Error(partnerError.message);
      }

      // Step 4: Update profile with partner role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          user_role: 'partner',
          partner_category: formData.partnerCategory,
          is_verified: false,
        })
        .eq('user_id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      toast({
        title: "Partner Application Submitted Successfully!",
        description: `Your Partner ID is ${partnerData.partner_id}. We'll review your application and contact you within 2-3 business days.`,
      });

      // Clear saved progress from localStorage
      clearSavedProgress();

      // Redirect to partner dashboard after 2 seconds
      setTimeout(() => {
        navigate('/partners-dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Start Your Onboarding</h2>
              <p className="text-muted-foreground">Select your country and partner category</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Country</Label>
                <Select value={formData.partnerCountry} onValueChange={(value) => handleInputChange('partnerCountry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NG">Nigeria</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Partner Category</Label>
                <Select value={formData.partnerCategory} onValueChange={(value) => handleInputChange('partnerCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installer">Installer / Service</SelectItem>
                    <SelectItem value="sales">Sales / Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="self-end text-sm text-muted-foreground">
                Registration will be completed online below.
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="policyAccepted"
                  checked={formData.policyAccepted}
                  onCheckedChange={(checked) => handleInputChange('policyAccepted', checked)}
                  className="mt-1"
                />
                <Label htmlFor="policyAccepted" className="text-sm leading-relaxed">
                  I have reviewed and accept the
                  {formData.partnerCountry && formData.partnerCategory ? (
                    <a
                      href={
                        formData.partnerCountry === 'NG' && formData.partnerCategory === 'installer' ? '/policy/installer-ng' :
                          formData.partnerCountry === 'UK' && formData.partnerCategory === 'installer' ? '/policy/installer-uk' :
                            formData.partnerCountry === 'NG' && formData.partnerCategory === 'sales' ? '/policy/marketplace-ng' :
                              formData.partnerCountry === 'UK' && formData.partnerCategory === 'sales' ? '/policy/marketplace-uk' : '#'
                      }
                      className="ml-1 text-primary underline"
                    >Partner Policy</a>
                  ) : (
                    <span className="ml-1 text-muted-foreground">Partner Policy</span>
                  )}
                  *
                </Label>
              </div>

              {formData.partnerCountry === 'NG' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <Label htmlFor="nin">NIN (National Identification Number) *</Label>
                      <Input
                        id="nin"
                        value={formData.nin}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                          handleInputChange('nin', value);
                          if (formData.ninVerified) handleInputChange('ninVerified', false);
                        }}
                        placeholder="Enter 11-digit NIN"
                        maxLength={11}
                        className={formData.nin && !isValidNIN(formData.nin) ? 'border-red-500' : formData.ninVerified ? 'border-green-500' : ''}
                      />
                      {formData.nin && !isValidNIN(formData.nin) && (
                        <p className="text-xs text-red-500 mt-1">NIN must be exactly 11 digits</p>
                      )}
                      {formData.ninVerified && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> NIN recorded - will be verified during KYC
                        </p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={verifyNIN}
                        variant={formData.ninVerified ? 'default' : 'outline'}
                        className="w-full md:w-auto"
                        disabled={loading || !isValidNIN(formData.nin)}
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                        ) : formData.ninVerified ? (
                          <><CheckCircle className="w-4 h-4 mr-2" /> Recorded</>
                        ) : (
                          'Verify NIN'
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your NIN will be verified by our team during the KYC review process.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            {/* Helpful: Download forms & policies based on your country and partner type */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Partner Forms & Policies</h3>
              <p className="text-sm text-muted-foreground mb-3">Select your registration type and country in Step 2 to enable the correct forms and policies.</p>
              {(() => {
                const country = (formData.countryOfRegistration || formData.baseCountry || '').toLowerCase();
                const isNigeria = country.includes('nigeria');
                const isUK = country.includes('united kingdom') || country === 'uk' || country.includes('england') || country.includes('scotland') || country.includes('wales');
                const providesInstall = formData.servicesProvided.includes('Installation services') || formData.partnerClass === 'installation-company' || formData.partnerClass === 'individual-installer';
                const providesSales = formData.servicesProvided.includes('Product sales') || formData.partnerClass === 'marketing-company' || formData.partnerClass === 'individual-marketer' || formData.partnerClass === 'ecommerce-reseller';

                const links: { label: string; href: string }[] = [];
                if (isNigeria && providesInstall) {
                  links.push(
                    { label: 'Installer/Service Partner Registration Form (Nigeria)', href: '/partners/Eagle_Thistle_Installer_Service_Partner_Registration_Form_Nigeria.docx' },
                    { label: 'Installer/Service Partner Policy (Nigeria)', href: '/partners/Eagle_Thistle_Installer_Service_Partner_Policy_Nigeria.docx' }
                  );
                }
                if (isUK && providesInstall) {
                  links.push(
                    { label: 'Installer/Service Partner Registration Form (UK)', href: '/partners/Eagle_Thistle_Installer_Service_Partner_Registration_Form_UK.docx' },
                    { label: 'Installer/Service Partner Policy (UK)', href: '/partners/Eagle_Thistle_Installer_Service_Partner_Policy_UK.docx' }
                  );
                }
                if (isNigeria && providesSales) {
                  links.push(
                    { label: 'Sales Partner Registration Form (Nigeria)', href: '/partners/Eagle_Thistle_Sales_Partner_Registration_Form Nigeria.docx' },
                    { label: 'Sales Partner Policy (Nigeria)', href: '/partners/Eagle_Thistle_sales_Partner_Policy_One_Pager Nigeria.pdf' }
                  );
                }
                if (isUK && providesSales) {
                  links.push(
                    { label: 'Sales Partner Registration Form (UK)', href: '/partners/Eagle_Thistle_UK_Sales_Partner_Registration_Form.docx' },
                    { label: 'Sales Partner Policy (UK)', href: '/partners/Eagle_Thistle_UK_Sales_Partner_Policy_One_Pager.docx' }
                  );
                }

                if (links.length === 0) {
                  return (
                    <div className="text-xs text-muted-foreground">No country/type selected yet. After you choose country and partner class/services, the correct documents will be shown here.</div>
                  );
                }

                return (
                  <ul className="list-disc pl-5 space-y-1">
                    {links.map((l) => (
                      <li key={l.href}>
                        <a className="text-sm text-primary underline" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Create Account</h2>
              <p className="text-muted-foreground">Start your partner journey with us</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                  className={formData.email && !isValidEmail(formData.email) ? 'border-red-500' : formData.email && isValidEmail(formData.email) ? 'border-green-500' : ''}
                />
                {formData.email && !isValidEmail(formData.email) && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      handleInputChange('phone', e.target.value);
                      // Reset verification if phone changes
                      if (formData.phoneVerified) {
                        handleInputChange('phoneVerified', false);
                        handleInputChange('otpSent', false);
                        handleInputChange('otpCode', '');
                      }
                    }}
                    placeholder={formData.partnerCountry === 'NG' ? '+234 801 234 5678' : '+44 20 1234 5678'}
                    required
                    disabled={formData.phoneVerified}
                    className={`flex-1 ${formData.phone && !isValidPhone(formData.phone) ? 'border-red-500' : formData.phoneVerified ? 'border-green-500 bg-green-50' : formData.phone && isValidPhone(formData.phone) ? 'border-blue-500' : ''}`}
                  />
                  {!formData.phoneVerified && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendPhoneOTP}
                      disabled={loading || !isValidPhone(formData.phone) || formData.otpSent}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : formData.otpSent ? 'Resend' : 'Send OTP'}
                    </Button>
                  )}
                  {formData.phoneVerified && (
                    <div className="flex items-center gap-1 text-green-600 px-3">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
                {formData.phone && !isValidPhone(formData.phone) && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid phone number (10-15 digits)</p>
                )}

                {/* OTP Input - appears after OTP is sent */}
                {formData.otpSent && !formData.phoneVerified && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Label htmlFor="otpCode" className="text-sm text-blue-700">Enter Verification Code</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="otpCode"
                        type="text"
                        value={formData.otpCode}
                        onChange={(e) => handleInputChange('otpCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        className="w-32 text-center font-mono text-lg tracking-widest"
                      />
                      <Button
                        type="button"
                        onClick={verifyPhoneOTP}
                        disabled={loading || formData.otpCode.length !== 6}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                      </Button>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Demo code: 123456</p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className={formData.password && !isValidPassword(formData.password) ? 'border-red-500' : formData.password && isValidPassword(formData.password) ? 'border-green-500' : ''}
                />
                {formData.password && !isValidPassword(formData.password) ? (
                  <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
                ) : formData.password && isValidPassword(formData.password) ? (
                  <p className="text-xs text-green-600 mt-1">Password strength: Good</p>
                ) : null}
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
        // Dynamic registration step: switch questions based on country/category
        if (formData.partnerCountry === 'NG' && formData.partnerCategory === 'installer') {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Building className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Installer Service Partner Registration (Nigeria)</h2>
                <p className="text-muted-foreground">Complete your company profile and competence details</p>
              </div>
              {/* A) Company Profile & Legal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Legal Name</Label>
                  <Input value={formData.legalName} onChange={(e) => handleInputChange('legalName', e.target.value)} placeholder="ABC Energy Ltd" />
                </div>
                <div>
                  <Label>Trading Name (if any)</Label>
                  <Input value={formData.tradingName} onChange={(e) => handleInputChange('tradingName', e.target.value)} placeholder="ABC Solar" />
                </div>
                <div>
                  <Label>CAC Registration No. (RC/BN)</Label>
                  <Input value={formData.companyRegistration} onChange={(e) => handleInputChange('companyRegistration', e.target.value)} placeholder="RC123456" />
                </div>
                <div>
                  <Label>FIRS TIN</Label>
                  <Input value={formData.vatTin} onChange={(e) => handleInputChange('vatTin', e.target.value)} placeholder="12345678-0001" />
                </div>
                <div>
                  <Label>SONCAP/MANCAP (if applicable)</Label>
                  <Input value={formData.insurance} onChange={(e) => handleInputChange('insurance', e.target.value)} placeholder="Enter certificate refs" />
                </div>
                <div className="md:col-span-2">
                  <Label>Registered Address</Label>
                  <Textarea value={formData.registeredAddress} onChange={(e) => handleInputChange('registeredAddress', e.target.value)} rows={2} />
                </div>
                <div className="md:col-span-2">
                  <Label>Operating Address (if different)</Label>
                  <Textarea value={formData.baseCity} onChange={(e) => handleInputChange('baseCity', e.target.value)} rows={2} />
                </div>
                <div>
                  <Label>Primary Contact (Name/Role)</Label>
                  <Input value={formData.directorsList} onChange={(e) => handleInputChange('directorsList', e.target.value)} placeholder="Jane Doe / Ops Manager" />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="ops@example.com" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+234 ..." />
                </div>
              </div>

              {/* B) Technical Scope & Capabilities */}
              <div className="space-y-4">
                <Label>Technologies (select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Solar PV', 'Battery Storage (BESS)', 'Inverters/Hybrid', 'EV Chargers', 'Mini‑grid/Microgrid', 'Controls/Monitoring', 'Heat Pumps', 'Other'].map((t) => (
                    <div key={t} className="flex items-center space-x-2">
                      <Checkbox id={`tech-${t}`} checked={formData.specialties.includes(t)} onCheckedChange={() => handleArrayToggle('specialties', t)} />
                      <Label htmlFor={`tech-${t}`}>{t}</Label>
                    </div>
                  ))}
                </div>
                <Label>Service Scope</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Site Survey', 'Design', 'Installation', 'Testing & Inspection', 'Commissioning', 'O&M/Service', 'Emergency Call‑out'].map((s) => (
                    <div key={s} className="flex items-center space-x-2">
                      <Checkbox id={`scope-${s}`} checked={formData.servicesProvided.includes(s)} onCheckedChange={() => handleArrayToggle('servicesProvided', s)} />
                      <Label htmlFor={`scope-${s}`}>{s}</Label>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Design tools/software</Label>
                    <Input value={formData.productSkus} onChange={(e) => handleInputChange('productSkus', e.target.value)} placeholder="PVsyst, AutoCAD, HOMER, ..." />
                  </div>
                  <div>
                    <Label>Daily install capacity (teams x size)</Label>
                    <Input value={formData.weeklyCapacity} onChange={(e) => handleInputChange('weeklyCapacity', e.target.value)} placeholder="e.g., 3 teams x 4" />
                  </div>
                </div>
                <div>
                  <Label>Geographic coverage (States/LGAs)</Label>
                  <Textarea value={formData.serviceAreas.join(', ')} onChange={(e) => handleInputChange('serviceAreas', e.target.value.split(',').map(s => s.trim()))} rows={2} />
                </div>
              </div>

              {/* C) Qualifications, Memberships & Certifications */}
              <div className="space-y-4">
                <Label>Qualifications & Compliance</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="coreg" checked={formData.isoCertifications.includes('COREN')} onCheckedChange={() => handleArrayToggle('isoCertifications', 'COREN')} />
                    <Label htmlFor="coreg">COREN Registered Engineer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="nemsa" checked={formData.isoCertifications.includes('NEMSA')} onCheckedChange={() => handleArrayToggle('isoCertifications', 'NEMSA')} />
                    <Label htmlFor="nemsa">NEMSA Recognition/Permit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="disco" checked={formData.isoCertifications.includes('DISCO')} onCheckedChange={() => handleArrayToggle('isoCertifications', 'DISCO')} />
                    <Label htmlFor="disco">DISCO Authorisation (grid‑tie)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="oem" checked={formData.isoCertifications.includes('OEM')} onCheckedChange={() => handleArrayToggle('isoCertifications', 'OEM')} />
                    <Label htmlFor="oem">OEM Certifications (inverters/batteries/EV)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hse" checked={formData.hsePrograms} onCheckedChange={(checked) => handleInputChange('hsePrograms', checked)} />
                    <Label htmlFor="hse">HSE/First Aid, W@H, LOTO</Label>
                  </div>
                  <div>
                    <Label>Insurance (Public/Product/Employers/PI)</Label>
                    <Input value={formData.insurance} onChange={(e) => handleInputChange('insurance', e.target.value)} placeholder="List coverages and amounts" />
                  </div>
                </div>
              </div>

              {/* E) Experience & References */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Years trading</Label>
                    <Input value={formData.headcount} onChange={(e) => handleInputChange('headcount', e.target.value)} placeholder="e.g., 5" />
                  </div>
                  <div>
                    <Label>Total installs PV</Label>
                    <Input value={formData.maxConcurrentProjects} onChange={(e) => handleInputChange('maxConcurrentProjects', e.target.value)} placeholder="e.g., 50" />
                  </div>
                  <div>
                    <Label>Total installs BESS</Label>
                    <Input value={formData.electricalLicense} onChange={(e) => handleInputChange('electricalLicense', e.target.value)} placeholder="e.g., 12" />
                  </div>
                  <div>
                    <Label>Total EV chargers</Label>
                    <Input value={formData.tradeLicense} onChange={(e) => handleInputChange('tradeLicense', e.target.value)} placeholder="e.g., 20" />
                  </div>
                </div>
                <Label>Largest recent projects (top 3)</Label>
                <Textarea value={formData.lastThreeProjects} onChange={(e) => handleInputChange('lastThreeProjects', e.target.value)} rows={4} placeholder="1) Client/Address ..." />
              </div>

              {/* F) Key Personnel */}
              <div className="space-y-4">
                <Label>Key Personnel</Label>
                <Textarea value={formData.techniciansByGrade} onChange={(e) => handleInputChange('techniciansByGrade', e.target.value)} rows={3} placeholder="PM (COREN): ..., Lead Electrician: ..., HSE Lead: ..." />
              </div>

              {/* G) Tools & Equipment */}
              <div className="space-y-2">
                <Label>Main equipment list</Label>
                <Textarea value={formData.toolsEquipment} onChange={(e) => handleInputChange('toolsEquipment', e.target.value)} rows={3} />
              </div>

              {/* H) Commercials & Capacity */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred payment terms</Label>
                    <Input value={formData.paymentTerms} onChange={(e) => handleInputChange('paymentTerms', e.target.value)} placeholder="e.g., Net 30" />
                  </div>
                  <div>
                    <Label>Max concurrent jobs</Label>
                    <Input value={formData.maxConcurrentProjects} onChange={(e) => handleInputChange('maxConcurrentProjects', e.target.value)} placeholder="e.g., 5" />
                  </div>
                </div>
                <div>
                  <Label>Target response times</Label>
                  <Input value={formData.returnPolicy} onChange={(e) => handleInputChange('returnPolicy', e.target.value)} placeholder="Emergency 24h / Standard 72h" />
                </div>
              </div>

              {/* I) Bonds & Retainer Acknowledgement */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="ack-bonds" checked={formData.commissionAgreementAccepted} onCheckedChange={(checked) => handleInputChange('commissionAgreementAccepted', checked)} />
                  <Label htmlFor="ack-bonds">I acknowledge Bond/Retention/Retainer terms may apply</Label>
                </div>
              </div>

              {/* J) Training Commitment */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="ack-training" checked={formData.dataConsentAccepted} onCheckedChange={(checked) => handleInputChange('dataConsentAccepted', checked)} />
                  <Label htmlFor="ack-training">We will complete compulsory training and assessments</Label>
                </div>
              </div>
            </div>
          );
        }

        if (formData.partnerCountry === 'UK' && formData.partnerCategory === 'installer') {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Building className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Installer Service Partner Registration (UK)</h2>
                <p className="text-muted-foreground">Complete your UK company profile and competence details</p>
              </div>
              {/* Concise UK variant mirroring the UK form structure (A–K) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Legal Name</Label>
                  <Input value={formData.legalName} onChange={(e) => handleInputChange('legalName', e.target.value)} />
                </div>
                <div>
                  <Label>Trading Name</Label>
                  <Input value={formData.tradingName} onChange={(e) => handleInputChange('tradingName', e.target.value)} />
                </div>
                <div>
                  <Label>Companies House No.</Label>
                  <Input value={formData.companyRegistration} onChange={(e) => handleInputChange('companyRegistration', e.target.value)} />
                </div>
                <div>
                  <Label>VAT No.</Label>
                  <Input value={formData.vatTin} onChange={(e) => handleInputChange('vatTin', e.target.value)} />
                </div>
                <div>
                  <Label>EORI (if importing)</Label>
                  <Input value={formData.addressProof} onChange={(e) => handleInputChange('addressProof', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label>Registered Address</Label>
                  <Textarea value={formData.registeredAddress} onChange={(e) => handleInputChange('registeredAddress', e.target.value)} rows={2} />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Roles & Capabilities</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Design', 'Installation', 'Testing & Inspection', 'Commissioning', 'O&M/Service', 'Emergency Call-out'].map((s) => (
                    <div key={s} className="flex items-center space-x-2">
                      <Checkbox id={`uk-scope-${s}`} checked={formData.servicesProvided.includes(s)} onCheckedChange={() => handleArrayToggle('servicesProvided', s)} />
                      <Label htmlFor={`uk-scope-${s}`}>{s}</Label>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>BS 7671 / C&G / MCS numbers</Label>
                    <Input value={formData.electricalLicense} onChange={(e) => handleInputChange('electricalLicense', e.target.value)} placeholder="e.g., C&G 2382-22; MCS MIS 3002" />
                  </div>
                  <div>
                    <Label>Insurance (Public/Product/PI)</Label>
                    <Input value={formData.insurance} onChange={(e) => handleInputChange('insurance', e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Key Personnel</Label>
                  <Textarea value={formData.techniciansByGrade} onChange={(e) => handleInputChange('techniciansByGrade', e.target.value)} rows={3} placeholder="PM, Lead Electrician, H&S Lead..." />
                </div>
                <div>
                  <Label>Largest recent projects</Label>
                  <Textarea value={formData.lastThreeProjects} onChange={(e) => handleInputChange('lastThreeProjects', e.target.value)} rows={3} />
                </div>
              </div>
            </div>
          );
        }

        // Sales marketplace variants (NG/UK) summarised as unified sales form with policy distinctions
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Sales Partner Registration ({formData.partnerCountry === 'UK' ? 'UK' : 'Nigeria/ECOWAS'})</h2>
              <p className="text-muted-foreground">Vendors/Resellers and State Sales Representatives</p>
            </div>

            {/* A) Partner Type & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Account Type</Label>
                <Select value={formData.partnerType} onValueChange={(v) => handleInputChange('partnerType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Registered Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Legal/Full Name</Label>
                <Input value={formData.legalName} onChange={(e) => handleInputChange('legalName', e.target.value)} />
              </div>
              <div>
                <Label>Trading Name (if any)</Label>
                <Input value={formData.tradingName} onChange={(e) => handleInputChange('tradingName', e.target.value)} />
              </div>
              <div>
                <Label>Website (optional)</Label>
                <Input value={formData.returnPolicy} onChange={(e) => handleInputChange('returnPolicy', e.target.value)} placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <Label>Registered Address</Label>
                <Textarea value={formData.registeredAddress} onChange={(e) => handleInputChange('registeredAddress', e.target.value)} rows={2} />
              </div>
            </div>

            {/* B) Territory & Coverage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Regions/States Covered</Label>
                <Textarea value={formData.coverageRegions.join(', ')} onChange={(e) => handleInputChange('coverageRegions', e.target.value.split(',').map(s => s.trim()))} rows={2} />
              </div>
              <div>
                <Label>Service Radius (km)</Label>
                <Input value={formData.serviceRadius} onChange={(e) => handleInputChange('serviceRadius', e.target.value)} />
              </div>
            </div>

            {/* C) Roles & Categories */}
            <div className="space-y-3">
              <Label>Roles</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {['Sales (Retail)', 'Sales (B2B/Projects)', 'Distributor', 'OEM Rep', 'E-commerce Vendor'].map((r) => (
                  <div key={r} className="flex items-center space-x-2">
                    <Checkbox id={`role-${r}`} checked={formData.servicesProvided.includes(r)} onCheckedChange={() => handleArrayToggle('servicesProvided', r)} />
                    <Label htmlFor={`role-${r}`}>{r}</Label>
                  </div>
                ))}
              </div>
              <Label>Product Categories</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['Solar PV Panels', 'Hybrid/On-grid Inverters', 'Off-grid Inverters', 'Batteries/BESS', 'Charge Controllers', 'Cables/MC4/BOS', 'Mounting/Racking', 'EV Chargers', 'Efficient Appliances', 'Other'].map((c) => (
                  <div key={c} className="flex items-center space-x-2">
                    <Checkbox id={`cat-${c}`} checked={formData.specialties.includes(c)} onCheckedChange={() => handleArrayToggle('specialties', c)} />
                    <Label htmlFor={`cat-${c}`}>{c}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* D) Compliance & Documentation */}
            <div className="space-y-2">
              <Label>Compliance & Documentation (tick as applicable)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['Government ID', 'CAC/RC Certificate', 'TIN', 'Bank Letter/Statement', 'Manufacturer Authorization', 'Product Test Reports (IEC/UL)', 'Warranty Policy (PDF)', 'Insurance'].map((d) => (
                  <div key={d} className="flex items-center space-x-2">
                    <Checkbox id={`doc-${d}`} checked={formData.manufacturerCertifications.includes(d)} onCheckedChange={() => handleArrayToggle('manufacturerCertifications', d)} />
                    <Label htmlFor={`doc-${d}`}>{d}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* E) Banking & Tax */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Bank Name</Label>
                <Input value={formData.bankName} onChange={(e) => handleInputChange('bankName', e.target.value)} placeholder="e.g., First Bank Nigeria" />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input value={formData.bankAccountNumber} onChange={(e) => handleInputChange('bankAccountNumber', e.target.value.replace(/\D/g, ''))} placeholder="10-digit NUBAN" />
              </div>
              <div>
                <Label>Currency (NGN/GBP)</Label>
                <Input value={formData.preferredCurrency} onChange={(e) => handleInputChange('preferredCurrency', e.target.value)} />
              </div>
            </div>

            {/* F) Fees & G) Commercial Acknowledgement */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="ack-fees" checked={formData.antiBriberyAttestation} onCheckedChange={(checked) => handleInputChange('antiBriberyAttestation', checked)} />
                <Label htmlFor="ack-fees">I acknowledge onboarding/listing fees and ongoing platform charges</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ack-payout" checked={formData.sanctionsConfirmation} onCheckedChange={(checked) => handleInputChange('sanctionsConfirmation', checked)} />
                <Label htmlFor="ack-payout">I accept payout timing and reserves policy</Label>
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
                    <FileUpload
                      label="Proof of Address"
                      helperText="Upload utility bill, bank statement, or government-issued document (PDF, JPG, PNG - Max 10MB)"
                      onFileSelect={(files) => handleFileUpload(files, 'addressProofFiles')}
                      onFileRemove={(index) => handleFileRemove('addressProofFiles', index)}
                      uploadedFiles={formData.addressProofFiles}
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple={true}
                      maxFiles={3}
                      disabled={loading}
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Bank Details:</strong> Your bank information will be used for commission payments and refunds. Please ensure accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder={formData.partnerCountry === 'NG' ? 'e.g., First Bank Nigeria' : 'e.g., Barclays Bank'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bankAccountName">Account Name *</Label>
                <Input
                  id="bankAccountName"
                  value={formData.bankAccountName}
                  onChange={(e) => handleInputChange('bankAccountName', e.target.value)}
                  placeholder="Name on the account"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bankAccountNumber">Account Number *</Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleInputChange('bankAccountNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder={formData.partnerCountry === 'NG' ? '10-digit NUBAN' : '8-digit account number'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bankSortCode">{formData.partnerCountry === 'NG' ? 'Bank Code' : 'Sort Code'}</Label>
                <Input
                  id="bankSortCode"
                  value={formData.bankSortCode}
                  onChange={(e) => handleInputChange('bankSortCode', e.target.value)}
                  placeholder={formData.partnerCountry === 'NG' ? '3-digit bank code' : '6-digit sort code (XX-XX-XX)'}
                />
              </div>

              <div>
                <Label htmlFor="bankSwiftBic">SWIFT/BIC Code (for international transfers)</Label>
                <Input
                  id="bankSwiftBic"
                  value={formData.bankSwiftBic}
                  onChange={(e) => handleInputChange('bankSwiftBic', e.target.value.toUpperCase())}
                  placeholder="e.g., FBNINGLA"
                />
              </div>

              <div>
                <Label>Preferred Currency *</Label>
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
              <p className="text-muted-foreground">
                {requiresProductListings()
                  ? 'List the products you can supply to our marketplace'
                  : 'For sales, manufacturing, and e-commerce partners'}
              </p>
            </div>

            {requiresProductListings() ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You can add detailed product listings after your application is approved.
                    For now, please provide a general overview of the products you can supply.
                  </p>
                </div>

                <div>
                  <Label htmlFor="productSkus">Product Categories & Brands</Label>
                  <Textarea
                    id="productSkus"
                    value={formData.productSkus}
                    onChange={(e) => handleInputChange('productSkus', e.target.value)}
                    placeholder="Example:&#10;- Solar Panels: Canadian Solar, JA Solar, Trina Solar (250W-550W)&#10;- Inverters: Huawei, SMA, Fronius (3kW-100kW)&#10;- Batteries: BYD, Pylontech, Tesla Powerwall&#10;&#10;List product categories, brands, and capacity ranges you can supply..."
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="returnPolicy">Return & Warranty Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={(e) => handleInputChange('returnPolicy', e.target.value)}
                    placeholder="Describe your return policy, warranty terms, and after-sales support..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slaCommitments">Delivery & Service Commitments</Label>
                  <Textarea
                    id="slaCommitments"
                    value={formData.slaCommitments}
                    onChange={(e) => handleInputChange('slaCommitments', e.target.value)}
                    placeholder="Delivery times, minimum order quantities, lead times, support response times..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Product Catalog & Documentation (Optional)</Label>
                  <FileUpload
                    helperText="Upload product catalogs, datasheets, certifications (PDF, JPG, PNG - Max 10MB each)"
                    onFileSelect={(files) => handleFileUpload(files, 'mediaUploads')}
                    onFileRemove={(index) => handleFileRemove('mediaUploads', index)}
                    uploadedFiles={formData.mediaUploads.map(url => ({ name: url.split('/').pop() || 'file', size: 0, url }))}
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple={true}
                    maxFiles={10}
                    disabled={loading}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Product Listings Required</h3>
                <p className="text-gray-500">
                  Based on your selected partner category ({formData.partnerCategory}) and class ({formData.partnerClass}),
                  product listings are not required for your application.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  If you plan to sell products in the future, you can update your profile after approval.
                </p>
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
                      disabled={!canProceed() || loading}
                      className="bg-gradient-to-r from-primary to-accent hover:shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
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