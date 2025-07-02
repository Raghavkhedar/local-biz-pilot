
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MobileNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/invoices', label: 'Invoices', icon: '📄' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="grid grid-cols-5">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors',
              location.pathname === item.path
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
