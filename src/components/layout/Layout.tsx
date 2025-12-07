import React from 'react';
import Header from './Header';
import Footer from './Footer';
import GlobalAddToCartDialog from '@/components/cart/GlobalAddToCartDialog';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
      <GlobalAddToCartDialog />
    </div>
  );
};

export default Layout;