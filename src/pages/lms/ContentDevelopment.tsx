import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { FileText, Video, Headphones, Palette, Code, Users } from 'lucide-react';
import heroImage from '@/assets/product-training-suite.jpg';

const ContentDevelopment = () => {
    const features: Feature[] = [
        {
            title: 'Multimedia Production',
            description: 'Professional video, audio, and interactive content creation services.',
            icon: Video
        },
        {
            title: 'Instructional Design',
            description: 'Pedagogically sound course structures that maximize learning outcomes.',
            icon: FileText
        },
        {
            title: 'Localization',
            description: 'Multi-language support and cultural adaptation for global audiences.',
            icon: Users
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Engaging Content',
            description: 'Professionally designed materials that keep learners motivated and focused.'
        },
        {
            title: 'Faster Development',
            description: 'Leverage our expertise to create high-quality content in less time.'
        },
        {
            title: 'Consistency',
            description: 'Maintain brand standards and learning quality across all your training materials.'
        },
        {
            title: 'Accessibility',
            description: 'WCAG-compliant content that ensures inclusivity for all learners.'
        }
    ];

    return (
        <SolutionPage
            title="Content Development"
            subtitle="Transform knowledge into compelling learning experiences."
            description="Our content development services combine instructional design expertise with multimedia production to create training materials that educate, engage, and inspire."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Training"
        />
    );
};

export default ContentDevelopment;
