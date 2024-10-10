import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterBarProps {
  categories: string[];
  options: { [key: string]: FilterOption[] };
  onFilterChange: (selectedFilters: { [key: string]: string | number | [number, number] }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, options, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | number | [number, number] }>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const handleFilterChange = (category: string, value: string | number | [number, number]) => {
    const newFilters = { ...selectedFilters, [category]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = Number(e.target.value);
    const newPriceRange: [number, number] = type === 'min' ? [value, priceRange[1]] : [priceRange[0], value];

    if (newPriceRange[0] <= newPriceRange[1]) {
      setPriceRange(newPriceRange);
      handleFilterChange('PriceRange', newPriceRange);
    }
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setPriceRange([0, 1000]);
    onFilterChange({});
  };

  return (
    <div className="top-52 left-0 w-52 bg-white shadow-lg p-4 rounded-lg overflow-y-auto h-full hidden md:block">
      <button onClick={clearFilters} className="bg-red-500 text-white rounded p-2 mb-4">Clear Filters</button>

      <div className="mb-6">
        <label className="font-semibold mb-2 block">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
        <div className="flex space-x-4">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(e, 'min')}
            className="border p-2 w-20"
            min="0"
          />
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 'max')}
            className="border p-2 w-20"
            min="0"
          />
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange[1]}
          onChange={(e) => handlePriceChange(e, 'max')}
          className="w-full mt-2"
        />
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-4">
          <label className="font-semibold mb-2 block">{category}</label>
          <select
            className="border rounded p-2 w-full"
            onChange={(e) => handleFilterChange(category, e.target.value)}
            value={selectedFilters[category] as string ?? ""}
          >
            <option value="">Select {category}</option>
            {options[category].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
