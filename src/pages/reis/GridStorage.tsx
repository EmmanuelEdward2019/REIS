import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Server, Zap, Globe, ShieldCheck, Activity, Database } from 'lucide-react';
import heroImage from '@/assets/product-grid-storage.jpg';

const GridStorage = () => {
    const features: Feature[] = [
        {
            title: 'Utility-Grade Capacity',
            description: 'Multi-megawatt hour systems designed for substation and generation asset support.',
            icon: Server
        },
        {
            title: 'Frequency Regulation',
            description: 'Fast-response capabilities to maintain grid frequency stability within milliseconds.',
            icon: Activity
        },
        {
            title: 'Thermal Management',
            description: 'Liquid cooling systems ensure optimal operating temperatures and safety under heavy loads.',
            icon: ShieldCheck
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Infrastructure Deferral',
            description: 'Delay or eliminate the need for costly transmission and distribution upgrades.'
        },
        {
            title: 'Renewable Integration',
            description: 'Smooth out intermittent generation from wind and solar farms for reliable grid injection.'
        },
        {
            title: 'Black Start Capability',
            description: 'Provide the necessary energy to restart power plants and restore the grid after a blackout.'
        },
        {
            title: 'Voltage Support',
            description: 'Maintain local voltage levels to ensure power quality for all grid-connected customers.'
        }
    ];

    return (
        <SolutionPage
            title="Grid Storage"
            subtitle="Stabilizing the grid with massive energy reserves."
            description="Our grid-scale storage solutions are the key to a resilient and renewable-heavy power grid. We provide the massive capacity and rapid response times required by utilities and grid operators to maintain stability and reliability."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Storage"
        />
    );
};

export default GridStorage;
