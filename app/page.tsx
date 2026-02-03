"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import ChatInterface from "../components/chat-interface";
import PreviewPanel from "../components/preview-panel";
import { AnimatePresence, motion } from "framer-motion";

export default function GeminiPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const id = Date.now().toString();
    setChats([{ id, title: "New Conversation", messages: [] }]);
    setCurrentChatId(id);
    setIsLoaded(true);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, []);

  const createNewChat = () => {
    const id = Date.now().toString();
    setChats(prev => [{ id, title: "New Conversation", messages: [] }, ...prev]);
    setCurrentChatId(id);
    setIsPreviewOpen(false);
  };

  if (!isLoaded) return null;

  return (
    <main className="flex h-screen w-full bg-[#f8fafd] overflow-hidden relative">
      
      {/* SIDEBAR DUY NHẤT: Quản lý đóng mở tại đây */}
      <div className={`
        fixed inset-y-0 left-0 z-[100] md:relative 
        transition-all duration-500 ease-in-out
        ${isSidebarOpen ? 'w-[280px]' : 'w-0 md:w-[72px] -translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          onNewChat={createNewChat}
          chats={chats}
          currentId={currentChatId}
          onSelect={(id: string) => { setCurrentChatId(id); setIsPreviewOpen(false); }}
        />
      </div>

      {/* Lớp phủ cho Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>
      
      <div className="flex-1 relative bg-white md:m-2 md:rounded-[32px] md:border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-500">
        <div className={`flex flex-col h-full transition-all duration-700 ${isPreviewOpen ? 'md:w-1/2 w-full shrink-0 opacity-30 md:opacity-100' : 'w-full'}`}>
          {/* Không còn truyền onToggleSidebar vào đây nữa */}
          <ChatInterface 
            onPreview={(html: string) => { setHtmlContent(html); setIsPreviewOpen(true); }}
            currentId={currentChatId}
            chats={chats}
            setChats={setChats}
          />
        </div>

        <AnimatePresence>
          {isPreviewOpen && (
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 150 }}
              className="fixed inset-0 md:relative md:w-1/2 w-full h-full bg-white z-[120] md:z-20 border-l border-gray-100 flex flex-col shadow-2xl"
            >
              <PreviewPanel content={htmlContent} onClose={() => setIsPreviewOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}