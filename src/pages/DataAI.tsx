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
  Cloud,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  Brain,
  Lock,
  Globe,
  Building2,
  Factory,
  Truck,
  Users,
  TrendingUp,
  Award,
  Clock,
  Target,
  Settings,
  FileText,
  Layers,
  MapPin,
  Activity,
  ChevronRight,
  Lightbulb,
  Wrench,
  Eye,
  Play,
  Gauge,
  ExternalLink,
  Phone,
  Mail,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroDataAnalytics from '@/assets/hero-data-analytics.jpg';
import ConsultationModal from '@/components/common/ConsultationModal';

// Data & AI showcase images
import dataAiAnalytics from '@/assets/data-ai-analytics.jpg';
import dataAiMachineLearning from '@/assets/data-ai-machine-learning.jpg';
import dataAiSoftware from '@/assets/data-ai-software.jpg';
import dataAiSecurity from '@/assets/data-ai-security.jpg';
import dataAiTeam from '@/assets/data-ai-team.jpg';

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

  // Delivery Model Steps
  const deliverySteps = [
    { num: 1, title: 'Discover & Baseline', desc: 'Objectives, KPIs, risks, data readiness', icon: Eye },
    { num: 2, title: 'Design', desc: 'Target architecture, governance, delivery plan, success metrics', icon: Lightbulb },
    { num: 3, title: 'Build', desc: 'Pipelines, features, models, secure product surfaces (apps/agents/APIs)', icon: Wrench },
    { num: 4, title: 'Validate', desc: 'Offline/online tests, human-in-the-loop reviews, privacy/safety checks', icon: CheckCircle2 },
    { num: 5, title: 'Deploy', desc: 'Hardening, cutover, change management, training', icon: Play },
    { num: 6, title: 'Operate', desc: 'MLOps, observability, SRE, SLA-backed support, continual improvement', icon: Settings }
  ];

  // Metrics
  const metricsStrip = [
    { value: '68', label: 'Projects Delivered' },
    { value: '94%', label: 'On-time Rate' },
    { value: '99.95%', label: 'Uptime' },
    { value: '≤30', label: 'Days to Pilot' },
    { value: '18%', label: 'Avg Cost Reduction' },
    { value: '12.3%', label: 'Model Accuracy Gain' }
  ];

  const businessOutcomes = [
    { sector: 'Academia', metrics: ['Registration cycle time↓', 'Retention↑', 'Transcript TAT↓', 'Self-service rate↑'] },
    { sector: 'Public Sector', metrics: ['Access success↑', 'Time-to-publish↓', 'School onboarding↑', 'Resolution time↓'] },
    { sector: 'SMB', metrics: ['Stockouts↓', 'Shrinkage↓', 'Expiry write-offs↓', 'Basket size↑'] },
    { sector: 'Energy & Utilities', metrics: ['Downtime↓', 'Forecast error↓', 'Truck rolls↓', 'tCO₂e avoided↑'] },
    { sector: 'Manufacturing', metrics: ['FPY↑', 'DPMO↓', 'OEE↑', 'Energy per unit↓'] },
    { sector: 'Healthcare', metrics: ['No-shows↓', 'Documentation time↓', 'Readmissions↓', 'Backlog clearance↓'] }
  ];

  const engagementOptions = [
    { title: 'Discovery & Roadmap Sprint', duration: '2–4 weeks', type: 'Fixed price' },
    { title: 'Build-Operate-Transfer (BOT)', duration: 'Custom', type: 'We build & run, then hand over' },
    { title: 'Managed Service', duration: 'Ongoing', type: 'SLA/SLO-backed ops with change budget' },
    { title: 'Outcome-based Pilots', duration: 'Variable', type: 'Shared risk with clear KPI gates' }
  ];

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

  // Reference Solutions
  const referenceSolutions = [
    { title: 'State Education Results Portal', desc: 'Student/School/Ministry roles, bulk uploads, immutable audit, SLA support', icon: Landmark, color: 'text-slate-500' },
    { title: 'Academia Student Lifecycle Portal', desc: 'Admissions→graduation workflows, GPA/CGPA, transcripts, risk nudges', icon: GraduationCap, color: 'text-blue-500' },
    { title: 'SMB CRM + Inventory + POS', desc: 'Barcode/QR, expiry & shrinkage analytics, demand forecasting, loyalty', icon: ShoppingCart, color: 'text-green-500' },
    { title: 'Energy & Utilities Forecasting & Orchestration', desc: 'RES/load forecasts, dispatch assistance, crew routing', icon: Zap, color: 'text-yellow-500' },
    { title: 'Manufacturing Computer Vision', desc: 'Defect detection, yield uplift, root-cause analytics', icon: Eye, color: 'text-amber-500' },
    { title: 'Healthcare Accelerator', desc: 'FHIR/HL7 data layer, documentation NLP, cohort analytics, safety guardrails', icon: HeartPulse, color: 'text-red-500' }
  ];

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

  // Annex A - KPI Definitions
  const kpiDefinitions = [
    { term: 'Time-to-Pilot', def: 'Median days from contract signature to first user pilot' },
    { term: 'On-Time Rate', def: '(# engagements delivered on/before promise) / (# engagements)' },
    { term: 'MAPE/MAE, F1/AUROC, mAP, Precision/Recall', def: 'Model metrics (per domain) with evaluation dataset IDs' },
    { term: 'Uptime', def: '90-day rolling availability = 1 − (downtime / total time)' },
    { term: 'tCO₂e avoided', def: '(kWh saved × grid emission factor) − project embodied carbon (optional)' }
  ];

  // Annex B - Security Controls
  const securityControls = [
    'Identity & Access (RBAC/ABAC), MFA, JIT access, periodic reviews',
    'Encryption (at rest/in transit), key rotation, HSM, secrets vault',
    'Network segmentation & zero-trust patterns',
    'Logging, SIEM hooks, incident playbooks, tabletop exercises',
    'DPIAs, consent registry, retention & erasure workflows, de-identification'
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
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src={heroDataAnalytics}
            alt="Data & AI"
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-background" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Data & Artificial Intelligence Division
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Turn Data into Decisions,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400">
                AI into Dependable Products
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed max-w-3xl mx-auto">
              We deliver strategy → platforms → analytics/ML → apps/agents → security & governance → ongoing operations as one accountable team.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="outline" className="text-gray-300 border-gray-500">
                <Globe className="w-3 h-3 mr-1" /> UK
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-gray-500">
                <Globe className="w-3 h-3 mr-1" /> Nigeria
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-gray-500">
                <Globe className="w-3 h-3 mr-1" /> EMEA
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setIsConsultationOpen(true)} className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto">
                Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/projects')}
                className="text-blue-400 border-white/30 hover:bg-white/10 text-lg px-8 py-6 h-auto hover:text-blue-300"
              >
                View Case Studies
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Metrics Strip */}
      <section className="py-8 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {metricsStrip.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-primary-foreground"
              >
                <div className="text-2xl md:text-3xl font-bold">{metric.value}</div>
                <div className="text-sm opacity-80">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                <Layers className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Modern Platform Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sources → Lakehouse/Data Warehouse → Governance → ML/AI → Apps & Agents → MLOps</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Showcase - Our Capabilities */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Expertise</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Delivering Excellence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our team brings data and AI solutions to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Analytics Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <img
                src={dataAiAnalytics}
                alt="Data Analytics Presentation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-2 bg-green-500/20 text-green-300 border-green-500/30">Analytics & BI</Badge>
                <h3 className="text-xl font-bold text-white">Data-Driven Insights</h3>
                <p className="text-sm text-gray-300">Transform raw data into actionable business intelligence</p>
              </div>
            </motion.div>

            {/* AI/ML Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <img
                src={dataAiMachineLearning}
                alt="AI and Machine Learning"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-2 bg-orange-500/20 text-orange-300 border-orange-500/30">AI & Machine Learning</Badge>
                <h3 className="text-xl font-bold text-white">Intelligent Automation</h3>
                <p className="text-sm text-gray-300">Building smart systems that learn and adapt</p>
              </div>
            </motion.div>

            {/* Software Products Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <img
                src={dataAiSoftware}
                alt="Software Development"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-2 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">Software Products</Badge>
                <h3 className="text-xl font-bold text-white">Custom Applications</h3>
                <p className="text-sm text-gray-300">Web, mobile, and agentic apps tailored to your needs</p>
              </div>
            </motion.div>

            {/* Security Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:col-span-2 lg:col-span-1"
            >
              <img
                src={dataAiSecurity}
                alt="Cybersecurity Team"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-2 bg-red-500/20 text-red-300 border-red-500/30">Cybersecurity</Badge>
                <h3 className="text-xl font-bold text-white">Security Operations</h3>
                <p className="text-sm text-gray-300">Proactive threat detection and incident response</p>
              </div>
            </motion.div>

            {/* Team Collaboration Image - Spans 2 columns on larger screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:col-span-2"
            >
              <img
                src={dataAiTeam}
                alt="Team Collaboration"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-2 bg-primary/20 text-primary-foreground border-primary/30">Our Team</Badge>
                <h3 className="text-xl font-bold text-white">Collaborative Excellence</h3>
                <p className="text-sm text-gray-300">Expert teams working together to deliver exceptional results</p>
              </div>
            </motion.div>
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

      {/* Delivery Model */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <Badge className="mb-4">Delivery Model</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How We Deliver</h2>
              <p className="text-lg text-muted-foreground">
                A structured approach from discovery to operations
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <img
                src={dataAiTeam}
                alt="Team Collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-medium">Expert teams delivering end-to-end solutions</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {deliverySteps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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

          <div className="bg-card border rounded-xl p-6">
            <h4 className="font-semibold mb-4 text-foreground">Artefacts Delivered</h4>
            <div className="flex flex-wrap gap-3">
              {['Solution blueprint', 'Data model & contracts', 'Security plan', 'Test & validation reports', 'Runbooks', 'KPI & impact dashboard', 'Training packs'].map((item, idx) => (
                <Badge key={idx} variant="outline" className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Responsible AI, Security & Privacy */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Trust & Safety</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Responsible AI, Security & Privacy</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <CardHeader>
                <Settings className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle>Governance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Model/agent inventory</li>
                  <li>• Approvals & versioning</li>
                  <li>• Gated releases & kill-switches</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-orange-200 dark:border-orange-900">
              <CardHeader>
                <Activity className="w-8 h-8 text-orange-500 mb-2" />
                <CardTitle>Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Fairness & explainability</li>
                  <li>• Privacy & performance drift</li>
                  <li>• Misuse prevention</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-red-200 dark:border-red-900">
              <CardHeader>
                <Lock className="w-8 h-8 text-red-500 mb-2" />
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Identity & access</li>
                  <li>• Encryption & secrets</li>
                  <li>• Logging & SIEM</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 dark:border-purple-900">
              <CardHeader>
                <Eye className="w-8 h-8 text-purple-500 mb-2" />
                <CardTitle>Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• DPIAs & consent</li>
                  <li>• De-identification</li>
                  <li>• Data residency & audit</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Metrics & Impact */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Metrics & Impact</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">What We Measure & Publish</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessOutcomes.map((outcome, idx) => (
              <Card key={idx} className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {outcome.sector}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {outcome.metrics.map((metric, mIdx) => (
                      <Badge key={mIdx} variant="outline" className="text-xs">{metric}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Users className="w-6 h-6 text-primary mb-2" />
                <CardTitle className="text-lg">Adoption & Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>• Monthly Active Users (MAU)</p>
                <p>• Net Promoter Score (NPS)</p>
                <p>• Assistant containment rate</p>
                <p>• Training & proficiency scores</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Gauge className="w-6 h-6 text-primary mb-2" />
                <CardTitle className="text-lg">Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>• MAPE/MAE (forecasting)</p>
                <p>• F1/AUROC (classification)</p>
                <p>• mAP/F1 (computer vision)</p>
                <p>• Precision/recall (NLP)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="w-6 h-6 text-primary mb-2" />
                <CardTitle className="text-lg">Sustainability</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>• tCO₂e avoided</p>
                <p>• Paperless transactions %</p>
                <p>• Site visits avoided</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Organisation & Standards */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Badge className="mb-4">Division Organisation</Badge>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Leadership & Governance</h3>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground">Leadership</h4>
                  <p className="text-sm text-muted-foreground">Director, Data & AI (reports to CEO)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Service Line Heads</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Strategy & Governance', 'Data Engineering', 'Analytics/BI', 'AI/ML', 'Product Engineering', 'Cybersecurity/Privacy', 'Geo-spatial'].map((line, idx) => (
                      <Badge key={idx} variant="secondary">{line}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Assurance</h4>
                  <p className="text-sm text-muted-foreground">Data Privacy Officer; Group HSEQ/IT; Corporate CFO/Director support</p>
                </div>
              </div>
            </div>
            <div>
              <Badge className="mb-4">Standards & IMS</Badge>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Integrated Management System</h3>
              <div className="space-y-3">
                {[
                  { code: 'E&T/IMS/QA/001', name: 'Quality Policy' },
                  { code: 'E&T/IMS/ENV/001', name: 'Environmental Plan' },
                  { code: 'E&T/IMS/HSE/001', name: 'HSE Manual' },
                  { code: 'E&T/DATA/001', name: 'Data Governance Framework' },
                  { code: 'E&T/LMS/001', name: 'Learning Quality Framework' }
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.code}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial & Engagement Options */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="relative rounded-2xl overflow-hidden aspect-video order-2 lg:order-1">
              <img
                src={dataAiAnalytics}
                alt="Data Analytics Presentation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-medium">Driving business outcomes with data-driven insights</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4">Engagement Options</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Work With Us</h2>
              <p className="text-lg text-muted-foreground">
                Flexible engagement models tailored to your needs
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {engagementOptions.map((option, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <Badge variant="outline">{option.duration}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{option.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Typical SLAs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="text-sm">
                  <Clock className="w-3 h-3 mr-1" /> 99.9–99.95% app uptime
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Zap className="w-3 h-3 mr-1" /> P1 ≤ 1h response
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Activity className="w-3 h-3 mr-1" /> Weekly error-budget reviews
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Brain className="w-3 h-3 mr-1" /> Monthly model-drift reviews
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Client Projects Carousel */}
      <section className="py-20 bg-background">
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

      {/* Reference Solutions */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Reference Solutions</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Annex Summaries</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pre-built solutions accelerating time-to-value
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {referenceSolutions.map((solution, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <solution.icon className={`w-6 h-6 ${solution.color}`} />
                      <CardTitle className="text-lg">{solution.title}</CardTitle>
                    </div>
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

      {/* Annexes */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Annex A - KPI Definitions */}
            <div>
              <Badge className="mb-4">Optional Annex A</Badge>
              <h3 className="text-2xl font-bold mb-6 text-foreground">KPI Definitions</h3>
              <p className="text-sm text-muted-foreground mb-4">For proposals & SLAs</p>
              <div className="space-y-3">
                {kpiDefinitions.map((kpi, idx) => (
                  <div key={idx} className="bg-card border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground text-sm mb-1">{kpi.term}</h4>
                    <p className="text-xs text-muted-foreground">{kpi.def}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Annex B - Security Controls */}
            <div>
              <Badge className="mb-4">Optional Annex B</Badge>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Security & Privacy Controls</h3>
              <div className="space-y-3">
                {securityControls.map((control, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-card border rounded-lg p-4">
                    <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{control}</p>
                  </div>
                ))}
              </div>
            </div>
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