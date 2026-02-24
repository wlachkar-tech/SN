'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

interface Enrollment {
  id: number;
  code: string;
  name: string;
  credits: number;
  grade: string;
}

export default function EnrollmentsPage() {
  const { data: session } = useSession();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );

        if (profileRes.data.student) {
          const enrollRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/enrollments/student/${profileRes.data.student.id}`,
            {
              headers: {
                Authorization: `Bearer ${session?.token}`,
              },
            }
          );
          setEnrollments(enrollRes.data);
        }
      } catch (error) {
        toast.error('Failed to fetch enrollments');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      fetchEnrollments();
    }
  }, [session?.token]);

  const handleRemoveEnrollment = async (enrollmentId: number) => {
    if (!confirm('Are you sure you want to remove this enrollment?')) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/enrollments/${enrollmentId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
      toast.success('Enrollment removed successfully');
    } catch (error) {
      toast.error('Failed to remove enrollment');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Enrollments</h1>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">You are not enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-3 text-left">Code</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Credits</th>
                    <th className="px-6 py-3 text-left">Grade</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{enrollment.code}</td>
                      <td className="px-6 py-3">{enrollment.name}</td>
                      <td className="px-6 py-3">{enrollment.credits}</td>
                      <td className="px-6 py-3">{enrollment.grade || '-'}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleRemoveEnrollment(enrollment.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
