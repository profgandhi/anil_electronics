// context/GlobalContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

export type AddressType = 'Home' | 'Office' | 'Other' | '';

export interface Address {
  id: number;
  houseNo: string;
  roadName: string;
  landmark?: string;
  pinCode: string;
  city: string;
  state: string;
  addressType: AddressType;
  created_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  discount: number;
}

interface GlobalContextProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  selectedAddress: Address | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  return (
    <GlobalContext.Provider
      value={{
        cartItems,
        setCartItems,
        addresses,
        setAddresses,
        selectedAddress,
        setSelectedAddress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
