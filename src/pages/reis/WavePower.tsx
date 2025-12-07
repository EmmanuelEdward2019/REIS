import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Waves, Activity, Zap, Anchor, Shield, BarChart3 } from 'lucide-react';
import heroImage from '@/assets/reis/tidal-energy.png'; // Using as placeholder for now

const WavePower = () => {
    const features: Feature[] = [
        {
            title: 'Point Absorbers',
            description: 'Buoys that float on the surface and generate electricity from the vertical motion of waves.',
            icon: Activity
        },
        {
            title: 'Oscillating Water Columns',
            description: 'Shore-based or floating structures that use wave action to compress air and drive turbines.',
            icon: Waves
        },
        {
            title: 'Storm Protection',
            description: 'Robust designs engineered to survive extreme sea states and automatically enter safety modes.',
            icon: Shield
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Consistent Resource',
            description: 'Ocean swells travel long distances and provide power even when the wind has stopped blowing.'
        },
        {
            title: 'Proximity to Demand',
            description: 'A large portion of the global population lives near coasts, reducing transmission losses.'
        },
        {
            title: 'Coastal Protection',
            description: 'Wave farms can act as artificial reefs and breakwaters, reducing coastal erosion.'
        },
        {
            title: 'Huge Potential',
            description: 'The theoretical energy potential of ocean waves is vast enough to power the world multiple times over.'
        }
    ];

    return (
        <SolutionPage
            title="Wave Power"
            subtitle="Capturing the boundless energy of the ocean."
            description="Wave energy converts the periodic up-and-down movement of ocean waves into electricity. It is a dense and powerful resource. Our technologies are designed to efficiently harvest this energy while withstanding the challenging marine environment."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Marine"
        />
    );
};

export default WavePower;
