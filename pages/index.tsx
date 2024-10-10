import Slider from '../components/Slider';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <div className="container mx-auto">
        <Slider />
        <h1 className="text-center text-4xl mt-10 font-bold">Welcome to Our Store</h1>
        <p className="text-center text-lg mt-4">
          Discover the best products at unbeatable prices. Shop now and enjoy an amazing shopping experience!
        </p>
        <div className="mt-10 flex justify-center">
          <Link href="/products" className="bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 transition">
            Explore Products
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
