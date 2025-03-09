import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ChatMessage from "./chat-message"
import ResumePreview from "./resumepreview"
import Sidebar from "./ui/sidebar"
import { Send, Code, Layout, Palette, Database, Settings } from "lucide-react"

// Define professional roles
const ROLES = [
    {
        id: "software-engineer",
        title: "Software Engineer",
        icon: Code,
        description: "Build and maintain software applications and systems",
    },
    {
        id: "product-manager",
        title: "Product Manager",
        icon: Layout,
        description: "Lead product strategy and development",
    },
    {
        id: "ux-designer",
        title: "UX Designer",
        icon: Palette,
        description: "Create user-centered digital experiences",
    },
    {
        id: "data-scientist",
        title: "Data Scientist",
        icon: Database,
        description: "Analyze data and build ML models",
    },
    {
        id: "devops-engineer",
        title: "DevOps Engineer",
        icon: Settings,
        description: "Manage infrastructure and deployment pipelines",
    },
];

// General questions for all roles
const GENERAL_QUESTIONS = [
    "What's your full name?",
    "What's your email address and phone number?",
    "What's your location (City, State/Country)?",
    "Tell me about your educational background (degrees, institutions, years).",
    "What are your top 3 soft skills?",
    "List any certifications or awards you've received.",
    "What's your LinkedIn profile URL?",
];

// Role-specific questions
const ROLE_SPECIFIC_QUESTIONS = {
    "software-engineer": [
        "What programming languages are you most proficient in? List them in order of expertise.",
        "Describe your experience with software development frameworks and tools.",
        "Share details about a challenging technical project you led or contributed to significantly.",
        "What's your experience with testing and CI/CD practices?",
        "Describe your experience with code review and collaboration tools.",
        "Tell me about your notable projects. Include project names, technologies used, and key achievements. Format: Project Name (Year)\n• Key achievement\n• Technologies used\n• Impact or results",
    ],
    "product-manager": [
        "What's your experience with product lifecycle management?",
        "Describe a successful product launch you managed.",
        "What product metrics do you typically track and why?",
        "How do you prioritize features in your product roadmap?",
        "Share an example of how you've used data to make product decisions.",
        "Tell me about your most successful product initiative. Format: Product Name\n• Challenge addressed\n• Strategy implemented\n• Results achieved",
    ],
    "ux-designer": [
        "What design tools are you proficient in?",
        "Describe your user research methodology.",
        "Share a case study of a UX problem you solved.",
        "What's your approach to accessibility in design?",
        "How do you handle stakeholder feedback in your design process?",
        "Tell me about your most impactful design project. Format: Project Name\n• User problem solved\n• Design process\n• Impact metrics",
    ],
    "data-scientist": [
        "What's your experience with machine learning algorithms?",
        "Which data analysis tools and languages do you use?",
        "Describe a data project that delivered significant business impact.",
        "How do you approach data cleaning and preprocessing?",
        "Share your experience with big data technologies.",
        "Tell me about your most innovative data project. Format: Project Name\n• Problem statement\n• Methodology used\n• Results and impact",
    ],
    "devops-engineer": [
        "What's your experience with cloud platforms (AWS, Azure, GCP)?",
        "Describe your experience with containerization and orchestration.",
        "How do you approach infrastructure as code?",
        "Share your experience with monitoring and logging solutions.",
        "How do you handle security in your DevOps practices?",
        "Tell me about your most complex infrastructure project. Format: Project Name\n• Infrastructure challenge\n• Solution implemented\n• Performance improvements",
    ],
};

type Message = {
    id: string
    content: string
    role: "user" | "assistant"
    isEditing?: boolean
    questionIndex?: number
}

type Conversation = {
    id: string
    name: string
    active: boolean
    messages: Message[]
    currentQuestion: number
    resumeData: Record<number, string>
    showPreview: boolean
    selectedRole?: string
}

interface ResumeBuilderProps {
    onBack: () => void;
}

