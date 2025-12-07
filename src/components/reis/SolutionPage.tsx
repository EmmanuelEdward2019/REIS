import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Zap, Battery, Waves, Sun, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import ConsultationModal from '@/components/common/ConsultationModal';

export interface Feature {
    title: string;
    description: string;
    icon: React.ElementType;
}

export interface Benefit {
    title: string;
    description: string;
}

export interface SolutionPageProps {
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    features: Feature[];
    benefits: Benefit[];
    category: 'Solar' | 'Storage' | 'Marine' | 'Analytics' | 'Security' | 'Training';
}

const SolutionPage: React.FC<SolutionPageProps> = ({
    title,
    subtitle,
    description,
    heroImage,
    features,
    benefits,
    category,
}) => {
    const [isConsultationOpen, setIsConsultationOpen] = useState(false);

    const getCategoryStyles = () => {
        switch (category) {
            case 'Solar':
                return {
                    icon: Sun,
                    gradient: 'from-orange-500/20 to-yellow-500/20',
                    textGradient: 'from-orange-600 to-yellow-600',
                    accent: 'text-orange-600',
                    bgAccent: 'bg-orange-100 dark:bg-orange-900/20',
                    button: 'bg-orange-600 hover:bg-orange-700',
                };
            case 'Storage':
                return {
                    icon: Battery,
                    gradient: 'from-emerald-500/20 to-teal-500/20',
                    textGradient: 'from-emerald-600 to-teal-600',
                    accent: 'text-emerald-600',
                    bgAccent: 'bg-emerald-100 dark:bg-emerald-900/20',
                    button: 'bg-emerald-600 hover:bg-emerald-700',
                };
            case 'Marine':
                return {
                    icon: Waves,
                    gradient: 'from-blue-500/20 to-cyan-500/20',
                    textGradient: 'from-blue-600 to-cyan-600',
                    accent: 'text-blue-600',
                    bgAccent: 'bg-blue-100 dark:bg-blue-900/20',
                    button: 'bg-blue-600 hover:bg-blue-700',
                };
            case 'Analytics':
                return {
                    icon: Zap, // Placeholder, will use specific icons in pages
                    gradient: 'from-purple-500/20 to-indigo-500/20',
                    textGradient: 'from-purple-600 to-indigo-600',
                    accent: 'text-purple-600',
                    bgAccent: 'bg-purple-100 dark:bg-purple-900/20',
                    button: 'bg-purple-600 hover:bg-purple-700',
                };
            case 'Security':
                return {
                    icon: CheckCircle2, // Placeholder
                    gradient: 'from-cyan-500/20 to-slate-500/20',
                    textGradient: 'from-cyan-600 to-slate-600',
                    accent: 'text-cyan-600',
                    bgAccent: 'bg-cyan-100 dark:bg-cyan-900/20',
                    button: 'bg-cyan-600 hover:bg-cyan-700',
                };
            case 'Training':
                return {
                    icon: Zap, // Placeholder
                    gradient: 'from-green-500/20 to-teal-500/20',
                    textGradient: 'from-green-600 to-teal-600',
                    accent: 'text-green-600',
                    bgAccent: 'bg-green-100 dark:bg-green-900/20',
                    button: 'bg-green-600 hover:bg-green-700',
                };
            default:
                return {
                    icon: Zap,
                    gradient: 'from-primary/20 to-primary/10',
                    textGradient: 'from-primary to-primary/80',
                    accent: 'text-primary',
                    bgAccent: 'bg-primary/10',
                    button: 'bg-primary hover:bg-primary/90',
                };
        }
    };

    const styles = getCategoryStyles();
    const CategoryIcon = styles.icon;

    return (
        <Layout>
            <ConsultationModal
                isOpen={isConsultationOpen}
                onClose={() => setIsConsultationOpen(false)}
                defaultInterest={`${category} Solutions`}
            />

            {/* Hero Section */}
            <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt={title}
                        className="w-full h-full object-cover scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-b ${styles.gradient} mix-blend-overlay`} />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-white">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20`}>
                                <CategoryIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-lg font-medium tracking-widest uppercase text-white/90">{category} Solutions</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                            {title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl font-light">
                            {subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" onClick={() => setIsConsultationOpen(true)} className={`${styles.button} text-white border-0 shadow-lg shadow-black/20 text-lg px-8 py-6 h-auto`}>
                                Get Started <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="text-blue-400 border-white/30 hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-6 h-auto hover:text-blue-300">
                                Learn More
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Overview Section */}
            <section className="py-24 bg-background relative">
                <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r ${styles.gradient}`} />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground leading-tight">
                                Revolutionizing Energy with <span className={`bg-clip-text text-transparent bg-gradient-to-r ${styles.textGradient}`}>{title}</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                {description}
                            </p>
                            <div className="flex gap-8 mt-8">
                                <div>
                                    <h4 className="text-3xl font-bold text-foreground mb-1">99%</h4>
                                    <p className="text-sm text-muted-foreground">Efficiency</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-foreground mb-1">24/7</h4>
                                    <p className="text-sm text-muted-foreground">Monitoring</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-foreground mb-1">50+</h4>
                                    <p className="text-sm text-muted-foreground">Projects</p>
                                </div>
                            </div>
                        </motion.div>
                        <div className="relative">
                            <div className={`absolute -inset-4 rounded-3xl opacity-30 blur-2xl bg-gradient-to-r ${styles.gradient}`} />
                            <img
                                src={heroImage}
                                alt="Overview"
                                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-video grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Key Features</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Advanced technology designed for maximum efficiency and reliability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group bg-background p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-border/50 hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 ${styles.bgAccent} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-7 h-7 ${styles.accent}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-background relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${styles.gradient} opacity-10 -skew-x-12 transform translate-x-1/4`} />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10">
                                <img
                                    src={heroImage}
                                    alt="Benefits"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-2/3 h-2/3 bg-muted rounded-3xl -z-0" />

                            <div className="absolute -bottom-8 -right-8 bg-background p-6 rounded-2xl shadow-xl border border-border/50 max-w-xs z-20 animate-bounce-slow">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-bold text-foreground">System Active</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Real-time performance monitoring included.
                                </p>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                                Why Choose Our {title}?
                            </h2>
                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex gap-5"
                                    >
                                        <div className={`mt-1 p-1 rounded-full ${styles.bgAccent}`}>
                                            <CheckCircle2 className={`w-5 h-5 ${styles.accent}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-90`} />
                <div className="absolute inset-0 bg-black/60" />
                <img src={heroImage} alt="Background" className="absolute inset-0 w-full h-full object-cover -z-10" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                        Ready to Power Your Future?
                    </h2>
                    <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                        Contact our experts today to design a custom {title.toLowerCase()} solution for your needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" onClick={() => setIsConsultationOpen(true)} className={`${styles.button} text-white border-0 text-lg px-10 py-6 h-auto shadow-xl`}>
                            Request Consultation
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-10 py-6 h-auto">
                            Download Brochure
                        </Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default SolutionPage;
