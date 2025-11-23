
import React from 'react';

export const MarkdownRenderer = ({ content }: { content: string }) => {
  // Simple bespoke renderer to avoid heavy deps
  const lines = content.split('\n');
  return (
    <div className="markdown-body text-sm md:text-base space-y-2">
      {lines.map((line, idx) => {
        if (line.startsWith('### ')) return <h3 key={idx} className="font-bold text-lg mt-4 text-slate-800">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={idx} className="font-bold text-xl mt-6 text-slate-900 border-b pb-1">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={idx} className="font-bold text-2xl mt-6 text-slate-900">{line.replace('# ', '')}</h1>;
        if (line.trim().startsWith('- ')) return <li key={idx} className="ml-4 list-disc text-slate-700">{line.replace('- ', '')}</li>;
        if (line.trim() === '') return <div key={idx} className="h-2"></div>;
        
        // Bold parsing (simple)
        const parts = line.split('**');
        return (
          <p key={idx} className="text-slate-700">
            {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
          </p>
        );
      })}
    </div>
  );
};
