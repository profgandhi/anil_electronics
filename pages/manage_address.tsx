// pages/manage_address.tsx

import React, { useState, useEffect } from 'react';
import withAuth from '../components/withAuth';
import { useAuth } from '../context/AuthContext';
import { fetchAddresses, addAddress, editAddress, deleteAddress } from '../services/api';
import SidebarMenu from '../components/SidebarMenu';
import Breadcrumbs from '../components/Breadcrumbs';
import { Address as AddressType } from '../context/GlobalContext';

type AddressForm = Omit<AddressType, 'id' | 'created_at'> & {
  addressType: 'Home' | 'Office' | 'Other' | '';
};

const ManageAddressPage: React.FC = () => {
  const { token, logout } = useAuth();
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [newAddress, setNewAddress] = useState<AddressForm>({
    houseNo: '',
    roadName: '',
    landmark: '',
    pinCode: '',
    city: '',
    state: '',
    addressType: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // States for Editing
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<AddressType | null>(null);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Fetch existing addresses on component mount
  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchAddresses(token!); // Non-null assertion
        setAddresses(response.data);
      } catch (err) {
        setError('Failed to fetch addresses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewAddress((prev) => ({
      ...prev,
      [name]:
        name === 'addressType'
          ? (value as AddressForm['addressType']) // Only cast addressType
          : value, // Keep other fields as string
    }));
  };

  const handleSave = async () => {
    if (!token) {
      setError('Authentication token missing.');
      return;
    }

    // Validate form
    if (newAddress.addressType === '') {
      setError('Please select an Address Type.');
      return;
    }

    // Type guard to ensure addressType is 'Home' | 'Office' | 'Other'
    const isValidAddressType = (
      type: string
    ): type is 'Home' | 'Office' | 'Other' => {
      return ['Home', 'Office', 'Other'].includes(type);
    };

    if (!isValidAddressType(newAddress.addressType)) {
      setError('Invalid Address Type selected.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const addressData = {
        houseNo: newAddress.houseNo,
        roadName: newAddress.roadName,
        landmark: newAddress.landmark,
        pinCode: newAddress.pinCode,
        city: newAddress.city,
        state: newAddress.state,
        addressType: newAddress.addressType, // Type narrowed to 'Home' | 'Office' | 'Other'
      };
      await addAddress(token!, addressData); // Non-null assertion
      setSuccess('Address saved successfully.');
      // Refresh the addresses list
      const response = await fetchAddresses(token!);
      setAddresses(response.data);
      // Reset new address form
      setNewAddress({
        houseNo: '',
        roadName: '',
        landmark: '',
        pinCode: '',
        city: '',
        state: '',
        addressType: '',
      });
    } catch (err) {
      setError('Failed to save address.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Address
  const handleDelete = async (addressId: number) => {
    if (!token) {
      setError('Authentication token missing.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this address?');
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteAddress(token, addressId);
      setSuccess('Address deleted successfully.');
      // Refresh the addresses list
      const response = await fetchAddresses(token);
      setAddresses(response.data);
    } catch (err) {
      setError('Failed to delete address.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Button Click
  const handleEditClick = (address: AddressType) => {
    setCurrentAddress(address);
    setIsEditing(true);
  };

  // Handle Edit Input Changes
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!currentAddress) return;
    const { name, value } = e.target;
    setCurrentAddress({
      ...currentAddress,
      [name]: value,
    });
  };

  // Handle Save Edited Address
  const handleSaveEdit = async () => {
    if (!token || !currentAddress) {
      setEditError('Authentication token missing or address not selected.');
      return;
    }

    // Validate form
    if (currentAddress.addressType === '') {
      setEditError('Please select an Address Type.');
      return;
    }

    const isValidAddressType = (
      type: string
    ): type is 'Home' | 'Office' | 'Other' => {
      return ['Home', 'Office', 'Other'].includes(type);
    };

    if (!isValidAddressType(currentAddress.addressType)) {
      setEditError('Invalid Address Type selected.');
      return;
    }

    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      const updatedAddress: Partial<Omit<AddressType, 'id' | 'created_at'>> = {
        houseNo: currentAddress.houseNo,
        roadName: currentAddress.roadName,
        landmark: currentAddress.landmark,
        pinCode: currentAddress.pinCode,
        city: currentAddress.city,
        state: currentAddress.state,
        addressType: currentAddress.addressType,
      };

      await editAddress(token, currentAddress.id, updatedAddress);
      setEditSuccess('Address updated successfully.');
      // Refresh the addresses list
      const response = await fetchAddresses(token);
      setAddresses(response.data);
      // Close the modal after a short delay
      setTimeout(() => {
        setIsEditing(false);
        setCurrentAddress(null);
        setEditSuccess(null);
      }, 1000);
    } catch (err) {
      setEditError('Failed to update address.');
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading && addresses.length === 0) {
    // Show loading only when initially fetching addresses
    return <div className="text-center mt-10">Loading addresses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Manage Address' },
          ]}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar Menu */}
          <aside className="w-full md:w-1/4 mb-6 md:mb-0">
            <SidebarMenu activePage="Manage Address" />
          </aside>

          {/* Main Content Section */}
          <section className="w-full md:w-3/4">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h1 className="text-2xl font-semibold mb-4">Your Addresses</h1>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              {success && <div className="mb-4 text-green-500">{success}</div>}
              {addresses.length === 0 ? (
                <p>No addresses found. Add a new address below.</p>
              ) : (
                <ul>
                  {addresses.map((addr) => (
                    <li key={addr.id} className="mb-4 p-4 border rounded">
                      <p>
                        <strong>House No:</strong> {addr.houseNo}
                      </p>
                      <p>
                        <strong>Road Name:</strong> {addr.roadName}
                      </p>
                      {addr.landmark && (
                        <p>
                          <strong>Landmark:</strong> {addr.landmark}
                        </p>
                      )}
                      <p>
                        <strong>Pin Code:</strong> {addr.pinCode}
                      </p>
                      <p>
                        <strong>City:</strong> {addr.city}
                      </p>
                      <p>
                        <strong>State:</strong> {addr.state}
                      </p>
                      <p>
                        <strong>Address Type:</strong> {addr.addressType}
                      </p>
                      <p>
                        <strong>Created At:</strong>{' '}
                        {new Date(addr.created_at).toLocaleString()}
                      </p>
                      {/* Action Buttons */}
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleEditClick(addr)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add New Address */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              {success && <div className="mb-4 text-green-500">{success}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="houseNo"
                  >
                    House No
                  </label>
                  <input
                    type="text"
                    id="houseNo"
                    name="houseNo"
                    value={newAddress.houseNo}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter House Number"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="roadName"
                  >
                    Road Name
                  </label>
                  <input
                    type="text"
                    id="roadName"
                    name="roadName"
                    value={newAddress.roadName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter Road Name"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="landmark"
                  >
                    Landmark
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={newAddress.landmark}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter Landmark (Optional)"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="pinCode"
                  >
                    Pin Code
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={newAddress.pinCode}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter Pin Code"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="city"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={newAddress.city}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter City"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="state"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={newAddress.state}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter State"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="addressType"
                  >
                    Address Type
                  </label>
                  <select
                    id="addressType"
                    name="addressType"
                    value={newAddress.addressType}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Select Type</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSave}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Edit Address Modal */}
      {isEditing && currentAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="editHouseNo"
                >
                  House No
                </label>
                <input
                  type="text"
                  id="editHouseNo"
                  name="houseNo"
                  value={currentAddress.houseNo}
                  onChange={handleEditInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter House Number"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="editRoadName"
                >
                  Road Name
                </label>
                <input
                  type="text"
                  id="editRoadName"
                  name="roadName"
                  value={currentAddress.roadName}
                  onChange={handleEditInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter Road Name"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="editLandmark"
                >
                  Landmark
                </label>
                <input
                  type="text"
                  id="editLandmark"
                  name="landmark"
                  value={currentAddress.landmark}
                  onChange={handleEditInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter Landmark (Optional)"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="editPinCode"
                >
                  Pin Code
                </label>
                <input
                  type="text"
                  id="editPinCode"
                  name="pinCode"
                  value={currentAddress.pinCode}
                  onChange={handleEditInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter Pin Code"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="editCity"
                >
                  City
                </label>
                <input
                  type="text"
                  id="editCity"
                  name="city"
                  value={currentAddress.city}
                  onChange={handleEditInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter City"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="editState"
                >
                  State
                </label>
                <input
                  type="text"
                  id="editState"
                  name="state"
                  value={currentAddress.state}
                  onChange={handleEditInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Enter State"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="editAddressType"
                >
                  Address Type
                </label>
                <select
                  id="editAddressType"
                  name="addressType"
                  value={currentAddress.addressType}
                  onChange={handleEditInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Type</option>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {editError && <div className="mb-4 text-red-500">{editError}</div>}
            {editSuccess && <div className="mb-4 text-green-500">{editSuccess}</div>}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(ManageAddressPage);
