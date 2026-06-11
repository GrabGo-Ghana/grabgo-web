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
import { Search, Download, FastArrowDown } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface CodRecord {
    id: string;
    orderNumber: string;
    customerName: string;
    riderName: string;
    amount: number;
    paymentStatus: string;
    createdAt: string;
}

export default function CodCollectionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [records, setRecords] = useState<CodRecord[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Reconcile dialog
    const [reconcileTarget, setReconcileTarget] = useState<CodRecord | null>(null);
    const [reconcileReason, setReconcileReason] = useState("");
    const [isReconciling, setIsReconciling] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchCod = async () => {
            setIsLoading(true);
            try {
                const statusParam = statusFilter === "all" ? "" : statusFilter;
                const response = await apiClient.get(
                    `/admin/finance/cod?page=${currentPage}&limit=${itemsPerPage}&status=${statusParam}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setRecords(response.data.data.records || []);
                    setTotalRecords(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch COD collections:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const timer = setTimeout(() => fetchCod(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, statusFilter, searchQuery, refreshTrigger]);

    const handleReconcile = async () => {
        if (!reconcileTarget) return;
        setIsReconciling(true);
        try {
            await apiClient.put(`/admin/finance/cod/${reconcileTarget.id}/collect`, {
                reason: reconcileReason || "Cash collected and reconciled"
            });
            setReconcileTarget(null);
            setReconcileReason("");
            setRefreshTrigger(r => r + 1);
        } catch (error) {
            console.error("Reconciliation failed:", error);
        } finally {
            setIsReconciling(false);
        }
    };

    const handleExport = () => {
        const headers = ["Order #", "Customer", "Rider", "Amount (GHS)", "Status", "Date"];
        const csvContent = [
            headers.join(","),
            ...records.map(r => [
                r.orderNumber,
                `"${r.customerName}"`,
                `"${r.riderName}"`,
                r.amount.toFixed(2),
                r.paymentStatus,
                format(new Date(r.createdAt), "yyyy-MM-dd HH:mm")
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `cod_collections_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string) => {
        if (status === "paid" || status === "collected") return <Badge variant="success">Collected</Badge>;
        if (status === "pending") return <Badge variant="warning">Pending</Badge>;
        return <Badge variant="destructive">{status}</Badge>;
    };

    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">COD Collections</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Track and reconcile cash-on-delivery payments collected by riders
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
                                <SelectItem value="paid">Collected</SelectItem>
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
                                <th className="text-left p-5 text-sm font-semibold">Order #</th>
                                <th className="text-left p-5 text-sm font-semibold">Customer</th>
                                <th className="text-left p-5 text-sm font-semibold">Rider</th>
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
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className="p-5"><div className="h-4 bg-muted rounded w-20" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <FastArrowDown className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No COD records found</h3>
                                            <p className="text-muted-foreground text-sm">No cash-on-delivery orders match your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                records.map((r) => (
                                    <tr key={r.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5 font-bold">{r.orderNumber}</td>
                                        <td className="p-5 font-medium">{r.customerName}</td>
                                        <td className="p-5 font-medium">{r.riderName}</td>
                                        <td className="p-5 font-extrabold">GH₵ {r.amount.toFixed(2)}</td>
                                        <td className="p-5">{getStatusBadge(r.paymentStatus)}</td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(r.createdAt), "MMM dd, yyyy HH:mm")}
                                        </td>
                                        <td className="p-5 text-right">
                                            {r.paymentStatus === "pending" && (
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-lg font-bold"
                                                    onClick={() => setReconcileTarget(r)}
                                                >
                                                    Mark Collected
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {records.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="border-border/50">Previous</Button>
                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="border-border/50">Next</Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Reconcile Dialog */}
            <Dialog open={!!reconcileTarget} onOpenChange={(open) => { if (!open) setReconcileTarget(null); }}>
                <DialogContent className="rounded-2xl border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Confirm Cash Collection</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            You are marking order <span className="font-bold text-foreground">{reconcileTarget?.orderNumber}</span> as cash collected.
                            Amount: <span className="font-bold text-foreground">GH₵ {reconcileTarget?.amount.toFixed(2)}</span>
                        </p>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Reason (optional)</label>
                            <Input
                                placeholder="e.g., Cash received from rider at hub"
                                value={reconcileReason}
                                onChange={(e) => setReconcileReason(e.target.value)}
                                className="h-12 rounded-xl border-border/50"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReconcileTarget(null)} className="rounded-xl">Cancel</Button>
                        <Button
                            onClick={handleReconcile}
                            disabled={isReconciling}
                            className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl font-bold"
                        >
                            {isReconciling ? "Processing..." : "Confirm Collection"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
