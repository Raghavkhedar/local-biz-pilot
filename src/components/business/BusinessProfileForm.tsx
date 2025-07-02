
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Save, Upload, Settings, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BusinessProfileForm = () => {
  const { businessProfile, updateBusinessProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: businessProfile?.companyName || '',
    address: businessProfile?.address || '',
    phone: businessProfile?.phone || '',
    email: businessProfile?.email || '',
    gstNumber: businessProfile?.gstNumber || '',
    panNumber: businessProfile?.panNumber || '',
    website: businessProfile?.website || '',
    currency: businessProfile?.currency || 'INR',
    invoicePrefix: businessProfile?.invoicePrefix || 'INV',
    invoiceNumbering: businessProfile?.invoiceNumbering || 'auto',
    lastInvoiceNumber: businessProfile?.lastInvoiceNumber || 1000,
    cgst: businessProfile?.taxRates.cgst || 9,
    sgst: businessProfile?.taxRates.sgst || 9,
    igst: businessProfile?.taxRates.igst || 18,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateBusinessProfile({
        ...formData,
        taxRates: {
          cgst: formData.cgst,
          sgst: formData.sgst,
          igst: formData.igst
        }
      });

      toast({
        title: "Profile Updated",
        description: "Your business profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Building2 className="h-6 w-6 mr-2 text-blue-600" />
            Business Profile
          </h1>
          <p className="text-slate-600 mt-1">Manage your business information and settings</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="general" className="flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              General
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center">
              <Receipt className="h-4 w-4 mr-1" />
              Tax & GST
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              Invoice
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Basic information about your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                        className="h-10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="h-10"
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tax" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax & GST Settings</CardTitle>
                  <CardDescription>Configure your tax rates and GST information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => handleChange('gstNumber', e.target.value)}
                        className="h-10"
                        placeholder="22AAAAA0000A1Z5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input
                        id="panNumber"
                        value={formData.panNumber}
                        onChange={(e) => handleChange('panNumber', e.target.value)}
                        className="h-10"
                        placeholder="AAAAA0000A"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cgst">CGST Rate (%)</Label>
                      <Input
                        id="cgst"
                        type="number"
                        value={formData.cgst}
                        onChange={(e) => handleChange('cgst', parseFloat(e.target.value) || 0)}
                        className="h-10"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sgst">SGST Rate (%)</Label>
                      <Input
                        id="sgst"
                        type="number"
                        value={formData.sgst}
                        onChange={(e) => handleChange('sgst', parseFloat(e.target.value) || 0)}
                        className="h-10"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="igst">IGST Rate (%)</Label>
                      <Input
                        id="igst"
                        type="number"
                        value={formData.igst}
                        onChange={(e) => handleChange('igst', parseFloat(e.target.value) || 0)}
                        className="h-10"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoice" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Settings</CardTitle>
                  <CardDescription>Configure invoice numbering and formatting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                      <Input
                        id="invoicePrefix"
                        value={formData.invoicePrefix}
                        onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                        className="h-10"
                        placeholder="INV"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastInvoiceNumber">Last Invoice Number</Label>
                      <Input
                        id="lastInvoiceNumber"
                        type="number"
                        value={formData.lastInvoiceNumber}
                        onChange={(e) => handleChange('lastInvoiceNumber', parseInt(e.target.value) || 0)}
                        className="h-10"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="w-full h-10 px-3 border border-input rounded-md bg-background"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessProfileForm;
