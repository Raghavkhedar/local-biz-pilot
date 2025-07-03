
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BusinessProvider } from '@/contexts/BusinessContext';
import { useState, useEffect } from 'react';
import supabase from './lib/supabase';
import LoginForm from '@/components/auth/LoginForm';
import BusinessProfileForm from '@/components/business/BusinessProfileForm';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Customers from '@/pages/Customers';
import Invoices from '@/pages/Invoices';
import Reports from '@/pages/Reports';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

// Page Component (your todos component)
const Page = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function getTodos() {
      const { data: todos } = await supabase.from('todos').select();
      
      if (todos && todos.length > 0) {
        setTodos(todos);
      }
    }

    getTodos();
  }, []);

  return (
    <div>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title || todo.text || JSON.stringify(todo)}</li>
      ))}
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <BusinessProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<BusinessProfileForm />} />
          <Route path="/todos" element={<Page />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BusinessProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
