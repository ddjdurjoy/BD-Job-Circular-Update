import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getJobsFromBlogger } from '@/lib/blogger';

export default async function DisclaimerPage() {
  const jobs = await getJobsFromBlogger();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header jobs={jobs} />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-[#006a4e] pl-4">Disclaimer</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at ddjdurjoy3@gmail.com.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Disclaimers for BD Job Circular Update</h2>
            <p>All the information on this website - bdjobcircularupdate.com - is published in good faith and for general information purpose only. BD Job Circular Update does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (BD Job Circular Update), is strictly at your own risk. BD Job Circular Update will not be liable for any losses and/or damages in connection with the use of our website.</p>

            <p>From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.</p>

            <p>Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Consent</h2>
            <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Update</h2>
            <p>Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
