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

interface Referral {
    id: string;
    referrerId: string;
    referrerName: string;
    referredId: string;
    referredName: string;
    status: string;
    rewardAmount: number;
    rewardType: string;
    createdAt: string;
}

export default function ReferralsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [totalReferrals, setTotalReferrals] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchReferrals = async () => {
            setIsLoading(true);
            try {
                const statusParam = statusFilter === "all" ? "" : statusFilter;
                const response = await apiClient.get(
                    `/admin/operations/referrals?page=${currentPage}&limit=${itemsPerPage}&status=${statusParam}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setReferrals(response.data.data.referrals || []);
                    setTotalReferrals(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch referrals:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchReferrals(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, statusFilter, searchQuery]);

    const getStatusBadge = (status: string) => {
        if (status === "completed" || status === "rewarded") return <Badge variant="success">Rewarded</Badge>;
        if (status === "pending") return <Badge variant="warning">Pending</Badge>;
        if (status === "expired") return <Badge variant="destructive">Expired</Badge>;
        return <Badge variant="outline">{status}</Badge>;
    };

    const handleExport = () => {
        const headers = ["ID", "Referrer", "Referred", "Status", "Reward Amount", "Reward Type", "Date"];
        const csvContent = [
            headers.join(","),
            ...referrals.map(r => [
                r.id.slice(0, 8),
                `"${r.referrerName}"`,
                `"${r.referredName}"`,
                r.status,
                r.rewardAmount?.toFixed(2) || '0',
                r.rewardType || 'credits',
                format(new Date(r.createdAt), "yyyy-MM-dd HH:mm")
            ].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `referrals_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalPages = Math.ceil(totalReferrals / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Referrals</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Track referral conversions, reward distribution, and invitation performance
                </p>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by referrer or referred user name..."
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
                                <SelectItem value="completed">Rewarded</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
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
                                <th className="text-left p-5 text-sm font-semibold">ID</th>
                                <th className="text-left p-5 text-sm font-semibold">Referrer</th>
                                <th className="text-left p-5 text-sm font-semibold">Referred User</th>
                                <th className="text-left p-5 text-sm font-semibold">Status</th>
                                <th className="text-left p-5 text-sm font-semibold">Reward</th>
                                <th className="text-left p-5 text-sm font-semibold">Type</th>
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
                            ) : referrals.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Group className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No referrals found</h3>
                                            <p className="text-muted-foreground text-sm">No referral records match your query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                referrals.map((r) => (
                                    <tr key={r.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5 font-mono text-xs font-bold text-muted-foreground">{r.id.slice(0, 8)}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 flex items-center justify-center text-white font-bold text-xs">
                                                    {r.referrerName?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold">{r.referrerName}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold text-xs">
                                                    {r.referredName?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium">{r.referredName}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">{getStatusBadge(r.status)}</td>
                                        <td className="p-5 font-extrabold text-green-600">
                                            +GH₵ {(r.rewardAmount || 0).toFixed(2)}
                                        </td>
                                        <td className="p-5">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-accent">
                                                {r.rewardType || "credits"}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(r.createdAt), "MMM dd, yyyy")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {referrals.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalReferrals)} of {totalReferrals}
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
