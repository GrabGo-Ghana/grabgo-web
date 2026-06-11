"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Search, Filter, Download, CreditCard } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface Payment {
    id: string;
    reference: string;
    customerName: string;
    vendorName: string;
    amount: number;
    gateway: string;
    status: string;
    createdAt: string;
}

export default function PaymentsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [totalPayments, setTotalPayments] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchPayments = async () => {
            setIsLoading(true);
            try {
                const statusParam = statusFilter === "all" ? "" : statusFilter;
                const response = await apiClient.get(
                    `/admin/finance/payments?page=${currentPage}&limit=${itemsPerPage}&status=${statusParam}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setPayments(response.data.data.payments);
                    setTotalPayments(response.data.data.total);
                }
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        const timer = setTimeout(() => {
            fetchPayments();
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [currentPage, itemsPerPage, statusFilter, searchQuery]);

    const handleExport = () => {
        const headers = ["ID", "Reference", "Customer", "Vendor", "Amount (GHS)", "Gateway", "Status", "Date"];
        const csvContent = [
            headers.join(","),
            ...payments.map(p => [
                p.id,
                `"${p.reference || 'N/A'}"`,
                `"${p.customerName}"`,
                `"${p.vendorName}"`,
                p.amount.toFixed(2),
                p.gateway,
                p.status,
                format(new Date(p.createdAt), "yyyy-MM-dd HH:mm")
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `payments_ledger_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'paid' || s === 'successful' || s === 'completed') {
            return <Badge variant="success">Paid</Badge>;
        }
        if (s === 'pending' || s === 'processing') {
            return <Badge variant="warning">Pending</Badge>;
        }
        if (s === 'refunded') {
            return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-transparent">Refunded</Badge>;
        }
        return <Badge variant="destructive">{status}</Badge>;
    };

    const totalPages = Math.ceil(totalPayments / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + payments.length, totalPayments);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Payments Ledger</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Monitor transaction flows, gateway reference codes, customer billing, and payout sources
                </p>
            </div>

            {/* Filters */}
            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search payments by reference or customer name..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-12 h-12 bg-accent/30 border-border/50 focus:bg-background transition-all rounded-xl font-medium w-full"
                        />
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setStatusFilter(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-40 h-12 border-border/50 rounded-xl bg-background font-bold">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50">
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button onClick={handleExport} variant="outline" className="gap-2 border-border/50 h-12 px-5 rounded-xl font-bold transition-all whitespace-nowrap">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-6 text-sm font-semibold">Payment ID</th>
                                <th className="text-left p-6 text-sm font-semibold">Reference</th>
                                <th className="text-left p-6 text-sm font-semibold">Customer</th>
                                <th className="text-left p-6 text-sm font-semibold">Vendor</th>
                                <th className="text-left p-6 text-sm font-semibold">Amount</th>
                                <th className="text-left p-6 text-sm font-semibold">Gateway</th>
                                <th className="text-left p-6 text-sm font-semibold">Status</th>
                                <th className="text-left p-6 text-sm font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse">
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <td key={j} className="p-6">
                                                <div className="h-4 bg-muted rounded w-24" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <CreditCard className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No payments found</h3>
                                            <p className="text-muted-foreground text-sm">
                                                No payments match your current query or filters.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payments.map((p) => (
                                    <tr key={p.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-6 font-mono text-xs font-bold text-muted-foreground">{p.id.slice(0, 8)}</td>
                                        <td className="p-6 font-bold">{p.reference || 'N/A'}</td>
                                        <td className="p-6 font-bold">{p.customerName}</td>
                                        <td className="p-6 font-medium">{p.vendorName}</td>
                                        <td className="p-6 font-extrabold text-foreground">GH₵ {p.amount.toFixed(2)}</td>
                                        <td className="p-6">
                                            <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded bg-accent font-mono">
                                                {p.gateway}
                                            </span>
                                        </td>
                                        <td className="p-6">{getStatusBadge(p.status)}</td>
                                        <td className="p-6 text-sm font-medium text-muted-foreground">
                                            {format(new Date(p.createdAt), "MMM dd, yyyy HH:mm")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {payments.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1}-{endIndex} of {totalPayments} payments
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="border-border/50"
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="border-border/50"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
