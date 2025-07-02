
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  FileText, 
  AlertTriangle,
  IndianRupee,
  ShoppingCart,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

const Dashboard = () => {
  const { businessProfile } = useAuth();
  const {
    products,
    customers,
    invoices,
    getLowStockProducts,
    getPendingInvoices,
    getOverdueInvoices,
    getTotalSales,
    getTotalExpenses,
    getProfit,
    getTopProducts,
    getTopCustomers
  } = useBusiness();

  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [refreshTime, setRefreshTime] = useState(new Date());

  // Calculate date ranges
  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getDateRange();

  // Calculate KPIs
  const totalSales = getTotalSales(startDate, endDate);
  const totalExpenses = getTotalExpenses(startDate, endDate);
  const profit = getProfit(startDate, endDate);
  const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

  const lowStockProducts = getLowStockProducts();
  const pendingInvoices = getPendingInvoices();
  const overdueInvoices = getOverdueInvoices();

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalOutstanding = pendingInvoices.reduce((sum, i) => sum + i.balanceAmount, 0);

  // Refresh data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Sample chart data
  const salesTrendData = [
    { name: 'Jan', sales: 45000, expenses: 32000 },
    { name: 'Feb', sales: 52000, expenses: 35000 },
    { name: 'Mar', sales: 48000, expenses: 33000 },
    { name: 'Apr', sales: 61000, expenses: 38000 },
    { name: 'May', sales: 55000, expenses: 36000 },
    { name: 'Jun', sales: 67000, expenses: 41000 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#10B981' },
    { name: 'Books', value: 20, color: '#F59E0B' },
    { name: 'Home & Garden', value: 15, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#8B5CF6' },
  ];

  const topProducts = getTopProducts(5);
  const topCustomers = getTopCustomers(5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: businessProfile?.currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend, 
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    trend?: 'up' | 'down';
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      yellow: 'bg-amber-50 text-amber-600 border-amber-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };

    return (
      <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              {change && (
                <div className="flex items-center space-x-1">
                  {trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                  {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                  <span className={`text-xs font-medium ${
                    trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {change}
                  </span>
                </div>
              )}
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-blue-100 text-sm md:text-base">
                Here's what's happening with {businessProfile?.companyName || 'your business'} today
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {['today', 'week', 'month', 'year'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range as any)}
                  className={timeRange === range ? 'bg-white text-blue-700' : 'text-blue-100 hover:bg-blue-500'}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Sales"
            value={formatCurrency(totalSales)}
            change="+12.5%"
            icon={TrendingUp}
            trend="up"
            color="green"
          />
          <StatCard
            title="Total Profit"
            value={formatCurrency(profit)}
            change={`${profitMargin.toFixed(1)}% margin`}
            icon={Target}
            trend={profit > 0 ? 'up' : 'down'}
            color={profit > 0 ? 'green' : 'red'}
          />
          <StatCard
            title="Outstanding"
            value={formatCurrency(totalOutstanding)}
            change={`${pendingInvoices.length} invoices`}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Inventory Value"
            value={formatCurrency(totalInventoryValue)}
            change={`${products.length} products`}
            icon={Package}
            color="purple"
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{invoices.length}</p>
                <p className="text-xs text-slate-600">Total Invoices</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
                <p className="text-xs text-slate-600">Total Customers</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{lowStockProducts.length}</p>
                <p className="text-xs text-slate-600">Low Stock Items</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{overdueInvoices.length}</p>
                <p className="text-xs text-slate-600">Overdue</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Sales & Expenses Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area type="monotone" dataKey="sales" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-emerald-600" />
                Sales by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-xs text-slate-600">{category.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.quantity} left
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Users className="h-4 w-4 mr-2 text-green-500" />
                Top Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topCustomers.slice(0, 5).map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-900">
                      {formatCurrency((customer as any).totalPurchases || 0)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {customer.loyaltyPoints} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                Alerts & Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-red-900">{product.name}</p>
                      <p className="text-xs text-red-600">Only {product.quantity} left</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      Low Stock
                    </Badge>
                  </div>
                </div>
              ))}

              {overdueInvoices.slice(0, 2).map((invoice) => (
                <div key={invoice.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-amber-900">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-amber-600">{invoice.customerName}</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                      Overdue
                    </Badge>
                  </div>
                </div>
              ))}

              {lowStockProducts.length === 0 && overdueInvoices.length === 0 && (
                <div className="p-4 text-center text-slate-500">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">All good! No alerts at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-16 flex flex-col space-y-1 bg-blue-600 hover:bg-blue-700">
                <FileText className="h-5 w-5" />
                <span className="text-xs">New Invoice</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-1">
                <Package className="h-5 w-5" />
                <span className="text-xs">Add Product</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-1">
                <Users className="h-5 w-5" />
                <span className="text-xs">Add Customer</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-1">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center py-4">
          <p className="text-xs text-slate-500">
            Last updated: {refreshTime.toLocaleTimeString('en-IN')} • 
            Data refreshes every minute
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
