// context/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginUser, LoginUserData, fetchProfile, UserProfile } from '../services/api';  // Ensure fetchProfile is imported
import axios from 'axios';

// Define the types for the authentication context
interface AuthContextType {
  token: string | null;
  //user: UserProfile | null;
  role: string | null;
  fullName: string;
  mobileNumber: string;
  email: string;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role,setRole] = useState<string | null>(null);
  
  // Function to fetch user profile
  const getUserProfile = async (authToken: string) => {
    try {
      const response = await fetchProfile(authToken);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Optionally, handle token expiration by logging out the user
      logout();
    }
  };

  useEffect(() => {
    // Check if token exists in localStorage on app load
    const savedToken = localStorage.getItem('auth_token');
    const storedRole = localStorage.getItem('role');
    if (savedToken && storedRole) {
      setToken(savedToken);
      setRole(storedRole);
      getUserProfile(savedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  // Login function that calls the API and saves the token
  const login = async (identifier: string, password: string) => {
    try {
      const loginData: LoginUserData = { identifier, password };
      const response = await loginUser(loginData);
      const { access_token,role } = response.data;
      setRole(role)
      setToken(access_token);
      localStorage.setItem('role', role);
      localStorage.setItem('auth_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      // Fetch and set user profile after successful login
      await getUserProfile(access_token);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  };

  // Logout function that clears the token and user data
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
    // Optionally, redirect to login page or home
    // For example:
    // window.location.href = '/login';
  };

  // Extract user details or set default empty strings if user is null
  const fullName = user?.firstName || '';
  const mobileNumber = user?.phoneNumber || '';
  const email = user?.email || '';

  // Value passed to the context consumers
  const value: AuthContextType = {
    token,
    //user,
    role,
    fullName,
    mobileNumber,
    email,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
