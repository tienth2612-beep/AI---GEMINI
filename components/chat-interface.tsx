"use client";

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from "react";
import { 
  Send, Image as ImageIcon, Mic, Paperclip, Sparkles, 
  ChevronDown, PlusCircle, UserCircle, Cpu, Zap, Check 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSmartInvoiceData } from '@/lib/invoice-engine';

// DANH SÁCH MODEL ĐẦY ĐỦ
const MODELS = [
  { id: 'gpt-4o', name: 'Gemini 1.5 Pro', icon: <Cpu size={16}/>, desc: 'Most capable model for complex tasks' },
  { id: 'gpt-4o-mini', name: 'Gemini 1.5 Flash', icon: <Zap size={16}/>, desc: 'Fast and efficient for daily chat' },
];

const LogoAnimated = () => (
  <div className="relative w-20 h-20 mb-10 flex items-center justify-center">
    <motion.div
      className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-500 to-pink-400 rounded-[24px] blur-2xl opacity-40"
      animate={{ scale: [1, 1.25, 1], rotate: [0, 360] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="relative w-full h-full bg-gradient-to-br from-[#4285f4] via-[#9b72cb] to-[#d96570] rounded-[22px] flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
        animate={{ x: ["-150%", "250%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
      />
      <Sparkles size={36} className="text-white fill-white drop-shadow-xl" />
    </motion.div>
  </div>
);

export default function ChatInterface({ onPreview, currentId, chats, setChats }: any) {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<string | null>(null);
  const currentChat = chats.find((c: any) => c.id === currentId);

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading } = useChat({
    api: '/api/chat',
    body: { model: selectedModel.id },
    initialMessages: currentChat?.messages || [],
  });

  useEffect(() => { setMessages(currentChat?.messages || []); }, [currentId]);

  useEffect(() => {
    if (messages.length > 0) {
      setChats((prev: any) => prev.map((c: any) => c.id === currentId ? { ...c, messages } : c));
    }
    const last = messages[messages.length - 1];
    if (last?.role === 'assistant' && !isLoading && last.content.includes("[DATA]")) {
      if (triggerRef.current !== last.id) {
        triggerRef.current = last.id;
        onPreview(generateSmartInvoiceData(last.content));
        last.content = "Hóa đơn đã được khởi tạo thành công.";
      }
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full relative bg-white overflow-hidden">
      
      {/* TOP BAR VỚI MODEL SELECTOR ĐÃ SỬA LỖI */}
      <div className="h-16 flex items-center justify-between px-6 md:px-8 bg-white/50 backdrop-blur-md z-[100] shrink-0">
        <div className="relative">
          <button 
            type="button"
            onClick={() => setIsModelOpen(!isModelOpen)} 
            className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-2xl font-black text-slate-700 text-[14px] transition-all border border-gray-100 shadow-sm"
          >
            <span className="text-blue-600">{selectedModel.icon}</span>
            {selectedModel.name} 
            <ChevronDown size={14} className={`transition-transform duration-300 ${isModelOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* DROPDOWN MENU */}
          <AnimatePresence>
            {isModelOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 shadow-2xl rounded-[2rem] overflow-hidden z-[110] p-2"
              >
                {MODELS.map((m) => (
                  <div 
                    key={m.id} 
                    onClick={() => { setSelectedModel(m); setIsModelOpen(false); }} 
                    className={`flex items-center gap-4 px-4 py-4 hover:bg-blue-50/50 cursor-pointer rounded-2xl transition-all ${selectedModel.id === m.id ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedModel.id === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {m.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-black ${selectedModel.id === m.id ? 'text-blue-700' : 'text-slate-700'}`}>{m.name}</p>
                      <p className="text-[11px] text-gray-400 font-medium leading-tight">{m.desc}</p>
                    </div>
                    {selectedModel.id === m.id && <Check size={18} className="text-blue-600 shrink-0" />}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <UserCircle size={32} className="text-gray-200 hidden md:block" />
      </div>

      {/* MESSAGES AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-16 lg:px-44 pt-10 pb-48 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-12 md:mt-20 text-left flex flex-col items-start">
            <LogoAnimated />
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-[1000] mb-8 tracking-tighter leading-tight text-slate-900"
            >
               Hello, Admin.<br />
               <span className="bg-gradient-to-r from-blue-600 via-indigo-400 to-gray-300 bg-clip-text text-transparent italic">How can I assist?</span>
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
               {['Create smart invoice', 'Draft a business email', 'Analyze market data', 'Explain AI architecture'].map((t, i) => (
                 <div key={i} onClick={() => handleInputChange({target: {value: t}} as any)} className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-all font-black text-slate-500 text-sm shadow-sm flex justify-between items-center group">
                    {t}
                    <PlusCircle size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                 </div>
               ))}
            </div>
          </div>
        ) : (
          messages.map((m: any) => (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key={m.id} className={`flex gap-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-5 rounded-[2.5rem] text-[17px] shadow-sm border ${
                m.role === 'user' ? 'bg-slate-900 border-slate-800 text-white rounded-tr-sm max-w-[85%] px-8 font-semibold' : 'bg-white border-gray-100 text-slate-800 w-full font-medium leading-relaxed text-left'
              }`}>{m.content}</div>
            </motion.div>
          ))
        )}
      </div>

      {/* INPUT BAR VỚI ĐẦY ĐỦ TÙY CHỌN */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 bg-gradient-to-t from-white via-white/80 to-transparent">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
          <div className="bg-[#f0f4f9] rounded-[32px] md:rounded-[45px] p-2 md:p-4 flex items-end gap-1 md:gap-3 focus-within:bg-white focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-2 border-transparent focus-within:border-blue-50 transition-all duration-500">
            <button type="button" className="p-3 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><PlusCircle size={24}/></button>
            <textarea className="flex-1 bg-transparent border-none focus:ring-0 py-3 md:py-4 px-1 md:px-2 resize-none text-[16px] max-h-40 outline-none font-bold text-slate-800" placeholder="Ask anything..." rows={1} value={input} onChange={handleInputChange} />
            <div className="flex gap-1 md:gap-2 pr-2 pb-2 items-center">
              <button type="button" className="hidden sm:flex p-3 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><Paperclip size={22}/></button>
              <button type="button" className="hidden sm:flex p-3 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><ImageIcon size={22}/></button>
              <button type="button" className="hidden sm:flex p-3 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><Mic size={22}/></button>
              <button type="submit" disabled={!input.trim()} className={`p-4 rounded-full transition-all ${input.trim() ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105 active:scale-95' : 'text-gray-400 opacity-40'}`}><Send size={24}/></button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}