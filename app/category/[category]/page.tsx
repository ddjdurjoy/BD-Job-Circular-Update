import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import JobCard from '@/components/JobCard';
import ScrollReveal from '@/components/ScrollReveal';
import { categories } from '@/lib/data';
import { getJobsFromBlogger } from '@/lib/blogger';

export function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.name.toLowerCase().replace(' ', '-'),
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const jobs = await getJobsFromBlogger();
  
  // Find the original category name from the slug
  const categoryObj = categories.find(c => c.name.toLowerCase().replace(' ', '-') === category);
  
  if (!categoryObj) {
    // If it's not a standard category, we'll just show all jobs or handle it gracefully
    // For this demo, we'll just show a generic page if not found
  }

  const categoryName = categoryObj ? categoryObj.name : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Filter jobs by category
  const categoryJobs = jobs.filter(j => j.category.toLowerCase() === categoryName.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header jobs={jobs} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: 70% */}
          <div className="w-full lg:w-[70%]">
            <ScrollReveal>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 border-l-4 border-[#006a4e] pl-4 uppercase tracking-wide">
                  {categoryName}
                </h1>
                <p className="text-gray-500 mt-2">Showing all jobs in {categoryName} category.</p>
              </div>
            </ScrollReveal>

            {categoryJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {categoryJobs.map((job, index) => (
                  <ScrollReveal key={job.id} delay={index * 0.05}>
                    <JobCard job={job} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <p className="text-gray-500 text-lg">No jobs found in this category at the moment.</p>
                </div>
              </ScrollReveal>
            )}

            {/* Pagination */}
            {categoryJobs.length > 0 && (
              <ScrollReveal delay={0.2}>
                <div className="flex justify-between items-center mt-10 mb-6 border-t border-gray-200 pt-6">
                  <button 
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 hover:text-[#006a4e] hover:border-[#006a4e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    &larr; Newer Posts
                  </button>
                  <button 
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 hover:text-[#006a4e] hover:border-[#006a4e] transition-all"
                  >
                    Older Posts &rarr;
                  </button>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Right Column: 30% */}
          <div className="w-full lg:w-[30%]">
            <ScrollReveal delay={0.3}>
              <Sidebar jobs={jobs} />
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
