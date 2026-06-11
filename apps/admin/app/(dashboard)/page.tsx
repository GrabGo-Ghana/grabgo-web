"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@grabgo/ui";
import {
    Group,
    Shop,
    Cart,
    Cycling,
    Clock,
    CreditCard,
} from "iconoir-react";
import {
    TrendingUp,
    TrendingDown,
    CheckCircle,
} from "lucide-react";
import { LineChart } from "../../components/charts/LineChart";
import { PieChart } from "../../components/charts/PieChart";
import { BarChart } from "../../components/charts/BarChart";
import { apiClient } from "@grabgo/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    delay?: number;
}

function StatCard({ title, value, change, icon: Icon, delay = 0 }: StatCardProps) {
    const [count, setCount] = useState(0);
    const targetValue = typeof value === "number" ? value : parseInt(value) || 0;

    useEffect(() => {
        const duration = 1000;
        const steps = 30;
        const increment = targetValue / steps;
        let current = 0;

        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                current += increment;
                if (current >= targetValue) {
                    setCount(targetValue);
                    clearInterval(interval);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(interval);
        }, delay + 300);

        return () => clearTimeout(timer);
    }, [targetValue, delay]);

    return (
        <Card
            className="p-6 transition-all duration-300 animate-fade-in-up border-border/50 bg-card/50 group"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-foreground">
                            {typeof value === "number" ? count.toLocaleString() : value}
                        </h3>
                        {change !== undefined && (
                            <span
                                className={`flex items-center text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {change >= 0 ? (
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 mr-1" />
                                )}
                                {Math.abs(change)}%
                            </span>
                        )}
                    </div>
                </div>
                <div className="w-12 h-12 rounded-md flex items-center justify-center bg-linear-to-br from-[#FE6132]/10 to-[#FE6132]/5">
                    <Icon className="w-6 h-6 text-[#FE6132]" strokeWidth={2} />
                </div>
            </div>
        </Card>
    );
}

const STATUS_COLORS: Record<string, string> = {
    pending: '#6b7280',
    confirmed: '#3b82f6',
    preparing: '#f59e0b',
    ready: '#8b5cf6',
    picked_up: '#d97706',
    on_the_way: '#06b6d4',
    delivered: '#10b981',
    cancelled: '#ef4444'
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    picked_up: 'Picked Up',
    on_the_way: 'On the Way',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
};

export default function DashboardPage() {
    const router = useRouter();
    const [dateRange, setDateRange] = useState<string>("7days");
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeVendors: 0,
        totalOrders: 0,
        activeRiders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });
    const [charts, setCharts] = useState({
        statusCounts: [] as Array<{ status: string; count: number }>,
        revenueTrend: [] as Array<{ date: string; revenue: number }>,
        peakHours: [] as Array<{ hour: string; orders: number }>,
        eliteVendors: [] as Array<{ id: string; name: string; type: string; orders: number; revenue: number; rating: number }>,
        pendingVendors: 0,
        pendingRiders: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const dateParams = useMemo(() => {
        const end = new Date();
        const start = new Date();
        if (dateRange === "today") {
            start.setHours(0, 0, 0, 0);
        } else if (dateRange === "yesterday") {
            start.setDate(start.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            end.setDate(end.getDate() - 1);
            end.setHours(23, 59, 59, 999);
        } else if (dateRange === "7days") {
            start.setDate(start.getDate() - 7);
        } else if (dateRange === "30days") {
            start.setDate(start.getDate() - 30);
        }
        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
    }, [dateRange]);

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const { startDate, endDate } = dateParams;
                const [statsRes, chartsRes] = await Promise.all([
                    apiClient.get(`/admin/dashboard/stats?startDate=${startDate}&endDate=${endDate}`),
                    apiClient.get(`/admin/dashboard/charts?startDate=${startDate}&endDate=${endDate}`)
                ]);
                if (isMounted) {
                    if (statsRes.data.success) {
                        setStats(statsRes.data.data);
                    }
                    if (chartsRes.data.success) {
                        setCharts(chartsRes.data.data);
                    }
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchDashboardData();
        return () => {
            isMounted = false;
        };
    }, [dateParams]);

    const orderStatusChartData = useMemo(() => {
        return charts.statusCounts.map(item => ({
            status: STATUS_LABELS[item.status] || item.status,
            count: item.count,
            color: STATUS_COLORS[item.status] || '#FE6132'
        }));
    }, [charts.statusCounts]);

    const lineChartData = useMemo(() => {
        return charts.revenueTrend.map(d => ({
            ...d,
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
    }, [charts.revenueTrend]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between animate-fade-in-up">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Welcome back! Here&apos;s a real-time overview of GrabGo performance.
                    </p>
                </div>
                <div className="w-48">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="h-11 border-border/50 bg-background/50 rounded-xl font-bold">
                            <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                            <SelectItem value="today" className="rounded-lg">Today</SelectItem>
                            <SelectItem value="yesterday" className="rounded-lg">Yesterday</SelectItem>
                            <SelectItem value="7days" className="rounded-lg">Last 7 Days</SelectItem>
                            <SelectItem value="30days" className="rounded-lg">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Customers"
                    value={stats.totalUsers}
                    icon={Group}
                    delay={0}
                />
                <StatCard
                    title="Active Vendors"
                    value={stats.activeVendors}
                    icon={Shop}
                    delay={100}
                />
                <StatCard
                    title="Orders in Timeframe"
                    value={stats.totalOrders}
                    icon={Cart}
                    delay={200}
                />
                <StatCard
                    title="Active Riders"
                    value={stats.activeRiders}
                    icon={Cycling}
                    delay={300}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-6 border-border/50 animate-fade-in-up transition-all group" style={{ animationDelay: "400ms" }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-500/10 transition-transform">
                            <CheckCircle className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Completed Today</p>
                            <p className="text-3xl font-black">{stats.completedOrders}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-border/50 animate-fade-in-up transition-all group" style={{ animationDelay: "500ms" }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-yellow-500/10 transition-transform">
                            <Clock className="w-7 h-7 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Pending Orders</p>
                            <p className="text-3xl font-black">{stats.pendingOrders}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-border/50 animate-fade-in-up transition-all group" style={{ animationDelay: "600ms" }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#FE6132]/10 transition-transform">
                            <CreditCard className="w-7 h-7 text-[#FE6132]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Gross Sales Value</p>
                            <p className="text-3xl font-black">
                                GH₵ {stats.totalRevenue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6 border-border/50 animate-fade-in-up transition-all" style={{ animationDelay: "700ms" }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Revenue Trend</h3>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Daily revenue performance across all services</p>
                        </div>
                        <div className="text-right p-3 rounded-xl bg-orange-500/10 border border-[#FE6132]/20">
                            <p className="text-xs font-bold text-[#FE6132]/80 uppercase tracking-wider mb-1">Total Sales Value</p>
                            <p className="text-2xl font-black text-[#FE6132]">
                                GH₵ {stats.totalRevenue.toLocaleString("en-GH")}
                            </p>
                        </div>
                    </div>
                    <div className="h-[250px] w-full">
                        {lineChartData.length > 0 ? (
                            <LineChart
                                data={lineChartData}
                                xKey="date"
                                yKey="revenue"
                                height={250}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                No sales data recorded for this timeframe
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-6 border-border/50 animate-fade-in-up transition-all" style={{ animationDelay: "800ms" }}>
                    <div className="mb-8">
                        <h3 className="text-xl font-bold">Order Live Status</h3>
                        <p className="text-sm font-medium text-muted-foreground mt-1">Real-time breakdown of current order states</p>
                    </div>
                    <div className="h-[250px] w-full flex items-center justify-center">
                        {orderStatusChartData.length > 0 ? (
                            <PieChart
                                data={orderStatusChartData}
                                dataKey="count"
                                nameKey="status"
                                height={250}
                            />
                        ) : (
                            <div className="text-muted-foreground text-sm">
                                No live orders
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <Card className="p-6 border-border/50 animate-fade-in-up transition-all" style={{ animationDelay: "900ms" }}>
                <div className="mb-8">
                    <h3 className="text-xl font-bold">Busiest Store Hours</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Aggregated order volume by hour (24h system)</p>
                </div>
                <div className="h-[250px]">
                    <BarChart
                        data={charts.peakHours}
                        xKey="hour"
                        yKey="orders"
                        height={250}
                    />
                </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6 border-border/50 animate-fade-in-up transition-all" style={{ animationDelay: "1000ms" }}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Elite Vendors</h3>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Highest grossing stores this month</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FE6132]/10">
                            <Shop className="w-5 h-5 text-[#FE6132]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {charts.eliteVendors.length > 0 ? (
                            charts.eliteVendors.slice(0, 5).map((vendor, index) => (
                                <div
                                    key={vendor.id}
                                    className="flex items-center justify-between p-3.5 rounded-xl bg-accent/30 hover:bg-accent/60 transition-all cursor-pointer group animate-fade-in-up"
                                    style={{ animationDelay: `${1100 + index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#FE6132] to-[#FE6132]/80 flex items-center justify-center transition-transform">
                                            <span className="text-sm font-black text-white">{index + 1}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-foreground">{vendor.name}</p>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${vendor.type === 'food' ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' :
                                                    vendor.type === 'grocery' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                                                        vendor.type === 'pharmacy' ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                                                            'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
                                                    }`}>
                                                    {vendor.type}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold text-muted-foreground mt-0.5">{vendor.orders.toLocaleString()} Successful Orders</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-foreground">GH₵ {vendor.revenue.toLocaleString()}</p>
                                        <div className="flex items-center justify-end gap-1 text-xs font-bold text-orange-600">
                                            <span>⭐</span>
                                            <span>{vendor.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                No elite vendors for this range
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-6 border-border/50 animate-fade-in-up transition-all" style={{ animationDelay: "1300ms" }}>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FE6132]"></span>
                        </span>
                        Pending Approvals
                    </h3>
                    <div className="space-y-3">
                        <div
                            onClick={() => router.push('/vendors')}
                            className="flex items-center justify-between p-4 rounded-xl bg-orange-500/10 border border-[#FE6132]/20 hover:bg-orange-500/20 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-card border border-[#FE6132]/20 flex items-center justify-center transition-transform text-[#FE6132]">
                                    <Shop className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#FE6132]">Vendor Applications</p>
                                    <p className="text-xs font-bold text-[#FE6132]/60 uppercase tracking-tighter">
                                        {charts.pendingVendors} stores awaiting review
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-[#FE6132] group-hover:translate-x-1 transition-transform">GO →</span>
                        </div>

                        <div
                            onClick={() => router.push('/riders')}
                            className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-card border border-blue-500/20 flex items-center justify-center transition-transform text-blue-500">
                                    <Cycling className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-blue-500">Rider Onboarding</p>
                                    <p className="text-xs font-bold text-blue-500/60 uppercase tracking-tighter">
                                        {charts.pendingRiders} riders pending check
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-blue-500 group-hover:translate-x-1 transition-transform">GO →</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
