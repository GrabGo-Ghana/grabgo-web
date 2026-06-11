"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    Input,
    Button,
    Badge,
} from "@grabgo/ui";
import { Search, Download, Database } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface Transaction {
    id: string;
    reference: string;
    email: string;
    amount: number;
    channel: string;
    status: string;
    createdAt: string;
}

export default function PaystackLogsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(
                    `/admin/finance/paystack?page=${currentPage}&limit=${itemsPerPage}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setTransactions(response.data.data.transactions);
                    setTotalTransactions(response.data.data.total);
                }
            } catch (error) {
                console.error("Failed to fetch paystack logs:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        const timer = setTimeout(() => {
            fetchTransactions();
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [currentPage, itemsPerPage, searchQuery]);

    const handleExport = () => {
        const headers = ["ID", "Reference", "Email", "Amount (GHS)", "Channel", "Status", "Date"];
        const csvContent = [
            headers.join(","),
            ...transactions.map(t => [
                t.id,
                `"${t.reference || 'N/A'}"`,
                t.email,
                t.amount.toFixed(2),
                t.channel,
                t.status,
                format(new Date(t.createdAt), "yyyy-MM-dd HH:mm")
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `paystack_logs_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'paid' || s === 'successful' || s === 'success') {
            return <Badge variant="success">Success</Badge>;
        }
        if (s === 'pending') {
            return <Badge variant="warning">Pending</Badge>;
        }
        return <Badge variant="destructive">{status}</Badge>;
    };

    const totalPages = Math.ceil(totalTransactions / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + transactions.length, totalTransactions);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Paystack Transactions</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Audit raw Paystack online card transactions, Mobile Money logs, and gateway statuses
                </p>
            </div>

            {/* Filters */}
            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search logs by reference, customer email..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-12 h-12 bg-accent/30 border-border/50 focus:bg-background transition-all rounded-xl font-medium w-full"
                        />
                    </div>

                    <Button onClick={handleExport} variant="outline" className="gap-2 border-border/50 h-12 px-5 rounded-xl font-bold transition-all whitespace-nowrap">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
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
                                <th className="text-left p-6 text-sm font-semibold">Customer Email</th>
                                <th className="text-left p-6 text-sm font-semibold">Amount</th>
                                <th className="text-left p-6 text-sm font-semibold">Channel</th>
                                <th className="text-left p-6 text-sm font-semibold">Status</th>
                                <th className="text-left p-6 text-sm font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse">
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className="p-6">
                                                <div className="h-4 bg-muted rounded w-24" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Database className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No transactions found</h3>
                                            <p className="text-muted-foreground text-sm">
                                                No Paystack payments found matching your query.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-6 font-mono text-xs font-bold text-muted-foreground">{t.id.slice(0, 8)}</td>
                                        <td className="p-6 font-bold">{t.reference || 'N/A'}</td>
                                        <td className="p-6 font-bold">{t.email}</td>
                                        <td className="p-6 font-extrabold text-foreground">GH₵ {t.amount.toFixed(2)}</td>
                                        <td className="p-6">
                                            <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded bg-accent font-mono">
                                                {t.channel}
                                            </span>
                                        </td>
                                        <td className="p-6">{getStatusBadge(t.status)}</td>
                                        <td className="p-6 text-sm font-medium text-muted-foreground">
                                            {format(new Date(t.createdAt), "MMM dd, yyyy HH:mm")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {transactions.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1}-{endIndex} of {totalTransactions} transactions
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
