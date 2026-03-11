import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getJobsFromBlogger } from '@/lib/blogger';

export default async function TermsPage() {
  const jobs = await getJobsFromBlogger();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header jobs={jobs} />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-[#006a4e] pl-4">Terms & Conditions</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>Welcome to BD Job Circular Update!</p>
            <p>These terms and conditions outline the rules and regulations for the use of BD Job Circular Update's Website.</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use BD Job Circular Update if you do not agree to take all of the terms and conditions stated on this page.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies</h2>
            <p>We employ the use of cookies. By accessing BD Job Circular Update, you agreed to use cookies in agreement with the BD Job Circular Update's Privacy Policy.</p>
            <p>Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">License</h2>
            <p>Unless otherwise stated, BD Job Circular Update and/or its licensors own the intellectual property rights for all material on BD Job Circular Update. All intellectual property rights are reserved. You may access this from BD Job Circular Update for your own personal use subjected to restrictions set in these terms and conditions.</p>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Republish material from BD Job Circular Update</li>
              <li>Sell, rent or sub-license material from BD Job Circular Update</li>
              <li>Reproduce, duplicate or copy material from BD Job Circular Update</li>
              <li>Redistribute content from BD Job Circular Update</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hyperlinking to our Content</h2>
            <p>The following organizations may link to our Website without prior written approval:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Government agencies;</li>
              <li>Search engines;</li>
              <li>News organizations;</li>
              <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
              <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
            </ul>

            <p className="mt-8 text-sm text-gray-500">We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
