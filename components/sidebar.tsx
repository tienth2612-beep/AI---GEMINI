"use client";
import { Menu, Plus, MessageSquare, Settings, ChevronLeft, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar({ isOpen, setIsOpen, onNewChat, chats, currentId, onSelect }: any) {
  return (
    <motion.div 
      animate={{ width: isOpen ? 280 : 72 }}
      className="h-full bg-[#f9fbff] p-4 flex flex-col border-r border-gray-100 transition-all duration-500 relative overflow-hidden"
    >
      {/* Nút Menu: Luôn hiển thị để ấn ra/vào */}
      <div className="flex items-center mb-8 h-10">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-3 hover:bg-gray-200 rounded-full transition-all text-gray-500 active:scale-90"
        >
          {isOpen ? <ChevronLeft size={22} /> : <Menu size={22} />}
        </button>
        
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 ml-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"><Sparkles size={14} className="text-white fill-white" /></div>
            <span className="font-black text-sm text-slate-800 uppercase tracking-tighter">Gemini Pro</span>
          </motion.div>
        )}
      </div>

      <button 
        onClick={onNewChat}
        className={`flex items-center gap-3 bg-white hover:bg-blue-50 border border-gray-200/60 p-4 rounded-2xl transition-all shadow-sm active:scale-95 group
        ${!isOpen ? 'w-10 h-10 justify-center p-0 mx-auto' : 'w-full'}`}
      >
        <Plus size={20} className="text-blue-600 shrink-0" />
        {isOpen && <span className="text-sm font-black text-slate-700">New Chat</span>}
      </button>

      <div className="flex-1 mt-10 space-y-2 overflow-y-auto custom-scrollbar pr-1">
        {isOpen && <p className="text-[10px] font-black px-4 mb-5 text-gray-300 uppercase tracking-widest leading-none">History (Session)</p>}
        {chats.map((chat: any) => (
          <div 
            key={chat.id} onClick={() => onSelect(chat.id)} 
            className={`flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all border whitespace-nowrap overflow-hidden
            ${currentId === chat.id ? 'bg-blue-50 border-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100/50 border-transparent text-gray-400'}
            ${!isOpen ? 'justify-center mx-auto w-10 h-10 p-0' : ''}`}
          >
            <MessageSquare size={18} className="shrink-0" />
            {isOpen && <span className="text-sm truncate font-bold">{chat.title}</span>}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className={`flex items-center gap-4 p-4 hover:bg-gray-100 rounded-2xl cursor-pointer transition-all ${!isOpen ? 'justify-center mx-auto w-10 h-10 p-0' : ''}`}>
          <Settings size={20} className="text-gray-400 shrink-0" />
          {isOpen && <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Settings</span>}
        </div>
      </div>
    </motion.div>
  );
}