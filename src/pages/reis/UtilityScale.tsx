import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Factory, Globe, Zap, Server, Activity, Lock } from 'lucide-react';
import heroImage from '@/assets/reis/utility-scale.png';

const UtilityScale = () => {
    const features: Feature[] = [
        {
            title: 'Grid Integration',
            description: 'Advanced interconnection systems ensuring stable and compliant power delivery to the national grid.',
            icon: Globe
        },
        {
            title: 'High-Capacity Generation',
            description: 'Massive scale deployment capabilities ranging from megawatts to gigawatts of clean power.',
            icon: Factory
        },
        {
            title: 'Centralized Control',
            description: 'SCADA-integrated monitoring centers for real-time performance optimization and predictive maintenance.',
            icon: Activity
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Levelized Cost of Energy',
            description: 'Achieve one of the lowest costs of electricity generation compared to traditional fossil fuel sources.'
        },
        {
            title: 'Scalable Infrastructure',
            description: 'Designed for rapid expansion and modular upgrades to meet growing energy demands.'
        },
        {
            title: 'Grid Stability',
            description: 'Advanced power electronics provide voltage support and frequency regulation services.'
        },
        {
            title: 'Sustainable Development',
            description: 'Power thousands of homes and businesses with zero emissions, supporting national climate goals.'
        }
    ];

    return (
        <SolutionPage
            title="Utility Scale Solar"
            subtitle="Powering the grid with massive, efficient solar infrastructure."
            description="We develop and deploy large-scale solar power plants that serve as the backbone of modern renewable energy grids. Our utility-scale projects combine cutting-edge photovoltaic technology with robust engineering to deliver reliable, clean energy at competitive rates."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Solar"
        />
    );
};

export default UtilityScale;
