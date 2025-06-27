"use client"

import * as React from "react"
import { RotateCcw, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { MainLayout } from "@/components/layout/main-layout"

// Mock returns data
const mockReturns = [
  {
    id: "ret-1",
    return_number: "RET-2024-001",
    order_number: "ORD-2024-001",
    customer: "City General Hospital",
    reason: "Damaged packaging",
    status: "requested",
    refund_amount: 2550.00,
    items_count: 1,
    created_at: "2024-01-20T15:30:00Z"
  },
  {
    id: "ret-2",
    return_number: "RET-2024-002",
    order_number: "ORD-2024-002",
    customer: "MedCare Pharmacy",
    reason: "Wrong product delivered",
    status: "approved",
    refund_amount: 1200.50,
    items_count: 2,
    created_at: "2024-01-19T11:20:00Z"
  },
  {
    id: "ret-3",
    return_number: "RET-2024-003",
    order_number: "ORD-2024-003",
    customer: "Regional Medical Center",
    reason: "Product expired",
    status: "processed",
    refund_amount: 890.75,
    items_count: 1,
    created_at: "2024-01-18T09:45:00Z"
  }
]

export default function ReturnsPage() {
  const [returns] = React.useState(mockReturns)

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      requested: "warning",
      approved: "info",
      rejected: "destructive",
      received: "secondary",
      processed: "success",
    }
    return colors[status] || "secondary"
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      requested: <Clock className="h-4 w-4" />,
      approved: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      received: <AlertCircle className="h-4 w-4" />,
      processed: <CheckCircle className="h-4 w-4" />,
    }
    return icons[status] || <Clock className="h-4 w-4" />
  }

  const returnStats = React.useMemo(() => {
    const totalReturns = returns.length
    const pendingReturns = returns.filter(r => r.status === "requested").length
    const processedReturns = returns.filter(r => r.status === "processed").length
    const totalRefunds = returns.reduce((sum, ret) => sum + ret.refund_amount, 0)
    
    return { totalReturns, pendingReturns, processedReturns, totalRefunds }
  }, [returns])

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Returns</h1>
            <p className="text-muted-foreground">
              Manage product returns and refund requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Export Returns
            </Button>
            <Button>
              <RotateCcw className="mr-2 h-4 w-4" />
              Process Return
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{returnStats.totalReturns}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{returnStats.pendingReturns}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{returnStats.processedReturns}</div>
              <p className="text-xs text-muted-foreground">
                Completed returns
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(returnStats.totalRefunds)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Returns Table */}
        <Card>
          <CardHeader>
            <CardTitle>Return Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return Number</TableHead>
                  <TableHead>Original Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Date Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">
                      {returnItem.return_number}
                    </TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">
                        {returnItem.order_number}
                      </Button>
                    </TableCell>
                    <TableCell>{returnItem.customer}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm">{returnItem.reason}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(returnItem.status)}
                        <Badge variant={getStatusColor(returnItem.status) as any}>
                          {returnItem.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{returnItem.items_count} items</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(returnItem.refund_amount)}
                    </TableCell>
                    <TableCell>{formatDate(returnItem.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {returnItem.status === "requested" && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {returnItem.status === "approved" && (
                          <Button variant="ghost" size="sm">
                            Process
                          </Button>
                        )}
                      </div>
                    </TableCell>
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
