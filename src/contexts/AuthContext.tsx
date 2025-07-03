
import React, { createContext, useContext, useState, useEffect } from 'react';

interface BusinessProfile {
  id: string;
  companyName: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email: string;
  gstNumber?: string;
  panNumber?: string;
  website?: string;
  currency: string;
  taxRates: {
    cgst: number;
    sgst: number;
    igst: number;
  };
  invoicePrefix: string;
  invoiceNumbering: 'auto' | 'manual';
  lastInvoiceNumber: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  pin: string;
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  businessProfile: BusinessProfile | null;
  isAuthenticated: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const defaultBusinessProfile: BusinessProfile = {
  id: 'default',
  companyName: 'My Business',
  address: '',
  phone: '',
  email: '',
  currency: 'INR',
  taxRates: {
    cgst: 9,
    sgst: 9,
    igst: 18
  },
  invoicePrefix: 'INV',
  invoiceNumbering: 'auto',
  lastInvoiceNumber: 1000
};

const defaultUser: User = {
  id: 'default-owner',
  name: 'Business Owner',
  email: 'owner@business.com',
  pin: '1234'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedProfile = localStorage.getItem('businessProfile');  

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    } else {
      setUser(defaultUser);
      localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    }

    if (savedProfile) {
      setBusinessProfile(JSON.parse(savedProfile));
    } else {
      setBusinessProfile(defaultBusinessProfile);
      localStorage.setItem('businessProfile', JSON.stringify(defaultBusinessProfile));
    }
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    if (pin === defaultUser.pin) {
      const updatedUser = { ...defaultUser, lastLogin: new Date() };
      setUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const updateBusinessProfile = (profile: Partial<BusinessProfile>) => {
    const updated = { ...businessProfile, ...profile } as BusinessProfile;
    setBusinessProfile(updated);
    localStorage.setItem('businessProfile', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user,
      businessProfile,
      isAuthenticated,
      login,
      logout,
      updateBusinessProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
