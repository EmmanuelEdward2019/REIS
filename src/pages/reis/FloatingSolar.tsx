import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Waves, Sun, Droplets, Anchor, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/reis/floating-solar.png';

const FloatingSolar = () => {
    const features: Feature[] = [
        {
            title: 'Water Cooling Effect',
            description: 'Natural cooling from the water body increases panel efficiency and energy output compared to ground-mounted systems.',
            icon: Droplets
        },
        {
            title: 'Land Conservation',
            description: 'Utilize reservoirs, lakes, and ponds, preserving valuable land for agriculture or other developments.',
            icon: Anchor
        },
        {
            title: 'Evaporation Control',
            description: 'Panels cover the water surface, significantly reducing evaporation and preserving water resources.',
            icon: Shield
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Higher Energy Yield',
            description: 'Cooler operating temperatures result in up to 15% more energy generation.'
        },
        {
            title: 'Algae Growth Reduction',
            description: 'Shading the water inhibits algae bloom, improving water quality for treatment plants.'
        },
        {
            title: 'Rapid Deployment',
            description: 'Modular floating structures allow for faster installation with minimal civil works.'
        },
        {
            title: 'Dual Utility',
            description: 'Perfect for hydroelectric dams, using existing grid infrastructure and balancing seasonal flows.'
        }
    ];

    return (
        <SolutionPage
            title="Floating Solar"
            subtitle="Innovative solar generation on water bodies."
            description="Floating solar (FPV) opens up new frontiers for renewable energy by utilizing water surfaces. Our systems are designed to withstand aquatic environments while delivering superior performance through the natural cooling effect of water."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Marine"
        />
    );
};

export default FloatingSolar;
