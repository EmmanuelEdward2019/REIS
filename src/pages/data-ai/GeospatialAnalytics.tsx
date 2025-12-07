import React from 'react';
import SolutionPage, { Feature, Benefit } from '@/components/reis/SolutionPage';
import { Map, MapPin, Satellite, Navigation, Globe2, Layers } from 'lucide-react';
import heroImage from '@/assets/hero-renewable-integration.jpg';

const GeospatialAnalytics = () => {
    const features: Feature[] = [
        {
            title: 'Location Intelligence',
            description: 'Extract insights from geographic data to optimize site selection, logistics, and planning.',
            icon: MapPin
        },
        {
            title: 'Satellite Imagery Analysis',
            description: 'Process and analyze satellite data for agriculture, environmental monitoring, and urban planning.',
            icon: Satellite
        },
        {
            title: 'Real-time Mapping',
            description: 'Dynamic, interactive maps that update in real-time with IoT sensor data and user inputs.',
            icon: Navigation
        }
    ];

    const benefits: Benefit[] = [
        {
            title: 'Strategic Planning',
            description: 'Make location-based decisions backed by spatial analysis and predictive modeling.'
        },
        {
            title: 'Resource Optimization',
            description: 'Optimize routes, territories, and resource allocation using geographic intelligence.'
        },
        {
            title: 'Environmental Monitoring',
            description: 'Track changes in land use, vegetation, and climate patterns over time.'
        },
        {
            title: 'Emergency Response',
            description: 'Coordinate disaster response efforts with real-time geospatial situational awareness.'
        }
    ];

    return (
        <SolutionPage
            title="Geospatial Analytics"
            subtitle="Mapping the world with data-driven precision."
            description="Leverage the power of location data to unlock new insights. Our geospatial analytics solutions combine GIS, remote sensing, and AI to solve complex spatial problems."
            heroImage={heroImage}
            features={features}
            benefits={benefits}
            category="Security"
        />
    );
};

export default GeospatialAnalytics;
