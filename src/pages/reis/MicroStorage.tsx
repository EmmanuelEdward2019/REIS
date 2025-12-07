import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Battery, Smartphone, Home, Wifi, Zap, Shield } from 'lucide-react';
import heroImage from '@/assets/reis/micro-storage.png';

const MicroStorage = () => {
    const features: Feature[] = [
        {
            title: 'Compact Form Factor',
            description: 'Sleek, wall-mounted units designed to blend into modern residential and small business environments.',
            icon: Home
        },
        {
            title: 'Plug-and-Play',
            description: 'Simplified installation process reduces setup time and complexity for installers and homeowners.',
            icon: Zap
        },
        {
            title: 'Smart App Control',
            description: 'Monitor usage, set backup priorities, and optimize savings from your smartphone anywhere.',
            icon: Smartphone
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Critical Load Backup',
            description: 'Keep essential appliances like fridges, lights, and internet running during power outages.'
        },
        {
            title: 'Time-of-Use Optimization',
            description: 'Automatically shift usage to avoid expensive peak electricity rates.'
        },
        {
            title: 'Grid Independence',
            description: 'Reduce reliance on the utility grid and take control of your energy security.'
        },
        {
            title: 'Silent Operation',
            description: 'No noise or fumes compared to traditional gas generators, making it safe for indoor use.'
        }
    ];

    return (
        <SolutionPage
            title="Micro Storage"
            subtitle="Smart, compact energy storage for every home."
            description="Our micro storage solutions bring the power of battery technology to individual homes and small businesses. Compact, affordable, and easy to use, they provide the perfect entry point for energy independence and security."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Storage"
        />
    );
};

export default MicroStorage;
