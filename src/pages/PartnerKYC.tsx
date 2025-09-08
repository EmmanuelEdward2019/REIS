import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText,
  Upload,
  Download,
  Eye,
  X,
  Check,
  Building,
  User,
  Globe,
  Award,
  CreditCard
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface KYCDocument {
  id: string;
  name: string;
  category: string;
  status: 'Required' | 'Uploaded' | 'Under Review' | 'Approved' | 'Rejected';
  uploadDate?: string;
  reviewDate?: string;
  rejectionReason?: string;
  required: boolean;
}

interface KYCStatus {
  partnerId: string;
  status: 'Draft' | 'Submitted' | 'KYC Pending' | 'KYC Approved' | 'Compliance Verified' | 'Active' | 'Suspended';
  seriousnessScore: number;
  completionPercentage: number;
  lastUpdate: string;
  reviewer: string;
  estimatedCompletion: string;
}

const PartnerKYC = () => {
  const [kycStatus] = useState<KYCStatus>({
    partnerId: 'PTNR-2024-1234',
    status: 'KYC Pending',
    seriousnessScore: 18,
    completionPercentage: 85,
    lastUpdate: '2024-01-15',
    reviewer: 'KYC Team',
    estimatedCompletion: '2024-01-20'
  });

  const [documents, setDocuments] = useState<KYCDocument[]>([
    {
      id: '1',
      name: 'Company Registration Certificate (CAC)',
      category: 'Identity',
      status: 'Approved',
      uploadDate: '2024-01-10',
      reviewDate: '2024-01-12',
      required: true
    },
    {
      id: '2', 
      name: 'Tax Identification Number (TIN)',
      category: 'Identity',
      status: 'Approved',
      uploadDate: '2024-01-10',
      reviewDate: '2024-01-12',
      required: true
    },
    {
      id: '3',
      name: 'Professional Liability Insurance',
      category: 'Insurance',
      status: 'Under Review',
      uploadDate: '2024-01-14',
      required: true
    },
    {
      id: '4',
      name: 'ISO 9001:2015 Certificate',
      category: 'Certifications',
      status: 'Approved',
      uploadDate: '2024-01-11',
      reviewDate: '2024-01-13',
      required: false
    },
    {
      id: '5',
      name: 'COREN Registration',
      category: 'Professional',
      status: 'Rejected',
      uploadDate: '2024-01-12',
      reviewDate: '2024-01-14',
      rejectionReason: 'Certificate appears to be expired. Please upload current certificate.',
      required: true
    },
    {
      id: '6',
      name: 'Bank Account Verification Letter',
      category: 'Financial',
      status: 'Required',
      required: true
    },
    {
      id: '7',
      name: 'BOSIET/FOET Certificate',
      category: 'Offshore',
      status: 'Required',
      required: false // Only for offshore partners
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-success text-success-foreground';
      case 'Under Review': return 'bg-accent text-accent-foreground';
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      case 'Required': return 'bg-muted text-muted-foreground';
      case 'Uploaded': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-4 w-4" />;
      case 'Under Review': return <Clock className="h-4 w-4" />;
      case 'Rejected': return <X className="h-4 w-4" />;
      case 'Required': return <AlertCircle className="h-4 w-4" />;
      case 'Uploaded': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Identity': return <Building className="h-4 w-4" />;
      case 'Professional': return <User className="h-4 w-4" />;
      case 'Certifications': return <Award className="h-4 w-4" />;
      case 'Insurance': return <Shield className="h-4 w-4" />;
      case 'Financial': return <CreditCard className="h-4 w-4" />;
      case 'Offshore': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const requiredDocuments = documents.filter(doc => doc.required);
  const optionalDocuments = documents.filter(doc => !doc.required);
  const approvedCount = documents.filter(doc => doc.status === 'Approved').length;
  const pendingCount = documents.filter(doc => doc.status === 'Under Review' || doc.status === 'Uploaded').length;
  const rejectedCount = documents.filter(doc => doc.status === 'Rejected').length;
  const requiredCount = documents.filter(doc => doc.status === 'Required').length;

  return (
    <Layout>
      <div className="min-h-screen bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">KYC Verification</h1>
                <p className="text-muted-foreground">Partner ID: {kycStatus.partnerId}</p>
              </div>
              <Badge className={
                kycStatus.status === 'Active' ? 'bg-success text-success-foreground' :
                kycStatus.status === 'KYC Approved' ? 'bg-primary text-primary-foreground' :
                kycStatus.status === 'KYC Pending' ? 'bg-accent text-accent-foreground' :
                'bg-secondary text-secondary-foreground'
              }>
                {kycStatus.status}
              </Badge>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completion</p>
                      <p className="text-2xl font-bold text-foreground">{kycStatus.completionPercentage}%</p>
                    </div>
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <Progress value={kycStatus.completionPercentage} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="text-2xl font-bold text-success">{approvedCount}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Under Review</p>
                      <p className="text-2xl font-bold text-accent">{pendingCount}</p>
                    </div>
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Action Required</p>
                      <p className="text-2xl font-bold text-destructive">{rejectedCount + requiredCount}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Documents List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Required Documents */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Required Documents
                  </CardTitle>
                  <CardDescription>
                    These documents are mandatory for KYC approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requiredDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(doc.category)}
                          <div className="flex-1">
                            <h4 className="font-medium">{doc.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{doc.category}</span>
                              {doc.uploadDate && <span>• Uploaded: {doc.uploadDate}</span>}
                              {doc.reviewDate && <span>• Reviewed: {doc.reviewDate}</span>}
                            </div>
                            {doc.rejectionReason && (
                              <p className="text-sm text-destructive mt-1">{doc.rejectionReason}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {getStatusIcon(doc.status)}
                            <span className="ml-1">{doc.status}</span>
                          </Badge>
                          <div className="flex gap-1">
                            {doc.status === 'Required' || doc.status === 'Rejected' ? (
                              <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                            ) : (
                              <>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optional Documents */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" />
                    Optional Documents
                  </CardTitle>
                  <CardDescription>
                    Additional certifications to improve your partner score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optionalDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(doc.category)}
                          <div className="flex-1">
                            <h4 className="font-medium">{doc.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{doc.category}</span>
                              {doc.uploadDate && <span>• Uploaded: {doc.uploadDate}</span>}
                              {doc.reviewDate && <span>• Reviewed: {doc.reviewDate}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {getStatusIcon(doc.status)}
                            <span className="ml-1">{doc.status}</span>
                          </Badge>
                          <div className="flex gap-1">
                            {doc.status === 'Required' ? (
                              <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                            ) : (
                              <>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Sidebar */}
            <div className="space-y-6">
              {/* KYC Status */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    KYC Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="font-medium">Under Review</h3>
                      <p className="text-sm text-muted-foreground">KYC verification in progress</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Seriousness Score</p>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{kycStatus.seriousnessScore}/20</span>
                          <Badge variant={
                            kycStatus.seriousnessScore >= 15 ? 'default' :
                            kycStatus.seriousnessScore >= 10 ? 'secondary' : 'outline'
                          }>
                            {kycStatus.seriousnessScore >= 15 ? 'Excellent' :
                             kycStatus.seriousnessScore >= 10 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="text-muted-foreground">Assigned Reviewer</p>
                        <p className="font-medium">{kycStatus.reviewer}</p>
                      </div>

                      <div className="text-sm">
                        <p className="text-muted-foreground">Expected Completion</p>
                        <p className="font-medium">{kycStatus.estimatedCompletion}</p>
                      </div>

                      <div className="text-sm">
                        <p className="text-muted-foreground">Last Update</p>
                        <p className="font-medium">{kycStatus.lastUpdate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" disabled={requiredCount > 0 || rejectedCount > 0}>
                      <Check className="h-4 w-4 mr-2" />
                      Submit for Review
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Upload
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Checklist
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Having trouble with document verification? Our KYC team is here to help.
                    </p>
                    <Button variant="outline" className="w-full">
                      Contact KYC Support
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Guidelines
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartnerKYC;