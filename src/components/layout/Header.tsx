
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/products':
        return 'Products';
      case '/customers':
        return 'Customers';
      case '/invoices':
        return 'Invoices';
      case '/reports':
        return 'Reports';
      default:
        return 'BizManager';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
        </div>
        <div className="text-sm text-slate-500">
          {new Date().toLocaleDateString()}
        </div>
      </div>
    </header>
  );
};

export default Header;
