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
    FileText,
    Building2,
    Zap,
    TrendingUp,
    Award,
    Loader2,
    CheckCircle,
    MapPin
} from 'lucide-react';

interface CaseStudy {
    id: string;
    title: string;
    slug: string;
    client_name: string;
    project_type: string;
    location: string | null;
    system_size_kw: number | null;
    installation_date: string | null;
    challenge: string | null;
    solution: string | null;
    results: string | null;
    energy_savings_percent: number | null;
    cost_savings_ngn: number | null;
    roi_months: number | null;
    testimonial: string | null;
    testimonial_author: string | null;
    images: string[] | null;
    partner_id: string | null;
    status: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface CaseStudyFormData {
    title: string;
    client_name: string;
    project_type: string;
    location: string;
    system_size_kw: string;
    installation_date: string;
    challenge: string;
    solution: string;
    results: string;
    energy_savings_percent: string;
    cost_savings_ngn: string;
    roi_months: string;
    testimonial: string;
    testimonial_author: string;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
}

const CaseStudiesManager = () => {
    const { user } = useAuth();
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState<CaseStudyFormData>({
        title: '',
        client_name: '',
        project_type: 'residential_solar',
        location: '',
        system_size_kw: '',
        installation_date: '',
        challenge: '',
        solution: '',
        results: '',
        energy_savings_percent: '',
        cost_savings_ngn: '',
        roi_months: '',
        testimonial: '',
        testimonial_author: '',
        status: 'draft',
        is_featured: false,
    });

    useEffect(() => {
        fetchCaseStudies();
    }, []);

    const fetchCaseStudies = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('case_studies')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCaseStudies(data || []);
        } catch (error) {
            console.error('Error fetching case studies:', error);
            toast.error('Failed to load case studies');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleCreateCaseStudy = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.title || !formData.client_name) {
                toast.error('Please fill in title and client name');
                return;
            }

            const slug = generateSlug(formData.title);

            const { error } = await supabase
                .from('case_studies')
                .insert([{
                    title: formData.title,
                    slug,
                    client_name: formData.client_name,
                    project_type: formData.project_type,
                    location: formData.location || null,
                    system_size_kw: formData.system_size_kw ? parseFloat(formData.system_size_kw) : null,
                    installation_date: formData.installation_date || null,
                    challenge: formData.challenge || null,
                    solution: formData.solution || null,
                    results: formData.results || null,
                    energy_savings_percent: formData.energy_savings_percent ? parseFloat(formData.energy_savings_percent) : null,
                    cost_savings_ngn: formData.cost_savings_ngn ? parseFloat(formData.cost_savings_ngn) : null,
                    roi_months: formData.roi_months ? parseInt(formData.roi_months) : null,
                    testimonial: formData.testimonial || null,
                    testimonial_author: formData.testimonial_author || null,
                    status: formData.status,
                    is_featured: formData.is_featured,
                }]);

            if (error) throw error;

