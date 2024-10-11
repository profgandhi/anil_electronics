//  /pages/products.tsx
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FilterBar from '../components/FilterBar';
import { Product } from '../services/api';

// Define categories and options based on product types
const productTypeConfig: Record<
  string,
  {
    categories: string[];
    options: Record<string, { label: string; value: string }[]>;
  }
> = {
  'air-conditioner': {
    categories: ['Brand', 'AC Type'],
    options: {
      Brand: [
        { label: 'Voltas', value: 'voltas' },
        { label: 'Daikin', value: 'daikin' },
        { label: 'LG', value: 'lg' },
        // ...other brands
      ],
      'AC Type': [
        { label: 'Split ACs', value: 'split-acs' },
        { label: 'Window ACs', value: 'window-acs' },
        // ...other AC types
      ],
      // Add other options for Air Conditioner
    },
  },
  television: {
    categories: ['Brand', 'Screen Size'],
    options: {
      Brand: [
        { label: 'Sony', value: 'sony' },
        { label: 'Samsung', value: 'samsung' },
        { label: 'LG', value: 'lg' },
        // ...other brands
      ],
      'Screen Size': [
        { label: '32 inch', value: '32-inch' },
        { label: '42 inch', value: '42-inch' },
        // ...other screen sizes
      ],
      // Add other options for Television
    },
  },
  // Add more product types as needed
};

const Products = () => {
  const router = useRouter();
  const { productType: queryProductType, ...queryFilters } = router.query;
  const productType = typeof queryProductType === 'string' ? queryProductType : 'air-conditioner'; // Default to 'air-conditioner'

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [productType]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply Search filter
  if (queryFilters.search) {
    const searchTerm = Array.isArray(queryFilters.search)
      ? queryFilters.search[0].toLowerCase()
      : queryFilters.search.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
    );
    //console.log(filtered)
  }

    // Apply PriceRange filter
    if (queryFilters.PriceRange) {
      const priceRangeStr = Array.isArray(queryFilters.PriceRange)
        ? queryFilters.PriceRange[0]
        : queryFilters.PriceRange;
      const [minPrice, maxPrice] = priceRangeStr.split(',').map(Number);
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filtered = filtered.filter(
          (product) => product.price >= minPrice && product.price <= maxPrice
        );
      }
    }

    // Apply other category filters
    Object.keys(queryFilters).forEach((key) => {
      if (key !== 'PriceRange' && key !== 'search') {
        const value = Array.isArray(queryFilters[key]) ? queryFilters[key][0] : queryFilters[key];
        if (value) {
          filtered = filtered.filter((product) => {
            const productValue = product.metadata ? product.metadata[key] : undefined;
            
            return productValue === value;
          });
        }
      }
    });

    return filtered;
  }, [queryFilters, products]);

  if (loading) {
    return <div className="text-center mt-10">Loading products...</div>;
  }

  const config = productTypeConfig[productType as keyof typeof productTypeConfig];

  if (!config) {
    return <div className="text-center mt-10">Invalid product type</div>;
  }

  return (
    <div className="px-4 w-full">
      <h1 className="text-3xl font-bold text-center">Our {productType} Products</h1>

      {/* Flex layout: FilterBar on the left and Products Grid on the right */}
      <div className="mt-6 flex">
        {/* FilterBar */}
        <div className="w-64">
          <FilterBar
            categories={config.categories}
            options={config.options}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-grow ml-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center mt-10">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border p-5 shadow-lg rounded-lg">
                  <Link href={`/products/${product.id}`}>
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-72 object-cover rounded"
                    />
                    <div className="mt-2">
                      <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
                      <p className="text-gray-600">{product.description}</p>
                      <p className="text-lg font-semibold mt-3">${product.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
