import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
    DollarSign,
    TrendingUp,
    Download,
    Filter,
    Calendar,
    CheckCircle,
    Clock,
    Loader2,
    FileText,
    CreditCard
} from 'lucide-react';

interface Commission {
    id: string;
    job_code: string;
    project_name: string;
    job_type: string;
    estimated_value: number;
    commission_rate: number;
    commission_amount: number;
    status: string;
    completed_date: string | null;
    payment_date: string | null;
    created_at: string;
}

const PartnerCommissionTracker = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [partnerApp, setPartnerApp] = useState<any>(null);

    useEffect(() => {
        if (user) {
            fetchPartnerApp();
        }
    }, [user]);

    useEffect(() => {
        if (partnerApp) {
            fetchCommissions();
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

    const fetchCommissions = async () => {
        if (!partnerApp) return;

        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('job_codes')
                .select('*')
                .eq('partner_id', partnerApp.id)
                .in('status', ['completed', 'in_progress', 'assigned'])
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform to commission records
            const commissionData: Commission[] = (data || []).map(job => ({
                id: job.id,
                job_code: job.job_code || '',
                project_name: job.project_name || 'Untitled Project',
                job_type: job.job_type || '',
                estimated_value: job.estimated_value || 0,
                commission_rate: 0.05, // 5% commission
                commission_amount: (job.estimated_value || 0) * 0.05,
                status: job.status === 'completed' ? 'approved' : 'pending',
                completed_date: job.status === 'completed' ? job.updated_at : null,
                payment_date: null, // Would come from a payments table
                created_at: job.created_at,
            }));

            setCommissions(commissionData);
        } catch (error) {
            console.error('Error fetching commissions:', error);
            toast.error('Failed to load commissions');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        try {
            const reportData = {
                partner: partnerApp?.legal_name || 'Partner',
                partner_id: partnerApp?.partner_id || '',
                generated_at: new Date().toISOString(),
                commissions: filteredCommissions.map(c => ({
                    job_code: c.job_code,
                    project: c.project_name,
                    value: c.estimated_value,
                    commission: c.commission_amount,
                    status: c.status,
                })),
                summary: {
                    total_commissions: totalCommissions,
                    pending_commissions: pendingCommissions,
                    paid_commissions: paidCommissions,
                    total_jobs: filteredCommissions.length,
                }
            };

            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `commission-report-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Report downloaded successfully');
        } catch (error) {
            toast.error('Failed to generate report');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
            approved: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: CheckCircle },
            paid: { className: 'bg-success/10 text-success border-success/20', icon: CreditCard },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {status}
            </Badge>
        );
    };

    const filteredCommissions = commissions.filter(commission => {
        const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;

        let matchesDate = true;
        if (dateRange !== 'all') {
            const commissionDate = new Date(commission.created_at);
            const now = new Date();

            switch (dateRange) {
                case 'this_month':
                    matchesDate = commissionDate.getMonth() === now.getMonth() &&
                        commissionDate.getFullYear() === now.getFullYear();
                    break;
                case 'last_month':
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
                    matchesDate = commissionDate.getMonth() === lastMonth.getMonth() &&
                        commissionDate.getFullYear() === lastMonth.getFullYear();
                    break;
                case 'this_year':
                    matchesDate = commissionDate.getFullYear() === now.getFullYear();
                    break;
            }
        }

        return matchesStatus && matchesDate;
    });

    // Statistics
    const totalCommissions = filteredCommissions.reduce((sum, c) => sum + c.commission_amount, 0);
    const pendingCommissions = filteredCommissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + c.commission_amount, 0);
    const paidCommissions = filteredCommissions
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + c.commission_amount, 0);
    const approvedCommissions = filteredCommissions
        .filter(c => c.status === 'approved')
        .reduce((sum, c) => sum + c.commission_amount, 0);

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
                                <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">₦{totalCommissions.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Total Commissions</p>
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
                                <p className="text-2xl font-bold">₦{pendingCommissions.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">₦{approvedCommissions.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Approved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <CreditCard className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">₦{paidCommissions.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Paid</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Commissions Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Commission Tracker
                            </CardTitle>
                            <CardDescription>
                                Track your earnings and payment status
                            </CardDescription>
                        </div>
                        <Button onClick={handleDownloadReport}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-48">
                                <Calendar className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="this_month">This Month</SelectItem>
                                <SelectItem value="last_month">Last Month</SelectItem>
                                <SelectItem value="this_year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    {filteredCommissions.length === 0 ? (
                        <div className="text-center py-12">
                            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Commissions Found</h3>
                            <p className="text-muted-foreground">
                                {statusFilter !== 'all' || dateRange !== 'all'
                                    ? 'No commissions match your current filters.'
                                    : 'Complete jobs to start earning commissions.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Job Code</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Job Value</TableHead>
                                        <TableHead>Rate</TableHead>
                                        <TableHead>Commission</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCommissions.map((commission) => (
                                        <TableRow key={commission.id}>
                                            <TableCell>
                                                <code className="text-sm font-mono">{commission.job_code}</code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{commission.project_name}</div>
                                            </TableCell>
                                            <TableCell>{commission.job_type}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">₦{commission.estimated_value.toLocaleString()}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{(commission.commission_rate * 100).toFixed(0)}%</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-success">
                                                    ₦{commission.commission_amount.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(commission.status)}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {commission.completed_date
                                                        ? new Date(commission.completed_date).toLocaleDateString()
                                                        : new Date(commission.created_at).toLocaleDateString()}
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
        </div>
    );
};

export default PartnerCommissionTracker;
