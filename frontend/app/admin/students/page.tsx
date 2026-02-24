'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

interface Student {
  id: number;
  userId: number;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
}

export default function AdminStudentsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/students`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
        setStudents(response.data);
      } catch (error) {
        toast.error('Failed to fetch students');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      fetchStudents();
    }
  }, [session?.token]);

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Students</h1>

          {students.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-3 text-left">Roll Number</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Phone</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{student.rollNumber}</td>
                      <td className="px-6 py-3">{student.name}</td>
                      <td className="px-6 py-3">{student.email}</td>
                      <td className="px-6 py-3">{student.phone || '-'}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
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
