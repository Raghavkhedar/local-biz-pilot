
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
  barcode?: string;
  image?: string;
  lowStockThreshold: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gstNumber?: string;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'finalized' | 'paid';
  createdAt: string;
  dueDate: string;
}

interface BusinessState {
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  isLoading: boolean;
}

type BusinessAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'SET_INVOICES'; payload: Invoice[] }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string };

const initialState: BusinessState = {
  products: [],
  customers: [],
  invoices: [],
  isLoading: true,
};

const businessReducer = (state: BusinessState, action: BusinessAction): BusinessState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c => 
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(c => c.id !== action.payload),
      };
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(i => 
          i.id === action.payload.id ? action.payload : i
        ),
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(i => i.id !== action.payload),
      };
    default:
      return state;
  }
};

const BusinessContext = createContext<{
  state: BusinessState;
  dispatch: React.Dispatch<BusinessAction>;
} | null>(null);

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessContext must be used within a BusinessProvider');
  }
  return context;
};

// Sample data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH001',
    price: 99.99,
    quantity: 25,
    category: 'Electronics',
    barcode: '1234567890123',
    lowStockThreshold: 10,
  },
  {
    id: '2',
    name: 'Coffee Mug',
    sku: 'CM001',
    price: 12.99,
    quantity: 5,
    category: 'Home & Kitchen',
    lowStockThreshold: 10,
  },
  {
    id: '3',
    name: 'Office Chair',
    sku: 'OC001',
    price: 149.99,
    quantity: 8,
    category: 'Furniture',
    lowStockThreshold: 5,
  },
  {
    id: '4',
    name: 'Smartphone Case',
    sku: 'SC001',
    price: 24.99,
    quantity: 50,
    category: 'Electronics',
    lowStockThreshold: 15,
  },
  {
    id: '5',
    name: 'Water Bottle',
    sku: 'WB001',
    price: 19.99,
    quantity: 3,
    category: 'Sports',
    lowStockThreshold: 10,
  },
];

const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1234567890',
    email: 'john.smith@email.com',
    address: '123 Main St, City, State 12345',
    gstNumber: 'GST123456789',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1987654321',
    email: 'sarah.j@email.com',
    address: '456 Oak Ave, City, State 12345',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Mike Chen',
    phone: '+1122334455',
    email: 'mike.chen@email.com',
    address: '789 Pine Rd, City, State 12345',
    gstNumber: 'GST987654321',
    createdAt: '2024-03-10T09:15:00Z',
  },
];

const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    customerId: '1',
    customerName: 'John Smith',
    items: [
      {
        productId: '1',
        productName: 'Wireless Headphones',
        quantity: 2,
        price: 99.99,
        total: 199.98,
      },
      {
        productId: '4',
        productName: 'Smartphone Case',
        quantity: 1,
        price: 24.99,
        total: 24.99,
      },
    ],
    subtotal: 224.97,
    tax: 22.50,
    total: 247.47,
    status: 'finalized',
    createdAt: '2024-06-01T10:00:00Z',
    dueDate: '2024-06-15T10:00:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    customerId: '2',
    customerName: 'Sarah Johnson',
    items: [
      {
        productId: '3',
        productName: 'Office Chair',
        quantity: 1,
        price: 149.99,
        total: 149.99,
      },
    ],
    subtotal: 149.99,
    tax: 15.00,
    total: 164.99,
    status: 'paid',
    createdAt: '2024-06-15T14:30:00Z',
    dueDate: '2024-06-30T14:30:00Z',
  },
];

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(businessReducer, initialState);

  useEffect(() => {
    // Load data from localStorage or initialize with sample data
    const loadData = () => {
      try {
        const savedProducts = localStorage.getItem('bizmanager-products');
        const savedCustomers = localStorage.getItem('bizmanager-customers');
        const savedInvoices = localStorage.getItem('bizmanager-invoices');

        if (savedProducts) {
          dispatch({ type: 'SET_PRODUCTS', payload: JSON.parse(savedProducts) });
        } else {
          dispatch({ type: 'SET_PRODUCTS', payload: sampleProducts });
        }

        if (savedCustomers) {
          dispatch({ type: 'SET_CUSTOMERS', payload: JSON.parse(savedCustomers) });
        } else {
          dispatch({ type: 'SET_CUSTOMERS', payload: sampleCustomers });
        }

        if (savedInvoices) {
          dispatch({ type: 'SET_INVOICES', payload: JSON.parse(savedInvoices) });
        } else {
          dispatch({ type: 'SET_INVOICES', payload: sampleInvoices });
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        dispatch({ type: 'SET_PRODUCTS', payload: sampleProducts });
        dispatch({ type: 'SET_CUSTOMERS', payload: sampleCustomers });
        dispatch({ type: 'SET_INVOICES', payload: sampleInvoices });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('bizmanager-products', JSON.stringify(state.products));
      localStorage.setItem('bizmanager-customers', JSON.stringify(state.customers));
      localStorage.setItem('bizmanager-invoices', JSON.stringify(state.invoices));
    }
  }, [state.products, state.customers, state.invoices, state.isLoading]);

  return (
    <BusinessContext.Provider value={{ state, dispatch }}>
      {children}
    </BusinessContext.Provider>
  );
};
