import { useState, useEffect } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Invoice, InvoiceItem } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const Invoices = () => {
  const { state, dispatch } = useBusinessContext();
  const { invoices, customers, products } = state;
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1
  });

  // Check if we should open the new invoice dialog from URL params
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setSelectedCustomerId('');
    setInvoiceItems([]);
    setCurrentItem({ productId: '', quantity: 1 });
    setEditingInvoice(null);
  };

  const addItemToInvoice = () => {
    const product = products.find(p => p.id === currentItem.productId);
    if (!product) return;

    const existingItemIndex = invoiceItems.findIndex(item => item.productId === currentItem.productId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...invoiceItems];
      updatedItems[existingItemIndex].quantity += currentItem.quantity;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * product.price;
      setInvoiceItems(updatedItems);
    } else {
      const newItem: InvoiceItem = {
        productId: product.id,
        productName: product.name,
        quantity: currentItem.quantity,
        unitPrice: product.price,
        total: currentItem.quantity * product.price
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }

    setCurrentItem({ productId: '', quantity: 1 });
  };

  const removeItemFromInvoice = (productId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.productId !== productId));
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const generateInvoiceNumber = () => {
    const lastInvoiceNumber = invoices
      .map(inv => parseInt(inv.invoiceNumber.replace('INV-', '')))
      .filter(num => !isNaN(num))
      .sort((a, b) => b - a)[0] || 0;
    
    return `INV-${String(lastInvoiceNumber + 1).padStart(3, '0')}`;
  };

  const handleSubmit = (isDraft: boolean = false) => {
    if (!selectedCustomerId || invoiceItems.length === 0) {
      toast({
        title: 'Invalid Invoice',
        description: 'Please select a customer and add at least one item.',
        variant: 'destructive'
      });
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) return;

    const { subtotal, tax, total } = calculateTotals();
    
    const invoiceData: Invoice = {
      id: editingInvoice?.id || Date.now().toString(),
      invoiceNumber: editingInvoice?.invoiceNumber || generateInvoiceNumber(),
      customerId: selectedCustomerId,
      customerName: customer.name,
      items: invoiceItems,
      subtotal,
      tax,
      total,
      status: isDraft ? 'draft' : 'sent',
      createdAt: editingInvoice?.createdAt || new Date(),
      updatedAt: new Date(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    };

    if (editingInvoice) {
      dispatch({ type: 'UPDATE_INVOICE', payload: invoiceData });
      toast({
        title: 'Invoice Updated',
        description: `Invoice ${invoiceData.invoiceNumber} has been updated.`,
      });
    } else {
      dispatch({ type: 'ADD_INVOICE', payload: invoiceData });
      toast({
        title: 'Invoice Created',
        description: `Invoice ${invoiceData.invoiceNumber} has been ${isDraft ? 'saved as draft' : 'sent'}.`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
    
    // Clear URL params
    if (searchParams.get('action')) {
      setSearchParams({});
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setSelectedCustomerId(invoice.customerId);
    setInvoiceItems(invoice.items);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, invoiceNumber: string) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      dispatch({ type: 'DELETE_INVOICE', payload: id });
      toast({
        title: 'Invoice Deleted',
        description: `Invoice ${invoiceNumber} has been deleted.`,
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = (invoice: Invoice, newStatus: 'draft' | 'sent' | 'paid' | 'cancelled') => {
    const updatedInvoice = { ...invoice, status: newStatus, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_INVOICE', payload: updatedInvoice });
    toast({
      title: 'Status Updated',
      description: `Invoice ${invoice.invoiceNumber} marked as ${newStatus}.`,
    });
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
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
            <Button>New Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInvoice ? `Edit Invoice ${editingInvoice.invoiceNumber}` : 'Create New Invoice'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Customer Selection */}
              <div>
                <Label htmlFor="customer">Select Customer</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Add Items */}
              <div className="space-y-4">
                <h3 className="font-medium">Add Items</h3>
                <div className="flex gap-2">
                  <Select value={currentItem.productId} onValueChange={(value) => setCurrentItem({...currentItem, productId: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 1})}
                    className="w-20"
                  />
                  <Button onClick={addItemToInvoice} disabled={!currentItem.productId}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Invoice Items */}
              {invoiceItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Invoice Items</h3>
                  <div className="space-y-2">
                    {invoiceItems.map(item => (
                      <div key={item.productId} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">₹{item.total.toFixed(2)}</span>
                          <Button size="sm" variant="destructive" onClick={() => removeItemFromInvoice(item.productId)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Totals */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleSubmit(true)} variant="outline" className="flex-1">
                  Save as Draft
                </Button>
                <Button onClick={() => handleSubmit(false)} className="flex-1">
                  {editingInvoice ? 'Update' : 'Send'} Invoice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.map(invoice => (
          <Card key={invoice.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    invoice.status === 'paid' ? 'default' :
                    invoice.status === 'sent' ? 'secondary' : 'outline'
                  }>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                  <span className="font-bold text-lg">₹{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Items: {invoice.items.length}</span>
                  <span>Created: {new Date(invoice.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(invoice)}>
                    Edit
                  </Button>
                  
                  {invoice.status === 'draft' && (
                    <Button size="sm" onClick={() => handleStatusChange(invoice, 'sent')}>
                      Send
                    </Button>
                  )}
                  
                  {invoice.status === 'sent' && (
                    <Button size="sm" onClick={() => handleStatusChange(invoice, 'paid')}>
                      Mark Paid
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(invoice.id, invoice.invoiceNumber)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No invoices found</p>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
            Create Your First Invoice
          </Button>
        </div>
      )}
    </div>
  );
};

export default Invoices;
