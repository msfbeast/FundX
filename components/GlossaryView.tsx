import React, { useState, useMemo } from 'react';
import { Search, BookA } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { GlossaryTerm } from '../types';

export const GlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(GLOSSARY_TERMS.map(t => t.category));
    return Array.from(cats).sort();
  }, []);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? term.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedCategory]);

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                <BookA className="w-6 h-6" />
            </div>
            Startup Glossary
        </h2>
        <p className="text-slate-500">Master the language of fundraising. No more confusion.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search terms (e.g. 'Dilution', 'Burn Rate')..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 font-medium shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border ${!selectedCategory ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
            >
                All
            </button>
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border ${selectedCategory === cat ? 'bg-teal-100 text-teal-700 border-teal-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        {filteredTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredTerms.map((item, idx) => (
                <GlossaryCard key={idx} term={item} />
            ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-slate-400 font-medium">No terms found matching your search.</p>
            </div>
        )}
      </div>
    </div>
  );
};

const GlossaryCard: React.FC<{ term: GlossaryTerm }> = ({ term }) => {
    const categoryColors: Record<string, string> = {
        'Financial': 'bg-blue-50 text-blue-600 border-blue-100',
        'Legal': 'bg-rose-50 text-rose-600 border-rose-100',
        'Metrics': 'bg-purple-50 text-purple-600 border-purple-100',
        'Funding': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'General': 'bg-slate-50 text-slate-600 border-slate-100',
    };

    const badgeClass = categoryColors[term.category] || categoryColors['General'];

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-teal-600 transition-colors">{term.term}</h3>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                    {term.category}
                </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed flex-1">
                {term.definition}
            </p>
        </div>
    );
};