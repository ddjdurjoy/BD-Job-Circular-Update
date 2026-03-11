import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getJobsFromBlogger } from '@/lib/blogger';

export default async function PrivacyPolicyPage() {
  const jobs = await getJobsFromBlogger();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header jobs={jobs} />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-[#006a4e] pl-4">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>At BD Job Circular Update, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by BD Job Circular Update and how we use it.</p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
            <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
              <li>Send you emails</li>
              <li>Find and prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Log Files</h2>
            <p>BD Job Circular Update follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies and Web Beacons</h2>
            <p>Like any other website, BD Job Circular Update uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

            <p className="mt-8 text-sm text-gray-500">If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
