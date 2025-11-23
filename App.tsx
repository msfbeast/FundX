
import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    BrainCircuit,
    PenTool,
    Layers,
    MessageSquare,
    Calendar,
    Settings,
    ChevronRight,
    Mic,
    MessageSquareText,
    Menu,
    X,
    Sparkles,
    BookA,
    Search,
    Building2,
    LogOut,
    User,
    TrendingUp,
    Kanban
} from 'lucide-react';
import {
    MODULES,
    MASTERCLASS_CONTENT,
    COACH_PERSONA_PROMPT,
    QUIZ_GENERATION_PROMPT,
    FLASHCARD_GENERATION_PROMPT,
    ROADMAP_GENERATION_PROMPT,
    DEFAULT_CONTEXT
} from './constants';
import { AppMode, Message, StartupContext, QuizQuestion, Flashcard, RoadmapMonth, SlideDeck, VCInsights } from './types';
import { sendChatMessage, generateQuiz, generateFlashcards, generateRoadmap, generateSlideDeck, generateVCInsights } from './services/geminiServiceSecure';
import { VC_DATABASE } from './data/vcDatabase';
import { authService, vcService } from './services/supabaseClient';
import { ChatInterface } from './components/ChatInterface';
import { QuizView } from './components/QuizView';
import { FlashcardView } from './components/FlashcardView';
import { RoadmapView } from './components/RoadmapView';
import { TeachView } from './components/TeachView';
import { LiveVoiceInterface } from './components/LiveVoiceInterface';
import { GlossaryView } from './components/GlossaryView';
import { VCFinderView } from './components/VCFinderView';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { ProgressDashboard } from './components/ProgressDashboard';
import { initializeProgress } from './services/progressTracking';
import { VCPipelineView } from './components/VCPipelineView';
import { initializePipeline } from './services/vcPipeline';
import { 
    SlideSkeletonLoader, 
    QuizSkeletonLoader, 
    VCFinderSkeletonLoader, 
    ChatSkeletonLoader, 
    RoadmapSkeletonLoader,
    FlashcardSkeletonLoader 
} from './components/SkeletonLoaders';

