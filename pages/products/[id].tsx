// pages/products/[id].tsx
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { fetchProductById, Product as ProductType, addToCart } from '../../services/api';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useGlobal } from '../../context/GlobalContext';
interface ProductPageProps {
  product: ProductType;
}

const ProductPage = ({ product }: ProductPageProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  // Access global cart items and setter
  const { cartItems, setCartItems } = useGlobal();

  const router = useRouter();
  const {token} = useAuth() 

  const handleAddToCart = async () => {
  if (!token) {
    alert('Please log in to add items to the cart.');
    router.push('/login'); // Redirect to login page
    return;
  }
  
  try {
    const response = await addToCart(token, product.id, quantity);
    alert(response.data.message);
    
    // Update global cart state
    setCartItems((prevCartItems) => {
      // Check if the product is already in the cart
      const existingItem = prevCartItems.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // Update quantity if product exists
        return prevCartItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prevCartItems,
          {
            id: Date.now(), // or use a better unique identifier
            product_name: product.name,
            product_id: product.id,
            product_price: product.price,
            discount: 0, // Assuming discount exists
            quantity: quantity,
          },
        ];
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add to cart.');
  }
};

  const handleBuyNow = () => {
    // Implement buy now logic here, e.g., redirect to checkout
    console.log(`Buying ${quantity} ${product.name}`);
    // Example: router.push('/checkout');
  };

  const handleWhatsAppConnect = () => {
    const message = `Hello, I'm interested in the ${product.name}`;
    window.open(`https://wa.me/your-whatsapp-number/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex flex-col lg:flex-row lg:space-x-10">
        {/* Product Image */}
        <div className="flex-shrink-0 lg:w-1/2">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 mt-6 lg:mt-0">
          <h1 className="text-4xl font-bold text-center lg:text-left">{product.name}</h1>
          <p className="text-center lg:text-left text-lg mt-4">{product.description}</p>
          <p className="text-center lg:text-left text-2xl font-semibold mt-4">${product.price.toFixed(2)}</p>
          
          

          {/* WhatsApp Connect Button */}
          <div className="mt-6 flex justify-center lg:justify-start">
            <span className='mt-1 rounded flex items-center text-lg  space-x-2'>Connect with us on <span onClick={handleWhatsAppConnect} className='cursor-pointer bg-green-500 hover:bg-green-600 font-semibold ml-1 p-1 text-lg text-white rounded'>WhatsApp</span></span>
          </div>
          
          {/* Quantity Selector */}
          <div className="mt-6 flex justify-center lg:justify-start">
            <label htmlFor="quantity" className="mr-4 font-semibold">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              className="border rounded px-3 py-2 w-20 text-center"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-3 rounded w-full lg:w-auto font-semibold hover:bg-blue-500"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-3 rounded w-full lg:w-auto font-semibold hover:bg-green-500"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fetch individual product data using the product ID
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const response = await fetchProductById(Number(id));

    // Check if the product exists
    if (response.status === 404) {
      return { notFound: true };
    }

    const product: ProductType = response.data;

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
};

export default ProductPage;
