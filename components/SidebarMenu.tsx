// components/SidebarMenu.tsx

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

interface SidebarMenuProps {
  activePage: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ activePage }) => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Personal Info', href: '/profile' },
    { name: 'My Orders', href: '/orders' },
    { name: 'Manage Address', href: '/manage_address' },
    //{ name: 'E-Services', href: '/e-services' },
    //{ name: 'Subscription', href: '/subscription' },
    //{ name: 'Change Password', href: '/change_password' },
  ];

  return (
    <nav className="bg-white p-4 rounded-lg shadow">
      <ul>
        {menuItems.map((item) => (
          <li key={item.href} className="mb-2">
            <Link
              href={item.href}
              className={`block px-4 py-2 rounded ${
                activePage === item.name
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarMenu;
