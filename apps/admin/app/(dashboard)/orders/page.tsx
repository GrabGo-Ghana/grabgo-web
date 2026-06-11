/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Card } from "@grabgo/ui";
import { Search, Cart, CheckCircle, Clock, Trash, Download } from "iconoir-react";
import { apiClient } from "@grabgo/utils";

// Animated Number Component
function AnimatedNumber({ value, delay = 0, decimals = 0 }: { value: number; delay?: number; decimals?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1000;
        const steps = 30;
        const increment = value / steps;
        let current = 0;

        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(interval);
                } else {
                    setCount(current);
                }
            }, duration / steps);

            return () => clearInterval(interval);
        }, delay + 300);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return <>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}</>;
}

export default function OrdersPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [orders, setOrders] = useState<any[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState({
        totalToday: 0,
        pending: 0,
        active: 0,
        completed: 0,
        revenue: 0
    });

    // Initialize state from URL or defaults
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [orderTypeFilter, setOrderTypeFilter] = useState<string>(searchParams.get("type") || "all");
    const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>(searchParams.get("payment_status") || "all");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>(searchParams.get("payment_method") || "all");
    const [dateRangeFilter, setDateRangeFilter] = useState<string>(searchParams.get("date") || "all");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams.get("limit")) || 10);

    // Sync state to URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (searchQuery) params.set("q", searchQuery);
        else params.delete("q");

        if (orderTypeFilter !== "all") params.set("type", orderTypeFilter);
        else params.delete("type");

        if (statusFilter !== "all") params.set("status", statusFilter);
        else params.delete("status");

        if (paymentStatusFilter !== "all") params.set("payment_status", paymentStatusFilter);
        else params.delete("payment_status");

        if (paymentMethodFilter !== "all") params.set("payment_method", paymentMethodFilter);
        else params.delete("payment_method");

        if (dateRangeFilter !== "all") params.set("date", dateRangeFilter);
        else params.delete("date");

        if (currentPage !== 1) params.set("page", currentPage.toString());
        else params.delete("page");

        if (itemsPerPage !== 10) params.set("limit", itemsPerPage.toString());
        else params.delete("limit");

        const query = params.toString();
        const url = query ? `${pathname}?${query}` : pathname;

        router.replace(url, { scroll: false });
    }, [searchQuery, orderTypeFilter, statusFilter, paymentStatusFilter, paymentMethodFilter, dateRangeFilter, currentPage, itemsPerPage, pathname, router, searchParams]);

    // Fetch orders and stats from backend
    useEffect(() => {
        let isMounted = true;
        const fetchOrdersAndStats = async () => {
            setIsLoading(true);
            try {
                // 1. Calculate date parameters
                let startDate = "";
                let endDate = "";
                if (dateRangeFilter !== "all") {
                    const now = new Date();
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    if (dateRangeFilter === "today") {
                        startDate = today.toISOString().split("T")[0];
                        endDate = now.toISOString().split("T")[0];
                    } else if (dateRangeFilter === "yesterday") {
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);
                        startDate = yesterday.toISOString().split("T")[0];
                        endDate = yesterday.toISOString().split("T")[0];
                    } else if (dateRangeFilter === "week") {
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        startDate = weekAgo.toISOString().split("T")[0];
                        endDate = now.toISOString().split("T")[0];
                    } else if (dateRangeFilter === "month") {
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        startDate = monthAgo.toISOString().split("T")[0];
                        endDate = now.toISOString().split("T")[0];
                    }
                }

                const mappedType = orderTypeFilter === "all" ? "" : orderTypeFilter;
                const mappedStatus = statusFilter === "all" ? "" : statusFilter;
                const mappedPayment = paymentStatusFilter === "all" ? "" : paymentStatusFilter;

                // 2. Query Orders
                const ordersRes = await apiClient.get(
                    `/admin/orders?page=${currentPage}&limit=${itemsPerPage}&type=${mappedType}&status=${mappedStatus}&payment=${mappedPayment}&q=${searchQuery}&startDate=${startDate}&endDate=${endDate}`
                );

                // 3. Query stats for today
                const todayStr = new Date().toISOString().split("T")[0];
                const statsRes = await apiClient.get(
                    `/admin/dashboard/stats?startDate=${todayStr}&endDate=${todayStr}`
                );

                if (isMounted) {
                    if (ordersRes.data.success) {
                        setOrders(ordersRes.data.data.orders);
                        setTotalOrders(ordersRes.data.data.total);
                    }
                    if (statsRes.data.success) {
                        const s = statsRes.data.data;
                        setStats({
                            totalToday: s.totalOrders || 0,
                            pending: s.pendingOrders || 0,
                            active: s.activeRiders || 0, // Online riders as active proxy
                            completed: s.completedOrders || 0,
                            revenue: s.totalRevenue || 0
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load orders or stats:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        const timer = setTimeout(() => {
            fetchOrdersAndStats();
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [currentPage, itemsPerPage, searchQuery, orderTypeFilter, statusFilter, paymentStatusFilter, paymentMethodFilter, dateRangeFilter]);

    const totalPages = Math.ceil(totalOrders / itemsPerPage);

    const clearFilters = () => {
        setSearchQuery("");
        setOrderTypeFilter("all");
        setStatusFilter("all");
        setPaymentStatusFilter("all");
        setPaymentMethodFilter("all");
        setDateRangeFilter("all");
        setCurrentPage(1);
        setSelectedOrders([]);
    };

    const toggleOrderSelection = (id: string) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
        );
    };

    const toggleAllSelection = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(o => o.id));
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 dark:bg-yellow-500/20',
            confirmed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20',
            preparing: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20',
            ready: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-500/20',
            picked_up: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 dark:bg-cyan-500/20',
            on_the_way: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/20',
            delivered: 'bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/20',
            cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20'
        };
        return colors[status] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-500/20';
    };

    const getPaymentStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 dark:bg-yellow-500/20',
            paid: 'bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/20',
            successful: 'bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/20',
            failed: 'bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20',
            refunded: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-500/20'
        };
        return colors[status] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-500/20';
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            food: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/20',
            restaurant: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/20',
            grocery: 'bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/20',
            pharmacy: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20',
            market: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20',
            grabmart: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20'
        };
        return colors[type] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-500/20';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between animate-fade-in-up">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage and track all orders in real-time</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="p-6 border-border/50 transition-all duration-300 group animate-fade-in-up [animation-delay:100ms] bg-card/50">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                            <Cart className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Today</p>
                            <p className="text-3xl font-bold tracking-tight"><AnimatedNumber value={stats.totalToday} delay={100} /></p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-border/50 transition-all duration-300 group animate-fade-in-up [animation-delay:200ms] bg-card/50">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                            <p className="text-3xl font-bold tracking-tight"><AnimatedNumber value={stats.pending} delay={200} /></p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-border/50 transition-all duration-300 group animate-fade-in-up [animation-delay:300ms] bg-card/50">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                            <Clock className="w-8 h-8 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Fleet</p>
                            <p className="text-3xl font-bold tracking-tight"><AnimatedNumber value={stats.active} delay={300} /></p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-border/50 transition-all duration-300 group animate-fade-in-up [animation-delay:400ms] bg-card/50">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                            <p className="text-3xl font-bold tracking-tight"><AnimatedNumber value={stats.completed} delay={400} /></p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-6 border-border/50 animate-fade-in-up [animation-delay:500ms]">
                <div className="space-y-6">
                    {/* Search */}
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by order ID, customer, or vendor..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-4 focus:ring-[#FE6132]/10 focus:border-[#FE6132] transition-all"
                            />
                        </div>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 text-sm font-semibold rounded-xl border border-border bg-background hover:bg-accent transition-all active:scale-95"
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div>
                            <label className="text-xs font-bold mb-1.5 block text-muted-foreground uppercase tracking-wider">Date Range</label>
                            <select
                                value={dateRangeFilter}
                                onChange={(e) => {
                                    setDateRangeFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#FE6132]/20 transition-all cursor-pointer hover:border-[#FE6132]/50"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold mb-1.5 block text-muted-foreground uppercase tracking-wider">Order Type</label>
                            <select
                                value={orderTypeFilter}
                                onChange={(e) => {
                                    setOrderTypeFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#FE6132]/20 transition-all cursor-pointer hover:border-[#FE6132]/50"
                            >
                                <option value="all">All Types</option>
                                <option value="food">🍕 Food</option>
                                <option value="grocery">🛒 Grocery</option>
                                <option value="pharmacy">💊 Pharmacy</option>
                                <option value="market">🏪 Market</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold mb-1.5 block text-muted-foreground uppercase tracking-wider">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#FE6132]/20 transition-all cursor-pointer hover:border-[#FE6132]/50"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="picked_up">Picked Up</option>
                                <option value="on_the_way">On The Way</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold mb-1.5 block text-muted-foreground uppercase tracking-wider">Payment Status</label>
                            <select
                                value={paymentStatusFilter}
                                onChange={(e) => {
                                    setPaymentStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#FE6132]/20 transition-all cursor-pointer hover:border-[#FE6132]/50"
                            >
                                <option value="all">All Payment Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold mb-1.5 block text-muted-foreground uppercase tracking-wider">Payment Method</label>
                            <select
                                value={paymentMethodFilter}
                                onChange={(e) => {
                                    setPaymentMethodFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#FE6132]/20 transition-all cursor-pointer hover:border-[#FE6132]/50"
                            >
                                <option value="all">All Methods</option>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="mtn_momo">MTN MOMO</option>
                                <option value="vodafone_cash">Vodafone Cash</option>
                                <option value="airtel_money">Airtel Money</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Bulk Actions Toolbar */}
            {selectedOrders.length > 0 && (
                <div className="bg-[#FE6132] text-white p-4 rounded-xl flex items-center justify-between animate-fade-in-up duration-300">
                    <div className="flex items-center gap-4">
                        <span className="font-bold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-white text-[#FE6132] flex items-center justify-center text-xs">
                                {selectedOrders.length}
                            </span>
                            orders selected
                        </span>
                        <div className="h-8 w-px bg-white/20" />
                        <button className="flex items-center gap-2 text-sm font-bold hover:bg-white/10 px-4 py-2 rounded-lg transition-all active:scale-95">
                            Export Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Orders Table */}
            <Card className="border-border/50 overflow-hidden animate-fade-in-up [animation-delay:600ms]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-accent/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.length === orders.length && orders.length > 0}
                                        onChange={toggleAllSelection}
                                        className="w-4 h-4 rounded border-border text-[#FE6132] focus:ring-[#FE6132]"
                                    />
                                </th>
                                <th className="p-4">Order ID / Number</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Vendor Name</th>
                                <th className="p-4">Type</th>
                                <th className="text-right p-4">Amount</th>
                                <th className="p-4">Payment</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Time</th>
                                <th className="text-right p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: itemsPerPage }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="border-b border-border/50 animate-pulse">
                                        <td className="p-4">
                                            <div className="w-4 h-4 bg-muted rounded" />
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-muted rounded" />
                                                <div className="h-3 w-16 bg-muted rounded" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-2">
                                                <div className="h-4 w-28 bg-muted rounded" />
                                                <div className="h-3 w-20 bg-muted rounded" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-2">
                                                <div className="h-4 w-32 bg-muted rounded" />
                                                <div className="h-3 w-24 bg-muted rounded" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="h-6 w-16 bg-muted rounded-full" />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="h-4 w-20 bg-muted rounded ml-auto" />
                                        </td>
                                        <td className="p-4">
                                            <div className="h-6 w-24 bg-muted rounded-full" />
                                        </td>
                                        <td className="p-4">
                                            <div className="h-6 w-20 bg-muted rounded-full" />
                                        </td>
                                        <td className="p-4">
                                            <div className="h-3 w-16 bg-muted rounded" />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="h-8 w-16 bg-muted rounded-lg ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                orders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-border/50 hover:bg-accent/30 transition-all duration-200 animate-fade-in-up"
                                        style={{ animationDelay: `${700 + index * 50}ms` }}
                                    >
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => toggleOrderSelection(order.id)}
                                                className="w-4 h-4 rounded border-border text-[#FE6132] focus:ring-[#FE6132]"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold text-foreground">{order.orderNumber}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium">{order.customerName}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium">{order.vendorName}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getTypeColor(order.vendorType || order.type)}`}>
                                                {order.vendorType || order.type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-sm font-semibold">GH₵ {order.total.toFixed(2)}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize inline-block w-fit ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus}
                                                </span>
                                                <span className="text-xs text-muted-foreground capitalize">{order.paymentMethod ? order.paymentMethod.replace('_', ' ') : 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(order.status)}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="text-sm text-[#FE6132] hover:underline font-medium"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 px-4 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Show</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-2 py-1 text-sm rounded-md border border-border bg-background focus:outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-muted-foreground">
                            of {totalOrders} orders
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 text-sm rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
