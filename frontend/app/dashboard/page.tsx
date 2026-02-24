'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
              Welcome, {session?.user?.name}!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {session?.user?.role === 'student' && (
                <>
                  <Link href="/profile">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                      <h2 className="text-2xl font-bold text-blue-600 mb-2">👤</h2>
                      <h3 className="text-xl font-semibold text-gray-800">My Profile</h3>
                      <p className="text-gray-600">View and edit your profile information</p>
                    </div>
                  </Link>

                  <Link href="/enrollments">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                      <h2 className="text-2xl font-bold text-green-600 mb-2">📚</h2>
                      <h3 className="text-xl font-semibold text-gray-800">My Enrollments</h3>
                      <p className="text-gray-600">View your courses and grades</p>
                    </div>
                  </Link>

                  <Link href="/courses">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                      <h2 className="text-2xl font-bold text-purple-600 mb-2">🎓</h2>
                      <h3 className="text-xl font-semibold text-gray-800">Available Courses</h3>
                      <p className="text-gray-600">Browse and enroll in courses</p>
                    </div>
                  </Link>
                </>
              )}

              {session?.user?.role === 'admin' && (
                <>
                  <Link href="/admin/students">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                      <h2 className="text-2xl font-bold text-blue-600 mb-2">👥</h2>
                      <h3 className="text-xl font-semibold text-gray-800">Manage Students</h3>
                      <p className="text-gray-600">View and manage all students</p>
                    </div>
                  </Link>

                  <Link href="/admin/courses">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                      <h2 className="text-2xl font-bold text-green-600 mb-2">📚</h2>
                      <h3 className="text-xl font-semibold text-gray-800">Manage Courses</h3>
                      <p className="text-gray-600">Create and manage courses</p>
                    </div>
                  </Link>

                  <Link href="/admin/enrollments">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                      <h2 className="text-2xl font-bold text-purple-600 mb-2">📝</h2>
                      <h3 className="text-xl font-semibold text-gray-800">Manage Enrollments</h3>
                      <p className="text-gray-600">Manage student enrollments and grades</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
