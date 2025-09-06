import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  FileText, 
  Video, 
  Globe,
  ArrowRight,
  Headphones,
  Users,
  BookOpen
} from 'lucide-react';

const Support = () => {
  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: '24/7',
      response: 'Instant',
      action: 'Start Chat'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our technical experts',
      availability: 'Mon-Fri 8AM-6PM',
      response: 'Immediate',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Detailed technical assistance via email',
      availability: '24/7',
      response: '< 4 hours',
      action: 'Send Email'
    },
    {
      icon: Video,
      title: 'Video Call',
      description: 'Screen sharing and remote assistance',
      availability: 'By appointment',
      response: 'Scheduled',
      action: 'Book Call'
    }
  ];

  const resources = [
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Comprehensive guides and technical documentation',
      items: ['Installation Guides', 'API Documentation', 'Best Practices', 'Troubleshooting']
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      items: ['System Setup', 'Maintenance Procedures', 'Data Analysis', 'Performance Optimization']
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users and share experiences',
      items: ['User Discussions', 'Feature Requests', 'Success Stories', 'Expert Tips']
    },
    {
      icon: FileText,
      title: 'Knowledge Base',
      description: 'Searchable database of solutions and FAQs',
      items: ['Common Issues', 'Configuration Help', 'Performance Tips', 'Update Guides']
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with Eagle & Thistle solutions?',
      answer: 'Our team will conduct a comprehensive assessment of your energy needs and provide a customized implementation plan.'
    },
    {
      question: 'What kind of maintenance is required for renewable energy systems?',
      answer: 'Our systems are designed for minimal maintenance with predictive maintenance features and regular monitoring.'
    },
    {
      question: 'Can I integrate existing energy infrastructure with your solutions?',
      answer: 'Yes, our REIS division specializes in seamless integration with existing grid infrastructure and energy systems.'
    },
    {
      question: 'What training programs do you offer?',
      answer: 'We offer comprehensive certification programs through our LMS division, covering installation, maintenance, and optimization.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Headphones className="w-4 h-4 mr-2" />
            24/7 Support Available
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            We're Here to
            <span className="block text-primary">Help You Succeed</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Get the support you need to maximize your renewable energy investment. Our expert team 
            is available 24/7 to provide technical assistance, training, and guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Live Chat
            </Button>
            <Button variant="outline" size="lg">
              <Phone className="w-5 h-5 mr-2" />
              Call Support
            </Button>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Multiple Ways to Get Help
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the support channel that works best for you. Our expert team is ready 
              to assist with technical questions, troubleshooting, and optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {supportChannels.map((channel) => {
              const IconComponent = channel.icon;
              return (
                <Card key={channel.title} className="text-center hover-lift">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{channel.title}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Availability:</span>
                        <span className="font-medium">{channel.availability}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Response:</span>
                        <span className="font-medium text-primary">{channel.response}</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      {channel.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Send us a detailed message and we'll get back to you soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
                  <Input placeholder="How can we help you?" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Please describe your question or issue in detail..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button size="lg" className="w-full">
                  Send Message
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section className="section-padding bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Self-Service Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive library of resources, guides, and tutorials 
              to help you get the most out of your renewable energy systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card key={resource.title} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {resource.items.map((item) => (
                        <li key={item} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full">
                      Explore {resource.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about our renewable energy solutions and services.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All FAQs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="section-padding bg-gradient-to-r from-destructive/5 to-destructive/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Phone className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Emergency Support
          </h2>
          <p className="text-muted-foreground mb-8">
            For critical system issues or emergencies, our dedicated support team is available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="destructive">
              <Phone className="w-5 h-5 mr-2" />
              Emergency Hotline
            </Button>
            <div className="text-sm text-muted-foreground">
              Available 24/7 • Response within 15 minutes
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Support;