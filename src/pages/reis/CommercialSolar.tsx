import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Building2, TrendingUp, Sun, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import heroImage from '@/assets/product-commercial-solar.jpg';

const CommercialSolar = () => {
    const features: Feature[] = [
        {
            title: 'Scalable Architecture',
            description: 'Modular systems designed to grow with your business needs, from small offices to large industrial complexes.',
            icon: Building2
        },
        {
            title: 'Peak Shaving',
            description: 'Intelligent energy management to reduce consumption during peak rate hours, significantly lowering operational costs.',
            icon: TrendingUp
        },
        {
            title: 'Corporate Sustainability',
            description: 'Visibly demonstrate your commitment to green energy and sustainability goals to customers and stakeholders.',
            icon: Leaf
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'ROI & Tax Incentives',
            description: 'Maximize financial returns through reduced energy bills and available government tax credits and incentives.'
        },
        {
            title: 'Energy Security',
            description: 'Protect your business operations from grid outages and fluctuating energy prices.'
        },
        {
            title: 'Low Maintenance',
            description: 'Durable, high-quality components require minimal maintenance over their 25+ year lifespan.'
        },
        {
            title: 'Brand Value',
            description: 'Enhance your corporate image and attract eco-conscious clients and employees.'
        }
    ];

    return (
        <SolutionPage
            title="Commercial Solar"
            subtitle="Empower your business with sustainable, cost-effective energy."
            description="Our commercial solar solutions are engineered to deliver maximum ROI for businesses of all sizes. By converting unused roof space or land into a power generation asset, you can significantly reduce operating costs and achieve your sustainability targets."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Solar"
        />
    );
};

// Helper for the icon
function Leaf(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
    )
}

export default CommercialSolar;
