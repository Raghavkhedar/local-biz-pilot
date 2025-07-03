import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './AuthContext';

type Product = Database['public']['Tables']['products']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];
type Invoice = Database['public']['Tables']['invoices']['Row'];
type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];

interface BusinessContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Customer>;
  updateCustomer: (id: number, customer: Partial<Customer>) => Promise<Customer>;
  deleteCustomer: (id: number) => Promise<void>;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>, items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at' | 'updated_at'>[]) => Promise<Invoice>;
  updateInvoice: (id: number, invoice: Partial<Invoice>) => Promise<Invoice>;
  deleteInvoice: (id: number) => Promise<void>;
  getInvoiceItems: (invoiceId: number) => Promise<InvoiceItem[]>;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Fetch initial data
  useEffect(() => {
    if (user) {
      // Fetch products
      supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) setProducts(data);
        });

      // Fetch customers
      supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) setCustomers(data);
        });

      // Fetch invoices
      supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) setInvoices(data);
        });

      // Subscribe to changes
      const productsSubscription = supabase
        .channel('products_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [...prev, payload.new as Product]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new as Product : p));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        })
        .subscribe();

      const customersSubscription = supabase
        .channel('customers_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'customers',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setCustomers(prev => [...prev, payload.new as Customer]);
          } else if (payload.eventType === 'UPDATE') {
            setCustomers(prev => prev.map(c => c.id === payload.new.id ? payload.new as Customer : c));
          } else if (payload.eventType === 'DELETE') {
            setCustomers(prev => prev.filter(c => c.id !== payload.old.id));
          }
        })
        .subscribe();

      const invoicesSubscription = supabase
        .channel('invoices_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setInvoices(prev => [...prev, payload.new as Invoice]);
          } else if (payload.eventType === 'UPDATE') {
            setInvoices(prev => prev.map(i => i.id === payload.new.id ? payload.new as Invoice : i));
          } else if (payload.eventType === 'DELETE') {
            setInvoices(prev => prev.filter(i => i.id !== payload.old.id));
          }
        })
        .subscribe();

      return () => {
        productsSubscription.unsubscribe();
        customersSubscription.unsubscribe();
        invoicesSubscription.unsubscribe();
      };
    }
  }, [user]);

  // Products operations
  const addProduct = async (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...product,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteProduct = async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  // Customers operations
  const addCustomer = async (customer: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('customers')
      .insert({
        ...customer,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateCustomer = async (id: number, customer: Partial<Customer>): Promise<Customer> => {
    const { data, error } = await supabase
      .from('customers')
      .update({
        ...customer,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteCustomer = async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  // Invoices operations
  const addInvoice = async (
    invoice: Omit<Invoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at' | 'updated_at'>[]
  ): Promise<Invoice> => {
    if (!user) throw new Error('User not authenticated');

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        ...invoice,
        user_id: user.id,
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Add invoice items
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(
        items.map(item => ({
          ...item,
          invoice_id: invoiceData.id,
        }))
      );

    if (itemsError) throw itemsError;

    return invoiceData;
  };

  const updateInvoice = async (id: number, invoice: Partial<Invoice>): Promise<Invoice> => {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        ...invoice,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteInvoice = async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  const getInvoiceItems = async (invoiceId: number): Promise<InvoiceItem[]> => {
    const { data, error } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId);

    if (error) throw error;
    return data || [];
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceItems,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};
