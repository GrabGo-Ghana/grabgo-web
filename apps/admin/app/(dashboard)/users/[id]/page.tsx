"use client";

import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { Card, Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@grabgo/ui";
import {
    ArrowLeft,
    Edit,
    Key,
    Wallet,
    Bell,
    Cart,
    Group,
    CheckCircleSolid,
} from "iconoir-react";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { CustomerProfileHeader } from "./CustomerProfileHeader";
import { apiClient } from "@grabgo/utils";

interface CustomerPageProps {
    params: Promise<{
        id: string;
    }>;
}

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

export default function CustomerDetailPage({ params }: CustomerPageProps) {
    const { id } = use(params);
    const [customer, setCustomer] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadCustomerData = async () => {
            try {
                const userRes = await apiClient.get(`/admin/users/${id}`);
                if (userRes.data.success && isMounted) {
                    const u = userRes.data.data;
                    const customerData = {
                        id: u.id,
                        username: u.username,
                        email: u.email,
                        phone: u.phone,
                        isActive: u.isActive,
                        createdAt: u.createdAt,
                        lastSeen: null,
                        emailVerified: true,
                        phoneVerified: true,
                        totalOrders: u.recentOrders ? u.recentOrders.length : 0,
                        totalSpending: u.recentOrders ? u.recentOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0) : 0,
                        creditsBalance: u.creditBalance || 0,
                        referralCount: 0
                    };
                    setCustomer(customerData);
                    
                    if (u.recentOrders) {
                        setOrders(u.recentOrders.map((o: any) => ({
                            id: o.id,
                            date: o.createdAt,
                            restaurant: 'GrabGo Order Override',
                            items: 'Details are logs inside Orders panel',
                            total: o.total,
                            status: o.status === 'delivered' ? 'completed' : o.status === 'pending' ? 'pending' : 'cancelled'
                        })));
                    }

                    try {
                        const paymentsRes = await apiClient.get(`/admin/finance/payments?q=${u.username}`);
                        if (paymentsRes.data.success && isMounted) {
                            setPayments(paymentsRes.data.data.payments.map((p: any) => ({
                                id: p.id,
                                date: p.createdAt,
                                method: p.gateway,
                                amount: p.amount,
                                status: p.status === 'paid' || p.status === 'successful' ? 'success' : p.status === 'pending' ? 'pending' : 'failed'
                            })));
                        }
                    } catch (e) {
                        console.error("Failed to load user payments:", e);
                    }
                }
            } catch (error) {
                console.error("Failed to load customer details:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        loadCustomerData();
        return () => {
            isMounted = false;
        };
    }, [id]);

    if (isLoading) {
        return <div className="p-6 text-center text-muted-foreground font-bold animate-pulse">Loading Customer Intelligence dossier...</div>;
    }

    if (!customer) {
        notFound();
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/users">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Customers
                    </Button>
                </Link>
            </div>

            {/* Profile Header */}
            <Card className="p-6 border-border/50 animate-fade-in-up">
                <CustomerProfileHeader customer={customer} />
            </Card>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Orders */}
                <Card className="p-6 border-border/50 animate-fade-in-up transition-all group" style={{ animationDelay: "100ms" }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center transition-transform">
                            <Cart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-foreground"><AnimatedNumber value={customer.totalOrders} delay={100} /></p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Orders</p>
                        </div>
                    </div>
                </Card>

                {/* Total Spending */}
                <Card className="p-6 border-border/50 animate-fade-in-up transition-all group" style={{ animationDelay: "200ms" }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FE6132]/10 flex items-center justify-center transition-transform">
                            <TrendingUp className="w-6 h-6 text-[#FE6132]" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-foreground">
                                GH₵<AnimatedNumber value={customer.totalSpending} delay={200} />
                            </p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Spent</p>
                        </div>
                    </div>
                </Card>

                {/* Credits Balance */}
                <Card className="p-6 border-border/50 animate-fade-in-up transition-all group" style={{ animationDelay: "300ms" }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center transition-transform">
                            <Wallet className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-foreground">
                                GH₵<AnimatedNumber value={customer.creditsBalance} delay={300} />
                            </p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Credits</p>
                        </div>
                    </div>
                </Card>

                {/* Referrals */}
                <Card className="p-6 border-border/50 animate-fade-in-up transition-all group" style={{ animationDelay: "400ms" }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center transition-transform">
                            <Group className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-foreground"><AnimatedNumber value={customer.referralCount} delay={400} /></p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Referrals</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs Section */}
            <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
                <Tabs defaultValue="personal" className="w-full">
                    <div className="border-b border-border/50">
                        <TabsList className="bg-transparent h-auto p-0 w-full justify-start px-6">
                            <TabsTrigger
                                value="personal"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE6132] data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-6 py-4 font-medium"
                            >
                                Personal Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="orders"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE6132] data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-6 py-4 font-medium"
                            >
                                Order History
                            </TabsTrigger>
                            <TabsTrigger
                                value="payments"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE6132] data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-6 py-4 font-medium"
                            >
                                Payment History
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE6132] data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-6 py-4 font-medium"
                            >
                                Settings
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Personal Info Tab */}
                    <TabsContent value="personal" className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Username</label>
                                <p className="mt-1 text-base">{customer.username}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="text-base">{customer.email}</p>
                                    {customer.emailVerified && (
                                        <Badge variant="success" className="text-xs">Verified</Badge>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="text-base">{customer.phone}</p>
                                    {customer.phoneVerified && (
                                        <Badge variant="success" className="text-xs">Verified</Badge>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                                <div className="mt-1">
                                    <Badge variant={customer.isActive ? "success" : "destructive"}>
                                        {customer.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                                <p className="mt-1 text-base">{customer.createdAt ? format(new Date(customer.createdAt), "PPP") : "N/A"}</p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Order History Tab */}
                    <TabsContent value="orders" className="p-6">
                        {orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b border-border/50">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-sm">Order ID</th>
                                            <th className="text-left p-4 font-semibold text-sm">Date</th>
                                            <th className="text-left p-4 font-semibold text-sm">Restaurant</th>
                                            <th className="text-left p-4 font-semibold text-sm">Items</th>
                                            <th className="text-left p-4 font-semibold text-sm">Total</th>
                                            <th className="text-left p-4 font-semibold text-sm">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4 font-medium">{order.id}</td>
                                                <td className="p-4 text-sm">{format(new Date(order.date), "MMM dd, yyyy")}</td>
                                                <td className="p-4 text-sm">{order.restaurant || "N/A"}</td>
                                                <td className="p-4 text-sm">{order.items}</td>
                                                <td className="p-4 font-medium">
                                                    GH₵{order.total.toLocaleString("en-GH", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        variant={
                                                            order.status === "completed"
                                                                ? "success"
                                                                : order.status === "pending"
                                                                    ? "warning"
                                                                    : "destructive"
                                                        }
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-16 text-center animate-fade-in">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <Cart className="w-8 h-8 text-muted-foreground opacity-20" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold text-foreground/80">No orders yet</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                                            This customer hasn't placed any orders on GrabGo platforms yet.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* Payment History Tab */}
                    <TabsContent value="payments" className="p-6">
                        {payments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b border-border/50">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-sm">Transaction ID</th>
                                            <th className="text-left p-4 font-semibold text-sm">Date</th>
                                            <th className="text-left p-4 font-semibold text-sm">Method</th>
                                            <th className="text-left p-4 font-semibold text-sm">Amount</th>
                                            <th className="text-left p-4 font-semibold text-sm">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4 font-medium">{payment.id}</td>
                                                <td className="p-4 text-sm">{format(new Date(payment.date), "MMM dd, yyyy")}</td>
                                                <td className="p-4 text-sm capitalize">{payment.method ? payment.method.replace("_", " ") : 'N/A'}</td>
                                                <td className="p-4 font-medium">
                                                    GH₵{payment.amount.toLocaleString("en-GH", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        variant={
                                                            payment.status === "success"
                                                                ? "success"
                                                                : payment.status === "pending"
                                                                    ? "warning"
                                                                    : "destructive"
                                                        }
                                                    >
                                                        {payment.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-16 text-center animate-fade-in">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <Wallet className="w-8 h-8 text-muted-foreground opacity-20" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold text-foreground/80">No payments found</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                                            There is no recorded payment transaction history for this customer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* Notification Settings Tab */}
                    <TabsContent value="settings" className="p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-2">Notification Preferences</h3>
                                <p className="text-sm text-muted-foreground mb-6">Manage how this customer receives notifications</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                                    <div>
                                        <p className="font-medium text-sm">Order Status Updates</p>
                                        <p className="text-xs text-muted-foreground">Notifications about order preparation and delivery</p>
                                    </div>
                                    <Badge variant="success">Enabled</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                                    <div>
                                        <p className="font-medium text-sm">Delivery Notifications</p>
                                        <p className="text-xs text-muted-foreground">Updates when rider is nearby</p>
                                    </div>
                                    <Badge variant="success">Enabled</Badge>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
