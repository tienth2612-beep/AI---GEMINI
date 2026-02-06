"use client";
import { Menu, Plus, MessageSquare, Settings, ChevronLeft, X } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar({ isOpen, setIsOpen, onNewChat, chats, currentId, onSelect, onOpenSettings, onDeleteChat }: any) {
  return (
    <motion.div animate={{ width: isOpen ? 280 : 72 }} className="h-full bg-slate-50 p-4 flex flex-col border-r border-slate-200 relative overflow-hidden">
      <div className="flex items-center mb-8 h-10">
        <button onClick={() => setIsOpen(!isOpen)} className="p-3 hover:bg-slate-200 rounded-xl transition-all text-slate-500">
          {isOpen ? <ChevronLeft size={22} /> : <Menu size={22} />}
        </button>
        {isOpen && <span className="font-bold text-slate-800 ml-3 tracking-tighter italic uppercase">Gemini</span>}
      </div>

      <button onClick={onNewChat} className={`flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:bg-slate-100 transition-all ${!isOpen ? 'w-10 h-10 justify-center p-0 mx-auto' : 'w-full'}`}>
        <Plus size={20} className="text-blue-600" /> {isOpen && <span className="text-sm font-bold">New Chat</span>}
      </button>

      <div className="flex-1 mt-8 space-y-2 overflow-y-auto custom-scrollbar pr-1">
        {chats.map((chat: any) => (
          <div key={chat.id} className="group relative">
            <div onClick={() => onSelect(chat.id)} className={`flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer border whitespace-nowrap overflow-hidden transition-all ${currentId === chat.id ? 'bg-blue-100/50 text-blue-700 font-bold border-transparent' : 'hover:bg-slate-200/50 border-transparent text-slate-500 font-bold'}`}>
              <MessageSquare size={18} className="shrink-0" /> {isOpen && <span className="text-sm truncate pr-6">{chat.title}</span>}
            </div>
            {isOpen && <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 rounded-lg"><X size={14} /></button>}
          </div>
        ))}
      </div>

      <button onClick={onOpenSettings} className={`mt-auto flex items-center gap-4 p-4 hover:bg-slate-200 rounded-2xl w-full text-slate-500 transition-all ${!isOpen ? 'justify-center mx-auto w-10 h-10 p-0' : ''}`}>
        <Settings size={20} className="shrink-0" /> {isOpen && <span className="text-sm font-black uppercase tracking-widest">Settings</span>}
      </button>
    </motion.div>
  );
}