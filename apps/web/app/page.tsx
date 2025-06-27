"use client";

import * as React from "react";
import {
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    AlertTriangle,
    DollarSign,
    Clock,
    CheckCircle,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { MainLayout } from "@/components/layout/main-layout";

export default function DashboardPage() {
    // Mock data for dashboard
    const stats = {
        totalOrders: 156,
        pendingOrders: 23,
        totalProducts: 89,
        lowStockItems: 12,
        totalCustomers: 45,
        monthlyRevenue: 125750.5,
    };

    const recentOrders = [
        {
            id: "ORD-2024-001",
            customer: "City General Hospital",
            amount: 15750.0,
            status: "pending_inventory",
        },
        {
            id: "ORD-2024-002",
            customer: "MedCare Pharmacy",
            amount: 8920.5,
            status: "approved",
        },
        {
            id: "ORD-2024-003",
            customer: "Regional Medical Center",
            amount: 23400.75,
            status: "in_transit",
        },
    ];

    const lowStockProducts = [
        {
            name: "Insulin Pen",
            sku: "INS-PEN",
            quantity: 8,
            location: "C-1-008",
        },
        {
            name: "Ibuprofen 200mg",
            sku: "IBU-200",
            quantity: 45,
            location: "B-2-015",
        },
        {
            name: "Amoxicillin 500mg",
            sku: "AMX-500",
            quantity: 150,
            location: "A-1-001",
        },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending_inventory: "warning",
            approved: "success",
            in_transit: "info",
            rejected: "destructive",
        };
        return colors[status] || "secondary";
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome to PharmaCRM - Your pharmaceutical business
                        overview
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Orders
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalOrders}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Orders
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.pendingOrders}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Require attention
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Products
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalProducts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active in inventory
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Low Stock
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {stats.lowStockItems}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Need restocking
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Customers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalCustomers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active accounts
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(stats.monthlyRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {order.id}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {order.customer}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {formatCurrency(order.amount)}
                                            </div>
                                            <Badge
                                                variant={
                                                    getStatusColor(
                                                        order.status
                                                    ) as any
                                                }
                                                className="text-xs"
                                            >
                                                {order.status.replace(
                                                    /_/g,
                                                    " "
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                View All Orders
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Low Stock Alert */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                Low Stock Alert
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {lowStockProducts.map((product) => (
                                    <div
                                        key={product.sku}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {product.sku} •{" "}
                                                {product.location}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className={`font-medium ${product.quantity <= 10 ? "text-red-600" : product.quantity <= 50 ? "text-yellow-600" : ""}`}
                                            >
                                                {product.quantity} units
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                Manage Inventory
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
