import React from 'react';
import Header from './Header';
import Footer from './Footer';
import StickyFooter from './StickyFooter';

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
    </div>
  );
};

export default Layout;