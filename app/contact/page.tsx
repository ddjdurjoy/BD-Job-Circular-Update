import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getJobsFromBlogger } from '@/lib/blogger';

export default async function ContactPage() {
  const jobs = await getJobsFromBlogger();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header jobs={jobs} />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-[#006a4e] pl-4">Contact Us</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>If you have any questions, suggestions, or feedback, please feel free to reach out to us. We are always happy to hear from our users and improve our services.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Get in Touch</h3>
            <ul className="list-none pl-0 space-y-4">
              <li><strong>Email:</strong> <a href="mailto:ddjdurjoy3@gmail.com" className="text-[#006a4e] hover:underline">ddjdurjoy3@gmail.com</a></li>
              <li><strong>Facebook:</strong> <a href="https://www.facebook.com/BDJobCircularUpdateOfficial" target="_blank" rel="noopener noreferrer" className="text-[#006a4e] hover:underline">BD Job Circular Update Official</a></li>
              <li><strong>WhatsApp:</strong> <a href="https://whatsapp.com/channel/0029VaOAa73JJhzh9wthfC3o" target="_blank" rel="noopener noreferrer" className="text-[#006a4e] hover:underline">Join our WhatsApp Channel</a></li>
              <li><strong>Telegram:</strong> <a href="https://t.me/BD_Job_Circular_Update" target="_blank" rel="noopener noreferrer" className="text-[#006a4e] hover:underline">Join our Telegram Group</a></li>
            </ul>

            <p className="mt-8 text-sm text-gray-500">We aim to respond to all inquiries within 24-48 hours. Thank you for your patience.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
