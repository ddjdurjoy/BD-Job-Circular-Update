'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <AlertTriangle className="w-16 h-16 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4 font-bengali">
        দুঃখিত, একটি সমস্যা হয়েছে!
      </h2>
      <p className="text-gray-600 max-w-md mx-auto mb-8 font-bengali">
        তথ্য লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা কিছুক্ষণ পর ফিরে আসুন।
        <br />
        <span className="text-sm text-gray-400 mt-2 block font-sans">
          {error.message || "Failed to fetch data"}
        </span>
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 bg-[#006a4e] text-white px-6 py-3 rounded-lg hover:bg-[#00523b] transition-colors font-medium"
        >
          <RefreshCcw size={18} />
          পুনরায় চেষ্টা করুন
        </button>
        <Link
          href="/"
          className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
