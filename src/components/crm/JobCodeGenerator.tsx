import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Segment = 'RES' | 'COM' | 'IND';
export type Service = 'AUD' | 'DES' | 'EPC' | 'GRID' | 'H2' | 'DIG' | 'O&M' | 'CNSL' | 'OFF' | 'TRN' | 'MICRO';

interface JobCodeData {
  jobCode: string;
  segment: Segment;
  service: Service;
  year: number;
  number: number;
  created: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  seriousnessScore: number;
}

interface JobCodeGeneratorProps {
  jobData: JobCodeData;
  onCopyCode: (code: string) => void;
}

const JobCodeGenerator: React.FC<JobCodeGeneratorProps> = ({ jobData, onCopyCode }) => {
  const getServiceLabel = (service: Service): string => {
    const labels: Record<Service, string> = {
      'AUD': 'Feasibility & Audits',
      'DES': 'System Design & Engineering',
      'EPC': 'Engineering, Procurement, Construction',
      'GRID': 'Grid Connection',
      'H2': 'Hydrogen Solutions',
      'DIG': 'Digital & SCADA/AI',
      'O&M': 'Operations & Maintenance',
      'CNSL': 'Consulting & Advisory',
      'OFF': 'Offshore Solutions',
      'TRN': 'Training & LMS',
      'MICRO': 'Micro Solutions'
    };
    return labels[service];
  };

  const getSegmentLabel = (segment: Segment): string => {
    const labels: Record<Segment, string> = {
      'RES': 'Residential',
      'COM': 'Commercial',
      'IND': 'Industrial'
    };
    return labels[segment];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-primary text-primary-foreground';
      case 'COMPLETED': return 'bg-success text-success-foreground';
      case 'ON_HOLD': return 'bg-accent text-accent-foreground';
      case 'CANCELLED': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeriousnessColor = (score: number) => {
    if (score >= 10) return 'text-success';
    if (score >= 6) return 'text-accent';
    return 'text-destructive';
  };

  const getSeriousnessLabel = (score: number) => {
    if (score >= 10) return 'High Quality Lead';
    if (score >= 6) return 'Nurture Required';
    return 'Low Priority';
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Job Information</CardTitle>
          <Badge className={getStatusColor(jobData.status)}>
            {jobData.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Job Code Display */}
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <div className="flex-1">
            <div className="font-mono text-lg font-bold">{jobData.jobCode}</div>
            <div className="text-sm text-muted-foreground">Job Code</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopyCode(jobData.jobCode)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Segment</div>
            <div className="font-medium">{getSegmentLabel(jobData.segment)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Service</div>
            <div className="font-medium">{getServiceLabel(jobData.service)}</div>
          </div>
        </div>

        {/* Seriousness Score */}
        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Lead Score</div>
            <div className={`text-lg font-bold ${getSeriousnessColor(jobData.seriousnessScore)}`}>
              {jobData.seriousnessScore}/20
            </div>
          </div>
          <Badge variant="outline" className={getSeriousnessColor(jobData.seriousnessScore)}>
            {getSeriousnessLabel(jobData.seriousnessScore)}
          </Badge>
        </div>

        {/* Created Date */}
        <div className="text-sm text-muted-foreground">
          Created: {jobData.created.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCodeGenerator;