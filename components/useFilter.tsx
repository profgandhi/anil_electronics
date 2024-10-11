// src/hooks/useFilter.ts
import { useRouter } from 'next/router';
import { useCallback } from 'react';

interface SelectedFilters {
  [key: string]: string | number | [number, number];
}

const useFilter = () => {
  const router = useRouter();
  const { query } = router;

  const updateFilter = useCallback(
    (category: string, value: string | number | [number, number]) => {
      const newQuery: { [key: string]: string } = {};

      // Safely copy existing query parameters as strings
      Object.keys(query).forEach((key) => {
        const currentValue = query[key];
        if (Array.isArray(currentValue)) {
          newQuery[key] = currentValue[0];
        } else if (typeof currentValue === 'string') {
          newQuery[key] = currentValue;
        }
      });

      // Update the specific filter
      if (category === 'PriceRange' && Array.isArray(value)) {
        newQuery[category] = value.join(',');
      } else {
        newQuery[category] = String(value);
      }

      router.push(
        {
          pathname: `/products`,
          query: newQuery,
        },
        undefined,
        { shallow: false } // Ensure the page updates without requiring a refresh
      );
    },
    [router, query]
  );

  const clearFilters = useCallback(() => {
    const { productType,  } = query; // Preserve productType if needed
    const newQuery: { [key: string]: string } = {};

    if (productType && typeof productType === 'string') {
      newQuery['productType'] = productType;
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: false } // Ensure the page updates without requiring a refresh
    );
  }, [router, query]);

  const selectedFilters: SelectedFilters = {};

  Object.keys(query).forEach((key) => {
    const value = query[key];
    if (Array.isArray(value)) {
      selectedFilters[key] = value[0];
    } else if (typeof value === 'string') {
      if (key === 'PriceRange') {
        const [min, max] = value.split(',').map(Number);
        selectedFilters[key] = [min, max] as [number, number];
      } else if (!isNaN(Number(value)) && key !== 'productType') {
        selectedFilters[key] = Number(value);
      } else {
        selectedFilters[key] = value;
      }
    }
  });

  return {
    selectedFilters,
    updateFilter,
    clearFilters,
  };
};

export default useFilter;
