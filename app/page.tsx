"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { Button } from '@/components/ui/button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 text-center">
          <motion.h1 
            className="text-5xl font-bold mb-4 text-indigo-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI-Powered Health Risk Assessment
          </motion.h1>
          <TextGenerateEffect words="Personalized insights for a healthier future" className="text-xl mb-8 text-indigo-700" />
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="Comprehensive Analysis"
            description="Evaluate multiple risk factors including medical history, lifestyle, and genetic predisposition."
            icon="🔬"
          />
          <FeatureCard
            title="Personalized Recommendations"
            description="Receive tailored insights and actionable steps to improve your health outcomes."
            icon="📊"
          />
          <FeatureCard
            title="AI-Driven Accuracy"
            description="Leverage advanced machine learning algorithms for precise risk assessments."
            icon="🧠"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-indigo-50">
        <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">How It Works</h2>
        <div className="max-w-4xl mx-auto">
          <ol className="relative border-l border-indigo-300">
            <TimelineItem 
              step={1} 
              title="Input Your Data"
              description="Securely provide your medical history, lifestyle information, and genetic data."
            />
            <TimelineItem 
              step={2} 
              title="AI Analysis"
              description="Our advanced algorithms process your information to identify potential health risks."
            />
            <TimelineItem 
              step={3} 
              title="Personalized Report"
              description="Receive a detailed health risk assessment with actionable recommendations."
            />
            <TimelineItem 
              step={4} 
              title="Ongoing Monitoring"
              description="Track your progress and receive updated insights as your health profile changes."
            />
          </ol>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center bg-white">
        <h2 className="text-3xl font-bold mb-4 text-indigo-900">Take Control of Your Health Today</h2>
        <p className="mb-8 text-indigo-700">Join thousands of users who have already benefited from our AI-powered health insights.</p>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition duration-300">
          Start Your Assessment
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 py-8 px-4 text-center text-white">
        <p>&copy; 2024 AI-Powered Health Risk Assessment. All rights reserved.</p>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-white relative group/card hover:shadow-xl transition-shadow duration-300 rounded-xl p-6 border border-indigo-100">
        <CardItem
          translateZ="50"
          className="text-4xl font-bold text-indigo-600 mb-2"
        >
          {icon}
        </CardItem>
        <CardItem
          as="h3"
          translateZ="60"
          className="text-xl font-bold text-indigo-900 mb-2"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="100"
          className="text-indigo-700 text-sm max-w-sm mt-2"
        >
          {description}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

interface TimelineItemProps {
  step: number;
  title: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ step, title, description }) => {
  return (
    <li className="mb-10 ml-6">
      <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-indigo-50 bg-indigo-600 text-white">
        {step}
      </span>
      <h3 className="flex items-center mb-1 text-lg font-semibold text-indigo-900">
        {title}
      </h3>
      <p className="mb-4 text-base font-normal text-indigo-700">{description}</p>
    </li>
  );
};

export default LandingPage;