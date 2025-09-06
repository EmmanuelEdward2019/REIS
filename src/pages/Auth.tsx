import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';

type AuthMode = 'signin' | 'signup';
type SignupStep = 1 | 2 | 3;

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [step, setStep] = useState<SignupStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    region: '',
    language: '',
    firstName: '',
    lastName: '',
    getUpdates: false,
    verificationCode: ['', '', '', '', '', '']
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...formData.verificationCode];
      newCode[index] = value;
      setFormData(prev => ({
        ...prev,
        verificationCode: newCode
      }));
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name="code-${index + 1}"]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const renderSignIn = () => (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-medium text-foreground mb-8">Sign In</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email-signin" className="text-sm text-muted-foreground">Email</Label>
          <div className="flex items-center justify-between">
            <Input
              id="email-signin"
              type="email"
              value={formData.email || 'techfieldstechnologies@gmail.com'}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-muted border-0 h-12 text-base flex-1 mr-2"
            />
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-normal text-sm"
              onClick={() => setFormData(prev => ({ ...prev, email: '' }))}
            >
              Change
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="bg-muted border-0 h-12 text-base pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-md text-base font-medium">
          Sign In
        </Button>

        <div className="text-center">
          <Button variant="link" className="text-primary font-normal">
            Forgot password?
          </Button>
        </div>

        <div className="text-center text-muted-foreground text-sm">
          Or
        </div>

        <Button
          variant="outline"
          className="w-full h-12 bg-muted hover:bg-muted/80 border-0 text-foreground rounded-md font-medium"
          onClick={() => setMode('signup')}
        >
          Create Account
        </Button>
      </div>
    </div>
  );

  const renderSignupStep1 = () => (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">Step 1 of 3</div>
        <h1 className="text-3xl font-medium text-foreground mb-8">Create Account</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="region" className="text-sm text-muted-foreground">Region</Label>
          <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
            <SelectTrigger className="bg-muted border-0 h-12">
              <SelectValue placeholder="Canada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="usa">USA</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="nigeria">Nigeria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm text-muted-foreground">Language</Label>
          <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
            <SelectTrigger className="bg-muted border-0 h-12">
              <SelectValue placeholder="English" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm text-muted-foreground">First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="bg-muted border-0 h-12 text-base"
            placeholder="Emmanuel"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm text-muted-foreground">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="bg-muted border-0 h-12 text-base"
            placeholder="Edward"
          />
        </div>

        <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="human-check"
            className="mt-1"
          />
          <div className="flex-1">
            <label htmlFor="human-check" className="text-sm text-foreground cursor-pointer">
              I am human
            </label>
          </div>
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          By clicking 'Next', I understand and agree to Eagle & Thistle's{' '}
          <Button variant="link" className="p-0 h-auto text-primary text-xs">Privacy Notice</Button>
          {' '}and{' '}
          <Button variant="link" className="p-0 h-auto text-primary text-xs">Terms of Use</Button>
          {' '}for creating an Eagle & Thistle Account and I authorize Eagle & Thistle to contact me for account management purposes via the contact information I provide.
        </div>

        <Button 
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-md text-base font-medium"
          onClick={() => setStep(2)}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderSignupStep2 = () => (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">Step 2 of 3</div>
        <h1 className="text-3xl font-medium text-foreground mb-8">Create Account</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-muted border-0 h-12 text-base"
            placeholder="techfieldstechnologies@gmail.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-signup" className="text-sm text-muted-foreground">Password</Label>
          <div className="relative">
            <Input
              id="password-signup"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="bg-muted border-0 h-12 text-base pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="bg-muted border-0 h-12 text-base pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="updates"
            checked={formData.getUpdates}
            onCheckedChange={(checked) => handleInputChange('getUpdates', !!checked)}
          />
          <Label htmlFor="updates" className="text-sm text-foreground cursor-pointer">
            Get Eagle & Thistle Updates [Optional]
          </Label>
        </div>

        <div className="text-center">
          <Button variant="link" className="text-primary font-normal text-sm">
            Learn about Eagle & Thistle Updates
          </Button>
        </div>

        <Button 
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-md text-base font-medium"
          onClick={() => setStep(3)}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderSignupStep3 = () => (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">Step 3 of 3</div>
        <h1 className="text-3xl font-medium text-foreground mb-8">Verify Your Email</h1>
      </div>

      <div className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Enter the code sent to</p>
          <p className="text-sm font-medium text-foreground">techfieldstechnologies@gmail.com</p>
        </div>

        <div className="flex justify-center space-x-3">
          {formData.verificationCode.map((digit, index) => (
            <Input
              key={index}
              name={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              className="w-12 h-12 text-center text-lg font-medium bg-muted border-0"
            />
          ))}
        </div>

        <div className="text-center">
          <Button variant="link" className="text-primary font-normal">
            Resend Code
          </Button>
        </div>

        <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-md text-base font-medium">
          Verify
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <a href="/" className="text-xl font-bold text-foreground flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-sm">E&T</span>
          </div>
          <span>Eagle & Thistle</span>
        </a>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>en-CA</span>
          <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
            <span className="text-xs">🌐</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {mode === 'signin' && renderSignIn()}
        {mode === 'signup' && step === 1 && renderSignupStep1()}
        {mode === 'signup' && step === 2 && renderSignupStep2()}
        {mode === 'signup' && step === 3 && renderSignupStep3()}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground p-6 space-x-4">
        <span>Eagle & Thistle © 2025</span>
        <Button variant="link" className="p-0 h-auto text-muted-foreground text-sm">Privacy & Legal</Button>
        <Button variant="link" className="p-0 h-auto text-muted-foreground text-sm">Contact</Button>
      </footer>
    </div>
  );
};

export default Auth;