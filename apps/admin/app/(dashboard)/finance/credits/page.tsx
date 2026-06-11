"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Input,
    Button,
    Badge,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@grabgo/ui";
import { Search, Download, CreditCard, Plus } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface CreditEntry {
    id: string;
    userId: string;
    username: string;
    amount: number;
    actionType: string;
    reason: string;
    createdAt: string;
}

export default function CreditsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [credits, setCredits] = useState<CreditEntry[]>([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Adjust credits dialog
    const [showAdjust, setShowAdjust] = useState(false);
    const [adjustUserId, setAdjustUserId] = useState("");
    const [adjustAmount, setAdjustAmount] = useState("");
    const [adjustType, setAdjustType] = useState<string>("grant");
    const [adjustReason, setAdjustReason] = useState("");
    const [isAdjusting, setIsAdjusting] = useState(false);
    const [adjustError, setAdjustError] = useState("");

    useEffect(() => {
        let isMounted = true;
        const fetchCredits = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(
                    `/admin/finance/credits?page=${currentPage}&limit=${itemsPerPage}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setCredits(response.data.data.entries || []);
                    setTotalCredits(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch credits:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchCredits(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, searchQuery, refreshTrigger]);

    const handleAdjust = async () => {
        if (!adjustUserId || !adjustAmount) {
            setAdjustError("User ID and amount are required");
            return;
        }
        setIsAdjusting(true);
        setAdjustError("");
        try {
            const response = await apiClient.post("/admin/finance/credits", {
                userId: adjustUserId,
                amount: Number(adjustAmount),
                actionType: adjustType,
                reason: adjustReason || `Admin ${adjustType}`
            });
            if (response.data.success) {
                setShowAdjust(false);
                setAdjustUserId("");
                setAdjustAmount("");
                setAdjustReason("");
                setRefreshTrigger(r => r + 1);
            } else {
                setAdjustError(response.data.message || "Failed to adjust credits");
            }
        } catch (error: any) {
            setAdjustError(error?.response?.data?.message || "Failed to adjust credits");
        } finally {
            setIsAdjusting(false);
        }
    };

    const handleExport = () => {
        const headers = ["ID", "User ID", "Username", "Type", "Amount (GHS)", "Reason", "Date"];
        const csvContent = [
            headers.join(","),
            ...credits.map(c => [
                c.id.slice(0, 8),
                c.userId.slice(0, 8),
                `"${c.username}"`,
                c.actionType,
                c.amount.toFixed(2),
                `"${(c.reason || '').replace(/"/g, '""')}"`,
                format(new Date(c.createdAt), "yyyy-MM-dd HH:mm")
            ].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `credits_ledger_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalPages = Math.ceil(totalCredits / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Wallet / Credits</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Manage customer wallet balances, grant and deduct credits
                    </p>
                </div>
                <Button
                    onClick={() => setShowAdjust(true)}
                    className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl h-12 px-6 font-bold active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Adjust Credits
                </Button>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by username or user ID..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="pl-12 h-12 bg-accent/30 border-border/50 focus:bg-background transition-all rounded-xl font-medium w-full"
                        />
                    </div>
                    <Button onClick={handleExport} variant="outline" className="gap-2 border-border/50 h-12 px-5 rounded-xl font-bold transition-all whitespace-nowrap">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </Card>

            <Card className="overflow-hidden border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-5 text-sm font-semibold">Log ID</th>
                                <th className="text-left p-5 text-sm font-semibold">User</th>
                                <th className="text-left p-5 text-sm font-semibold">Type</th>
                                <th className="text-left p-5 text-sm font-semibold">Amount</th>
                                <th className="text-left p-5 text-sm font-semibold">Reason</th>
                                <th className="text-left p-5 text-sm font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`sk-${i}`} className="animate-pulse">
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="p-5"><div className="h-4 bg-muted rounded w-20" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : credits.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <CreditCard className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No credit entries found</h3>
                                            <p className="text-muted-foreground text-sm">No wallet adjustment records match your query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                credits.map((c) => (
                                    <tr key={c.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5 font-mono text-xs font-bold text-muted-foreground">{c.id.slice(0, 8)}</td>
                                        <td className="p-5">
                                            <div>
                                                <div className="font-bold">{c.username}</div>
                                                <div className="text-xs text-muted-foreground font-mono">{c.userId.slice(0, 12)}</div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {c.actionType === "grant" ? (
                                                <Badge variant="success">Grant</Badge>
                                            ) : (
                                                <Badge variant="destructive">Deduct</Badge>
                                            )}
                                        </td>
                                        <td className={`p-5 font-extrabold ${c.actionType === "grant" ? "text-green-600" : "text-red-600"}`}>
                                            {c.actionType === "grant" ? "+" : "-"}GH₵ {c.amount.toFixed(2)}
                                        </td>
                                        <td className="p-5 text-sm text-muted-foreground max-w-xs truncate">{c.reason || "—"}</td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(c.createdAt), "MMM dd, yyyy HH:mm")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {credits.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCredits)} of {totalCredits}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="border-border/50">Previous</Button>
                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="border-border/50">Next</Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Adjust Credits Dialog */}
            <Dialog open={showAdjust} onOpenChange={setShowAdjust}>
                <DialogContent className="rounded-2xl border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Adjust Wallet Credits</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {adjustError && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium">
                                {adjustError}
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-bold mb-2 block">User ID</label>
                            <Input
                                placeholder="Enter user ID (UUID)"
                                value={adjustUserId}
                                onChange={(e) => setAdjustUserId(e.target.value)}
                                className="h-12 rounded-xl border-border/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Action Type</label>
                            <Select value={adjustType} onValueChange={setAdjustType}>
                                <SelectTrigger className="h-12 rounded-xl border-border/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/50">
                                    <SelectItem value="grant">Grant Credits (+)</SelectItem>
                                    <SelectItem value="deduct">Deduct Credits (-)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Amount (GH₵)</label>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="e.g. 50.00"
                                value={adjustAmount}
                                onChange={(e) => setAdjustAmount(e.target.value)}
                                className="h-12 rounded-xl border-border/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Reason</label>
                            <Input
                                placeholder="e.g., Compensation for delayed delivery"
                                value={adjustReason}
                                onChange={(e) => setAdjustReason(e.target.value)}
                                className="h-12 rounded-xl border-border/50"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAdjust(false)} className="rounded-xl">Cancel</Button>
                        <Button
                            onClick={handleAdjust}
                            disabled={isAdjusting}
                            className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl font-bold"
                        >
                            {isAdjusting ? "Processing..." : "Confirm Adjustment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
