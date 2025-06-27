"use client"

import * as React from "react"
import { Plus, Search, Filter, Users, Building, Phone, Mail } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { MainLayout } from "@/components/layout/main-layout"

// Mock customer data
const mockCustomers = [
  {
    id: "cust-1",
    name: "City General Hospital",
    email: "orders@citygeneral.com",
    phone: "+1-555-0123",
    address: {
      street: "123 Medical Center Dr",
      city: "Healthcare City",
      state: "HC",
      zip: "12345",
      country: "USA"
    },
    credit_limit: 50000,
    total_orders: 45,
    total_spent: 125750.50,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "cust-2",
    name: "MedCare Pharmacy",
    email: "procurement@medcare.com",
    phone: "+1-555-0456",
    address: {
      street: "456 Pharmacy Ave",
      city: "Medicine Town",
      state: "MT",
      zip: "67890",
      country: "USA"
    },
    credit_limit: 25000,
    total_orders: 32,
    total_spent: 89200.75,
    created_at: "2024-01-10T14:00:00Z"
  },
  {
    id: "cust-3",
    name: "Regional Medical Center",
    email: "supplies@regional.med",
    phone: "+1-555-0789",
    address: {
      street: "789 Regional Blvd",
      city: "Central City",
      state: "CC",
      zip: "13579",
      country: "USA"
    },
    credit_limit: 75000,
    total_orders: 67,
    total_spent: 234500.25,
    created_at: "2024-01-05T11:00:00Z"
  }
]

export default function CustomersPage() {
  const [customers] = React.useState(mockCustomers)
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredCustomers = React.useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    )
  }, [customers, searchTerm])

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

  const customerStats = React.useMemo(() => {
    const totalCustomers = customers.length
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.total_spent, 0)
    const avgOrderValue = totalRevenue / customers.reduce((sum, customer) => sum + customer.total_orders, 0)
    const highValueCustomers = customers.filter(customer => customer.total_spent > 100000).length
    
    return { totalCustomers, totalRevenue, avgOrderValue, highValueCustomers }
  }, [customers])

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage customer relationships and accounts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.totalCustomers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(customerStats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Phone className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(customerStats.avgOrderValue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Value</CardTitle>
              <Mail className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {customerStats.highValueCustomers}
              </div>
              <p className="text-xs text-muted-foreground">
                $100K+ customers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Member Since</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {customer.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{customer.email}</div>
                        <div className="text-sm text-muted-foreground">{customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{customer.address.city}, {customer.address.state}</div>
                        <div className="text-muted-foreground">{customer.address.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(customer.credit_limit)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{customer.total_orders}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(customer.total_spent)}
                    </TableCell>
                    <TableCell>{formatDate(customer.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
