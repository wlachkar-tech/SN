'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  code: string;
  name: string;
  grade: string;
}

export default function AdminEnrollmentsPage() {
  const { data: session } = useSession();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/enrollments/student/1`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
        setEnrollments(response.data);
      } catch (error) {
        // This is expected as enrollments are fetched per student in real implementation
        setEnrollments([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      fetchEnrollments();
    }
  }, [session?.token]);

  const handleUpdateGrade = async (enrollmentId: number, newGrade: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/enrollments/${enrollmentId}`,
        { grade: newGrade },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollmentId ? { ...e, grade: newGrade } : e))
      );
      toast.success('Grade updated successfully');
    } catch (error) {
      toast.error('Failed to update grade');
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Enrollments</h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              ℹ️ Note: This is a demo page. In a production system, you would have additional filters
              to view enrollments by student and course.
            </p>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No enrollments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-3 text-left">Course Code</th>
                    <th className="px-6 py-3 text-left">Course Name</th>
                    <th className="px-6 py-3 text-left">Grade</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{enrollment.code}</td>
                      <td className="px-6 py-3">{enrollment.name}</td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={enrollment.grade || ''}
                          onChange={(e) =>
                            handleUpdateGrade(enrollment.id, e.target.value)
                          }
                          placeholder="Enter grade"
                          className="px-3 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() =>
                            handleUpdateGrade(enrollment.id, enrollment.grade)
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
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
