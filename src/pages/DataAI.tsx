import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  HeartPulse,
  GraduationCap,
  Zap,
  Download,
  Calendar,
  Users,
  Rocket,
  Wrench,
  Headphones,
  Building2,
  Church,
  Stethoscope,
  Factory,
  CheckCircle2,
  Mail,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import ConsultationModal from '@/components/common/ConsultationModal';
import cognisianLogo from '@/assets/Conisian logo.jpg';

const DataAI = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Flagship programmes data
  const flagshipProgrammes = [
    {
      icon: HeartPulse,
      title: 'National & State Digital Health Platforms',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      bullets: [
        'Patient and facility registries, referral and reporting tools',
        'Dashboards for ministries, regulators and funders',
        'Co-developed with Cognisian AI and Nigerian stakeholders'
      ]
    },
    {
      icon: GraduationCap,
      title: 'Seminary & Education Digital Transformation',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      bullets: [
        'In partnership with Cardinal Ekandem Seminary, Uyo and other Catholic institutions',
        'Learning management, digital archives and basic AI tools for teaching and formation',
        'Training programmes for staff and seminarians on digital literacy and ethics'
      ]
    },
    {
      icon: Zap,
      title: 'REIS & Energy Data Platforms',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      bullets: [
        'Data models to design and monitor Renewable Energy Integrated Systems (REIS)',
        'Asset dashboards for solar, wind and hybrid mini-grids',
        'Integrations with field data, IoT and maintenance systems'
      ]
    }
  ];

  // How we work data
  const howWeWork = [
    { icon: Users, text: 'Co-design with partners – ministries, dioceses, hospitals, schools and asset owners' },
    { icon: Rocket, text: 'Rapid pilots – small, contained pilots to prove value and de-risk investment' },
    { icon: Wrench, text: 'Capacity building – training local teams to own and run the solutions' },
    { icon: Headphones, text: 'Long-term support – updates, analytics and technical assistance' }
  ];

  // Who we serve data
  const whoWeServe = [
    { icon: Building2, text: 'Public sector ministries and regulators' },
    { icon: Church, text: 'Faith-based institutions (e.g. dioceses, seminaries, Catholic schools)' },
    { icon: Stethoscope, text: 'Hospitals, health providers and insurers' },
    { icon: Factory, text: 'Energy companies and infrastructure operators' }
  ];

  return (
    <Layout>
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        defaultInterest="Data & AI Solutions"
      />

      {/* SECTION 0: HERO - Above the Fold */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              Data & AI for Sustainable Infrastructure and Social Impact
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"
            >
              Eagle & Thistle partners with Cognisian AI to deliver practical data and AI solutions for health, education and energy projects in Nigeria and beyond.
            </motion.p>

            {/* Partner Logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4 mb-10"
            >
              <img
                src="/lovable-uploads/76f8e1a6-f2ed-41a8-ac1e-dbcff484f1ea.png"
                alt="Eagle & Thistle"
                className="h-12 w-auto"
              />
              <span className="text-muted-foreground font-medium">in partnership with</span>
              <div className="h-12 w-12 bg-white rounded-lg shadow-sm p-1.5">
                <img
                  src={cognisianLogo}
                  alt="Cognisian AI"
                  className="h-full w-full object-contain"
                />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pb-16"
            >
              <a
                href="#"
                className="inline-flex items-center justify-center font-semibold px-8 py-6 h-auto text-base border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <Download className="mr-2 w-5 h-5" />
                Download Data & AI One-Pager
              </a>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 font-semibold px-8 py-6 h-auto text-base"
                onClick={() => setIsConsultationOpen(true)}
              >
                <Calendar className="mr-2 w-5 h-5" />
                Book a Discovery Call
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 1: WHO WE ARE */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Who We Are</h2>
            
            <p className="text-lg text-muted-foreground mb-4">
              Eagle & Thistle Data & AI turns complex problems in health, education and energy into practical, measurable solutions.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Our role is to bridge global AI capability with local context, infrastructure and delivery – starting in Nigeria and West Africa.
            </p>

            <p className="text-lg font-medium text-foreground mb-4">We focus on:</p>
            <ul className="space-y-3">
              {[
                { title: 'Digital health & registries', desc: 'clean, usable data for better care and planning' },
                { title: 'Education & formation', desc: 'digital and AI tools for seminaries and schools' },
                { title: 'Energy & REIS', desc: 'data platforms to design, monitor and optimise renewable systems' }
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground"><strong className="text-foreground">{item.title}</strong> – {item.desc}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: OUR PARTNERSHIP WITH COGNISIAN AI */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-8"
            >
              Our Partnership with Cognisian AI
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Cognisian */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
              <Card className="border-2 hover:border-primary/30 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-white rounded-lg shadow-sm p-1.5">
                      <img src={cognisianLogo} alt="Cognisian AI" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Cognisian AI</h3>
                      <p className="text-sm text-primary">Technology & Platform Partner</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Provides the AI platform, data architecture and product IP.
                  </p>
                </CardContent>
              </Card>
              </motion.div>

              {/* Eagle & Thistle */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
              <Card className="border-2 hover:border-primary/30 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="/lovable-uploads/76f8e1a6-f2ed-41a8-ac1e-dbcff484f1ea.png"
                      alt="Eagle & Thistle"
                      className="h-12 w-auto"
                    />
                    <div>
                      <h3 className="font-bold text-foreground">Eagle & Thistle</h3>
                      <p className="text-sm text-primary">Implementation & Domain Partner</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Leads on local design, regulation, deployment and long-term support in Nigeria and West Africa.
                  </p>
                </CardContent>
              </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-background border-2 rounded-xl p-6"
            >
              <p className="text-muted-foreground mb-4">
                Together we build scalable, secure and compliant solutions that are rooted in local reality but powered by global-class technology.
              </p>
              <p className="text-sm text-muted-foreground italic">
                This collaboration is already being applied in digital health strategy for Nigeria and other national-scale programmes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FLAGSHIP PROGRAMMES */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center"
            >
              Flagship Programmes
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {flagshipProgrammes.map((programme, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-2 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${programme.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <programme.icon className={`w-6 h-6 ${programme.color}`} />
                      </div>
                      <h3 className="font-bold text-foreground mb-4">{programme.title}</h3>
                      <ul className="space-y-2">
                        {programme.bullets.map((bullet, bidx) => (
                          <li key={bidx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-muted-foreground text-sm">
              For detailed programme briefs, please contact us or request our project deck.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW WE WORK */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-8"
            >
              How We Work
            </motion.h2>

            <div className="space-y-4">
              {howWeWork.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 bg-background rounded-xl border"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground pt-2">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHO WE SERVE / PARTNERS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-8"
            >
              Who We Work With
            </motion.h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {whoWeServe.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6"
            >
              <p className="text-foreground font-medium">
                <span className="text-primary font-semibold">Selected collaborations include:</span> Cognisian AI (technology partner), Cardinal Ekandem Seminary, Uyo (education partner) and other national stakeholders.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CALL TO ACTION */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's explore a pilot together</h2>
            
            <p className="text-lg opacity-90 mb-3">
              Transform a health, education or energy project using data & AI
            </p>
            <p className="text-lg opacity-90 mb-8">
              Start with a 90-minute discovery session (online or in person)
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold px-8 py-6 h-auto text-base text-primary"
                onClick={() => setIsConsultationOpen(true)}
              >
                <Calendar className="mr-2 w-5 h-5" />
                Book a Call
              </Button>
              <a
                href="mailto:info@eagleandthistlegroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-semibold px-8 py-6 h-auto text-base bg-white text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
              >
                <Mail className="mr-2 w-5 h-5" />
                info@eagleandthistlegroup.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default DataAI;
