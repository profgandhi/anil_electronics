import Footer from './Footer';
import Navbar from './Navbar';



const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className='mt-32'>{children}</main>
      <Footer/>
    </>
  );
};

export default Layout;
