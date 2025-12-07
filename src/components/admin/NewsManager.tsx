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
import FileUploader from '@/components/common/FileUploader';
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    Eye,
    FileText,
    Calendar,
    User,
    Tag,
    Image as ImageIcon,
    Loader2,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface NewsArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category: string;
    tags: string[] | null;
    featured_image: string | null;
    author_id: string | null;
    author_name: string | null;
    status: string;
    published_at: string | null;
    views_count: number;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface NewsFormData {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string;
    featured_image: string;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
}

const NewsManager = () => {
    const { user } = useAuth();
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        excerpt: '',
        content: '',
        category: 'company_news',
        tags: '',
        featured_image: '',
        status: 'draft',
        is_featured: false,
    });

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('news_articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            toast.error('Failed to load articles');
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

    const handleCreateArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.title || !formData.content) {
                toast.error('Please fill in title and content');
                return;
            }

            const slug = generateSlug(formData.title);
            const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()) : null;

            const { error } = await supabase
                .from('news_articles')
                .insert([{
                    title: formData.title,
                    slug,
                    excerpt: formData.excerpt || null,
                    content: formData.content,
                    category: formData.category,
                    tags: tagsArray,
                    featured_image: formData.featured_image || null,
                    author_id: user?.id || null,
                    author_name: user?.email || null,
                    status: formData.status,
                    is_featured: formData.is_featured,
                    published_at: formData.status === 'published' ? new Date().toISOString() : null,
                }]);

            if (error) throw error;

            toast.success('Article created successfully');
            setShowAddDialog(false);
            resetForm();
            fetchArticles();
        } catch (error: any) {
            console.error('Error creating article:', error);
            toast.error(error.message || 'Failed to create article');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingArticle) return;

        setIsSubmitting(true);

        try {
            const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()) : null;
            const wasPublished = editingArticle.status === 'published';
            const isNowPublished = formData.status === 'published';

            const { error } = await supabase
                .from('news_articles')
                .update({
                    title: formData.title,
                    excerpt: formData.excerpt || null,
                    content: formData.content,
                    category: formData.category,
                    tags: tagsArray,
                    featured_image: formData.featured_image || null,
                    status: formData.status,
                    is_featured: formData.is_featured,
                    published_at: !wasPublished && isNowPublished ? new Date().toISOString() : editingArticle.published_at,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingArticle.id);

            if (error) throw error;

            toast.success('Article updated successfully');
            setShowEditDialog(false);
            setEditingArticle(null);
            resetForm();
            fetchArticles();
        } catch (error: any) {
            console.error('Error updating article:', error);
            toast.error(error.message || 'Failed to update article');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteArticle = async (article: NewsArticle) => {
        if (!confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('news_articles')
                .delete()
                .eq('id', article.id);

            if (error) throw error;

            toast.success('Article deleted successfully');
            fetchArticles();
        } catch (error: any) {
            console.error('Error deleting article:', error);
            toast.error(error.message || 'Failed to delete article');
        }
    };

    const openEditDialog = (article: NewsArticle) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            excerpt: article.excerpt || '',
            content: article.content,
            category: article.category,
            tags: article.tags ? article.tags.join(', ') : '',
            featured_image: article.featured_image || '',
            status: article.status as any,
            is_featured: article.is_featured,
        });
        setShowEditDialog(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            category: 'company_news',
            tags: '',
            featured_image: '',
            status: 'draft',
            is_featured: false,
        });
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            published: { variant: 'default' as const, className: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
            draft: { variant: 'outline' as const, className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: FileText },
            archived: { variant: 'outline' as const, className: 'bg-muted/10 text-muted-foreground border-muted/20', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {status}
            </Badge>
        );
    };

    // Statistics
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.status === 'published').length;
    const draftArticles = articles.filter(a => a.status === 'draft').length;
    const featuredArticles = articles.filter(a => a.is_featured).length;

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
                                <p className="text-2xl font-bold">{totalArticles}</p>
                                <p className="text-sm text-muted-foreground">Total Articles</p>
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
                                <p className="text-2xl font-bold">{publishedArticles}</p>
                                <p className="text-sm text-muted-foreground">Published</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <FileText className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{draftArticles}</p>
                                <p className="text-sm text-muted-foreground">Drafts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Tag className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{featuredArticles}</p>
                                <p className="text-sm text-muted-foreground">Featured</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* News Management Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                News & Articles
                            </CardTitle>
                            <CardDescription>
                                Manage news articles, blog posts, and announcements
                            </CardDescription>
                        </div>
                        <Button onClick={() => { resetForm(); setShowAddDialog(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Article
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
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
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="company_news">Company News</SelectItem>
                                <SelectItem value="industry_news">Industry News</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="policy">Policy</SelectItem>
                                <SelectItem value="case_study">Case Study</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Articles Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Article</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Published</TableHead>
                                        <TableHead>Views</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredArticles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No articles found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredArticles.map((article) => (
                                            <TableRow key={article.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{article.title}</div>
                                                        {article.excerpt && (
                                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                                {article.excerpt}
                                                            </div>
                                                        )}
                                                        {article.is_featured && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <Tag className="h-3 w-3 mr-1" />
                                                                Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{article.category}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <User className="h-3 w-3" />
                                                        {article.author_name || 'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(article.status)}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-muted-foreground">
                                                        {article.published_at
                                                            ? new Date(article.published_at).toLocaleDateString()
                                                            : 'Not published'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Eye className="h-3 w-3" />
                                                        {article.views_count}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEditDialog(article)}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteArticle(article)}
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

            {/* Add Article Dialog */}
            <FormDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                title="Create New Article"
                description="Write and publish a new news article or blog post"
                onSubmit={handleCreateArticle}
                submitLabel="Create Article"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Article title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Brief summary (optional)"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Article content"
                            rows={8}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="company_news">Company News</SelectItem>
                                    <SelectItem value="industry_news">Industry News</SelectItem>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="policy">Policy</SelectItem>
                                    <SelectItem value="case_study">Case Study</SelectItem>
                                </SelectContent>
                            </Select>
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
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="solar, renewable energy, sustainability"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="featured_image">Featured Image URL</Label>
                        <Input
                            id="featured_image"
                            value={formData.featured_image}
                            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="is_featured" className="cursor-pointer">
                            Mark as featured article
                        </Label>
                    </div>
                </div>
            </FormDialog>

            {/* Edit Article Dialog */}
            <FormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                title="Edit Article"
                description="Update article content and settings"
                onSubmit={handleUpdateArticle}
                submitLabel="Save Changes"
                isLoading={isSubmitting}
                maxWidth="2xl"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit_title">Title *</Label>
                        <Input
                            id="edit_title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_excerpt">Excerpt</Label>
                        <Textarea
                            id="edit_excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_content">Content *</Label>
                        <Textarea
                            id="edit_content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={8}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="company_news">Company News</SelectItem>
                                    <SelectItem value="industry_news">Industry News</SelectItem>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="policy">Policy</SelectItem>
                                    <SelectItem value="case_study">Case Study</SelectItem>
                                </SelectContent>
                            </Select>
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
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_tags">Tags (comma-separated)</Label>
                        <Input
                            id="edit_tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_featured_image">Featured Image URL</Label>
                        <Input
                            id="edit_featured_image"
                            value={formData.featured_image}
                            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="edit_is_featured"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="edit_is_featured" className="cursor-pointer">
                            Mark as featured article
                        </Label>
                    </div>
                </div>
            </FormDialog>
        </div>
    );
};

export default NewsManager;
