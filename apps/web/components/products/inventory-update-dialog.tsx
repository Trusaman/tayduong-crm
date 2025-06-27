"use client"

import * as React from "react"
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import type { Product, Inventory } from "@/types"

interface ProductWithInventory extends Product {
  inventory: Inventory
}

interface InventoryUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductWithInventory
  onInventoryUpdated: (updates: Partial<Inventory>) => void
}

export function InventoryUpdateDialog({ 
  open, 
  onOpenChange, 
  product, 
  onInventoryUpdated 
}: InventoryUpdateDialogProps) {
  const [quantity, setQuantity] = React.useState(product.inventory.quantity)
  const [batchNumber, setBatchNumber] = React.useState(product.inventory.batch_number || "")
  const [expiryDate, setExpiryDate] = React.useState(
    product.inventory.expiry_date ? product.inventory.expiry_date.split('T')[0] : ""
  )
  const [location, setLocation] = React.useState(product.inventory.location || "")
  const [notes, setNotes] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset form when product changes
  React.useEffect(() => {
    setQuantity(product.inventory.quantity)
    setBatchNumber(product.inventory.batch_number || "")
    setExpiryDate(product.inventory.expiry_date ? product.inventory.expiry_date.split('T')[0] : "")
    setLocation(product.inventory.location || "")
    setNotes("")
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const updates: Partial<Inventory> = {
      quantity,
      batch_number: batchNumber || undefined,
      expiry_date: expiryDate || undefined,
      location: location || undefined,
      updated_at: new Date().toISOString(),
    }

    onInventoryUpdated(updates)
    setIsSubmitting(false)
  }

  const quantityDifference = quantity - product.inventory.quantity
  const availableStock = product.inventory.quantity - product.inventory.reserved_quantity
  const newAvailableStock = quantity - product.inventory.reserved_quantity

  const isExpiringSoon = (dateString: string) => {
    if (!dateString) return false
    const expiry = new Date(dateString)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiry <= threeMonthsFromNow
  }

  const getStockStatus = (qty: number, reserved: number) => {
    const available = qty - reserved
    if (available <= 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (available <= 10) return { label: "Critical", variant: "destructive" as const }
    if (available <= 50) return { label: "Low Stock", variant: "warning" as const }
    return { label: "In Stock", variant: "success" as const }
  }

  const currentStatus = getStockStatus(product.inventory.quantity, product.inventory.reserved_quantity)
  const newStatus = getStockStatus(quantity, product.inventory.reserved_quantity)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Update Inventory - {product.name}
          </DialogTitle>
          <DialogDescription>
            Update inventory levels and details for {product.sku}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">Current Status</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Quantity:</span>
                <div className="font-medium">{product.inventory.quantity}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Available:</span>
                <div className="font-medium">{availableStock}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Reserved:</span>
                <div className="font-medium">{product.inventory.reserved_quantity}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div>
                  <Badge variant={currentStatus.variant}>{currentStatus.label}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Updates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Total Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
              {quantityDifference !== 0 && (
                <div className={`text-sm flex items-center gap-1 ${
                  quantityDifference > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {quantityDifference > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {quantityDifference > 0 ? '+' : ''}{quantityDifference} from current
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., A-1-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch">Batch Number</Label>
              <Input
                id="batch"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g., AMX-2024-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
              {expiryDate && isExpiringSoon(expiryDate) && (
                <div className="text-sm text-orange-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  This batch will expire within 3 months
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Update Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for inventory update (e.g., new shipment, stock adjustment, etc.)"
            />
          </div>

          {/* New Status Preview */}
          {quantityDifference !== 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium mb-3 text-blue-900 dark:text-blue-100">
                New Status Preview
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">New Total:</span>
                  <div className="font-medium">{quantity}</div>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">New Available:</span>
                  <div className="font-medium">{newAvailableStock}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-blue-700 dark:text-blue-300">New Status:</span>
                  <div className="mt-1">
                    <Badge variant={newStatus.variant}>{newStatus.label}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Inventory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
