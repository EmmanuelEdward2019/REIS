import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Sun, Home, DollarSign, Leaf, ShieldCheck, BatteryCharging } from 'lucide-react';
import heroImage from '@/assets/hero-residential-solar.jpg';

const ResidentialSolar = () => {
    const features: Feature[] = [
        {
            title: 'High-Efficiency Panels',
            description: 'Premium solar panels with industry-leading efficiency ratings to maximize energy production even in limited roof space.',
            icon: Sun
        },
        {
            title: 'Smart Inverters',
            description: 'Advanced inverters that optimize power output and provide real-time monitoring capabilities via mobile app.',
            icon: Home
        },
        {
            title: 'Battery Integration',
            description: 'Seamless integration with home battery systems to store excess energy for use at night or during power outages.',
            icon: BatteryCharging
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Reduce Electricity Bills',
            description: 'Significantly lower or eliminate your monthly electricity costs by generating your own clean power.'
        },
        {
            title: 'Increase Property Value',
            description: 'Homes with solar installations sell faster and for a premium compared to non-solar homes.'
        },
        {
            title: 'Energy Independence',
            description: 'Protect yourself from rising utility rates and grid instability with your own power source.'
        },
        {
            title: 'Environmental Impact',
            description: 'Reduce your carbon footprint and contribute to a cleaner, more sustainable future.'
        }
    ];

    return (
        <SolutionPage
            title="Residential Solar"
            subtitle="Power your home with clean, renewable energy."
            description="Our residential solar solutions are designed to provide homeowners with energy independence, significant cost savings, and a reduced carbon footprint. We offer custom-designed systems that integrate seamlessly with your home's architecture and energy needs."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Solar"
        />
    );
};

export default ResidentialSolar;
