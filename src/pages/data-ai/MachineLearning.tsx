import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Cpu, Network, GitBranch, Bot, Layers, Code } from 'lucide-react';
import heroImage from '@/assets/video-analytics-dashboard.jpg';

const MachineLearning = () => {
    const features: Feature[] = [
        {
            title: 'Custom Model Development',
            description: 'Tailored machine learning models designed to solve your specific business problems.',
            icon: Cpu
        },
        {
            title: 'Natural Language Processing',
            description: 'Advanced NLP solutions for sentiment analysis, chatbots, and document processing.',
            icon: Bot
        },
        {
            title: 'Computer Vision',
            description: 'Image and video analysis systems for quality control, security, and automation.',
            icon: Layers
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Automation at Scale',
            description: 'Automate complex, repetitive tasks with high accuracy, freeing up human resources.'
        },
        {
            title: 'Continuous Improvement',
            description: 'Models that learn and adapt over time, becoming more accurate with more data.'
        },
        {
            title: 'Personalization',
            description: 'Deliver hyper-personalized experiences to users based on their behavior and preferences.'
        },
        {
            title: 'Fraud Detection',
            description: 'Identify anomalies and potential fraud patterns in real-time to protect your assets.'
        }
    ];

    return (
        <SolutionPage
            title="Machine Learning"
            subtitle="Intelligent systems that learn and adapt."
            description="Harness the power of algorithms that improve through experience. From predictive maintenance to recommendation engines, our machine learning solutions drive innovation and efficiency."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Analytics"
        />
    );
};

export default MachineLearning;
