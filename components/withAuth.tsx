//components/withAuth.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, role } = useAuth();  // Assuming `useAuth()` provides the `user` object containing the role
    const router = useRouter();
    console.log(isAuthenticated, role )
    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/login'); // Redirect to login if not authenticated
      } else if (role === 'admin' && router.asPath.startsWith('/admin')) {
        router.replace('/admin/products'); // Redirect admin to admin console
      } else if (role !== 'admin' && router.asPath.startsWith('/admin')) {
        router.replace('/'); // Redirect non-admin users to their dashboard if trying to access admin console
      }
    }, [isAuthenticated, role, router]);

    if (!isAuthenticated) {
      return null; // Optionally, render a loader here
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
