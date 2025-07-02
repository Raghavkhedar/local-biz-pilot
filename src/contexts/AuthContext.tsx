
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
  role: 'owner' | 'manager' | 'staff';
  pin: string;
  permissions: string[];
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  businessProfile: BusinessProfile | null;
  isAuthenticated: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;
  createUser: (userData: Omit<User, 'id' | 'lastLogin'>) => void;
  users: User[];
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
  role: 'owner',
  pin: '1234',
  permissions: ['all']
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedProfile = localStorage.getItem('businessProfile');  
    const savedUsers = localStorage.getItem('users');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    if (savedProfile) {
      setBusinessProfile(JSON.parse(savedProfile));
    } else {
      setBusinessProfile(defaultBusinessProfile);
      localStorage.setItem('businessProfile', JSON.stringify(defaultBusinessProfile));
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers([defaultUser]);
      localStorage.setItem('users', JSON.stringify([defaultUser]));
    }
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    const foundUser = users.find(u => u.pin === pin);
    if (foundUser) {
      const updatedUser = { ...foundUser, lastLogin: new Date() };
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

  const createUser = (userData: Omit<User, 'id' | 'lastLogin'>) => {
    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{
      user,
      businessProfile,
      isAuthenticated,
      login,
      logout,
      updateBusinessProfile,
      createUser,
      users
    }}>
      {children}
    </AuthContext.Provider>
  );
};