export default function ResumeBuilder({ onBack }: ResumeBuilderProps) {
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: "1",
            name: "Resume Builder",
            active: true,
            messages: [],
            currentQuestion: -1,
            resumeData: {},
            showPreview: false,
        },
    ])
    const [input, setInput] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [showSidebar, setShowSidebar] = useState(true)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const activeConversation = conversations.find((c) => c.active) || conversations[0]

    const getQuestionsForRole = (roleId: string) => {
        const roleQuestions = ROLE_SPECIFIC_QUESTIONS[roleId as keyof typeof ROLE_SPECIFIC_QUESTIONS] || [];
        return [...GENERAL_QUESTIONS, ...roleQuestions];
    };

    useEffect(() => {
        if (activeConversation.messages.length === 0) {
            const roleOptions = ROLES.map(
                (role) => `${role.title}: ${role.description}`
            ).join("\n");

            updateActiveConversation((prev) => ({
                ...prev,
                messages: [
                    {
                        id: "1",
                        content:
                            "Hi! I'm your resume building assistant. First, please select your role from the following options:\n\n" +
                            roleOptions +
                            "\n\nPlease type the role title exactly as shown above.",
                        role: "assistant",
                    },
                ],
            }));
        }
    }, [activeConversation.id])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [activeConversation.messages])

    useEffect(() => {
        inputRef.current?.focus()
    }, [activeConversation.currentQuestion])

    const updateActiveConversation = (updater: (prev: Conversation) => Conversation) => {
        setConversations((prev) => prev.map((conv) => (conv.active ? updater(conv) : conv)))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: "user",
            questionIndex: activeConversation.currentQuestion,
        }

        updateActiveConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, userMessage],
        }))

        if (!activeConversation.selectedRole) {
            const selectedRole = ROLES.find(
                (role) => role.title.toLowerCase() === input.toLowerCase()
            );

            if (selectedRole) {
                updateActiveConversation((prev) => ({
                    ...prev,
                    selectedRole: selectedRole.id,
                    currentQuestion: 0,
                    messages: [
                        ...prev.messages,
                        {
                            id: (Date.now() + 1).toString(),
                            content: `Great! You've selected ${selectedRole.title}. Let's build your resume.\n\n${getQuestionsForRole(selectedRole.id)[0]
                                }`,
                            role: "assistant",
                            questionIndex: 0,
                        },
                    ],
                }));
            } else {
                updateActiveConversation((prev) => ({
                    ...prev,
                    messages: [
                        ...prev.messages,
                        {
                            id: (Date.now() + 1).toString(),
                            content:
                                "Please select a valid role by typing the role title exactly as shown above.",
                            role: "assistant",
                        },
                    ],
                }));
            }
            setInput("");
            return;
        }

        updateActiveConversation((prev) => ({
            ...prev,
            resumeData: {
                ...prev.resumeData,
                [prev.currentQuestion]: input,
            },
        }))

        setInput("")

        const questions = getQuestionsForRole(activeConversation.selectedRole);

        if (activeConversation.currentQuestion < questions.length - 1) {
            const nextQuestion = activeConversation.currentQuestion + 1

            updateActiveConversation((prev) => ({
                ...prev,
                currentQuestion: nextQuestion,
            }))

            setTimeout(() => {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: questions[nextQuestion],
                    role: "assistant",
                    questionIndex: nextQuestion,
                }

                updateActiveConversation((prev) => ({
                    ...prev,
                    messages: [...prev.messages, assistantMessage],
                }))
            }, 500)
        } else {
            setIsGenerating(true)

            setTimeout(() => {
                setIsGenerating(false)

                const finalMessage: Message = {
                    id: Date.now().toString(),
                    content:
                        "Thanks for providing all the information! I've generated your resume. You can view and download it below.",
                    role: "assistant",
                }

                updateActiveConversation((prev) => ({
                    ...prev,
                    messages: [...prev.messages, finalMessage],
                    showPreview: true,
                }))
            }, 2000)
        }
    }

    const resetChat = () => {
        updateActiveConversation((prev) => ({
            ...prev,
            messages: [],
            currentQuestion: -1,
            resumeData: {},
            showPreview: false,
            selectedRole: undefined,
        }))
    }

    const startNewChat = () => {
        const newId = Date.now().toString()
        setConversations((prev) => [
            ...prev.map((conv) => ({ ...conv, active: false })),
            {
                id: newId,
                name: "New Resume",
                active: true,
                messages: [],
                currentQuestion: -1,
                resumeData: {},
                showPreview: false,
            },
        ])
    }

    const deleteChat = (id: string) => {
        if (conversations.length <= 1) return

        const isActive = conversations.find((c) => c.id === id)?.active

        setConversations((prev) => {
            const filtered = prev.filter((conv) => conv.id !== id)

            if (isActive && filtered.length > 0) {
                filtered[0].active = true
            }

            return filtered
        })
    }

    const selectChat = (id: string) => {
        setConversations((prev) => prev.map((conv) => ({ ...conv, active: conv.id === id })))
    }

    const toggleMessageEdit = (id: string) => {
        updateActiveConversation((prev) => ({
            ...prev,
            messages: prev.messages.map((msg) => (msg.id === id ? { ...msg, isEditing: !msg.isEditing } : msg)),
        }))
    }

    const updateMessage = (id: string, newContent: string) => {
        updateActiveConversation((prev) => {
            const updatedMessages = prev.messages.map((msg) => {
                if (msg.id === id) {
                    return { ...msg, content: newContent, isEditing: false }
                }
                return msg
            })

            const updatedMsg = updatedMessages.find((m) => m.id === id)
            const updatedResumeData = { ...prev.resumeData }

            if (updatedMsg?.role === "user" && updatedMsg.questionIndex !== undefined) {
                updatedResumeData[updatedMsg.questionIndex] = newContent
            }

            return {
                ...prev,
                messages: updatedMessages,
                resumeData: updatedResumeData,
            }
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <div className="flex h-full w-full bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
            <Sidebar
                conversations={conversations}
                onNewChat={startNewChat}
                onSelectChat={selectChat}
                onDeleteChat={deleteChat}
                visible={showSidebar}
                onToggle={() => setShowSidebar(!showSidebar)}
            />

            <div className="flex-1 flex flex-col lg:flex-row">
                <div className="flex-1 flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {activeConversation.messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    onEdit={() => toggleMessageEdit(message.id)}
                                    onSave={(content) => updateMessage(message.id, content)}
                                />
                            ))}
                            <div ref={messagesEndRef} />

                            {isGenerating && (
                                <div className="flex items-center space-x-2 text-zinc-400 p-4 rounded-lg bg-zinc-800/30 backdrop-blur-sm">
                                    <div className="animate-pulse h-2 w-2 rounded-full bg-indigo-500"></div>
                                    <div className="animate-pulse h-2 w-2 rounded-full bg-indigo-500 delay-150"></div>
                                    <div className="animate-pulse h-2 w-2 rounded-full bg-indigo-500 delay-300"></div>
                                    <span className="ml-2 text-white">Generating your resume...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4">
                        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                            <div className="relative">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your answer here..."
                                    className="w-full p-4 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none bg-zinc-800/50 backdrop-blur-sm border-zinc-700 text-white"
                                    rows={2}
                                    disabled={isGenerating || activeConversation.showPreview}
                                />
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isGenerating || activeConversation.showPreview}
                                    className="absolute right-2 bottom-2 bg-gradient-to-r from-indigo-500 to-amber-600 hover:from-indigo-600 hover:to-amber-700 text-white rounded-lg"
                                    size="sm"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-zinc-500 mt-2 text-center">Press Enter to send, Shift+Enter for a new line</p>
                        </form>
                    </div>
                </div>

                {activeConversation.showPreview && (
                    <div className="lg:w-1/2 h-full overflow-y-auto border-l border-zinc-800">
                        <div className="p-6">
                            <ResumePreview
                                resumeData={activeConversation.resumeData}
                                questions={
                                    activeConversation.selectedRole
                                        ? getQuestionsForRole(activeConversation.selectedRole)
                                        : []
                                }
                                role={
                                    ROLES.find((r) => r.id === activeConversation.selectedRole)?.title
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}