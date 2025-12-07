import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { ClipboardCheck, BarChart3, Award, Target, FileText, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/video-analytics-dashboard.jpg';

const AssessmentTools = () => {
    const features: Feature[] = [
        {
            title: 'Adaptive Testing',
            description: 'AI-powered assessments that adjust difficulty based on learner performance.',
            icon: Target
        },
        {
            title: 'Skills Mapping',
            description: 'Identify competency gaps and create personalized development plans.',
            icon: BarChart3
        },
        {
            title: 'Certification Exams',
            description: 'Secure, proctored testing for professional certifications and credentials.',
            icon: Award
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Objective Evaluation',
            description: 'Fair, standardized assessments that accurately measure knowledge and skills.'
        },
        {
            title: 'Instant Feedback',
            description: 'Immediate results and detailed analytics to guide learning improvements.'
        },
        {
            title: 'Data-Driven Insights',
            description: 'Comprehensive reporting to inform training strategy and resource allocation.'
        },
        {
            title: 'Fraud Prevention',
            description: 'Advanced proctoring and security features to maintain assessment integrity.'
        }
    ];

    return (
        <SolutionPage
            title="Assessment Tools"
            subtitle="Measure what matters with precision."
            description="Our assessment platform provides robust tools for evaluating knowledge, skills, and competencies. From formative quizzes to high-stakes certification exams, we ensure accurate, reliable results."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Training"
        />
    );
};

export default AssessmentTools;
