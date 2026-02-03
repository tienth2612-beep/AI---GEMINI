"use client";
import { X, Download, Printer, Copy, Check, Mail } from "lucide-react";
import { useState } from "react";

export default function PreviewPanel({ content, onClose }: { content: string, onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white shadow-2xl">
      <div className="h-14 border-b flex items-center justify-between px-4 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">AI</div>
          <span className="text-sm font-bold text-gray-700 truncate max-w-[150px]">Invoice_Draft.pdf</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded text-gray-500"><Printer size={16}/></button>
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 hover:bg-gray-100 rounded text-gray-500">
            {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
          </button>
          <button className="hidden md:flex bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold items-center gap-2 ml-2">
            <Download size={14}/> Download
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 ml-1"><X size={20}/></button>
        </div>
      </div>
      <div className="flex-1 bg-gray-100 p-4 md:p-8 overflow-auto custom-scrollbar">
        <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden min-h-[800px]">
          <iframe srcDoc={content} className="w-full h-full min-h-[800px] border-none" title="Invoice Preview" />
        </div>
      </div>
    </div>
  );
}