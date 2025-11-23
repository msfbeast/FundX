
import React, { useState } from 'react';
import { Flashcard } from '../types';
import { ArrowLeft, ArrowRight, RotateCw, RefreshCw, Zap, Sparkles } from 'lucide-react';

interface FlashcardViewProps {
  cards: Flashcard[];
  onGenerateNew: () => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ cards, onGenerateNew }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 300);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 300);
  };

  if (cards.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-slate-500 font-medium">No flashcards available for this module.</p>
            <button onClick={onGenerateNew} className="mt-4 text-blue-600 font-bold hover:underline">Generate Deck</button>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
      
      {/* 3D Card Container */}
      <div 
        className="relative w-full max-w-lg h-[420px] cursor-pointer group perspective-1000" 
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '1000px' }}
      >
        <div 
            className="relative w-full h-full transition-transform duration-500 transform-style-3d"
            style={{ 
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
        >
          
          {/* Front Face */}
          <div 
            className="absolute inset-0 w-full h-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100 p-8 md:p-12 flex flex-col items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div className="absolute top-6 left-6 w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                <Zap className="w-6 h-6 text-amber-500 fill-current" />
            </div>
            
            <div className="flex-1 flex items-center justify-center w-full overflow-y-auto scrollbar-hide">
                <p className="text-2xl md:text-3xl font-bold text-center text-slate-800 leading-tight">
                    {cards[currentIndex].front}
                </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-amber-500 transition-colors">
                <RotateCw className="w-4 h-4" /> Tap to flip
            </div>
          </div>

          {/* Back Face */}
          <div 
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2.5rem] shadow-xl shadow-orange-200 p-8 md:p-12 flex flex-col items-center justify-center backface-hidden"
            style={{ 
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)' 
            }}
          >
            <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-xs font-bold text-white tracking-widest uppercase">Answer</span>
            </div>

            <div className="flex-1 flex items-center justify-center w-full overflow-y-auto scrollbar-hide">
                <p className="text-xl md:text-2xl font-bold text-center leading-relaxed text-white">
                    {cards[currentIndex].back}
                </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" /> Mastered
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-12 flex items-center gap-6 md:gap-10">
        <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
            className="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm hover:shadow-md hover:bg-slate-50 flex items-center justify-center transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-slate-900 font-mono">
            {currentIndex + 1} <span className="text-slate-300 text-lg">/ {cards.length}</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cards</span>
        </div>

        <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }} 
            className="w-16 h-16 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-300 hover:shadow-xl hover:bg-black flex items-center justify-center transition-all active:scale-95"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <button onClick={onGenerateNew} className="mt-12 px-6 py-3 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors flex items-center gap-2">
        <RefreshCw className="w-3 h-3" /> Generate New Deck
      </button>
    </div>
  );
};
