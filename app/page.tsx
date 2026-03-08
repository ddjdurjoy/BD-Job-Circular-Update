import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import FeaturedSlider from '@/components/FeaturedSlider';
import Tabs from '@/components/Tabs';
import CookieConsent from '@/components/CookieConsent';
import ScrollReveal from '@/components/ScrollReveal';
import { getJobsFromBlogger } from '@/lib/blogger';

export default async function Home() {
  const jobs = await getJobsFromBlogger();

  // Sort jobs for recent and popular, and limit to 10 per tab
  const recentJobs = [...jobs].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 10);
  const popularJobs = [...jobs].sort((a, b) => b.viewCount - a.viewCount).slice(0, 10);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header jobs={jobs} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Featured Slider - Above the Fold */}
        <ScrollReveal>
          <FeaturedSlider jobs={jobs} />
        </ScrollReveal>

        {/* Main Content Area: 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Left Column: 70% */}
          <div className="w-full lg:w-[70%]">
            {/* Label Based Tabs */}
            <ScrollReveal delay={0.1}>
              <Tabs recentJobs={recentJobs} popularJobs={popularJobs} />
            </ScrollReveal>

            {/* Pagination */}
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
      <CookieConsent />
    </div>
  );
}
