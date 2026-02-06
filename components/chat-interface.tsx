// App/chat-interface.tsx
"use client";

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { 
  Send, Image as ImageIcon, Mic, Paperclip, Sparkles, 
  ChevronDown, PlusCircle, UserCircle, Cpu, Zap, X, FileText, 
  Menu 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSmartInvoiceData } from '@/lib/invoice-engine';

const MODELS = [
  { id: 'gpt-4o', name: 'Gemini 1.5 Pro', icon: <Cpu size={16}/> },
  { id: 'gpt-4o-mini', name: 'Gemini 1.5 Flash', icon: <Zap size={16}/> },
];

const LogoAnimated = () => (
    <div className="relative w-12 h-12 md:w-16 md:h-16 mb-6 md:mb-8 flex items-center justify-center">
      <motion.div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-indigo-500 to-purple-600 rounded-[20px] blur-xl opacity-40"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity }} />
      <motion.div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-[18px] flex items-center justify-center shadow-lg text-white">
        <Sparkles size={32} className="fill-white md:scale-125" />
      </motion.div>
    </div>
);

export default function ChatInterface({ onPreview, currentId, chats, setChats, onOpenSettings, isSidebarOpen, setIsSidebarOpen }: any) {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  
  // State vị trí (mặc định để 80% cho thấp xuống)
  const [inputPos, setInputPos] = useState({ top: "80%", y: "-50%" });

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<string | null>(null); 
  const isResetting = useRef(false); 

  const currentChat = chats.find((c: any) => c.id === currentId);

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, setInput } = useChat({
    api: '/api/chat',
    body: { model: selectedModel.id },
    initialMessages: currentChat?.messages || [],
  });

  // --- LOGIC VỊ TRÍ MỚI (ĐÃ HẠ THẤP XUỐNG) ---
  useLayoutEffect(() => {
    const handleResize = () => {
        const w = window.innerWidth;

        // 1. Mobile/Tablet (< 1024px): Luôn bắt đầu từ đáy
        if (w < 1024) {
            setInputPos({ top: "100%", y: "-100%" });
        } 
        // 2. Desktop:
        // Đã sửa từ 60% thành 80% để hạ thấp thanh chat xuống, tránh dính vào nút gợi ý
        else {
            setInputPos({ top: "70%", y: "-50%" });
        }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    isResetting.current = true;
    const chatMessages = currentChat?.messages || [];
    setMessages(chatMessages);
    setInput("");
    triggerRef.current = null;
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setTimeout(() => { isResetting.current = false; }, 100);
  }, [currentId, setMessages, setInput]);

  useEffect(() => {
    if (messages.length > 0 && currentId && !isResetting.current) {
      setChats((prev: any) => prev.map((chat: any) => {
        if (chat.id === currentId) {
          const newTitle = (chat.title === "New Conversation" || chat.title === "New Chat") 
            ? (messages[0].content.substring(0, 30) + "...") 
            : chat.title;
          return { ...chat, messages: messages, title: newTitle };
        }
        return chat;
      }));
    }
  }, [messages, currentId, setChats]);

  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant' && !isLoading && last.content.includes("[DATA]")) {
        if (triggerRef.current !== last.id) {
          triggerRef.current = last.id;
          const invoiceData = generateSmartInvoiceData(last.content);
          if (invoiceData) onPreview(invoiceData);
        }
      }
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading, onPreview]);

  const toggleListening = () => {
    const Speech = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!Speech) return alert("Trình duyệt không hỗ trợ Mic");
    const rec = new Speech();
    rec.lang = 'vi-VN';
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => setInput(input + " " + e.results[0][0].transcript);
    rec.onend = () => setIsListening(false);
    rec.start(); 
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full relative bg-white overflow-hidden">
      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
      
      {/* HEADER */}
      <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md z-[50] sticky top-0 w-full shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all lg:hidden`}
          >
            <Menu size={24}/>
          </button>

          <div className="relative">
            <button onClick={() => setIsModelOpen(!isModelOpen)} className="flex items-center gap-2 hover:bg-slate-50 px-3 py-1.5 md:py-2 rounded-xl font-medium text-slate-700 text-sm border border-transparent hover:border-slate-200 transition-all">
              <span className={`text-blue-600 ${isModelOpen ? 'opacity-100' : 'opacity-70'}`}>{selectedModel.icon}</span> 
              <span className="hidden md:inline font-bold">{selectedModel.name}</span> 
              <span className="md:hidden font-bold">Gemini</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isModelOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isModelOpen && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-full left-0 mt-2 w-60 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-[60]">
                  {MODELS.map(m => (
                    <div key={m.id} onClick={() => { setSelectedModel(m); setIsModelOpen(false); }} className={`flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors ${selectedModel.id === m.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}>
                      <div className="p-2 bg-white border border-slate-100 shadow-sm rounded-lg">{m.icon}</div>
                      <span className="text-sm font-bold">{m.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <button onClick={onOpenSettings} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><UserCircle size={28} className="text-slate-300 md:w-8 md:h-8" /></button>
      </div>

      {/* MESSAGES AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-0 pt-6 pb-48 custom-scrollbar scroll-smooth">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center px-4 min-h-[500px]">
            <LogoAnimated />
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 text-center tracking-tight mb-8 md:mb-12">
                How can I help you today?
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-[750px]">
               {['Create smart invoice', 'Draft a business email', 'Analyze market data', 'Explain AI architecture'].map((t) => (
                 <div key={t} onClick={() => setInput(t)} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-white hover:border-blue-300 hover:shadow-md cursor-pointer font-medium text-slate-600 text-[15px] flex justify-between items-center group transition-all duration-200">
                    {t} <div className="p-1 bg-white rounded-full border border-slate-100 group-hover:border-blue-100"><PlusCircle size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" /></div>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
            {messages.map((m: any) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={m.id} className={`flex gap-4 md:gap-6 mb-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-1">
                        <Sparkles size={14} />
                    </div>
                )}
                <div className={`
                    py-3 px-4 md:p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap max-w-[90%] md:max-w-[85%] 
                    ${m.role === 'user' 
                        ? 'bg-[#f0f4f9] text-slate-900 font-medium rounded-br-sm' 
                        : 'bg-white border border-slate-100 text-slate-800 shadow-none px-0 border-none'}
                `}>
                  {m.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-4 md:gap-6 justify-start">
                 <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
                 <div className="text-slate-400 text-sm py-2">Gemini is thinking...</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <motion.div 
        layout 
        initial={false}
        animate={
            isEmpty 
            ? { ...inputPos, bottom: "auto" } 
            // Fix "Mất ô chat": Ghim đáy khi đang chat
            : { top: "auto", y: "0%", bottom: 0 } 
        }
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        className={`absolute left-0 right-0 p-4 md:p-6 z-[60] pointer-events-none 
            ${isEmpty ? '' : 'bg-gradient-to-t from-white via-white to-transparent'}
        `}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); setAttachments([]); }} className="max-w-3xl mx-auto relative group pointer-events-auto">
          {attachments.length > 0 && (
             <div className="flex gap-2 mb-3 overflow-x-auto pb-1 custom-scrollbar px-1">
                {attachments.map((f, i) => (
                  <div key={i} className="flex-shrink-0 bg-white border border-slate-200 text-slate-700 pl-3 pr-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm">
                    <FileText size={14} className="text-blue-500"/> 
                    <span className="truncate max-w-[120px]">{f.name}</span>
                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="p-1 hover:bg-slate-100 rounded-md"><X size={12}/></button>
                  </div>
                ))}
             </div>
          )}

          <div className={`
            bg-[#f0f4f9] focus-within:bg-white rounded-[26px] p-2 flex items-end gap-2 
            focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-lg transition-all duration-300 
            border border-transparent focus-within:border-blue-200
            ${isEmpty ? 'shadow-sm' : ''}
          `}>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-full transition-colors"><Paperclip size={22}/></button>
            <textarea 
                ref={textareaRef}
                className="flex-1 bg-transparent border-none focus:ring-0 py-3.5 px-2 resize-none text-[16px] max-h-[150px] outline-none font-medium text-slate-800 placeholder:text-slate-500"
                placeholder={isListening ? "Listening..." : "Enter a prompt here"}
                rows={1} value={input} 
                onChange={(e) => { handleInputChange(e); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if(input.trim()) handleSubmit(e); setAttachments([]); } }} 
            />
            
            <div className="flex gap-1 pb-1 items-center">
               <button type="button" onClick={() => imageInputRef.current?.click()} className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-full transition-colors"><ImageIcon size={20}/></button>
               <button type="button" onClick={toggleListening} className={`p-2.5 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}><Mic size={20}/></button>
               
               <button 
                type="submit" 
                disabled={!input.trim()} 
                className={`p-2.5 rounded-full transition-all ${input.trim() ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
               >
                 <Send size={18}/>
               </button>
            </div>
          </div>
          <div className="text-center mt-2 hidden md:block">
             <p className="text-[11px] text-slate-400">Gemini can make mistakes, so double-check it.</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}