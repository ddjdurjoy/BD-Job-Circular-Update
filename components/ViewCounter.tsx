'use client';

import { useEffect, useState } from 'react';
import { Eye, Loader2 } from 'lucide-react';

export default function ViewCounter({ postId, increment = false }: { postId: string, increment?: boolean }) {
  const [viewCount, setViewCount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      setIsLoading(true);
      try {
        const action = increment ? 'increment' : 'get';
        const response = await fetch(
          `https://script.google.com/macros/s/AKfycbzI0RY2fwGhuBdQkQewm5gbVbiXlvdGbjcb3bemdNzqxLWR_ENPdOSwQAd7bV6pU2pq/exec?action=${action}&postId=${postId}`
        );
        const count = await response.text();
        
        if (count === 'Post not found') {
          setViewCount('00');
        } else {
          setViewCount(count.padStart(2, '0'));
        }
      } catch (error) {
        console.error('Error fetching count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, [postId, increment]);

  return (
    <span className="flex items-center gap-1">
      <Eye size={14} /> 
      {isLoading ? (
        <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Views</span>
      ) : (
        <span>{viewCount || '00'} Views</span>
      )}
    </span>
  );
}
