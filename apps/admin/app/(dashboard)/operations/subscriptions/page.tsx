"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Input,
    Button,
    Badge,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@grabgo/ui";
import { Search, Group, Download } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface Subscription {
    id: string;
    userId: string;
    username: string;
    planName: string;
    planType: string;
    amount: number;
    status: string;
    startDate: string;
    endDate: string;
    createdAt: string;
}

export default function SubscriptionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [totalSubscriptions, setTotalSubscriptions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchSubscriptions = async () => {
            setIsLoading(true);
            try {
                const statusParam = statusFilter === "all" ? "" : statusFilter;
                const response = await apiClient.get(
                    `/admin/operations/subscriptions?page=${currentPage}&limit=${itemsPerPage}&status=${statusParam}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setSubscriptions(response.data.data.subscriptions || []);
                    setTotalSubscriptions(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch subscriptions:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchSubscriptions(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, statusFilter, searchQuery]);

    const getStatusBadge = (status: string) => {
        if (status === "active") return <Badge variant="success">Active</Badge>;
        if (status === "expired") return <Badge variant="destructive">Expired</Badge>;
        if (status === "cancelled") return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-transparent">Cancelled</Badge>;
        if (status === "trial") return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-transparent">Trial</Badge>;
        return <Badge variant="outline">{status}</Badge>;
    };

    const handleExport = () => {
        const headers = ["ID", "User", "Plan", "Type", "Amount (GHS)", "Status", "Start", "End"];
        const csvContent = [
            headers.join(","),
            ...subscriptions.map(s => [
                s.id.slice(0, 8),
                `"${s.username}"`,
                `"${s.planName}"`,
                s.planType,
                s.amount.toFixed(2),
                s.status,
                s.startDate ? format(new Date(s.startDate), "yyyy-MM-dd") : '',
                s.endDate ? format(new Date(s.endDate), "yyyy-MM-dd") : ''
            ].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `subscriptions_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalPages = Math.ceil(totalSubscriptions / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Subscriptions</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Monitor active subscription plans, renewals, and cancellations
                </p>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by username or plan name..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="pl-12 h-12 bg-accent/30 border-border/50 focus:bg-background transition-all rounded-xl font-medium w-full"
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-40 h-12 border-border/50 rounded-xl bg-background font-bold">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50">
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="trial">Trial</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleExport} variant="outline" className="gap-2 border-border/50 h-12 px-5 rounded-xl font-bold transition-all whitespace-nowrap">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-5 text-sm font-semibold">User</th>
                                <th className="text-left p-5 text-sm font-semibold">Plan</th>
                                <th className="text-left p-5 text-sm font-semibold">Type</th>
                                <th className="text-left p-5 text-sm font-semibold">Amount</th>
                                <th className="text-left p-5 text-sm font-semibold">Status</th>
                                <th className="text-left p-5 text-sm font-semibold">Start</th>
                                <th className="text-left p-5 text-sm font-semibold">End</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`sk-${i}`} className="animate-pulse">
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className="p-5"><div className="h-4 bg-muted rounded w-20" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Group className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No subscriptions found</h3>
                                            <p className="text-muted-foreground text-sm">No subscription records match your query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map((s) => (
                                    <tr key={s.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5">
                                            <div>
                                                <div className="font-bold">{s.username}</div>
                                                <div className="text-xs text-muted-foreground font-mono">{s.userId?.slice(0, 12)}</div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-bold">{s.planName}</td>
                                        <td className="p-5">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-accent">
                                                {s.planType}
                                            </span>
                                        </td>
                                        <td className="p-5 font-extrabold">GH₵ {s.amount.toFixed(2)}</td>
                                        <td className="p-5">{getStatusBadge(s.status)}</td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {s.startDate ? format(new Date(s.startDate), "MMM dd, yyyy") : "—"}
                                        </td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {s.endDate ? format(new Date(s.endDate), "MMM dd, yyyy") : "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {subscriptions.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalSubscriptions)} of {totalSubscriptions}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="border-border/50">Previous</Button>
                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="border-border/50">Next</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
