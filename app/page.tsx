"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import ChatInterface from "../components/chat-interface";
import PreviewPanel from "../components/preview-panel";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react"; 

export default function GeminiPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 
  
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedChats = localStorage.getItem("gemini_final_history_v8");
    const savedId = localStorage.getItem("gemini_final_id_v8");
    
    if (savedChats && savedChats !== "[]") {
      const parsed = JSON.parse(savedChats);
      setChats(parsed);
      setCurrentChatId(savedId || (parsed[0]?.id || ""));
    } else {
      createNewChat();
    }
    setIsLoaded(true);

    // LOGIC RESPONSIVE BAN ĐẦU:
    // Mobile (<1024px): Mặc định đóng Sidebar để thoáng màn hình.
    // Desktop (>=1024px): Mặc định mở Sidebar.
    if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
    } else {
        setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && chats.length > 0) {
      localStorage.setItem("gemini_final_history_v8", JSON.stringify(chats));
      localStorage.setItem("gemini_final_id_v8", currentChatId);
    }
  }, [chats, currentChatId, isLoaded]);

  useEffect(() => {
    setIsPreviewOpen(false);
    setHtmlContent(""); 
  }, [currentChatId]);

  const createNewChat = () => {
    const id = Date.now().toString();
    const newChat = { id, title: "New Conversation", messages: [] };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(id);
    // Mobile: Tạo chat xong đóng sidebar ngay để user chat
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const deleteChat = (id: string) => {
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    if (currentChatId === id) {
      setCurrentChatId(updated[0]?.id || "");
    }
    if (updated.length === 0) createNewChat();
  };

  if (!isLoaded) return null;

  return (
    <main className="flex h-[100dvh] w-full bg-white text-slate-900 overflow-hidden relative font-sans">
      
      {/* 
        SIDEBAR WRAPPER (Responsive Logic):
        - Mobile/Tablet (< 1024px): Position FIXED, Z-Index cao. Hoạt động như Drawer trượt ra/vào.
        - Desktop (>= 1024px): Position RELATIVE. Hoạt động như Flex item đẩy nội dung bên phải.
      */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-[100] h-full bg-[#f0f4f9] lg:bg-slate-50 border-r border-slate-200
          transition-all duration-300 ease-in-out
          lg:relative lg:z-0
          ${isSidebarOpen 
            ? 'translate-x-0 w-[280px]' // Trạng thái mở (Chung)
            : '-translate-x-full lg:translate-x-0 lg:w-[72px]' // Trạng thái đóng: Mobile ẩn hẳn (-100%), PC thu nhỏ (72px)
          }
        `}
      >
        <Sidebar 
          isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onNewChat={createNewChat} 
          chats={chats} currentId={currentChatId} onSelect={(id: string) => {
            setCurrentChatId(id);
            // Mobile: Chọn chat xong thì đóng sidebar
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onDeleteChat={deleteChat}
        />
      </aside>

      {/* OVERLAY BACKDROP: Chỉ hiện trên Mobile khi mở Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[90]" 
          />
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 relative bg-white flex flex-col md:flex-row overflow-hidden transition-all duration-500">
        <div className={`flex flex-col h-full transition-all duration-500 ${isPreviewOpen ? 'lg:w-1/2 w-full shrink-0 border-r border-slate-200' : 'w-full'}`}>
          <ChatInterface 
            onPreview={(html: string) => { setHtmlContent(html); setIsPreviewOpen(true); }}
            currentId={currentChatId} chats={chats} setChats={setChats} onOpenSettings={() => setIsSettingsOpen(true)}
            isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
        
        {/* PREVIEW PANEL RESPONSIVE: Mobile Full màn hình, PC 50% */}
        <AnimatePresence>
          {isPreviewOpen && (
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed inset-0 lg:static lg:w-1/2 w-full h-full bg-white z-[120] lg:z-0 flex flex-col shadow-2xl lg:shadow-none"
            >
              <PreviewPanel content={htmlContent} onClose={() => setIsPreviewOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative z-[210] overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
              </div>
              <div className="space-y-3">
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full py-3 px-4 bg-red-50 text-red-600 hover:bg-red-100 transition-colors rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                    Delete all history
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}