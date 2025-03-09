"use client";   

import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowUpCircle } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Simulate processing
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setResult("Your resume has been enhanced with professional formatting, keyword optimization, and improved content structure.");
      }, 2000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700"></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Upgrade Your Resume
            </h1>
            <p className="text-gray-300 text-lg">
              Transform your resume with AI-powered enhancements
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700">
            {/* Upload Section */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed border-gray-600 hover:border-purple-400 transition-colors cursor-pointer bg-gray-800/30"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-4 text-purple-400" />
                    <p className="mb-2 text-xl text-gray-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-400">
                      PDF, DOC, or DOCX (MAX. 10MB)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Status and Results Section */}
            {(file || processing || result) && (
              <div className="space-y-6">
                {/* File Info */}
                {file && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                    <FileText className="text-purple-400" />
                    <span className="text-gray-300">{file.name}</span>
                    <CheckCircle className="ml-auto text-green-400" />
                  </div>
                )}

                {/* Processing Status */}
                {processing && (
                  <div className="flex items-center justify-center space-x-4 p-6">
                    <ArrowUpCircle className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="text-lg text-purple-300">Processing your resume...</span>
                  </div>
                )}

                {/* Results */}
                {result && (
                  <div className="bg-gray-700/30 rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="text-green-400" />
                      <h3 className="text-xl font-semibold text-green-400">
                        Enhancement Complete!
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {result}
                    </p>
                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors">
                        Download Enhanced Resume
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-gray-400">
            <p className="flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Your files are processed securely and automatically deleted after 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;