import axios, { AxiosResponse } from 'axios';
import { Address } from '../context/GlobalContext';
// Define types for the data models

interface User {
    id: number;
    username: string;
    password: string;
}
export interface RegisterUserData {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    landline_number?: string;
    date_of_birth?: string; // Format: 'YYYY-MM-DD'
    date_of_anniversary?: string; // Format: 'YYYY-MM-DD'
    gender?: string;
}
export interface LoginUserData {
    identifier: string; // Can be either username or email
    password: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  product_type?: string; 
  metadata?: Record<string, any>; // Add metadata field (JSON structure)
  img?: string;
}

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
}

interface LoginResponse {
    access_token: string;
    role: string;
}

// New Interfaces for Orders
interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    created_at: string; // ISO date string
    total_amount: number;
    items: OrderItem[];
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    landlineNumber: string;
    dateOfBirth: string;
    dateOfAnniversary: string;
    gender: 'Male' | 'Female' | 'Other' | '';
    points: number;
  }

// Set up Axios instance with the base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',  // Flask backend URL
});

// API Calls with TypeScript type annotations

export const registerUser = (userData: RegisterUserData): Promise<AxiosResponse<{ message: string }>> => 
    api.post('/register', userData);

export const loginUser = (loginData: LoginUserData): Promise<AxiosResponse<LoginResponse>> => 
    api.post('/login', loginData);




//---------------------------------------- PRODUCTS START ---------------------------------------------------------------------------------------------

export const fetchProducts = (): Promise<AxiosResponse<Product[]>> => 
  api.get('/products');

export const fetchProductById = (id: number): Promise<AxiosResponse<Product>> => 
  api.get(`/products/${id}`);


// Add Product
export const addProduct = (
  token: string,
  productData: Partial<Product>
): Promise<AxiosResponse<{ message: string; product_id: number }>> =>
  api.post('/products', productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Edit Product
export const editProduct = (
  token: string,
  productId: number,
  updatedData: Partial<Product>
): Promise<AxiosResponse<{ message: string }>> =>
  api.put(`/products/${productId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Delete Product
export const deleteProduct = (
  token: string,
  productId: number
): Promise<AxiosResponse<{ message: string }>> =>
  api.delete(`/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//---------------------------------------- PRODUCTS END ---------------------------------------------------------------------------------------------



//----------------------------------------CART START ---------------------------------------------------------------------------------------------
export const addToCart = (
  token: string,
  productId: number,
  quantity: number
): Promise<AxiosResponse<{ message: string }>> => 
    api.post('/cart', { product_id: productId, quantity }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

export const fetchCart = (token: string): Promise<AxiosResponse<CartItem[]>> => 
    api.get('/cart', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

export const updateCartItem = (
  token: string,
  productId: number,
  quantity: number
): Promise<AxiosResponse<{ message: string }>> =>
  api.put(
    '/cart',
    { product_id: productId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const deleteCartItem = (
  token: string,
  productId: number
): Promise<AxiosResponse<{ message: string }>> =>
  api.delete(`/cart/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//---------------------------------------- CART END ---------------------------------------------------------------------------------------------

//---------------------------------------- ADDRESS START ---------------------------------------------------------------------------------------------
// Add Address

export const addAddress = (
  token: string,
  address: Omit<Address, 'id' | 'created_at'>
): Promise<AxiosResponse<{ message: string; address_id: number }>> =>
  api.post('/address', address, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });




// Fetch Addresses
export const fetchAddresses = (
  token: string
): Promise<AxiosResponse<Address[]>> =>
  api.get<Address[]>('/address', { // Changed from '/addresses' to '/address'
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const editAddress = (
  token: string,
  address_id: number,
  updatedAddress: Partial<Omit<Address, 'id' | 'created_at'>>
): Promise<AxiosResponse<{ message: string }>> =>
  api.put(`/address/${address_id}`, updatedAddress, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
// Delete Address Function
export const deleteAddress = (
  token: string,
  address_id: number
): Promise<AxiosResponse<{ message: string }>> =>
  api.delete(`/address/${address_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  

//---------------------------------------- ADDRESS END ---------------------------------------------------------------------------------------------


//---------------------------------------- ORDERS START ---------------------------------------------------------------------------------------------
// Fetch Orders
export const fetchOrders = (token: string): Promise<AxiosResponse<Order[]>> => 
    api.get('/orders', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
export const createOrder = (
  token: string,
  orderData: any
): Promise<AxiosResponse<{ message: string }>> =>
  api.post('/orders', orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
//---------------------------------------- ORDERS END ---------------------------------------------------------------------------------------------

export const fetchProfile = (token: string | null): Promise<AxiosResponse<UserProfile>> => 
  api.get('/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


