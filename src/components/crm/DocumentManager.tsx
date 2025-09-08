import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  File, 
  Image, 
  FileSpreadsheet,
  Search,
  Filter,
  Calendar
} from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  type: 'bill' | 'audit' | 'design' | 'permit' | 'contract' | 'commissioning' | 'other';
  category: 'upload' | 'generated' | 'system';
  size: number;
  uploadDate: Date;
  uploadedBy?: string;
  jobCode: string;
  ticketCode?: string;
  version?: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  url?: string;
}

interface DocumentManagerProps {
  documents: DocumentItem[];
  jobCode: string;
  onUpload: (files: FileList) => void;
  onDownload: (documentId: string) => void;
  onDelete: (documentId: string) => void;
  onView: (documentId: string) => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ 
  documents, 
  jobCode, 
  onUpload, 
  onDownload, 
  onDelete, 
  onView 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getDocumentIcon = (name: string, type: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    }
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'bill': 'Utility Bill',
      'audit': 'Energy Audit',
      'design': 'System Design',
      'permit': 'Permits & Approvals',
      'contract': 'Contract Documents',
      'commissioning': 'Commissioning Pack',
      'other': 'Other Documents'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-accent text-accent-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'expired': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getTypeLabel(doc.type).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const documentsByCategory = {
    upload: filteredDocuments.filter(d => d.category === 'upload'),
    generated: filteredDocuments.filter(d => d.category === 'generated'),
    system: filteredDocuments.filter(d => d.category === 'system')
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Management</h2>
          <p className="text-muted-foreground">Job: {jobCode}</p>
        </div>
        <Badge variant="outline">
          {documents.length} Documents
        </Badge>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Documents</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by filename or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type-filter">Document Type</Label>
              <select
                id="type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
              >
                <option value="all">All Types</option>
                <option value="bill">Utility Bills</option>
                <option value="audit">Energy Audits</option>
                <option value="design">System Designs</option>
                <option value="permit">Permits & Approvals</option>
                <option value="contract">Contracts</option>
                <option value="commissioning">Commissioning</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium">Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
            </div>
            <Input
              type="file"
              multiple
              onChange={(e) => e.target.files && onUpload(e.target.files)}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, XLS, JPG, PNG (Max 10MB each)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents Tabs */}
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">
            Uploaded ({documentsByCategory.upload.length})
          </TabsTrigger>
          <TabsTrigger value="generated">
            Generated ({documentsByCategory.generated.length})
          </TabsTrigger>
          <TabsTrigger value="system">
            System ({documentsByCategory.system.length})
          </TabsTrigger>
        </TabsList>

        {Object.entries(documentsByCategory).map(([category, categoryDocs]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {categoryDocs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No {category} documents found
                  </p>
                </CardContent>
              </Card>
            ) : (
              categoryDocs.map(doc => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getDocumentIcon(doc.name, doc.type)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{doc.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(doc.type)}
                            </Badge>
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(doc.size)}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {doc.uploadDate.toLocaleDateString()}
                            </span>
                            {doc.uploadedBy && (
                              <span>by {doc.uploadedBy}</span>
                            )}
                            {doc.version && (
                              <span>v{doc.version}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(doc.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownload(doc.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {category === 'upload' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(doc.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DocumentManager;