            toast.success('Case study created successfully');
            setShowAddDialog(false);
            resetForm();
            fetchCaseStudies();
        } catch (error: any) {
            console.error('Error creating case study:', error);
            toast.error(error.message || 'Failed to create case study');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateCaseStudy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCaseStudy) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('case_studies')
                .update({
                    title: formData.title,
                    client_name: formData.client_name,
                    project_type: formData.project_type,
                    location: formData.location || null,
                    system_size_kw: formData.system_size_kw ? parseFloat(formData.system_size_kw) : null,
                    installation_date: formData.installation_date || null,
                    challenge: formData.challenge || null,
                    solution: formData.solution || null,
                    results: formData.results || null,
                    energy_savings_percent: formData.energy_savings_percent ? parseFloat(formData.energy_savings_percent) : null,
                    cost_savings_ngn: formData.cost_savings_ngn ? parseFloat(formData.cost_savings_ngn) : null,
                    roi_months: formData.roi_months ? parseInt(formData.roi_months) : null,
                    testimonial: formData.testimonial || null,
                    testimonial_author: formData.testimonial_author || null,
                    status: formData.status,
                    is_featured: formData.is_featured,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingCaseStudy.id);

            if (error) throw error;

            toast.success('Case study updated successfully');
            setShowEditDialog(false);
            setEditingCaseStudy(null);
            resetForm();
            fetchCaseStudies();
        } catch (error: any) {
            console.error('Error updating case study:', error);
            toast.error(error.message || 'Failed to update case study');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCaseStudy = async (caseStudy: CaseStudy) => {
        if (!confirm(`Are you sure you want to delete "${caseStudy.title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('case_studies')
                .delete()
                .eq('id', caseStudy.id);

            if (error) throw error;

            toast.success('Case study deleted successfully');
            fetchCaseStudies();
        } catch (error: any) {
            console.error('Error deleting case study:', error);
            toast.error(error.message || 'Failed to delete case study');
        }
    };

    const openEditDialog = (caseStudy: CaseStudy) => {
        setEditingCaseStudy(caseStudy);
        setFormData({
            title: caseStudy.title,
            client_name: caseStudy.client_name,
            project_type: caseStudy.project_type,
            location: caseStudy.location || '',
            system_size_kw: caseStudy.system_size_kw?.toString() || '',
            installation_date: caseStudy.installation_date || '',
            challenge: caseStudy.challenge || '',
            solution: caseStudy.solution || '',
            results: caseStudy.results || '',
            energy_savings_percent: caseStudy.energy_savings_percent?.toString() || '',
            cost_savings_ngn: caseStudy.cost_savings_ngn?.toString() || '',
            roi_months: caseStudy.roi_months?.toString() || '',
            testimonial: caseStudy.testimonial || '',
            testimonial_author: caseStudy.testimonial_author || '',
            status: caseStudy.status as any,
            is_featured: caseStudy.is_featured,
        });
        setShowEditDialog(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            client_name: '',
            project_type: 'residential_solar',
            location: '',
            system_size_kw: '',
            installation_date: '',
            challenge: '',
            solution: '',
            results: '',
            energy_savings_percent: '',
            cost_savings_ngn: '',
            roi_months: '',
            testimonial: '',
            testimonial_author: '',
            status: 'draft',
            is_featured: false,
        });
    };

    const filteredCaseStudies = caseStudies.filter(cs => {
        const matchesSearch =
            cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cs.client_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || cs.status === statusFilter;
        const matchesType = typeFilter === 'all' || cs.project_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            published: { className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
            draft: { className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: FileText },
            archived: { className: 'bg-muted/10 text-muted-foreground border-muted/20', icon: FileText },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {status}
            </Badge>
        );
    };

    // Statistics
    const totalCaseStudies = caseStudies.length;
    const publishedCaseStudies = caseStudies.filter(cs => cs.status === 'published').length;
    const featuredCaseStudies = caseStudies.filter(cs => cs.is_featured).length;
    const avgEnergySavings = caseStudies
        .filter(cs => cs.energy_savings_percent)
        .reduce((sum, cs) => sum + (cs.energy_savings_percent || 0), 0) /
        caseStudies.filter(cs => cs.energy_savings_percent).length || 0;

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalCaseStudies}</p>
                                <p className="text-sm text-muted-foreground">Total Case Studies</p>
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
                                <p className="text-2xl font-bold">{publishedCaseStudies}</p>
                                <p className="text-sm text-muted-foreground">Published</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Award className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{featuredCaseStudies}</p>
                                <p className="text-sm text-muted-foreground">Featured</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{avgEnergySavings.toFixed(0)}%</p>
                                <p className="text-sm text-muted-foreground">Avg Energy Savings</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Case Studies Management Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Case Studies
                            </CardTitle>
                            <CardDescription>
                                Showcase successful solar installations and projects
                            </CardDescription>
                        </div>
                        <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Case Study
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search case studies..."
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
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Project Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="residential_solar">Residential Solar</SelectItem>
                                <SelectItem value="commercial_solar">Commercial Solar</SelectItem>
                                <SelectItem value="industrial_solar">Industrial Solar</SelectItem>
                                <SelectItem value="battery_storage">Battery Storage</SelectItem>
                                <SelectItem value="grid_integration">Grid Integration</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Case Studies Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project Details</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>System Size</TableHead>
                                        <TableHead>Savings</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCaseStudies.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No case studies found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCaseStudies.map((cs) => (
                                            <TableRow key={cs.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{cs.title}</div>
                                                        {cs.location && (
                                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                <MapPin className="h-3 w-3" />
                                                                {cs.location}
                                                            </div>
                                                        )}
                                                        {cs.is_featured && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <Award className="h-3 w-3 mr-1" />
                                                                Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />
                                                        {cs.client_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{cs.project_type.replace('_', ' ')}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {cs.system_size_kw ? (
                                                        <div className="flex items-center gap-1">
                                                            <Zap className="h-3 w-3 text-yellow-500" />
                                                            {cs.system_size_kw} kW
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {cs.energy_savings_percent ? (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <TrendingUp className="h-3 w-3 text-success" />
                                                                {cs.energy_savings_percent}%
                                                            </div>
                                                            {cs.roi_months && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    ROI: {cs.roi_months} months
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(cs.status)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEditDialog(cs)}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteCaseStudy(cs)}
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

            {/* Add Case Study Dialog */}
            <FormDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                title="Create New Case Study"
                description="Document a successful solar installation project"
                onSubmit={handleCreateCaseStudy}
                submitLabel="Create Case Study"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="50kW Solar Installation for Tech Corp"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client_name">Client Name *</Label>
                            <Input
                                id="client_name"
                                value={formData.client_name}
                                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                placeholder="Tech Corp Ltd"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="project_type">Project Type</Label>
                            <Select
                                value={formData.project_type}
                                onValueChange={(value) => setFormData({ ...formData, project_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="residential_solar">Residential Solar</SelectItem>
                                    <SelectItem value="commercial_solar">Commercial Solar</SelectItem>
                                    <SelectItem value="industrial_solar">Industrial Solar</SelectItem>
                                    <SelectItem value="battery_storage">Battery Storage</SelectItem>
                                    <SelectItem value="grid_integration">Grid Integration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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
                            <Label htmlFor="system_size_kw">System Size (kW)</Label>
                            <Input
                                id="system_size_kw"
                                type="number"
                                step="0.1"
                                value={formData.system_size_kw}
                                onChange={(e) => setFormData({ ...formData, system_size_kw: e.target.value })}
                                placeholder="50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="challenge">Challenge</Label>
                        <Textarea
                            id="challenge"
                            value={formData.challenge}
                            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                            placeholder="Describe the client's challenge..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="solution">Solution</Label>
                        <Textarea
                            id="solution"
                            value={formData.solution}
                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                            placeholder="Describe the solution provided..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="results">Results</Label>
                        <Textarea
                            id="results"
                            value={formData.results}
                            onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                            placeholder="Describe the results achieved..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="energy_savings_percent">Energy Savings (%)</Label>
                            <Input
                                id="energy_savings_percent"
                                type="number"
                                step="0.1"
                                value={formData.energy_savings_percent}
                                onChange={(e) => setFormData({ ...formData, energy_savings_percent: e.target.value })}
                                placeholder="45"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cost_savings_ngn">Cost Savings (NGN)</Label>
                            <Input
                                id="cost_savings_ngn"
                                type="number"
                                value={formData.cost_savings_ngn}
                                onChange={(e) => setFormData({ ...formData, cost_savings_ngn: e.target.value })}
                                placeholder="500000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="roi_months">ROI (Months)</Label>
                            <Input
                                id="roi_months"
                                type="number"
                                value={formData.roi_months}
                                onChange={(e) => setFormData({ ...formData, roi_months: e.target.value })}
                                placeholder="24"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="testimonial">Client Testimonial</Label>
                        <Textarea
                            id="testimonial"
                            value={formData.testimonial}
                            onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                            placeholder="Client feedback..."
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="testimonial_author">Testimonial Author</Label>
                            <Input
                                id="testimonial_author"
                                value={formData.testimonial_author}
                                onChange={(e) => setFormData({ ...formData, testimonial_author: e.target.value })}
                                placeholder="John Doe, CEO"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="installation_date">Installation Date</Label>
                            <Input
                                id="installation_date"
                                type="date"
                                value={formData.installation_date}
                                onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 pt-8">
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="is_featured" className="cursor-pointer">
                                Mark as featured
                            </Label>
                        </div>
                    </div>
                </div>
            </FormDialog>

            {/* Edit Case Study Dialog - Similar structure */}
            <FormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                title="Edit Case Study"
                description="Update case study details"
                onSubmit={handleUpdateCaseStudy}
                submitLabel="Save Changes"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                {/* Same form fields as Add dialog */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_title">Project Title *</Label>
                            <Input
                                id="edit_title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_client_name">Client Name *</Label>
                            <Input
                                id="edit_client_name"
                                value={formData.client_name}
                                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_project_type">Project Type</Label>
                            <Select
                                value={formData.project_type}
                                onValueChange={(value) => setFormData({ ...formData, project_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="residential_solar">Residential Solar</SelectItem>
                                    <SelectItem value="commercial_solar">Commercial Solar</SelectItem>
                                    <SelectItem value="industrial_solar">Industrial Solar</SelectItem>
                                    <SelectItem value="battery_storage">Battery Storage</SelectItem>
                                    <SelectItem value="grid_integration">Grid Integration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_location">Location</Label>
                            <Input
                                id="edit_location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_system_size_kw">System Size (kW)</Label>
                            <Input
                                id="edit_system_size_kw"
                                type="number"
                                step="0.1"
                                value={formData.system_size_kw}
                                onChange={(e) => setFormData({ ...formData, system_size_kw: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_challenge">Challenge</Label>
                        <Textarea
                            id="edit_challenge"
                            value={formData.challenge}
                            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_solution">Solution</Label>
                        <Textarea
                            id="edit_solution"
                            value={formData.solution}
                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_results">Results</Label>
                        <Textarea
                            id="edit_results"
                            value={formData.results}
                            onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_energy_savings_percent">Energy Savings (%)</Label>
                            <Input
                                id="edit_energy_savings_percent"
                                type="number"
                                step="0.1"
                                value={formData.energy_savings_percent}
                                onChange={(e) => setFormData({ ...formData, energy_savings_percent: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_cost_savings_ngn">Cost Savings (NGN)</Label>
                            <Input
                                id="edit_cost_savings_ngn"
                                type="number"
                                value={formData.cost_savings_ngn}
                                onChange={(e) => setFormData({ ...formData, cost_savings_ngn: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_roi_months">ROI (Months)</Label>
                            <Input
                                id="edit_roi_months"
                                type="number"
                                value={formData.roi_months}
                                onChange={(e) => setFormData({ ...formData, roi_months: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_testimonial">Client Testimonial</Label>
                        <Textarea
                            id="edit_testimonial"
                            value={formData.testimonial}
                            onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_testimonial_author">Testimonial Author</Label>
                            <Input
                                id="edit_testimonial_author"
                                value={formData.testimonial_author}
                                onChange={(e) => setFormData({ ...formData, testimonial_author: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_installation_date">Installation Date</Label>
                            <Input
                                id="edit_installation_date"
                                type="date"
                                value={formData.installation_date}
                                onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 pt-8">
                            <input
                                type="checkbox"
                                id="edit_is_featured"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="edit_is_featured" className="cursor-pointer">
                                Mark as featured
                            </Label>
                        </div>
                    </div>
                </div>
            </FormDialog>
        </div>
    );
};

export default CaseStudiesManager;
