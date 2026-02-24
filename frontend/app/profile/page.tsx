'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

interface Profile {
  user: any;
  student: any;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );
        setProfile(response.data);
        if (response.data.student) {
          setFormData({
            dateOfBirth: response.data.student.dateOfBirth || '',
            phone: response.data.student.phone || '',
            address: response.data.student.address || '',
            city: response.data.student.city || '',
            state: response.data.student.state || '',
            zipCode: response.data.student.zipCode || '',
          });
        }
      } catch (error) {
        toast.error('Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      fetchProfile();
    }
  }, [session?.token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${profile?.student?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
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
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {profile?.user?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {profile?.user?.email}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {profile?.user?.role}
              </p>
              {profile?.student?.rollNumber && (
                <p>
                  <span className="font-semibold">Roll Number:</span>{' '}
                  {profile?.student?.rollNumber}
                </p>
              )}
            </div>
          </div>

          {profile?.student && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Date of Birth:</span>{' '}
                    {profile?.student?.dateOfBirth || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{' '}
                    {profile?.student?.phone || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{' '}
                    {profile?.student?.address || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-semibold">City:</span>{' '}
                    {profile?.student?.city || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-semibold">State:</span>{' '}
                    {profile?.student?.state || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-semibold">Zip Code:</span>{' '}
                    {profile?.student?.zipCode || 'Not provided'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
