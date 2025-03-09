// This is the updated React component with proper FastAPI integration
"use client";

import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X, 
  Sparkles, 
  Zap 
} from "lucide-react";
import axios from "axios";

// Define the FastAPI backend URL
const API_URL = "http://localhost:8000"; // Update this to your FastAPI server URL

export default function ATSChecker() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Handle file changes when user selects a file
  const handleFileChange = (event : any) => {
    const selectedFile = event.target?.files?.[0];
    if (selectedFile) {
      // Verify file is a PDF
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError("");
        console.log("Selected file:", selectedFile.name);
      } else {
        setError("Please upload a PDF file");
        setFile(null);
      }
    }
  };

  // Handle drag events
  const handleDrag = (e:any) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e : any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  // Trigger file input click
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit the resume to the FastAPI backend
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a resume file");
      return;
    }
    
    setUploading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      console.log("Uploading file:", file.name);
      const response = await axios.post(`${API_URL}/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log("Upload successful:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Failed to upload the file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setResult(null);
    setJobDescription("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <span>ATS Resume Checker</span>
          <Sparkles className="ml-2 h-5 w-5 text-yellow-400" />
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit}>
            {/* File Upload Section */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                dragActive 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                  : "border-gray-300 dark:border-gray-700"
              } ${
                file ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
              />

              {!file ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 p-4">
                    <Upload className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Upload your resume</h3>
                  <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                    Drag and drop your resume PDF file here, or click to browse.
                  </p>
                  <button
                    type="button"
                    onClick={onButtonClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Select File
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                      <FileText className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Job Description Section */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xl font-medium flex items-center">
                Job Description
                <Zap className="ml-2 h-5 w-5 text-yellow-400" />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Paste the job description to compare with your resume (optional)
              </p>
              <textarea
                placeholder="Paste job description here..."
                className="w-full min-h-[200px] rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || uploading}
              className={`mt-6 w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center ${
                !file || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Resume
                </>
              )}
            </button>
          </form>
        ) : (
          // Results display
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                New Analysis
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-medium mb-4 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Grammar Score
                </h3>
                <div className="flex items-center">
                  <div className="text-4xl font-bold">
                    {result.grammar.mistake_score}
                  </div>
                  <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    /100
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Found {result.grammar.error_count} grammatical errors
                </p>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h3 className="text-xl font-medium mb-4 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Resume Score
                </h3>
                <div className="flex items-center">
                  <div className="text-4xl font-bold">
                    {result.resume.resume_score}
                  </div>
                  <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    /100
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-medium mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Section Structure</span>
                    <span className="text-sm">{Math.round(result.resume.section_score)}/40</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${(result.resume.section_score / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Keywords</span>
                    <span className="text-sm">{result.resume.keyword_score}/30</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${(result.resume.keyword_score / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Bullet Points</span>
                    <span className="text-sm">{result.resume.bullet_score}/15</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-purple-500 h-2.5 rounded-full" 
                      style={{ width: `${(result.resume.bullet_score / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Length</span>
                    <span className="text-sm">{result.resume.length_score}/15</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${(result.resume.length_score / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}