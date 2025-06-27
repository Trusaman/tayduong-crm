"use client"

import * as React from "react"
import { DollarSign, Package, Calendar, MapPin } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem } from "@workspace/ui/components/select"

interface ProductFiltersProps {
  onFiltersChange?: (filters: ProductFilters) => void
}

interface ProductFilters {
  minPrice?: number
  maxPrice?: number
  prescriptionRequired?: string
  expiryDateFrom?: string
  expiryDateTo?: string
  location?: string
  batchNumber?: string
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [filters, setFilters] = React.useState<ProductFilters>({})

  const handleFilterChange = (key: keyof ProductFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFiltersChange?.({})
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Advanced Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <DollarSign className="inline h-3 w-3 mr-1" />
            Price Range
          </Label>
          <div className="space-y-2">
            <Input
              type="number"
              step="0.01"
              placeholder="Min price"
              value={filters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Max price"
              value={filters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Prescription & Location */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <Package className="inline h-3 w-3 mr-1" />
            Product Type
          </Label>
          <div className="space-y-2">
            <Select 
              value={filters.prescriptionRequired || ""} 
              onValueChange={(value) => handleFilterChange("prescriptionRequired", value)}
            >
              <SelectContent>
                <SelectItem value="">All Products</SelectItem>
                <SelectItem value="true">Prescription Required</SelectItem>
                <SelectItem value="false">Over-the-Counter</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Storage location"
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>
        </div>

        {/* Expiry Date Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <Calendar className="inline h-3 w-3 mr-1" />
            Expiry Date Range
          </Label>
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="From date"
              value={filters.expiryDateFrom || ""}
              onChange={(e) => handleFilterChange("expiryDateFrom", e.target.value)}
            />
            <Input
              type="date"
              placeholder="To date"
              value={filters.expiryDateTo || ""}
              onChange={(e) => handleFilterChange("expiryDateTo", e.target.value)}
            />
          </div>
        </div>

        {/* Batch & Additional */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <MapPin className="inline h-3 w-3 mr-1" />
            Batch Information
          </Label>
          <div className="space-y-2">
            <Input
              placeholder="Batch number"
              value={filters.batchNumber || ""}
              onChange={(e) => handleFilterChange("batchNumber", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {Object.values(filters).some(value => value !== undefined && value !== "") && (
        <div className="pt-2 border-t">
          <div className="flex flex-wrap gap-2">
            {filters.minPrice && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Min Price: ${filters.minPrice}
                <button 
                  onClick={() => handleFilterChange("minPrice", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
            {filters.maxPrice && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Max Price: ${filters.maxPrice}
                <button 
                  onClick={() => handleFilterChange("maxPrice", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
            {filters.prescriptionRequired && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                {filters.prescriptionRequired === "true" ? "Prescription Required" : "Over-the-Counter"}
                <button 
                  onClick={() => handleFilterChange("prescriptionRequired", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
            {filters.location && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Location: {filters.location}
                <button 
                  onClick={() => handleFilterChange("location", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
            {filters.batchNumber && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Batch: {filters.batchNumber}
                <button 
                  onClick={() => handleFilterChange("batchNumber", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
            {filters.expiryDateFrom && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Expires From: {filters.expiryDateFrom}
                <button 
                  onClick={() => handleFilterChange("expiryDateFrom", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
            {filters.expiryDateTo && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Expires To: {filters.expiryDateTo}
                <button 
                  onClick={() => handleFilterChange("expiryDateTo", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
