
import React, { useState } from 'react';
import { RoadmapMonth, RoadmapWeek } from '../types';
import { Calendar, CheckSquare, ChevronDown, ChevronUp, RefreshCw, PlayCircle, ArrowRight } from 'lucide-react';

interface RoadmapViewProps {
  months: RoadmapMonth[];
  onGenerate: () => void;
  isLoading: boolean;
}

const WeekItem: React.FC<{ week: RoadmapWeek }> = ({ week }) => {
    const [isOpen, setIsOpen] = useState(true);
    const tasks = week.tasks || [];

    // Assign random pastel colors based on week number for visual variety
    const colors = [
        'bg-blue-50 text-blue-700 border-blue-100',
        'bg-purple-50 text-purple-700 border-purple-100',
        'bg-rose-50 text-rose-700 border-rose-100',
        'bg-emerald-50 text-emerald-700 border-emerald-100'
    ];
    const colorClass = colors[(week.weekNumber - 1) % colors.length];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-4 shadow-sm group hover:shadow-md transition-all duration-200">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm border ${colorClass}`}>
                        W{week.weekNumber}
                    </div>
                    <div className="text-left">
                         <span className="text-sm font-bold text-slate-800 block">{week.theme}</span>
                         <span className="text-xs text-slate-400 font-medium">{tasks.length} tasks</span>
                    </div>
                </div>
                <div className={`p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-100 transition-colors ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>
            {isOpen && (
                <div className="p-4 pt-0">
                    <div className="pl-6 ml-6 border-l-2 border-slate-100 space-y-3 py-2">
                        {tasks.length > 0 ? (
                            tasks.map((task, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 w-4 h-4 rounded-md border-2 border-slate-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors shrink-0" />
                                    <span className="text-sm text-slate-600 font-medium leading-snug">{task}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-slate-400 italic">No tasks defined.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ months, onGenerate, isLoading }) => {
  if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="relative">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full animate-ping opacity-75 absolute inset-0"></div>
                  <div className="relative w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
              </div>
              <p className="text-slate-400 font-medium animate-pulse">Strategizing...</p>
          </div>
      );
  }

  // Safety check for months array
  const safeMonths = months || [];

  if (safeMonths.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-lg mx-auto">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-sm">
                  <Calendar className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Your 90-Day Plan</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                  Generate a tailored week-by-week execution plan for your startup, based on the Masterclass methodology.
              </p>
              <button 
                  onClick={onGenerate}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-black font-bold text-sm uppercase tracking-wide flex items-center gap-3 transition-transform active:scale-95 shadow-xl shadow-slate-200"
              >
                  <PlayCircle className="w-5 h-5" /> Generate Roadmap
              </button>
          </div>
      );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">90-Day Roadmap</h2>
                <p className="text-slate-500 font-medium mt-1">From Zero to Funded in 12 Weeks.</p>
            </div>
            <button 
                onClick={onGenerate}
                className="bg-white p-3 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                title="Regenerate Plan"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>

            {safeMonths.map((month) => (
                <div key={month.monthNumber} className="flex flex-col relative">
                    {/* Month Header Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6 relative group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Month {month.monthNumber}</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{month.title}</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{month.focus}</p>
                    </div>
                    
                    {/* Weeks */}
                    <div className="space-y-4">
                        {(month.weeks || []).map((week) => (
                            <WeekItem key={week.weekNumber} week={week} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
