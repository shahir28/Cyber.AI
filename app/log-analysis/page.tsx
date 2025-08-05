
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, FileText, Upload } from 'lucide-react';
import axios from 'axios';

export default function LogAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a log file for analysis.');
      return;
    }
    
    setError('');
    setResult(null);
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post('http://localhost:5001/analyze_logs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResult(res.data);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'An unexpected error occurred during analysis');
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
              Security Log Analysis
            </h1>
            <p className="text-xl text-white/70">
              Analyze system logs for security anomalies and threats
            </p>
          </motion.div>

          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3">
                  Upload Security Log File:
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".log,.txt"
                    disabled={loading}
                    className="sr-only"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-cyan-400/50 transition-all duration-300 bg-white/5 hover:bg-white/10"
                  >
                    <Upload className="w-8 h-8 text-white/60 mb-2" />
                    <span className="text-white/80">
                      {file ? file.name : 'Click to upload log file (.log, .txt)'}
                    </span>
                  </label>
                </div>
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
                disabled={loading || !file}
                className="w-full glass-button text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing Logs...</span>
                  </div>
                ) : (
                  'Analyze Security Logs'
                )}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Security Analysis Results</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white/60 text-sm">Total Logs Processed</div>
                  <div className="text-2xl font-bold text-green-400">{result.total_logs}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white/60 text-sm">Security Anomalies</div>
                  <div className={`text-2xl font-bold ${result.total_anomalies > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {result.total_anomalies}
                  </div>
                </div>
              </div>

              {result.total_anomalies > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="text-xl font-bold">Security Threats Detected</h3>
                  </div>
                  <div className="space-y-3">
                    {result.anomalies.map((anomaly: any, index: number) => (
                      <div key={index} className="bg-red-400/10 border border-red-400/20 rounded-xl p-4">
                        <div className="text-white font-medium mb-2">
                          Line {anomaly.line_number}
                        </div>
                        <div className="text-red-400/80">
                          {anomaly.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-400 mb-2">
                    No Security Threats Detected
                  </h3>
                  <p className="text-white/70">
                    Your log file appears to be clean with no suspicious activities detected.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
