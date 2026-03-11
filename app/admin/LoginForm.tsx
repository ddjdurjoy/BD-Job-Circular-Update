'use client';

import { useState } from 'react';
import { login } from './actions';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(password);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <Lock className="text-[#006a4e]" size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Access</h1>
        <p className="text-center text-gray-500 mb-8">Please enter the admin password to continue.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006a4e] focus:border-[#006a4e] outline-none transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006a4e] text-white py-3 px-4 rounded-lg hover:bg-[#004d38] transition-colors font-medium disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
