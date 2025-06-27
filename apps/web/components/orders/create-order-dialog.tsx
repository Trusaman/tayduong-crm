"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Select, SelectContent, SelectItem } from "@workspace/ui/components/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import type { Order, Customer, Product } from "@/types"

interface CreateOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOrderCreated: (order: Order) => void
}

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

// Mock data
const mockCustomers: Customer[] = [
  { id: "cust-1", name: "City General Hospital", email: "orders@citygeneral.com", created_at: "", updated_at: "" },
  { id: "cust-2", name: "MedCare Pharmacy", email: "procurement@medcare.com", created_at: "", updated_at: "" },
  { id: "cust-3", name: "Regional Medical Center", email: "supplies@regional.med", created_at: "", updated_at: "" },
]

const mockProducts: Product[] = [
  { id: "prod-1", name: "Amoxicillin 500mg", sku: "AMX-500", price: 25.50, requires_prescription: true, created_at: "", updated_at: "" },
  { id: "prod-2", name: "Ibuprofen 200mg", sku: "IBU-200", price: 12.75, requires_prescription: false, created_at: "", updated_at: "" },
  { id: "prod-3", name: "Insulin Pen", sku: "INS-PEN", price: 89.99, requires_prescription: true, created_at: "", updated_at: "" },
]

export function CreateOrderDialog({ open, onOpenChange, onOrderCreated }: CreateOrderDialogProps) {
  const [customerId, setCustomerId] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const addOrderItem = () => {
    setOrderItems(prev => [...prev, {
      product_id: "",
      product_name: "",
      quantity: 1,
      unit_price: 0,
      total_price: 0
    }])
  }

  const removeOrderItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setOrderItems(prev => prev.map((item, i) => {
      if (i !== index) return item
      
      const updated = { ...item, [field]: value }
      
      if (field === "product_id") {
        const product = mockProducts.find(p => p.id === value)
        if (product) {
          updated.product_name = product.name
          updated.unit_price = product.price
          updated.total_price = updated.quantity * product.price
        }
      } else if (field === "quantity" || field === "unit_price") {
        updated.total_price = updated.quantity * updated.unit_price
      }
      
      return updated
    }))
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.total_price, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || orderItems.length === 0) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      order_number: `ORD-2024-${String(Date.now()).slice(-3)}`,
      customer_id: customerId,
      customer: mockCustomers.find(c => c.id === customerId),
      sales_rep_id: "current-user",
      status: "draft",
      total_amount: totalAmount,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onOrderCreated(newOrder)
    
    // Reset form
    setCustomerId("")
    setNotes("")
    setOrderItems([])
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setCustomerId("")
    setNotes("")
    setOrderItems([])
  }

  React.useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Create a new pharmaceutical order for a customer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label htmlFor="customer">Customer *</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectContent>
                <SelectItem value="">Select a customer</SelectItem>
                {mockCustomers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Order Items *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            {orderItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items added yet. Click "Add Item" to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-end gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label className="text-xs">Product</Label>
                      <Select 
                        value={item.product_id} 
                        onValueChange={(value) => updateOrderItem(index, "product_id", value)}
                      >
                        <SelectContent>
                          <SelectItem value="">Select product</SelectItem>
                          {mockProducts.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, "quantity", Number(e.target.value))}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateOrderItem(index, "unit_price", Number(e.target.value))}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Total</Label>
                      <div className="h-10 flex items-center px-3 border rounded-md bg-muted">
                        ${item.total_price.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOrderItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {orderItems.length > 0 && (
              <div className="flex justify-end">
                <div className="text-lg font-semibold">
                  Total: ${totalAmount.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any special instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!customerId || orderItems.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
