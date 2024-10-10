import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import { Product } from '../services/api';

// Define categories and options based on product types
const productTypeConfig: Record<string, { categories: string[], options: Record<string, { label: string, value: string }[]> }> = {
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
  const { productType: queryProductType } = router.query;
  const productType = queryProductType || 'air-conditioner';  // Default to 'air-conditioner'
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 3;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);  // Ensure loading state is set to true before fetching

      try {
        const res = await fetch(`http://localhost:5000/api/products?product_type=${productType}`);
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data); // Set initial filtered products to all products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);  // Ensure loading is false after the fetch
      }
    };

    fetchProducts();
  }, [productType]);

  const handleFilterChange = (filters: { [key: string]: string | number | [number, number] }) => {
    let filtered = products;

    if (filters.PriceRange) {
      const [minPrice, maxPrice] = filters.PriceRange as [number, number];
      filtered = filtered.filter((product) => product.price >= minPrice && product.price <= maxPrice);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

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
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-grow ml-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((product) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
