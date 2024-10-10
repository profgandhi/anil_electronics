// pages/orders.tsx

import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import withAuth from '../components/withAuth';
import SidebarMenu from '../components/SidebarMenu';
import Breadcrumbs from '../components/Breadcrumbs';


interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  created_at: string;
  total_amount: number;
  items: OrderItem[];
}

const MyOrdersPage: React.FC = () => {
  const { token} = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const getOrders = async () => {
      try {
        const response = await fetchOrders(token);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section with Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Orders' },
          ]}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar Menu */}
          <aside className="w-full md:w-1/4 mb-6 md:mb-0">
            <SidebarMenu activePage="My Orders" /> {/* Use SidebarMenu */}
          </aside>

          {/* Main Content Section */}
          <section className="w-full md:w-3/4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
              {orders.length === 0 ? (
                <p>You have no orders yet.</p>
              ) : (
                <ul>
                  {orders.map((order) => (
                    <li key={order.id} className="border-b py-4">
                      <div>
                        <strong>Order ID:</strong> {order.id}
                      </div>
                      <div>
                        <strong>Date:</strong>{' '}
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                      <div>
                        <strong>Total:</strong> $
                        {order.total_amount.toFixed(2)}
                      </div>
                      <div>
                        <strong>Items:</strong>
                        <ul className="ml-4">
                          {order.items.map((item, index) => (
                            <li key={index}>
                              Product ID: {item.product_id}, Quantity:{' '}
                              {item.quantity}, Price: $
                              {item.price.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default withAuth(MyOrdersPage);
