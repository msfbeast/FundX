
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, placeholder }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
        {(!messages || messages.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">How can I help you today?</h3>
                <p className="text-slate-500 max-w-xs mx-auto">I can critique your pitch, explain valuations, or help you draft emails.</p>
            </div>
        )}
        {(messages || []).map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[85%] md:max-w-[75%] rounded-3xl p-5 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
              }`}
            >
              <div className="w-full min-w-0">
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                ) : (
                  <MarkdownRenderer content={msg.content} />
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl rounded-tl-none p-5 shadow-sm flex items-center space-x-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-slate-500 text-sm font-medium">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-50">
        <form onSubmit={handleSubmit} className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder || "Type your message..."}
            className="flex-1 pl-6 pr-14 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-blue-50/50 outline-none text-slate-900 font-medium transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
