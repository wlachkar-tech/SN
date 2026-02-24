'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="h-16 bg-blue-600"></div>;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Student Management
        </Link>

        {session ? (
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm">Welcome, {session.user?.name}</p>
              <p className="text-xs text-blue-100">({session.user?.role})</p>
            </div>

            <div className="flex gap-4">
              <Link href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                Dashboard
              </Link>

              {session.user?.role === 'admin' && (
                <>
                  <Link href="/admin/students" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Manage Students
                  </Link>
                  <Link href="/admin/courses" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Manage Courses
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
              Login
            </Link>
            <Link href="/register" className="hover:bg-blue-700 px-3 py-2 rounded">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
