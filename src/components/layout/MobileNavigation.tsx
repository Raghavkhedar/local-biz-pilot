
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  BarChart3,
  Plus,
  Zap
} from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      activeColor: 'text-blue-600 bg-blue-50'
    },
    { 
      path: '/products', 
      label: 'Products', 
      icon: Package,
      activeColor: 'text-emerald-600 bg-emerald-50'
    },
    { 
      path: '/invoices', 
      label: 'Invoices', 
      icon: FileText,
      activeColor: 'text-purple-600 bg-purple-50'
    },
    { 
      path: '/customers', 
      label: 'Customers', 
      icon: Users,
      activeColor: 'text-indigo-600 bg-indigo-50'
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: BarChart3,
      activeColor: 'text-amber-600 bg-amber-50'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 z-50 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 transition-all duration-200 relative',
                isActive
                  ? `${item.activeColor} font-medium`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-current rounded-b-full" />
              )}
              
              <div className={cn(
                'p-1.5 rounded-lg transition-transform',
                isActive ? 'scale-110' : 'scale-100'
              )}>
                <Icon className="h-5 w-5" />
              </div>
              
              <span className="text-xs font-medium truncate px-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <div className="absolute -top-6 right-4">
        <Link
          to="/invoices?action=new"
          className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
