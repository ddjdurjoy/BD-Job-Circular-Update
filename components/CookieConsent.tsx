'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Delay showing the popup slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:max-w-md md:left-4 md:bottom-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-5 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">Cookie Consent</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          We use cookies to personalize content, provide social media features, and analyze our traffic. By continuing to use our site, you accept our use of cookies.
        </p>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={acceptCookies}
            className="flex-1 bg-[#006a4e] hover:bg-[#00523b] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Accept All
          </button>
          <Link 
            href="/privacy-policy"
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
