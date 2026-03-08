import Link from 'next/link';
import { Search, ChevronRight, AlertCircle, Building2, Landmark, Briefcase, ShieldCheck, Globe, Facebook, MessageCircle, Send } from 'lucide-react';
import { categories, Job } from '@/lib/data';

export default function Sidebar({ jobs = [] }: { jobs?: Job[] }) {
  // Filter jobs approaching deadline (less than 7 days)
  const today = new Date();
  const approachingDeadlineJobs = jobs.filter(job => {
    const deadline = new Date(job.appDeadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).slice(0, 5);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 size={16} className="text-[#006a4e] group-hover:text-white transition-colors" />;
      case 'Landmark': return <Landmark size={16} className="text-[#006a4e] group-hover:text-white transition-colors" />;
      case 'Briefcase': return <Briefcase size={16} className="text-[#006a4e] group-hover:text-white transition-colors" />;
      case 'ShieldCheck': return <ShieldCheck size={16} className="text-[#006a4e] group-hover:text-white transition-colors" />;
      case 'Globe': return <Globe size={16} className="text-[#006a4e] group-hover:text-white transition-colors" />;
      default: return <ChevronRight size={16} className="text-[#006a4e] group-hover:text-white transition-colors" />;
    }
  };

  return (
    <aside className="w-full space-y-6">
      {/* Search Widget */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-[#006a4e] pl-3 uppercase tracking-wide">
          Search Jobs
        </h3>
        <form className="relative" action="/search">
          <input
            type="text"
            name="q"
            placeholder="Search jobs..."
            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:border-transparent transition-all"
            required
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[#006a4e]"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Category List */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-[#006a4e] pl-3 uppercase tracking-wide">
          Jobs by Category
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link 
                href={`/category/${cat.name.toLowerCase().replace(' ', '-')}`}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-[#006a4e] transition-colors">
                    {getIcon(cat.icon)}
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-[#006a4e] transition-colors">
                    {cat.name}
                  </span>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full group-hover:bg-green-100 group-hover:text-[#006a4e] transition-colors">
                  {cat.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Deadline Alert */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-10"></div>
        <h3 className="text-lg font-bold text-[#f42a41] mb-4 border-l-4 border-[#f42a41] pl-3 uppercase tracking-wide flex items-center gap-2">
          <AlertCircle size={20} />
          Deadline Approaching
        </h3>
        <ul className="space-y-3">
          {approachingDeadlineJobs.length > 0 ? (
            approachingDeadlineJobs.map((job) => (
              <li key={job.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <Link href={`/job/${job.slug}`} className="block group">
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#006a4e] transition-colors line-clamp-2 font-bengali leading-snug">
                    {job.title}
                  </h4>
                  <p className="text-xs text-[#f42a41] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Ends: {new Date(job.appDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500 italic">No approaching deadlines.</li>
          )}
        </ul>
      </div>

      {/* Social Connect */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-[#006a4e] pl-3 uppercase tracking-wide">
          Stay Connected
        </h3>
        <div className="space-y-3">
          <a href="#" className="flex items-center gap-3 p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-md hover:bg-[#1877F2] hover:text-white transition-colors font-medium">
            <Facebook size={20} />
            <span>Facebook Page</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 bg-[#25D366]/10 text-[#25D366] rounded-md hover:bg-[#25D366] hover:text-white transition-colors font-medium">
            <MessageCircle size={20} />
            <span>WhatsApp Channel</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 bg-[#0088cc]/10 text-[#0088cc] rounded-md hover:bg-[#0088cc] hover:text-white transition-colors font-medium">
            <Send size={20} />
            <span>Telegram Group</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
