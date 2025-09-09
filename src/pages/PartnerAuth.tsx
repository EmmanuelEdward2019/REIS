import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { 
  Mail, 
  Phone, 
  Lock, 
  User, 
  Shield, 
  CheckCircle,
  Building,
  Globe
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface FormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  partnerType: 'company' | 'individual';
  legalName: string;
  tradingName?: string;
  country: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  enable2FA: boolean;
}

const PartnerAuth = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    partnerType: 'company',
    legalName: '',
    tradingName: '',
    country: '',
    acceptTerms: false,
    acceptPrivacy: false,
    enable2FA: false
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailVerification = async () => {
    if (!formData.email) {
      toast({ title: "Error", description: "Please enter your email address", variant: "destructive" });
      return;
    }
    setIsVerifyingEmail(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifyingEmail(false);
      toast({ title: "Verification Sent", description: "Check your email for the verification code" });
    }, 1000);
  };

  const handlePhoneVerification = async () => {
    if (!formData.phone) {
      toast({ title: "Error", description: "Please enter your phone number", variant: "destructive" });
      return;
    }
    setIsVerifyingPhone(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifyingPhone(false);
      toast({ title: "OTP Sent", description: "Check your phone for the verification code" });
    }, 1000);
  };

  const handleRegistration = async () => {
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      toast({ title: "Error", description: "Please accept terms and privacy policy", variant: "destructive" });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    // Simulate registration
    toast({ title: "Success", description: "Account created! Redirecting to onboarding..." });
    setTimeout(() => {
      window.location.href = '/partner-onboarding';
    }, 2000);
  };

  const countries = [
    'Nigeria', 'United Kingdom', 'Ghana', 'Kenya', 'South Africa', 'United States', 'Canada', 'Other'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Building className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground">Partner Portal</h1>
            <p className="text-muted-foreground">Join the E&T REIS Partner Network</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Partner Sign In</CardTitle>
                  <CardDescription>Access your partner dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="login-email" type="email" placeholder="partner@company.com" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="login-password" type="password" className="pl-9" />
                    </div>
                  </div>
                  <Button className="w-full">Sign In</Button>
                  <div className="text-center">
                    <Button variant="link" size="sm">Forgot Password?</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Partner Registration</CardTitle>
                  <CardDescription>Step {step} of 3 - Create your partner account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {step === 1 && (
                    <>
                      <div className="space-y-2">
                        <Label>Partner Type</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant={formData.partnerType === 'company' ? 'default' : 'outline'}
                            onClick={() => handleInputChange('partnerType', 'company')}
                            className="h-auto p-4 flex-col space-y-2"
                          >
                            <Building className="h-6 w-6" />
                            <span>Company</span>
                          </Button>
                          <Button
                            variant={formData.partnerType === 'individual' ? 'default' : 'outline'}
                            onClick={() => handleInputChange('partnerType', 'individual')}
                            className="h-auto p-4 flex-col space-y-2"
                          >
                            <User className="h-6 w-6" />
                            <span>Individual</span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="legal-name">
                          {formData.partnerType === 'company' ? 'Legal Company Name' : 'Full Legal Name'}
                        </Label>
                        <Input
                          id="legal-name"
                          value={formData.legalName}
                          onChange={(e) => handleInputChange('legalName', e.target.value)}
                          placeholder={formData.partnerType === 'company' ? 'ABC Energy Solutions Ltd' : 'John Smith'}
                        />
                      </div>

                      {formData.partnerType === 'company' && (
                        <div className="space-y-2">
                          <Label htmlFor="trading-name">Trading Name (Optional)</Label>
                          <Input
                            id="trading-name"
                            value={formData.tradingName}
                            onChange={(e) => handleInputChange('tradingName', e.target.value)}
                            placeholder="ABC Energy"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <select
                          id="country"
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                        >
                          <option value="">Select Country</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => setStep(2)}
                        disabled={!formData.legalName || !formData.country}
                      >
                        Continue
                      </Button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="partner@company.com"
                              className="pl-9"
                            />
                          </div>
                          <Button
                            variant="outline"
                            onClick={handleEmailVerification}
                            disabled={isVerifyingEmail || !formData.email}
                          >
                            {isVerifyingEmail ? 'Sending...' : 'Verify'}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="+234 xxx xxx xxxx"
                              className="pl-9"
                            />
                          </div>
                          <Button
                            variant="outline"
                            onClick={handlePhoneVerification}
                            disabled={isVerifyingPhone || !formData.phone}
                          >
                            {isVerifyingPhone ? 'Sending...' : 'Verify'}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="verification-code">Verification Code</Label>
                        <Input
                          id="verification-code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button 
                          className="flex-1" 
                          onClick={() => setStep(3)}
                          disabled={!formData.email || !formData.phone || !verificationCode}
                        >
                          Continue
                        </Button>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Strong password"
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            placeholder="Confirm password"
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enable-2fa"
                          checked={formData.enable2FA}
                          onCheckedChange={(checked) => handleInputChange('enable2FA', checked)}
                        />
                        <Label htmlFor="enable-2fa" className="text-sm flex items-center">
                          <Shield className="h-4 w-4 mr-1" />
                          Enable Two-Factor Authentication (Recommended)
                        </Label>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="accept-terms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                          />
                          <Label htmlFor="accept-terms" className="text-sm">
                            I accept the <Button variant="link" className="p-0 h-auto">Partner Terms & Conditions</Button>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="accept-privacy"
                            checked={formData.acceptPrivacy}
                            onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked)}
                          />
                          <Label htmlFor="accept-privacy" className="text-sm">
                            I accept the <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
                          </Label>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setStep(2)}>
                          Back
                        </Button>
                        <Button 
                          className="flex-1" 
                          onClick={handleRegistration}
                          disabled={!formData.password || !formData.confirmPassword || !formData.acceptTerms || !formData.acceptPrivacy}
                        >
                          Create Account
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>By registering, you agree to ISO 9001/14001/45001 compliance requirements</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartnerAuth;