"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoveRight, Heart, ShieldCheck, Brain, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { motion } from "framer-motion";

interface TextGenerateProps {
  words: string[];
  className?: string;
}

const TextGenerate: React.FC<TextGenerateProps> = ({ words, className = "" }) => {
  const [text, setText] = useState<string>('');
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const updateText = () => {
      if (isDeleting) {
        setText((prev) => prev.slice(0, -1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setText(currentWord.slice(0, text.length + 1));
        if (text === currentWord) {
          setIsDeleting(true);
        }
      }
    }

    const timeoutId = setTimeout(updateText, isDeleting ? 50 : 150);
    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, wordIndex, words]);

  return <span className={`font-semibold ${className}`}>{text}</span>;
}

const GridBackground: React.FC = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
    <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C7D2FE,transparent)]" />
  </div>
)

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <GridBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Ahead of Time,<br />
              <span className="text-blue-600">Ahead of Disease</span>
            </motion.h1>
            <motion.div 
              className="mt-3 max-w-md mx-auto text-xl sm:text-2xl text-gray-500 sm:mt-5 sm:max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TextGenerate
                words={["Precision Detection", "Better Health", "Proactive Care"]}
                className="text-blue-600"
              />
              <span> for a healthier tomorrow</span>
            </motion.div>
            <motion.div 
              className="mt-10 sm:flex sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href='/home'>
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg flex items-center justify-center">
                  Get Started
                  <MoveRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<ShieldCheck className="h-12 w-12 text-blue-500" />}
            title="Comprehensive Assessment"
            description="Evaluate multiple health factors for an all-encompassing risk profile."
          />
          <FeatureCard
            icon={<Brain className="h-12 w-12 text-blue-500" />}
            title="Data-Driven Insights"
            description="Get insights backed by data to help guide your health decisions."
          />
          <FeatureCard
            icon={<Heart className="h-12 w-12 text-blue-500" />}
            title="Custom Health Plans"
            description="Receive personalized health plans designed to optimize your well-being."
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Input Your Data", description: "Provide your health information and medical history." },
              { step: 2, title: "AI Analysis", description: "Our advanced AI analyzes your data for potential health risks." },
              { step: 3, title: "Get Your Results", description: "Receive a comprehensive report with actionable insights." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { name: "Sarah L.", quote: "HealthGuard helped me identify potential health risks I wasn&apos;t aware of. It&apos;s been a game-changer for my preventive care." },
            { name: "Michael R.", quote: "The personalized health plans are fantastic. I feel more in control of my health than ever before." },
          ].map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to take control of your health?</h2>
          <p className="text-xl mb-8">Join HealthGuard today and start your journey to a healthier future.</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">HealthGuard</h3>
              <p>Empowering you with the information you need to take control of your health.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul>
                <li><Link href="/about" className="text-gray-400 hover:underline">About Us</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:underline">Our Services</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:underline">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <ul className="flex space-x-4">
                <li><Link href="https://twitter.com" target="_blank" className="text-gray-400 hover:underline">Twitter</Link></li>
                <li><Link href="https://facebook.com" target="_blank" className="text-gray-400 hover:underline">Facebook</Link></li>
                <li><Link href="https://instagram.com" target="_blank" className="text-gray-400 hover:underline">Instagram</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} HealthGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center">
      {icon}
      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      <p className="text-gray-600 text-center mt-2">{description}</p>
    </div>
  );
};

export default LandingPage;
