import React, { useState } from 'react';
import { useToast } from './Toast';
import { ProgressIndicator, IndeterminateProgress } from './ProgressIndicator';
import { EmptyState } from './EmptyStates';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { Sparkles, Zap, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * UI Polish Demo Component
 * 
 * This component demonstrates all the new UI polish features.
 * Add it to your app temporarily to test everything.
 * 
 * Usage in App.tsx:
 * import { UIPolishDemo } from './components/UIPolishDemo';
 * 
 * Then add a button to show it:
 * <button onClick={() => setShowDemo(true)}>Test UI Polish</button>
 * {showDemo && <UIPolishDemo onClose={() => setShowDemo(false)} />}
 */

interface UIPolishDemoProps {
  onClose: () => void;
}

export const UIPolishDemo: React.FC<UIPolishDemoProps> = ({ onClose }) => {
  const { success, error, warning, info } = useToast();
  const [showProgress, setShowProgress] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const testToasts = () => {
    success("Success! This is a success toast");
    setTimeout(() => warning("Warning! This is a warning toast"), 500);
    setTimeout(() => error("Error! This is an error toast"), 1000);
    setTimeout(() => info("Info! This is an info toast"), 1500);
  };

  const testProgress = () => {
    setShowProgress(true);
    setProgressStep(0);
    
    const steps = [0, 1, 2, 3];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setProgressStep(step);
        if (step === 3) {
          setTimeout(() => {
            setShowProgress(false);
            success("Progress complete!");
          }, 1000);
        }
      }, index * 1500);
    });
  };

  const testError = () => {
    throw new Error("Test error for ErrorBoundary");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">UI Polish Demo</h2>
                <p className="text-sm text-slate-500">Test all the new features</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <span className="text-2xl text-slate-400">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          
          {/* Toast Notifications */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Toast Notifications</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Click to see success, warning, error, and info toasts appear in the top-right corner.
            </p>
            <button
              onClick={testToasts}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg"
            >
              Test All Toasts
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Progress Indicators</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              See step-by-step progress for multi-step operations.
            </p>
            {showProgress ? (
              <div c