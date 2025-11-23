
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, ChevronRight, RefreshCw, Trophy, AlertCircle } from 'lucide-react';
import { recordQuizScore } from '../services/progressTracking';
import { useToast } from './Toast';

interface QuizViewProps {
  questions: QuizQuestion[];
  onRetry: () => void;
  moduleId: string;
  moduleName: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onRetry, moduleId, moduleName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const { success } = useToast();

  // Record quiz score when complete
  useEffect(() => {
    if (quizComplete && questions.length > 0) {
      const percentage = Math.round((score / questions.length) * 100);
      recordQuizScore(moduleId, moduleName, score, questions.length);
      success(`🎉 Quiz complete! You scored ${percentage}%`);
    }
  }, [quizComplete, score, questions.length, moduleId, moduleName]);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (questions.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-medium">No quiz data available.</div>;
  }

  if (quizComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 text-center">
        <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6 border border-yellow-100">
            <Trophy className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Complete!</h2>
        <p className="text-lg text-slate-500 mb-8 font-medium">You scored <span className="text-slate-900 font-bold">{score}</span> out of <span className="text-slate-900 font-bold">{questions.length}</span></p>
        <button 
            onClick={onRetry}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black font-bold transition-transform active:scale-95 shadow-lg shadow-slate-200"
        >
            <RefreshCw className="w-5 h-5" /> Try New Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-2">
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-50 w-full absolute top-0 left-0">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-10">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold tracking-wider uppercase mb-6">
            Question {currentIndex + 1} of {questions.length}
          </span>
          
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-tight">
            {currentQuestion.question}
          </h3>

          <div className="space-y-4">
            {(currentQuestion.options || []).map((option, idx) => {
              let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 font-medium text-lg";
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctAnswerIndex;

              if (selectedOption !== null) {
                if (isCorrect) btnClass = "w-full text-left p-5 rounded-2xl border-2 border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm";
                else if (isSelected) btnClass = "w-full text-left p-5 rounded-2xl border-2 border-rose-200 bg-rose-50 text-rose-800";
                else btnClass = "w-full text-left p-5 rounded-2xl border-2 border-slate-100 text-slate-400 opacity-50 bg-slate-50";
              } else {
                btnClass = "w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-slate-700 bg-white shadow-sm hover:shadow-md";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={selectedOption !== null}
                  className={btnClass}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {selectedOption !== null && isCorrect && <CheckCircle className="w-6 h-6 text-emerald-500 fill-emerald-100" />}
                    {selectedOption !== null && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-500 fill-rose-100" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                 <AlertCircle className="w-5 h-5 text-blue-600" />
                 <p className="font-bold text-slate-900">Coach's Explanation</p>
              </div>
              <p className="text-slate-600 leading-relaxed ml-7">{currentQuestion.explanation}</p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5"
                >
                  {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
