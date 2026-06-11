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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@grabgo/ui";
import { Search, Download, Undo } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface Refund {
    id: string;
    orderId: string;
    orderNumber: string;
    customerName: string;
    refundMethod: string;
    totalRefundAmount: number;
    status: string;
    reason: string;
    createdAt: string;
}

export default function RefundsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [refunds, setRefunds] = useState<Refund[]>([]);
    const [totalRefunds, setTotalRefunds] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Resolve dialog
    const [resolveTarget, setResolveTarget] = useState<Refund | null>(null);
    const [resolveStatus, setResolveStatus] = useState<string>("completed");
    const [resolveReason, setResolveReason] = useState("");
    const [isResolving, setIsResolving] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchRefunds = async () => {
            setIsLoading(true);
            try {
                const statusParam = statusFilter === "all" ? "" : statusFilter;
                const response = await apiClient.get(
                    `/admin/finance/refunds?page=${currentPage}&limit=${itemsPerPage}&status=${statusParam}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setRefunds(response.data.data.refunds || []);
                    setTotalRefunds(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch refunds:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchRefunds(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, statusFilter, searchQuery, refreshTrigger]);

    const handleResolve = async () => {
        if (!resolveTarget) return;
        setIsResolving(true);
        try {
            await apiClient.put(`/admin/finance/refunds/${resolveTarget.id}/resolve`, {
                status: resolveStatus,
                reason: resolveReason || `Refund ${resolveStatus}`
            });
            setResolveTarget(null);
            setResolveReason("");
            setRefreshTrigger(r => r + 1);
        } catch (error) {
            console.error("Refund resolution failed:", error);
        } finally {
            setIsResolving(false);
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Order #", "Customer", "Method", "Amount (GHS)", "Status", "Reason", "Date"];
        const csvContent = [
            headers.join(","),
            ...refunds.map(r => [
                r.id.slice(0, 8),
                r.orderNumber || r.orderId?.slice(0, 8),
                `"${r.customerName}"`,
                r.refundMethod,
                r.totalRefundAmount.toFixed(2),
                r.status,
                `"${(r.reason || '').replace(/"/g, '""')}"`,
                format(new Date(r.createdAt), "yyyy-MM-dd HH:mm")
            ].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `refunds_register_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string) => {
        if (status === "completed") return <Badge variant="success">Completed</Badge>;
        if (status === "pending") return <Badge variant="warning">Pending</Badge>;
        if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
        return <Badge variant="outline">{status}</Badge>;
    };

    const getMethodBadge = (method: string) => {
        if (method === "paystack_cash") return (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-green-500/10 text-green-600">Paystack</span>
        );
        return (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-[#FE6132]/10 text-[#FE6132]">Credits</span>
        );
    };

    const totalPages = Math.ceil(totalRefunds / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Refunds Register</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Track refund requests, process reversals, and manage customer reimbursements
                </p>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by order number or customer name..."
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
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleExport} variant="outline" className="gap-2 border-border/50 h-12 px-5 rounded-xl font-bold transition-all whitespace-nowrap">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-5 text-sm font-semibold">Refund ID</th>
                                <th className="text-left p-5 text-sm font-semibold">Order</th>
                                <th className="text-left p-5 text-sm font-semibold">Customer</th>
                                <th className="text-left p-5 text-sm font-semibold">Method</th>
                                <th className="text-left p-5 text-sm font-semibold">Amount</th>
                                <th className="text-left p-5 text-sm font-semibold">Status</th>
                                <th className="text-left p-5 text-sm font-semibold">Date</th>
                                <th className="text-right p-5 text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`sk-${i}`} className="animate-pulse">
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <td key={j} className="p-5"><div className="h-4 bg-muted rounded w-20" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : refunds.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Undo className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No refunds found</h3>
                                            <p className="text-muted-foreground text-sm">No refund records match your query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                refunds.map((r) => (
                                    <tr key={r.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5 font-mono text-xs font-bold text-muted-foreground">{r.id.slice(0, 8)}</td>
                                        <td className="p-5 font-bold">{r.orderNumber || r.orderId?.slice(0, 8)}</td>
                                        <td className="p-5 font-medium">{r.customerName}</td>
                                        <td className="p-5">{getMethodBadge(r.refundMethod)}</td>
                                        <td className="p-5 font-extrabold text-red-600">-GH₵ {r.totalRefundAmount.toFixed(2)}</td>
                                        <td className="p-5">{getStatusBadge(r.status)}</td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(r.createdAt), "MMM dd, yyyy HH:mm")}
                                        </td>
                                        <td className="p-5 text-right">
                                            {r.status === "pending" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="rounded-lg font-bold border-border/50"
                                                    onClick={() => setResolveTarget(r)}
                                                >
                                                    Resolve
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {refunds.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalRefunds)} of {totalRefunds}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="border-border/50">Previous</Button>
                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="border-border/50">Next</Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Resolve Dialog */}
            <Dialog open={!!resolveTarget} onOpenChange={(open) => { if (!open) setResolveTarget(null); }}>
                <DialogContent className="rounded-2xl border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Resolve Refund</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            Refund of <span className="font-bold text-foreground">GH₵ {resolveTarget?.totalRefundAmount.toFixed(2)}</span> for order{" "}
                            <span className="font-bold text-foreground">{resolveTarget?.orderNumber || resolveTarget?.orderId?.slice(0, 8)}</span>
                        </p>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Resolution Status</label>
                            <Select value={resolveStatus} onValueChange={setResolveStatus}>
                                <SelectTrigger className="h-12 rounded-xl border-border/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/50">
                                    <SelectItem value="completed">Mark as Completed</SelectItem>
                                    <SelectItem value="failed">Mark as Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Reason (optional)</label>
                            <Input
                                placeholder="e.g., Refund processed via Paystack"
                                value={resolveReason}
                                onChange={(e) => setResolveReason(e.target.value)}
                                className="h-12 rounded-xl border-border/50"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setResolveTarget(null)} className="rounded-xl">Cancel</Button>
                        <Button
                            onClick={handleResolve}
                            disabled={isResolving}
                            className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl font-bold"
                        >
                            {isResolving ? "Processing..." : "Confirm Resolution"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
