'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
}

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentId, setStudentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get student ID
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
        setStudentId(profileRes.data.student?.id || null);

        // Get courses
        const coursesRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/courses`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
        setCourses(coursesRes.data);
      } catch (error) {
        toast.error('Failed to fetch courses');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      fetchData();
    }
  }, [session?.token]);

  const handleEnroll = async (courseId: number) => {
    if (!studentId) {
      toast.error('Student profile not found');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/enrollments`,
        {
          studentId,
          courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      toast.success('Enrolled successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to enroll');
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Courses</h1>

          {courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No courses available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{course.code}</h3>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">{course.name}</h4>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Credits:</span> {course.credits}
                  </p>
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    Enroll
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
