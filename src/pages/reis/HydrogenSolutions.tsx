import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Droplets, Flame, Factory, Truck, Recycle, Zap } from 'lucide-react';
import heroImage from '@/assets/reis/hydrogen-solutions.png';

const HydrogenSolutions = () => {
    const features: Feature[] = [
        {
            title: 'Green Hydrogen Production',
            description: 'Electrolysis systems powered by renewable energy to produce zero-emission hydrogen fuel.',
            icon: Recycle
        },
        {
            title: 'Fuel Cell Technology',
            description: 'High-efficiency fuel cells for stationary power generation and heavy-duty transport applications.',
            icon: Zap
        },
        {
            title: 'Storage & Transport',
            description: 'Advanced compression and storage solutions for safe distribution and long-term energy banking.',
            icon: Truck
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Decarbonize Industry',
            description: 'Replace fossil fuels in hard-to-abate sectors like steel, chemicals, and heavy manufacturing.'
        },
        {
            title: 'Long-Duration Storage',
            description: 'Store renewable energy for days, weeks, or months to balance seasonal supply and demand.'
        },
        {
            title: 'Zero Emissions',
            description: 'The only byproduct of hydrogen fuel cells is pure water, eliminating local pollution.'
        },
        {
            title: 'Energy Carrier',
            description: 'Transport renewable energy over long distances where power lines are not feasible.'
        }
    ];

    return (
        <SolutionPage
            title="Hydrogen Solutions"
            subtitle="The fuel of the future, available today."
            description="We are pioneering the hydrogen economy with end-to-end solutions for green hydrogen production, storage, and utilization. Hydrogen offers a versatile path to decarbonizing heavy industry and providing long-duration energy storage."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Storage"
        />
    );
};

export default HydrogenSolutions;
