import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import FormDialog from '@/components/common/FormDialog';
import {
    Search,
    Filter,
    Edit,
    Trash2,
    UserCheck,
    MapPin,
    CheckCircle,
    XCircle,
    Loader2,
    Eye,
    FileText,
    Building2,
    Phone,
    Mail,
    Globe,
    CreditCard,
    Shield,
    Calendar,
    User,
    AlertCircle,
    FileCheck,
    Clock
} from 'lucide-react';

interface PartnerApplication {
    id: string;
    user_id: string;
    partner_id: string | null;

    // Basic Info
    partner_type: string;
    partner_country: string;
    partner_category: string;
    legal_name: string;
    trading_name: string | null;

    // Contact
    email: string;
    phone: string;
    website: string | null;
    address: any;

    // Company Details
    registration_number: string | null;
    tax_id: string | null;
    vat_number: string | null;
    incorporation_date: string | null;
    company_size: string | null;

    // Individual Details
    first_name: string | null;
    last_name: string | null;
    date_of_birth: string | null;
    national_id: string | null; // NIN

    // Business Profile
    years_in_business: number | null;
    annual_revenue: string | null;
    number_of_employees: number | null;
    service_areas: any;

    // Capabilities
    services_provided: any;
    certifications: any;
    technical_capabilities: any;
    equipment_owned: any;

    // Financial
    bank_name: string | null;
    bank_account_number: string | null;
    bank_routing_number: string | null;
    bank_swift_code: string | null;
    payment_terms: string | null;

    // Insurance
    insurance_provider: string | null;
    insurance_policy_number: string | null;
    insurance_expiry: string | null;
    insurance_coverage_amount: number | null;

    // Compliance
    health_safety_policy: boolean;
    quality_management_system: boolean;
    environmental_policy: boolean;

    // References & Documents
    business_references: any;
    documents: any;

    // KYC
    kyc_status: 'pending' | 'in_progress' | 'approved' | 'rejected';
    kyc_verified_at: string | null;
    kyc_verified_by: string | null;
    kyc_notes: string | null;

    // Agreements
    terms_accepted: boolean;
    privacy_accepted: boolean;
    code_of_conduct_accepted: boolean;

    // Admin
    admin_notes: string | null;
    rejection_reason: string | null;
    application_status: 'draft' | 'submitted' | 'under_review' | 'kyc_pending' | 'kyc_approved' | 'compliance_verified' | 'active' | 'suspended' | 'rejected';

    // Timestamps
    created_at: string;
    updated_at: string;
    submission_date: string | null;
    approval_date: string | null;

    // Legacy fields for compatibility
    organization_name?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string | null;
    specialization?: string | null;
    country?: string | null;
}

interface PartnerFormData {
    organization_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    partner_type: string;
    specialization: string;
    country: string;
    application_status: string;
}

// Rejection reasons
const REJECTION_REASONS = [
    { value: 'incomplete_docs', label: 'Incomplete Documentation' },
    { value: 'invalid_id', label: 'Invalid ID/NIN' },
    { value: 'failed_verification', label: 'Failed Verification Checks' },
    { value: 'duplicate_application', label: 'Duplicate Application' },
    { value: 'ineligible_category', label: 'Ineligible Partner Category' },
    { value: 'missing_certifications', label: 'Missing Required Certifications' },
    { value: 'insufficient_experience', label: 'Insufficient Experience' },
    { value: 'other', label: 'Other (specify in notes)' },
];

