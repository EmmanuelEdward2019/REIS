import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    FileText
} from 'lucide-react';

interface PartnerApplication {
    id: string;
    user_id: string;
    organization_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string | null;
    partner_type: string;
    specialization: string | null;
    years_experience: number | null;
    team_size: number | null;
    country: string | null;
    state_province: string | null;
    website: string | null;
    application_status: 'submitted' | 'under_review' | 'kyc_pending' | 'active' | 'rejected' | 'suspended';
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
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

const PartnerManager = () => {
    const [partners, setPartners] = useState<PartnerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Dialog states
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingPartner, setEditingPartner] = useState<PartnerApplication | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (!confirm(`Are you sure you want to reject "${partner.organization_name}"?`)) return;

        try {
            const { error } = await supabase
                .from('partner_applications')
                .update({
                    application_status: 'rejected',
                    updated_at: new Date().toISOString()
                })
                .eq('id', partner.id);

            if (error) throw error;

            toast.success(`Partner ${partner.organization_name} rejected`);
            fetchPartners();
        } catch (error) {
            console.error('Error rejecting partner:', error);
            toast.error('Failed to reject partner');
        }
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
        const matchesSearch =
            partner.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.contact_email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || partner.application_status === statusFilter;
        const matchesType = typeFilter === 'all' || partner.partner_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
            submitted: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: FileText },
            under_review: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Eye },
            kyc_pending: { className: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: FileText },
            rejected: { className: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
            suspended: { className: 'bg-gray-500/10 text-gray-600 border-gray-500/20', icon: XCircle },
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
                                                        <div className="font-medium">{partner.organization_name}</div>
                                                        <div className="text-sm text-muted-foreground">{partner.contact_email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{partner.contact_name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{partner.partner_type}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <MapPin className="h-3 w-3" />
                                                        {partner.country || 'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(partner.application_status)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {partner.application_status !== 'active' && (
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
        </div>
    );
};

export default PartnerManager;
