import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Send, MessageCircle } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-12 border-t-4 border-[#006a4e]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="50" fill="#006a4e" />
                  <circle cx="45" cy="50" r="30" fill="#f42a41" />
                </svg>
              </div>
              BD Job Circular Update
            </h3>
            <p className="text-sm leading-relaxed text-gray-400 font-bengali">
              বাংলাদেশের অন্যতম নির্ভরযোগ্য চাকরির খবর পোর্টাল। সরকারি, বেসরকারি, ব্যাংক, এনজিও সহ সকল প্রকার চাকরির সর্বশেষ আপডেট পান সবার আগে।
            </p>
          </div>

          {/* Column 2: Important Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Important Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#006a4e] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#006a4e] transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#006a4e] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#006a4e] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-[#006a4e] transition-colors">Disclaimer</Link></li>
              <li><AdminLoginModal /></li>
            </ul>
          </div>

          {/* Column 3: Social Connect */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Connect With Us</h3>
            <p className="text-sm mb-4 text-gray-400">Join our community to get instant job updates.</p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:opacity-90 transition-opacity" aria-label="Telegram">
                <Send size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#E1306C] flex items-center justify-center text-white hover:opacity-90 transition-opacity" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 mt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BD Job Circular Update. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
