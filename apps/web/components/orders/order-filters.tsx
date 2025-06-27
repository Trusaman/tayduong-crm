"use client"

import * as React from "react"
import { CalendarDays, DollarSign, User } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem } from "@workspace/ui/components/select"

interface OrderFiltersProps {
  onFiltersChange?: (filters: OrderFilters) => void
}

interface OrderFilters {
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
  salesRep?: string
  customer?: string
}

export function OrderFilters({ onFiltersChange }: OrderFiltersProps) {
  const [filters, setFilters] = React.useState<OrderFilters>({})

  const handleFilterChange = (key: keyof OrderFilters, value: string | number | undefined) => {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <CalendarDays className="inline h-3 w-3 mr-1" />
            Date Range
          </Label>
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="From date"
              value={filters.dateFrom || ""}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
            <Input
              type="date"
              placeholder="To date"
              value={filters.dateTo || ""}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <DollarSign className="inline h-3 w-3 mr-1" />
            Amount Range
          </Label>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Min amount"
              value={filters.minAmount || ""}
              onChange={(e) => handleFilterChange("minAmount", e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max amount"
              value={filters.maxAmount || ""}
              onChange={(e) => handleFilterChange("maxAmount", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Sales Rep & Customer */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            <User className="inline h-3 w-3 mr-1" />
            People
          </Label>
          <div className="space-y-2">
            <Select 
              value={filters.salesRep || ""} 
              onValueChange={(value) => handleFilterChange("salesRep", value)}
            >
              <SelectContent>
                <SelectItem value="">All Sales Reps</SelectItem>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={filters.customer || ""} 
              onValueChange={(value) => handleFilterChange("customer", value)}
            >
              <SelectContent>
                <SelectItem value="">All Customers</SelectItem>
                <SelectItem value="city-general">City General Hospital</SelectItem>
                <SelectItem value="medcare">MedCare Pharmacy</SelectItem>
                <SelectItem value="regional">Regional Medical Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {Object.values(filters).some(value => value !== undefined && value !== "") && (
        <div className="pt-2 border-t">
          <div className="flex flex-wrap gap-2">
            {filters.dateFrom && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                From: {filters.dateFrom}
                <button 
                  onClick={() => handleFilterChange("dateFrom", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
            {filters.dateTo && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                To: {filters.dateTo}
                <button 
                  onClick={() => handleFilterChange("dateTo", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
            {filters.minAmount && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Min: ${filters.minAmount}
                <button 
                  onClick={() => handleFilterChange("minAmount", undefined)}
                  className="ml-1 hover:bg-primary/20 rounded"
                >
                  ×
                </button>
              </div>
            )}
            {filters.maxAmount && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Max: ${filters.maxAmount}
                <button 
                  onClick={() => handleFilterChange("maxAmount", undefined)}
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