const PartnerManager = () => {
    const [partners, setPartners] = useState<PartnerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Dialog states
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDetailsSheet, setShowDetailsSheet] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [editingPartner, setEditingPartner] = useState<PartnerApplication | null>(null);
    const [viewingPartner, setViewingPartner] = useState<PartnerApplication | null>(null);
    const [rejectingPartner, setRejectingPartner] = useState<PartnerApplication | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Rejection form
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionNotes, setRejectionNotes] = useState('');

    // Form data
    const [formData, setFormData] = useState<PartnerFormData>({
        organization_name: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        partner_type: '',
        specialization: '',
        country: '',
        application_status: '',
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('partner_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPartners(data || []);
        } catch (error) {
            console.error('Error fetching partners:', error);
            toast.error('Failed to load partners');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePartner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPartner) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('partner_applications')
                .update({
                    organization_name: formData.organization_name,
                    contact_name: formData.contact_name,
                    contact_email: formData.contact_email,
                    contact_phone: formData.contact_phone,
                    partner_type: formData.partner_type,
                    specialization: formData.specialization,
                    country: formData.country,
                    application_status: formData.application_status,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingPartner.id);

            if (error) throw error;

            toast.success('Partner updated successfully');
            setShowEditDialog(false);
            setEditingPartner(null);
            fetchPartners();
        } catch (error: any) {
            console.error('Error updating partner:', error);
            toast.error(error.message || 'Failed to update partner');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePartner = async (partner: PartnerApplication) => {
        if (!confirm(`Are you sure you want to delete "${partner.organization_name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('partner_applications')
                .delete()
                .eq('id', partner.id);

            if (error) throw error;

            toast.success('Partner deleted successfully');
            fetchPartners();
        } catch (error: any) {
            console.error('Error deleting partner:', error);
            toast.error(error.message || 'Failed to delete partner');
        }
    };

    const handleApprovePartner = async (partner: PartnerApplication) => {
        try {
            const { error } = await supabase
                .from('partner_applications')
                .update({
                    application_status: 'active',
                    updated_at: new Date().toISOString()
                })
                .eq('id', partner.id);

            if (error) throw error;

            toast.success(`Partner ${partner.organization_name} approved`);
            fetchPartners();
        } catch (error) {
            console.error('Error approving partner:', error);
            toast.error('Failed to approve partner');
        }
    };

    const handleRejectPartner = async (partner: PartnerApplication) => {
        setRejectingPartner(partner);
        setRejectionReason('');
        setRejectionNotes('');
        setShowRejectDialog(true);
    };

    const handleConfirmReject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectingPartner || !rejectionReason) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('partner_applications')
                .update({
                    application_status: 'rejected',
                    rejection_reason: rejectionReason,
                    admin_notes: rejectionNotes || null,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', rejectingPartner.id);

            if (error) throw error;

            toast.success(`Partner ${rejectingPartner.legal_name || rejectingPartner.organization_name} rejected`);
            setShowRejectDialog(false);
            setRejectingPartner(null);
            fetchPartners();
        } catch (error) {
            console.error('Error rejecting partner:', error);
            toast.error('Failed to reject partner');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyKYC = async (partner: PartnerApplication, status: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('partner_applications')
                .update({
                    kyc_status: status,
                    kyc_verified_at: new Date().toISOString(),
                    application_status: status === 'approved' ? 'kyc_approved' : 'rejected',
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', partner.id);

            if (error) throw error;

            toast.success(`KYC ${status} for ${partner.legal_name || partner.organization_name}`);
            fetchPartners();
            // Refresh details view if open
            if (viewingPartner?.id === partner.id) {
                const { data } = await supabase
                    .from('partner_applications')
                    .select('*')
                    .eq('id', partner.id)
                    .single();
                if (data) setViewingPartner(data as any);
            }
        } catch (error) {
            console.error('Error updating KYC:', error);
            toast.error('Failed to update KYC status');
        }
    };

    const handleUpdateAdminNotes = async (partner: PartnerApplication, notes: string) => {
        try {
            const { error } = await supabase
                .from('partner_applications')
                .update({
                    admin_notes: notes,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', partner.id);

            if (error) throw error;
            toast.success('Notes saved');
        } catch (error) {
            console.error('Error saving notes:', error);
            toast.error('Failed to save notes');
        }
    };

    const openDetailsSheet = (partner: PartnerApplication) => {
        setViewingPartner(partner);
        setShowDetailsSheet(true);
    };

    const openEditDialog = (partner: PartnerApplication) => {
        setEditingPartner(partner);
        setFormData({
            organization_name: partner.organization_name,
            contact_name: partner.contact_name,
            contact_email: partner.contact_email,
            contact_phone: partner.contact_phone || '',
            partner_type: partner.partner_type,
            specialization: partner.specialization || '',
            country: partner.country || '',
            application_status: partner.application_status,
        });
        setShowEditDialog(true);
    };

    const filteredPartners = partners.filter(partner => {
        const searchTarget = (partner.legal_name || partner.organization_name || '').toLowerCase();
        const emailTarget = (partner.email || partner.contact_email || '').toLowerCase();
        const matchesSearch =
            searchTarget.includes(searchTerm.toLowerCase()) ||
            emailTarget.includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || partner.application_status === statusFilter;
        const matchesType = typeFilter === 'all' || partner.partner_type === typeFilter || partner.partner_category === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
            submitted: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: FileText },
            under_review: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Eye },
            kyc_pending: { className: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: FileText },
            kyc_approved: { className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: FileCheck },
            compliance_verified: { className: 'bg-green-500/10 text-green-600 border-green-500/20', icon: Shield },
            rejected: { className: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
            suspended: { className: 'bg-gray-500/10 text-gray-600 border-gray-500/20', icon: XCircle },
            draft: { className: 'bg-gray-300/10 text-gray-500 border-gray-300/20', icon: Clock },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted;
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    const getKYCBadge = (status: string) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', label: 'Pending' },
            in_progress: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'In Progress' },
            approved: { className: 'bg-success/10 text-success border-success/20', label: 'Approved' },
            rejected: { className: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Rejected' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return (
            <Badge variant="outline" className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Partner Network
                            </CardTitle>
                            <CardDescription>
                                Manage partner applications, KYC status, and network performance
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search partners..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="under_review">Under Review</SelectItem>
                                <SelectItem value="kyc_pending">KYC Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Partner Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="installer">Installer</SelectItem>
                                <SelectItem value="distributor">Distributor</SelectItem>
                                <SelectItem value="service_provider">Service Provider</SelectItem>
                                <SelectItem value="consultant">Consultant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Partners Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Organization</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPartners.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No partners found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPartners.map((partner) => (
                                            <TableRow key={partner.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{partner.legal_name || partner.organization_name}</div>
                                                        <div className="text-sm text-muted-foreground">{partner.email || partner.contact_email}</div>
                                                        {partner.partner_id && (
                                                            <div className="text-xs text-muted-foreground font-mono">{partner.partner_id}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div>{partner.phone || partner.contact_phone || 'N/A'}</div>
                                                        <Badge variant="outline" className="text-xs">
                                                            {partner.partner_category || partner.specialization || partner.partner_type}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{partner.partner_type || 'individual'}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <MapPin className="h-3 w-3" />
                                                        {partner.partner_country || partner.country || 'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(partner.application_status)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => openDetailsSheet(partner)}
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {partner.application_status !== 'active' && partner.application_status !== 'rejected' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-success hover:text-success hover:bg-success/10"
                                                                onClick={() => handleApprovePartner(partner)}
                                                                title="Approve"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {partner.application_status !== 'rejected' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-orange-500 hover:text-orange-500 hover:bg-orange-500/10"
                                                                onClick={() => handleRejectPartner(partner)}
                                                                title="Reject"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => openEditDialog(partner)}
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeletePartner(partner)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Partner Dialog */}
            <FormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                title="Edit Partner Details"
                description="Update partner information and status"
                onSubmit={handleUpdatePartner}
                submitLabel="Save Changes"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="organization_name">Organization Name</Label>
                            <Input
                                id="organization_name"
                                value={formData.organization_name}
                                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_name">Contact Name</Label>
                            <Input
                                id="contact_name"
                                value={formData.contact_name}
                                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Email</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_phone">Phone</Label>
                            <Input
                                id="contact_phone"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="partner_type">Partner Type</Label>
                            <Select
                                value={formData.partner_type}
                                onValueChange={(value) => setFormData({ ...formData, partner_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="installer">Installer</SelectItem>
                                    <SelectItem value="distributor">Distributor</SelectItem>
                                    <SelectItem value="service_provider">Service Provider</SelectItem>
                                    <SelectItem value="consultant">Consultant</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                            id="specialization"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="application_status">Status</Label>
                        <Select
                            value={formData.application_status}
                            onValueChange={(value) => setFormData({ ...formData, application_status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="under_review">Under Review</SelectItem>
                                <SelectItem value="kyc_pending">KYC Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </FormDialog>

            {/* Partner Details Sheet */}
            <Sheet open={showDetailsSheet} onOpenChange={setShowDetailsSheet}>
                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {viewingPartner?.legal_name || viewingPartner?.organization_name}
                        </SheetTitle>
                        <SheetDescription>
                            Partner ID: {viewingPartner?.partner_id || 'Not assigned'}
                        </SheetDescription>
                    </SheetHeader>

                    {viewingPartner && (
                        <div className="mt-6">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="kyc">KYC</TabsTrigger>
                                    <TabsTrigger value="financial">Financial</TabsTrigger>
                                    <TabsTrigger value="admin">Admin</TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs">Status</Label>
                                            <div>{getStatusBadge(viewingPartner.application_status)}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground text-xs">Type</Label>
                                            <Badge variant="outline">{viewingPartner.partner_type || 'individual'}</Badge>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <User className="h-4 w-4" /> Contact Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                {viewingPartner.email || viewingPartner.contact_email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                {viewingPartner.phone || viewingPartner.contact_phone || 'N/A'}
                                            </div>
                                            {viewingPartner.website && (
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                                    {viewingPartner.website}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                {viewingPartner.partner_country || viewingPartner.country || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Building2 className="h-4 w-4" /> Business Details
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Category</Label>
                                                <p>{viewingPartner.partner_category || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Trading Name</Label>
                                                <p>{viewingPartner.trading_name || 'N/A'}</p>
                                            </div>
                                            {viewingPartner.partner_type === 'company' && (
                                                <>
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">Registration No.</Label>
                                                        <p>{viewingPartner.registration_number || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">Company Size</Label>
                                                        <p>{viewingPartner.company_size || 'N/A'}</p>
                                                    </div>
                                                </>
                                            )}
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Years in Business</Label>
                                                <p>{viewingPartner.years_in_business || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Employees</Label>
                                                <p>{viewingPartner.number_of_employees || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Timeline
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Created</Label>
                                                <p>{formatDate(viewingPartner.created_at)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Submitted</Label>
                                                <p>{formatDate(viewingPartner.submission_date)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Last Updated</Label>
                                                <p>{formatDate(viewingPartner.updated_at)}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Approved</Label>
                                                <p>{formatDate(viewingPartner.approval_date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* KYC Tab */}
                                <TabsContent value="kyc" className="space-y-4 mt-4">
                                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium flex items-center gap-2">
                                                <Shield className="h-4 w-4" /> KYC Status
                                            </h4>
                                            {getKYCBadge(viewingPartner.kyc_status || 'pending')}
                                        </div>
                                        {viewingPartner.kyc_verified_at && (
                                            <p className="text-sm text-muted-foreground">
                                                Verified on: {formatDate(viewingPartner.kyc_verified_at)}
                                            </p>
                                        )}

                                        {viewingPartner.kyc_status !== 'approved' && (
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleVerifyKYC(viewingPartner, 'approved')}
                                                    className="bg-success hover:bg-success/90"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Approve KYC
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleVerifyKYC(viewingPartner, 'rejected')}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Reject KYC
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-medium">Identity Verification</h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <Label className="text-muted-foreground text-xs">National ID (NIN)</Label>
                                                <p className="font-mono">{viewingPartner.national_id || 'Not provided'}</p>
                                            </div>
                                            {viewingPartner.partner_type === 'individual' && (
                                                <>
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">First Name</Label>
                                                        <p>{viewingPartner.first_name || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">Last Name</Label>
                                                        <p>{viewingPartner.last_name || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">Date of Birth</Label>
                                                        <p>{formatDate(viewingPartner.date_of_birth)}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-medium">Compliance</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                {viewingPartner.terms_accepted ? (
                                                    <CheckCircle className="h-4 w-4 text-success" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-destructive" />
                                                )}
                                                <span className="text-sm">Terms Accepted</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {viewingPartner.privacy_accepted ? (
                                                    <CheckCircle className="h-4 w-4 text-success" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-destructive" />
                                                )}
                                                <span className="text-sm">Privacy Policy Accepted</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {viewingPartner.health_safety_policy ? (
                                                    <CheckCircle className="h-4 w-4 text-success" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <span className="text-sm">Health & Safety Policy</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {viewingPartner.quality_management_system ? (
                                                    <CheckCircle className="h-4 w-4 text-success" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <span className="text-sm">Quality Management System</span>
                                            </div>
                                        </div>
                                    </div>

                                    {viewingPartner.kyc_notes && (
                                        <>
                                            <Separator />
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground text-xs">KYC Notes</Label>
                                                <p className="text-sm p-3 bg-muted rounded">{viewingPartner.kyc_notes}</p>
                                            </div>
                                        </>
                                    )}
                                </TabsContent>

                                {/* Financial Tab */}
                                <TabsContent value="financial" className="space-y-4 mt-4">
                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" /> Bank Details
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Bank Name</Label>
                                                <p>{viewingPartner.bank_name || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Account Number</Label>
                                                <p className="font-mono">{viewingPartner.bank_account_number || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground text-xs">Sort Code / Routing</Label>
                                                <p className="font-mono">{viewingPartner.bank_routing_number || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground text-xs">SWIFT/BIC</Label>
                                                <p className="font-mono">{viewingPartner.bank_swift_code || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-medium">Payment Terms</h4>
                                        <p className="text-sm">{viewingPartner.payment_terms || 'Not specified'}</p>
                                    </div>

                                    {viewingPartner.insurance_provider && (
                                        <>
                                            <Separator />
                                            <div className="space-y-3">
                                                <h4 className="font-medium">Insurance</h4>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">Provider</Label>
                                                        <p>{viewingPartner.insurance_provider}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">Policy Number</Label>
                                                        <p>{viewingPartner.insurance_policy_number || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">Expiry</Label>
                                                        <p>{formatDate(viewingPartner.insurance_expiry)}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">Coverage</Label>
                                                        <p>{viewingPartner.insurance_coverage_amount ? `£${viewingPartner.insurance_coverage_amount.toLocaleString()}` : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </TabsContent>

                                {/* Admin Tab */}
                                <TabsContent value="admin" className="space-y-4 mt-4">
                                    {viewingPartner.rejection_reason && (
                                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                            <div className="flex items-center gap-2 text-destructive mb-2">
                                                <AlertCircle className="h-4 w-4" />
                                                <span className="font-medium">Rejection Reason</span>
                                            </div>
                                            <p className="text-sm">
                                                {REJECTION_REASONS.find(r => r.value === viewingPartner.rejection_reason)?.label || viewingPartner.rejection_reason}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <Label>Admin Notes</Label>
                                        <Textarea
                                            defaultValue={viewingPartner.admin_notes || ''}
                                            placeholder="Add internal notes about this partner..."
                                            rows={4}
                                            onBlur={(e) => {
                                                if (e.target.value !== (viewingPartner.admin_notes || '')) {
                                                    handleUpdateAdminNotes(viewingPartner, e.target.value);
                                                }
                                            }}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex gap-2">
                                        {viewingPartner.application_status !== 'active' && (
                                            <Button
                                                onClick={() => handleApprovePartner(viewingPartner)}
                                                className="bg-success hover:bg-success/90"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approve Partner
                                            </Button>
                                        )}
                                        {viewingPartner.application_status !== 'rejected' && (
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleRejectPartner(viewingPartner)}
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject Partner
                                            </Button>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Reject Partner Dialog */}
            <FormDialog
                open={showRejectDialog}
                onOpenChange={setShowRejectDialog}
                title="Reject Partner Application"
                description={`Reject application from ${rejectingPartner?.legal_name || rejectingPartner?.organization_name}`}
                onSubmit={handleConfirmReject}
                submitLabel="Confirm Rejection"
                isLoading={isSubmitting}
                maxWidth="md"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="rejection_reason">Rejection Reason *</Label>
                        <Select
                            value={rejectionReason}
                            onValueChange={setRejectionReason}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {REJECTION_REASONS.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                        {reason.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rejection_notes">Additional Notes</Label>
                        <Textarea
                            id="rejection_notes"
                            value={rejectionNotes}
                            onChange={(e) => setRejectionNotes(e.target.value)}
                            placeholder="Provide additional details about the rejection..."
                            rows={4}
                        />
                    </div>
                </div>
            </FormDialog>
        </div>
    );
};

export default PartnerManager;
