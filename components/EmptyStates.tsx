import React from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  Building2, 
  Calendar, 
  PenTool, 
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  suggestions?: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action,
  suggestions 
}) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-lg mx-auto">
    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-sm border border-blue-100">
      {icon}
    </div>
    
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
      {title}
    </h2>
    
    <p className="text-slate-500 mb-8 leading-relaxed max-w-md">
      {description}
    </p>

    {suggestions && suggestions.length > 0 && (
      <div className="mb-8 w-full max-w-sm">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Try These
        </p>
        <div className="space-y-2">
          {suggestions.map((suggestion, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 text-left p-3 bg-white rounded-xl border border-slate-100 text-sm text-slate-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
            >
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {action && (
      <button
        onClick={action.onClick}
        className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-black font-bold text-sm uppercase tracking-wide flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200 hover:shadow-2xl"
      >
        <Sparkles className="w-5 h-5" />
        {action.label}
      </button>
    )}
  </div>
);

// Specific empty states for different modes
export const TeachEmptyState: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => (
  <EmptyState
    icon={<BookOpen className="w-10 h-10 text-blue-600" />}
    title="Ready to Learn?"
    description="Select a module from the dropdown above to start your funding masterclass journey."
    action={{
      label: "Load First Module",
      onClick: onRefresh
    }}
    suggestions={[
      "Start with 'What is a Startup?'",
      "Jump to 'How VCs Think'",
      "Learn about 'Equity Explained'"
    ]}
  />
);

export const ChatEmptyState: React.FC<{ mode: string }> = ({ mode }) => (
  <EmptyState
    icon={<MessageSquare className="w-10 h-10 text-emerald-600" />}
    title={mode === 'MOCK_INTERVIEW' ? "Ready for Your Interview?" : "Let's Build Together"}
    description={
      mode === 'MOCK_INTERVIEW' 
        ? "I'll play the role of a skeptical VC. Answer my questions and I'll give you honest feedback."
        : "Tell me what you're working on and I'll help you apply the masterclass concepts to your startup."
    }
    suggestions={
      mode === 'MOCK_INTERVIEW' 
        ? [
            "Explain your market size",
            "Defend your valuation",
            "Describe your moat"
          ]
        : [
            "Help me draft my pitch deck",
            "Calculate my unit economics",
            "Review my term sheet"
          ]
    }
  />
);

export const VCFinderEmptyState: React.FC<{ onGenerate: () => void }> = ({ onGenerate }) => (
  <EmptyState
    icon={<Building2 className="w-10 h-10 text-yellow-600" />}
    title="Find Your Investors"
    description="Let me analyze your startup and use Google Search to find live market trends and relevant VCs in the Indian ecosystem."
    action={{
      label: "Find Investors",
      onClick: onGenerate
    }}
    suggestions={[
      "Get personalized VC matches",
      "See current market trends",
      "Generate outreach emails"
    ]}
  />
);

export const RoadmapEmptyState: React.FC<{ onGenerate: () => void }> = ({ onGenerate }) => (
  <EmptyState
    icon={<Calendar className="w-10 h-10 text-indigo-600" />}
    title="Your 90-Day Plan"
    description="Generate a tailored week-by-week execution plan for your startup, based on the Masterclass methodology."
    action={{
      label: "Generate Roadmap",
      onClick: onGenerate
    }}
    suggestions={[
      "Month 1: Foundation & Prep",
      "Month 2: Outreach & Meetings",
      "Month 3: Closing the Deal"
    ]}
  />
);

export const QuizEmptyState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <EmptyState
    icon={<PenTool className="w-10 h-10 text-rose-600" />}
    title="No Quiz Available"
    description="We couldn't generate quiz questions for this module. Try refreshing or select a different module."
    action={{
      label: "Try Again",
      onClick: onRetry
    }}
  />
);

export const FlashcardEmptyState: React.FC<{ onGenerateNew: () => void }> = ({ onGenerateNew }) => (
  <EmptyState
    icon={<Layers className="w-10 h-10 text-amber-600" />}
    title="No Flashcards Available"
    description="We couldn't generate flashcards for this module. Try refreshing or select a different module."
    action={{
      label: "Generate New",
      onClick: onGenerateNew
    }}
  />
);
