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
import { Search, Gift, Plus, Download } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface Promotion {
    id: string;
    code: string;
    promoType: string;
    value: number;
    description: string;
    maxUses: number;
    currentUses: number;
    minOrderAmount: number;
    expiry: string;
    isActive: boolean;
    createdAt: string;
}

export default function PromotionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [totalPromotions, setTotalPromotions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Create dialog
    const [showCreate, setShowCreate] = useState(false);
    const [newCode, setNewCode] = useState("");
    const [newType, setNewType] = useState<string>("percentage");
    const [newValue, setNewValue] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newMaxUses, setNewMaxUses] = useState("");
    const [newMinOrder, setNewMinOrder] = useState("");
    const [newExpiry, setNewExpiry] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    useEffect(() => {
        let isMounted = true;
        const fetchPromotions = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(
                    `/admin/operations/promotions?page=${currentPage}&limit=${itemsPerPage}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setPromotions(response.data.data.promotions || []);
                    setTotalPromotions(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch promotions:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchPromotions(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, searchQuery, refreshTrigger]);

    const handleCreate = async () => {
        if (!newCode || !newValue) {
            setCreateError("Code and value are required");
            return;
        }
        setIsCreating(true);
        setCreateError("");
        try {
            const response = await apiClient.post("/admin/operations/promotions", {
                code: newCode.toUpperCase(),
                promoType: newType,
                value: Number(newValue),
                description: newDescription,
                maxUses: newMaxUses ? Number(newMaxUses) : null,
                minOrderAmount: newMinOrder ? Number(newMinOrder) : 0,
                expiry: newExpiry || null,
                reason: "Created promotion code"
            });
            if (response.data.success) {
                setShowCreate(false);
                resetForm();
                setRefreshTrigger(r => r + 1);
            } else {
                setCreateError(response.data.message || "Failed to create promotion");
            }
        } catch (error: any) {
            setCreateError(error?.response?.data?.message || "Failed to create promotion");
        } finally {
            setIsCreating(false);
        }
    };

    const resetForm = () => {
        setNewCode("");
        setNewType("percentage");
        setNewValue("");
        setNewDescription("");
        setNewMaxUses("");
        setNewMinOrder("");
        setNewExpiry("");
        setCreateError("");
    };

    const handleExport = () => {
        const headers = ["Code", "Type", "Value", "Description", "Max Uses", "Used", "Min Order", "Expiry", "Active", "Created"];
        const csvContent = [
            headers.join(","),
            ...promotions.map(p => [
                p.code,
                p.promoType,
                p.value,
                `"${(p.description || '').replace(/"/g, '""')}"`,
                p.maxUses || 'Unlimited',
                p.currentUses || 0,
                p.minOrderAmount || 0,
                p.expiry ? format(new Date(p.expiry), "yyyy-MM-dd") : 'Never',
                p.isActive ? 'Yes' : 'No',
                format(new Date(p.createdAt), "yyyy-MM-dd")
            ].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `promotions_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalPages = Math.ceil(totalPromotions / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Promotions</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Create and manage promotional codes, discounts, and special offers
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreate(true)}
                    className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl h-12 px-6 font-bold active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Promo
                </Button>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by promo code or description..."
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
                                <th className="text-left p-5 text-sm font-semibold">Code</th>
                                <th className="text-left p-5 text-sm font-semibold">Type</th>
                                <th className="text-left p-5 text-sm font-semibold">Value</th>
                                <th className="text-left p-5 text-sm font-semibold">Description</th>
                                <th className="text-left p-5 text-sm font-semibold">Usage</th>
                                <th className="text-left p-5 text-sm font-semibold">Min Order</th>
                                <th className="text-left p-5 text-sm font-semibold">Expiry</th>
                                <th className="text-left p-5 text-sm font-semibold">Status</th>
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
                            ) : promotions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Gift className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No promotions found</h3>
                                            <p className="text-muted-foreground text-sm">Create your first promo code to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                promotions.map((p) => (
                                    <tr key={p.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5">
                                            <span className="font-black text-[#FE6132] bg-[#FE6132]/10 px-3 py-1 rounded-lg font-mono text-sm tracking-wider">
                                                {p.code}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-accent">
                                                {p.promoType}
                                            </span>
                                        </td>
                                        <td className="p-5 font-extrabold">
                                            {p.promoType === "percentage" ? `${p.value}%` : `GH₵ ${p.value.toFixed(2)}`}
                                        </td>
                                        <td className="p-5 text-sm text-muted-foreground max-w-xs truncate">{p.description || "—"}</td>
                                        <td className="p-5 font-bold">
                                            {p.currentUses || 0} / {p.maxUses || "∞"}
                                        </td>
                                        <td className="p-5 font-medium">
                                            {p.minOrderAmount ? `GH₵ ${p.minOrderAmount.toFixed(2)}` : "None"}
                                        </td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {p.expiry ? format(new Date(p.expiry), "MMM dd, yyyy") : "Never"}
                                        </td>
                                        <td className="p-5">
                                            {p.isActive !== false ? (
                                                <Badge variant="success">Active</Badge>
                                            ) : (
                                                <Badge variant="destructive">Expired</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {promotions.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalPromotions)} of {totalPromotions}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="border-border/50">Previous</Button>
                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="border-border/50">Next</Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Create Promotion Dialog */}
            <Dialog open={showCreate} onOpenChange={(open) => { if (!open) { setShowCreate(false); resetForm(); } }}>
                <DialogContent className="rounded-2xl border-border/50 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Create Promotion</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {createError && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium">
                                {createError}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold mb-2 block">Promo Code *</label>
                                <Input
                                    placeholder="e.g., SAVE20"
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                    className="h-12 rounded-xl border-border/50 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold mb-2 block">Type</label>
                                <Select value={newType} onValueChange={setNewType}>
                                    <SelectTrigger className="h-12 rounded-xl border-border/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/50">
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount (GH₵)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold mb-2 block">Value *</label>
                                <Input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder={newType === "percentage" ? "e.g., 20" : "e.g., 10.00"}
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    className="h-12 rounded-xl border-border/50"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold mb-2 block">Max Uses</label>
                                <Input
                                    type="number"
                                    min="1"
                                    placeholder="Unlimited"
                                    value={newMaxUses}
                                    onChange={(e) => setNewMaxUses(e.target.value)}
                                    className="h-12 rounded-xl border-border/50"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Description</label>
                            <Input
                                placeholder="e.g., 20% off your next order"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="h-12 rounded-xl border-border/50"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold mb-2 block">Min Order (GH₵)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={newMinOrder}
                                    onChange={(e) => setNewMinOrder(e.target.value)}
                                    className="h-12 rounded-xl border-border/50"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold mb-2 block">Expiry Date</label>
                                <Input
                                    type="date"
                                    value={newExpiry}
                                    onChange={(e) => setNewExpiry(e.target.value)}
                                    className="h-12 rounded-xl border-border/50"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }} className="rounded-xl">Cancel</Button>
                        <Button
                            onClick={handleCreate}
                            disabled={isCreating}
                            className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl font-bold"
                        >
                            {isCreating ? "Creating..." : "Create Promotion"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
