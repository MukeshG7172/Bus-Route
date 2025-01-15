'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export function AdminHeader({ isAdmin, currentView }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>Loading...</div>
        </div>
      </header>
    );
  }

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Left side - Navigation links for admin */}
          {isAdmin && (
            <nav className="flex gap-4">
              <Link
                href="/?view=buslog"
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                  currentView === 'buslog'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Bus Log
              </Link>
              <Link
                href="/?view=management"
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                  currentView === 'management'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Bus Management
              </Link>
            </nav>
          )}
        </div>

        {/* Right side - User authentication */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// Add prop types for TypeScript support
AdminHeader.displayName = 'AdminHeader';