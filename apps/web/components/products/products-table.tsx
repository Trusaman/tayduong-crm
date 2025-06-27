"use client"

import * as React from "react"
import { MoreHorizontal, Edit, Package, AlertTriangle, Calendar } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import type { Product, Inventory } from "@/types"

interface ProductWithInventory extends Product {
  inventory: Inventory
}

interface ProductsTableProps {
  products: ProductWithInventory[]
  onInventoryUpdate?: (product: ProductWithInventory) => void
}

export function ProductsTable({ products, onInventoryUpdate }: ProductsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStockStatus = (inventory: Inventory) => {
    const availableStock = inventory.quantity - inventory.reserved_quantity
    
    if (availableStock === 0) {
      return { label: "Out of Stock", variant: "destructive" as const }
    } else if (availableStock <= 10) {
      return { label: "Critical", variant: "destructive" as const }
    } else if (availableStock <= 50) {
      return { label: "Low Stock", variant: "warning" as const }
    } else {
      return { label: "In Stock", variant: "success" as const }
    }
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiry <= threeMonthsFromNow
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock Status</TableHead>
          <TableHead>Available/Total</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const stockStatus = getStockStatus(product.inventory)
          const availableStock = product.inventory.quantity - product.inventory.reserved_quantity
          const expiringSoon = product.inventory.expiry_date && isExpiringSoon(product.inventory.expiry_date)
          
          return (
            <TableRow key={product.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.description}
                  </div>
                  {product.requires_prescription && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Prescription Required
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {product.sku}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{product.category}</Badge>
              </TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant={stockStatus.variant}>
                    {stockStatus.label}
                  </Badge>
                  {expiringSoon && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" title="Expiring soon" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">
                    {availableStock} / {product.inventory.quantity}
                  </div>
                  {product.inventory.reserved_quantity > 0 && (
                    <div className="text-muted-foreground">
                      {product.inventory.reserved_quantity} reserved
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{product.inventory.location}</div>
                  {product.inventory.batch_number && (
                    <div className="text-muted-foreground">
                      Batch: {product.inventory.batch_number}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {product.inventory.expiry_date ? (
                  <div className={`text-sm ${expiringSoon ? 'text-orange-600 font-medium' : ''}`}>
                    <div className="flex items-center gap-1">
                      {expiringSoon && <Calendar className="h-3 w-3" />}
                      {formatDate(product.inventory.expiry_date)}
                    </div>
                    {expiringSoon && (
                      <div className="text-xs text-orange-600">
                        Expiring soon
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onInventoryUpdate?.(product)}
                    title="Update inventory"
                  >
                    <Package className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Edit product">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
