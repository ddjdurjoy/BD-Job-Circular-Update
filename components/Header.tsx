'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Building2, Landmark, Briefcase, FileText, GraduationCap, Info, Bell } from 'lucide-react';
import { Job } from '@/lib/data';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Govt Job', href: '/category/govt-job', icon: Building2 },
  { name: 'Bank Job', href: '/category/bank-job', icon: Landmark },
  { name: 'Private Job', href: '/category/private-job', icon: Briefcase },
  { name: 'Result', href: '/category/result', icon: FileText },
  { name: 'Admit Card', href: '/category/admit-card', icon: FileText },
  { name: 'Career Guideline', href: '/category/career', icon: GraduationCap },
  { name: 'Important Notice', href: '/category/notice', icon: Info },
];

export default function Header({ jobs = [] }: { jobs?: Job[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
        // Also close mobile menu if open
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  const latestJobs = jobs.slice(0, 5);

  return (
    <header className={`w-full bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${!isVisible ? '-translate-y-full lg:translate-y-0' : 'translate-y-0'}`}>
      {/* Top Bar - Logo & Desktop Nav */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {/* SVG Logo inspired by BD Flag */}
          <div className="w-10 h-10 lg:w-12 lg:h-12 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <circle cx="50" cy="50" r="50" fill="#006a4e" />
              <circle cx="45" cy="50" r="30" fill="#f42a41" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl lg:text-2xl font-bold text-[#006a4e] leading-tight tracking-tight">
              BD Job Circular Update
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 font-bengali hidden sm:block">
              সরকারি ও বেসরকারি চাকরির খবর ২৪/৭
            </p>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto ml-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="flex items-center gap-1.5 px-2.5 py-2 text-gray-700 hover:text-[#006a4e] hover:bg-green-50 rounded-md font-medium text-sm transition-colors whitespace-nowrap"
            >
              <link.icon size={16} />
              <span className="hidden xl:block">{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-gray-600 hover:text-[#006a4e] focus:outline-none shrink-0"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-[#006a4e] absolute w-full shadow-lg border-t border-white/10 z-40">
          <div className="flex flex-col py-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="flex items-center gap-3 px-6 py-3 text-white/90 hover:text-white hover:bg-white/10 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Job Updates Ticker */}
      <div className="bg-[#f3f4f6] border-b border-t border-gray-200 py-2 overflow-hidden flex items-center">
        <div className="container mx-auto px-4 flex items-center">
          <div className="bg-[#f42a41] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shrink-0 flex items-center gap-1 z-10 shadow-sm">
            <Bell size={12} />
            Update
          </div>
          <div className="flex-1 overflow-hidden ml-3 relative h-6 group">
            <div className="absolute whitespace-nowrap animate-[ticker_60s_linear_infinite] group-hover:[animation-play-state:paused] flex items-center gap-8">
              {latestJobs.map((job) => (
                <Link key={job.id} href={`/job/${job.slug}`} className="text-sm text-gray-700 hover:text-[#006a4e] flex items-center gap-2 font-bengali">
                  <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">New</span>
                  {job.title}
                </Link>
              ))}
              {/* Duplicate for seamless loop */}
              {latestJobs.map((job) => (
                <Link key={`dup-${job.id}`} href={`/job/${job.slug}`} className="text-sm text-gray-700 hover:text-[#006a4e] flex items-center gap-2 font-bengali">
                  <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">New</span>
                  {job.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
