import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Database, Server, Workflow, HardDrive, FileCode, RefreshCw } from 'lucide-react';
import heroImage from '@/assets/mega-menu-data-ai.jpg';

const DataEngineering = () => {
    const features: Feature[] = [
        {
            title: 'ETL Pipeline Construction',
            description: 'Robust Extract, Transform, Load pipelines to move and prepare data for analysis.',
            icon: Workflow
        },
        {
            title: 'Data Warehousing',
            description: 'Scalable and secure data storage solutions optimized for query performance.',
            icon: Database
        },
        {
            title: 'Big Data Infrastructure',
            description: 'Architectures capable of handling massive volume, velocity, and variety of data.',
            icon: Server
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Data Integrity',
            description: 'Ensure your data is accurate, consistent, and reliable across the entire organization.'
        },
        {
            title: 'Accessibility',
            description: 'Democratize data access, allowing stakeholders to retrieve the information they need instantly.'
        },
        {
            title: 'Scalability',
            description: 'Infrastructure that grows with your business, handling increasing data loads effortlessly.'
        },
        {
            title: 'Cost Optimization',
            description: 'Efficient storage and processing architectures that reduce cloud infrastructure costs.'
        }
    ];

    return (
        <SolutionPage
            title="Data Engineering"
            subtitle="Building the foundation for data-driven success."
            description="We design and build the robust infrastructure needed to collect, store, and process your data. Our engineering solutions ensure your data is clean, accessible, and ready for analysis."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Analytics"
        />
    );
};

export default DataEngineering;
