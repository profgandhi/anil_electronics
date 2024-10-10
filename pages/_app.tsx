import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext';
import { GlobalProvider } from '../context/GlobalContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default MyApp;
