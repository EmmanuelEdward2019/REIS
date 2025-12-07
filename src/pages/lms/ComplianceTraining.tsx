import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Shield, FileCheck, AlertCircle, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import heroImage from '@/assets/mega-menu-training.jpg';

const ComplianceTraining = () => {
    const features: Feature[] = [
        {
            title: 'Regulatory Tracking',
            description: 'Automated monitoring of changing regulations and compliance requirements.',
            icon: AlertCircle
        },
        {
            title: 'Audit Trails',
            description: 'Comprehensive documentation and reporting for compliance audits.',
            icon: FileCheck
        },
        {
            title: 'Automated Reminders',
            description: 'Timely notifications for training renewals and certification expirations.',
            icon: Clock
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Risk Mitigation',
            description: 'Reduce legal and financial risks by ensuring all staff meet compliance standards.'
        },
        {
            title: 'Audit Readiness',
            description: 'Maintain complete records and documentation for regulatory inspections.'
        },
        {
            title: 'Efficiency',
            description: 'Automate compliance workflows to save time and reduce administrative burden.'
        },
        {
            title: 'Peace of Mind',
            description: 'Confidence that your organization meets all industry and legal requirements.'
        }
    ];

    return (
        <SolutionPage
            title="Compliance Training"
            subtitle="Stay compliant, stay protected."
            description="Our compliance training solutions ensure your organization meets regulatory requirements while minimizing risk. From healthcare to finance, we've got you covered."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Training"
        />
    );
};

export default ComplianceTraining;
