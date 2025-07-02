
import { useState, useEffect } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Customer } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const Customers = () => {
  const { state, dispatch } = useBusinessContext();
  const { customers, invoices } = state;
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: ''
  });

  // Check if we should open the add dialog from URL params
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      gstNumber: ''
    });
    setEditingCustomer(null);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      gstNumber: customer.gstNumber || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const customerData: Customer = {
      id: editingCustomer?.id || Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      gstNumber: formData.gstNumber || undefined,
      createdAt: editingCustomer?.createdAt || new Date().toISOString()
    };

    if (editingCustomer) {
      dispatch({ type: 'UPDATE_CUSTOMER', payload: customerData });
      toast({
        title: 'Customer Updated',
        description: `${customerData.name} has been updated successfully.`,
      });
    } else {
      dispatch({ type: 'ADD_CUSTOMER', payload: customerData });
      toast({
        title: 'Customer Added',
        description: `${customerData.name} has been added successfully.`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
    
    // Clear URL params
    if (searchParams.get('action')) {
      setSearchParams({});
    }
  };

  const handleDelete = (id: string, name: string) => {
    // Check if customer has invoices
    const customerInvoices = invoices.filter(invoice => invoice.customerId === id);
    
    if (customerInvoices.length > 0) {
      toast({
        title: 'Cannot Delete Customer',
        description: `${name} has ${customerInvoices.length} invoice(s). Delete invoices first.`,
        variant: 'destructive'
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      dispatch({ type: 'DELETE_CUSTOMER', payload: id });
      toast({
        title: 'Customer Deleted',
        description: `${name} has been removed.`,
        variant: 'destructive'
      });
    }
  };

  const getCustomerInvoiceCount = (customerId: string) => {
    return invoices.filter(invoice => invoice.customerId === customerId).length;
  };

  const getCustomerTotalSpent = (customerId: string) => {
    return invoices
      .filter(invoice => invoice.customerId === customerId && invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.total, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetForm();
            if (searchParams.get('action')) {
              setSearchParams({});
            }
          }
        }}>
          <DialogTrigger asChild>
            <Button>Add Customer</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCustomer ? 'Update' : 'Add'} Customer
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <Card key={customer.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Invoices:</span>
                  <span className="font-medium">{getCustomerInvoiceCount(customer.id)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Spent:</span>
                  <span className="font-medium text-green-600">
                    ${getCustomerTotalSpent(customer.id).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <p className="text-sm mt-1">{customer.address}</p>
                </div>
                {customer.gstNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">GST:</span>
                    <span className="text-sm font-mono">{customer.gstNumber}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-3">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(customer)} className="flex-1">
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(customer.id, customer.name)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No customers found</p>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
            Add Your First Customer
          </Button>
        </div>
      )}
    </div>
  );
};

export default Customers;
