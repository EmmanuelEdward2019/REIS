import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Package, Smartphone, Monitor, Zap, Globe, Rocket } from 'lucide-react';
import heroImage from '@/assets/product-training-suite.jpg';

const AIProducts = () => {
    const features: Feature[] = [
        {
            title: 'SaaS Product Development',
            description: 'End-to-end development of AI-powered Software as a Service platforms.',
            icon: Globe
        },
        {
            title: 'Intelligent Mobile Apps',
            description: 'Native and cross-platform mobile applications enriched with AI features.',
            icon: Smartphone
        },
        {
            title: 'Enterprise Software',
            description: 'Custom software solutions tailored to streamline complex enterprise workflows.',
            icon: Monitor
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Market Differentiation',
            description: 'Stand out with unique, AI-driven features that solve user problems in novel ways.'
        },
        {
            title: 'User Engagement',
            description: 'Create sticky, intuitive experiences that keep users coming back.'
        },
        {
            title: 'Rapid Time-to-Market',
            description: 'Agile development methodologies to launch your product faster and iterate quickly.'
        },
        {
            title: 'Scalable Architecture',
            description: 'Built on cloud-native technologies to handle growth from day one.'
        }
    ];

    return (
        <SolutionPage
            title="AI Products"
            subtitle="Innovative software powered by intelligence."
            description="We build next-generation software products that leverage AI to deliver exceptional value. From concept to launch, we are your partner in product innovation."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Security" // Using Security category for the blue/cyan theme which fits 'Products' well
        />
    );
};

export default AIProducts;
