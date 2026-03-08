import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Job } from '@/lib/data';

export default function JobCard({ job }: { job: Job }) {
  const today = new Date();
  const deadline = new Date(job.appDeadline);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isDeadlineApproaching = diffDays <= 7 && diffDays >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full group">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          {/* Thumbnail */}
          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 relative">
            <Image
              src={job.thumbnail}
              alt={job.organization}
              fill
              className="object-cover"
              sizes="80px"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Title & Organization */}
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-1 bg-green-50 text-[#006a4e] text-xs font-bold rounded mb-2 uppercase tracking-wider">
              {job.category}
            </span>
            <Link href={`/job/${job.slug}`} className="block">
              <h2 className="text-lg font-bold text-gray-900 leading-snug font-bengali group-hover:text-[#006a4e] transition-colors line-clamp-2">
                {job.title}
              </h2>
            </Link>
            <p className="text-sm text-gray-500 mt-1 truncate">{job.organization}</p>
          </div>
        </div>

        {/* Meta Data */}
        <div className="space-y-2 mt-auto pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400 shrink-0" />
            <span className="truncate">Published: {new Date(job.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400 shrink-0" />
            <span className="truncate">{job.jobLocation}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm font-medium ${isDeadlineApproaching ? 'text-[#f42a41]' : 'text-gray-600'}`}>
            <Clock size={16} className={isDeadlineApproaching ? 'text-[#f42a41]' : 'text-gray-400'} />
            <span className="truncate">Deadline: {new Date(job.appDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5 pt-2">
        <Link 
          href={`/job/${job.slug}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-[#006a4e] text-[#006a4e] hover:text-white border border-gray-200 hover:border-[#006a4e] rounded-lg font-semibold transition-all duration-300"
        >
          View Details
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
