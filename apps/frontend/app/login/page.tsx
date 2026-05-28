// apps/frontend/app/login/page.tsx
import { getServerSession } from '@/lib/auth/server';
import LoginForm from '../../components/LoginForm';
import SwitchUserPrompt from '../../components/SwitchUserPrompt';

export const metadata = {
  title: 'Login | VerdeAfrique',
  description: 'Sign in to your VerdeAfrique account',
};

export default async function LoginPage() {
  const session = await getServerSession();

  if (session?.user) {
    return <SwitchUserPrompt currentUser={session.user} />;
  }

  return (
    <main className="min-h-[80vh] py-12 bg-background">
      <div className="container mx-auto px-4">
        <LoginForm />
      </div>
    </main>
  );
}
