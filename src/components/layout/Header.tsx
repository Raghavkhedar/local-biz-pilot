
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Building2, User, Settings, LogOut, Bell } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { user, businessProfile, logout } = useAuth();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/products':
        return 'Products & Inventory';
      case '/customers':
        return 'Customers';
      case '/invoices':
        return 'Invoices & Billing';
      case '/reports':
        return 'Reports & Analytics';
      case '/profile':
        return 'Business Profile';
      default:
        return 'BizManager';
    }
  };

  const getUserInitials = () => {
    return user?.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <Building2 className="text-white font-bold text-sm h-4 w-4" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
              <p className="text-xs text-slate-500">{businessProfile?.companyName}</p>
            </div>
          </div>
          <div className="md:hidden">
            <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs text-blue-600 capitalize">{user?.role}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex flex-col text-right">
            <div className="text-sm text-slate-600">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })}
            </div>
            <div className="text-xs text-slate-500">
              {new Date().toLocaleTimeString('en-IN', { 
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
