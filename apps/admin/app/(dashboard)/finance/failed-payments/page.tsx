"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Input,
    Button,
    Badge,
} from "@grabgo/ui";
import { Search, Download, CreditCard } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface FailedPayment {
    id: string;
    reference: string;
    customerName: string;
    amount: number;
    gateway: string;
    errorMessage: string;
    createdAt: string;
}

export default function FailedPaymentsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [records, setRecords] = useState<FailedPayment[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchFailedPayments = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(
                    `/admin/finance/failed-payments?page=${currentPage}&limit=${itemsPerPage}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setRecords(response.data.data.payments || []);
                    setTotalRecords(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch failed payments:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchFailedPayments(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, searchQuery]);

    const handleExport = () => {
        const headers = ["ID", "Reference", "Customer", "Amount (GHS)", "Gateway", "Error", "Date"];
        const csvContent = [
            headers.join(","),
            ...records.map(r => [
                r.id.slice(0, 8),
                `"${r.reference || 'N/A'}"`,
                `"${r.customerName}"`,
                r.amount.toFixed(2),
                r.gateway,
                `"${(r.errorMessage || '').replace(/"/g, '""')}"`,
                format(new Date(r.createdAt), "yyyy-MM-dd HH:mm")
            ].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `failed_payments_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Failed Payments</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Monitor checkout failures, declined cards, and gateway error logs
                </p>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by reference or customer name..."
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
                                <th className="text-left p-5 text-sm font-semibold">ID</th>
                                <th className="text-left p-5 text-sm font-semibold">Reference</th>
                                <th className="text-left p-5 text-sm font-semibold">Customer</th>
                                <th className="text-left p-5 text-sm font-semibold">Amount</th>
                                <th className="text-left p-5 text-sm font-semibold">Gateway</th>
                                <th className="text-left p-5 text-sm font-semibold">Error</th>
                                <th className="text-left p-5 text-sm font-semibold">Date</th>
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
                                            <CreditCard className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No failed payments</h3>
                                            <p className="text-muted-foreground text-sm">No failed payment sessions found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                records.map((r) => (
                                    <tr key={r.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5 font-mono text-xs font-bold text-muted-foreground">{r.id.slice(0, 8)}</td>
                                        <td className="p-5 font-bold">{r.reference || "N/A"}</td>
                                        <td className="p-5 font-medium">{r.customerName}</td>
                                        <td className="p-5 font-extrabold text-red-600">GH₵ {r.amount.toFixed(2)}</td>
                                        <td className="p-5">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-accent font-mono">
                                                {r.gateway}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-red-500 max-w-xs truncate font-medium">{r.errorMessage || "Unknown error"}</td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(r.createdAt), "MMM dd, yyyy HH:mm")}
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
        </div>
    );
}
