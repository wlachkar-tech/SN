'use client';

import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Student Management System
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A comprehensive platform to manage students, courses, and enrollments
            </p>

            {status === 'loading' ? (
              <p className="text-gray-600">Loading...</p>
            ) : session ? (
              <Link
                href="/dashboard"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex gap-4 justify-center">
                <Link
                  href="/login"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">📚 Course Management</h3>
              <p className="text-gray-600">
                Create, update, and manage courses with comprehensive details and credits.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-3">👥 Student Profiles</h3>
              <p className="text-gray-600">
                Maintain detailed student information including contact details and enrollment records.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-purple-600 mb-3">📊 Enrollments & Grades</h3>
              <p className="text-gray-600">
                Track student enrollments, manage grades, and monitor academic progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
