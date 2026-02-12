'use client';

import { useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';

export default function DebugAuth() {
  const { user } = useAuth();
  
  useEffect(() => {
    console.log('Current user:', user);
    // Also log to verify cookie is being sent
    if (user) {
      console.log('✅ Auth working - User persisted:', user.email);
    }
  }, [user]);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  } 

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg mb-4">
      <h3 className="font-bold">🔧 Auth Debug (Dev Only):</h3>
      <div className="mt-2 space-y-1">
        <p><strong>Status:</strong> {user ? '✅ Logged in' : '❌ Not logged in'}</p>
        {user && (
          <>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Name:</strong> {user.name || 'Not set'}</p>
            <p className="text-sm text-gray-600">ℹ️ HttpOnly cookie is working if user persists after refresh</p>
          </>
        )}
      </div>
    </div>
  );
}