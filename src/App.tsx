
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BusinessProvider } from '@/contexts/BusinessContext';
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <LoginForm />;
};

const AppRoutes = () => {
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
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
