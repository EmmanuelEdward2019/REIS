import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Brain, Target, Lightbulb, TrendingUp, Compass, Users } from 'lucide-react';
import heroImage from '@/assets/hero-data-analytics.jpg';

const AIStrategy = () => {
    const features: Feature[] = [
        {
            title: 'Roadmap Development',
            description: 'Comprehensive AI adoption roadmaps aligned with your long-term business goals.',
            icon: Compass
        },
        {
            title: 'Use Case Identification',
            description: 'Pinpointing high-impact opportunities where AI can deliver immediate value.',
            icon: Target
        },
        {
            title: 'Feasibility Analysis',
            description: 'Technical and economic assessment of potential AI initiatives to ensure ROI.',
            icon: TrendingUp
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Competitive Advantage',
            description: 'Stay ahead of the curve by integrating cutting-edge AI technologies before your competitors.'
        },
        {
            title: 'Risk Mitigation',
            description: 'Identify and address potential ethical, legal, and technical risks early in the process.'
        },
        {
            title: 'Resource Optimization',
            description: 'Allocate your budget and talent effectively to projects with the highest probability of success.'
        },
        {
            title: 'Cultural Transformation',
            description: 'Foster a data-driven culture within your organization to embrace AI-driven decision making.'
        }
    ];

    return (
        <SolutionPage
            title="AI Strategy"
            subtitle="Navigating the future of intelligence."
            description="Our AI Strategy services help organizations define a clear path to value. We move beyond the hype to build actionable, scalable, and ethical AI strategies that drive real business transformation."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Analytics"
        />
    );
};

export default AIStrategy;
