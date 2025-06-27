"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Check, X, Truck, Package } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { MainLayout } from "@/components/layout/main-layout"
import type { Order, OrderItem, OrderStatusHistory } from "@/types"

// Mock data
const mockOrder: Order = {
  id: "1",
  order_number: "ORD-2024-001",
  customer_id: "cust-1",
  customer: {
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
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  sales_rep_id: "user-1",
  status: "pending_inventory",
  total_amount: 15750.00,
  notes: "Urgent order for ICU supplies",
  created_at: "2024-01-20T09:30:00Z",
  updated_at: "2024-01-20T09:30:00Z"
}

const mockOrderItems: OrderItem[] = [
  {
    id: "item-1",
    order_id: "1",
    product_id: "prod-1",
    product: {
      id: "prod-1",
      name: "Amoxicillin 500mg",
      sku: "AMX-500",
      price: 25.50,
      requires_prescription: true,
      created_at: "",
      updated_at: ""
    },
    quantity: 100,
    unit_price: 25.50,
    total_price: 2550.00,
    delivered_quantity: 0,
    created_at: "2024-01-20T09:30:00Z"
  },
  {
    id: "item-2",
    order_id: "1",
    product_id: "prod-2",
    product: {
      id: "prod-2",
      name: "Insulin Pen",
      sku: "INS-PEN",
      price: 89.99,
      requires_prescription: true,
      created_at: "",
      updated_at: ""
    },
    quantity: 150,
    unit_price: 89.99,
    total_price: 13498.50,
    delivered_quantity: 0,
    created_at: "2024-01-20T09:30:00Z"
  }
]

const mockStatusHistory: OrderStatusHistory[] = [
  {
    id: "hist-1",
    order_id: "1",
    status: "draft",
    changed_by: "user-1",
    notes: "Order created",
    created_at: "2024-01-20T09:30:00Z"
  },
  {
    id: "hist-2",
    order_id: "1",
    status: "pending_inventory",
    changed_by: "user-1",
    notes: "Order submitted for inventory review",
    created_at: "2024-01-20T09:35:00Z"
  }
]

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order] = React.useState<Order>(mockOrder)
  const [orderItems] = React.useState<OrderItem[]>(mockOrderItems)
  const [statusHistory] = React.useState<OrderStatusHistory[]>(mockStatusHistory)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "secondary",
      pending_inventory: "warning",
      inventory_approved: "info",
      approved: "success",
      rejected: "destructive",
      in_transit: "info",
      delivered: "success",
      completed: "success",
    }
    return colors[status] || "secondary"
  }

  const canApprove = order.status === "pending_inventory" || order.status === "pending_accounting"
  const canReject = order.status === "pending_inventory" || order.status === "pending_accounting"

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{order.order_number}</h1>
              <p className="text-muted-foreground">
                Created {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(order.status) as any} className="text-sm">
              {order.status.replace(/_/g, " ").toUpperCase()}
            </Badge>
            {canApprove && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            )}
            {canReject && (
              <Button size="sm" variant="destructive">
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.product?.name}</div>
                            {item.product?.requires_prescription && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Prescription Required
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.product?.sku}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.total_price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      Total: {formatCurrency(order.total_amount)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status History */}
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusHistory.map((history, index) => (
                    <div key={history.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                        {index < statusHistory.length - 1 && (
                          <div className="w-px h-8 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(history.status) as any}>
                            {history.status.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(history.created_at)}
                          </span>
                        </div>
                        {history.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {history.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">{order.customer?.name}</h4>
                  <p className="text-sm text-muted-foreground">{order.customer?.email}</p>
                  <p className="text-sm text-muted-foreground">{order.customer?.phone}</p>
                </div>
                {order.customer?.address && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">Delivery Address</h5>
                    <div className="text-sm text-muted-foreground">
                      <p>{order.customer.address.street}</p>
                      <p>
                        {order.customer.address.city}, {order.customer.address.state} {order.customer.address.zip}
                      </p>
                      <p>{order.customer.address.country}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Order Number:</span>
                  <span className="text-sm font-medium">{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Amount:</span>
                  <span className="text-sm font-medium">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Created:</span>
                  <span className="text-sm">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Updated:</span>
                  <span className="text-sm">{formatDate(order.updated_at)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
