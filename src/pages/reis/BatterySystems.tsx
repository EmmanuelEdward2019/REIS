import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Battery, Zap, Shield, Clock, Cpu, BarChart } from 'lucide-react';
import heroImage from '@/assets/hero-energy-storage.jpg';

const BatterySystems = () => {
    const features: Feature[] = [
        {
            title: 'Lithium-Ion Technology',
            description: 'State-of-the-art battery chemistry providing high energy density and long cycle life.',
            icon: Battery
        },
        {
            title: 'Intelligent BMS',
            description: 'Advanced Battery Management System ensures safety, optimal performance, and cell longevity.',
            icon: Cpu
        },
        {
            title: 'Modular Design',
            description: 'Flexible configuration options to scale capacity from residential to commercial needs.',
            icon: Zap
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Energy Arbitrage',
            description: 'Store low-cost energy during off-peak hours and discharge it during peak pricing periods.'
        },
        {
            title: 'Backup Power',
            description: 'Instant switchover capabilities keep your critical loads running during grid failures.'
        },
        {
            title: 'Solar Self-Consumption',
            description: 'Maximize the use of your solar generation by storing excess power for nighttime use.'
        },
        {
            title: 'Grid Services',
            description: 'Participate in demand response programs and earn revenue by supporting the grid.'
        }
    ];

    return (
        <SolutionPage
            title="Battery Systems"
            subtitle="Advanced energy storage for resilience and efficiency."
            description="Our battery energy storage systems (BESS) provide the flexibility and reliability needed for modern energy management. Whether for home backup or commercial peak shaving, our solutions deliver secure, on-demand power."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Storage"
        />
    );
};

export default BatterySystems;
