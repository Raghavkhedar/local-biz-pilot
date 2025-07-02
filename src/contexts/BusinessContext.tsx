
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
  lowStockThreshold: number;
  images?: string[];
  unit?: string;
  hsnCode?: string;
  taxRate?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gstNumber?: string;
  creditLimit?: number;
  customerGroup?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gstNumber?: string;
  paymentTerms?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
  hsnCode?: string;
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
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  notes?: string;
}

export interface Payment {
  id: string;
  invoiceId?: string;
  customerId?: string;
  vendorId?: string;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque';
  reference?: string;
  date: Date;
  type: 'received' | 'paid';
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  vendorId?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque';
  reference?: string;
  createdAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  date: Date;
  createdAt: Date;
}

export interface BusinessState {
  products: Product[];
  customers: Customer[];
  vendors: Vendor[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  stockMovements: StockMovement[];
}

// Sample data
const initialState: BusinessState = {
  products: [
    {
      id: '1',
      name: 'Laptop Stand',
      sku: 'LS001',
      price: 2500,
      quantity: 25,
      category: 'Electronics',
      lowStockThreshold: 5,
      hsnCode: '8471',
      taxRate: 18,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Wireless Mouse',
      sku: 'WM002',
      price: 800,
      quantity: 50,
      category: 'Electronics',
      lowStockThreshold: 10,
      hsnCode: '8471',
      taxRate: 18,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ],
  customers: [
    {
      id: '1',
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john@example.com',
      address: '123 Main St, City',
      gstNumber: '27AAAAA0000A1Z5',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    }
  ],
  vendors: [],
  invoices: [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      customerId: '1',
      customerName: 'John Doe',
      items: [
        {
          productId: '1',
          productName: 'Laptop Stand',
          quantity: 2,
          unitPrice: 2500,
          total: 5000,
          taxRate: 18,
          hsnCode: '8471'
        }
      ],
      subtotal: 5000,
      tax: 900,
      total: 5900,
      status: 'paid',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      dueDate: new Date('2024-02-15')
    }
  ],
  payments: [],
  expenses: [],
  stockMovements: []
};

// Actions
type BusinessAction =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'ADD_VENDOR'; payload: Vendor }
  | { type: 'UPDATE_VENDOR'; payload: Vendor }
  | { type: 'DELETE_VENDOR'; payload: string }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'DELETE_PAYMENT'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_STOCK_MOVEMENT'; payload: StockMovement }
  | { type: 'LOAD_DATA'; payload: BusinessState };

// Reducer
const businessReducer = (state: BusinessState, action: BusinessAction): BusinessState => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CUSTOMER':
      return { ...state, customers: state.customers.filter(c => c.id !== action.payload) };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(i => i.id === action.payload.id ? action.payload : i)
      };
    case 'DELETE_INVOICE':
      return { ...state, invoices: state.invoices.filter(i => i.id !== action.payload) };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
};

// Context
interface BusinessContextType {
  state: BusinessState;
  dispatch: React.Dispatch<BusinessAction>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessContext must be used within a BusinessProvider');
  }
  return context;
};

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(businessReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('businessData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert string dates back to Date objects
        const processedData = {
          ...parsedData,
          products: parsedData.products?.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt)
          })) || [],
          customers: parsedData.customers?.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt)
          })) || [],
          invoices: parsedData.invoices?.map((i: any) => ({
            ...i,
            createdAt: new Date(i.createdAt),
            updatedAt: new Date(i.updatedAt),
            dueDate: new Date(i.dueDate)
          })) || []
        };
        dispatch({ type: 'LOAD_DATA', payload: processedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('businessData', JSON.stringify(state));
  }, [state]);

  return (
    <BusinessContext.Provider value={{ state, dispatch }}>
      {children}
    </BusinessContext.Provider>
  );
};
