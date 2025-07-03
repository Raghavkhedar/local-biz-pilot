
import { useState, useEffect } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Product } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const { state, dispatch } = useBusinessContext();
  const { products } = state;
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '',
    category: '',
    barcode: '',
    lowStockThreshold: '10',
    unit: 'box' as 'box' | 'piece' | 'square_feet' | 'square_meter',
    piecesPerBox: '',
    areaPerPiece: '',
    areaUnit: 'square_feet' as 'square_feet' | 'square_meter',
    length: '',
    width: '',
    thickness: '',
    material: '',
    finish: '',
    color: '',
    pattern: '',
    grade: 'standard' as 'premium' | 'standard' | 'economy',
    waterResistance: 'medium' as 'high' | 'medium' | 'low',
    slipResistance: 'R9' as 'R9' | 'R10' | 'R11' | 'R12' | 'R13',
    usage: [] as string[],
    manufacturer: '',
    origin: ''
  });

  // Check if we should open the add dialog from URL params
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const categories = [...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      price: '',
      quantity: '',
      category: '',
      barcode: '',
      lowStockThreshold: '10',
      unit: 'box',
      piecesPerBox: '',
      areaPerPiece: '',
      areaUnit: 'square_feet',
      length: '',
      width: '',
      thickness: '',
      material: '',
      finish: '',
      color: '',
      pattern: '',
      grade: 'standard',
      waterResistance: 'medium',
      slipResistance: 'R9',
      usage: [],
      manufacturer: '',
      origin: ''
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      barcode: product.barcode || '',
      lowStockThreshold: product.lowStockThreshold.toString(),
      unit: product.unit,
      piecesPerBox: product.piecesPerBox?.toString() || '',
      areaPerPiece: product.areaPerPiece?.toString() || '',
      areaUnit: product.areaUnit || 'square_feet',
      length: product.dimensions?.length.toString() || '',
      width: product.dimensions?.width.toString() || '',
      thickness: product.dimensions?.thickness.toString() || '',
      material: product.material || '',
      finish: product.finish || '',
      color: product.color || '',
      pattern: product.pattern || '',
      grade: product.grade || 'standard',
      waterResistance: product.waterResistance || 'medium',
      slipResistance: product.slipResistance || 'R9',
      usage: product.usage || [],
      manufacturer: product.manufacturer || '',
      origin: product.origin || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category: formData.category,
      barcode: formData.barcode || undefined,
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      unit: formData.unit,
      piecesPerBox: formData.piecesPerBox ? parseInt(formData.piecesPerBox) : undefined,
      areaPerPiece: formData.areaPerPiece ? parseFloat(formData.areaPerPiece) : undefined,
      areaUnit: formData.areaUnit,
      dimensions: {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        thickness: parseFloat(formData.thickness)
      },
      material: formData.material || undefined,
      finish: formData.finish || undefined,
      color: formData.color || undefined,
      pattern: formData.pattern || undefined,
      grade: formData.grade,
      waterResistance: formData.waterResistance,
      slipResistance: formData.slipResistance,
      usage: formData.usage,
      manufacturer: formData.manufacturer || undefined,
      origin: formData.origin || undefined,
      createdAt: editingProduct?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: productData });
      toast({
        title: 'Product Updated',
        description: `${productData.name} has been updated successfully.`,
      });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: productData });
      toast({
        title: 'Product Added',
        description: `${productData.name} has been added to inventory.`,
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
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      toast({
        title: 'Product Deleted',
        description: `${name} has been removed from inventory.`,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
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
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value: 'box' | 'piece' | 'square_feet' | 'square_meter') => setFormData({...formData, unit: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="square_feet">Square Feet</SelectItem>
                      <SelectItem value="square_meter">Square Meter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="piecesPerBox">Pieces per Box</Label>
                  <Input
                    id="piecesPerBox"
                    type="number"
                    value={formData.piecesPerBox}
                    onChange={(e) => setFormData({...formData, piecesPerBox: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="areaPerPiece">Area per Piece</Label>
                  <Input
                    id="areaPerPiece"
                    type="number"
                    step="0.01"
                    value={formData.areaPerPiece}
                    onChange={(e) => setFormData({...formData, areaPerPiece: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="areaUnit">Area Unit</Label>
                  <Select value={formData.areaUnit} onValueChange={(value: 'square_feet' | 'square_meter') => setFormData({...formData, areaUnit: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square_feet">Square Feet</SelectItem>
                      <SelectItem value="square_meter">Square Meter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="length">Length (mm)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={formData.length}
                    onChange={(e) => setFormData({...formData, length: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (mm)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="thickness">Thickness (mm)</Label>
                  <Input
                    id="thickness"
                    type="number"
                    step="0.1"
                    value={formData.thickness}
                    onChange={(e) => setFormData({...formData, thickness: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="finish">Finish</Label>
                  <Input
                    id="finish"
                    value={formData.finish}
                    onChange={(e) => setFormData({...formData, finish: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="pattern">Pattern</Label>
                  <Input
                    id="pattern"
                    value={formData.pattern}
                    onChange={(e) => setFormData({...formData, pattern: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={formData.grade} onValueChange={(value: 'premium' | 'standard' | 'economy') => setFormData({...formData, grade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="economy">Economy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="waterResistance">Water Resistance</Label>
                  <Select value={formData.waterResistance} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({...formData, waterResistance: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select water resistance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="slipResistance">Slip Resistance</Label>
                <Select value={formData.slipResistance} onValueChange={(value: 'R9' | 'R10' | 'R11' | 'R12' | 'R13') => setFormData({...formData, slipResistance: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select slip resistance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R9">R9</SelectItem>
                    <SelectItem value="R10">R10</SelectItem>
                    <SelectItem value="R11">R11</SelectItem>
                    <SelectItem value="R12">R12</SelectItem>
                    <SelectItem value="R13">R13</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="barcode">Barcode (Optional)</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingProduct ? 'Update' : 'Add'} Product
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                </div>
                <Badge variant={product.quantity <= product.lowStockThreshold ? 'destructive' : 'secondary'}>
                  {product.quantity <= product.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grade:</span>
                    <span className="capitalize">{product.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{product.dimensions?.length}×{product.dimensions?.width}×{product.dimensions?.thickness}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area/Piece:</span>
                    <span>{product.areaPerPiece} {product.areaUnit?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span>{product.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Finish:</span>
                    <span>{product.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Water Resistance:</span>
                    <span className="capitalize">{product.waterResistance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slip Resistance:</span>
                    <span>{product.slipResistance}</span>
                  </div>
                  {product.barcode && (
                    <div className="flex justify-between col-span-2">
                      <span className="text-muted-foreground">Barcode:</span>
                      <span className="font-mono">{product.barcode}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-3">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="flex-1">
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(product.id, product.name)}
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products;
