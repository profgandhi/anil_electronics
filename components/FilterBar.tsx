// src/components/FilterBar.tsx
import useFilter from '../components/useFilter';

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterBarProps {
  categories: string[];
  options: { [key: string]: FilterOption[] };
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, options }) => {
  const { selectedFilters, updateFilter, clearFilters } = useFilter();
  const priceRange = (selectedFilters.PriceRange as [number, number]) || [0, 1000000];

  const handleFilterChange = (category: string, value: string | number | [number, number]) => {
    updateFilter(category, value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = Number(e.target.value);
    const newPriceRange: [number, number] = [...priceRange] as [number, number];

    if (type === 'min') {
      newPriceRange[0] = value;
    } else {
      newPriceRange[1] = value;
    }

    if (newPriceRange[0] <= newPriceRange[1]) {
      handleFilterChange('PriceRange', newPriceRange);
    }
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg overflow-y-auto h-full hidden md:block">
      <button onClick={clearFilters} className="bg-red-500 text-white rounded p-2 mb-4 w-full">
        Clear Filters
      </button>

      <div className="mb-6">
        <label className="font-semibold mb-2 block">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
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
          max="1000000"
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
            value={(selectedFilters[category] as string) ?? ""}
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
