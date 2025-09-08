import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Cog,
  Zap,
  Grid3X3,
  Atom,
  Monitor,
  Wrench,
  BookOpen,
  Ship,
  GraduationCap,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { Service } from './JobCodeGenerator';

interface ServiceItem {
  code: Service;
  title: string;
  description: string;
  icon: React.ElementType;
  segment: ('RES' | 'COM' | 'IND')[];
  features: string[];
  startingPrice?: string;
  duration?: string;
}

interface ServiceCatalogProps {
  selectedSegment: 'RES' | 'COM' | 'IND';
  onServiceSelect: (service: Service) => void;
}

const ServiceCatalog: React.FC<ServiceCatalogProps> = ({ selectedSegment, onServiceSelect }) => {
  const services: ServiceItem[] = [
    {
      code: 'AUD',
      title: 'Feasibility & Audits',
      description: 'Comprehensive energy audits and feasibility studies for renewable energy systems',
      icon: Search,
      segment: ['RES', 'COM', 'IND'],
      features: ['Energy consumption analysis', 'Site assessment', 'ROI calculations', 'Regulatory compliance review'],
      startingPrice: '$2,500',
      duration: '2-4 weeks'
    },
    {
      code: 'DES',
      title: 'System Design & Engineering',
      description: 'Custom renewable energy system design and engineering services',
      icon: Cog,
      segment: ['RES', 'COM', 'IND'],
      features: ['Technical drawings', 'Load calculations', 'Component selection', 'Performance modeling'],
      startingPrice: '$5,000',
      duration: '4-8 weeks'
    },
    {
      code: 'EPC',
      title: 'Engineering, Procurement, Construction',
      description: 'Complete turnkey renewable energy system installation',
      icon: Zap,
      segment: ['RES', 'COM', 'IND'],
      features: ['Full project management', 'Equipment procurement', 'Installation', 'Testing & commissioning'],
      startingPrice: '$50,000',
      duration: '3-12 months'
    },
    {
      code: 'GRID',
      title: 'Grid Connection',
      description: 'Grid interconnection services and utility coordination',
      icon: Grid3X3,
      segment: ['COM', 'IND'],
      features: ['Utility applications', 'Interconnection studies', 'Protection systems', 'Net metering setup'],
      startingPrice: '$10,000',
      duration: '6-16 weeks'
    },
    {
      code: 'H2',
      title: 'Hydrogen Solutions',
      description: 'Green hydrogen production and storage systems',
      icon: Atom,
      segment: ['IND'],
      features: ['Electrolyzer systems', 'Hydrogen storage', 'Fuel cell integration', 'Safety systems'],
      startingPrice: '$500,000',
      duration: '12-24 months'
    },
    {
      code: 'DIG',
      title: 'Digital & SCADA/AI',
      description: 'Digital monitoring, SCADA systems, and AI optimization',
      icon: Monitor,
      segment: ['COM', 'IND'],
      features: ['Real-time monitoring', 'Predictive analytics', 'Remote control', 'Performance optimization'],
      startingPrice: '$25,000',
      duration: '8-12 weeks'
    },
    {
      code: 'O&M',
      title: 'Operations & Maintenance',
      description: 'Ongoing operations and maintenance services',
      icon: Wrench,
      segment: ['RES', 'COM', 'IND'],
      features: ['Preventive maintenance', 'Performance monitoring', '24/7 support', 'Emergency repairs'],
      startingPrice: '$200/month',
      duration: 'Ongoing'
    },
    {
      code: 'CNSL',
      title: 'Consulting & Advisory',
      description: 'Strategic consulting and advisory services',
      icon: BookOpen,
      segment: ['COM', 'IND'],
      features: ['Energy strategy', 'Regulatory guidance', 'Financial modeling', 'Carbon credits'],
      startingPrice: '$500/hour',
      duration: 'Variable'
    },
    {
      code: 'OFF',
      title: 'Offshore Solutions',
      description: 'Offshore renewable energy systems and marine solutions',
      icon: Ship,
      segment: ['IND'],
      features: ['Offshore wind', 'Wave energy', 'Marine installations', 'Subsea systems'],
      startingPrice: '$2,000,000',
      duration: '18-36 months'
    },
    {
      code: 'TRN',
      title: 'Training & LMS',
      description: 'Professional training and learning management systems',
      icon: GraduationCap,
      segment: ['RES', 'COM', 'IND'],
      features: ['Online courses', 'Certification programs', 'Hands-on training', 'Custom curricula'],
      startingPrice: '$500/course',
      duration: '1-4 weeks'
    },
    {
      code: 'MICRO',
      title: 'Micro Solutions',
      description: 'Small-scale and micro renewable energy solutions',
      icon: Cpu,
      segment: ['RES'],
      features: ['Nano systems', 'Portable power', 'Off-grid solutions', 'Emergency backup'],
      startingPrice: '$1,000',
      duration: '1-2 weeks'
    }
  ];

  const getSegmentLabel = (segment: 'RES' | 'COM' | 'IND'): string => {
    const labels = {
      'RES': 'Residential',
      'COM': 'Commercial',
      'IND': 'Industrial'
    };
    return labels[segment];
  };

  const availableServices = services.filter(service => 
    service.segment.includes(selectedSegment)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">REIS Services Catalog</h2>
        <p className="text-muted-foreground">
          {getSegmentLabel(selectedSegment)} renewable energy solutions
        </p>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableServices.map((service) => {
          const Icon = service.icon;
          
          return (
            <Card key={service.code} className="relative group hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {service.code}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    {service.startingPrice && (
                      <div className="text-sm font-medium">{service.startingPrice}</div>
                    )}
                    {service.duration && (
                      <div className="text-xs text-muted-foreground">{service.duration}</div>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription className="text-sm">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{service.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                  onClick={() => onServiceSelect(service.code)}
                >
                  Select Service
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Service Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help Choosing?</CardTitle>
          <CardDescription>
            Our experts can help you select the right services for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
            <Button variant="outline" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Compare Services
            </Button>
            <Button variant="outline" className="flex-1">
              <Monitor className="h-4 w-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceCatalog;