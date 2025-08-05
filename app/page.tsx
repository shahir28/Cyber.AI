
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Link as LinkIcon, 
  FileText, 
  ShieldCheck, 
  Image as ImageIcon,
  Cpu,
  Zap,
  Eye,
  Lock
} from 'lucide-react';

const features = [
  {
    icon: LinkIcon,
    title: 'URL Analysis',
    description: 'Detect phishing and malicious URLs using advanced ML models',
    href: '/url-analysis',
    gradient: 'from-blue-400 to-cyan-400'
  },
  {
    icon: FileText,
    title: 'Log Analysis',
    description: 'Analyze system logs for security anomalies and threats',
    href: '/log-analysis',
    gradient: 'from-purple-400 to-pink-400'
  },
  {
    icon: ShieldCheck,
    title: 'File Integrity',
    description: 'Monitor and verify file integrity with hash analysis',
    href: '/file-integrity',
    gradient: 'from-green-400 to-emerald-400'
  },
  {
    icon: ImageIcon,
    title: 'Image Analysis',
    description: 'Forensic image analysis with metadata extraction',
    href: '/image-analysis',
    gradient: 'from-orange-400 to-red-400'
  }
];

const stats = [
  { icon: Cpu, label: 'AI Models', value: '4+' },
  { icon: Zap, label: 'Real-time Analysis', value: '99.9%' },
  { icon: Eye, label: 'Threat Detection', value: '24/7' },
  { icon: Lock, label: 'Security Level', value: 'Enterprise' }
];

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold glow-text">CYBER.AI</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex space-x-8"
            >
              {features.map((feature) => (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="text-white/80 hover:text-white transition-colors duration-300"
                >
                  {feature.title}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="glow-text">CYBER.AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
              Advanced AI-Integrated Cybersecurity Threat Detection Platform
            </p>
            <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
              Protect your digital assets with cutting-edge machine learning algorithms 
              for comprehensive security analysis and real-time threat detection.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="glass-button text-lg px-8 py-4">
                Get Started
              </button>
              <button className="glass-button text-lg px-8 py-4">
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card text-center group hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-4 group-hover:animate-pulse" />
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
              Security Solutions
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Comprehensive AI-powered cybersecurity tools for modern threats
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.href}>
                  <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:animate-pulse`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:glow-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold glow-text">CYBER.AI</span>
            </div>
            <p className="text-white/60">
              &copy; 2024 CYBER.AI - Advanced Cybersecurity Platform. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
