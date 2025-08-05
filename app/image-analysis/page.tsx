
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Image as ImageIcon, Upload, Hash, Info } from 'lucide-react';
import axios from 'axios';

export default function ImageAnalysisPage() {
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
      setError('Please upload an image file for forensic analysis.');
      return;
    }
    
    setError('');
    setResult(null);
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post('http://localhost:5001/analyze_image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      setResult(res.data);
    } catch (error: any) {
      console.error('Error:', error);
      setError('Error occurred while processing image analysis.');
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
              Forensic Image Analysis
            </h1>
            <p className="text-xl text-white/70">
              Forensic image analysis with metadata extraction
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
                  Upload Image for Forensic Analysis:
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
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
                      {file ? file.name : 'Click to upload image for analysis'}
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
                    <span>Analyzing Image...</span>
                  </div>
                ) : (
                  'Analyze Image'
                )}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          {result && result !== "Error occurred while processing." && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Forensic Analysis Results</h2>
              
              {/* Metadata Section */}
              <div className="glass-card">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Image Metadata (EXIF)</h3>
                </div>
                
                {!result.metadata ? (
                  <div className="text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4">
                    No metadata available
                  </div>
                ) : typeof result.metadata === 'string' ? (
                  <div className="text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl p-4">
                    {result.metadata}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                    {Object.entries(result.metadata || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-white/70">{key}:</span>
                        <span className="text-white">{value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hash Section */}
              <div className="glass-card">
                <div className="flex items-center space-x-2 mb-4">
                  <Hash className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Image Hash</h3>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <code className="text-cyan-400 break-all text-sm">
                    {result.image_hash || 'N/A'}
                  </code>
                </div>
              </div>

              {/* Tampering Detection */}
              <div className="glass-card">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Tampering Detection</h3>
                </div>
                
                <div className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl text-lg font-medium ${
                  result.tampering_detected === 'Yes'
                    ? 'bg-red-400/20 border border-red-400/30 text-red-400' 
                    : 'bg-green-400/20 border border-green-400/30 text-green-400'
                }`}>
                  {result.tampering_detected === 'Yes' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <CheckCircle className="w-6 h-6" />
                  )}
                  <span>
                    Status: {result.tampering_detected === 'Yes' ? 'Tampering Detected' : 'No Tampering Detected'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {result === "Error occurred while processing." && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
            >
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Failed to process image. Please ensure the file is a valid image format.</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
