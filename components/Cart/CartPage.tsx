// components/Cart/CartPage.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TopNavigation from '../Cart/TopNavigation';
import FooterElements from '../Cart/FooterElements';
import { useAuth } from '../../context/AuthContext';
import {
  fetchCart,
  updateCartItem,
  deleteCartItem,
  fetchProductById,
} from '../../services/api';
import { useGlobal, CartItem as GlobalCartItem } from '../../context/GlobalContext';
import withAuth from '../../components/withAuth';
import { formatPrice } from '../Cart/formatPrice';

const CartPage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { cartItems, setCartItems } = useGlobal();

  // State for coupon
  const [coupon, setCoupon] = useState('');
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetchCart(token);
        const cartItemsData = response.data;

        const itemsWithDetails: GlobalCartItem[] = await Promise.all(
          cartItemsData.map(async (cartItem: any) => {
            const productResponse = await fetchProductById(cartItem.product_id);
            const product = productResponse.data;
            return {
              id: cartItem.id,
              product_id: cartItem.product_id,
              product_name: product.name,
              product_price: product.price,
              discount: cartItem.discount || 0,
              quantity: cartItem.quantity,
            };
          })
        );

        setCartItems(itemsWithDetails);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Failed to load cart items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [token, setCartItems]);

  // Handlers for cart items
  const increaseQty = async (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item || !token) return;

    try {
      await updateCartItem(token, item.product_id, item.quantity + 1);
      setCartItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, quantity: it.quantity + 1 } : it
        )
      );
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError('Failed to update item quantity. Please try again.');
    }
  };

  const decreaseQty = async (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item || !token || item.quantity <= 1) return;

    try {
      await updateCartItem(token, item.product_id, item.quantity - 1);
      setCartItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, quantity: it.quantity - 1 } : it
        )
      );
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError('Failed to update item quantity. Please try again.');
    }
  };

  const deleteItem = async (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item || !token) return;

    try {
      await deleteCartItem(token, item.product_id);
      setCartItems((prev) => prev.filter((it) => it.id !== id));
    } catch (error) {
      console.error('Error deleting cart item:', error);
      setError('Failed to delete item. Please try again.');
    }
  };

  // Handler for applying coupon
  const applyCoupon = () => {
    if (!coupon.trim()) {
      setError('Please enter a valid coupon code.');
      return;
    }
    // Implement actual coupon logic here
    alert(`Coupon "${coupon}" applied!`);
    setCoupon('');
    setIsCouponOpen(false);
  };

  // Calculations
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product_price * item.quantity,
    0
  );
  const savings = cartItems.reduce(
    (total, item) => total + item.product_price * item.discount * item.quantity,
    0
  );

  // Sub-components

  // Coupon Section Component
  const CouponSection: React.FC = () => (
    <div className="border rounded p-4 mb-4 bg-white">
      <button
        className="w-full flex justify-between items-center focus:outline-none"
        onClick={() => setIsCouponOpen(!isCouponOpen)}
      >
        <span className="font-semibold">APPLY COUPON</span>
        <span className="text-xl">{isCouponOpen ? '-' : '+'}</span>
      </button>
      {isCouponOpen && (
        <div className="mt-2 flex">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 border rounded-l px-2 py-1"
          />
          <button
            onClick={applyCoupon}
            className="bg-red-500 text-white px-4 py-1 rounded-r"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );

  // Order Summary Component
  interface OrderSummaryProps {
    cartItems: GlobalCartItem[];
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
    deleteItem: (id: number) => void;
  }

  const OrderSummary: React.FC<OrderSummaryProps> = ({
    cartItems,
    increaseQty,
    decreaseQty,
    deleteItem,
  }) => {
    if (cartItems.length === 0) return null;

    return (
      <div className="border rounded p-4 mb-4 bg-white">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center mb-4"
          >
            <div>
              <p className="font-medium">{item.product_name}</p>
              <p className="text-sm text-gray-600">
                {formatPrice(item.product_price)}{' '}
                {item.discount > 0 && (
                  <>
                    <span className="line-through text-gray-500">
                      {formatPrice(item.product_price / (1 - item.discount))}
                    </span>{' '}
                    <span className="text-green-500">
                      {Math.round(item.discount * 100)}% off
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => decreaseQty(item.id)}
                className="px-2 py-1 border rounded-l focus:outline-none"
                aria-label={`Decrease quantity of ${item.product_name}`}
              >
                −
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                onClick={() => increaseQty(item.id)}
                className="px-2 py-1 border rounded-r focus:outline-none"
                aria-label={`Increase quantity of ${item.product_name}`}
              >
                +
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="ml-4 text-red-500 focus:outline-none"
                title="Delete Item"
                aria-label={`Delete ${item.product_name} from cart`}
              >
                {/* Trash Icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Payment Details Component
  interface PaymentDetailsProps {
    totalAmount: number;
    savings: number;
    proceed: () => void;
  }

  const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    totalAmount,
    savings,
    proceed,
  }) => (
    <div className="border rounded p-4 mb-4 bg-white">
      <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
      <div className="flex justify-between mb-2">
        <span>Price ({cartItems.length} Item{cartItems.length > 1 ? 's' : ''})</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Delivery Charges</span>
        <span>Free</span>
      </div>
      <div className="flex justify-between font-bold text-lg mb-2">
        <span>Total Amount</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      <div className="text-green-500 mb-4">
        You will save {formatPrice(savings)} on this order.
      </div>
      <button
        onClick={proceed}
        className={`w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 focus:outline-none ${
          cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={cartItems.length === 0}
      >
        Proceed to Address
      </button>
    </div>
  );

  // Handler to proceed to Address Page
  const proceedToAddress = () => {
    if (cartItems.length > 0) {
      router.push('/address');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <TopNavigation currentStep={1} />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-4">
        {loading ? (
          <div className="text-center py-10">
            <p>Loading cart items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => router.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Retry
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:flex lg:space-x-8">
            {/* Left Side - Coupons, Order Summary */}
            <div className="lg:w-2/3">
              <CouponSection />
              <OrderSummary
                cartItems={cartItems}
                increaseQty={increaseQty}
                decreaseQty={decreaseQty}
                deleteItem={deleteItem}
              />
            </div>
            {/* Right Side - Payment Details */}
            <div className="lg:w-1/3">
              <PaymentDetails
                totalAmount={totalAmount}
                savings={savings}
                proceed={proceedToAddress}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Elements */}
      <FooterElements />
    </div>
  );
};

export default withAuth(CartPage);
