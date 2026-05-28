// apps/frontend/app/register/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server';
import RegisterForm from '../../components/RegisterForm';

export const metadata = {
  title: 'Create Account | VerdeAfrique',
  description: 'Create your VerdeAfrique account to start shopping',
};

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
    <main className="min-h-[80vh] py-12 bg-background">
      <div className="container mx-auto px-4">
        <RegisterForm />
      </div>
    </main>
  );
}
