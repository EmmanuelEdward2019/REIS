import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSlider from '@/components/home/HeroSlider';
import ProductCarousel from '@/components/home/ProductCarousel';
import CurrentOffers from '@/components/home/CurrentOffers';
import VideoProductCarousel from '@/components/home/VideoProductCarousel';
import DataAICarousel from '@/components/home/DataAICarousel';
import DivisionsSection from '@/components/home/DivisionsSection';
import MetricsWidget from '@/components/home/MetricsWidget';

const Index = () => {
  return (
    <Layout>
      <HeroSlider />
      <div className="py-16">
        <ProductCarousel />
      </div>
      <CurrentOffers />
      <MetricsWidget />
      <VideoProductCarousel />
      <DataAICarousel />
      <DivisionsSection />
    </Layout>
  );
};

export default Index;
