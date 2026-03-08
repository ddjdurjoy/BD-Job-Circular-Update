'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLoginPage() {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    const adminPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';
    if (pinInput === adminPin) {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin/generator');
    } else {
      setError(true);
      setPinInput('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 w-full max-w-sm text-center"
      >
        <div className="w-16 h-16 bg-[#f57c00]/10 text-[#f57c00] rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield size={32} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Login</h3>
        <p className="text-sm text-gray-500 mb-6">অ্যাডমিন প্যানেলে প্রবেশ করতে ৪ ডিজিটের সিকিউরিটি পিন দিন।</p>
        
        <input
          type="password"
          maxLength={4}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="••••"
          className={`w-full text-center text-3xl tracking-[1em] p-4 rounded-2xl border-2 ${error ? 'border-red-500' : 'border-gray-100'} focus:border-[#f57c00] focus:ring-0 transition-all mb-2 font-mono`}
          autoFocus
        />
        
        {error && (
          <p className="text-xs text-red-500 font-medium mb-4">ভুল পিন! দয়া করে সঠিক পিন দিন।</p>
        )}
        {!error && <div className="h-6"></div>}

        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 py-3 text-sm font-bold bg-[#f57c00] text-white rounded-xl hover:bg-[#e65100] transition-all shadow-lg shadow-[#f57c00]/20"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
