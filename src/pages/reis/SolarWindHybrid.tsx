import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Wind, Sun, RefreshCw, Zap, BarChart, Layers } from 'lucide-react';
import heroImage from '@/assets/reis/solar-wind-hybrid.png';

const SolarWindHybrid = () => {
    const features: Feature[] = [
        {
            title: 'Complementary Generation',
            description: 'Harness solar power during the day and wind energy during the night or cloudy periods for consistent output.',
            icon: RefreshCw
        },
        {
            title: 'Optimized Land Use',
            description: 'Co-location of assets maximizes energy density per acre, reducing land acquisition and infrastructure costs.',
            icon: Layers
        },
        {
            title: 'Shared Infrastructure',
            description: 'Utilize a single grid connection and substation for both generation sources, significantly lowering CAPEX.',
            icon: Zap
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Improved Capacity Factor',
            description: 'Achieve higher overall plant utilization compared to standalone solar or wind projects.'
        },
        {
            title: 'Grid Reliability',
            description: 'More stable and predictable power output reduces the need for backup generation.'
        },
        {
            title: 'Cost Efficiency',
            description: 'Shared operations and maintenance resources lead to lower long-term operational expenses.'
        },
        {
            title: 'Resource Maximization',
            description: 'Capture energy from multiple natural resources simultaneously in the same location.'
        }
    ];

    return (
        <SolutionPage
            title="Solar-Wind Hybrid"
            subtitle="Synergistic energy generation for maximum reliability."
            description="Our hybrid solutions combine the best of solar and wind technologies to create a more stable and reliable power generation profile. By leveraging the complementary nature of these resources, we ensure consistent energy delivery around the clock."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Solar"
        />
    );
};

export default SolarWindHybrid;
