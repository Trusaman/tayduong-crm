"use client"

import * as React from "react"
import { Truck, MapPin, Calendar, Package, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { MainLayout } from "@/components/layout/main-layout"

// Mock delivery data
const mockDeliveries = [
  {
    id: "del-1",
    order_number: "ORD-2024-001",
    customer: "City General Hospital",
    courier: "John Doe",
    status: "in_transit",
    scheduled_date: "2024-01-21",
    delivery_address: "123 Medical Center Dr, Healthcare City, HC 12345",
    items_count: 2,
    created_at: "2024-01-20T10:00:00Z"
  },
  {
    id: "del-2",
    order_number: "ORD-2024-002",
    customer: "MedCare Pharmacy",
    courier: "Jane Smith",
    status: "delivered",
    scheduled_date: "2024-01-20",
    delivered_date: "2024-01-20T14:30:00Z",
    delivery_address: "456 Pharmacy Ave, Medicine Town, MT 67890",
    items_count: 3,
    created_at: "2024-01-19T09:15:00Z"
  },
  {
    id: "del-3",
    order_number: "ORD-2024-003",
    customer: "Regional Medical Center",
    courier: "Mike Johnson",
    status: "scheduled",
    scheduled_date: "2024-01-22",
    delivery_address: "789 Regional Blvd, Central City, CC 13579",
    items_count: 5,
    created_at: "2024-01-20T16:45:00Z"
  }
]

export default function DeliveriesPage() {
  const [deliveries] = React.useState(mockDeliveries)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
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
      scheduled: "secondary",
      in_transit: "info",
      delivered: "success",
      failed: "destructive",
      delayed: "warning",
    }
    return colors[status] || "secondary"
  }

  const deliveryStats = React.useMemo(() => {
    const totalDeliveries = deliveries.length
    const inTransit = deliveries.filter(d => d.status === "in_transit").length
    const delivered = deliveries.filter(d => d.status === "delivered").length
    const scheduled = deliveries.filter(d => d.status === "scheduled").length
    
    return { totalDeliveries, inTransit, delivered, scheduled }
  }, [deliveries])

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
            <p className="text-muted-foreground">
              Track and manage order deliveries
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Route Planner
            </Button>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Schedule Delivery
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveryStats.totalDeliveries}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{deliveryStats.inTransit}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{deliveryStats.delivered}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{deliveryStats.scheduled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Deliveries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Courier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">
                      {delivery.order_number}
                    </TableCell>
                    <TableCell>{delivery.customer}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Truck className="h-4 w-4" />
                        </div>
                        {delivery.courier}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(delivery.status) as any}>
                        {delivery.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {formatDate(delivery.scheduled_date)}
                        </div>
                        {delivery.delivered_date && (
                          <div className="text-sm text-muted-foreground">
                            Delivered: {formatDateTime(delivery.delivered_date)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm truncate">
                          {delivery.delivery_address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{delivery.items_count} items</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <MapPin className="h-4 w-4" />
                        </Button>
                        {delivery.status === "in_transit" && (
                          <Button variant="ghost" size="sm">
                            <Clock className="h-4 w-4" />
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
