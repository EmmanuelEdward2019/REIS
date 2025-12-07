import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { BarChart3, PieChart, LineChart, Database, Search, Share2 } from 'lucide-react';
import heroImage from '@/assets/product-analytics-platform.jpg';

const DataAnalytics = () => {
    const features: Feature[] = [
        {
            title: 'Predictive Analytics',
            description: 'Forecast future trends and behaviors using historical data and advanced modeling.',
            icon: LineChart
        },
        {
            title: 'Real-time Dashboards',
            description: 'Interactive, live visualizations that provide instant visibility into key performance indicators.',
            icon: BarChart3
        },
        {
            title: 'Data Mining',
            description: 'Uncover hidden patterns and correlations in large datasets to drive strategic decisions.',
            icon: Search
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Informed Decision Making',
            description: 'Replace guesswork with evidence-based insights derived from your own data.'
        },
        {
            title: 'Operational Efficiency',
            description: 'Identify bottlenecks and inefficiencies in your processes to streamline operations.'
        },
        {
            title: 'Customer Insights',
            description: 'Understand your customers better to personalize experiences and improve retention.'
        },
        {
            title: 'Revenue Growth',
            description: 'Discover new revenue streams and optimize pricing strategies through data analysis.'
        }
    ];

    return (
        <SolutionPage
            title="Data Analytics"
            subtitle="Turning raw data into actionable insights."
            description="Unlock the full potential of your data with our advanced analytics solutions. We help you collect, process, and visualize data to make smarter, faster decisions that drive growth."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Analytics"
        />
    );
};

export default DataAnalytics;
