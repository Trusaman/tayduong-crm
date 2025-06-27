"use client";

import * as React from "react";
import { Plus, Filter, Download, Search } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
    Select,
    SelectContent,
    SelectItem,
} from "@workspace/ui/components/select";
import { OrdersTable } from "@/components/orders/orders-table";
import { CreateOrderDialog } from "@/components/orders/create-order-dialog";
import { OrderFilters } from "@/components/orders/order-filters";
import { MainLayout } from "@/components/layout/main-layout";
import type { Order, OrderStatus } from "@/types";

// Mock data for demonstration
const mockOrders: Order[] = [
    {
        id: "1",
        order_number: "ORD-2024-001",
        customer_id: "cust-1",
        customer: {
            id: "cust-1",
            name: "City General Hospital",
            email: "orders@citygeneral.com",
            phone: "+1-555-0123",
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-15T10:00:00Z",
        },
        sales_rep_id: "user-1",
        status: "pending_inventory",
        total_amount: 15750.0,
        notes: "Urgent order for ICU supplies",
        created_at: "2024-01-20T09:30:00Z",
        updated_at: "2024-01-20T09:30:00Z",
    },
    {
        id: "2",
        order_number: "ORD-2024-002",
        customer_id: "cust-2",
        customer: {
            id: "cust-2",
            name: "MedCare Pharmacy",
            email: "procurement@medcare.com",
            phone: "+1-555-0456",
            created_at: "2024-01-10T14:00:00Z",
            updated_at: "2024-01-10T14:00:00Z",
        },
        sales_rep_id: "user-2",
        status: "approved",
        total_amount: 8920.5,
        created_at: "2024-01-19T14:15:00Z",
        updated_at: "2024-01-20T08:45:00Z",
    },
    {
        id: "3",
        order_number: "ORD-2024-003",
        customer_id: "cust-3",
        customer: {
            id: "cust-3",
            name: "Regional Medical Center",
            email: "supplies@regional.med",
            phone: "+1-555-0789",
            created_at: "2024-01-05T11:00:00Z",
            updated_at: "2024-01-05T11:00:00Z",
        },
        sales_rep_id: "user-1",
        status: "in_transit",
        total_amount: 23400.75,
        created_at: "2024-01-18T16:20:00Z",
        updated_at: "2024-01-20T07:30:00Z",
    },
];

export default function OrdersPage() {
    const [orders, setOrders] = React.useState<Order[]>(mockOrders);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<OrderStatus | "all">(
        "all"
    );
    const [showCreateDialog, setShowCreateDialog] = React.useState(false);
    const [showFilters, setShowFilters] = React.useState(false);

    const filteredOrders = React.useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                order.order_number
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                order.customer?.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                order.total_amount.toString().includes(searchTerm);

            const matchesStatus =
                statusFilter === "all" || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    const orderStats = React.useMemo(() => {
        const total = orders.length;
        const pending = orders.filter(
            (o) =>
                o.status === "pending_inventory" ||
                o.status === "pending_accounting"
        ).length;
        const approved = orders.filter((o) => o.status === "approved").length;
        const inTransit = orders.filter(
            (o) => o.status === "in_transit"
        ).length;
        const completed = orders.filter(
            (o) => o.status === "completed" || o.status === "delivered"
        ).length;

        return { total, pending, approved, inTransit, completed };
    }, [orders]);

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Orders
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and track all pharmaceutical orders
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Order
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {orderStats.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {orderStats.pending}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Approved
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {orderStats.approved}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                In Transit
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {orderStats.inTransit}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {orderStats.completed}
                            </div>
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
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) =>
                                    setStatusFilter(
                                        value as OrderStatus | "all"
                                    )
                                }
                            >
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="pending_inventory">
                                        Pending Inventory
                                    </SelectItem>
                                    <SelectItem value="inventory_approved">
                                        Inventory Approved
                                    </SelectItem>
                                    <SelectItem value="pending_accounting">
                                        Pending Accounting
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="in_transit">
                                        In Transit
                                    </SelectItem>
                                    <SelectItem value="delivered">
                                        Delivered
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
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
                                <OrderFilters />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrdersTable orders={filteredOrders} />
                    </CardContent>
                </Card>

                {/* Create Order Dialog */}
                <CreateOrderDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onOrderCreated={(newOrder) => {
                        setOrders((prev) => [newOrder, ...prev]);
                        setShowCreateDialog(false);
                    }}
                />
            </div>
        </MainLayout>
    );
}
