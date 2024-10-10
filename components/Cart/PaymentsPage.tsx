// components/Cart/PaymentPage.tsx
import withAuth from '../../components/withAuth';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TopNavigation from '../Cart/TopNavigation';
import FooterElements from '../Cart/FooterElements';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/api';
import { useGlobal, CartItem as GlobalCartItem, Address } from '../../context/GlobalContext';
import { AxiosError } from 'axios';
import { formatPrice } from '../Cart/formatPrice';

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { token, fullName, mobileNumber, email } = useAuth();
  const {
    cartItems,
    selectedAddress,
  } = useGlobal();

  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if no address is selected
  useEffect(() => {
    if (!selectedAddress) {
      router.push('/address');
    }
  }, [selectedAddress, router]);

  // Handler for payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }
    if (!token) {
      setError('User not authenticated.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        paymentMethod,
        addressId: selectedAddress?.id,
        items: cartItems.map(item => ({
          productId: item.product_id,
          quantity: item.quantity,
          discount: item.discount,
        })),
        user: {
          fullName,
          mobileNumber,
          email,
        },
      };

      await createOrder(token, orderData);

      // Proceed to confirmation page or display success message
      router.push('/confirmation');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error('Error creating order:', axiosError);
      setError(
        axiosError.response?.data?.message ||
          'There was an issue processing your order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler for cancel action
  const handleCancel = () => {
    router.push('/address');
  };

  // Calculations
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product_price * item.quantity,
    0
  );
  const savings = cartItems.reduce(
    (total, item) => total + (item.product_price * item.discount) * item.quantity,
    0
  );

  // Sub-components

  // Selected Address Component
  const SelectedAddress: React.FC<{ address: Address }> = ({ address }) => (
    <div className="border rounded p-4 mb-6 bg-white">
      <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
      <p className="mb-1">
        <strong>{fullName}</strong>
      </p>
      <p>{address.houseNo}, {address.roadName}</p>
      <p>
        {address.landmark && `${address.landmark}, `}
        {address.city}, {address.state} - {address.pinCode}
      </p>
      <p>Mobile: {mobileNumber}</p>
      <p>Email: {email}</p>
      <button
        className="mt-4 text-blue-500 underline focus:outline-none"
        onClick={() => router.push('/address')}
      >
        Change Address
      </button>
    </div>
  );

  // Payment Methods Component
  const PaymentMethods: React.FC = () => (
    <div className="border rounded p-4 mb-6 bg-white">
      <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
      <form onSubmit={handlePaymentSubmit}>
        <div className="space-y-4">
          {/* Credit/Debit Card */}
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="Card"
              checked={paymentMethod === 'Card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-red-500"
            />
            <span className="ml-3">Credit/Debit Card</span>
          </label>

          {/* UPI */}
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="UPI"
              checked={paymentMethod === 'UPI'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-red-500"
            />
            <span className="ml-3">UPI</span>
          </label>

          {/* Net Banking */}
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="NetBanking"
              checked={paymentMethod === 'NetBanking'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-red-500"
            />
            <span className="ml-3">Net Banking</span>
          </label>

          {/* Wallets */}
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="Wallet"
              checked={paymentMethod === 'Wallet'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-red-500"
            />
            <span className="ml-3">Wallets</span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded hover:bg-gray-200 focus:outline-none"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Complete Order'}
          </button>
        </div>
      </form>
    </div>
  );

  // Order Summary Component
  const OrderSummary: React.FC = () => (
    <div className="border rounded p-4 mb-4 bg-white">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      {cartItems.map((item: GlobalCartItem) => (
        <div
          key={item.id}
          className="flex justify-between items-center mb-4"
        >
          <div>
            <p className="font-medium">{item.product_name}</p>
            <p className="text-sm text-gray-600">
              {formatPrice(item.product_price)}{' '}
              <span className="line-through text-gray-500">
                {formatPrice(item.product_price / (1 - item.discount))}
              </span>{' '}
              <span className="text-green-500">
                {Math.round(item.discount * 100)}% off
              </span>
            </p>
          </div>
          <div>
            <span className="px-2 py-1 bg-gray-200 rounded">
              Qty: {item.quantity}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <span>Total Amount</span>
        <span className="font-semibold">{formatPrice(totalAmount)}</span>
      </div>
      <div className="flex justify-between text-green-500">
        <span>You will save</span>
        <span>{formatPrice(savings)}</span>
      </div>
    </div>
  );

  // If data is not loaded yet
  if (!selectedAddress || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <TopNavigation currentStep={3} />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="lg:flex lg:space-x-8">
          {/* Left Side - Selected Address and Payment Methods */}
          <div className="lg:w-2/3">
            {/* Selected Address */}
            <SelectedAddress address={selectedAddress} />

            {/* Payment Methods */}
            <PaymentMethods />
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:w-1/3">
            <OrderSummary />
          </div>
        </div>
      </div>

      {/* Footer Elements */}
      <FooterElements />
    </div>
  );
};

export default withAuth(PaymentPage);
