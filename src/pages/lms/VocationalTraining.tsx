import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Wrench, Briefcase, Hammer, Users, Award, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-solar-installation.jpg';

const VocationalTraining = () => {
    const features: Feature[] = [
        {
            title: 'Hands-On Learning',
            description: 'Practical, skills-based training with real-world equipment and scenarios.',
            icon: Wrench
        },
        {
            title: 'Industry Partnerships',
            description: 'Collaborations with employers to ensure training meets market needs.',
            icon: Briefcase
        },
        {
            title: 'Job Placement Support',
            description: 'Career services and connections to help graduates secure employment.',
            icon: Users
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Career Readiness',
            description: 'Graduates enter the workforce with job-ready skills and confidence.'
        },
        {
            title: 'Economic Mobility',
            description: 'Vocational training opens doors to stable, well-paying careers.'
        },
        {
            title: 'Workforce Development',
            description: 'Address skills gaps and build a qualified talent pipeline for your industry.'
        },
        {
            title: 'Fast Track',
            description: 'Shorter training periods compared to traditional degree programs.'
        }
    ];

    return (
        <SolutionPage
            title="Vocational Training"
            subtitle="Building skilled trades for tomorrow's workforce."
            description="Our vocational training programs provide hands-on, practical education in high-demand trades. From renewable energy installation to advanced manufacturing, we prepare learners for successful careers."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Training"
        />
    );
};

export default VocationalTraining;
