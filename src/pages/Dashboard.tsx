
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { state } = useBusinessContext();
  const { products, customers, invoices } = state;

  // Calculate metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold);
  const pendingInvoices = invoices.filter(i => i.status === 'draft' || i.status === 'finalized');
  const todaysSales = invoices
    .filter(i => {
      const today = new Date().toDateString();
      return new Date(i.createdAt).toDateString() === today;
    })
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const recentActivity = [
    ...invoices.slice(-3).map(i => ({
      type: 'invoice',
      description: `Invoice ${i.invoiceNumber} created for ${i.customerName}`,
      time: new Date(i.createdAt).toLocaleDateString(),
      amount: i.total,
    })),
    ...products.slice(-2).map(p => ({
      type: 'product',
      description: `Product "${p.name}" updated`,
      time: 'Today',
      amount: null,
    })),
  ].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockProducts.length} low stock items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <span className="text-2xl">📄</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices.length}</div>
            <p className="text-xs text-muted-foreground">
              ${pendingInvoices.reduce((sum, i) => sum + i.total, 0).toFixed(2)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todaysSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {invoices.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              ⚠️ Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm font-medium text-amber-800">
                    {product.quantity} left
                  </span>
                </div>
              ))}
            </div>
            <Button asChild className="mt-4 w-full">
              <Link to="/products">Manage Inventory</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link to="/products?action=add">
                <span className="text-2xl mb-2">➕</span>
                <span className="text-sm">Add Product</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link to="/customers?action=add">
                <span className="text-2xl mb-2">👤</span>
                <span className="text-sm">Add Customer</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link to="/invoices?action=new">
                <span className="text-2xl mb-2">📄</span>
                <span className="text-sm">New Invoice</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link to="/reports">
                <span className="text-2xl mb-2">📊</span>
                <span className="text-sm">View Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">
                      ${activity.amount.toFixed(2)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
