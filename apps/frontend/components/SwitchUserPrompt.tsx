// apps/frontend/components/SwitchUserPrompt.tsx
'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function SwitchUserPrompt({ currentUser }: { currentUser: { email: string } }) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">Already logged in</h2>
        <p className="text-gray-600 mb-6">
          You are currently logged in as <strong>{currentUser.email}</strong>.
          Would you like to switch to a different account?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSwitch}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Yes, switch
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
}