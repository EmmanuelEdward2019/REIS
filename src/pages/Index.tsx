import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSlider from '@/components/home/HeroSlider';
import ProductCarousel from '@/components/home/ProductCarousel';
import CurrentOffers from '@/components/home/CurrentOffers';
import VideoProductCarousel from '@/components/home/VideoProductCarousel';
import DivisionsSection from '@/components/home/DivisionsSection';

const Index = () => {
  return (
    <Layout>
      <HeroSlider />
      <div className="py-16">
        <ProductCarousel />
      </div>
      <CurrentOffers />
      <VideoProductCarousel />
      <DivisionsSection />
    </Layout>
  );
};

export default Index;
