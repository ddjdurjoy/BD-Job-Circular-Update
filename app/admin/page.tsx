import { cookies } from 'next/headers';
import BlogGenerator from '../../components/BlogGenerator';
import LoginForm from './LoginForm';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'true';

  if (!isAdmin) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogGenerator />
    </div>
  );
}
