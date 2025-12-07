import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

type AuthMode = 'signin' | 'signup';
type SignupStep = 1 | 2 | 3;

const Auth = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [step, setStep] = useState<SignupStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    region: '',
    language: '',
    firstName: '',
    lastName: '',
    serviceClass: 'residential' as 'residential' | 'commercial' | 'industrial',
    getUpdates: false,
    verificationCode: ['', '', '', '', '', '']
  });

  // Redirect if already logged in
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    console.log('Auth useEffect triggered:', { user: !!user, profile, userRole: profile?.user_role });

    if (user) {
      // If we have a profile, redirect immediately based on role
      if (profile && profile.user_role) {
        let dashboardPath = '/client-dashboard';

        if (profile.user_role === 'admin') {
          dashboardPath = '/admin-dashboard';
          console.log('Redirecting to admin dashboard');
        } else if (profile.user_role === 'partner') {
          dashboardPath = '/partners-dashboard';
          console.log('Redirecting to partners dashboard');
        } else {
          console.log('Redirecting to client dashboard');
        }

        // Always redirect to the user's dashboard based on their role
        // Only use 'from' location state if it's a different path than the auth page itself
        const from = (location.state as any)?.from?.pathname;
        const redirectPath = from && !from.includes('/auth') ? from : dashboardPath;

        console.log('Final redirect path:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        // If profile is loading or failed to load, set a timeout to redirect to client dashboard as fallback
        // This prevents users from getting stuck on the auth page if profile fetch fails
        timeoutId = setTimeout(() => {
          if (user && !profile) {
            console.warn('Profile fetch timed out or failed, redirecting to client dashboard');
            navigate('/client-dashboard', { replace: true });
          }
          // Even if we have a profile but no user_role, redirect to client dashboard as fallback
          else if (user && profile && !profile.user_role) {
            console.warn('Profile missing user_role, redirecting to client dashboard');
            navigate('/client-dashboard', { replace: true });
          }
        }, 3000); // Increased timeout to 3 seconds to allow more time for profile fetch
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, profile, navigate, location]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateSignInForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUpForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSignIn = async () => {
    if (!validateSignInForm()) {
      return;
    }

    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Signed in successfully!');
      // Navigation will be handled by useEffect after profile is loaded
      // The useEffect will trigger once profile is available
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    if (!validateEmail(resetEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) throw error;

      toast.success('Password reset link sent! Please check your email.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateSignUpForm()) {
      return;
    }

    setLoading(true);
    const { error } = await signUp(formData.email, formData.password, {
      full_name: `${formData.firstName} ${formData.lastName}`.trim(),
      service_class: formData.serviceClass,
      user_role: 'client',
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Failed to create account');
    } else {
      toast.success('Account created! Please check your email to verify your account.');
      setMode('signin');
      setStep(1);
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
          <Input
            id="email-signin"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`bg-muted border-0 h-12 text-base ${errors.email ? 'border-2 border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`bg-muted border-0 h-12 text-base pr-10 ${errors.password ? 'border-2 border-red-500' : ''}`}
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
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <Button
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-md text-base font-medium"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="text-center">
          <Button
            variant="link"
            className="text-primary font-normal"
            onClick={() => setShowForgotPassword(true)}
          >
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

        <div className="space-y-2">
          <Label htmlFor="serviceClass" className="text-sm text-muted-foreground">Service Class</Label>
          <Select value={formData.serviceClass} onValueChange={(value) => handleInputChange('serviceClass', value)}>
            <SelectTrigger className="bg-muted border-0 h-12">
              <SelectValue placeholder="Select service class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
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
          <Label htmlFor="firstName" className="text-sm text-muted-foreground">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`bg-muted border-0 h-12 text-base ${errors.firstName ? 'border-2 border-red-500' : ''}`}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm text-muted-foreground">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`bg-muted border-0 h-12 text-base ${errors.lastName ? 'border-2 border-red-500' : ''}`}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`bg-muted border-0 h-12 text-base ${errors.email ? 'border-2 border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-signup" className="text-sm text-muted-foreground">Password</Label>
          <div className="relative">
            <Input
              id="password-signup"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`bg-muted border-0 h-12 text-base pr-10 ${errors.password ? 'border-2 border-red-500' : ''}`}
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
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`bg-muted border-0 h-12 text-base pr-10 ${errors.confirmPassword ? 'border-2 border-red-500' : ''}`}
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
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
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
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
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

  const renderForgotPassword = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-foreground mb-2">Reset Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-sm text-muted-foreground">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="bg-muted border-0 h-12 text-base"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmail('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/76f8e1a6-f2ed-41a8-ac1e-dbcff484f1ea.png"
            alt="Eagle & Thistle Group"
            className="h-10 w-auto"
          />
        </Link>
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

      {/* Forgot Password Modal */}
      {showForgotPassword && renderForgotPassword()}
    </div>
  );
};

export default Auth;