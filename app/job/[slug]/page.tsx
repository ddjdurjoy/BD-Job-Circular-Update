import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, MessageCircle, Send, Download, ExternalLink, Calendar, MapPin, Building2, Users, Banknote, Eye, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import JobSchema from '@/components/JobSchema';
import ViewCounter from '@/components/ViewCounter';
import ScrollReveal from '@/components/ScrollReveal';
import { getJobsFromBlogger } from '@/lib/blogger';

// Generate static params for all jobs
export async function generateStaticParams() {
  const jobs = await getJobsFromBlogger();
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export default async function JobDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const jobs = await getJobsFromBlogger();
  const job = jobs.find((j) => j.slug === slug);

  if (!job) {
    notFound();
  }

  // Find related jobs (same category, excluding current)
  const relatedJobs = jobs
    .filter((j) => j.category === job.category && j.id !== job.id)
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isDeadlineApproaching = () => {
    const today = new Date();
    const deadline = new Date(job.appDeadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header jobs={jobs} />
      <JobSchema job={job} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: 70% */}
          <div className="w-full lg:w-[70%]">
            
            {/* Breadcrumb */}
            <ScrollReveal>
              <nav className="flex text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link href="/" className="hover:text-[#006a4e]">Home</Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="mx-2">/</span>
                      <Link href={`/category/${job.category.toLowerCase().replace(' ', '-')}`} className="hover:text-[#006a4e]">{job.category}</Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <span className="mx-2">/</span>
                      <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-xs">{job.title}</span>
                    </div>
                  </li>
                </ol>
              </nav>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                
                {/* Sticky Social Share Buttons (Desktop) */}
                <div className="hidden md:flex flex-col gap-2 absolute left-4 top-24 z-10">
                  <a href="#" className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md" aria-label="Share on Facebook">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md" aria-label="Share on WhatsApp">
                    <MessageCircle size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md" aria-label="Share on Telegram">
                    <Send size={18} />
                  </a>
                </div>

                {/* Header Image */}
                <div className="w-full h-64 sm:h-80 relative bg-gray-100 border-b border-gray-200">
                  <Image
                    src={job.thumbnail}
                    alt={job.title}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 70vw"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-5 sm:p-8 md:pl-20">
                  {/* Title */}
                  <span className="inline-block px-3 py-1 bg-green-50 text-[#006a4e] text-xs font-bold rounded-full mb-4 uppercase tracking-wider border border-green-100">
                    {job.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6 font-bengali">
                    {job.title}
                  </h1>

                  {/* Job Information Table (Card Style) */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-8 shadow-inner">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Job Summary</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div className="flex items-start gap-3">
                        <Building2 className="text-[#006a4e] shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Organization</p>
                          <p className="text-sm font-medium text-gray-900">{job.organization}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="text-[#006a4e] shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Vacancy</p>
                          <p className="text-sm font-medium text-gray-900">{job.vacancy}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Banknote className="text-[#006a4e] shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Salary</p>
                          <p className="text-sm font-medium text-gray-900">{job.salary}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="text-[#006a4e] shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Job Location</p>
                          <p className="text-sm font-medium text-gray-900">{job.jobLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="text-[#006a4e] shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Application Start</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(job.appStartDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className={`${isDeadlineApproaching() ? 'text-[#f42a41]' : 'text-[#006a4e]'} shrink-0 mt-0.5`} size={20} />
                        <div>
                          <p className={`text-xs uppercase font-semibold ${isDeadlineApproaching() ? 'text-[#f42a41]' : 'text-gray-500'}`}>Application Deadline</p>
                          <p className={`text-sm font-bold ${isDeadlineApproaching() ? 'text-[#f42a41]' : 'text-gray-900'}`}>{formatDate(job.appDeadline)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                      <span>Published: {formatDate(job.publishedAt)}</span>
                      <ViewCounter postId={job.id} increment={true} />
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 font-bengali">
                    <div dangerouslySetInnerHTML={{ __html: job.content.replace(/\n/g, '<br/>').replace(/\*   /g, '• ') }} />
                  </div>

                  {/* PDF Viewer */}
                  {job.pdfLink && (
                    <div className="mt-12 mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-[#006a4e] pl-3">Official Circular</h3>
                      <div className="w-full h-[500px] sm:h-[800px] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                        <iframe 
                          src={job.pdfLink.includes('drive.google.com') ? job.pdfLink.replace('/view', '/preview') : `https://docs.google.com/gview?url=${encodeURIComponent(job.pdfLink)}&embedded=true`} 
                          className="w-full h-full" 
                          title="Job Circular PDF"
                        >
                          <p className="p-4 text-center text-gray-500">Your browser does not support PDFs. <a href={job.pdfLink} className="text-[#006a4e] underline">Download the PDF</a>.</p>
                        </iframe>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    {job.pdfLink && (
                      <a 
                        href={job.pdfLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        download
                        className="flex items-center justify-center gap-2 bg-white border-2 border-[#006a4e] text-[#006a4e] hover:bg-green-50 text-lg font-bold py-4 px-8 rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <Download size={24} />
                        Download Circular
                      </a>
                    )}
                    {job.applyLink && (
                      <a 
                        href={job.applyLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#006a4e] hover:bg-[#00523b] text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                      >
                        <ExternalLink size={24} />
                        Apply Online
                      </a>
                    )}
                  </div>

                  {/* Mobile Social Share */}
                  <div className="md:hidden mt-10 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Share this job</p>
                    <div className="flex justify-center gap-4">
                      <a href="#" className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md">
                        <Facebook size={24} />
                      </a>
                      <a href="#" className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md">
                        <MessageCircle size={24} />
                      </a>
                      <a href="#" className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-md">
                        <Send size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>

            {/* Author Box */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8 flex items-center gap-4">
                <div className="w-16 h-16 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    <circle cx="50" cy="50" r="50" fill="#006a4e" />
                    <circle cx="45" cy="50" r="30" fill="#f42a41" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">BD Job Circular Update</h3>
                  <p className="text-sm text-gray-600 font-bengali mt-1">
                    আমরা প্রতিদিন সরকারি, বেসরকারি, ব্যাংক ও এনজিও সহ সকল প্রকার চাকরির খবর প্রকাশ করি। আমাদের সাথে থাকুন।
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Related Posts */}
            {relatedJobs.length > 0 && (
              <ScrollReveal delay={0.3}>
                <div className="mt-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-[#006a4e] pl-3">Related Jobs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedJobs.map((relatedJob) => (
                      <Link key={relatedJob.id} href={`/job/${relatedJob.slug}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                        <div className="h-32 bg-gray-100 relative border-b border-gray-100">
                          <Image
                            src={relatedJob.thumbnail}
                            alt={relatedJob.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#006a4e] transition-colors font-bengali mb-2">
                            {relatedJob.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-auto">{formatDate(relatedJob.publishedAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

          </div>

          {/* Right Column: 30% */}
          <div className="w-full lg:w-[30%]">
            <ScrollReveal delay={0.4}>
              <Sidebar jobs={jobs} />
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
