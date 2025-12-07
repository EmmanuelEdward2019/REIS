import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Shield, Lock, Eye, AlertTriangle, FileCheck, UserCheck } from 'lucide-react';
import heroImage from '@/assets/product-grid-storage.jpg';

const SecuritySolutions = () => {
    const features: Feature[] = [
        {
            title: 'Threat Detection & Response',
            description: 'AI-powered systems that identify and neutralize security threats in real-time.',
            icon: AlertTriangle
        },
        {
            title: 'Identity & Access Management',
            description: 'Secure authentication and authorization frameworks to protect sensitive resources.',
            icon: UserCheck
        },
        {
            title: 'Compliance Automation',
            description: 'Automated compliance monitoring and reporting for GDPR, HIPAA, SOC 2, and more.',
            icon: FileCheck
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Proactive Protection',
            description: 'Stay ahead of cyber threats with predictive analytics and automated responses.'
        },
        {
            title: 'Regulatory Compliance',
            description: 'Meet industry standards and avoid costly penalties with built-in compliance tools.'
        },
        {
            title: 'Data Privacy',
            description: 'Protect customer data with encryption, anonymization, and secure storage practices.'
        },
        {
            title: 'Business Continuity',
            description: 'Minimize downtime and data loss with robust disaster recovery and backup systems.'
        }
    ];

    return (
        <SolutionPage
            title="Security Solutions"
            subtitle="Protecting your digital assets with intelligence."
            description="In an era of sophisticated cyber threats, our security solutions combine AI, automation, and best practices to safeguard your applications, data, and infrastructure."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Security"
        />
    );
};

export default SecuritySolutions;
