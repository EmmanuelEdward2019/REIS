import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Wind, Waves, Anchor, Globe, Zap, Ship } from 'lucide-react';
import heroImage from '@/assets/reis/offshore-wind.png';

const OffshoreWind = () => {
    const features: Feature[] = [
        {
            title: 'Giant Turbines',
            description: 'Utilizing the largest and most powerful wind turbines available to capture stronger, more consistent ocean winds.',
            icon: Wind
        },
        {
            title: 'Floating Foundations',
            description: 'Deep-water technology allows deployment in areas previously inaccessible to fixed-bottom structures.',
            icon: Anchor
        },
        {
            title: 'Subsea Transmission',
            description: 'High-voltage DC cables transmit power efficiently over long distances to shore.',
            icon: Zap
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'High Capacity Factor',
            description: 'Offshore winds are stronger and more consistent, leading to higher energy production.'
        },
        {
            title: 'Visual Impact',
            description: 'Located far from shore, these farms have minimal visual impact on coastal communities.'
        },
        {
            title: 'Scalability',
            description: 'Vast ocean areas provide nearly unlimited space for large-scale project development.'
        },
        {
            title: 'Economic Growth',
            description: 'Revitalize port cities and create thousands of jobs in manufacturing, installation, and maintenance.'
        }
    ];

    return (
        <SolutionPage
            title="Offshore Wind"
            subtitle="Harnessing the immense power of ocean winds."
            description="Offshore wind represents the biggest frontier in renewable energy. We develop massive wind farms far out at sea, where winds are stronger and more reliable, delivering gigawatts of clean power to coastal population centers."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Marine"
        />
    );
};

export default OffshoreWind;
