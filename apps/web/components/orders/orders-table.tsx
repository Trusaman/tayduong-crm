"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontal, Eye, Edit, Check, X } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import type { Order, OrderStatus } from "@/types"

interface OrdersTableProps {
  orders: Order[]
  onOrderUpdate?: (orderId: string, updates: Partial<Order>) => void
}

const statusColors: Record<OrderStatus, string> = {
  draft: "secondary",
  pending_inventory: "warning",
  inventory_approved: "info",
  inventory_rejected: "destructive",
  pending_accounting: "warning",
  approved: "success",
  rejected: "destructive",
  in_transit: "info",
  delivered: "success",
  partially_delivered: "warning",
  completed: "success",
  returned: "secondary",
}

const statusLabels: Record<OrderStatus, string> = {
  draft: "Draft",
  pending_inventory: "Pending Inventory",
  inventory_approved: "Inventory Approved",
  inventory_rejected: "Inventory Rejected",
  pending_accounting: "Pending Accounting",
  approved: "Approved",
  rejected: "Rejected",
  in_transit: "In Transit",
  delivered: "Delivered",
  partially_delivered: "Partially Delivered",
  completed: "Completed",
  returned: "Returned",
}

export function OrdersTable({ orders, onOrderUpdate }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [actionType, setActionType] = React.useState<"approve" | "reject" | null>(null)

  const handleApprove = (order: Order) => {
    setSelectedOrder(order)
    setActionType("approve")
  }

  const handleReject = (order: Order) => {
    setSelectedOrder(order)
    setActionType("reject")
  }

  const confirmAction = () => {
    if (!selectedOrder || !actionType) return

    let newStatus: OrderStatus
    if (actionType === "approve") {
      if (selectedOrder.status === "pending_inventory") {
        newStatus = "inventory_approved"
      } else if (selectedOrder.status === "pending_accounting") {
        newStatus = "approved"
      } else {
        newStatus = "approved"
      }
    } else {
      if (selectedOrder.status === "pending_inventory") {
        newStatus = "inventory_rejected"
      } else {
        newStatus = "rejected"
      }
    }

    onOrderUpdate?.(selectedOrder.id, { status: newStatus })
    setSelectedOrder(null)
    setActionType(null)
  }

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

  const canApprove = (order: Order) => {
    return order.status === "pending_inventory" || order.status === "pending_accounting"
  }

  const canReject = (order: Order) => {
    return order.status === "pending_inventory" || order.status === "pending_accounting"
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                <Link 
                  href={`/orders/${order.id}`}
                  className="text-primary hover:underline"
                >
                  {order.order_number}
                </Link>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customer?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.customer?.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusColors[order.status] as any}>
                  {statusLabels[order.status]}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(order.total_amount)}</TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  {canApprove(order) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleApprove(order)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {canReject(order) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReject(order)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Order" : "Reject Order"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} order {selectedOrder?.order_number}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={confirmAction}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
