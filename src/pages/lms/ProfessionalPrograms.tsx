import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { GraduationCap, Award, TrendingUp, Users, Target, BookOpen } from 'lucide-react';
import heroImage from '@/assets/video-training-excellence.jpg';

const ProfessionalPrograms = () => {
    const features: Feature[] = [
        {
            title: 'Certification Pathways',
            description: 'Structured programs leading to industry-recognized certifications and credentials.',
            icon: Award
        },
        {
            title: 'Expert Instructors',
            description: 'Learn from seasoned professionals with real-world industry experience.',
            icon: Users
        },
        {
            title: 'Career Development',
            description: 'Skills-based training aligned with career progression and market demands.',
            icon: TrendingUp
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Skill Enhancement',
            description: 'Develop in-demand competencies that drive career advancement and organizational value.'
        },
        {
            title: 'Credentialing',
            description: 'Earn recognized certifications that validate expertise and boost professional credibility.'
        },
        {
            title: 'Flexible Learning',
            description: 'Self-paced and instructor-led options to fit busy professional schedules.'
        },
        {
            title: 'Networking',
            description: 'Connect with peers and industry leaders through collaborative learning experiences.'
        }
    ];

    return (
        <SolutionPage
            title="Professional Programs"
            subtitle="Advance careers through expert-led training."
            description="Our professional development programs equip individuals and teams with the skills, knowledge, and certifications needed to excel in today's competitive landscape."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Training"
        />
    );
};

export default ProfessionalPrograms;
