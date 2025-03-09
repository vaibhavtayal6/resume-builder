"use client"

import React, { useState, useRef, useEffect } from "react"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X, Moon, Sun, Sparkles, Zap, Award } from "lucide-react"
import ATSChecker from "@/components/ATSChecker"
// Theme context for dark mode
const ThemeProviderContext = React.createContext<{
  theme: string | null
  setTheme: (theme: string) => void
}>({
  theme: null,
  setTheme: () => null,
})

function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "ui-theme",
}: {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
}) {
  const [theme, setTheme] = useState<string | null>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme) {
      root.classList.add(theme)
      localStorage.setItem(storageKey, theme)
    }
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme: (theme: string) => setTheme(theme),
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

function useTheme() {
  const context = React.useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Utility function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// UI Components
function Button({
  className,
  variant = "default",
  size = "default",
  children,
  disabled,
  onClick,
  type,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    gradient:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

function Textarea({
  className,
  placeholder,
  value,
  onChange,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className,
      )}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

function Progress({ value, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: number }) {
  return (
    <div
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary/50 backdrop-blur-sm", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
}

function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card/80 backdrop-blur-sm text-card-foreground shadow-md hover:shadow-lg transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
}

function Badge({
  className,
  variant = "default",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "gradient"
}) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive/90 text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
    gradient: "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function Tabs({
  defaultValue,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { defaultValue: string }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  // Clone children and pass activeTab
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab } as any)
    }
    return child
  })

  return (
    <div className={cn("", className)} {...props}>
      {childrenWithProps}
    </div>
  )
}

function TabsList({
  className,
  children,
  activeTab,
  setActiveTab,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  activeTab?: string
  setActiveTab?: (value: string) => void
}) {
  // Clone children and pass activeTab and setActiveTab
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab } as any)
    }
    return child
  })

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 backdrop-blur-sm p-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {childrenWithProps}
    </div>
  )
}

