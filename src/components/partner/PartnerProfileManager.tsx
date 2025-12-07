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
    Building,
    MapPin,
    Phone,
    Mail,
    Edit,
    Save,
    X,
    Upload,
    FileCheck,
    Award,
    Globe,
    Briefcase,
    CheckCircle,
    Loader2,
    Plus,
    Trash2
} from 'lucide-react';

interface PartnerApplication {
    id: string;
    partner_id: string;
    legal_name: string;
    trading_name: string | null;
    partner_type: string;
    partner_category: string;
    partner_country: string;
    partner_state: string;
    partner_city: string;
    registered_address: string;
    contact_email: string;
    contact_phone: string;
    company_registration: string | null;
    tax_id: string | null;
    services_provided: string[];
    services_needed: string[];
    coverage_areas: string[];
    application_status: string;
    kyc_status: string;
    kyc_documents: any;
}

interface Certification {
    id: string;
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date: string | null;
    certificate_number: string;
    status: string;
}

const PartnerProfileManager = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [partnerApp, setPartnerApp] = useState<PartnerApplication | null>(null);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [showKYCDialog, setShowKYCDialog] = useState(false);
    const [showCertDialog, setShowCertDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        legal_name: '',
        trading_name: '',
        partner_type: '',
        partner_category: '',
        partner_country: '',
        partner_state: '',
        partner_city: '',
        registered_address: '',
        contact_email: '',
        contact_phone: '',
        company_registration: '',
        tax_id: '',
        services_provided: [] as string[],
        coverage_areas: [] as string[],
    });

    const [certFormData, setCertFormData] = useState({
        name: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        certificate_number: '',
    });

    useEffect(() => {
        if (user) {
            fetchPartnerData();
        }
    }, [user]);

    const fetchPartnerData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Fetch partner application
            const { data: appData, error: appError } = await supabase
                .from('partner_applications')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (appError && appError.code !== 'PGRST116') {
                throw appError;
            }

            if (appData) {
                setPartnerApp(appData);
                setFormData({
                    legal_name: appData.legal_name || '',
                    trading_name: appData.trading_name || '',
                    partner_type: appData.partner_type || '',
                    partner_category: appData.partner_category || '',
                    partner_country: appData.partner_country || '',
                    partner_state: appData.partner_state || '',
                    partner_city: appData.partner_city || '',
                    registered_address: appData.registered_address || '',
                    contact_email: appData.contact_email || '',
                    contact_phone: appData.contact_phone || '',
                    company_registration: appData.company_registration || '',
                    tax_id: appData.tax_id || '',
                    services_provided: appData.services_provided || [],
                    coverage_areas: appData.coverage_areas || [],
                });

                // Fetch certifications
                const { data: certData, error: certError } = await supabase
                    .from('partner_certification_records')
                    .select('*')
                    .eq('partner_id', appData.id)
                    .order('issue_date', { ascending: false });

                if (certError) throw certError;
                setCertifications(certData || []);
            }
        } catch (error) {
            console.error('Error fetching partner data:', error);
            toast.error('Failed to load partner profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user || !partnerApp) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('partner_applications')
                .update({
                    legal_name: formData.legal_name,
                    trading_name: formData.trading_name || null,
                    partner_type: formData.partner_type,
                    partner_category: formData.partner_category,
                    partner_country: formData.partner_country,
                    partner_state: formData.partner_state,
                    partner_city: formData.partner_city,
                    registered_address: formData.registered_address,
                    contact_email: formData.contact_email,
                    contact_phone: formData.contact_phone,
                    company_registration: formData.company_registration || null,
                    tax_id: formData.tax_id || null,
                    services_provided: formData.services_provided,
                    coverage_areas: formData.coverage_areas,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', partnerApp.id)
                .eq('user_id', user.id);

            if (error) throw error;

            toast.success('Profile updated successfully');
            setIsEditing(false);
            fetchPartnerData();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (partnerApp) {
            setFormData({
                legal_name: partnerApp.legal_name || '',
                trading_name: partnerApp.trading_name || '',
                partner_type: partnerApp.partner_type || '',
                partner_category: partnerApp.partner_category || '',
                partner_country: partnerApp.partner_country || '',
                partner_state: partnerApp.partner_state || '',
                partner_city: partnerApp.partner_city || '',
                registered_address: partnerApp.registered_address || '',
                contact_email: partnerApp.contact_email || '',
                contact_phone: partnerApp.contact_phone || '',
                company_registration: partnerApp.company_registration || '',
                tax_id: partnerApp.tax_id || '',
                services_provided: partnerApp.services_provided || [],
                coverage_areas: partnerApp.coverage_areas || [],
            });
        }
    };

    const handleKYCUpload = async (files: File[]) => {
        if (!user || !partnerApp || files.length === 0) return;

        setIsSubmitting(true);
        try {
            // In production, upload to Supabase Storage
            // For now, just update the kyc_documents field
            const documentRecords = files.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                uploadedAt: new Date().toISOString(),
            }));

            const { error } = await supabase
                .from('partner_applications')
                .update({
                    kyc_documents: documentRecords,
                    kyc_status: 'submitted',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', partnerApp.id)
                .eq('user_id', user.id);

            if (error) throw error;

            toast.success('KYC documents uploaded successfully');
            setShowKYCDialog(false);
            fetchPartnerData();
        } catch (error: any) {
            console.error('Error uploading KYC documents:', error);
            toast.error(error.message || 'Failed to upload documents');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddCertification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !partnerApp) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('partner_certification_records')
                .insert([{
                    partner_id: partnerApp.id,
                    certification_name: certFormData.name,
                    issuing_organization: certFormData.issuer,
                    issue_date: certFormData.issue_date,
                    expiry_date: certFormData.expiry_date || null,
                    certificate_number: certFormData.certificate_number,
                    status: 'active',
                }]);

            if (error) throw error;

            toast.success('Certification added successfully');
            setShowCertDialog(false);
            setCertFormData({
                name: '',
                issuer: '',
                issue_date: '',
                expiry_date: '',
                certificate_number: '',
            });
            fetchPartnerData();
        } catch (error: any) {
            console.error('Error adding certification:', error);
            toast.error(error.message || 'Failed to add certification');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCertification = async (certId: string) => {
        if (!user || !confirm('Are you sure you want to delete this certification?')) return;

        try {
            const { error } = await supabase
                .from('partner_certification_records')
                .delete()
                .eq('id', certId);

            if (error) throw error;

            toast.success('Certification deleted');
            fetchPartnerData();
        } catch (error: any) {
            console.error('Error deleting certification:', error);
            toast.error('Failed to delete certification');
        }
    };

    const getStatusBadge = (status: string) => {
        const config = {
            'Active': { className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
            'KYC Pending': { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Upload },
            'Submitted': { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: FileCheck },
            'Draft': { className: 'bg-muted/10 text-muted-foreground border-muted/20', icon: Edit },
        };

        const statusConfig = config[status as keyof typeof config] || config['Draft'];
        const Icon = statusConfig.icon;

        return (
            <Badge variant="outline" className={statusConfig.className}>
                <Icon className="h-3 w-3 mr-1" />
                {status}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!partnerApp) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Partner Application Found</h3>
                    <p className="text-muted-foreground">Please complete your partner application first.</p>
                </CardContent>
            </Card>
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
                                <Building className="h-5 w-5" />
                                Partner Profile
                            </CardTitle>
                            <CardDescription>
                                Partner ID: {partnerApp.partner_id} • Status: {getStatusBadge(partnerApp.application_status)}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={handleCancelEdit}>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveProfile} disabled={saving}>
                                        {saving ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                        )}
                                        Save Changes
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Business Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Business Information
                            </h3>

                            <div className="space-y-2">
                                <Label htmlFor="legal_name">Legal Name *</Label>
                                <Input
                                    id="legal_name"
                                    value={formData.legal_name}
                                    onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="trading_name">Trading Name</Label>
                                <Input
                                    id="trading_name"
                                    value={formData.trading_name}
                                    onChange={(e) => setFormData({ ...formData, trading_name: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="partner_type">Partner Type</Label>
                                    <Select
                                        value={formData.partner_type}
                                        onValueChange={(value) => setFormData({ ...formData, partner_type: value })}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="company">Company</SelectItem>
                                            <SelectItem value="individual">Individual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="partner_category">Category</Label>
                                    <Select
                                        value={formData.partner_category}
                                        onValueChange={(value) => setFormData({ ...formData, partner_category: value })}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="installer">Installer</SelectItem>
                                            <SelectItem value="sales">Sales</SelectItem>
                                            <SelectItem value="consultant">Consultant</SelectItem>
                                            <SelectItem value="supplier">Supplier</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_registration">Company Registration</Label>
                                    <Input
                                        id="company_registration"
                                        value={formData.company_registration}
                                        onChange={(e) => setFormData({ ...formData, company_registration: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tax_id">Tax ID</Label>
                                    <Input
                                        id="tax_id"
                                        value={formData.tax_id}
                                        onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact & Location */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Contact & Location
                            </h3>

                            <div className="space-y-2">
                                <Label htmlFor="contact_email">Email *</Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_phone">Phone *</Label>
                                <Input
                                    id="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="registered_address">Registered Address *</Label>
                                <Textarea
                                    id="registered_address"
                                    value={formData.registered_address}
                                    onChange={(e) => setFormData({ ...formData, registered_address: e.target.value })}
                                    disabled={!isEditing}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="partner_city">City</Label>
                                    <Input
                                        id="partner_city"
                                        value={formData.partner_city}
                                        onChange={(e) => setFormData({ ...formData, partner_city: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="partner_state">State</Label>
                                    <Input
                                        id="partner_state"
                                        value={formData.partner_state}
                                        onChange={(e) => setFormData({ ...formData, partner_state: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="partner_country">Country</Label>
                                    <Input
                                        id="partner_country"
                                        value={formData.partner_country}
                                        onChange={(e) => setFormData({ ...formData, partner_country: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KYC Documents */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileCheck className="h-5 w-5" />
                                KYC Documents
                            </CardTitle>
                            <CardDescription>
                                Status: {getStatusBadge(partnerApp.kyc_status || 'Pending')}
                            </CardDescription>
                        </div>
                        <Button onClick={() => setShowKYCDialog(true)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Documents
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {partnerApp.kyc_documents && Array.isArray(partnerApp.kyc_documents) && partnerApp.kyc_documents.length > 0 ? (
                        <div className="space-y-2">
                            {partnerApp.kyc_documents.map((doc: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FileCheck className="h-4 w-4 text-success" />
                                        <span className="text-sm font-medium">{doc.name}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No KYC documents uploaded yet
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Certifications
                        </CardTitle>
                        <Button onClick={() => setShowCertDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Certification
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {certifications.length > 0 ? (
                        <div className="space-y-3">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-medium">{cert.certification_name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {cert.issuing_organization} • {cert.certificate_number}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Issued: {new Date(cert.issue_date).toLocaleDateString()}
                                            {cert.expiry_date && ` • Expires: ${new Date(cert.expiry_date).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-destructive"
                                        onClick={() => handleDeleteCertification(cert.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No certifications added yet
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* KYC Upload Dialog */}
            <FormDialog
                open={showKYCDialog}
                onOpenChange={setShowKYCDialog}
                title="Upload KYC Documents"
                description="Upload required documents for KYC verification"
                onSubmit={(e) => {
                    e.preventDefault();
                    // Handled by FileUploader
                }}
                submitLabel="Upload"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <FileUploader
                    onFilesSelected={handleKYCUpload}
                    maxFiles={5}
                    acceptedFileTypes={['application/pdf', 'image/*']}
                    maxFileSize={10 * 1024 * 1024}
                />
            </FormDialog>

            {/* Add Certification Dialog */}
            <FormDialog
                open={showCertDialog}
                onOpenChange={setShowCertDialog}
                title="Add Certification"
                description="Add a new professional certification"
                onSubmit={handleAddCertification}
                submitLabel="Add Certification"
                isLoading={isSubmitting}
                maxWidth="lg"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cert_name">Certification Name *</Label>
                        <Input
                            id="cert_name"
                            value={certFormData.name}
                            onChange={(e) => setCertFormData({ ...certFormData, name: e.target.value })}
                            placeholder="e.g., Solar PV Installation Certificate"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cert_issuer">Issuing Organization *</Label>
                        <Input
                            id="cert_issuer"
                            value={certFormData.issuer}
                            onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })}
                            placeholder="e.g., NABCEP"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cert_number">Certificate Number *</Label>
                        <Input
                            id="cert_number"
                            value={certFormData.certificate_number}
                            onChange={(e) => setCertFormData({ ...certFormData, certificate_number: e.target.value })}
                            placeholder="e.g., CERT-2024-001"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cert_issue_date">Issue Date *</Label>
                            <Input
                                id="cert_issue_date"
                                type="date"
                                value={certFormData.issue_date}
                                onChange={(e) => setCertFormData({ ...certFormData, issue_date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cert_expiry_date">Expiry Date</Label>
                            <Input
                                id="cert_expiry_date"
                                type="date"
                                value={certFormData.expiry_date}
                                onChange={(e) => setCertFormData({ ...certFormData, expiry_date: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </FormDialog>
        </div>
    );
};

export default PartnerProfileManager;
