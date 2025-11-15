import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, HelpCircle, Globe, UserCircle, ChevronRight, LogOut } from 'lucide-react';
import megaMenuReis from '@/assets/mega-menu-reis.jpg';
import megaMenuDataAI from '@/assets/mega-menu-data-ai.jpg';
import megaMenuTraining from '@/assets/mega-menu-training.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import RegionSelector from './RegionSelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuState, setMobileMenuState] = useState({
    reis: false,
    dataAi: false,
    lms: false
  });

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // Handle click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mega-menu-container') && !target.closest('.mega-menu-portal')) {
        setActiveMega(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMegaMenu = (menu: string) => {
    setActiveMega(activeMega === menu ? null : menu);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const megaMenus = {
    reis: {
      title: 'REIS',
      sections: [
        {
          title: 'Solar Solutions',
          image: megaMenuReis,
          items: [
            { name: 'Solar Systems', href: '/reis' },
            { name: 'Solar-Wind Hybrid', href: '/reis' },
            { name: 'Energy Storage', href: '/reis' },
            { name: 'Hydrogen Solutions', href: '/reis' }
          ]
        },
        {
          title: 'Advanced Systems',
          image: megaMenuReis,
          items: [
            { name: 'Tidal Energy', href: '/reis' },
            { name: 'Offshore Solutions', href: '/reis' },
            { name: 'Micro Systems', href: '/reis' }
          ]
        }
      ]
    },
    'data-ai': {
      title: 'Data & AI',
      sections: [
        {
          title: 'Analytics & Strategy',
          image: megaMenuDataAI,
          items: [
            { name: 'AI Strategy', href: '/data-and-ai' },
            { name: 'Data Analytics', href: '/data-and-ai' },
            { name: 'Machine Learning', href: '/data-and-ai' },
            { name: 'Data Engineering', href: '/data-and-ai' }
          ]
        },
        {
          title: 'Solutions & Security',
          image: megaMenuDataAI,
          items: [
            { name: 'AI Products', href: '/data-and-ai' },
            { name: 'Security Solutions', href: '/data-and-ai' },
            { name: 'Geospatial Analytics', href: '/data-and-ai' }
          ]
        }
      ]
    },
    training: {
      title: 'Training',
      sections: [
        {
          title: 'Learning Systems',
          image: megaMenuTraining,
          items: [
            { name: 'LMS Platform', href: '/lms' },
            { name: 'Content Development', href: '/lms' },
            { name: 'Professional Programs', href: '/lms' },
            { name: 'Compliance Training', href: '/lms' }
          ]
        },
        {
          title: 'Specialized Training',
          image: megaMenuTraining,
          items: [
            { name: 'Vocational Training', href: '/lms' },
            { name: 'Assessment Tools', href: '/lms' },
            { name: 'Advisory Services', href: '/lms' }
          ]
        }
      ]
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-background/95 backdrop-blur-md border-b border-border' 
          : 'bg-transparent'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo - Far Left */}
            <div className="flex items-center mr-auto">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/76f8e1a6-f2ed-41a8-ac1e-dbcff484f1ea.png" 
                  alt="Eagle & Thistle Group" 
                  className={`h-10 w-auto transition-all duration-300 ${
                    (isScrolled || !isHomePage) ? 'brightness-100' : 'brightness-0 invert'
                  }`}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 mx-6">
              {/* REIS Mega Menu */}
              <div className="relative mega-menu-container">
                <button 
                  onClick={() => toggleMegaMenu('reis')}
                  className={`flex items-center space-x-1 hover:text-primary transition-colors font-medium ${
                    (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
                  }`}
                >
                  <span>{t('nav.reis')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeMega === 'reis' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeMega === 'reis' && typeof document !== 'undefined' && createPortal(
                  <div className="mega-menu-portal fixed top-16 left-0 right-0 w-screen bg-white border-t border-border shadow-2xl z-50">
                    <div className="w-full py-8">
                      <div className="grid grid-cols-4 gap-12 max-w-7xl mx-auto px-8">
                        {/* Solar Solutions */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/76f8e1a6-f2ed-41a8-ac1e-dbcff484f1ea.png" 
                              alt="Solar Solutions"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">{t('nav.solar_solutions')}</h3>
                            <ul className="space-y-2">
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.residential_solar')}</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.commercial_solar')}</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.utility_scale')}</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.solar_wind_hybrid')}</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Energy Storage */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/a0b4d24a-a102-4800-8a4f-c35888e7c359.png" 
                              alt="Energy Storage"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">{t('nav.energy_storage')}</h3>
                            <ul className="space-y-2">
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.battery_systems')}</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.grid_storage')}</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.hydrogen_solutions')}</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.micro_storage')}</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Marine Energy */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/b6450dea-940c-4706-9e7b-3adfa0b8c3cb.png" 
                              alt="Marine Energy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">{t('nav.marine_energy')}</h3>
                            <ul className="space-y-2">
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.offshore_wind')}</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.tidal_energy')}</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.wave_power')}</Link></li>
<li><Link to="/reis" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.floating_solar')}</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Featured Content */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 space-y-3">
                          <h4 className="text-base font-bold text-foreground">{t('nav.reis_platform')}</h4>
                          <p className="text-foreground/70 text-xs leading-relaxed">Experience our comprehensive renewable energy infrastructure solutions designed for the future.</p>
                          <Button
                            size="sm"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                            onClick={() => {
                              navigate('/reis');
                              setActiveMega(null);
                            }}
                          >
                            {t('nav.explore_reis')}
                          </Button>
                          <div className="pt-3 border-t border-border/50">
                            <p className="text-xs text-foreground/60">Trusted by 500+ organizations worldwide</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              

              {/* Data & AI Mega Menu */}
              <div className="relative mega-menu-container">
                <button 
                  onClick={() => toggleMegaMenu('data-ai')}
                  className={`flex items-center space-x-1 hover:text-primary transition-colors font-medium whitespace-nowrap ${
                    (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
                  }`}
                >
                  <span>{t('nav.data_ai')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeMega === 'data-ai' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeMega === 'data-ai' && typeof document !== 'undefined' && createPortal(
                  <div className="mega-menu-portal fixed top-16 left-0 right-0 w-screen bg-white border-t border-border shadow-2xl z-50">
                    <div className="w-full py-8">
                      <div className="grid grid-cols-3 gap-12 max-w-6xl mx-auto px-8">
                        {/* Analytics & Strategy */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/14519926-36cd-4536-893d-d86ae346591a.png" 
                              alt="Analytics & Strategy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">{t('nav.analytics_strategy')}</h3>
                            <ul className="space-y-2">
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.ai_strategy')}</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.data_analytics')}</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.machine_learning')}</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.data_engineering')}</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Solutions & Security */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/c674919a-db90-4606-a986-db6447308d8f.png" 
                              alt="Solutions & Security"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">{t('nav.solutions_security')}</h3>
                            <ul className="space-y-2">
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.ai_products')}</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.security_solutions')}</Link></li>
<li><Link to="/data-and-ai" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.geospatial_analytics')}</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Featured Content */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 space-y-3">
                          <h4 className="text-base font-bold text-foreground">{t('nav.ai_innovation_hub')}</h4>
                          <p className="text-foreground/70 text-xs leading-relaxed">Transform your business with cutting-edge AI and data analytics solutions.</p>
                          <Button
                            size="sm"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                            onClick={() => {
                              navigate('/data-and-ai');
                              setActiveMega(null);
                            }}
                          >
                            {t('nav.discover_ai_solutions')}
                          </Button>
                          <div className="pt-3 border-t border-border/50">
                            <p className="text-xs text-foreground/60">99.9% uptime guarantee</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Training Mega Menu */}
              <div className="relative mega-menu-container">
                <button 
                  onClick={() => toggleMegaMenu('training')}
                  className={`flex items-center space-x-1 hover:text-primary transition-colors font-medium ${
                    (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
                  }`}
                >
                  <span>{t('nav.lms')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeMega === 'training' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeMega === 'training' && typeof document !== 'undefined' && createPortal(
                  <div className="mega-menu-portal fixed top-16 left-0 right-0 w-screen bg-white border-t border-border shadow-2xl z-50">
                    <div className="w-full py-8">
                      <div className="grid grid-cols-3 gap-12 max-w-6xl mx-auto px-8">
                        {/* Learning Systems */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/71161c08-3920-48fd-aced-b2b0999ad040.png" 
                              alt="Learning Systems"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">{t('nav.learning_systems')}</h3>
                            <ul className="space-y-2">
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.lms_platform')}</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.content_development')}</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.professional_programs')}</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.compliance_training')}</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Specialized Training */}
                        <div className="space-y-4">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src="/lovable-uploads/ed58d01d-4b26-4d11-9c91-d54c61f0fde0.png" 
                              alt="Specialized Training"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-3 text-base">{t('nav.specialized_training')}</h3>
                            <ul className="space-y-2">
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.vocational_training')}</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.assessment_tools')}</Link></li>
<li><Link to="/lms" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.advisory_services')}</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Featured Content */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 space-y-3">
                          <h4 className="text-base font-bold text-foreground">{t('nav.training_excellence')}</h4>
                          <p className="text-foreground/70 text-xs leading-relaxed">Empower your workforce with comprehensive training solutions and professional development.</p>
                          <Button
                            size="sm"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                            onClick={() => {
                              navigate('/lms');
                              setActiveMega(null);
                            }}
                          >
                            {t('nav.start_training')}
                          </Button>
                          <div className="pt-3 border-t border-border/50">
                            <p className="text-xs text-foreground/60">25,000+ certified professionals</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>
              
              <Link to="/partners" className={`hover:text-primary transition-colors font-medium ${
                (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
              }`}>{t('nav.partners')}</Link>
              <Link to="/services" className={`hover:text-primary transition-colors font-medium ${
                (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
              }`}>{t('nav.services')}</Link>
              <Link to="/projects" className={`hover:text-primary transition-colors font-medium ${
                (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
              }`}>{t('nav.projects')}</Link>
              <Link to="/calculators" className={`hover:text-primary transition-colors font-medium ${
                (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
              }`}>{t('nav.calculators')}</Link>
              <Link to="/shop" className={`hover:text-primary transition-colors font-medium ${
                (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
              }`}>{t('nav.shop')}</Link>
              <Link to="/support" className={`hover:text-primary transition-colors font-medium ${
                (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
              }`}>{t('nav.support')}</Link>
              <Link to="/about" className={`hover:text-primary transition-colors font-medium ${
                (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
              }`}>{t('nav.about')}</Link>

              {/* News & Updates Mega Menu - last */}
              <div className="relative mega-menu-container">
                <button 
                  onClick={() => toggleMegaMenu('news')}
                  className={`flex items-center space-x-1 hover:text-primary transition-colors font-medium ${
                    (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
                  }`}
                >
                  <span>{t('nav.news_updates')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeMega === 'news' ? 'rotate-180' : ''
                  }`} />
                </button>
                {activeMega === 'news' && typeof document !== 'undefined' && createPortal(
                  <div className="mega-menu-portal fixed top-16 left-0 right-0 w-screen bg-white border-t border-border shadow-2xl z-50">
                    <div className="w-full py-8">
                      <div className="grid grid-cols-3 gap-12 max-w-6xl mx-auto px-8">
                        <div>
                          <h3 className="font-bold text-foreground mb-3 text-base">{t('nav.latest')}</h3>
                          <ul className="space-y-2">
                            <li><Link to="/news" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.news')}</Link></li>
                            <li><Link to="/events" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.events')}</Link></li>
                            <li><Link to="/case-studies" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.case_studies')}</Link></li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-3 text-base">{t('nav.highlights')}</h3>
                          <ul className="space-y-2">
                            <li><Link to="/news" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.product_releases')}</Link></li>
                            <li><Link to="/events" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.webinars_demos')}</Link></li>
                            <li><Link to="/case-studies" className="text-foreground/80 hover:text-primary transition-colors font-medium block text-sm">{t('nav.customer_impact')}</Link></li>
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 space-y-3">
                          <h4 className="text-base font-bold text-foreground">{t('nav.stay_informed')}</h4>
                          <p className="text-foreground/70 text-xs leading-relaxed">Get the latest company news, upcoming events, and real-world results.</p>
                          <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            {t('nav.explore_updates')}
                          </Button>
                          <div className="pt-3 border-t border-border/50">
                            <p className="text-xs text-foreground/60">Updated weekly</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>
            </nav>

            {/* Tesla-style Icons - Far Right */}
            <div className="hidden lg:flex items-center space-x-3 ml-auto">
              <Button variant="ghost" size="sm" className={`p-2 transition-colors ${
                (isScrolled || !isHomePage) ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
              }`} title="Support">
                <HelpCircle className="w-5 h-5" />
              </Button>
              <LanguageSwitcher
                variant="icon"
                className={`${(isScrolled || !isHomePage) ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'}`}
              />
              <RegionSelector
                variant="icon"
                className={`${(isScrolled || !isHomePage) ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'}`}
              />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className={`p-2 transition-colors ${
                      (isScrolled || !isHomePage) ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`} title="Account">
                      <UserCircle className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      if (profile?.user_role === 'admin') navigate('/admin-dashboard');
                      else if (profile?.user_role === 'partner') navigate('/partners-dashboard');
                      else navigate('/client-dashboard');
                    }}>
                      {t('nav.dashboard')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('nav.sign_out')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" className={`p-2 transition-colors ${
                  (isScrolled || !isHomePage) ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                }`} title="Account" asChild>
                  <Link to="/auth">
                    <UserCircle className="w-5 h-5" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile menu button and icons */}
            <div className="lg:hidden">
              {/* Menu button with text only */}
              <Button 
                variant="ghost" 
                className="px-3 py-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className={`text-sm font-medium transition-colors ${
                  (isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
                }`}>{t('nav.menu')}</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-border bg-background">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* REIS Dropdown */}
                <Collapsible 
                  open={mobileMenuState.reis} 
                  onOpenChange={(open) => setMobileMenuState(prev => ({ ...prev, reis: open }))}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-foreground hover:text-primary font-medium">
                    <span>{t('nav.reis')}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${mobileMenuState.reis ? 'rotate-90' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    <Link to="/reis" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.residential_solar')}</Link>
                    <Link to="/reis" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.commercial_solar')}</Link>
                    <Link to="/reis" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.battery_systems')}</Link>
                    <Link to="/reis" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.offshore_wind')}</Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* Data & AI Dropdown */}
                <Collapsible 
                  open={mobileMenuState.dataAi} 
                  onOpenChange={(open) => setMobileMenuState(prev => ({ ...prev, dataAi: open }))}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-foreground hover:text-primary font-medium">
                    <span>{t('nav.data_ai')}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${mobileMenuState.dataAi ? 'rotate-90' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    <Link to="/data-and-ai" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.ai_strategy')}</Link>
                    <Link to="/data-and-ai" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.data_analytics')}</Link>
                    <Link to="/data-and-ai" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.ai_products')}</Link>
                    <Link to="/data-and-ai" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.security_solutions')}</Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* LMS Dropdown */}
                <Collapsible 
                  open={mobileMenuState.lms} 
                  onOpenChange={(open) => setMobileMenuState(prev => ({ ...prev, lms: open }))}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-foreground hover:text-primary font-medium">
                    <span>{t('nav.lms')}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${mobileMenuState.lms ? 'rotate-90' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    <Link to="/lms" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.lms_platform')}</Link>
                    <Link to="/lms" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.content_development')}</Link>
                    <Link to="/lms" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.professional_programs')}</Link>
                    <Link to="/lms" className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary">{t('nav.vocational_training')}</Link>
                  </CollapsibleContent>
                </Collapsible>

                <Link to="/partners" className="block px-3 py-2 text-foreground hover:text-primary font-medium">{t('nav.partners')}</Link>
                <Link to="/services" className="block px-3 py-2 text-foreground hover:text-primary font-medium">{t('nav.services')}</Link>
                <Link to="/projects" className="block px-3 py-2 text-foreground hover:text-primary font-medium">{t('nav.projects')}</Link>
                <Link to="/calculators" className="block px-3 py-2 text-foreground hover:text-primary font-medium">{t('nav.calculators')}</Link>
                <Link to="/shop" className="block px-3 py-2 text-foreground hover:text-primary font-medium">{t('nav.shop')}</Link>
                <Link to="/support" className="block px-3 py-2 text-foreground hover:text-primary font-medium">{t('nav.support')}</Link>
                <Link to="/about" className="block px-3 py-2 text-foreground hover:text-primary font-medium">{t('nav.about')}</Link>
                
                {/* Tesla-style Icons in mobile menu */}
                <div className="border-t border-border mt-4 pt-4 px-3">
                  <div className="flex items-center justify-center space-x-6">
                    <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3" title="Support">
                      <HelpCircle className="w-6 h-6" />
                      <span className="text-xs">{t('nav.support')}</span>
                    </Button>
                    <div className="flex flex-col items-center space-y-1">
                      <LanguageSwitcher variant="icon" />
                      <span className="text-xs">{t('nav.language')}</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <RegionSelector variant="icon" />
                      <span className="text-xs">{t('nav.region')}</span>
                    </div>
                    {user ? (
                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex flex-col items-center space-y-1 p-3"
                          onClick={() => {
                            if (profile?.user_role === 'admin') navigate('/admin-dashboard');
                            else if (profile?.user_role === 'partner') navigate('/partners-dashboard');
                            else navigate('/client-dashboard');
                            setIsMenuOpen(false);
                          }}
                        >
                          <UserCircle className="w-6 h-6" />
                          <span className="text-xs">{t('nav.dashboard')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground"
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                        >
                          {t('nav.sign_out')}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 p-3" title="Account" asChild>
                        <Link to="/auth">
                          <UserCircle className="w-6 h-6" />
                          <span className="text-xs">{t('nav.account')}</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

    </>
  );
};

export default Header;