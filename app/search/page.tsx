import { getJobsFromBlogger } from '@/lib/blogger';
import JobCard from '@/components/JobCard';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search } from 'lucide-react';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const jobs = await getJobsFromBlogger();
  
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(query.toLowerCase()) ||
    job.organization.toLowerCase().includes(query.toLowerCase()) ||
    job.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header jobs={jobs} />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[70%]">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="text-[#006a4e]" />
                Search Results
              </h1>
              <p className="text-gray-600 mt-2">
                Found {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''} for <span className="font-semibold">"{query}"</span>
              </p>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h2>
                <p className="text-gray-600">
                  We couldn't find any jobs matching "{query}". Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[30%]">
            <Sidebar jobs={jobs} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
