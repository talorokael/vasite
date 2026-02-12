import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server';
import RegisterForm from '../../components/RegisterForm';

export default async function RegisterPage() {
  const session = await getServerSession();
  
  // If already logged in, redirect to appropriate page
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
        <RegisterForm />
      </div>
    </div>
  );
}