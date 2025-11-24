import React, { useState, useMemo, useEffect } from 'react';
import { VCInsights, VCProfile, StartupContext } from '../types';
import { Search, Building2, TrendingUp, RefreshCw, Briefcase, DollarSign, Target, CheckCircle2, Mail, Globe, Linkedin, Info, X, Loader2, Send, Copy, Check } from 'lucide-react';
import { getDetailedVCInfo } from '../services/vcDetailService';
import { generatePersonalizedEmail } from '../services/emailGenerator';
import { vcService } from '../services/supabaseClient';
import { MarkdownRenderer } from './MarkdownRenderer';
import { addVCToPipeline } from '../services/vcPipeline';
import { useToast } from './Toast';

interface VCFinderViewProps {
    insights: VCInsights | null;
    isLoading: boolean;
    onGenerate: (force?: boolean) => void;
    context: StartupContext;
    user: any;
}

export const VCFinderView: React.FC<VCFinderViewProps> = ({ insights, isLoading, onGenerate, context, user }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'cached'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string | null>(null);
    const [selectedVC, setSelectedVC] = useState<VCProfile | null>(null);
    const [vcDetailInfo, setVcDetailInfo] = useState<string>('');
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [emailModalVC, setEmailModalVC] = useState<VCProfile | null>(null);
    const [generatedEmail, setGeneratedEmail] = useState<string>('');
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);
    const [cachedVCs, setCachedVCs] = useState<VCProfile[]>([]);

    // Load cached VCs (LocalStorage + Supabase)
    useEffect(() => {
        const loadCachedVCs = async () => {
            // 1. Load from LocalStorage (always available)
            const localCached: VCProfile[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('vc_insights_')) {
                    try {
                        const cached = localStorage.getItem(key);
                        if (cached) {
                            const parsedCache = JSON.parse(cached);
                            if (parsedCache.data?.investors) {
                                localCached.push(...parsedCache.data.investors);
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to parse cached VC', e);
                    }
                }
            }

            // 2. Load from Supabase (if logged in)
            let supabaseCached: VCProfile[] = [];
            if (user) {
                try {
                    console.log("Loading VCs from Supabase...");
                    const savedVCs = await vcService.getSavedVCs();
                    console.log(`Loaded ${savedVCs.length} VCs from Supabase`);
                    supabaseCached = savedVCs.map(svc => ({
                        name: svc.vc_name,
                        firmType: svc.firm_type as any,
                        checkSize: svc.check_size || '',
                        thesis: svc.thesis || '',
                        notablePortfolio: svc.notable_portfolio || [],
                        matchReason: svc.match_reason || '',
                        email: svc.email,
                        website: svc.website,
                        linkedin: svc.linkedin,
                        detailedInfo: svc.detailed_info
                    }));
                } catch (error) {
                    console.error("Failed to load VCs from Supabase", error);
                }
            }

            // 3. Combine and deduplicate
            const allCached = [...localCached, ...supabaseCached];
            const uniqueVCs = Array.from(new Map(allCached.map(vc => [vc.name, vc])).values());
            setCachedVCs(uniqueVCs);
        };

        loadCachedVCs();
    }, [insights, user]); // Reload when insights or user changes

    const handleKnowMore = async (vc: VCProfile) => {
        setSelectedVC(vc);
        setLoadingDetail(true);

        // Check if we already have detailed info
        if (vc.detailedInfo) {
            setVcDetailInfo(vc.detailedInfo);
            setLoadingDetail(false);
        } else {
            const info = await getDetailedVCInfo(vc);
            setVcDetailInfo(info);
            setLoadingDetail(false);

            // Cache the detailed info locally
            vc.detailedInfo = info;
        }

        // Auto-save to Supabase if logged in
        if (user) {
            try {
                await vcService.saveVC({
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
                });
                // Refresh cached list
                const savedVCs = await vcService.getSavedVCs();
                // We'll let the useEffect handle the update or we could optimistically update
            } catch (error) {
                console.error("Failed to auto-save VC", error);
            }
        }
    };

    const closeModal = () => {
        setSelectedVC(null);
        setVcDetailInfo('');
    };

    const handleGenerateEmail = async (vc: VCProfile) => {
        setEmailModalVC(vc);
        setLoadingEmail(true);
        setEmailCopied(false);

        const email = await generatePersonalizedEmail(vc, context);
        setGeneratedEmail(email);
        setLoadingEmail(false);

        // Save generated email to Supabase if logged in
        if (user) {
            try {
                // First ensure VC is saved
                const savedVC = await vcService.saveVC({
                    vc_name: vc.name,
                    firm_type: vc.firmType,
                    check_size: vc.checkSize,
                    thesis: vc.thesis,
                    notable_portfolio: vc.notablePortfolio,
                    match_reason: vc.matchReason,
                    email: vc.email,
                    website: vc.website,
                    linkedin: vc.linkedin,
                    detailed_info: vc.detailedInfo || vcDetailInfo, // Use state if available
                    status: 'contacted' // Update status to contacted
                });

                if (savedVC && savedVC.id) {
                    await vcService.saveEmail(savedVC.id, email);
                }
            } catch (error) {
                console.error("Failed to save email", error);
            }
        }
    };

    const closeEmailModal = () => {
        setEmailModalVC(null);
        setGeneratedEmail('');
        setEmailCopied(false);
    };

    const copyEmailToClipboard = () => {
        navigator.clipboard.writeText(generatedEmail);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };


    const filteredInvestors = useMemo(() => {
        const sourceList = activeTab === 'all' ? (insights?.investors || []) : cachedVCs;
        return sourceList.filter(inv => {
            const matchesSearch = (inv.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (inv.thesis || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType ? inv.firmType === filterType : true;
            return matchesSearch && matchesType;
        });
    }, [activeTab, insights, cachedVCs, searchTerm, filterType]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="relative">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full animate-ping opacity-75 absolute inset-0"></div>
                    <div className="relative w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <Search className="w-8 h-8 text-yellow-600 animate-pulse" />
                    </div>
                </div>
                <p className="text-slate-400 font-medium animate-pulse">Scouting the market with Google Search...</p>
            </div>
        );
    }

    if (!insights) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-lg mx-auto">
                <div className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-sm border border-yellow-100">
                    <Building2 className="w-10 h-10 text-yellow-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Find Your Investors</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Let the Coach analyze your startup and use <strong>Google Search</strong> to find live market trends and relevant VCs in the Indian ecosystem.
                </p>
                <button
                    onClick={() => onGenerate()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-black font-bold text-sm uppercase tracking-wide flex items-center gap-3 transition-transform active:scale-95 shadow-xl shadow-slate-200"
                >
                    <Search className="w-5 h-5" /> Find Investors
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-1 flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
                            <Building2 className="w-6 h-6" />
                        </div>
                        VC Yellow Pages
                    </h2>
                    <p className="text-slate-500">Curated deal flow for your specific startup.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onGenerate(true)}
                        className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors shadow-sm"
                        title="Force Refresh - Clear cache and generate new VCs"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 shrink-0">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'all'
                        ? 'bg-yellow-100 text-yellow-700 shadow-sm'
                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                        }`}
                >
                    All VCs ({insights?.investors?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('cached')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'cached'
                        ? 'bg-yellow-100 text-yellow-700 shadow-sm'
                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                        }`}
                >
                    My Cached VCs ({cachedVCs.length})
                </button>
            </div>

            {/* Market Pulse (Trends) - Only show on All tab */}
            {activeTab === 'all' && insights?.trends && insights.trends.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 shrink-0">
                    {insights.trends.slice(0, 3).map((trend, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl text-white shadow-lg shadow-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <TrendingUp className="w-12 h-12" />
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 mb-2">Market Trend #{idx + 1}</div>
                            <p className="font-medium text-sm leading-relaxed text-slate-100">{trend}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search investor name or thesis..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-slate-700 font-medium shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <FilterButton label="All" active={filterType === null} onClick={() => setFilterType(null)} />
                    <FilterButton label="Micro-VC" active={filterType === 'Micro-VC'} onClick={() => setFilterType('Micro-VC')} />
                    <FilterButton label="VC" active={filterType === 'VC'} onClick={() => setFilterType('VC')} />
                    <FilterButton label="Angel Network" active={filterType === 'Angel Network'} onClick={() => setFilterType('Angel Network')} />
                    <FilterButton label="Accelerator" active={filterType === 'Accelerator'} onClick={() => setFilterType('Accelerator')} />
                </div>
            </div>

            {/* Investor Grid */}
            <div className="pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInvestors.map((inv, idx) => (
                        <InvestorCard
                            key={idx}
                            profile={inv}
                            onKnowMore={() => handleKnowMore(inv)}
                            onGenerateEmail={() => handleGenerateEmail(inv)}
                        />
                    ))}
                </div>
            </div>

            {/* Detailed VC Info Modal */}
            {selectedVC && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">{selectedVC.name}</h3>
                                    <p className="text-sm text-slate-500">{selectedVC.firmType}</p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {loadingDetail ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-4">
                                    <Loader2 className="w-12 h-12 text-yellow-600 animate-spin" />
                                    <p className="text-slate-500 font-medium">Researching {selectedVC.name}...</p>
                                </div>
                            ) : (
                                <div className="prose prose-slate max-w-none">
                                    <MarkdownRenderer content={vcDetailInfo} />
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                            <div className="flex gap-3 justify-end">
                                {selectedVC.website && (
                                    <a
                                        href={selectedVC.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center gap-2"
                                    >
                                        <Globe className="w-4 h-4" />
                                        Visit Website
                                    </a>
                                )}
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-black font-bold text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Generator Modal */}
            {emailModalVC && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeEmailModal}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Send className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Personalized Email</h3>
                                    <p className="text-sm text-slate-500">For {emailModalVC.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={closeEmailModal}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {loadingEmail ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-4">
                                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                    <p className="text-slate-500 font-medium">Crafting your personalized email...</p>
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                                        {generatedEmail}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={closeEmailModal}
                                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={copyEmailToClipboard}
                                    disabled={loadingEmail}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {emailCopied ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy to Clipboard
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FilterButton: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border ${active ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
    >
        {label}
    </button>
);

const InvestorCard: React.FC<{ profile: VCProfile; onKnowMore: () => void; onGenerateEmail: () => void }> = ({ profile, onKnowMore, onGenerateEmail }) => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{profile.name}</h3>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-1">{profile.firmType}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Briefcase className="w-4 h-4" />
                </div>
            </div>

            <div className="space-y-4 mb-6 flex-1">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span><span className="font-bold text-slate-700">Check Size:</span> {profile.checkSize}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Target className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <span><span className="font-bold text-slate-700">Thesis:</span> {profile.thesis}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {(profile.notablePortfolio || []).map((co, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase rounded-md border border-slate-100">
                            {co}
                        </span>
                    ))}
                </div>
            </div>

            {/* Key Partners */}
            {profile.contacts && profile.contacts.length > 0 && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Partners</div>
                    <div className="space-y-2">
                        {(profile.contacts || []).map((contact, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <div>
                                    <div className="font-bold text-slate-700">{contact.name}</div>
                                    <div className="text-slate-500 text-[10px]">{contact.role}</div>
                                </div>
                                <div className="flex gap-1">
                                    {contact.email && (
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className={`p-1.5 bg-white rounded-md border shadow-sm transition-colors ${!/^(info|contact|hello|team|invest|pitch|support|enquiry|admin)@/i.test(contact.email)
                                                    ? 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                                                    : 'text-slate-500 border-slate-200 hover:text-blue-600'
                                                }`}
                                            title={contact.email}
                                        >
                                            <Mail className="w-3 h-3" />
                                        </a>
                                    )}
                                    {contact.linkedin && (
                                        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white text-slate-500 hover:text-blue-600 rounded-md border border-slate-200 shadow-sm">
                                            <Linkedin className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Details */}
            {(profile.email || profile.website || profile.linkedin) && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contact</div>
                    <div className="flex flex-wrap gap-2">
                        {profile.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${!/^(info|contact|hello|team|invest|pitch|support|enquiry|admin)@/i.test(profile.email)
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                    : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                                    }`}
                                title={profile.email}
                            >
                                <Mail className="w-3 h-3" />
                                <span className="truncate max-w-[120px]">
                                    {!/^(info|contact|hello|team|invest|pitch|support|enquiry|admin)@/i.test(profile.email) ? 'Direct Email' : 'Generic Email'}
                                </span>
                                {!/^(info|contact|hello|team|invest|pitch|support|enquiry|admin)@/i.test(profile.email) && (
                                    <CheckCircle2 className="w-3 h-3 ml-0.5" />
                                )}
                            </a>
                        )}
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
                                title={profile.website}
                            >
                                <Globe className="w-3 h-3" />
                                <span>Website</span>
                            </a>
                        )}
                        {profile.linkedin && (
                            <a
                                href={profile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
                                title={profile.linkedin}
                            >
                                <Linkedin className="w-3 h-3" />
                                <span>LinkedIn</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Why they fit</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {profile.matchReason}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={onKnowMore}
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <Info className="w-4 h-4" />
                    Know More
                </button>
                <button
                    onClick={onGenerateEmail}
                    className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <Send className="w-4 h-4" />
                    Email
                </button>
            </div>
        </div>
    );
};
