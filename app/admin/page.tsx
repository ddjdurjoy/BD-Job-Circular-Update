import { cookies } from 'next/headers';
import BlogGenerator from '../../components/BlogGenerator';
import LoginForm from './LoginForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getJobsFromBlogger } from '@/lib/blogger';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'true';

  if (!isAdmin) {
    return <LoginForm />;
  }

  const jobs = await getJobsFromBlogger();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header jobs={jobs} />
      <main className="flex-grow">
        <BlogGenerator />
      </main>
      <Footer />
    </div>
  );
}
