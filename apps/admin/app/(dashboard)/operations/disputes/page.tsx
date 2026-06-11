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
import { Search, Download, ShieldCheck } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface Dispute {
    id: string;
    orderId: string;
    orderNumber: string;
    customerName: string;
    vendorName: string;
    reason: string;
    status: string;
    resolutionNote: string;
    createdAt: string;
}

export default function DisputesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [totalDisputes, setTotalDisputes] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Resolve dialog
    const [resolveTarget, setResolveTarget] = useState<Dispute | null>(null);
    const [resolveStatus, setResolveStatus] = useState<string>("resolved");
    const [resolveNote, setResolveNote] = useState("");
    const [isResolving, setIsResolving] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchDisputes = async () => {
            setIsLoading(true);
            try {
                const statusParam = statusFilter === "all" ? "" : statusFilter;
                const response = await apiClient.get(
                    `/admin/operations/disputes?page=${currentPage}&limit=${itemsPerPage}&status=${statusParam}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setDisputes(response.data.data.disputes || []);
                    setTotalDisputes(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch disputes:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchDisputes(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, statusFilter, searchQuery, refreshTrigger]);

    const handleResolve = async () => {
        if (!resolveTarget) return;
        setIsResolving(true);
        try {
            await apiClient.put(`/admin/operations/disputes/${resolveTarget.id}/resolve`, {
                status: resolveStatus,
                resolutionNote: resolveNote,
                reason: `Dispute ${resolveStatus}`
            });
            setResolveTarget(null);
            setResolveNote("");
            setRefreshTrigger(r => r + 1);
        } catch (error) {
            console.error("Dispute resolution failed:", error);
        } finally {
            setIsResolving(false);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === "resolved") return <Badge variant="success">Resolved</Badge>;
        if (status === "rejected") return <Badge variant="destructive">Rejected</Badge>;
        if (status === "investigating") return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-transparent">Investigating</Badge>;
        if (status === "open" || status === "pending") return <Badge variant="warning">Open</Badge>;
        return <Badge variant="outline">{status}</Badge>;
    };

    const totalPages = Math.ceil(totalDisputes / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Disputes</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Review and resolve customer-vendor dispute claims across all order types
                </p>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by order number, customer, or vendor..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="pl-12 h-12 bg-accent/30 border-border/50 focus:bg-background transition-all rounded-xl font-medium w-full"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-40 h-12 border-border/50 rounded-xl bg-background font-bold">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="investigating">Investigating</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <Card className="overflow-hidden border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-5 text-sm font-semibold">Dispute ID</th>
                                <th className="text-left p-5 text-sm font-semibold">Order</th>
                                <th className="text-left p-5 text-sm font-semibold">Customer</th>
                                <th className="text-left p-5 text-sm font-semibold">Vendor</th>
                                <th className="text-left p-5 text-sm font-semibold">Reason</th>
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
                            ) : disputes.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <ShieldCheck className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No disputes found</h3>
                                            <p className="text-muted-foreground text-sm">No dispute claims match your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                disputes.map((d) => (
                                    <tr key={d.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5 font-mono text-xs font-bold text-muted-foreground">{d.id.slice(0, 8)}</td>
                                        <td className="p-5 font-bold">{d.orderNumber || d.orderId?.slice(0, 8)}</td>
                                        <td className="p-5 font-medium">{d.customerName}</td>
                                        <td className="p-5 font-medium">{d.vendorName}</td>
                                        <td className="p-5 text-sm text-muted-foreground max-w-xs truncate">{d.reason}</td>
                                        <td className="p-5">{getStatusBadge(d.status)}</td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(d.createdAt), "MMM dd, yyyy")}
                                        </td>
                                        <td className="p-5 text-right">
                                            {(d.status === "open" || d.status === "pending" || d.status === "investigating") && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="rounded-lg font-bold border-border/50"
                                                    onClick={() => setResolveTarget(d)}
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

                {disputes.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalDisputes)} of {totalDisputes}
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
                        <DialogTitle className="text-xl font-bold">Resolve Dispute</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            Dispute for order <span className="font-bold text-foreground">{resolveTarget?.orderNumber}</span> between{" "}
                            <span className="font-bold text-foreground">{resolveTarget?.customerName}</span> and{" "}
                            <span className="font-bold text-foreground">{resolveTarget?.vendorName}</span>
                        </p>
                        <div className="p-3 rounded-xl bg-accent/50 text-sm">
                            <span className="font-bold">Reason:</span> {resolveTarget?.reason}
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Resolution Status</label>
                            <Select value={resolveStatus} onValueChange={setResolveStatus}>
                                <SelectTrigger className="h-12 rounded-xl border-border/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/50">
                                    <SelectItem value="resolved">Resolved (in customer favor)</SelectItem>
                                    <SelectItem value="rejected">Rejected (in vendor favor)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Resolution Note</label>
                            <textarea
                                placeholder="Describe the resolution outcome..."
                                value={resolveNote}
                                onChange={(e) => setResolveNote(e.target.value)}
                                className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#FE6132]/30 resize-none"
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