const App: React.FC = () => {
    const [mode, setMode] = useState<AppMode>(AppMode.TEACH);
    const [selectedModule, setSelectedModule] = useState(MODULES[0]);

    // Chat States
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);

    // Data States
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [roadmapMonths, setRoadmapMonths] = useState<RoadmapMonth[]>([]);
    const [currentSlideDeck, setCurrentSlideDeck] = useState<SlideDeck | null>(null);
    const [vcInsights, setVcInsights] = useState<VCInsights | null>(null);

    // User Context
    const [context, setContext] = useState<StartupContext>(DEFAULT_CONTEXT);

    const [showSettings, setShowSettings] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Initialize progress tracking and pipeline
    useEffect(() => {
        initializeProgress();
        initializePipeline();
    }, []);

    // Auth state listener
    useEffect(() => {
        authService.getCurrentUser().then(setUser);
        const { data: { subscription } } = authService.onAuthStateChange(setUser);
        return () => subscription.unsubscribe();
    }, []);

    // Initial Content Load
    useEffect(() => {
        if (mode === AppMode.TEACH && !currentSlideDeck) {
            handleGenerateSlides();
        }
    }, []);

    // --- Handlers ---

    const handleSendMessage = async (text: string) => {
        const userMsg: Message = { role: 'user', content: text, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        const response = await sendChatMessage([...messages, userMsg], text, context, mode);

        setMessages(prev => [...prev, { role: 'model', content: response, timestamp: Date.now() }]);
        setIsLoading(false);
    };

    const handleGenerateSlides = async () => {
        setIsLoading(true);
        const deck = await generateSlideDeck(selectedModule, context);
        setCurrentSlideDeck(deck);
        setIsLoading(false);
    };

    const handleModeChange = async (newMode: AppMode) => {
        setMode(newMode);
        setMessages([]);
        setIsVoiceMode(false); // Reset voice mode on navigation
        setIsSidebarOpen(false); // Close sidebar on mobile after selection

        if (newMode === AppMode.TEACH) {
            if (!currentSlideDeck || currentSlideDeck.moduleTitle !== selectedModule) {
                handleGenerateSlides();
            }
        } else if (newMode === AppMode.QUIZ) {
            setIsLoading(true);
            const data = await generateQuiz(selectedModule, context);
            setQuizQuestions(data.questions || []);
            setIsLoading(false);
        } else if (newMode === AppMode.FLASHCARDS) {
            setIsLoading(true);
            const data = await generateFlashcards(selectedModule, context);
            setFlashcards(data.cards || []);
            setIsLoading(false);
        } else if (newMode === AppMode.MOCK_INTERVIEW) {
            setMessages([{
                role: 'model',
                content: `**VC INTERVIEW**: I've looked at your deck. I have some concerns about your market size. Explain to me exactly why a ${context.name} is a venture-scale opportunity?`,
                timestamp: Date.now()
            }]);
        } else if (newMode === AppMode.APPLY) {
            setMessages([{
                role: 'model',
                content: `**APPLY MODE**: Let's take the concepts from **${selectedModule}** and apply them to ${context.name}. What specific document or metric do you want to work on?`,
                timestamp: Date.now()
            }]);
        } else if (newMode === AppMode.PLAN) {
            if (roadmapMonths.length === 0) {
                handleGenerateRoadmap();
            }
        } else if (newMode === AppMode.VC_FINDER) {
            if (!vcInsights) {
                handleGenerateVCInsights();
            }
        }
    };

    const handleModuleChange = (newModule: string) => {
        setSelectedModule(newModule);
        if (mode === AppMode.TEACH) {
            setTimeout(() => {
                setIsLoading(true);
                generateSlideDeck(newModule, context).then(deck => {
                    setCurrentSlideDeck(deck);
                    setIsLoading(false);
                });
            }, 0);
        } else if (mode === AppMode.QUIZ || mode === AppMode.FLASHCARDS) {
            handleGenerateNewContent(newModule);
        }
    };

    const handleGenerateNewContent = async (moduleOverride?: string) => {
        const moduleToUse = moduleOverride || selectedModule;
        if (mode === AppMode.QUIZ) {
            setIsLoading(true);
            const data = await generateQuiz(moduleToUse, context);
            setQuizQuestions(data.questions || []);
            setIsLoading(false);
        } else if (mode === AppMode.FLASHCARDS) {
            setIsLoading(true);
            const data = await generateFlashcards(moduleToUse, context);
            setFlashcards(data.cards || []);
            setIsLoading(false);
        }
    };

    const handleGenerateRoadmap = async () => {
        setIsLoading(true);
        const data = await generateRoadmap(context);
        setRoadmapMonths(data.months || []);
        setIsLoading(false);
    };

    const handleGenerateVCInsights = async (force = false) => {
        const cacheKey = `vc_insights_${context.name}_${context.stage}`;

        // Clear cache if force regenerate
        if (force) {
            localStorage.removeItem(cacheKey);
        } else {
            // Check localStorage first
            const cached = localStorage.getItem(cacheKey);

            if (cached) {
                try {
                    const parsedCache = JSON.parse(cached);
                    const cacheAge = Date.now() - (parsedCache.timestamp || 0);
                    // Use cache if less than 7 days old
                    if (cacheAge < 7 * 24 * 60 * 60 * 1000) {
                        setVcInsights(parsedCache.data);
                        return;
                    }
                } catch (e) {
                    console.warn("Failed to parse VC cache", e);
                }
            }
        }

        // Start with hardcoded database
        setIsLoading(true);

        // Generate additional VCs from AI to supplement the database
        const aiData = await generateVCInsights(context);

        // Combine hardcoded VCs with AI-generated ones
        const combinedData: VCInsights = {
            trends: aiData?.trends || [],
            investors: [
                ...VC_DATABASE, // Start with our curated list
                ...(aiData?.investors || []) // Add AI-generated VCs
            ]
        };

        setVcInsights(combinedData);
        setIsLoading(false);

        // Cache the combined results locally
        localStorage.setItem(cacheKey, JSON.stringify({
            data: combinedData,
            timestamp: Date.now()
        }));

        // AUTO-SAVE to Supabase Pipeline
        console.log("Attempting auto-save...", { user: !!user, count: combinedData.investors.length });

        if (user && combinedData.investors.length > 0) {
            try {
                // We save them in the background so we don't block the UI
                const savePromises = combinedData.investors.map(vc =>
                    vcService.saveVC({
                        vc_name: vc.name,
                        firm_type: vc.firmType,
                        check_size: vc.checkSize,
                        thesis: vc.thesis,
                        notable_portfolio: vc.notablePortfolio,
                        match_reason: vc.matchReason,
                        email: vc.email,
                        website: vc.website,
                        linkedin: vc.linkedin,
                        detailed_info: vc.detailedInfo,
                        status: 'to_contact'
                    })
                );

                // Execute all saves (silently)
                Promise.allSettled(savePromises).then(() => {
                    console.log(`Auto-saved ${combinedData.investors.length} VCs to pipeline`);
                });
            } catch (error) {
                console.error("Background auto-save failed", error);
            }
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Modern & Colorful */}
            <div className={`
        fixed md:relative inset-y-0 left-0 z-50 w-80 bg-white flex flex-col border-r border-slate-100 shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
                <div className="p-8 pb-4">
                    <h1 className="text-slate-900 font-bold text-xl flex items-center gap-3 tracking-tight">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        Funding Coach
                    </h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-8 right-6 text-slate-400 hover:text-slate-900">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide py-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2 mt-2">Learn</div>

                    <NavButton
                        active={mode === AppMode.TEACH}
                        onClick={() => handleModeChange(AppMode.TEACH)}
                        icon={<BookOpen className="w-5 h-5" />}
                        label="Teach Me"
                        colorClass="bg-blue-50 text-blue-600"
                        activeClass="bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                    />
                    <NavButton
                        active={mode === AppMode.PLAN}
                        onClick={() => handleModeChange(AppMode.PLAN)}
                        icon={<Calendar className="w-5 h-5" />}
                        label="90-Day Plan"
                        colorClass="bg-indigo-50 text-indigo-600"
                        activeClass="bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                    />
                    <NavButton
                        active={mode === AppMode.PROGRESS}
                        onClick={() => handleModeChange(AppMode.PROGRESS)}
                        icon={<TrendingUp className="w-5 h-5" />}
                        label="Progress"
                        colorClass="bg-purple-50 text-purple-600"
                        activeClass="bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                    />
                    <NavButton
                        active={mode === AppMode.GLOSSARY}
                        onClick={() => handleModeChange(AppMode.GLOSSARY)}
                        icon={<BookA className="w-5 h-5" />}
                        label="Glossary"
                        colorClass="bg-teal-50 text-teal-600"
                        activeClass="bg-teal-50 text-teal-700 ring-1 ring-teal-200"
                    />

                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-8 px-2">Practice</div>

                    <NavButton
                        active={mode === AppMode.VC_FINDER}
                        onClick={() => handleModeChange(AppMode.VC_FINDER)}
                        icon={<Building2 className="w-5 h-5" />}
                        label="VC Finder"
                        colorClass="bg-yellow-50 text-yellow-600"
                        activeClass="bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200"
                    />
                    <NavButton
                        active={mode === AppMode.VC_PIPELINE}
                        onClick={() => handleModeChange(AppMode.VC_PIPELINE)}
                        icon={<Kanban className="w-5 h-5" />}
                        label="VC Pipeline"
                        colorClass="bg-cyan-50 text-cyan-600"
                        activeClass="bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200"
                    />
                    <NavButton
                        active={mode === AppMode.QUIZ}
                        onClick={() => handleModeChange(AppMode.QUIZ)}
                        icon={<PenTool className="w-5 h-5" />}
                        label="Quiz"
                        colorClass="bg-rose-50 text-rose-600"
                        activeClass="bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                    />
                    <NavButton
                        active={mode === AppMode.FLASHCARDS}
                        onClick={() => handleModeChange(AppMode.FLASHCARDS)}
                        icon={<Layers className="w-5 h-5" />}
                        label="Flashcards"
                        colorClass="bg-amber-50 text-amber-600"
                        activeClass="bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                    />
                    <NavButton
                        active={mode === AppMode.MOCK_INTERVIEW}
                        onClick={() => handleModeChange(AppMode.MOCK_INTERVIEW)}
                        icon={<MessageSquare className="w-5 h-5" />}
                        label="Mock VC Chat"
                        colorClass="bg-emerald-50 text-emerald-600"
                        activeClass="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    />
                    <NavButton
                        active={mode === AppMode.APPLY}
                        onClick={() => handleModeChange(AppMode.APPLY)}
                        icon={<Settings className="w-5 h-5" />}
                        label="Apply to Startup"
                        colorClass="bg-violet-50 text-violet-600"
                        activeClass="bg-violet-50 text-violet-700 ring-1 ring-violet-200"
                    />
                </nav>

                <div className="p-6 space-y-3">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="group w-full bg-slate-50 hover:bg-slate-100 text-slate-600 p-4 rounded-2xl flex items-center gap-3 transition-all duration-200 border border-slate-100"
                    >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-bold text-slate-400 uppercase">Context</div>
                            <div className="text-sm font-semibold text-slate-900 truncate w-32">{context.name}</div>
                        </div>
                    </button>

                    {user ? (
                        <button
                            onClick={() => authService.signOut()}
                            className="group w-full bg-blue-50 hover:bg-blue-100 text-blue-600 p-4 rounded-2xl flex items-center gap-3 transition-all duration-200 border border-blue-100"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="text-left flex-1">
                                <div className="text-xs font-bold text-blue-400 uppercase">Signed In</div>
                                <div className="text-sm font-semibold text-blue-900 truncate w-32">{user.email}</div>
                            </div>
                            <LogOut className="w-4 h-4 opacity-50" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="group w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600 p-4 rounded-2xl flex items-center gap-3 transition-all duration-200 border border-yellow-100"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-yellow-500">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-yellow-400 uppercase">Account</div>
                                <div className="text-sm font-semibold text-yellow-900">Sign In</div>
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Header - Floating & Clean */}
                <div className="h-20 flex items-center justify-between px-6 md:px-10 shrink-0">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden text-slate-500 hover:text-slate-900 bg-white p-2 rounded-xl shadow-sm border border-slate-100"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Modern Module Pill (Hidden in Glossary/Plan modes if desired, but kept for consistency) */}
                        {mode !== AppMode.GLOSSARY && mode !== AppMode.VC_FINDER && (
                            <div className="relative group bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:border-blue-300 transition-all cursor-pointer">
                                <div className="flex items-center gap-2 text-slate-700 group-hover:text-blue-600">
                                    <span className="font-bold text-sm truncate max-w-[180px] sm:max-w-md">{selectedModule}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:rotate-90 transition-transform" />
                                </div>
                                <select
                                    value={selectedModule}
                                    onChange={(e) => handleModuleChange(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                >
                                    {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {mode === AppMode.MOCK_INTERVIEW && (
                            <div className="flex bg-white rounded-full p-1 shadow-sm border border-slate-100">
                                <button
                                    onClick={() => setIsVoiceMode(false)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isVoiceMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Text
                                </button>
                                <button
                                    onClick={() => setIsVoiceMode(true)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isVoiceMode ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Voice
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area - Rounded & Floating */}
                <div className="flex-1 overflow-hidden relative px-4 pb-4 md:px-6 md:pb-6">
                    <div className="w-full h-full bg-transparent rounded-3xl overflow-hidden shadow-none flex flex-col">

                        {/* Settings Modal Overlay */}
                        {showSettings && (
                            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md z-50 flex items-center justify-center p-4 rounded-3xl">
                                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/50">
                                    <h2 className="text-2xl font-bold mb-6 text-slate-900">Startup Context</h2>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Startup Name</label>
                                            <input
                                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium"
                                                value={context.name}
                                                onChange={e => setContext({ ...context, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                            <textarea
                                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium"
                                                rows={3}
                                                value={context.description}
                                                onChange={e => setContext({ ...context, description: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stage</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium appearance-none"
                                                    value={context.stage}
                                                    onChange={e => setContext({ ...context, stage: e.target.value })}
                                                >
                                                    <option>Idea / Bootstrap</option>
                                                    <option>Pre-Seed</option>
                                                    <option>Seed</option>
                                                    <option>Series A</option>
                                                </select>
                                                <ChevronRight className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowSettings(false)}
                                            className="w-full bg-slate-900 text-white py-4 rounded-2xl hover:bg-black font-bold transition-transform active:scale-95 shadow-lg shadow-slate-200"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* View Containers */}
                        {mode === AppMode.TEACH && (
                            isLoading && !currentSlideDeck ? (
                                <SlideSkeletonLoader />
                            ) : (
                                <TeachView
                                    deck={currentSlideDeck}
                                    isLoading={isLoading}
                                    onRefresh={handleGenerateSlides}
                                    context={context}
                                />
                            )
                        )}

                        {mode === AppMode.QUIZ && (
                            <div className="h-full max-w-3xl mx-auto p-2 overflow-y-auto">
                                {isLoading ? <QuizSkeletonLoader /> : <QuizView questions={quizQuestions} onRetry={() => handleGenerateNewContent()} moduleId={`module_${selectedModule.split(':')[0].trim()}`} moduleName={selectedModule} />}
                            </div>
                        )}

                        {mode === AppMode.FLASHCARDS && (
                            <div className="h-full max-w-3xl mx-auto p-2 overflow-y-auto">
                                {isLoading ? <FlashcardSkeletonLoader /> : <FlashcardView cards={flashcards} onGenerateNew={() => handleGenerateNewContent()} />}
                            </div>
                        )}

                        {mode === AppMode.PLAN && (
                            <div className="h-full overflow-hidden max-w-5xl mx-auto w-full">
                                <RoadmapView
                                    months={roadmapMonths}
                                    onGenerate={handleGenerateRoadmap}
                                    isLoading={isLoading}
                                />
                            </div>
                        )}

                        {mode === AppMode.PROGRESS && (
                            <div className="h-full overflow-hidden">
                                <ProgressDashboard />
                            </div>
                        )}

                        {mode === AppMode.GLOSSARY && (
                            <div className="h-full overflow-hidden">
                                <GlossaryView />
                            </div>
                        )}

                        {mode === AppMode.VC_FINDER && (
                            <div className="h-full overflow-hidden">
                                <VCFinderView
                                    insights={vcInsights}
                                    onGenerate={handleGenerateVCInsights}
                                    isLoading={isLoading}
                                    context={context}
                                    user={user}
                                />
                            </div>
                        )}

                        {mode === AppMode.VC_PIPELINE && (
                            <div className="h-full overflow-hidden">
                                <VCPipelineView />
                            </div>
                        )}

                        {mode === AppMode.MOCK_INTERVIEW && isVoiceMode ? (
                            <div className="h-full">
                                <LiveVoiceInterface context={context} />
                            </div>
                        ) : (mode === AppMode.APPLY || mode === AppMode.MOCK_INTERVIEW) && (
                            <div className="h-full max-w-4xl mx-auto w-full pb-4">
                                <ChatInterface
                                    messages={messages}
                                    onSendMessage={handleSendMessage}
                                    isLoading={isLoading}
                                    placeholder={mode === AppMode.MOCK_INTERVIEW ? "Answer the VC's question..." : "Describe what you're working on..."}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => setShowAuthModal(false)}
                />
            )}
        </div>
    );
};

// --- Sub Components ---

const NavButton = ({ active, onClick, icon, label, colorClass, activeClass }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, colorClass: string, activeClass: string }) => (
    <button
        onClick={onClick}
        className={`
            w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-sm font-bold mb-1
            ${active
                ? activeClass + ' shadow-sm translate-x-1'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
        `}
    >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? 'bg-white/50' : colorClass}`}>
            {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4 fill-current opacity-80" })}
        </div>
        {label}
    </button>
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full gap-6">
        <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 animate-ping absolute inset-0 opacity-75"></div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 relative z-10">
                <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
            </div>
        </div>


        <p className="text-slate-400 text-sm font-medium animate-pulse tracking-wide">Cooking up wisdom...</p>
    </div>
);

// Wrap App with providers
const AppWithProviders = () => (
    <ErrorBoundary>
        <ToastProvider>
            <App />
        </ToastProvider>
    </ErrorBoundary>
);

export default AppWithProviders;
