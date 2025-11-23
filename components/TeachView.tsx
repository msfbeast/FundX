
import React, { useState, useRef, useEffect } from 'react';
import { Slide, SlideDeck, VisualType, PodcastState, PodcastStatus, StartupContext } from '../types';
import {
    ChevronLeft, ChevronRight, MessageCircle, BarChart, ArrowRight, BookOpen,
    Headphones, Play, Pause, Loader2, Info, Lightbulb, Square,
    Volume2, VolumeX, FastForward, Download, RefreshCw, X, FileText
} from 'lucide-react';
import { generatePodcastScript, generatePodcastAudio } from '../services/geminiService';
import { decodeAudioData } from '../utils/audio';
import { ProgressIndicator } from './ProgressIndicator';
import { useToast } from './Toast';
import { loadPodcastFromCache, savePodcastToCache, isPodcastCached } from '../utils/podcastCache';
import { addTimeSpent, completeModule } from '../services/progressTracking';

interface TeachViewProps {
    deck: SlideDeck | null;
    isLoading: boolean;
    onRefresh: () => void;
    context: StartupContext;
}

// --- Helper: WAV Conversion ---
function bufferToWav(buffer: AudioBuffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new ArrayBuffer(length);
    const view = new DataView(out);
    const channels: Float32Array[] = [];

    // collect channel data
    for (let i = 0; i < numOfChan; i++) {
        channels.push(buffer.getChannelData(i));
    }

    // Write WAV header
    // RIFF identifier
    view.setUint32(0, 0x46464952, false);
    // file length minus RIFF and size fields
    view.setUint32(4, length - 8, true);
    // WAVE identifier
    view.setUint32(8, 0x45564157, false);
    // fmt chunk
    view.setUint32(12, 0x20746d66, false);
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat (PCM)
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * numOfChan * 2, true); // ByteRate
    view.setUint16(32, numOfChan * 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    // data chunk
    view.setUint32(36, 0x61746164, false);
    view.setUint32(40, length - 44, true);

    // Write interleaved PCM samples
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        for (let ch = 0; ch < numOfChan; ch++) {
            let sample = Math.max(-1, Math.min(1, channels[ch][i]));
            sample = (sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(offset, sample, true);
            offset += 2;
        }
    }

    return out;
}

// --- Helper: Render Bullet with Bold text ---
const renderBullet = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-slate-800">{part}</strong> : part);
};

