import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getJobsFromBlogger } from '@/lib/blogger';

export default async function AboutPage() {
  const jobs = await getJobsFromBlogger();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header jobs={jobs} />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-[#006a4e] pl-4">About Us</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>Welcome to <strong>BD Job Circular Update</strong>, your number one source for all job circulars in Bangladesh. We're dedicated to providing you the very best of job updates, with an emphasis on government jobs, bank jobs, private company jobs, and NGO jobs.</p>
            <p>Founded in 2023, BD Job Circular Update has come a long way from its beginnings. When we first started out, our passion for helping job seekers find their dream jobs drove us to start our own platform.</p>
            <p>We hope you enjoy our service as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.</p>
            <p>Sincerely,<br/><strong>The BD Job Circular Update Team</strong></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
