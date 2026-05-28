// apps/frontend/components/SwitchUserPrompt.tsx
'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { User, LogOut, ArrowLeft } from 'lucide-react';

export default function SwitchUserPrompt({
  currentUser,
}: {
  currentUser: { email: string };
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleSwitch = async () => {
    await logout();
    router.push('/login');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="bg-card border border-border rounded-lg shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-xl font-bold text-foreground mb-2">
          Already Logged In
        </h1>
        <p className="text-muted-foreground mb-6">
          You are currently logged in as{' '}
          <strong className="text-foreground">{currentUser.email}</strong>.
          Would you like to switch to a different account?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleSwitch}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="w-4 h-4" />
            Switch Account
          </button>
          <button
            onClick={handleCancel}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-border text-foreground rounded-md font-medium hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
