// components/Address/AddressPage.tsx

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/router';
import TopNavigation from '../Cart/TopNavigation';
import FooterElements from '../Cart/FooterElements';
import { useAuth } from '../../context/AuthContext';
import { addAddress, fetchAddresses } from '../../services/api';
import { useGlobal, Address as GlobalAddress, AddressType } from '../../context/GlobalContext';
import { AxiosError } from 'axios';
import withAuth from '../../components/withAuth';
const initialFormState: Omit<GlobalAddress, 'id' | 'created_at'> = {
  houseNo: '',
  roadName: '',
  landmark: '',
  pinCode: '',
  city: '',
  state: '',
  addressType: 'Home',
};

const AddressPage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { addresses, setAddresses, selectedAddress, setSelectedAddress } = useGlobal();

  const [form, setForm] = useState<typeof initialFormState>(initialFormState);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Reusable class names
  const inputClasses =
    'w-full border rounded px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-red-500';
  const buttonClasses =
    'px-4 py-2 rounded focus:outline-none';
  const selectButtonClasses = (isSelected: boolean) =>
    `px-4 py-2 rounded text-white ${
      isSelected ? 'bg-green-500 cursor-default' : 'bg-red-500 hover:bg-red-600'
    }`;

  // Function to fetch user addresses
  const fetchUserAddresses = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchAddresses(token);
      setAddresses(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error('Error fetching addresses:', axiosError);
      setError(
        axiosError.response?.data?.message ||
          'Failed to fetch addresses. Please try again later.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, setAddresses]);

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses]);

  // Unified input change handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'radio' ? (value as AddressType) : value,
    }));
  };

  // Handle form submission for adding a new address
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null); // Reset previous errors

    try {
      const addressData: Omit<GlobalAddress, 'id' | 'created_at'> = { ...form };
      const addResponse = await addAddress(token, addressData);
      const { address_id } = addResponse.data;

      // Fetch the updated list of addresses
      const fetchedAddresses = await fetchUserAddresses();

      if (fetchedAddresses) {
        // Find the newly added address using address_id
        const newAddress = fetchedAddresses.find((addr) => addr.id === address_id);

        if (newAddress) {
          setSelectedAddress(newAddress);
          // Reset form and navigate back to address selection
          setForm(initialFormState);
          setIsAddingNew(false);
        } else {
          // If the new address isn't found, display an error
          setError('Failed to retrieve the new address. Please try again.');
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error('Error adding address:', axiosError);
      setError(
        axiosError.response?.data?.message ||
          'Failed to add address. Please try again.'
      );
    }
  };

  // Handle cancel action
  // const handleCancel = () => {
  //   router.push('/cart');
  // };

  // Handle selecting an existing address
  const handleSelectAddress = (address: GlobalAddress) => {
    setSelectedAddress(address);
  };

  // Handle proceeding to payment
  const handleProceedToPayment = () => {
    if (selectedAddress) {
      router.push('/payment');
    }
  };

  // Memoized Address List Component
  const AddressList = useCallback(() => {
    if (addresses.length === 0) {
      return <p>No saved addresses. Please add a new address.</p>;
    }

    return (
      <div className="space-y-4">
        {addresses.map((address) => {
          const isSelected = selectedAddress?.id === address.id;
          return (
            <div
              key={address.id}
              className={`border p-4 rounded ${
                isSelected ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {address.houseNo}, {address.roadName} ({address.addressType})
                  </p>
                  {address.landmark && <p>Landmark: {address.landmark}</p>}
                  <p>
                    {address.city}, {address.state} - {address.pinCode}
                  </p>
                </div>
                <button
                  onClick={() => handleSelectAddress(address)}
                  className={selectButtonClasses(isSelected)}
                  disabled={isSelected}
                  aria-label={`Select address ${address.id}`}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [addresses, selectedAddress]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <TopNavigation currentStep={2} />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Delivery Address</h1>
          <button
            className="text-red-500 font-medium focus:outline-none"
            onClick={() => {
              setIsAddingNew(true);
              setError(null); // Reset any previous errors
            }}
          >
            ADD NEW ADDRESS
          </button>
        </div>

        {/* Display error if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p>Loading addresses...</p>
        ) : (
          <>
            {/* Existing Addresses */}
            {!isAddingNew && <AddressList />}

            {/* Add New Address Form */}
            {isAddingNew && (
              <form onSubmit={handleSubmit}>
                {/* House No, Building Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    House No, Building Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="houseNo"
                    value={form.houseNo}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                    placeholder="Enter house number and building name"
                  />
                </div>

                {/* Road Name, Area, Colony */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Road Name, Area, Colony <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="roadName"
                    value={form.roadName}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                    placeholder="Enter road name, area, and colony"
                  />
                </div>

                {/* Landmark */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={form.landmark}
                    onChange={handleInputChange}
                    placeholder="Enter landmark"
                    className={inputClasses}
                  />
                </div>

                {/* Pin Code */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={form.pinCode}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit pin code."
                    placeholder="282002"
                    className={inputClasses}
                  />
                </div>

                {/* City */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your city"
                    className={inputClasses}
                  />
                </div>

                {/* State */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your state"
                    className={inputClasses}
                  />
                </div>

                {/* Type of Address */}
                <div className="mb-6">
                  <span className="block text-sm font-medium mb-2">
                    Type of Address <span className="text-red-500">*</span>
                  </span>
                  <div className="flex items-center space-x-4">
                    {(['Home', 'Office', 'Other'] as AddressType[]).map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="addressType"
                          value={type}
                          checked={form.addressType === type}
                          onChange={handleInputChange}
                          className="form-radio h-4 w-4 text-red-500"
                        />
                        <span className="ml-2">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setError(null); // Reset any previous errors
                    }}
                    className={`${buttonClasses} px-4 py-2 border rounded hover:bg-gray-200`}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`${buttonClasses} bg-red-500 text-white hover:bg-red-600`}
                  >
                    Submit & Continue
                  </button>
                </div>
              </form>
            )}

            {/* Proceed to Payment Button */}
            {!isAddingNew && addresses.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedAddress}
                  className={`px-6 py-2 rounded text-white ${
                    selectedAddress
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-400 cursor-not-allowed'
                  } focus:outline-none`}
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Elements */}
      <FooterElements />
    </div>
  );
};

export default withAuth(AddressPage);
