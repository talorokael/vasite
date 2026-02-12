import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server';
import LoginForm from '../../components/LoginForm';

export default async function LoginPage() {
  const session = await getServerSession();
  if (session?.user) {
    if (session.user.role === 'ADMIN') {
      redirect('/admin');
    } else {
      redirect('/');
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <LoginForm />
      </div>
    </div>
  );
}