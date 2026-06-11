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
import { Search, Download, Shop } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface VendorPayout {
    id: string;
    vendorName: string;
    vendorType: string;
    bankName: string;
    accountNumber: string;
    amount: number;
    status: string;
    createdAt: string;
}

export default function VendorPayoutsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [payouts, setPayouts] = useState<VendorPayout[]>([]);
    const [totalPayouts, setTotalPayouts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Approve dialog
    const [approveTarget, setApproveTarget] = useState<VendorPayout | null>(null);
    const [approveReason, setApproveReason] = useState("");
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchPayouts = async () => {
            setIsLoading(true);
            try {
                const statusParam = statusFilter === "all" ? "" : statusFilter;
                const response = await apiClient.get(
                    `/admin/finance/vendor-payouts?page=${currentPage}&limit=${itemsPerPage}&status=${statusParam}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setPayouts(response.data.data.payouts || []);
                    setTotalPayouts(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch vendor payouts:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchPayouts(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, statusFilter, searchQuery, refreshTrigger]);

    const handleApprove = async () => {
        if (!approveTarget) return;
        setIsApproving(true);
        try {
            await apiClient.put(`/admin/finance/vendor-payouts/${approveTarget.id}/approve`, {
                reason: approveReason || "Vendor bank payout approved"
            });
            setApproveTarget(null);
            setApproveReason("");
            setRefreshTrigger(r => r + 1);
        } catch (error) {
            console.error("Payout approval failed:", error);
        } finally {
            setIsApproving(false);
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Vendor", "Type", "Bank", "Account", "Amount (GHS)", "Status", "Date"];
        const csvContent = [
            headers.join(","),
            ...payouts.map(p => [
                p.id.slice(0, 8),
                `"${p.vendorName}"`,
                p.vendorType,
                `"${p.bankName || 'N/A'}"`,
                p.accountNumber || 'N/A',
                p.amount.toFixed(2),
                p.status,
                format(new Date(p.createdAt), "yyyy-MM-dd HH:mm")
            ].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `vendor_payouts_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string) => {
        if (status === "completed" || status === "paid") return <Badge variant="success">Paid</Badge>;
        if (status === "pending") return <Badge variant="warning">Pending</Badge>;
        if (status === "processing") return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-transparent">Processing</Badge>;
        return <Badge variant="destructive">{status}</Badge>;
    };

    const getTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            food: "bg-orange-500/10 text-orange-600",
            grocery: "bg-green-500/10 text-green-600",
            pharmacy: "bg-blue-500/10 text-blue-600",
            grabmart: "bg-purple-500/10 text-purple-600",
        };
        return (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${colors[type] || "bg-accent text-muted-foreground"}`}>
                {type}
            </span>
        );
    };

    const totalPages = Math.ceil(totalPayouts / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Vendor Payouts</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Manage and approve pending bank transfer payouts to vendor accounts
                </p>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by vendor name or bank..."
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
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
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
                                <th className="text-left p-5 text-sm font-semibold">Vendor</th>
                                <th className="text-left p-5 text-sm font-semibold">Type</th>
                                <th className="text-left p-5 text-sm font-semibold">Bank</th>
                                <th className="text-left p-5 text-sm font-semibold">Account</th>
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
                            ) : payouts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Shop className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No vendor payouts found</h3>
                                            <p className="text-muted-foreground text-sm">No payout records match your query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((p) => (
                                    <tr key={p.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5 font-bold">{p.vendorName}</td>
                                        <td className="p-5">{getTypeBadge(p.vendorType)}</td>
                                        <td className="p-5 font-medium">{p.bankName || "N/A"}</td>
                                        <td className="p-5 font-mono text-xs">{p.accountNumber || "N/A"}</td>
                                        <td className="p-5 font-extrabold">GH₵ {p.amount.toFixed(2)}</td>
                                        <td className="p-5">{getStatusBadge(p.status)}</td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(p.createdAt), "MMM dd, yyyy")}
                                        </td>
                                        <td className="p-5 text-right">
                                            {p.status === "pending" && (
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-br from-green-600 to-green-500 text-white rounded-lg font-bold"
                                                    onClick={() => setApproveTarget(p)}
                                                >
                                                    Approve
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {payouts.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalPayouts)} of {totalPayouts}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="border-border/50">Previous</Button>
                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="border-border/50">Next</Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Approve Dialog */}
            <Dialog open={!!approveTarget} onOpenChange={(open) => { if (!open) setApproveTarget(null); }}>
                <DialogContent className="rounded-2xl border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Approve Vendor Payout</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            Transfer <span className="font-bold text-foreground">GH₵ {approveTarget?.amount.toFixed(2)}</span> to{" "}
                            <span className="font-bold text-foreground">{approveTarget?.vendorName}</span> via{" "}
                            <span className="font-bold text-foreground">{approveTarget?.bankName} ({approveTarget?.accountNumber})</span>
                        </p>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Reason (optional)</label>
                            <Input
                                placeholder="e.g., Weekly settlement processed"
                                value={approveReason}
                                onChange={(e) => setApproveReason(e.target.value)}
                                className="h-12 rounded-xl border-border/50"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveTarget(null)} className="rounded-xl">Cancel</Button>
                        <Button
                            onClick={handleApprove}
                            disabled={isApproving}
                            className="bg-gradient-to-br from-green-600 to-green-500 text-white rounded-xl font-bold"
                        >
                            {isApproving ? "Processing..." : "Confirm Payout"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
