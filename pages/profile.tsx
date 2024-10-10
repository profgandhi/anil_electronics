// pages/profile.tsx

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import withAuth from '../components/withAuth';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { fetchProfile, UserProfile } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';
import Breadcrumbs from '../components/Breadcrumbs';

const ProfilePage: React.FC = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetchProfile(token);
        setUser(response.data);
        setFormData(response.data); // Initialize form with fetched data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [token]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put('/api/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Profile updated successfully.");
      setUser(formData); // Update user state with new data
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneVerification = () => {
    // Implement actual verification logic here
    alert('Phone verification process initiated.');
  };

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!user || !formData) {
    return <div className="text-center mt-10">No user data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section with Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Personal Info' },
          ]}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar Menu */}
          <aside className="w-full md:w-1/4 mb-6 md:mb-0">
            <SidebarMenu activePage="Personal Info" /> {/* Use SidebarMenu */}
          </aside>

          {/* Personal Info Section */}
          <section className="w-full md:w-3/4">
            <div className="bg-white p-6 rounded-lg shadow">
              {/* Profile Summary */}
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white text-2xl">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-green-500">Points: {user.points}</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Phone Number & Verification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                    {/* Verification Button */}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-4 py-2 text-sm text-white bg-red-600 rounded-r-md hover:bg-red-700"
                      onClick={handlePhoneVerification}
                    >
                      Please Verify Mobile
                    </button>
                  </div>

                  {/* Landline Number */}
                  <div>
                    <label htmlFor="landlineNumber" className="block text-sm font-medium text-gray-700">
                      Landline Number
                    </label>
                    <input
                      type="tel"
                      name="landlineNumber"
                      id="landlineNumber"
                      value={formData.landlineNumber}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your landline number"
                    />
                  </div>
                </div>

                {/* Date of Birth & Anniversary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfAnniversary" className="block text-sm font-medium text-gray-700">
                      Date of Anniversary
                    </label>
                    <input
                      type="date"
                      name="dateOfAnniversary"
                      id="dateOfAnniversary"
                      value={formData.dateOfAnniversary}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Gender Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <div className="mt-2 flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleChange}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleChange}
                        className="form-radio text-pink-600"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={formData.gender === 'Other'}
                        onChange={handleChange}
                        className="form-radio text-green-600"
                      />
                      <span className="ml-2">Other</span>
                    </label>
                  </div>
                </div>

                {/* Display Success and Error Messages */}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className={`w-full px-4 py-2 text-white rounded-lg ${
                      isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default withAuth(ProfilePage);
