
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';

export default function URLAnalysisPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL to analyze.');
      return;
    }
    
    setError('');
    setLoading(true);
    setResult(null);
    
    try {
      const res = await axios.post(
        'http://localhost:5000/detect_phishing',
        { urls: [trimmedUrl] },
        { 
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      const response = res.data[0];
      setResult(response.label === 'bad' ? 'Bad (Phishing Detected)' : 'Good (Safe URL)');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to analyze URL. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold glow-text">CYBER.AI</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center mx-auto mb-6">
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
              URL Security Analysis
            </h1>
            <p className="text-xl text-white/70">
              Detect phishing and malicious URLs using advanced ML models
            </p>
          </motion.div>

          {/* Analysis Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3">
                  Enter URL for Security Analysis:
                </label>
                <textarea
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com or paste suspicious URL here..."
                  rows={4}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                />
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}
              
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="w-full glass-button text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing URL...</span>
                  </div>
                ) : (
                  'Analyze URL'
                )}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-6">Security Analysis Result</h2>
                
                <div className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl text-lg font-medium ${
                  result.includes('Good') 
                    ? 'bg-green-400/20 border border-green-400/30 text-green-400' 
                    : 'bg-red-400/20 border border-red-400/30 text-red-400'
                }`}>
                  {result.includes('Good') ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                  <span>{result}</span>
                </div>
                
                {result.includes('Good') ? (
                  <p className="text-white/70 mt-4">
                    This URL appears to be safe and legitimate.
                  </p>
                ) : (
                  <div className="mt-4 space-y-2">
                    <p className="text-white/70">
                      Warning: This URL has been flagged as potentially malicious.
                    </p>
                    <p className="text-red-400/80 text-sm">
                      Do not visit this URL or enter any personal information.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
