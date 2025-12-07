import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import FormDialog from '@/components/common/FormDialog';
import {
    Briefcase,
    Search,
    Filter,
    Eye,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
    Calendar,
    DollarSign,
    MapPin,
    User,
    FileText,
    TrendingUp,
    Play,
    Pause,
    Check
} from 'lucide-react';

interface Job {
    id: string;
    job_code: string;
    project_name: string;
    job_type: string;
    service_class: string;
    status: string;
    priority: string;
    estimated_value: number;
    client_id: string;
    location: any;
    description: string;
    expected_completion_date: string;
    created_at: string;
    updated_at: string;
    profiles?: {
        full_name: string;
        email: string;
    };
}

const PartnerJobManager = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [partnerApp, setPartnerApp] = useState<any>(null);

    const [updateData, setUpdateData] = useState({
        status: '',
        notes: '',
    });

    useEffect(() => {
        if (user) {
            fetchPartnerApp();
        }
    }, [user]);

    useEffect(() => {
        if (partnerApp) {
            fetchJobs();
            fetchAvailableJobs();
        }
    }, [partnerApp]);

    const fetchPartnerApp = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('partner_applications')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setPartnerApp(data);
        } catch (error) {
            console.error('Error fetching partner application:', error);
        }
    };

    const fetchJobs = async () => {
        if (!partnerApp) return;

        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('job_codes')
                .select(`
          *,
          profiles:client_id (
            full_name,
            email
          )
        `)
                .eq('partner_id', partnerApp.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableJobs = async () => {
        if (!partnerApp) return;

        try {
            const { data, error } = await supabase
                .from('job_codes')
                .select(`
          *,
          profiles:client_id (
            full_name,
            email
          )
        `)
                .is('partner_id', null)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;

            setAvailableJobs(data || []);
        } catch (error) {
            console.error('Error fetching available jobs:', error);
        }
    };

    const handleAcceptJob = async (jobId: string) => {
        if (!partnerApp) return;

        try {
            const { error } = await supabase
                .from('job_codes')
                .update({
                    partner_id: partnerApp.id,
                    status: 'assigned',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', jobId);

            if (error) throw error;

            toast.success('Job accepted successfully!');
            fetchJobs();
            fetchAvailableJobs();
        } catch (error: any) {
            console.error('Error accepting job:', error);
            toast.error(error.message || 'Failed to accept job');
        }
    };

    const handleUpdateJobStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('job_codes')
                .update({
                    status: updateData.status,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', selectedJob.id);

            if (error) throw error;

            // Optionally add a note/comment to job_codes or a separate table
            // For now, just update the status

            toast.success('Job status updated successfully');
            setShowUpdateDialog(false);
            setUpdateData({ status: '', notes: '' });
            fetchJobs();
        } catch (error: any) {
            console.error('Error updating job:', error);
            toast.error(error.message || 'Failed to update job');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewJob = (job: Job) => {
        setSelectedJob(job);
        setShowDetailDialog(true);
    };

    const openUpdateDialog = (job: Job) => {
        setSelectedJob(job);
        setUpdateData({ status: job.status, notes: '' });
        setShowUpdateDialog(true);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
            assigned: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Play },
            in_progress: { className: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: TrendingUp },
            completed: { className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
            cancelled: { className: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle },
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
            low: { className: 'bg-muted/10 text-muted-foreground border-muted/20' },
            medium: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
            high: { className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
            urgent: { className: 'bg-destructive/10 text-destructive border-destructive/20' },
        };

        const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

        return (
            <Badge variant="outline" className={config.className}>
                {priority}
            </Badge>
        );
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.job_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.project_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Statistics
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'in_progress' || j.status === 'assigned').length;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const totalValue = jobs.reduce((sum, j) => sum + (j.estimated_value || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{activeJobs}</p>
                                <p className="text-sm text-muted-foreground">Active</p>
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
                            <div className="p-2 rounded-lg bg-success/10">
                                <DollarSign className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">₦{totalValue.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Total Value</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Available Jobs */}
            {availableJobs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Available Jobs ({availableJobs.length})
                        </CardTitle>
                        <CardDescription>Accept new jobs from the marketplace</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {availableJobs.slice(0, 3).map((job) => (
                                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <code className="text-sm font-mono font-medium">{job.job_code}</code>
                                            {getPriorityBadge(job.priority)}
                                        </div>
                                        <h4 className="font-medium">{job.project_name || 'Untitled Project'}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {job.job_type} • ₦{job.estimated_value?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleViewJob(job)}>
                                            <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" onClick={() => handleAcceptJob(job.id)}>
                                            Accept
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* My Jobs */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                My Jobs
                            </CardTitle>
                            <CardDescription>
                                Manage your assigned jobs and track progress
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
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Jobs</SelectItem>
                                <SelectItem value="assigned">Assigned</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Jobs Table */}
                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-12">
                            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'No jobs match your current filters.'
                                    : "You haven't been assigned any jobs yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Job Code</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredJobs.map((job) => (
                                        <TableRow key={job.id}>
                                            <TableCell>
                                                <code className="text-sm font-mono">{job.job_code}</code>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{job.project_name || 'Untitled'}</div>
                                                    <div className="text-sm text-muted-foreground">{job.service_class}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {job.profiles?.full_name || 'N/A'}
                                            </TableCell>
                                            <TableCell>{job.job_type}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">₦{job.estimated_value?.toLocaleString() || '0'}</div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                                            <TableCell>{getPriorityBadge(job.priority)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewJob(job)}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                    {job.status !== 'completed' && job.status !== 'cancelled' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openUpdateDialog(job)}
                                                        >
                                                            Update
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Job Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Job Details</DialogTitle>
                        <DialogDescription>
                            {selectedJob?.job_code}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedJob && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Project Information</h4>
                                    <p className="text-sm"><strong>Name:</strong> {selectedJob.project_name || 'N/A'}</p>
                                    <p className="text-sm"><strong>Type:</strong> {selectedJob.job_type}</p>
                                    <p className="text-sm"><strong>Class:</strong> {selectedJob.service_class}</p>
                                    <p className="text-sm"><strong>Status:</strong> {getStatusBadge(selectedJob.status)}</p>
                                    <p className="text-sm"><strong>Priority:</strong> {getPriorityBadge(selectedJob.priority)}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Financial</h4>
                                    <p className="text-sm"><strong>Estimated Value:</strong> ₦{selectedJob.estimated_value?.toLocaleString() || '0'}</p>
                                    <p className="text-sm"><strong>Commission (5%):</strong> ₦{((selectedJob.estimated_value || 0) * 0.05).toLocaleString()}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Client Information</h4>
                                <p className="text-sm"><strong>Name:</strong> {selectedJob.profiles?.full_name || 'N/A'}</p>
                                <p className="text-sm"><strong>Email:</strong> {selectedJob.profiles?.email || 'N/A'}</p>
                            </div>

                            {selectedJob.description && (
                                <div>
                                    <h4 className="font-semibold mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                                </div>
                            )}

                            {selectedJob.expected_completion_date && (
                                <div>
                                    <h4 className="font-semibold mb-2">Timeline</h4>
                                    <p className="text-sm">
                                        <strong>Expected Completion:</strong> {new Date(selectedJob.expected_completion_date).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Update Job Status Dialog */}
            <FormDialog
                open={showUpdateDialog}
                onOpenChange={setShowUpdateDialog}
                title="Update Job Status"
                description={`Update status for ${selectedJob?.job_code}`}
                onSubmit={handleUpdateJobStatus}
                submitLabel="Update Status"
                isLoading={isSubmitting}
                maxWidth="lg"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">New Status *</Label>
                        <Select
                            value={updateData.status}
                            onValueChange={(value) => setUpdateData({ ...updateData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="assigned">Assigned</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={updateData.notes}
                            onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                            placeholder="Add any notes about this status update..."
                            rows={4}
                        />
                    </div>
                </div>
            </FormDialog>
        </div>
    );
};

export default PartnerJobManager;
