import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
  ArrowRight, Target, Users, Award, Globe, Leaf, Shield, Sun, Wind, Battery,
  Zap, Building2, Factory, Truck, HeartPulse, GraduationCap, ShoppingCart,
  Phone, Wifi, Server, MapPin, CheckCircle2, Lightbulb, Settings, FileText,
  BarChart3, Eye, Play, Wrench, ClipboardCheck, ChevronRight, Mail, Anchor,
  Droplets, Car, Home, Hospital, Warehouse, Plane, Landmark, Heart, Tractor,
  Hotel, BookOpen, Monitor
} from 'lucide-react';
import ConsultationModal from '@/components/common/ConsultationModal';

// Import images
import heroSolarInstallation from '@/assets/hero-solar-installation.jpg';
import heroRenewableIntegration from '@/assets/hero-renewable-integration.jpg';
import heroEnergyStorage from '@/assets/hero-energy-storage.jpg';
import heroTrainingFacility from '@/assets/hero-training-facility.jpg';
import dataAiTeam from '@/assets/data-ai-team.jpg';
import dataAiAnalytics from '@/assets/data-ai-analytics.jpg';

const About = () => {
  const navigate = useNavigate();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // What We Do sections
  const whatWeDo = [
    {
      id: 'reis',
      title: 'REIS: System Design, EPC & O&M',
      icon: Sun,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      items: [
        { label: 'Hybrid system design', desc: 'Solar PV • Wind • Tidal/marine • Hydrogen (electrolyzers + fuel cells) • Battery storage (BESS) • EV charging' },
        { label: 'Controls & protection', desc: 'Load management, SCADA/IoT telemetry, grid code compliance, protection selectivity, safety cases' },
        { label: 'Delivery', desc: 'Feasibility → Detailed design → Procurement/OEM management → Installation/commissioning → O&M & asset performance' }
      ]
    },
    {
      id: 'digital',
      title: 'Digital & Analytics (Data & AI)',
      icon: BarChart3,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      items: [
        { label: 'E&T Carbon Emission Tracker', desc: 'Live clean-energy generation, CO₂ avoided, carbon-credit potential, and cost savings—integrated with REIS systems and sensors.' },
        { label: 'Dashboards & decision tools', desc: 'Sizing/configuration wizards, LCOE/TCO models, performance alarms, and sustainability reporting.' }
      ]
    },
    {
      id: 'training',
      title: 'Training & Certification (LMS)',
      icon: GraduationCap,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      items: [
        { label: 'Professional installer training', desc: 'Induction, PV/BESS/EV/mini-grid modules, safety & compliance, assessed to activation.' },
        { label: 'Customer & operator training', desc: 'Practical operations, HSE, and performance optimization.' }
      ]
    },
    {
      id: 'partners',
      title: 'Partner Programs',
      icon: Users,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      items: [
        { label: 'Sales Partners (SSR/Introducers)', desc: 'KPI-tracked, region-capped, with clear commissions and exclusivity based on performance.' },
        { label: 'Installer Partners', desc: 'Competency-verified (qualifications, experience, insurance, RAMS, calibrated tools), audited on initial jobs and periodically thereafter.' }
      ]
    }
  ];

  // Solutions & Products
  const solutions = [
    { icon: Building2, title: 'Turnkey REIS Projects', desc: 'Residential, C&I, estates/campuses, hospitals, telecom BTS, industrial, and offshore/marine assets.' },
    { icon: Zap, title: 'Micro Solutions Bundles', desc: 'Nano 500W • Micro 1kVA • Retail 2.5kVA • Pro 5kVA (PV + inverter/charger + storage + BOS + install).' },
    { icon: Battery, title: 'Energy Storage', desc: 'LFP/Li-ion BESS, high-voltage stacks, portable power; Hydrogen for long-duration/backup.' },
    { icon: Sun, title: 'Generation', desc: 'High-efficiency PV panels, hybrid/on-grid/off-grid inverters, small wind turbines, river/tidal micro-current kits.' },
    { icon: Car, title: 'EV Charging', desc: 'AC 7–22 kW, DC fast, OCPP back-office and load management.' },
    { icon: Settings, title: 'Installation Accessories', desc: 'Cables, MC4, combiner boxes, isolators, MCB/RCBO/MCCB, SPDs, breaker boxes, busbars, earthing/lightning, voltage regulators, ATS.' },
    { icon: Lightbulb, title: 'Energy-efficient Appliances', desc: 'LED lighting, BLDC/DC fans, inverter A/C & heat-pump water heaters, DC/solar fridges/freezers, solar pumps, DC TVs/routers.' }
  ];

  // Sectors we serve
  const sectors = [
    { icon: Home, title: 'Residential & Estates', desc: 'Resilient self-consumption, smart backup, EV-ready homes and estates.' },
    { icon: Building2, title: 'Commercial Real Estate', desc: 'Peak-shaving, rooftop PV, BESS, and building electrification.' },
    { icon: ShoppingCart, title: 'Retail & SMEs', desc: 'Micro-solutions for shops, PoS hubs, barbing shops, clinics, and small factories.' },
    { icon: Hotel, title: 'Hospitality & Leisure', desc: 'Hotels, resorts, restaurants, event venues with quiet, efficient backup.' },
    { icon: Hospital, title: 'Healthcare & Life Sciences', desc: 'Hospitals, clinics, labs with critical-power continuity and verified CO₂ cuts.' },
    { icon: GraduationCap, title: 'Education', desc: 'Reliable power for classrooms, labs, ICT suites, and hostels.' },
    { icon: Tractor, title: 'Agriculture & Agri-processing', desc: 'Solar irrigation, efficient pumps, cold rooms, and productive-use appliances.' },
    { icon: Wifi, title: 'Telecom & Digital Infrastructure', desc: 'BTS/tower sites, edge facilities, and UPS/ESS for network uptime.' },
    { icon: Server, title: 'Data Centres & Tech Campuses', desc: 'Hybridization, grid support, and high-availability ESS with analytics.' },
    { icon: Factory, title: 'Manufacturing & Industrial', desc: 'Process loads, compressors, and HVAC optimization with hybrid REIS.' },
    { icon: Anchor, title: 'Oil & Gas / Marine & Offshore', desc: 'Hybridization of offshore assets (FPSO), diesel displacement, flare-cut support, marine-grade systems.' },
    { icon: Landmark, title: 'Public Sector & Local Authorities', desc: 'Councils/LGAs, public buildings, street lighting, and mini-grid programmes.' },
    { icon: Heart, title: 'NGOs & Humanitarian', desc: 'Clinic power, cold-chain, community mini-grids, and pay-as-you-go models.' },
    { icon: Plane, title: 'Transport, Ports & Logistics', desc: 'Ports/harbours, airports, rail depots, e-fleet depots, and EV charging networks.' },
    { icon: Landmark, title: 'Financial Services', desc: 'Resilient branches, ATMs, and multi-site energy management.' }
  ];

  // How We Deliver steps
  const deliverySteps = [
    { num: 1, title: 'Assess', icon: Eye, desc: 'Loads, site constraints, safety & regulatory context' },
    { num: 2, title: 'Model', icon: BarChart3, desc: 'Scenarios (HOMER Pro / MATLAB-Simulink style), LCOE/TCO, risk & HAZOP inputs' },
    { num: 3, title: 'Engineer', icon: Settings, desc: 'Architecture, protection/earthing, grid code & marine standards where applicable' },
    { num: 4, title: 'Procure', icon: ClipboardCheck, desc: 'OEM qualification, logistics, QA/QC' },
    { num: 5, title: 'Build & Commission', icon: Wrench, desc: 'Method statements, test sheets, sign-off packs' },
    { num: 6, title: 'Operate', icon: Play, desc: 'Telemetry, O&M, performance guarantees, carbon & cost reporting' }
  ];

  // Why Eagle & Thistle
  const whyUs = [
    { icon: Zap, title: 'Integrated by Design', desc: 'Multi-resource hybrids (solar/wind/tidal/hydrogen + storage) tuned to your loads and site realities.' },
    { icon: BarChart3, title: 'Measurable Impact', desc: 'Live CO₂ avoided, kWh generated, and savings via the E&T Carbon Emission Tracker.' },
    { icon: Shield, title: 'Bankable Engineering', desc: 'Protection selectivity, grid integration, marine/offshore diligence, and audited documentation.' },
    { icon: Globe, title: 'Capability Where It Counts', desc: 'UK–Nigeria delivery, vetted partners, and training to keep systems safe, compliant, and performing.' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={heroSolarInstallation}
            alt="Solar Installation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30">
              About Eagle & Thistle Ltd
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Engineering-Led
              <span className="block text-primary">Clean Energy</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Delivering Renewable Energy Integrated Systems (REIS) for homes, businesses, communities,
              and hard-to-abate sectors such as offshore oil & gas across the UK and Africa.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Badge variant="outline" className="text-white border-white/30 px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" /> London
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" /> Abuja
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" /> Uyo
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setIsConsultationOpen(true)}>
                Book a Site Survey <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => navigate('/partners')}>
                Join as Partner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Who We Are</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Engineering Excellence in Clean Energy</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Eagle & Thistle is an engineering-led clean-energy company delivering Renewable Energy Integrated Systems (REIS)
                for homes, businesses, communities, and hard-to-abate sectors such as offshore oil & gas.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We combine solar, wind, tidal, hydrogen, and advanced storage with smart controls, data & AI, training,
                and an audited installer network to design, build, and operate reliable low-carbon power—on-grid or off-grid—across the UK and Africa.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">REIS</p>
                  <p className="text-xs text-muted-foreground">Engineering & EPC</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Data & AI</p>
                  <p className="text-xs text-muted-foreground">Analytics</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Training</p>
                  <p className="text-xs text-muted-foreground">LMS</p>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={heroRenewableIntegration} alt="Renewable Integration" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-medium">Multi-resource hybrid systems across UK and Africa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <Target className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Make clean, dependable energy practical, measurable, and investable—from micro solutions for SMEs
                  to multi-MW hybrid systems for industry and offshore operations.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <Eye className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A world where every asset—home, clinic, farm, factory, and floating platform—can run on optimized mixes
                  of renewable energy, with live visibility of performance, verified CO₂ reductions, and bankable economics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">What We Do</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive clean energy solutions from design to operation
            </p>
          </div>

          <Tabs defaultValue="reis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {whatWeDo.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="text-sm">
                  <item.icon className={`w-4 h-4 mr-2 ${item.color}`} />
                  {item.id === 'reis' ? 'REIS' : item.id === 'digital' ? 'Data & AI' : item.id === 'training' ? 'Training' : 'Partners'}
                </TabsTrigger>
              ))}
            </TabsList>
            {whatWeDo.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {item.items.map((sub, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-foreground">{sub.label}:</span>{' '}
                            <span className="text-muted-foreground">{sub.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Solutions & Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <Badge className="mb-4">Solutions & Products</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Comprehensive Energy Solutions</h2>
              <p className="text-lg text-muted-foreground">
                From turnkey projects to micro solutions, we offer the full spectrum of clean energy products and services.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <img src={heroEnergyStorage} alt="Energy Storage" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-medium">Advanced battery storage and hybrid systems</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {solutions.map((solution, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <solution.icon className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="text-base">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{solution.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors We Serve */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Industries</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Sectors We Serve</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Delivering clean energy solutions across diverse industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sectors.map((sector, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="p-4 bg-muted/50 rounded-xl hover:bg-primary/10 transition-colors text-center h-full">
                  <sector.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-medium text-foreground mb-1">{sector.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{sector.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Deliver */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <Badge className="mb-4">Our Method</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How We Deliver</h2>
              <p className="text-lg text-muted-foreground">
                A structured approach ensuring quality, safety, and performance at every stage.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <img src={dataAiTeam} alt="Team Collaboration" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-medium">Expert teams delivering end-to-end solutions</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {deliverySteps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        {step.num}
                      </div>
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                HSEQ Commitment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our procedures align with recognized quality, environment, and safety best practices; site activities follow
                RAMS, Working at Height, LOTO, and applicable national codes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Eagle & Thistle */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Advantage</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Eagle & Thistle</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 text-center hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={dataAiAnalytics} alt="Leadership" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div>
              <Badge className="mb-4">Leadership & Governance</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Founded on Engineering Excellence</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Founded and led by <strong className="text-foreground">Francis Udom</strong>, Chartered Marine & Mechanical Engineer
                and researcher in hybrid renewable systems, E&T blends deep engineering with pragmatic delivery and local
                capacity building across the UK and Nigeria.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-muted-foreground">Chartered Marine & Mechanical Engineer</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-muted-foreground">Researcher in hybrid renewable systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-muted-foreground">UK–Nigeria delivery expertise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Teams - Placeholder */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our People</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Teams</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated professionals driving our mission forward
            </p>
          </div>

          <Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/20">
            <CardContent className="py-16 text-center">
              <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Staff profiles coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4">Get Started</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Ready to Power Your Future?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you need a site survey, want to design your system, or join as a partner—we're here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button size="lg" onClick={() => navigate('/reis')}>
                <Settings className="w-5 h-5 mr-2" /> Design Your System
              </Button>
              <Button size="lg" variant="outline" onClick={() => setIsConsultationOpen(true)}>
                <MapPin className="w-5 h-5 mr-2" /> Book a Site Survey
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/partners')}>
                <Users className="w-5 h-5 mr-2" /> Join as Partner
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="py-6 text-center">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">London</h3>
                  <p className="text-sm text-muted-foreground">Head Office, UK</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6 text-center">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Abuja</h3>
                  <p className="text-sm text-muted-foreground">Nigeria HQ</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6 text-center">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Uyo</h3>
                  <p className="text-sm text-muted-foreground">Regional Office</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </Layout>
  );
};

export default About;