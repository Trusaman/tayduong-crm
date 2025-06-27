"use client"

import * as React from "react"
import { Plus, Search, Filter, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Select, SelectContent, SelectItem } from "@workspace/ui/components/select"
import { ProductsTable } from "@/components/products/products-table"
import { InventoryUpdateDialog } from "@/components/products/inventory-update-dialog"
import { ProductFilters } from "@/components/products/product-filters"
import { MainLayout } from "@/components/layout/main-layout"
import type { Product, Inventory } from "@/types"

// Mock data for demonstration
const mockProductsWithInventory = [
  {
    id: "prod-1",
    name: "Amoxicillin 500mg",
    description: "Antibiotic for bacterial infections",
    sku: "AMX-500",
    price: 25.50,
    category: "Antibiotics",
    requires_prescription: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    inventory: {
      id: "inv-1",
      product_id: "prod-1",
      quantity: 150,
      reserved_quantity: 25,
      batch_number: "AMX-2024-001",
      expiry_date: "2025-12-31",
      location: "A-1-001",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-20T14:30:00Z"
    }
  },
  {
    id: "prod-2",
    name: "Ibuprofen 200mg",
    description: "Pain reliever and anti-inflammatory",
    sku: "IBU-200",
    price: 12.75,
    category: "Pain Relief",
    requires_prescription: false,
    created_at: "2024-01-10T14:00:00Z",
    updated_at: "2024-01-10T14:00:00Z",
    inventory: {
      id: "inv-2",
      product_id: "prod-2",
      quantity: 45,
      reserved_quantity: 10,
      batch_number: "IBU-2024-002",
      expiry_date: "2025-06-30",
      location: "B-2-015",
      created_at: "2024-01-10T14:00:00Z",
      updated_at: "2024-01-19T09:15:00Z"
    }
  },
  {
    id: "prod-3",
    name: "Insulin Pen",
    description: "Rapid-acting insulin delivery device",
    sku: "INS-PEN",
    price: 89.99,
    category: "Diabetes Care",
    requires_prescription: true,
    created_at: "2024-01-05T11:00:00Z",
    updated_at: "2024-01-05T11:00:00Z",
    inventory: {
      id: "inv-3",
      product_id: "prod-3",
      quantity: 8,
      reserved_quantity: 5,
      batch_number: "INS-2024-003",
      expiry_date: "2024-08-15",
      location: "C-1-008",
      created_at: "2024-01-05T11:00:00Z",
      updated_at: "2024-01-18T16:45:00Z"
    }
  }
]

export default function ProductsPage() {
  const [products, setProducts] = React.useState(mockProductsWithInventory)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [stockFilter, setStockFilter] = React.useState<string>("all")
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<typeof mockProductsWithInventory[0] | null>(null)
  const [showFilters, setShowFilters] = React.useState(false)

  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      
      let matchesStock = true
      if (stockFilter === "low") {
        matchesStock = product.inventory.quantity <= 50
      } else if (stockFilter === "out") {
        matchesStock = product.inventory.quantity === 0
      } else if (stockFilter === "expiring") {
        const expiryDate = new Date(product.inventory.expiry_date || "")
        const threeMonthsFromNow = new Date()
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
        matchesStock = expiryDate <= threeMonthsFromNow
      }
      
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, searchTerm, categoryFilter, stockFilter])

  const inventoryStats = React.useMemo(() => {
    const totalProducts = products.length
    const lowStock = products.filter(p => p.inventory.quantity <= 50).length
    const outOfStock = products.filter(p => p.inventory.quantity === 0).length
    const expiringSoon = products.filter(p => {
      const expiryDate = new Date(p.inventory.expiry_date || "")
      const threeMonthsFromNow = new Date()
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
      return expiryDate <= threeMonthsFromNow
    }).length
    
    return { totalProducts, lowStock, outOfStock, expiringSoon }
  }, [products])

  const handleInventoryUpdate = (productId: string, updates: Partial<Inventory>) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, inventory: { ...product.inventory, ...updates } }
        : product
    ))
  }

  const openUpdateDialog = (product: typeof mockProductsWithInventory[0]) => {
    setSelectedProduct(product)
    setShowUpdateDialog(true)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products & Inventory</h1>
            <p className="text-muted-foreground">
              Manage pharmaceutical products and track inventory levels
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Package className="mr-2 h-4 w-4" />
              Export Inventory
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStats.totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{inventoryStats.expiringSoon}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                  <SelectItem value="Diabetes Care">Diabetes Care</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            {showFilters && (
              <div className="mt-4">
                <ProductFilters />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductsTable 
              products={filteredProducts} 
              onInventoryUpdate={openUpdateDialog}
            />
          </CardContent>
        </Card>

        {/* Inventory Update Dialog */}
        {selectedProduct && (
          <InventoryUpdateDialog 
            open={showUpdateDialog} 
            onOpenChange={setShowUpdateDialog}
            product={selectedProduct}
            onInventoryUpdated={(updates) => {
              handleInventoryUpdate(selectedProduct.id, updates)
              setShowUpdateDialog(false)
            }}
          />
        )}
      </div>
    </MainLayout>
  )
}