function TabsTrigger({
  className,
  value,
  children,
  activeTab,
  setActiveTab,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & {
  value: string
  activeTab?: string
  setActiveTab?: (value: string) => void
}) {
  const isActive = activeTab === value

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
        className,
      )}
      onClick={() => setActiveTab?.(value)}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({
  className,
  value,
  children,
  activeTab,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string
  activeTab?: string
}) {
  const isActive = activeTab === value

  if (!isActive) return null

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Main ATS Checker Component
interface AnalysisResult {
  score: number
  matchPercentage: number
  missingKeywords: string[]
  recommendedKeywords: string[]
  feedback: string
  strengths: string[]
  weaknesses: string[]
}

function ATSCheckers() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()
  const [showConfetti, setShowConfetti] = useState(false)

  // Handle file upload
  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      // Check if file is PDF or DOCX
      const fileType = selectedFile.type
      if (
        fileType === "application/pdf" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile)
      } else {
        alert("Please upload a PDF or DOCX file")
      }
    }
  }

  // Handle file input change
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileChange(files[0])
    }
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  // Trigger file input click
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Remove selected file
  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Analyze resume against job description
  const analyzeResume = async () => {
    if (!file || !jobDescription) {
      alert("Please upload a resume and enter a job description")
      return
    }

    setIsAnalyzing(true)

    // Simulate analysis with a timeout
    // In a real application, you would send the file and job description to your backend
    setTimeout(() => {
      // Mock result data
      const mockResult: AnalysisResult = {
        score: 78,
        matchPercentage: 72,
        missingKeywords: ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
        recommendedKeywords: ["Cloud Architecture", "Microservices", "DevOps", "Infrastructure as Code"],
        strengths: [
          "Strong technical skills in web development",
          "Good experience with JavaScript frameworks",
          "Solid background in database management",
        ],
        weaknesses: [
          "Limited cloud experience",
          "Missing DevOps tooling knowledge",
          "No mention of containerization technologies",
        ],
        feedback:
          "Your resume shows strong technical skills but lacks emphasis on cloud technologies and DevOps practices that are key requirements for this role. Consider adding more details about your experience with containerization and CI/CD pipelines. Your background in web development is impressive, but the job requires more cloud infrastructure knowledge.",
      }

      setResult(mockResult)
      setIsAnalyzing(false)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }, 2000)
  }

  // Reset the form
  const resetForm = () => {
    setFile(null)
    setJobDescription("")
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Confetti component
  const Confetti = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              background: `hsl(${Math.random() * 360}, 100%, 50%)`,
              borderRadius: "50%",
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(720deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .animate-confetti {
          animation: confetti 5s ease-in-out forwards;
        }
        
        .glow {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
        
        .bg-grid {
          background-size: 20px 20px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
        
        :root {
          --background: 222 47% 11%;
          --foreground: 210 40% 98%;
          --card: 222 47% 11%;
          --card-foreground: 210 40% 98%;
          --popover: 222 47% 11%;
          --popover-foreground: 210 40% 98%;
          --primary: 217 91.2% 59.8%;
          --primary-foreground: 0 0% 98%;
          --secondary: 217 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 50.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217 32.6% 17.5%;
          --input: 217 32.6% 17.5%;
          --ring: 224.3 76.3% 48%;
          --radius: 0.75rem;
        }

        .light {
          --background: 0 0% 100%;
          --foreground: 222 47% 11%;
          --card: 0 0% 100%;
          --card-foreground: 222 47% 11%;
          --popover: 0 0% 100%;
          --popover-foreground: 222 47% 11%;
          --primary: 221.2 83.2% 53.3%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 221.2 83.2% 53.3%;
        }

        * {
          border-color: hsl(var(--border));
        }

        body {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        .gradient-bg {
          background: radial-gradient(circle at top right, 
                      rgba(59, 130, 246, 0.15), 
                      transparent 40%),
                    radial-gradient(circle at bottom left, 
                      rgba(99, 102, 241, 0.15), 
                      transparent 40%);
        }
        
        .gradient-text {
          background: linear-gradient(to right, #3b82f6, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {showConfetti && <Confetti />}

      <div className="gradient-bg bg-grid min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="max-w-4xl w-full bg-card/90 backdrop-blur-md shadow-xl rounded-2xl border border-white/10 p-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-slow"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center">
                  <span className="gradient-text">ATS Checker</span>
                  <Sparkles className="ml-2 h-6 w-6 text-yellow-400 animate-pulse-slow" />
                </h1>
                <p className="text-muted-foreground">Optimize your resume for Applicant Tracking Systems</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:glow transition-all duration-300"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            <div className="space-y-8">
              {!result ? (
                <>
                  {/* File Upload Section */}
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 transition-all duration-300",
                      dragActive ? "border-primary bg-primary/10 glow" : "border-border",
                      file ? "border-green-500/50 bg-green-500/5" : "",
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={onFileInputChange}
                    />

                    {!file ? (
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="mb-6 rounded-full bg-primary/10 p-4 animate-float">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold">Upload your resume</h3>
                        <p className="mb-6 text-sm text-muted-foreground text-center max-w-md">
                          Drag and drop your resume file here, or click to browse. We support PDF and DOCX formats.
                        </p>
                        <Button
                          onClick={onButtonClick}
                          variant="gradient"
                          className="mt-2 rounded-full transition-all duration-300 hover:scale-105"
                        >
                          Select File
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full bg-green-500/20 p-3">
                            <FileText className="h-6 w-6 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={removeFile}
                          className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Job Description Section */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium flex items-center">
                      Job Description
                      <Zap className="ml-2 h-5 w-5 text-yellow-400" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Paste the job description to compare with your resume
                    </p>
                    <Textarea
                      placeholder="Paste job description here..."
                      className="min-h-[200px] rounded-xl border-input/50 focus:border-primary/50"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  {/* Analyze Button */}
                  <Button
                    onClick={analyzeResume}
                    disabled={!file || !jobDescription || isAnalyzing}
                    className="w-full py-6 text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    variant="gradient"
                  >
                    {isAnalyzing ? (
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
                  </Button>
                </>
              ) : (
                /* Results Section */
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold gradient-text">Analysis Results</h2>
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="rounded-full hover:bg-primary/10 transition-all duration-200"
                    >
                      Start New Analysis
                    </Button>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <Card className="overflow-hidden border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl"></div>
                      <CardContent className="pt-6 relative z-10">
                        <div className="space-y-6">
                          <div className="text-center">
                            <h3 className="text-xl font-medium mb-4">ATS Score</h3>
                            <div className="relative inline-flex items-center justify-center animate-float">
                              <svg className="w-40 h-40">
                                <circle
                                  className="text-muted-foreground/10"
                                  strokeWidth="8"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="70"
                                  cx="80"
                                  cy="80"
                                />
                                <circle
                                  className={cn(
                                    result.score < 50
                                      ? "text-red-500"
                                      : result.score >= 50 && result.score < 70
                                        ? "text-amber-500"
                                        : "text-green-500",
                                  )}
                                  strokeWidth="8"
                                  strokeDasharray={70 * 2 * Math.PI}
                                  strokeDashoffset={70 * 2 * Math.PI * (1 - result.score / 100)}
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="70"
                                  cx="80"
                                  cy="80"
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-bold">{result.score}</span>
                                <span className="text-sm text-muted-foreground">out of 100</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium">Job Match</h4>
                              <span className="text-sm font-medium">{result.matchPercentage}%</span>
                            </div>
                            <Progress value={result.matchPercentage} className="h-3 rounded-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl"></div>
                      <CardContent className="pt-6 relative z-10">
                        <Tabs defaultValue="missing">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="missing">Missing Keywords</TabsTrigger>
                            <TabsTrigger value="recommended">Recommended</TabsTrigger>
                          </TabsList>
                          <TabsContent value="missing" className="pt-4">
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                These keywords were found in the job description but not in your resume:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {result.missingKeywords.map((keyword, index) => (
                                  <Badge key={index} variant="destructive" className="shadow-sm">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="recommended" className="pt-4">
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Consider adding these keywords to improve your resume:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {result.recommendedKeywords.map((keyword, index) => (
                                  <Badge key={index} variant="gradient" className="shadow-sm">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <Card className="border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-xl"></div>
                      <CardContent className="pt-6 relative z-10">
                        <h3 className="text-xl font-medium mb-4 flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                          Strengths
                        </h3>
                        <ul className="space-y-2">
                          {result.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 shrink-0" />
                              <span className="text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-xl"></div>
                      <CardContent className="pt-6 relative z-10">
                        <h3 className="text-xl font-medium mb-4 flex items-center">
                          <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                          Areas to Improve
                        </h3>
                        <ul className="space-y-2">
                          {result.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <AlertCircle className="mr-2 h-4 w-4 text-red-500 mt-1 shrink-0" />
                              <span className="text-sm">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl"></div>
                    <CardContent className="pt-6 relative z-10">
                      <h3 className="text-xl font-medium mb-4 flex items-center">
                        <Award className="mr-2 h-5 w-5 text-yellow-500" />
                        Detailed Feedback
                      </h3>
                      <div className="rounded-lg bg-muted/50 backdrop-blur-sm p-4 border border-white/5">
                        <p className="text-sm leading-relaxed">{result.feedback}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component
export default function ATSCheckerApp() {
  return (
    
    <ThemeProvider defaultTheme="dark">
     
      <ATSCheckers />
    </ThemeProvider>
  )
}