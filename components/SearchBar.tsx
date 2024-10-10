// components/SearchBar.tsx
import { useState } from 'react';

// Dark theme color variables for search bar
const bgSearchInput = "bg-gray-800";
const textSearchInput = "text-gray-300";
const borderSearchInput = "border-gray-700";
const focusRingSearchInput = "focus:ring-gray-600";

export default function SearchBar() {
  const [search, setSearch] = useState('');

  return (
    <div className="hidden md:flex items-center flex-grow mx-8 h-full">
      <input
        type="text"
        className={`w-full ${bgSearchInput} ${textSearchInput} rounded-lg px-6 py-2 h-12 border ${borderSearchInput} focus:outline-none focus:ring-2 ${focusRingSearchInput}`}
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
