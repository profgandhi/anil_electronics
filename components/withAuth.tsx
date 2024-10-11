import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, role, loading  } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If not authenticated, redirect to login
      if (loading) {
        return;
      }
      if (!isAuthenticated) {
        if (router.asPath !== '/login') {
          router.replace('/login');
        }
        return;
      }

      const isAdminRoute = router.asPath.startsWith('/admin');

      // If user is trying to access admin routes
      if (isAdminRoute) {
        if (role !== 'admin') {
          // Non-admin users are redirected to the home page
          router.replace('/');
        }
        // Admin users can access admin routes
      } else {
        // Non-admin routes can be accessed by all authenticated users
        // If you want to redirect admin users to a specific dashboard, you can add:
        // if (role === 'admin') {
        //   router.replace('/admin/dashboard');
        // }
      }
    }, [isAuthenticated, role, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null; // Optionally, render a loader here
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
