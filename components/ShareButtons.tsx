'use client';

import { Facebook, MessageCircle, Send, Link as LinkIcon, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!url) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md" aria-label="Share on Facebook">
        <Facebook size={24} />
      </a>
      <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md" aria-label="Share on WhatsApp">
        <MessageCircle size={24} />
      </a>
      <a href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md" aria-label="Share on Telegram">
        <Send size={24} />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#E1306C] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md" aria-label="Instagram">
        <Instagram size={24} />
      </a>
      <button onClick={handleCopy} className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md relative" aria-label="Copy Link">
        <LinkIcon size={24} />
        {copied && <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">Copied!</span>}
      </button>
    </div>
  );
}
