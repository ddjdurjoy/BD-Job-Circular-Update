import { Job } from '@/lib/data';
import JobCard from './JobCard';

export default function Tabs({ recentJobs, popularJobs }: { recentJobs: Job[], popularJobs: Job[] }) {
  return (
    <div className="mb-8">
      {/* CSS-only Tabs using radio buttons */}
      <div className="tabs-container relative">
        <input type="radio" name="job-tabs" id="tab-recent" className="hidden peer/recent" defaultChecked />
        <input type="radio" name="job-tabs" id="tab-popular" className="hidden peer/popular" />

        {/* Tab Headers */}
        <div className="flex border-b-2 border-gray-200 mb-6 relative">
          <label 
            htmlFor="tab-recent" 
            className="cursor-pointer py-3 px-6 text-sm sm:text-base font-bold text-gray-500 uppercase tracking-wide transition-colors peer-checked/recent:text-[#006a4e] peer-checked/recent:border-b-4 peer-checked/recent:border-[#006a4e] -mb-[2px]"
          >
            Recent Jobs
          </label>
          <label 
            htmlFor="tab-popular" 
            className="cursor-pointer py-3 px-6 text-sm sm:text-base font-bold text-gray-500 uppercase tracking-wide transition-colors peer-checked/popular:text-[#006a4e] peer-checked/popular:border-b-4 peer-checked/popular:border-[#006a4e] -mb-[2px]"
          >
            Popular Jobs
          </label>
        </div>

        {/* Tab Content: Recent Jobs */}
        <div className="hidden peer-checked/recent:block animate-[fadeIn_0.3s_ease-in-out]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Tab Content: Popular Jobs */}
        <div className="hidden peer-checked/popular:block animate-[fadeIn_0.3s_ease-in-out]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {popularJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
