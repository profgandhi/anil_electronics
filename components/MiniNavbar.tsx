import { useState } from 'react';

// 1. Define a flexible Subcategories type
type Subcategories = Record<string, string[]>;

// 2. Define a Category type using the flexible Subcategories
type Category = {
  name: string;
  subcategories: Subcategories;
};

// 3. Explicitly type the categories array
const categories: Category[] = [
  {
    name: 'Air Conditioners',
    subcategories: {
      Brand: ['Voltas', 'Daikin', 'LG', 'Bluestar', 'Godrej', 'Samsung', 'Hitachi'],
      'AC Type': ['Split ACs', 'Window ACs', 'Portable ACs'],
      Capacity: ['1 Ton and Below', '1.1 Ton to 1.5 Ton', '1.6 Ton to 1.9 Ton', '2 Ton and Above'],
      'Energy Rating': ['5 Star ACs', '4 Star ACs', '3 Star ACs', '2 Star ACs', '1 Star ACs'],
      Technology: ['Inverter ACs', 'Fixed Speed ACs'],
      'Ideal Room Size': ['Up to 120 SqFt', '121 SqFt to 180 SqFt', '181 SqFt to 240 SqFt', '241 SqFt to 300 SqFt'],
    },
  },
  {
    name: 'Television',
    subcategories: {
      Brand: ['SANSUI TV', 'Vise TV', 'Samsung TV', 'LG TV'],
      Resolution: ['4K/ULTRA HD TV', 'FULL HD TV', 'HD TV', 'HD READY TV'],
      Technology: ['LED TV', 'OLED TV', 'QLED TV', 'Nanocell TV'],
      'Screen Size': [
        '25 - 32 inch TV',
        '33 - 44 inch TV',
        '45 - 50 inch TV',
        '51 - 55 inch TV',
        '56 - 65 inch TV',
        '66 inch and above TV',
      ],
    },
  },
  {
    name: 'Air Conditioers', // Corrected from 'Air Condoners' if it was a typo
    subcategories: {
      Brand: ['Voltas', 'Daikin', 'LG', 'Bluestar', 'Godrej', 'Samsung', 'Hitachi'],
      'AC Type': ['Split ACs', 'Window ACs', 'Portable ACs'],
      Capacity: ['1 Ton and Below', '1.1 Ton to 1.5 Ton', '1.6 Ton to 1.9 Ton', '2 Ton and Above'],
      'Energy Rating': ['5 Star ACs', '4 Star ACs', '3 Star ACs', '2 Star ACs', '1 Star ACs'],
      Technology: ['Inverter ACs', 'Fixed Speed ACs'],
      'Ideal Room Size': ['Up to 120 SqFt', '121 SqFt to 180 SqFt', '181 SqFt to 240 SqFt', '241 SqFt to 300 SqFt'],
    },
  },
];

// Dark theme color variables with grey border
const bgNavbar = "bg-gray-900";
const textCategory = "text-gray-300";
const hoverTextCategory = "hover:text-red-400";
const dropdownBg = "bg-gray-800";
const textSubcategory = "text-gray-400";
const textSubcategoryTitle = "text-gray-200";
const hoverTextSubcategory = "hover:text-red-500";
const shadowDropdown = "shadow-lg";
const borderDropdown = "border-gray-700";
const separatorBorder = "border-t border-gray-600";  // Grey separator between bars

export default function MiniNavbar() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <nav className={`${bgNavbar} ${separatorBorder} p-3`}>
      <ul className="flex justify-center space-x-8">
        {categories.map((category) => (
          <li
            key={category.name}
            className="relative"
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <button className={`${textCategory} font-semibold ${hoverTextCategory}`}>
              {category.name}
            </button>
            {hoveredCategory === category.name && (
              <div
                className={`absolute left-0 top-full  w-[600px] ${bgNavbar} ${shadowDropdown} ${borderDropdown} rounded-lg p-6 z-10`}
              >
                {/* Dropdown content */}
                <div className="grid grid-cols-3">
                  {Object.keys(category.subcategories).map((subcategoryTitle) => (
                    <div key={subcategoryTitle}>
                      <h4 className={`text-lg font-bold ${textSubcategoryTitle}`}>
                        {subcategoryTitle}
                      </h4>
                      <ul>
                        {category.subcategories[subcategoryTitle].map((item) => (
                          <li key={item} className={`${textSubcategory} py-1 ${hoverTextSubcategory}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

