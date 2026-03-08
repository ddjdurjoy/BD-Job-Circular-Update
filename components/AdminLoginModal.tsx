'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check lock status on mount and when modal opens
    if (isOpen) {
      const lockTime = localStorage.getItem('admin_lockout_until');
      if (lockTime && parseInt(lockTime) > Date.now()) {
        setLockedUntil(parseInt(lockTime));
      } else if (lockTime) {
        // Lock expired
        localStorage.removeItem('admin_lockout_until');
        localStorage.setItem('admin_attempts', '0');
        setLockedUntil(null);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockedUntil && lockedUntil > Date.now()) {
      setError(`Locked out. Try again later.`);
      return;
    }

    if (password === 'Ddjdurjoy3@bdjcu') {
      localStorage.setItem('admin_auth', 'true');
      localStorage.setItem('admin_attempts', '0');
      setIsOpen(false);
      setPassword('');
      setError('');
      router.push('/admin/generator');
    } else {
      const currentAttempts = parseInt(localStorage.getItem('admin_attempts') || '0') + 1;
      localStorage.setItem('admin_attempts', currentAttempts.toString());
      
      if (currentAttempts >= 5) {
        const lockTime = Date.now() + 5 * 60 * 60 * 1000; // 5 hours
        localStorage.setItem('admin_lockout_until', lockTime.toString());
        setLockedUntil(lockTime);
        setError('Too many failed attempts. Try again in 5 hours.');
      } else {
        setError(`Incorrect password. Try again. (${5 - currentAttempts} attempts left)`);
      }
    }
  };

  const formatTimeLeft = () => {
    if (!lockedUntil) return '';
    const diff = lockedUntil - Date.now();
    if (diff <= 0) return '';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
        className="hover:text-[#006a4e] transition-colors text-left"
      >
        Admin Login
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#006a4e] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Lock size={18} /> Admin Access
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {lockedUntil && lockedUntil > Date.now() ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 mb-4">
                  <AlertCircle className="shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-bold">Account Locked</p>
                    <p className="text-sm mt-1">Too many failed attempts. Please try again in {formatTimeLeft()}.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#006a4e] focus:border-[#006a4e] outline-none text-gray-900"
                      placeholder="Enter admin password"
                      autoFocus
                    />
                  </div>
                  
                  {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-[#006a4e] hover:bg-[#00523b] text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    Login
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
