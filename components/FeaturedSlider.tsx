import Link from 'next/link';
import Image from 'next/image';
import { Job } from '@/lib/data';

export default function FeaturedSlider({ jobs }: { jobs: Job[] }) {
  if (!jobs || jobs.length === 0) return null;

  // Take up to 3 featured jobs
  const featuredJobs = jobs.filter(job => job.featured).slice(0, 3);

  return (
    <div className="mb-8">
      <h2 className="sr-only">Featured Jobs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredJobs.map((job) => (
          <Link 
            key={job.id} 
            href={`/job/${job.slug}`}
            className="group relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-gray-200">
              <Image
                src={job.thumbnail}
                alt={job.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <span className="inline-block px-3 py-1 bg-[#f42a41] text-white text-xs font-bold rounded-full uppercase tracking-wider mb-3 w-fit shadow-sm">
                {job.category}
              </span>
              <h3 className="text-white font-bold text-lg sm:text-xl leading-tight font-bengali line-clamp-3 group-hover:text-green-300 transition-colors">
                {job.title}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-gray-300 text-sm">
                <span className="truncate">{job.organization}</span>
                <span className="w-1 h-1 rounded-full bg-gray-500 shrink-0"></span>
                <span className="shrink-0">{new Date(job.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
