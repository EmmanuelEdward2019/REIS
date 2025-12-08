import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Landmark,
  Shield,
  Code2,
  Database,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  Brain,
  Globe,
  Building2,
  Factory,
  Users,
  Target,
  MapPin,
  ChevronRight,
  Eye,
  ExternalLink,
  Phone,
  ChevronLeft,
  Handshake
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ConsultationModal from '@/components/common/ConsultationModal';

// Data & AI showcase images
import dataAiAnalytics from '@/assets/data-ai-analytics.jpg';
import dataAiMachineLearning from '@/assets/data-ai-machine-learning.jpg';
import dataAiSoftware from '@/assets/data-ai-software.jpg';
import dataAiSecurity from '@/assets/data-ai-security.jpg';
import dataAiTeam from '@/assets/data-ai-team.jpg';
import cognisianLogo from '@/assets/Conisian logo.jpg';

const DataAI = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState('energy');
  const navigate = useNavigate();

  // Core Services
  const coreServices = [
    {
      id: 'strategy',
      title: 'Data Strategy & Governance',
      icon: Target,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      points: [
        'Data maturity & value roadmaps, operating models, data catalog, lineage, stewardship',
        'Regulatory alignment (GDPR/NDPR), risk registers, DPIAs, data contracts & policies'
      ]
    },
    {
      id: 'engineering',
      title: 'Data Engineering & Platforms',
      icon: Database,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      points: [
        'Cloud data lakes/warehouses, streaming pipelines, IoT/SCADA integration',
        'Data quality frameworks, feature stores, APIs and event meshes'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Business Intelligence',
      icon: BarChart3,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      points: [
        'Descriptive/diagnostic/predictive/prescriptive analytics',
        'KPI scorecards, self-service BI, decision narratives & what-if tooling'
      ]
    },
    {
      id: 'aiml',
      title: 'AI & Machine Learning',
      icon: Brain,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      points: [
        'Time-series forecasting, NLP, computer vision, optimisation, intelligent automation',
        'MLOps: CI/CD for models, monitoring, drift detection, model registry, canary releases'
      ]
    },
    {
      id: 'software',
      title: 'Software & Data Products',
      icon: Code2,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      points: [
        'Secure web/mobile apps, agentic apps, domain APIs, DaaS products',
        'UX for operators/field staff; role-based access & audit trails'
      ]
    },
    {
      id: 'security',
      title: 'Cybersecurity & Data Privacy',
      icon: Shield,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      points: [
        'Security posture reviews, identity & access, secrets/vaults, key management',
        'Threat analytics/SOC integration, privacy-preserving analytics, de-identification'
      ]
    },
    {
      id: 'geospatial',
      title: 'Geo-spatial & Location Intelligence',
      icon: MapPin,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      points: [
        'GIS pipelines & map services, network/siting, route optimisation',
        'Impact/risk overlays for permitting, resilience and sustainability'
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare Data & AI',
      icon: HeartPulse,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      points: [
        'FHIR/HL7 interoperability, EMR/EHR connectors, PHI-safe marts',
        'Clinical documentation support (NLP), patient-journey orchestration',
        'Population health analytics, operations optimisation, human-in-the-loop safety & governance'
      ]
    }
  ];

  // Industry Solutions
  const industrySolutions = {
    energy: {
      title: 'Energy & Utilities',
      icon: Zap,
      color: 'text-yellow-500',
      useCases: [
        { title: 'Demand, generation & price forecasting', desc: 'Time-series models for load, renewables, and market prices; uncertainty bands for dispatch decisions.' },
        { title: 'DER & microgrid orchestration', desc: 'Control loops for solar/BESS/EV fleets; optimization for peak-shaving and arbitrage.' },
        { title: 'Asset health & predictive maintenance', desc: 'Anomaly detection on SCADA/IoT; failure-risk scoring; spares optimization.' },
        { title: 'Outage & field operations', desc: 'Crew routing, job bundling, vegetation risk, storm-impact prediction.' },
        { title: 'Grid planning & siting (Geo-AI)', desc: 'Capacity headroom, route corridors, and environmental-sensitivity overlays.' },
        { title: 'Sustainability & reporting', desc: 'Automated emissions accounting, methane/line-loss analytics, carbon-intensity dashboards.' }
      ],
      accelerators: ['Load/RES forecasting templates', 'SCADA feature library', 'Geo-AI siting toolkit', 'Carbon metrics pack']
    },
    public: {
      title: 'Public Sector (Ministries, Agencies, LGAs)',
      icon: Landmark,
      color: 'text-slate-500',
      flagship: 'Education Results Portal (state-wide) — three-tier access & audit',
      features: [
        { title: 'State Results Portal', desc: 'Secure candidate login (ID/DOB + PIN), printable result sheets.' },
        { title: 'School Dashboards', desc: 'Bulk upload, validation queues, resubmission, audit logs.' },
        { title: 'Ministry Admin', desc: 'Analytics (participation, access volumes, geo coverage), PIN inventory, approvals.' },
        { title: 'Support & Ticketing', desc: 'Inbound cases, SLA tracking; optional payments & reconciliation.' }
      ],
      kpis: ['Result access success rate', 'Time-to-publish', 'School onboarding coverage', 'Fraud/duplicate detection', 'Portal uptime']
    },
    manufacturing: {
      title: 'Manufacturing',
      icon: Factory,
      color: 'text-amber-500',
      useCases: [
        { title: 'Visual inspection & quality analytics', desc: 'CV for defect detection, yield uplift, root-cause analysis.' },
        { title: 'Predictive maintenance & energy optimization', desc: 'Sensor fusion, failure prediction, energy cost reduction.' },
        { title: 'Digital twin & process optimization', desc: 'Simulation + reinforcement/heuristic schedulers for throughput and takt time.' },
        { title: 'Supply-chain sensing', desc: 'ETA reliability, disruption risk, inventory and reorder policies, demand shaping.' },
        { title: 'Worker assistance & safety', desc: 'SOP copilots, hands-free instructions, safety-event detection.' }
      ],
      accelerators: ['Vision model starters', 'Condition-based maintenance pack', 'Energy-optimisation playbook']
    },
    healthcareInd: {
      title: 'Healthcare',
      icon: HeartPulse,
      color: 'text-red-500',
      subtitle: 'Patient-centred, safety-first delivery',
      useCases: [
        { title: 'Patient engagement & journey orchestration', desc: 'Unified data layer for outreach, reminders, adherence nudges, next-best-action.' },
        { title: 'Clinical documentation support', desc: 'NLP for summarization, coding assistance, evidence linking; quality gates and human review.' },
        { title: 'Population health & outcomes analytics', desc: 'Risk stratification, cohort discovery, readmission prediction, pathway optimization.' },
        { title: 'Operations optimization', desc: 'Theatre/bed capacity forecasting, staffing & rota optimization, inventory & cold-chain analytics.' },
        { title: 'Interoperability & data platforms', desc: 'FHIR/HL7 connectors, EMR/EHR integration, de-identification/pseudonymization pipelines.' },
        { title: 'Responsible AI in healthcare', desc: 'Bias testing, safety guardrails, governance workflows, audit packs, lifecycle monitoring.' }
      ],
      accelerator: 'Journey data model, consent & privacy services, analytics templates, low-code UI modules—HIPAA/GDPR-aware patterns that cut time-to-value from months to weeks.'
    },
    academia: {
      title: 'Academia (Universities, Polytechnics, Colleges)',
      icon: GraduationCap,
      color: 'text-blue-500',
      subtitle: 'Administrative automation: student registration to graduation',
      features: [
        { title: 'Admissions & Enrollment', desc: 'Applications, screening rules, offers/acceptance, fees, KYC.' },
        { title: 'Registration & Timetabling', desc: 'Course signup, clash checks, room & invigilation scheduling.' },
        { title: 'Payments & Bursary', desc: 'Tuition/levies, plans, arrears, bursary workflows.' },
        { title: 'Assessments & Results', desc: 'Grade capture, moderation, GPA/CGPA, transcripts.' },
        { title: 'Advising & Student Success', desc: 'Risk scoring, nudges, appointments, case notes.' },
        { title: 'Graduation & Clearance', desc: 'Program audit, fee clearance, certificate issuance, alumni handover.' },
        { title: 'Self-service Portal', desc: 'Status, results, dues, docs, letters, requests (web/mobile).' },
        { title: 'Analytics', desc: 'Cohort funnels (apply→admit→enroll), retention, pass rates, time-to-degree.' }
      ],
      automations: ['Document classification', 'Timetable optimisation', 'Plagiarism/NLP checks', 'Student-risk models', 'Chat/agent FAQ', 'EMIS/ERP integration', 'LMS (Moodle/Canvas)', 'Payment gateways', 'National ID']
    },
    smb: {
      title: 'Small & Midsize Businesses',
      icon: ShoppingCart,
      color: 'text-green-500',
      subtitle: 'Pharmacies, Supermarkets, Clinics, Garages',
      features: [
        { title: 'Inventory & Re-order', desc: 'SKUs, batches/expiry (pharma), suppliers, min/max, GRN.' },
        { title: 'Sales/POS', desc: 'Barcode/QR, discounts, refunds, loyalty.' },
        { title: 'Customers & CRM', desc: 'Profiles, visit history, issue tracking, feedback/NPS.' },
        { title: 'Procurement & Costing', desc: 'POs, landed costs, margins, vendor performance.' },
        { title: 'Financials (light)', desc: 'Sales tax, daily cash-up, bank rec exports.' },
        { title: 'Mobile App', desc: 'Stock-take, shelf audit, quick order, owner dashboard.' },
        { title: 'Reports & Alerts', desc: 'Stockouts, slow movers, shrinkage, expiry (pharma), basket analysis.' }
      ],
      aiAddons: ['Demand forecasting per SKU', 'Recommended order quantities', 'Basket affinity ("often bought together")', 'Churn propensity', 'Anomaly detection (cash/stock variances)']
    },
    other: {
      title: 'Other Sectors',
      icon: Building2,
      color: 'text-indigo-500',
      sectors: [
        { name: 'Financial Services', focus: 'Risk/fraud, CLV, collections' },
        { name: 'Transport & Logistics', focus: 'Routing, ETA, network planning' },
        { name: 'Retail/CPG', focus: 'Demand sensing, assortment, media mix' }
      ]
    }
  };

  // Delivery Model Steps (kept for reference)
  // Removed: deliverySteps, metricsStrip, businessOutcomes, engagementOptions

  // Client Projects
  const clientProjects = [
    { name: 'St. Athanasius Hospital', location: 'Uyo', url: '#', icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'Cardinal Ekandem Seminary', location: 'Uyo', url: '#', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Chinahub', location: 'E-commerce', url: 'https://chinahub.com', icon: ShoppingCart, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Frii Market', location: 'Marketplace', url: 'https://www.friimarket.com', icon: ShoppingCart, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Hope Polytechnic', location: 'Education', url: 'https://www.hopepolytechnic.edu.ng', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Morex Sphinx', location: 'Business', url: 'https://www.morexsphinx.com.ng', icon: Building2, color: 'text-slate-500', bg: 'bg-slate-500/10' },
    { name: 'Puccahub', location: 'E-commerce', url: 'https://puccahub.com', icon: ShoppingCart, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { name: 'Prime Internships', location: 'Education', url: 'https://prime-internships.com', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Frii Mart', location: 'Retail', url: 'https://friimart.com', icon: ShoppingCart, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { name: 'Wattrich Energy', location: 'Energy', url: 'https://www.wattrichenergy.com', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: '1st Priority Petroleum', location: 'Oil & Gas', url: 'https://www.1stprioritypetroleum.com', icon: Factory, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Comternet', location: 'Technology', url: 'https://www.comternet.com', icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-500/10' }
  ];

  // Reference Solutions - kept for potential future use
  // const referenceSolutions = [...];

  // Contact Information
  const contactOffices = [
    {
      name: 'Head Office (UK)',
      address: '4 Lords\' Close, Shenley Radlett, Hertfordshire WD7 9JE, United Kingdom',
      phone: '+44 (0) 7393 0778 30',
      type: 'uk'
    },
    {
      name: 'Nigeria HQ',
      address: '34 Idoro Road, Uyo, Akwa Ibom State, Nigeria',
      phone: '+234 (0) 813 824 6208',
      type: 'ng'
    },
    {
      name: 'Asaba Office',
      address: 'Urban Plaza, Okpanam Road, Asaba, Delta State, Nigeria',
      phone: '+234 (0) 816 500 0095',
      type: 'ng'
    }
  ];

  // Carousel state
  const [carouselIndex, setCarouselIndex] = React.useState(0);
  const clientsPerPage = 4;
  const totalPages = Math.ceil(clientProjects.length / clientsPerPage);

  const nextClients = () => {
    setCarouselIndex((prev) => (prev + 1) % totalPages);
  };

  const prevClients = () => {
    setCarouselIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <Layout>
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        defaultInterest="Data & AI Solutions"
      />

      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pb-20">
        {/* Vibrant Gradient Background - consistent throughout */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-950" />

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={dataAiSecurity}
            alt="Data & AI Security"
            className="w-full h-full object-cover opacity-25 mix-blend-overlay"
          />
        </div>

        {/* Animated Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-white text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="mb-8 bg-white/10 text-white border border-white/30 px-6 py-3 text-sm backdrop-blur-md">
                <Brain className="w-4 h-4 mr-2" />
                Data & Artificial Intelligence Division
              </Badge>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight">
              <span className="text-white">Data-Driven</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
                Intelligence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Transform your organization with AI-powered solutions that deliver real business outcomes
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pb-8">
              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="inline-flex items-center justify-center bg-white text-indigo-900 font-bold px-10 py-4 text-lg rounded-full shadow-xl shadow-white/20 hover:bg-blue-50 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('client-projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold px-10 py-4 text-lg rounded-full hover:bg-white hover:text-indigo-900 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                View Case Studies
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Division at a Glance */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-4">Division at a Glance</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Certified Excellence in Data & AI
            </h2>
            <p className="text-lg text-muted-foreground">
              Engagements are run under E&T's certified Integrated Management System (IMS) aligned to ISO 9001/14001/45001.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Target className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Outcome-led Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Measurable KPIs covering cost, time, quality, safety, and emissions.</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Responsible by Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Governance, privacy, observability, and audit from day one.</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Database className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Modern Platform Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sources → Lakehouse/Data Warehouse → Governance → ML/AI → Apps & Agents → MLOps</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Service Pillars</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Core Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              End-to-end capabilities spanning the entire data and AI lifecycle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 ${service.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <service.icon className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Partnership with Cognisian AI */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Handshake className="w-4 h-4 mr-2" />
                Strategic Partnership
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by World-Class AI Expertise</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Eagle & Thistle has partnered with Cognisian AI to deliver cutting-edge artificial intelligence solutions
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Cognisian Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-2xl p-3 shadow-xl">
                    <img src={cognisianLogo} alt="Cognisian AI" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Cognisian AI</h3>
                    <a
                      href="https://cognisian.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                    >
                      cognisian.ai <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  Cognisian is a boutique AI company founded by experts with decades of experience,
                  including PhDs and industry leaders, specializing in cutting-edge AI solutions.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="text-4xl font-bold text-blue-400 mb-2">150+</div>
                  <p className="text-gray-300">
                    Man-years of combined experience in data engineering and solving complex problems
                    using machine learning, neural networks, and advanced analytics across multiple industries.
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => window.open('https://cognisian.ai', '_blank')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 h-auto rounded-xl shadow-lg cursor-pointer w-full sm:w-auto"
                >
                  Visit Cognisian AI <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>

              {/* Partnership Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h4 className="text-xl font-semibold mb-6">What This Partnership Brings</h4>
                {[
                  { title: 'PhD-Level AI Research', desc: 'Access to cutting-edge research and methodologies from world-class AI scientists' },
                  { title: 'Deep Industry Experience', desc: 'Solutions informed by decades of real-world implementation across sectors' },
                  { title: 'Advanced ML & Neural Networks', desc: 'State-of-the-art machine learning and deep learning capabilities' },
                  { title: 'End-to-End Data Engineering', desc: 'Comprehensive data pipeline design, implementation, and optimization' }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-white">{benefit.title}</h5>
                      <p className="text-sm text-gray-400">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Industry Solutions</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Tailored for Your Sector</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deep domain expertise across industries with pre-built accelerators
            </p>
          </div>

          <Tabs value={activeIndustry} onValueChange={setActiveIndustry} className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-8 h-auto bg-transparent">
              {Object.entries(industrySolutions).map(([key, solution]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border"
                >
                  <solution.icon className="w-4 h-4 mr-2" />
                  {solution.title.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Energy & Utilities */}
            <TabsContent value="energy">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    <div>
                      <CardTitle className="text-2xl">Energy & Utilities</CardTitle>
                      <CardDescription>Powering the grid of tomorrow</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">Use Cases</h4>
                      <div className="space-y-4">
                        {industrySolutions.energy.useCases.map((uc, idx) => (
                          <div key={idx} className="border-l-2 border-yellow-500 pl-4">
                            <h5 className="font-medium text-foreground">{uc.title}</h5>
                            <p className="text-sm text-muted-foreground">{uc.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">Accelerators</h4>
                      <div className="flex flex-wrap gap-2">
                        {industrySolutions.energy.accelerators.map((acc, idx) => (
                          <Badge key={idx} variant="secondary" className="text-sm">{acc}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Public Sector */}
            <TabsContent value="public">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Landmark className="w-8 h-8 text-slate-500" />
                    <div>
                      <CardTitle className="text-2xl">Public Sector</CardTitle>
                      <CardDescription>Ministries, Agencies, LGAs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg mb-6">
                    <Badge className="mb-2">Flagship Solution</Badge>
                    <h4 className="font-semibold text-lg text-foreground">{industrySolutions.public.flagship}</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">Features</h4>
                      <div className="space-y-3">
                        {industrySolutions.public.features.map((f, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                            <div>
                              <span className="font-medium text-foreground">{f.title}:</span>{' '}
                              <span className="text-muted-foreground text-sm">{f.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">Typical KPIs</h4>
                      <div className="flex flex-wrap gap-2">
                        {industrySolutions.public.kpis.map((kpi, idx) => (
                          <Badge key={idx} variant="outline">{kpi}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manufacturing */}
            <TabsContent value="manufacturing">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Factory className="w-8 h-8 text-amber-500" />
                    <div>
                      <CardTitle className="text-2xl">Manufacturing</CardTitle>
                      <CardDescription>Industry 4.0 solutions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">Use Cases</h4>
                      <div className="space-y-4">
                        {industrySolutions.manufacturing.useCases.map((uc, idx) => (
                          <div key={idx} className="border-l-2 border-amber-500 pl-4">
                            <h5 className="font-medium text-foreground">{uc.title}</h5>
                            <p className="text-sm text-muted-foreground">{uc.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">Accelerators</h4>
                      <div className="flex flex-wrap gap-2">
                        {industrySolutions.manufacturing.accelerators.map((acc, idx) => (
                          <Badge key={idx} variant="secondary">{acc}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Healthcare */}
            <TabsContent value="healthcareInd">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HeartPulse className="w-8 h-8 text-red-500" />
                    <div>
                      <CardTitle className="text-2xl">Healthcare</CardTitle>
                      <CardDescription>{industrySolutions.healthcareInd.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {industrySolutions.healthcareInd.useCases.map((uc, idx) => (
                        <div key={idx} className="border-l-2 border-red-500 pl-4">
                          <h5 className="font-medium text-foreground">{uc.title}</h5>
                          <p className="text-sm text-muted-foreground">{uc.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                      <Badge className="mb-2 bg-red-100 text-red-700">Healthcare Accelerator</Badge>
                      <p className="text-sm text-muted-foreground">{industrySolutions.healthcareInd.accelerator}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Academia */}
            <TabsContent value="academia">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-blue-500" />
                    <div>
                      <CardTitle className="text-2xl">Academia</CardTitle>
                      <CardDescription>{industrySolutions.academia.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">Features</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {industrySolutions.academia.features.map((f, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                            <div>
                              <span className="font-medium text-foreground">{f.title}:</span>{' '}
                              <span className="text-muted-foreground text-sm">{f.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">Automations & Integrations</h4>
                      <div className="flex flex-wrap gap-2">
                        {industrySolutions.academia.automations.map((auto, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{auto}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SMB */}
            <TabsContent value="smb">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-green-500" />
                    <div>
                      <CardTitle className="text-2xl">Small & Midsize Businesses</CardTitle>
                      <CardDescription>{industrySolutions.smb.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">Lightweight CRM + Inventory + POS with feedback analytics</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">Features</h4>
                      <div className="space-y-3">
                        {industrySolutions.smb.features.map((f, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                            <div>
                              <span className="font-medium text-foreground">{f.title}:</span>{' '}
                              <span className="text-muted-foreground text-sm">{f.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4 text-foreground">AI Add-ons</h4>
                      <div className="flex flex-wrap gap-2">
                        {industrySolutions.smb.aiAddons.map((addon, idx) => (
                          <Badge key={idx} variant="secondary">{addon}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other Sectors */}
            <TabsContent value="other">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-indigo-500" />
                    <div>
                      <CardTitle className="text-2xl">Other Sectors</CardTitle>
                      <CardDescription>Expanding our expertise</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {industrySolutions.other.sectors.map((sector, idx) => (
                      <Card key={idx} className="border">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{sector.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{sector.focus}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Client Projects Carousel */}
      <section id="client-projects" className="py-20 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Portfolio</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Client Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by organizations across industries
            </p>
          </div>

          <div className="relative">
            {/* Carousel Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevClients}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${idx === carouselIndex ? 'bg-primary' : 'bg-muted'}`}
                  />
                ))}
              </div>
              <button
                onClick={nextClients}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Carousel Items */}
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {clientProjects.slice(carouselIndex * clientsPerPage, (carouselIndex + 1) * clientsPerPage).map((client, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                  <CardHeader className="text-center pb-2">
                    <div className={`w-16 h-16 ${client.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <client.icon className={`w-8 h-8 ${client.color}`} />
                    </div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>{client.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    {client.url !== '#' ? (
                      <a
                        href={client.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        Visit Website <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">Private Client</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise Showcase - Marquee Carousel */}
      <section className="py-16 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="text-center">
            <Badge className="mb-4">Our Expertise</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Delivering Excellence</h2>
          </div>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          <div className="flex animate-marquee gap-6" style={{ width: 'max-content' }}>
            {/* First set of images */}
            {[
              { src: dataAiAnalytics, label: 'Analytics & BI', title: 'Data-Driven Insights', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
              { src: dataAiMachineLearning, label: 'AI & Machine Learning', title: 'Intelligent Automation', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
              { src: dataAiSoftware, label: 'Software Products', title: 'Custom Applications', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
              { src: dataAiSecurity, label: 'Cybersecurity', title: 'Security Operations', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
              { src: dataAiTeam, label: 'Our Team', title: 'Collaborative Excellence', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
            ].map((item, idx) => (
              <div key={idx} className="relative w-80 h-56 flex-shrink-0 rounded-xl overflow-hidden group">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge className={`mb-2 ${item.color}`}>{item.label}</Badge>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {[
              { src: dataAiAnalytics, label: 'Analytics & BI', title: 'Data-Driven Insights', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
              { src: dataAiMachineLearning, label: 'AI & Machine Learning', title: 'Intelligent Automation', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
              { src: dataAiSoftware, label: 'Software Products', title: 'Custom Applications', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
              { src: dataAiSecurity, label: 'Cybersecurity', title: 'Security Operations', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
              { src: dataAiTeam, label: 'Our Team', title: 'Collaborative Excellence', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
            ].map((item, idx) => (
              <div key={`dup-${idx}`} className="relative w-80 h-56 flex-shrink-0 rounded-xl overflow-hidden group">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge className={`mb-2 ${item.color}`}>{item.label}</Badge>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSS for Marquee Animation */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>



      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Get In Touch</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Contact Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reach out to discuss your data and AI needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactOffices.map((office, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className={`w-5 h-5 ${office.type === 'uk' ? 'text-blue-500' : 'text-green-500'}`} />
                    <CardTitle className="text-lg">{office.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">{office.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-sm text-primary hover:underline">
                      {office.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Data into Value?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Partner with us to build data platforms and AI solutions that drive real business outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setIsConsultationOpen(true)} variant="secondary" className="text-primary font-bold text-lg px-10 py-6 h-auto shadow-xl">
              Schedule Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/support')}
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-10 py-6 h-auto"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DataAI;