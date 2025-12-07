import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import FormDialog from '@/components/common/FormDialog';
import FileUploader from '@/components/common/FileUploader';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    Shield,
    Edit,
    Save,
    X,
    Camera,
    Key,
    Bell,
    CheckCircle,
    Loader2
} from 'lucide-react';

interface ProfileData {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    company_name: string;
    service_class: 'residential' | 'commercial' | 'industrial';
    notification_preferences: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
}

const ClientProfileManager = () => {
    const { user, profile, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showDocumentDialog, setShowDocumentDialog] = useState(false);

    const [profileData, setProfileData] = useState<ProfileData>({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postal_code: '',
        company_name: '',
        service_class: 'residential',
        notification_preferences: {
            email: true,
            sms: false,
            push: true,
        },
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

    useEffect(() => {
        fetchProfileData();
    }, [user, profile]);

    const fetchProfileData = async () => {
        if (!user || !profile) return;

        try {
            setLoading(true);

            // Get user email from auth
            const { data: { user: authUser } } = await supabase.auth.getUser();

            setProfileData({
                full_name: profile.full_name || '',
                email: authUser?.email || '',
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                country: profile.country || 'Nigeria',
                postal_code: profile.postal_code || '',
                company_name: profile.company_name || '',
                service_class: profile.service_class || 'residential',
                notification_preferences: profile.notification_preferences || {
                    email: true,
                    sms: false,
                    push: true,
                },
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profileData.full_name,
                    phone: profileData.phone,
                    address: profileData.address,
                    city: profileData.city,
                    state: profileData.state,
                    country: profileData.country,
                    postal_code: profileData.postal_code,
                    company_name: profileData.company_name,
                    service_class: profileData.service_class,
                    notification_preferences: profileData.notification_preferences,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id);

            if (error) throw error;

            toast.success('Profile updated successfully');
            setIsEditing(false);

            // Refresh profile in auth context
            if (refreshProfile) {
                await refreshProfile();
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) throw error;

            toast.success('Password changed successfully');
            setShowPasswordDialog(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: any) {
            console.error('Error changing password:', error);
            toast.error(error.message || 'Failed to change password');
        }
    };

    const handleDocumentUpload = async (files: File[]) => {
        if (!user) return;

        try {
            for (const file of files) {
                // Upload to Supabase Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // Create document record (using inventory table as placeholder)
                const { error: dbError } = await supabase
                    .from('inventory')
                    .insert([{
                        user_id: user.id,
                        item_name: file.name,
                        quantity: 1,
                        unit: 'document',
                        location: 'Profile Documents',
                    }]);

                if (dbError) throw dbError;
            }

            toast.success(`${files.length} document(s) uploaded successfully`);
            setShowDocumentDialog(false);
        } catch (error: any) {
            console.error('Error uploading documents:', error);
            toast.error(error.message || 'Failed to upload documents');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        fetchProfileData(); // Reset to original data
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                My Profile
                            </CardTitle>
                            <CardDescription>
                                Manage your account information and preferences
                            </CardDescription>
                        </div>
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleCancelEdit}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveProfile} disabled={isSaving}>
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name *</Label>
                                    <Input
                                        id="full_name"
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="+234 800 000 0000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Company Name (Optional)</Label>
                                    <Input
                                        id="company_name"
                                        value={profileData.company_name}
                                        onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="ABC Company Ltd"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Address Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input
                                        id="address"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="123 Main Street"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={profileData.city}
                                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Lagos"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State/Province</Label>
                                    <Input
                                        id="state"
                                        value={profileData.state}
                                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Lagos State"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Select
                                        value={profileData.country}
                                        onValueChange={(value) => setProfileData({ ...profileData, country: value })}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                                            <SelectItem value="Ghana">Ghana</SelectItem>
                                            <SelectItem value="Kenya">Kenya</SelectItem>
                                            <SelectItem value="South Africa">South Africa</SelectItem>
                                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                            <SelectItem value="United States">United States</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Postal Code</Label>
                                    <Input
                                        id="postal_code"
                                        value={profileData.postal_code}
                                        onChange={(e) => setProfileData({ ...profileData, postal_code: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="100001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Class */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Service Class
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="service_class">Energy System Type</Label>
                                <Select
                                    value={profileData.service_class}
                                    onValueChange={(value: any) => setProfileData({ ...profileData, service_class: value })}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="residential">Residential - Home Solar Systems</SelectItem>
                                        <SelectItem value="commercial">Commercial - Business Solar Systems</SelectItem>
                                        <SelectItem value="industrial">Industrial - Large-Scale Solar Systems</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground">
                                    Your service class determines available features and pricing
                                </p>
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Notification Preferences
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="email_notif">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id="email_notif"
                                        checked={profileData.notification_preferences.email}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            notification_preferences: {
                                                ...profileData.notification_preferences,
                                                email: e.target.checked
                                            }
                                        })}
                                        disabled={!isEditing}
                                        className="rounded border-gray-300"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="sms_notif">SMS Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id="sms_notif"
                                        checked={profileData.notification_preferences.sms}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            notification_preferences: {
                                                ...profileData.notification_preferences,
                                                sms: e.target.checked
                                            }
                                        })}
                                        disabled={!isEditing}
                                        className="rounded border-gray-300"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="push_notif">Push Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id="push_notif"
                                        checked={profileData.notification_preferences.push}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            notification_preferences: {
                                                ...profileData.notification_preferences,
                                                push: e.target.checked
                                            }
                                        })}
                                        disabled={!isEditing}
                                        className="rounded border-gray-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security & Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            Security
                        </CardTitle>
                        <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowPasswordDialog(true)}
                        >
                            <Key className="h-4 w-4 mr-2" />
                            Change Password
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Verification Documents
                        </CardTitle>
                        <CardDescription>Upload identity and address verification</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowDocumentDialog(true)}
                        >
                            <Camera className="h-4 w-4 mr-2" />
                            Upload Documents
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Change Password Dialog */}
            <FormDialog
                open={showPasswordDialog}
                onOpenChange={setShowPasswordDialog}
                title="Change Password"
                description="Enter your new password"
                onSubmit={handleChangePassword}
                submitLabel="Change Password"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new_password">New Password</Label>
                        <Input
                            id="new_password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirm New Password</Label>
                        <Input
                            id="confirm_password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                        />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Password must be at least 8 characters long
                    </p>
                </div>
            </FormDialog>

            {/* Upload Documents Dialog */}
            <FormDialog
                open={showDocumentDialog}
                onOpenChange={setShowDocumentDialog}
                title="Upload Verification Documents"
                description="Upload ID, utility bills, or other verification documents"
                onSubmit={(e) => {
                    e.preventDefault();
                    setShowDocumentDialog(false);
                }}
                submitLabel="Done"
            >
                <div className="space-y-4">
                    <FileUploader
                        onFilesSelected={handleDocumentUpload}
                        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'], 'application/pdf': ['.pdf'] }}
                        maxFiles={5}
                        maxSize={5 * 1024 * 1024}
                    />
                    <p className="text-sm text-muted-foreground">
                        Accepted formats: JPG, PNG, PDF (Max 5MB each)
                    </p>
                </div>
            </FormDialog>
        </div>
    );
};

export default ClientProfileManager;
