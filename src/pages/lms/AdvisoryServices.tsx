import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Lightbulb, Users, TrendingUp, Target, MessageSquare, FileText } from 'lucide-react';
import heroImage from '@/assets/hero-renewable-integration.jpg';

const AdvisoryServices = () => {
    const features: Feature[] = [
        {
            title: 'Strategic Planning',
            description: 'Expert guidance on learning strategy, technology selection, and implementation.',
            icon: Target
        },
        {
            title: 'Needs Analysis',
            description: 'Comprehensive assessment of training gaps and organizational requirements.',
            icon: FileText
        },
        {
            title: 'Change Management',
            description: 'Support for cultural transformation and adoption of new learning initiatives.',
            icon: Users
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Expert Guidance',
            description: 'Leverage decades of combined experience in learning and development.'
        },
        {
            title: 'Customized Solutions',
            description: 'Tailored recommendations that fit your unique organizational context.'
        },
        {
            title: 'Accelerated Results',
            description: 'Avoid common pitfalls and achieve training goals faster with expert support.'
        },
        {
            title: 'ROI Optimization',
            description: 'Maximize the return on your training investments through strategic planning.'
        }
    ];

    return (
        <SolutionPage
            title="Advisory Services"
            subtitle="Strategic guidance for learning excellence."
            description="Our advisory services provide expert consultation on all aspects of learning and development. From strategy to execution, we help you build world-class training programs."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Training"
        />
    );
};

export default AdvisoryServices;
