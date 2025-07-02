
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const DesktopNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/invoices', label: 'Invoices', icon: '📄' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <nav className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)]">
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default DesktopNavigation;
