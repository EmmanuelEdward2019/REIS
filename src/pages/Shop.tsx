import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ShoppingCart, Menu, Play, ArrowRight } from 'lucide-react';

// Import product images
import productCommercialSolar from '@/assets/product-commercial-solar.jpg';
import productAnalyticsPlatform from '@/assets/product-analytics-platform.jpg';
import productTrainingSuite from '@/assets/product-training-suite.jpg';
import productGridStorage from '@/assets/product-grid-storage.jpg';
import videoInstallationProcess from '@/assets/video-installation-process.jpg';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [cartItems, setCartItems] = useState(0);

  const categories = [
    'All Products',
    'Solar Systems',
    'Energy Storage',
    'Analytics Platform',
    'Training Programs',
    'Accessories'
  ];

  const heroProducts = [
    {
      id: 1,
      name: 'REIS Commercial Solar System',
      image: productCommercialSolar,
      isVideo: false,
      price: 'Starting at $50,000',
      description: 'Complete commercial solar solution with AI optimization'
    },
    {
      id: 2,
      name: 'Installation Process',
      image: videoInstallationProcess,
      isVideo: true,
      price: null,
      description: 'See our professional installation in action'
    },
    {
      id: 3,
      name: 'Energy Analytics Platform',
      image: productAnalyticsPlatform,
      isVideo: false,
      price: 'Starting at $5,000/mo',
      description: 'AI-powered energy optimization and monitoring'
    }
  ];

  const bestSellers = [
    {
      id: 1,
      name: 'Residential Solar Kit',
      image: productCommercialSolar,
      price: '$15,000',
      originalPrice: '$18,000',
      bestseller: true
    },
    {
      id: 2,
      name: 'Grid Storage Battery',
      image: productGridStorage,
      price: '$25,000',
      originalPrice: null,
      bestseller: true
    },
    {
      id: 3,
      name: 'Training Certification',
      image: productTrainingSuite,
      price: '$500',
      originalPrice: '$750',
      bestseller: true
    },
    {
      id: 4,
      name: 'Analytics Dashboard',
      image: productAnalyticsPlatform,
      price: '$2,000/mo',
      originalPrice: null,
      bestseller: true
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Enterprise Solar Solution',
      image: productCommercialSolar,
      price: '$100,000'
    },
    {
      id: 2,
      name: 'Hydrogen Storage System',
      image: productGridStorage,
      price: '$75,000'
    },
    {
      id: 3,
      name: 'Professional Training Suite',
      image: productTrainingSuite,
      price: '$1,500'
    }
  ];

  const compactProducts = [
    { id: 1, name: 'Solar Panel Kit', price: '$2,500' },
    { id: 2, name: 'Battery Pack', price: '$5,000' },
    { id: 3, name: 'Inverter System', price: '$1,200' }
  ];

  return (
    <Layout>
      {/* Shop Header */}
      <div className="bg-background border-b border-border pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-foreground">Shop</h1>
              
              {/* Category Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64 bg-muted border-0"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItems}
                  </Badge>
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Product Slider */}
      <section className="bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
            {heroProducts.map((product, index) => (
              <div key={product.id} className="relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                </div>

                {product.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200">
                      <Play className="w-6 h-6 text-black ml-1" />
                    </div>
                  </div>
                )}

                <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">{product.name}</h3>
                  <p className="text-lg opacity-90 mb-4">{product.description}</p>
                  {product.price && (
                    <div className="text-lg font-medium mb-6">{product.price}</div>
                  )}
                  
                  <Button className="w-fit bg-gray-200 hover:bg-gray-100 text-black font-medium">
                    {product.isVideo ? 'Watch Video' : 'Shop Now'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-foreground">Best Sellers</h2>
            <Button variant="link" className="text-primary font-medium underline">
              Shop All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <Card key={product.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.bestseller && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      Best Seller
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg font-bold text-foreground">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <Button className="w-full bg-gray-200 hover:bg-gray-100 text-black font-medium">
                    Shop Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - One per row */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {featuredProducts.map((product, index) => (
            <div key={product.id} className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-6">
                <h3 className="text-4xl font-bold text-foreground">{product.name}</h3>
                <div className="text-2xl font-bold text-primary">{product.price}</div>
                <p className="text-lg text-muted-foreground">
                  Advanced renewable energy solution designed for maximum efficiency and sustainability.
                </p>
                <Button size="lg" className="bg-gray-200 hover:bg-gray-100 text-black font-medium">
                  Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compact Products Row */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {compactProducts.map((product) => (
              <Card key={product.id} className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                  <div className="text-lg font-bold text-primary">{product.price}</div>
                  <Button className="w-full bg-gray-200 hover:bg-gray-100 text-black font-medium">
                    Shop Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final Product Row */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <img
                src={productAnalyticsPlatform}
                alt="Complete Energy Solution"
                className="w-full aspect-[4/3] object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 space-y-6">
              <h3 className="text-4xl font-bold text-foreground">Complete Energy Solution</h3>
              <div className="text-2xl font-bold text-primary">Starting at $200,000</div>
              <p className="text-lg text-muted-foreground">
                End-to-end renewable energy infrastructure with AI analytics, storage systems, and professional support.
              </p>
              <Button size="lg" className="bg-gray-200 hover:bg-gray-100 text-black font-medium">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;