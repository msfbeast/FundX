
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Mic, Phone, PhoneOff, Activity, Volume2, AlertCircle } from 'lucide-react';
import { StartupContext } from '../types';
import { COACH_PERSONA_PROMPT, MASTERCLASS_CONTENT } from '../constants';
import { createBlob, decode, decodeAudioData } from '../utils/audio';

interface LiveVoiceInterfaceProps {
  context: StartupContext;
}

interface TranscriptEntry {
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const LiveVoiceInterface: React.FC<LiveVoiceInterfaceProps> = ({ context }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // AI is speaking
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [showTranscript, setShowTranscript] = useState(true);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  
  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Session Refs
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  const startSession = async () => {
    setError(null);
    try {
      const apiKey = process.env.API_KEY || '';
      if (!apiKey) throw new Error("API Key not found in environment");
      const ai = new GoogleGenAI({ apiKey });

      // 1. Setup Audio Contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      // 2. Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Setup Gemini Live Session
      const systemInstruction = `${COACH_PERSONA_PROMPT}
      
      You are currently in a VOICE CALL with the founder.
      You are acting as a skeptical Venture Capitalist (VC).
      You are interviewing the founder of "${context.name}" (${context.stage} stage).
      Description: ${context.description}

      Your goal:
      1. Ask short, punchy questions from Module 10 (Tough Questions).
      2. Challenge their assumptions.
      3. Be polite but professional and firm.
      4. Keep responses concise (under 30 seconds) to allow for back-and-forth.
      
      MASTERCLASS KNOWLEDGE:
      ${MASTERCLASS_CONTENT}
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onopen: () => {
            if (!mountedRef.current) return;
            setIsConnected(true);
            
            // Start Input Streaming
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              if (!mountedRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session: any) => {
                 session.sendRealtimeInput({ media: pcmBlob });
              }).catch((e) => {
                  console.debug("Session not ready or failed to send input", e);
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (!mountedRef.current) return;

            // Capture AI text response for transcript
            const textResponse = message.serverContent?.modelTurn?.parts?.find(p => p.text)?.text;
            if (textResponse && mountedRef.current) {
              setTranscript(prev => [...prev, {
                speaker: 'ai',
                text: textResponse,
                timestamp: new Date()
              }]);
            }

            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current;
              if (ctx && ctx.state !== 'closed') {
                // Ensure correct timing for smooth playback
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                try {
                    const audioBuffer = await decodeAudioData(
                      decode(base64Audio),
                      ctx,
                      24000,
                      1
                    );
                    
                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    const node = ctx.createGain();
                    node.gain.value = 1.0; 
                    source.connect(node);
                    node.connect(ctx.destination);
                    
                    source.onended = () => {
                       sourcesRef.current.delete(source);
                       if (sourcesRef.current.size === 0 && mountedRef.current) setIsSpeaking(false);
                    };
                    
                    source.start(nextStartTimeRef.current);
                    sourcesRef.current.add(source);
                    nextStartTimeRef.current += audioBuffer.duration;
                } catch (e) {
                    console.error("Audio decoding error", e);
                }
              }
            }
            
            // Handle Interruption
            if (message.serverContent?.interrupted) {
               sourcesRef.current.forEach(s => {
                   try { s.stop(); } catch(e) {}
               });
               sourcesRef.current.clear();
               nextStartTimeRef.current = 0;
               if (mountedRef.current) setIsSpeaking(false);
            }
          },
          onclose: () => {
            if (mountedRef.current) {
                setIsConnected(false);
                stopSession();
            }
          },
          onerror: (e) => {
            console.error(e);
            if (mountedRef.current) {
                setError("Connection error. Please try again.");
                stopSession();
            }
          }
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start session:", err);
      if (mountedRef.current) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(`Connection failed: ${errorMessage}`);
          stopSession();
      }
    }
  };

  const stopSession = async () => {
    setIsConnected(false);
    setIsSpeaking(false);

    // Close Audio Contexts safely
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
       try {
         await inputAudioContextRef.current.close();
       } catch (e) {
         console.debug("Input AudioContext cleanup error:", e);
       }
    }
    
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
       try {
         await outputAudioContextRef.current.close();
       } catch (e) {
         console.debug("Output AudioContext cleanup error:", e);
       }
    }
    
    // Stop Media Stream
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
  };

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopSession();
    };
  }, []);

  return (
    <div className="flex h-full bg-slate-900 text-white rounded-xl overflow-hidden relative gap-4 p-4">
      
      {/* Transcript Panel */}
      {showTranscript && (
        <div className="w-96 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Transcript
            </h3>
            <button
              onClick={() => setShowTranscript(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Hide
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {transcript.length === 0 ? (
              <p className="text-slate-500 text-sm text-center mt-8">
                Transcript will appear here during the call...
              </p>
            ) : (
              transcript.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    entry.speaker === 'ai'
                      ? 'bg-purple-900/30 border border-purple-700/30'
                      : 'bg-blue-900/30 border border-blue-700/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${
                      entry.speaker === 'ai' ? 'text-purple-400' : 'text-blue-400'
                    }`}>
                      {entry.speaker === 'ai' ? 'VC Investor' : 'You'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{entry.text}</p>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}

      {/* Main Voice Interface */}
      <div className="flex-1 flex flex-col items-center justify-center rounded-xl overflow-hidden relative">
      
      {/* Visualizer Background Effect */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isConnected ? 'opacity-20' : 'opacity-0'}`}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
         {isSpeaking && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-75"></div>}
      </div>

      <div className="z-10 text-center p-8 max-w-md">
        <div className="mb-8 relative">
           <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isConnected ? (isSpeaking ? 'border-purple-400 bg-purple-900/50 scale-110 shadow-[0_0_30px_rgba(168,85,247,0.5)]' : 'border-blue-400 bg-blue-900/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]') : 'border-slate-700 bg-slate-800'}`}>
              {isConnected ? (
                  isSpeaking ? <Volume2 className="w-12 h-12 text-purple-300 animate-pulse" /> : <Mic className="w-12 h-12 text-blue-300" />
              ) : (
                  <PhoneOff className="w-12 h-12 text-slate-500" />
              )}
           </div>
           {isConnected && (
             <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-green-500 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-slate-900">
               LIVE
             </div>
           )}
        </div>

        <h2 className="text-2xl font-bold mb-2">
            {isConnected ? (isSpeaking ? "Investor is speaking..." : "Listening to you...") : "Mock VC Call"}
        </h2>
        <p className="text-slate-400 mb-8 h-6">
            {error ? <span className="text-red-400 flex items-center justify-center gap-1"><AlertCircle className="w-4 h-4"/> {error}</span> : 
             isConnected ? "Speak clearly. Interrupt if needed." : "Ready to practice your pitch?"}
        </p>

        {!isConnected ? (
          <button 
            onClick={startSession}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg flex items-center gap-3 mx-auto transition-transform hover:scale-105 active:scale-95"
          >
            <Phone className="w-6 h-6" /> Start Interview
          </button>
        ) : (
          <button 
            onClick={stopSession}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg flex items-center gap-3 mx-auto transition-transform hover:scale-105 active:scale-95"
          >
            <PhoneOff className="w-6 h-6" /> End Call
          </button>
        )}
        
        <div className="mt-8 text-xs text-slate-500 max-w-xs mx-auto">
            <p>Model: Gemini 2.5 Flash Native Audio</p>
            <p>Latency: Real-time</p>
        </div>

        {!showTranscript && (
          <button
            onClick={() => setShowTranscript(true)}
            className="mt-4 text-sm text-slate-400 hover:text-white flex items-center gap-2 mx-auto"
          >
            <Activity className="w-4 h-4" />
            Show Transcript
          </button>
        )}
      </div>
      </div>
    </div>
  );
};
