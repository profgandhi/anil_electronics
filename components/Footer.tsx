// components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image'
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-10 z-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">About Us</h2>
            <p className="text-gray-400">
              We provide the best electrical goods, from air conditioners to microwaves, to help make your life easier and more comfortable.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <ul className="text-gray-400 space-y-2">
              <li>
        
                  <Link  href="/" className="hover:text-white">Home</Link>
                
              </li>
              <li>
       
                  <Link href="/products" className="hover:text-white">Products</Link>
              
              </li>
              <li>
                  <Link  href="/contact" className="hover:text-white">Contact Us</Link>
          
              </li>
              <li>
               
                  <Link href="/about" className="hover:text-white">About Us</Link>
         
              </li>
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Connect with Us</h2>
            <p className="text-gray-400">1234 Market St, City, Country</p>
            <p className="text-gray-400">Email: info@electricalstore.com</p>
            <p className="text-gray-400">Phone: +123 456 7890</p>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Image src="/facebook-icon.png" alt="Facebook" className="w-6 h-6" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Image src="/twitter-icon.png" alt="Twitter" className="w-6 h-6" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Image src="/instagram-icon.png" alt="Instagram" className="w-6 h-6" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Image src="/linkedin-icon.png" alt="LinkedIn" className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Electrical Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
