import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Home,
  Building,
  Factory
} from 'lucide-react';
import { Segment } from './JobCodeGenerator';

interface QuestionnaireData {
  segment: Segment;
  hasRecentAudit: boolean;
  basicInfo: {
    propertyType: string;
    size: string;
    currentEnergySource: string;
    monthlyBill: number;
    location: string;
  };
  technicalPreferences: {
    preferredTechnology: string[];
    budgetRange: string;
    timeline: string;
    gridConnection: boolean;
    batteryStorage: boolean;
  };
  auditFiles: File[];
  billFiles: File[];
  siteFiles: File[];
}

interface QuestionnaireFlowProps {
  segment: Segment;
  onComplete: (data: QuestionnaireData) => void;
  onUpdateScore: (points: number) => void;
}

const QuestionnaireFlow: React.FC<QuestionnaireFlowProps> = ({ 
  segment, 
  onComplete, 
  onUpdateScore 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuestionnaireData>({
    segment,
    hasRecentAudit: false,
    basicInfo: {
      propertyType: '',
      size: '',
      currentEnergySource: '',
      monthlyBill: 0,
      location: ''
    },
    technicalPreferences: {
      preferredTechnology: [],
      budgetRange: '',
      timeline: '',
      gridConnection: false,
      batteryStorage: false
    },
    auditFiles: [],
    billFiles: [],
    siteFiles: []
  });

  const getSegmentIcon = (seg: Segment) => {
    switch (seg) {
      case 'RES': return <Home className="h-6 w-6" />;
      case 'COM': return <Building className="h-6 w-6" />;
      case 'IND': return <Factory className="h-6 w-6" />;
    }
  };

  const getSegmentLabel = (seg: Segment) => {
    switch (seg) {
      case 'RES': return 'Residential';
      case 'COM': return 'Commercial';
      case 'IND': return 'Industrial';
    }
  };

  const getSteps = (): { title: string; description: string }[] => {
    const baseSteps = [
      { title: 'Audit Check', description: 'Do you have a recent energy audit?' },
      { title: 'Basic Information', description: 'Property and energy details' },
      { title: 'Technical Preferences', description: 'System requirements and preferences' }
    ];

    if (formData.hasRecentAudit) {
      return [
        ...baseSteps,
        { title: 'Upload Audit', description: 'Upload your existing audit documents' },
        { title: 'Review & Submit', description: 'Confirm your information' }
      ];
    } else {
      return [
        ...baseSteps,
        { title: 'Upload Bills', description: 'Upload 12-36 months of utility bills' },
        { title: 'Site Information', description: 'Property plans and photos' },
        { title: 'Review & Submit', description: 'Confirm and schedule site audit' }
      ];
    }
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof QuestionnaireData] as any),
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    // Update seriousness score based on completed step
    if (currentStep === 1 && formData.basicInfo.monthlyBill > 0) {
      onUpdateScore(2); // Completed basic info
    }
    if (currentStep === 2) {
      onUpdateScore(2); // Completed preferences
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final submission
      onUpdateScore(2); // Completed questionnaire
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFileUpload = (field: 'auditFiles' | 'billFiles' | 'siteFiles', files: FileList) => {
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...fileArray]
    }));
    onUpdateScore(3); // File upload bonus
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Audit check
      case 1: return formData.basicInfo.propertyType && formData.basicInfo.size && formData.basicInfo.monthlyBill > 0;
      case 2: return formData.technicalPreferences.budgetRange && formData.technicalPreferences.timeline;
      case 3: 
        return formData.hasRecentAudit 
          ? formData.auditFiles.length > 0 
          : formData.billFiles.length > 0;
      case 4: 
        return formData.hasRecentAudit 
          ? true 
          : formData.siteFiles.length > 0;
      case 5:
        return true; // Final step - always allow completion
      default: return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Energy Audit Status</h3>
              <p className="text-muted-foreground">
                This helps us determine the best path forward for your project
              </p>
            </div>
            
            <RadioGroup
              value={formData.hasRecentAudit.toString()}
              onValueChange={(value) => updateFormData('hasRecentAudit', value === 'true')}
            >
              <Card className={`p-4 cursor-pointer transition-colors ${formData.hasRecentAudit === true ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="has-audit" />
                  <div className="flex-1">
                    <Label htmlFor="has-audit" className="text-base font-medium cursor-pointer">
                      Yes, I have a recent energy audit (within 2 years)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Upload your audit for detailed technical review
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </Card>
              
              <Card className={`p-4 cursor-pointer transition-colors ${formData.hasRecentAudit === false ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="no-audit" />
                  <div className="flex-1">
                    <Label htmlFor="no-audit" className="text-base font-medium cursor-pointer">
                      No, I need an energy audit
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      We'll help you with a comprehensive energy assessment
                    </p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-accent" />
                </div>
              </Card>
            </RadioGroup>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Basic Property Information</h3>
              <p className="text-muted-foreground">
                Tell us about your {getSegmentLabel(segment).toLowerCase()} property
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property-type">Property Type</Label>
                <select
                  id="property-type"
                  value={formData.basicInfo.propertyType}
                  onChange={(e) => updateNestedFormData('basicInfo', 'propertyType', e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                >
                  <option value="">Select type...</option>
                  {segment === 'RES' && (
                    <>
                      <option value="single-family">Single Family Home</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="apartment">Apartment</option>
                      <option value="condo">Condominium</option>
                    </>
                  )}
                  {segment === 'COM' && (
                    <>
                      <option value="office">Office Building</option>
                      <option value="retail">Retail/Shopping Center</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="mixed-use">Mixed Use</option>
                    </>
                  )}
                  {segment === 'IND' && (
                    <>
                      <option value="manufacturing">Manufacturing Facility</option>
                      <option value="data-center">Data Center</option>
                      <option value="processing">Processing Plant</option>
                      <option value="logistics">Logistics Center</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <Label htmlFor="property-size">Property Size</Label>
                <Input
                  id="property-size"
                  placeholder={segment === 'RES' ? "e.g., 2,500 sq ft" : "e.g., 50,000 sq ft"}
                  value={formData.basicInfo.size}
                  onChange={(e) => updateNestedFormData('basicInfo', 'size', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="current-energy">Current Energy Source</Label>
                <select
                  id="current-energy"
                  value={formData.basicInfo.currentEnergySource}
                  onChange={(e) => updateNestedFormData('basicInfo', 'currentEnergySource', e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                >
                  <option value="">Select source...</option>
                  <option value="grid-only">Grid Only</option>
                  <option value="grid-gas">Grid + Natural Gas</option>
                  <option value="partial-solar">Some Solar + Grid</option>
                  <option value="diesel-generator">Diesel Generator</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="monthly-bill">Average Monthly Energy Bill</Label>
                <Input
                  id="monthly-bill"
                  type="number"
                  placeholder="$0"
                  value={formData.basicInfo.monthlyBill || ''}
                  onChange={(e) => updateNestedFormData('basicInfo', 'monthlyBill', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State/Province, Country"
                  value={formData.basicInfo.location}
                  onChange={(e) => updateNestedFormData('basicInfo', 'location', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Technical Preferences</h3>
              <p className="text-muted-foreground">
                Help us understand your system requirements
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Preferred Technologies (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Solar PV', 'Wind Turbine', 'Battery Storage', 'Hydrogen Systems',
                    'Grid Tie', 'Off-Grid', 'Backup Power', 'Smart Controls'
                  ].map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech}
                        checked={formData.technicalPreferences.preferredTechnology.includes(tech)}
                        onCheckedChange={(checked) => {
                          const current = formData.technicalPreferences.preferredTechnology;
                          if (checked) {
                            updateNestedFormData('technicalPreferences', 'preferredTechnology', [...current, tech]);
                          } else {
                            updateNestedFormData('technicalPreferences', 'preferredTechnology', current.filter(t => t !== tech));
                          }
                        }}
                      />
                      <Label htmlFor={tech} className="text-sm">{tech}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget-range">Budget Range</Label>
                  <select
                    id="budget-range"
                    value={formData.technicalPreferences.budgetRange}
                    onChange={(e) => updateNestedFormData('technicalPreferences', 'budgetRange', e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                  >
                    <option value="">Select budget...</option>
                    {segment === 'RES' && (
                      <>
                        <option value="under-25k">Under $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="over-100k">Over $100,000</option>
                      </>
                    )}
                    {segment === 'COM' && (
                      <>
                        <option value="under-100k">Under $100,000</option>
                        <option value="100k-500k">$100,000 - $500,000</option>
                        <option value="500k-1m">$500,000 - $1,000,000</option>
                        <option value="over-1m">Over $1,000,000</option>
                      </>
                    )}
                    {segment === 'IND' && (
                      <>
                        <option value="under-1m">Under $1,000,000</option>
                        <option value="1m-5m">$1,000,000 - $5,000,000</option>
                        <option value="5m-10m">$5,000,000 - $10,000,000</option>
                        <option value="over-10m">Over $10,000,000</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <Label htmlFor="timeline">Project Timeline</Label>
                  <select
                    id="timeline"
                    value={formData.technicalPreferences.timeline}
                    onChange={(e) => updateNestedFormData('technicalPreferences', 'timeline', e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                  >
                    <option value="">Select timeline...</option>
                    <option value="immediate">Immediate (1-3 months)</option>
                    <option value="short-term">Short term (3-6 months)</option>
                    <option value="medium-term">Medium term (6-12 months)</option>
                    <option value="long-term">Long term (12+ months)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="grid-connection"
                    checked={formData.technicalPreferences.gridConnection}
                    onCheckedChange={(checked) => updateNestedFormData('technicalPreferences', 'gridConnection', checked)}
                  />
                  <Label htmlFor="grid-connection">Grid-tied system preferred</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="battery-storage"
                    checked={formData.technicalPreferences.batteryStorage}
                    onCheckedChange={(checked) => updateNestedFormData('technicalPreferences', 'batteryStorage', checked)}
                  />
                  <Label htmlFor="battery-storage">Battery storage required</Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // File upload steps
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {formData.hasRecentAudit && currentStep === 3 ? 'Upload Energy Audit' :
                 !formData.hasRecentAudit && currentStep === 3 ? 'Upload Utility Bills' :
                 'Upload Site Information'}
              </h3>
              <p className="text-muted-foreground">
                {formData.hasRecentAudit && currentStep === 3 ? 'Upload your existing energy audit documents' :
                 !formData.hasRecentAudit && currentStep === 3 ? 'Upload 12-36 months of utility bills' :
                 'Upload site plans, photos, and other relevant documents'}
              </p>
            </div>

            <FileUploadSection
              title={formData.hasRecentAudit && currentStep === 3 ? 'Energy Audit Documents' :
                     !formData.hasRecentAudit && currentStep === 3 ? 'Utility Bills' :
                     'Site Plans & Photos'}
              files={formData.hasRecentAudit && currentStep === 3 ? formData.auditFiles :
                     !formData.hasRecentAudit && currentStep === 3 ? formData.billFiles :
                     formData.siteFiles}
              onUpload={(files) => {
                const field = formData.hasRecentAudit && currentStep === 3 ? 'auditFiles' :
                             !formData.hasRecentAudit && currentStep === 3 ? 'billFiles' :
                             'siteFiles';
                handleFileUpload(field, files);
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          {getSegmentIcon(segment)}
          <h1 className="text-3xl font-bold">{getSegmentLabel(segment)} Questionnaire</h1>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-1">
          Step {currentStep + 1} of {totalSteps}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{steps[currentStep]?.title}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-center">
          {steps[currentStep]?.description}
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
          {currentStep !== totalSteps - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

interface FileUploadSectionProps {
  title: string;
  files: File[];
  onUpload: (files: FileList) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ title, files, onUpload }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">{title}</h4>
      
      <Card className="border-dashed border-2">
        <CardContent className="p-6 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">
              PDF, DOC, XLS, JPG, PNG (Max 10MB each)
            </p>
          </div>
          <Input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={(e) => e.target.files && onUpload(e.target.files)}
            className="mt-4 max-w-xs"
          />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Uploaded Files ({files.length}):</h5>
          <div className="space-y-1">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                <span>{file.name}</span>
                <span className="text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireFlow;