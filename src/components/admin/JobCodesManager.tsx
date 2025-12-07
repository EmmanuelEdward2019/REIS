import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import FormDialog from '@/components/common/FormDialog';
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    Briefcase,
    User,
    MapPin,
    Calendar,
    DollarSign,
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
    AlertCircle
} from 'lucide-react';

interface JobCode {
    id: string;
    job_code: string;
    partner_id: string | null;
    client_id: string | null;
    service_type: string;
    description: string | null;
    location: string | null;
    scheduled_date: string | null;
    estimated_cost_ngn: number | null;
    estimated_cost_gbp: number | null;
    actual_cost_ngn: number | null;
    actual_cost_gbp: number | null;
    status: string;
    priority: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
    partner_profile?: {
        full_name: string;
        company_name: string | null;
    } | null;
    client_profile?: {
        full_name: string;
        phone: string | null;
    } | null;
}

interface JobCodeFormData {
    service_type: string;
    description: string;
    location: string;
    scheduled_date: string;
    estimated_cost_ngn: string;
    estimated_cost_gbp: string;
    status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    notes: string;
    partner_id: string;
    client_id: string;
}

const JobCodesManager = () => {
    const { user } = useAuth();
    const [jobCodes, setJobCodes] = useState<JobCode[]>([]);
    const [partners, setPartners] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingJobCode, setEditingJobCode] = useState<JobCode | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState<JobCodeFormData>({
        service_type: 'installation',
        description: '',
        location: '',
        scheduled_date: '',
        estimated_cost_ngn: '',
        estimated_cost_gbp: '',
        status: 'pending',
        priority: 'medium',
        notes: '',
        partner_id: '',
        client_id: '',
    });

    useEffect(() => {
        fetchJobCodes();
        fetchPartners();
        fetchClients();
    }, []);

    const fetchJobCodes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('job_codes')
                .select(`
          *,
          partner_profile:profiles!job_codes_partner_id_fkey(full_name, company_name),
          client_profile:profiles!job_codes_client_id_fkey(full_name, phone)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobCodes(data || []);
        } catch (error) {
            console.error('Error fetching job codes:', error);
            toast.error('Failed to load job codes');
        } finally {
            setLoading(false);
        }
    };

    const fetchPartners = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, user_id, full_name, company_name')
                .eq('user_role', 'partner');

            if (error) throw error;
            setPartners(data || []);
        } catch (error) {
            console.error('Error fetching partners:', error);
        }
    };

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, user_id, full_name, phone')
                .eq('user_role', 'client');

            if (error) throw error;
            setClients(data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleCreateJobCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.service_type || !formData.client_id) {
                toast.error('Please fill in service type and select a client');
                return;
            }

            const { error } = await supabase
                .from('job_codes')
                .insert([{
                    service_type: formData.service_type,
                    description: formData.description || null,
                    location: formData.location || null,
                    scheduled_date: formData.scheduled_date || null,
                    estimated_cost_ngn: formData.estimated_cost_ngn ? parseFloat(formData.estimated_cost_ngn) : null,
                    estimated_cost_gbp: formData.estimated_cost_gbp ? parseFloat(formData.estimated_cost_gbp) : null,
                    status: formData.status,
                    priority: formData.priority,
                    notes: formData.notes || null,
                    partner_id: formData.partner_id || null,
                    client_id: formData.client_id,
                }]);

            if (error) throw error;

            toast.success('Job code created successfully');
            setShowAddDialog(false);
            resetForm();
            fetchJobCodes();
        } catch (error: any) {
            console.error('Error creating job code:', error);
            toast.error(error.message || 'Failed to create job code');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateJobCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingJobCode) return;

        setIsSubmitting(true);

        try {
            const updateData: any = {
                service_type: formData.service_type,
                description: formData.description || null,
                location: formData.location || null,
                scheduled_date: formData.scheduled_date || null,
                estimated_cost_ngn: formData.estimated_cost_ngn ? parseFloat(formData.estimated_cost_ngn) : null,
                estimated_cost_gbp: formData.estimated_cost_gbp ? parseFloat(formData.estimated_cost_gbp) : null,
                status: formData.status,
                priority: formData.priority,
                notes: formData.notes || null,
                partner_id: formData.partner_id || null,
                client_id: formData.client_id,
                updated_at: new Date().toISOString(),
            };

            // If status is being changed to completed, set completed_at
            if (formData.status === 'completed' && editingJobCode.status !== 'completed') {
                updateData.completed_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from('job_codes')
                .update(updateData)
                .eq('id', editingJobCode.id);

            if (error) throw error;

            toast.success('Job code updated successfully');
            setShowEditDialog(false);
            setEditingJobCode(null);
            resetForm();
            fetchJobCodes();
        } catch (error: any) {
            console.error('Error updating job code:', error);
            toast.error(error.message || 'Failed to update job code');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteJobCode = async (jobCode: JobCode) => {
        if (!confirm(`Are you sure you want to delete job code "${jobCode.job_code}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('job_codes')
                .delete()
                .eq('id', jobCode.id);

            if (error) throw error;

            toast.success('Job code deleted successfully');
            fetchJobCodes();
        } catch (error: any) {
            console.error('Error deleting job code:', error);
            toast.error(error.message || 'Failed to delete job code');
        }
    };

    const openEditDialog = (jobCode: JobCode) => {
        setEditingJobCode(jobCode);
        setFormData({
            service_type: jobCode.service_type,
            description: jobCode.description || '',
            location: jobCode.location || '',
            scheduled_date: jobCode.scheduled_date || '',
            estimated_cost_ngn: jobCode.estimated_cost_ngn?.toString() || '',
            estimated_cost_gbp: jobCode.estimated_cost_gbp?.toString() || '',
            status: jobCode.status as any,
            priority: jobCode.priority as any,
            notes: jobCode.notes || '',
            partner_id: jobCode.partner_id || '',
            client_id: jobCode.client_id || '',
        });
        setShowEditDialog(true);
    };

    const resetForm = () => {
        setFormData({
            service_type: 'installation',
            description: '',
            location: '',
            scheduled_date: '',
            estimated_cost_ngn: '',
            estimated_cost_gbp: '',
            status: 'pending',
            priority: 'medium',
            notes: '',
            partner_id: '',
            client_id: '',
        });
    };

    const filteredJobCodes = jobCodes.filter(jc => {
        const matchesSearch =
            jc.job_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jc.client_profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || jc.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || jc.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
            assigned: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: User },
            in_progress: { className: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Briefcase },
            completed: { className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
            cancelled: { className: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const priorityConfig = {
            low: { className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
            medium: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
            high: { className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
            urgent: { className: 'bg-red-500/10 text-red-600 border-red-500/20' },
        };

        const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

        return (
            <Badge variant="outline" className={config.className}>
                {priority}
            </Badge>
        );
    };

    // Statistics
    const totalJobs = jobCodes.length;
    const pendingJobs = jobCodes.filter(jc => jc.status === 'pending').length;
    const inProgressJobs = jobCodes.filter(jc => jc.status === 'in_progress').length;
    const completedJobs = jobCodes.filter(jc => jc.status === 'completed').length;
    const urgentJobs = jobCodes.filter(jc => jc.priority === 'urgent').length;
    const totalRevenue = jobCodes
        .filter(jc => jc.status === 'completed')
        .reduce((sum, jc) => sum + (jc.actual_cost_ngn || jc.estimated_cost_ngn || 0), 0);

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalJobs}</p>
                                <p className="text-sm text-muted-foreground">Total Jobs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{pendingJobs}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Briefcase className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{inProgressJobs}</p>
                                <p className="text-sm text-muted-foreground">In Progress</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <CheckCircle className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{completedJobs}</p>
                                <p className="text-sm text-muted-foreground">Completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{urgentJobs}</p>
                                <p className="text-sm text-muted-foreground">Urgent</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
                                <p className="text-sm text-muted-foreground">Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Job Codes Management Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Job Codes
                            </CardTitle>
                            <CardDescription>
                                Manage installation, maintenance, and service jobs
                            </CardDescription>
                        </div>
                        <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Job
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search jobs..."
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
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="assigned">Assigned</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Job Codes Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Job Code</TableHead>
                                        <TableHead>Service Type</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Partner</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Scheduled</TableHead>
                                        <TableHead>Cost</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredJobCodes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                                                No job codes found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredJobCodes.map((jc) => (
                                            <TableRow key={jc.id}>
                                                <TableCell>
                                                    <code className="text-sm font-mono">{jc.job_code}</code>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{jc.service_type}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{jc.client_profile?.full_name || 'N/A'}</div>
                                                        {jc.client_profile?.phone && (
                                                            <div className="text-sm text-muted-foreground">{jc.client_profile.phone}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {jc.partner_profile ? (
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{jc.partner_profile.full_name}</div>
                                                            {jc.partner_profile.company_name && (
                                                                <div className="text-sm text-muted-foreground">{jc.partner_profile.company_name}</div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">Unassigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {jc.location ? (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <MapPin className="h-3 w-3" />
                                                            {jc.location}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {jc.scheduled_date ? (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(jc.scheduled_date).toLocaleDateString()}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">Not scheduled</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {jc.estimated_cost_ngn ? (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <DollarSign className="h-3 w-3" />
                                                            ₦{jc.estimated_cost_ngn.toLocaleString()}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{getPriorityBadge(jc.priority)}</TableCell>
                                                <TableCell>{getStatusBadge(jc.status)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEditDialog(jc)}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteJobCode(jc)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
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

            {/* Add Job Code Dialog */}
            <FormDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                title="Create New Job"
                description="Schedule a new installation or service job"
                onSubmit={handleCreateJobCode}
                submitLabel="Create Job"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="service_type">Service Type *</Label>
                            <Select
                                value={formData.service_type}
                                onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="installation">Installation</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="repair">Repair</SelectItem>
                                    <SelectItem value="inspection">Inspection</SelectItem>
                                    <SelectItem value="upgrade">Upgrade</SelectItem>
                                    <SelectItem value="consultation">Consultation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Job description..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="client_id">Client *</Label>
                            <Select
                                value={formData.client_id}
                                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(clients || []).map((client) => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="partner_id">Assign to Partner</Label>
                            <Select
                                value={formData.partner_id || ''}
                                onValueChange={(value) => setFormData({ ...formData, partner_id: value === 'unassigned' ? '' : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select partner (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {(partners || []).map((partner) => (
                                        <SelectItem key={partner.id} value={partner.id}>
                                            {partner.full_name} {partner.company_name && `(${partner.company_name})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Lagos, Nigeria"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scheduled_date">Scheduled Date</Label>
                            <Input
                                id="scheduled_date"
                                type="datetime-local"
                                value={formData.scheduled_date}
                                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="estimated_cost_ngn">Estimated Cost (NGN)</Label>
                            <Input
                                id="estimated_cost_ngn"
                                type="number"
                                value={formData.estimated_cost_ngn}
                                onChange={(e) => setFormData({ ...formData, estimated_cost_ngn: e.target.value })}
                                placeholder="500000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estimated_cost_gbp">Estimated Cost (GBP)</Label>
                            <Input
                                id="estimated_cost_gbp"
                                type="number"
                                value={formData.estimated_cost_gbp}
                                onChange={(e) => setFormData({ ...formData, estimated_cost_gbp: e.target.value })}
                                placeholder="400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional notes..."
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="assigned">Assigned</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </FormDialog>

            {/* Edit Job Code Dialog - Similar structure */}
            <FormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                title="Edit Job"
                description="Update job details and status"
                onSubmit={handleUpdateJobCode}
                submitLabel="Save Changes"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_service_type">Service Type *</Label>
                            <Select
                                value={formData.service_type}
                                onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="installation">Installation</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="repair">Repair</SelectItem>
                                    <SelectItem value="inspection">Inspection</SelectItem>
                                    <SelectItem value="upgrade">Upgrade</SelectItem>
                                    <SelectItem value="consultation">Consultation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_description">Description</Label>
                        <Textarea
                            id="edit_description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_client_id">Client *</Label>
                            <Select
                                value={formData.client_id}
                                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_partner_id">Assign to Partner</Label>
                            <Select
                                value={formData.partner_id}
                                onValueChange={(value) => setFormData({ ...formData, partner_id: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Unassigned</SelectItem>
                                    {partners.map((partner) => (
                                        <SelectItem key={partner.id} value={partner.id}>
                                            {partner.full_name} {partner.company_name && `(${partner.company_name})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_location">Location</Label>
                            <Input
                                id="edit_location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_scheduled_date">Scheduled Date</Label>
                            <Input
                                id="edit_scheduled_date"
                                type="datetime-local"
                                value={formData.scheduled_date}
                                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_estimated_cost_ngn">Estimated Cost (NGN)</Label>
                            <Input
                                id="edit_estimated_cost_ngn"
                                type="number"
                                value={formData.estimated_cost_ngn}
                                onChange={(e) => setFormData({ ...formData, estimated_cost_ngn: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_estimated_cost_gbp">Estimated Cost (GBP)</Label>
                            <Input
                                id="edit_estimated_cost_gbp"
                                type="number"
                                value={formData.estimated_cost_gbp}
                                onChange={(e) => setFormData({ ...formData, estimated_cost_gbp: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_notes">Notes</Label>
                        <Textarea
                            id="edit_notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="assigned">Assigned</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </FormDialog>
        </div>
    );
};

export default JobCodesManager;
