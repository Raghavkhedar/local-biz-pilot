import { useBusiness } from '@/contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Reports = () => {
  const { state } = useBusiness();
  const { products, customers, invoices } = state;
  const [reportType, setReportType] = useState('overview');

  // Calculate metrics with proper typing
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const totalOutstanding = invoices
    .filter(i => i.status === 'sent')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  // Sales by month
  const salesByMonth = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, invoice) => {
      const month = new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + invoice.total;
      return acc;
    }, {} as Record<string, number>);

  const salesChartData = Object.entries(salesByMonth).map(([month, total]) => ({
    month,
    total: Number(total.toFixed(2))
  }));

  // Top products by quantity sold
  const productSales = invoices
    .filter(i => i.status === 'paid')
    .flatMap(invoice => invoice.items)
    .reduce((acc, item) => {
      acc[item.productName] = (acc[item.productName] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  const topProductsData = Object.entries(productSales)
    .map(([name, quantity]) => ({ name, quantity: Number(quantity) }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Inventory by category
  const inventoryByCategory = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + product.quantity;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(inventoryByCategory).map(([category, quantity]) => ({
    category,
    quantity: Number(quantity)
  }));

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Low stock products
  const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold);

  // Top customers by revenue
  const customerRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, invoice) => {
      acc[invoice.customerName] = (acc[invoice.customerName] || 0) + invoice.total;
      return acc;
    }, {} as Record<string, number>);

  const topCustomers = Object.entries(customerRevenue)
    .map(([name, revenue]) => ({ name, revenue: Number(revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Report Type Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Reports</h2>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="sales">Sales Analytics</SelectItem>
            <SelectItem value="inventory">Inventory Report</SelectItem>
            <SelectItem value="customers">Customer Analytics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reportType === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <span className="text-2xl">💰</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From paid invoices</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                <span className="text-2xl">📋</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">₹{totalOutstanding.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Pending payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <span className="text-2xl">📦</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">₹{totalInventoryValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{products.length} products</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <span className="text-2xl">👥</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers.length}</div>
                <p className="text-xs text-muted-foreground">Active customers</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Invoices:</span>
                  <span className="font-medium">{invoices.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Invoices:</span>
                  <span className="font-medium text-green-600">
                    {invoices.filter(i => i.status === 'paid').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Draft Invoices:</span>
                  <span className="font-medium text-amber-600">
                    {invoices.filter(i => i.status === 'draft').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Invoice Value:</span>
                  <span className="font-medium">
                    ${invoices.length > 0 ? (invoices.reduce((sum, i) => sum + i.total, 0) / invoices.length).toFixed(2) : '0.00'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length > 0 ? (
                  <div className="space-y-2">
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="flex justify-between items-center">
                        <span className="text-sm">{product.name}</span>
                        <Badge variant="destructive">{product.quantity} left</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">All products are well stocked! 🎉</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {reportType === 'sales' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales by Month */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="total" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProductsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sales Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {invoices.filter(i => i.status === 'paid').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    ${invoices.length > 0 ? (totalRevenue / invoices.filter(i => i.status === 'paid').length || 1).toFixed(2) : '0.00'}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Sale Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {reportType === 'inventory' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantity"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Stock Status */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {products.filter(p => p.quantity > p.lowStockThreshold).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Well Stocked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600">
                      {lowStockProducts.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Low Stock</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {products.filter(p => p.quantity === 0).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Out of Stock</div>
                  </div>
                </div>
                
                {lowStockProducts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Items Needing Restock:</h4>
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm">{product.name}</span>
                        <Badge variant="destructive">{product.quantity} left</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {reportType === 'customers' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Customers by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={customer.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span>{customer.name}</span>
                      </div>
                      <span className="font-medium text-green-600">${customer.revenue.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{customers.length}</div>
                    <div className="text-sm text-muted-foreground">Total Customers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      ${customers.length > 0 ? (totalRevenue / customers.length).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg. Customer Value</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Customers with Orders:</span>
                    <span className="font-medium">
                      {new Set(invoices.map(i => i.customerId)).size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repeat Customers:</span>
                    <span className="font-medium">
                      {Object.values(
                        invoices.reduce((acc, invoice) => {
                          acc[invoice.customerId] = (acc[invoice.customerId] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).filter(count => count > 1).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
