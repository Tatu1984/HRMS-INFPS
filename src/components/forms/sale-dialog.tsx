'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SaleDialogProps {
  leadId?: string;
  leadData?: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
  };
}

export function SaleDialog({ leadId, leadData }: SaleDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leadId: leadId || '',
    companyName: leadData?.companyName || '',
    contactName: leadData?.contactName || '',
    email: leadData?.email || '',
    phone: leadData?.phone || '',
    product: '',
    quantity: '1',
    unitPrice: '',
    discount: '0',
    taxPercentage: '0',
    notes: '',
    createAccountEntry: true,
  });

  const grossAmount = parseFloat(formData.quantity) * parseFloat(formData.unitPrice || '0');
  const discountAmount = parseFloat(formData.discount || '0');
  const afterDiscount = grossAmount - discountAmount;
  const taxAmount = (afterDiscount * parseFloat(formData.taxPercentage || '0')) / 100;
  const netAmount = afterDiscount + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setOpen(false);
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create sale');
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Failed to create sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Add New Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{leadId ? 'Convert Lead to Sale' : 'Create New Sale'}</DialogTitle>
          <DialogDescription>
            {leadId ? 'Convert this lead into a confirmed sale' : 'Add a new direct sale'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input id="contactName" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Product/Service *</Label>
            <Input id="product" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input id="quantity" type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price *</Label>
              <Input id="unitPrice" type="number" step="0.01" value={formData.unitPrice} onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input id="discount" type="number" step="0.01" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
            <Input id="taxPercentage" type="number" step="0.01" value={formData.taxPercentage} onChange={(e) => setFormData({ ...formData, taxPercentage: e.target.value })} />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Gross Amount:</span>
              <span className="font-semibold">₹{grossAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Discount:</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax ({formData.taxPercentage}%):</span>
              <span>+₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Net Amount:</span>
              <span className="text-green-600">₹{netAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} />
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="createAccountEntry" checked={formData.createAccountEntry} onChange={(e) => setFormData({ ...formData, createAccountEntry: e.target.checked })} className="w-4 h-4" />
            <Label htmlFor="createAccountEntry" className="cursor-pointer">Sync to Accounts (Create income entries)</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
