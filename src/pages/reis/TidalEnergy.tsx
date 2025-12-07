import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Waves, Moon, RefreshCw, Activity, Anchor, Zap } from 'lucide-react';
import heroImage from '@/assets/reis/tidal-energy.png';

const TidalEnergy = () => {
    const features: Feature[] = [
        {
            title: 'Predictable Generation',
            description: 'Unlike wind or solar, tidal cycles are perfectly predictable years in advance, aiding grid planning.',
            icon: Moon
        },
        {
            title: 'Underwater Turbines',
            description: 'Invisible from the surface, these turbines harness the kinetic energy of moving water currents.',
            icon: Waves
        },
        {
            title: 'Bi-Directional',
            description: 'Advanced rotors capture energy from both incoming and outgoing tides for maximum efficiency.',
            icon: RefreshCw
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Reliable Baseload',
            description: 'Provides a consistent source of power that complements intermittent renewables.'
        },
        {
            title: 'High Energy Density',
            description: 'Water is 800 times denser than air, meaning smaller turbines can generate significant power.'
        },
        {
            title: 'Minimal Visual Impact',
            description: 'Infrastructure is mostly submerged, preserving the natural beauty of coastlines.'
        },
        {
            title: 'Long Lifespan',
            description: 'Designed for the harsh marine environment with lifespans exceeding 25 years.'
        }
    ];

    return (
        <SolutionPage
            title="Tidal Energy"
            subtitle="Reliable power from the rhythm of the tides."
            description="Tidal energy taps into the gravitational forces of the moon and sun. Our tidal stream technologies provide a highly predictable and reliable source of renewable energy, operating silently beneath the waves to power coastal communities."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Marine"
        />
    );
};

export default TidalEnergy;