// --- Visual Renderer Sub-component ---
const VisualRenderer = ({ slide }: { slide: Slide }) => {
    const { visualType, visualData } = slide;

    if (!visualData) return null;

    switch (visualType) {
        case 'PROCESS':
            return (
                <div className="flex flex-col h-full justify-center">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                        {(visualData.steps || []).map((step, idx) => (
                            <React.Fragment key={idx}>
                                <div className="flex flex-col items-center text-center group flex-1 w-full md:w-auto">
                                    <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 shadow-sm border border-blue-100 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                                        {idx + 1}
                                    </div>
                                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm font-semibold text-slate-700 w-full">
                                        {step}
                                    </div>
                                </div>
                                {idx < (visualData.steps?.length || 0) - 1 && (
                                    <div className="hidden md:block h-1 bg-slate-200 flex-1 max-w-[3rem] mx-2 rounded-full"></div>
                                )}
                                {idx < (visualData.steps?.length || 0) - 1 && (
                                    <div className="md:hidden w-1 h-8 bg-slate-200 rounded-full my-2"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            );

        case 'COMPARISON':
            return (
                <div className="h-full flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50 space-y-4">
                            <div className="text-center font-bold text-blue-600 pb-2 border-b border-blue-50 uppercase tracking-widest text-xs">{visualData.leftTitle}</div>
                            <div className="space-y-3">
                                {(visualData.items || []).map((item, idx) => (
                                    <div key={idx} className="bg-blue-50/50 p-3 rounded-xl text-sm text-slate-600 text-center font-medium">
                                        {item.left}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-50 space-y-4">
                            <div className="text-center font-bold text-emerald-600 pb-2 border-b border-emerald-50 uppercase tracking-widest text-xs">{visualData.rightTitle}</div>
                            <div className="space-y-3">
                                {(visualData.items || []).map((item, idx) => (
                                    <div key={idx} className="bg-emerald-50/50 p-3 rounded-xl text-sm text-slate-600 text-center font-medium">
                                        {item.right}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'STATISTIC':
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 w-full max-w-sm">
                        <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 mb-2 tracking-tight">
                            {visualData.statValue}
                        </div>
                        <div className="inline-block px-4 py-1 bg-blue-50 rounded-full text-sm font-bold text-blue-600 mb-6 uppercase tracking-wide">
                            {visualData.statLabel}
                        </div>
                        <div className="text-slate-500 font-medium leading-relaxed">
                            {visualData.statContext}
                        </div>
                    </div>
                </div>
            );

        default:
            return null;
    }
};

// --- Helper: Format Time ---
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// --- Podcast Player Component ---
const PodcastPlayer = ({
    podcastState,
    handleGenerate,
    onStatusChange,
    className,
    moduleTitle
}: {
    podcastState: PodcastState,
    handleGenerate: () => void,
    onStatusChange: (status: PodcastStatus) => void,
    className?: string,
    moduleTitle: string
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showTranscript, setShowTranscript] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const startTimeRef = useRef(0);
    const pausedTimeRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        // No cleanup – keep the AudioContext alive for playback
        return () => { };
    }, []);

    useEffect(() => {
        if (podcastState.status === PodcastStatus.READY && podcastState.audioBuffer) {
            setDuration(podcastState.audioBuffer.duration);
            setCurrentTime(0);
            pausedTimeRef.current = 0;
            setIsPlaying(false);
        }
    }, [podcastState.audioBuffer, podcastState.status]);

    const handleDownload = () => {
        if (!podcastState.audioBuffer) return;
        const wav = bufferToWav(podcastState.audioBuffer);
        const blob = new Blob([wav], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FundingCoach_${moduleTitle.replace(/\s+/g, '_')}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const togglePlay = async () => {
        if (!audioContextRef.current || !podcastState.audioBuffer) return;
        if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();

        if (isPlaying) {
            if (sourceRef.current) {
                sourceRef.current.stop();
                sourceRef.current = null;
            }
            pausedTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
            setIsPlaying(false);
            onStatusChange(PodcastStatus.READY);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        } else {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = podcastState.audioBuffer;
            source.playbackRate.value = playbackRate;
            const gainNode = audioContextRef.current.createGain();
            gainNode.gain.value = volume;
            source.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            sourceRef.current = source;
            gainNodeRef.current = gainNode;

            if (pausedTimeRef.current >= duration) pausedTimeRef.current = 0;
            const startOffset = pausedTimeRef.current;
            startTimeRef.current = audioContextRef.current.currentTime - (startOffset / playbackRate);

            source.start(0, startOffset);
            setIsPlaying(true);
            onStatusChange(PodcastStatus.PLAYING);

            const updateProgress = () => {
                if (!audioContextRef.current) return;
                const elapsed = (audioContextRef.current.currentTime - startTimeRef.current) * playbackRate;
                if (elapsed >= duration) {
                    setIsPlaying(false);
                    setCurrentTime(duration);
                    pausedTimeRef.current = 0;
                    onStatusChange(PodcastStatus.READY);
                    return;
                }
                setCurrentTime(elapsed);
                rafRef.current = requestAnimationFrame(updateProgress);
            };
            rafRef.current = requestAnimationFrame(updateProgress);
        }
    };

    useEffect(() => {
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, []);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        pausedTimeRef.current = time;
        if (isPlaying && audioContextRef.current && podcastState.audioBuffer) {
            if (sourceRef.current) sourceRef.current.stop();
            const source = audioContextRef.current.createBufferSource();
            source.buffer = podcastState.audioBuffer;
            source.playbackRate.value = playbackRate;
            const gainNode = audioContextRef.current.createGain();
            gainNode.gain.value = volume;
            source.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            sourceRef.current = source;
            gainNodeRef.current = gainNode;
            startTimeRef.current = audioContextRef.current.currentTime - (time / playbackRate);
            source.start(0, time);
        }
    };

    const toggleSpeed = () => {
        const rates = [1, 1.25, 1.5];
        const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
        setPlaybackRate(rates[nextIdx]);
        if (sourceRef.current && isPlaying) {
            const now = audioContextRef.current!.currentTime;
            const currentPos = (now - startTimeRef.current) * playbackRate;
            startTimeRef.current = now - (currentPos / rates[nextIdx]);
            sourceRef.current.playbackRate.value = rates[nextIdx];
        }
    };

    const getTranscriptLines = () => {
        if (!podcastState.script) return [];
        return podcastState.script.split('\n').filter(line => line.trim() !== '');
    };

    const isGenerating = podcastState.status === PodcastStatus.GENERATING_SCRIPT || podcastState.status === PodcastStatus.GENERATING_AUDIO;
    const hasAudio = podcastState.status === PodcastStatus.READY || podcastState.status === PodcastStatus.PLAYING;

    if (!hasAudio && !isGenerating && podcastState.status !== PodcastStatus.ERROR) {
        const isCached = isPodcastCached(moduleTitle);
        
        return (
            <div className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Headphones className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                            Deep Dive Podcast
                            {isCached && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-md border border-emerald-200">
                                    Cached
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-slate-500">
                            {isCached ? 'Loads instantly from cache' : 'AI-generated discussion about this module'}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-all text-xs font-bold uppercase tracking-wide shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Play className="w-3 h-3 fill-current" /> {isCached ? 'Load' : 'Generate'}
                </button>
            </div>
        );
    }

    if (isGenerating) {
        const currentStep = podcastState.status === PodcastStatus.GENERATING_SCRIPT ? 0 : 1;
        
        return (
            <div className={`flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 gap-8 ${className}`}>
                <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Creating Your Podcast</h3>
                    <p className="text-sm text-slate-500">This takes 2-3 minutes. Grab a coffee! ☕</p>
                </div>
                
                <ProgressIndicator
                    steps={[
                        'Writing 8-10 minute script',
                        'Generating multi-speaker audio'
                    ]}
                    currentStep={currentStep}
                />
                
                <div className="text-xs text-slate-400 text-center max-w-md">
                    <p className="mb-2">💡 <strong>Pro tip:</strong> The podcast includes real-world examples and applies concepts to your startup.</p>
                    <p>You can download it when ready!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-slate-900 text-white relative overflow-hidden flex flex-col rounded-[2rem] shadow-2xl ${className}`}>
            {/* Colorful Glow Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 w-full flex flex-col h-full p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                            <div className="flex items-end gap-1 h-5">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={`w-1 bg-white rounded-full ${isPlaying ? 'animate-bounce' : ''}`} style={{ height: `${40 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Now Playing</div>
                            <div className="font-bold text-base leading-tight max-w-[160px] md:max-w-[200px] truncate">{moduleTitle}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                            title="Download Audio"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowTranscript(!showTranscript)}
                            className={`p-3 rounded-full transition-all ${showTranscript ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            title="Transcript"
                        >
                            {showTranscript ? <X className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </button>
                        <button onClick={toggleSpeed} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-xs font-bold hover:bg-white/20 transition-colors">
                            {playbackRate}x
                        </button>
                    </div>
                </div>

                {/* Transcript / Visualizer Area */}
                <div className="flex-1 min-h-0 overflow-y-auto mb-6 relative scrollbar-hide mask-gradient pr-2">
                    {showTranscript && podcastState.script ? (
                        <div className="space-y-4 px-1 py-2">
                            {getTranscriptLines().map((line, idx) => {
                                // Robust regex to find Coach or VC/Investor prefixes, handling optional ** bolding and colons
                                const regex = /^(\*\*?)?(Coach|VC)(\*\*?)?:?\s*/i;
                                const match = line.match(regex);
                                const isCoach = match && match[0].toLowerCase().includes('coach');
                                const text = line.replace(regex, '').trim();

                                if (!text) return null;

                                return (
                                    <div key={idx} className={`flex gap-3 mb-6 ${isCoach ? 'flex-row' : 'flex-row-reverse'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${isCoach ? 'bg-gradient-to-br from-blue-400 to-blue-600 border border-blue-300' : 'bg-gradient-to-br from-purple-400 to-purple-600 border border-purple-300'}`}>
                                            <span className="text-[10px] font-bold text-white">{isCoach ? 'C' : 'V'}</span>
                                        </div>
                                        <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isCoach ? 'bg-white/10 text-slate-100 rounded-tl-none' : 'bg-indigo-500/30 text-indigo-50 border border-indigo-400/20 rounded-tr-none text-right'}`}>
                                            <span className={`block text-[9px] font-bold uppercase tracking-wider mb-1 opacity-60`}>
                                                {isCoach ? 'Coach' : 'Investor'}
                                            </span>
                                            {text}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="flex items-end gap-1.5 h-24">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-full transition-all duration-100 ${isPlaying ? '' : 'opacity-30'}`}
                                        style={{
                                            height: isPlaying ? `${15 + Math.random() * 85}%` : '20%',
                                            opacity: isPlaying ? 1 : 0.2
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="shrink-0 space-y-4 bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="group relative h-1.5 bg-white/10 rounded-full cursor-pointer">
                        <div className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                        <input
                            type="range"
                            min="0" max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">{formatTime(currentTime)}</span>

                        <div className="flex items-center gap-6">
                            <button className="text-slate-400 hover:text-white transition-colors" onClick={() => {
                                if (audioContextRef.current) {
                                    const newTime = Math.max(0, currentTime - 10);
                                    // logic to skip back would need re-triggering play at newTime in the real implementation
                                }
                            }}>
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={togglePlay}
                                className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20"
                            >
                                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                            </button>
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        <span className="text-xs font-mono text-slate-400">{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Teach View ---
export const TeachView: React.FC<TeachViewProps> = ({ deck, isLoading, onRefresh, context }) => {
    const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
    const [podcastState, setPodcastState] = useState<PodcastState>({ status: PodcastStatus.IDLE });
    const { success, error: showError } = useToast();
    const [startTime] = useState(Date.now());

    // Track time spent on module
    useEffect(() => {
        if (!deck) return;
        
        const interval = setInterval(() => {
            const moduleId = `module_${deck.moduleTitle.split(':')[0].trim()}`;
            addTimeSpent(moduleId, deck.moduleTitle, 10); // Track every 10 seconds
        }, 10000);

        return () => clearInterval(interval);
    }, [deck]);

    // Mark module as complete when user reaches last slide
    useEffect(() => {
        if (!deck || !deck.slides) return;
        
        if (currentSlideIdx === deck.slides.length - 1) {
            const moduleId = `module_${deck.moduleTitle.split(':')[0].trim()}`;
            completeModule(moduleId, deck.moduleTitle);
            success(`🎉 Module "${deck.moduleTitle}" completed!`);
        }
    }, [currentSlideIdx, deck]);

    useEffect(() => {
        setPodcastState({ status: PodcastStatus.IDLE });
    }, [deck?.moduleTitle]);

    const handlePodcastStatusChange = (status: PodcastStatus) => {
        setPodcastState(prev => ({ ...prev, status }));
    };

    const handleGeneratePodcast = async () => {
        if (!deck) return;
        
        try {
            // Check cache first
            const cached = await loadPodcastFromCache(deck.moduleTitle);
            if (cached) {
                setPodcastState({ 
                    status: PodcastStatus.READY, 
                    script: cached.script, 
                    audioBuffer: cached.audioBuffer 
                });
                success("🎧 Podcast loaded from cache!");
                return;
            }

            // Generate new podcast
            setPodcastState({ status: PodcastStatus.GENERATING_SCRIPT });
            const script = await generatePodcastScript(deck.moduleTitle, context);
            if (!script) { 
                setPodcastState({ status: PodcastStatus.ERROR }); 
                showError("Failed to generate podcast script");
                return; 
            }

            setPodcastState({ status: PodcastStatus.GENERATING_AUDIO, script });
            const audioData = await generatePodcastAudio(script);
            if (!audioData) { 
                setPodcastState({ status: PodcastStatus.ERROR }); 
                showError("Failed to generate podcast audio");
                return; 
            }

            const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const buffer = await decodeAudioData(audioData, tempCtx, 24000, 1);
            tempCtx.close();
            
            // Save to cache
            await savePodcastToCache(deck.moduleTitle, script, buffer);
            
            setPodcastState({ status: PodcastStatus.READY, script, audioBuffer: buffer });
            success("🎧 Podcast ready! Press play to listen.");
        } catch (e) {
            setPodcastState({ status: PodcastStatus.ERROR });
            showError("Something went wrong generating the podcast");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="relative">
                    <div className="w-16 h-16 bg-blue-100 rounded-full animate-ping opacity-75 absolute inset-0"></div>
                    <div className="relative w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    if (!deck || !deck.slides || deck.slides.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-3xl shadow-sm m-4">
                <BookOpen className="w-16 h-16 text-slate-200 mb-6" />
                <p className="text-slate-500 font-medium mb-6">Select a module to start learning.</p>
                <button onClick={onRefresh} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-transform active:scale-95">Refresh Content</button>
            </div>
        );
    }

    const slide = deck.slides[currentSlideIdx];
    const isPodcastActive = podcastState.status === PodcastStatus.READY || podcastState.status === PodcastStatus.PLAYING || podcastState.status === PodcastStatus.GENERATING_AUDIO || podcastState.status === PodcastStatus.GENERATING_SCRIPT;

    return (
        <div className="h-full flex flex-col overflow-hidden gap-6 lg:gap-8">
            <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 overflow-hidden">

                {/* Left: Reading Content (Card) */}
                <div className={`flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 md:p-14 lg:p-16 overflow-y-auto scrollbar-hide order-2 lg:order-1 transition-all duration-500 ${isPodcastActive ? 'lg:max-w-[55%]' : 'lg:max-w-[65%]'} relative`}>

                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[10rem] -z-0 opacity-50"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Slide {currentSlideIdx + 1} / {deck.slides.length}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentSlideIdx(prev => Math.max(0, prev - 1))}
                                    disabled={currentSlideIdx === 0}
                                    className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setCurrentSlideIdx(prev => Math.min(deck.slides.length - 1, prev + 1))}
                                    disabled={currentSlideIdx === deck.slides.length - 1}
                                    className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-10 leading-tight tracking-tight">
                            {slide.title}
                        </h1>

                        <div className="space-y-8 mb-14">
                            {(slide.bullets || []).map((bullet, idx) => (
                                <div key={idx} className="flex gap-5 group">
                                    <span className="mt-3 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors shrink-0" />
                                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                                        {renderBullet(bullet)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8 border-t border-slate-100 pt-10">
                            {/* Example */}
                            {slide.practicalExample && (
                                <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Lightbulb className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Applied to {context.name}</div>
                                    </div>
                                    <p className="text-slate-700 italic leading-relaxed text-base font-medium">
                                        "{slide.practicalExample}"
                                    </p>
                                </div>
                            )}

                            {/* Coach Insight */}
                            {slide.tutorNotes && (
                                <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Info className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Coach's Insight</div>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed text-base">
                                        {slide.tutorNotes}
                                    </p>
                                </div>
                            )}

                            {/* Deep Dive */}
                            {slide.detailedExplanation && (
                                <div className="bg-blue-50/30 p-8 rounded-3xl border border-blue-100/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Deep Dive</div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-base">
                                        {slide.detailedExplanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Visual & Podcast */}
                <div className="flex-1 flex flex-col gap-6 lg:gap-8 order-1 lg:order-2">
                    <div className={`transition-all duration-500 ease-in-out flex flex-col ${isPodcastActive ? 'h-[45%] lg:h-[50%]' : 'flex-1'} bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative`}>
                        {/* Visual Container */}
                        <div className="absolute inset-0 bg-slate-50/30"></div>
                        <div className="relative z-10 flex-1 flex items-center justify-center p-8 md:p-10">
                            {slide.visualType !== 'NONE' ? (
                                <div className="w-full max-w-lg">
                                    <VisualRenderer slide={slide} />
                                </div>
                            ) : (
                                <div className="text-slate-300 font-medium italic">No visual content available</div>
                            )}
                        </div>
                    </div>

                    {/* Podcast Container */}
                    <div className={`transition-all duration-500 ease-in-out flex flex-col ${isPodcastActive ? 'h-[55%] lg:h-[50%]' : 'flex-none'}`}>
                        <PodcastPlayer
                            podcastState={podcastState}
                            handleGenerate={handleGeneratePodcast}
                            onStatusChange={handlePodcastStatusChange}
                            className="h-full"
                            moduleTitle={deck.moduleTitle}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
