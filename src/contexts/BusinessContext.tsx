
import React, { createContext, useContext, useState, useEffect } from 'react';

// Enhanced Product interface with advanced features
export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice?: number;
  quantity: number;
  minStockLevel: number;
  category: string;
  unit: string;
  barcode?: string;
  hsnCode?: string;
  taxRate: number;
  images: string[];
  supplier?: string;
  batchNumbers?: string[];
  serialNumbers?: string[];
  expiryDate?: Date;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Customer interface
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  gstNumber?: string;
  panNumber?: string;
  creditLimit: number;
  outstandingAmount: number;
  customerGroup: 'regular' | 'premium' | 'wholesale';
  loyaltyPoints: number;
  paymentTerms: string;
  discount: number;
  isActive: boolean;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Invoice interface
export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'sale' | 'purchase' | 'quotation' | 'delivery' | 'return';
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'overdue';
  paymentMethod?: 'cash' | 'card' | 'upi' | 'bank' | 'cheque';
  paymentTerms: string;
  dueDate: Date;
  notes?: string;
  termsAndConditions?: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  hsnCode?: string;
}

// New Payment interface
export interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'bank' | 'cheque';
  reference?: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}

// New Transaction interface for customer history
export interface Transaction {
  id: string;
  type: 'sale' | 'payment' | 'return' | 'adjustment';
  amount: number;
  description: string;
  invoiceId?: string;
  paymentId?: string;
  createdAt: Date;
}

// New Expense interface
export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  vendor?: string;
  receipt?: string;
  taxAmount?: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank' | 'cheque';
  isRecurring: boolean;
  createdAt: Date;
}

// New Vendor interface
export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address: string;
  gstNumber?: string;
  panNumber?: string;
  paymentTerms: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  isActive: boolean;
  createdAt: Date;
}

// New Stock Movement interface
export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  cost?: number;
  createdAt: Date;
}

interface BusinessContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'transactions' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomer: (id: string) => Customer | undefined;
  
  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  getPendingInvoices: () => Invoice[];
  getOverdueInvoices: () => Invoice[];
  
  // Payments
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  getPaymentsByInvoice: (invoiceId: string) => Payment[];
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Vendors
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt'>) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  
  // Stock Movements
  stockMovements: StockMovement[];
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'createdAt'>) => void;
  getStockMovements: (productId: string) => StockMovement[];
  
  // Analytics
  getTotalSales: (startDate?: Date, endDate?: Date) => number;
  getTotalExpenses: (startDate?: Date, endDate?: Date) => number;
  getProfit: (startDate?: Date, endDate?: Date) => number;
  getTopProducts: (limit: number) => Product[];
  getTopCustomers: (limit: number) => Customer[];
  
  // Search
  searchProducts: (query: string) => Product[];
  searchCustomers: (query: string) => Customer[];
  searchInvoices: (query: string) => Invoice[];
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

// Sample data with enhanced features
const sampleProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Premium T-Shirt',
    sku: 'TSHIRT-001',
    description: 'High quality cotton t-shirt',
    price: 599,
    costPrice: 300,
    quantity: 150,
    minStockLevel: 20,
    category: 'Apparel',
    unit: 'pcs',
    barcode: '1234567890123',
    hsnCode: '6109',
    taxRate: 12,
    images: [],
    supplier: 'Fashion Supplier Ltd',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  // ... more sample products
];

const sampleCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    email: 'rajesh@email.com',
    address: 'Mumbai, Maharashtra',
    gstNumber: '27AAAAA0000A1Z5',
    creditLimit: 50000,
    outstandingAmount: 15000,
    customerGroup: 'premium',
    loyaltyPoints: 250,
    paymentTerms: 'Net 30',
    discount: 5,
    isActive: true,
    transactions: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  // ... more sample customers
];

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedCustomers = localStorage.getItem('customers');
    const savedInvoices = localStorage.getItem('invoices');
    const savedPayments = localStorage.getItem('payments');
    const savedExpenses = localStorage.getItem('expenses');
    const savedVendors = localStorage.getItem('vendors');
    const savedStockMovements = localStorage.getItem('stockMovements');

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(sampleProducts);
      localStorage.setItem('products', JSON.stringify(sampleProducts));
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      setCustomers(sampleCustomers);
      localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    }

    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }

    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }

    if (savedVendors) {
      setVendors(JSON.parse(savedVendors));
    }

    if (savedStockMovements) {
      setStockMovements(JSON.parse(savedStockMovements));
    }
  }, []);

  // Product functions
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, ...product, updatedAt: new Date() } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  const getLowStockProducts = () => products.filter(p => p.quantity <= p.minStockLevel);

  // Customer functions
  const addCustomer = (customer: Omit<Customer, 'id' | 'transactions' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  };

  const updateCustomer = (id: string, customer: Partial<Customer>) => {
    const updatedCustomers = customers.map(c => 
      c.id === id ? { ...c, ...customer, updatedAt: new Date() } : c
    );
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  };

  const deleteCustomer = (id: string) => {
    const updatedCustomers = customers.filter(c => c.id !== id);
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  };

  const getCustomer = (id: string) => customers.find(c => c.id === id);

  // Invoice functions  
  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    const updatedInvoices = invoices.map(i => 
      i.id === id ? { ...i, ...invoice, updatedAt: new Date() } : i
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const deleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(i => i.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const getInvoice = (id: string) => invoices.find(i => i.id === id);

  const getPendingInvoices = () => invoices.filter(i => i.paymentStatus === 'pending' || i.paymentStatus === 'partial');

  const getOverdueInvoices = () => invoices.filter(i => 
    (i.paymentStatus === 'pending' || i.paymentStatus === 'partial') && 
    new Date(i.dueDate) < new Date()
  );

  // Payment functions
  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `pay-${Date.now()}`,
      createdAt: new Date()
    };
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    localStorage.setItem('payments', JSON.stringify(updatedPayments));

    // Update invoice payment status
    const invoice = getInvoice(payment.invoiceId);
    if (invoice) {
      const totalPaid = updatedPayments
        .filter(p => p.invoiceId === payment.invoiceId && p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const paymentStatus = totalPaid >= invoice.totalAmount ? 'paid' : 
                           totalPaid > 0 ? 'partial' : 'pending';
      
      updateInvoice(payment.invoiceId, { 
        paidAmount: totalPaid,
        balanceAmount: invoice.totalAmount - totalPaid,
        paymentStatus 
      });
    }
  };

  const getPaymentsByInvoice = (invoiceId: string) => 
    payments.filter(p => p.invoiceId === invoiceId);

  // Expense functions
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      createdAt: new Date()
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    const updatedExpenses = expenses.map(e => 
      e.id === id ? { ...e, ...expense } : e
    );
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(e => e.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  // Vendor functions
  const addVendor = (vendor: Omit<Vendor, 'id' | 'createdAt'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: `vendor-${Date.now()}`,
      createdAt: new Date()
    };
    const updatedVendors = [...vendors, newVendor];
    setVendors(updatedVendors);
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
  };

  const updateVendor = (id: string, vendor: Partial<Vendor>) => {
    const updatedVendors = vendors.map(v => 
      v.id === id ? { ...v, ...vendor } : v
    );
    setVendors(updatedVendors);
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
  };

  const deleteVendor = (id: string) => {
    const updatedVendors = vendors.filter(v => v.id !== id);
    setVendors(updatedVendors);
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
  };

  // Stock movement functions
  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'createdAt'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: `mov-${Date.now()}`,
      createdAt: new Date()
    };
    const updatedMovements = [...stockMovements, newMovement];
    setStockMovements(updatedMovements);
    localStorage.setItem('stockMovements', JSON.stringify(updatedMovements));

    // Update product quantity
    const product = getProduct(movement.productId);
    if (product) {
      const quantityChange = movement.type === 'in' ? movement.quantity : -movement.quantity;
      updateProduct(movement.productId, { 
        quantity: Math.max(0, product.quantity + quantityChange) 
      });
    }
  };

  const getStockMovements = (productId: string) => 
    stockMovements.filter(m => m.productId === productId);

  // Analytics functions
  const getTotalSales = (startDate?: Date, endDate?: Date) => {
    return invoices
      .filter(i => i.type === 'sale' && i.paymentStatus === 'paid')
      .filter(i => !startDate || new Date(i.createdAt) >= startDate)
      .filter(i => !endDate || new Date(i.createdAt) <= endDate)
      .reduce((sum, i) => sum + i.totalAmount, 0);
  };

  const getTotalExpenses = (startDate?: Date, endDate?: Date) => {
    return expenses
      .filter(e => !startDate || new Date(e.createdAt) >= startDate)
      .filter(e => !endDate || new Date(e.createdAt) <= endDate)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getProfit = (startDate?: Date, endDate?: Date) => {
    return getTotalSales(startDate, endDate) - getTotalExpenses(startDate, endDate);
  };

  const getTopProducts = (limit: number) => {
    const productSales = products.map(product => {
      const sales = invoices
        .filter(i => i.type === 'sale')
        .flatMap(i => i.items)
        .filter(item => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...product, totalSold: sales };
    });

    return productSales
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);
  };

  const getTopCustomers = (limit: number) => {
    const customerSales = customers.map(customer => {
      const sales = invoices
        .filter(i => i.customerId === customer.id && i.type === 'sale')
        .reduce((sum, i) => sum + i.totalAmount, 0);
      
      return { ...customer, totalPurchases: sales };
    });

    return customerSales
      .sort((a, b) => b.totalPurchases - a.totalPurchases)
      .slice(0, limit);
  };

  // Search functions
  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.sku.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      (p.barcode && p.barcode.includes(query))
    );
  };

  const searchCustomers = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.phone.includes(query) ||
      (c.email && c.email.toLowerCase().includes(lowerQuery)) ||
      (c.gstNumber && c.gstNumber.toLowerCase().includes(lowerQuery))
    );
  };

  const searchInvoices = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return invoices.filter(i => 
      i.invoiceNumber.toLowerCase().includes(lowerQuery) ||
      i.customerName.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <BusinessContext.Provider value={{
      products,
      customers,
      invoices,
      payments,
      expenses,
      vendors,
      stockMovements,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      getLowStockProducts,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      getCustomer,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      getInvoice,
      getPendingInvoices,
      getOverdueInvoices,
      addPayment,
      getPaymentsByInvoice,
      addExpense,
      updateExpense,
      deleteExpense,
      addVendor,
      updateVendor,
      deleteVendor,
      addStockMovement,
      getStockMovements,
      getTotalSales,
      getTotalExpenses,
      getProfit,
      getTopProducts,
      getTopCustomers,
      searchProducts,
      searchCustomers,
      searchInvoices
    }}>
      {children}
    </BusinessContext.Provider>
  );
};
