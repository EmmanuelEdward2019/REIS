import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Monitor, Users, BookOpen, Award, Zap, BarChart } from 'lucide-react';
import heroImage from '@/assets/hero-training-facility.jpg';

const LMSPlatform = () => {
    const features: Feature[] = [
        {
            title: 'Cloud-Based Learning',
            description: 'Scalable, accessible platform that works on any device, anywhere, anytime.',
            icon: Monitor
        },
        {
            title: 'User Management',
            description: 'Comprehensive tools for managing learners, instructors, and administrators.',
            icon: Users
        },
        {
            title: 'Course Builder',
            description: 'Intuitive drag-and-drop interface for creating engaging, interactive courses.',
            icon: BookOpen
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Centralized Learning',
            description: 'All training materials, assessments, and progress tracking in one unified platform.'
        },
        {
            title: 'Cost Efficiency',
            description: 'Reduce training costs by eliminating travel, printed materials, and venue expenses.'
        },
        {
            title: 'Real-Time Analytics',
            description: 'Track learner progress, completion rates, and performance metrics instantly.'
        },
        {
            title: 'Scalability',
            description: 'Easily scale from 10 to 10,000+ users without infrastructure headaches.'
        }
    ];

    return (
        <SolutionPage
            title="LMS Platform"
            subtitle="Empower your organization with modern learning technology."
            description="Our Learning Management System provides a comprehensive, user-friendly platform for delivering, tracking, and managing all your training initiatives. Built for the modern workforce."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Training"
        />
    );
};

export default LMSPlatform;
