import React from 'react';

// Base skeleton component
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

// Slide deck skeleton
export const SlideSkeletonLoader = () => (
  <div className="h-full flex flex-col lg:flex-row gap-6 lg:gap-8 p-4">
    <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 md:p-14">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-10">
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>
        </div>
        
        <Skeleton className="h-10 w-3/4 mb-8" />
        
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="mt-12 p-6 bg-slate-50 rounded-2xl">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    </div>

    <div className="lg:w-[45%] bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
      <Skeleton className="h-64 w-full rounded-2xl mb-6" />
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
);

// Quiz skeleton
export const QuizSkeletonLoader = () => (
  <div className="max-w-2xl mx-auto p-2">
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
      <Skeleton className="h-6 w-32 mb-6" />
      <Skeleton className="h-8 w-full mb-8" />
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// VC Finder skeleton
export const VCFinderSkeletonLoader = () => (
  <div className="h-full flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full">
    <div className="flex items-center justify-between mb-8">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 rounded-2xl" />
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          
          <div className="space-y-3 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className={`h-6 ${j === 2 ? 'w-20' : 'w-16'} rounded-md`} />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Chat skeleton
export const ChatSkeletonLoader = () => (
  <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
    <div className="flex-1 space-y-6">
      <div className="flex justify-end">
        <Skeleton className="h-16 w-2/3 rounded-3xl rounded-tr-none" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-24 w-3/4 rounded-3xl rounded-tl-none" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-12 w-1/2 rounded-3xl rounded-tr-none" />
      </div>
    </div>
    <Skeleton className="h-14 w-full rounded-2xl mt-4" />
  </div>
);

// Roadmap skeleton
export const RoadmapSkeletonLoader = () => (
  <div className="h-full overflow-y-auto p-4 md:p-8">
    <div className="flex items-center justify-between mb-10">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((month) => (
        <div key={month} className="flex flex-col">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((week) => (
              <div key={week} className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center gap-4 mb-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Flashcard skeleton
export const FlashcardSkeletonLoader = () => (
  <div className="max-w-2xl mx-auto p-2">
    <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-12 min-h-[400px] flex flex-col items-center justify-center">
      <Skeleton className="h-8 w-3/4 mb-8" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-5/6 mb-3" />
      <Skeleton className="h-4 w-4/5" />
      
      <div className="flex gap-4 mt-12">
        <Skeleton className="w-32 h-12 rounded-xl" />
        <Skeleton className="w-32 h-12 rounded-xl" />
      </div>
    </div>
  </div>
);
