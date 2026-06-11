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
import { Search, Download, ShieldCheck } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface FraudCase {
    id: string;
    userId: string;
    username: string;
    type: string;
    severity: string;
    status: string;
    description: string;
    createdAt: string;
}

export default function FraudCasesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [severityFilter, setSeverityFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [cases, setCases] = useState<FraudCase[]>([]);
    const [totalCases, setTotalCases] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchFraud = async () => {
            setIsLoading(true);
            try {
                const statusParam = statusFilter === "all" ? "" : statusFilter;
                const severityParam = severityFilter === "all" ? "" : severityFilter;
                const response = await apiClient.get(
                    `/admin/operations/fraud?page=${currentPage}&limit=${itemsPerPage}&status=${statusParam}&severity=${severityParam}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setCases(response.data.data.cases || []);
                    setTotalCases(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch fraud cases:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchFraud(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, statusFilter, severityFilter, searchQuery]);

    const getSeverityBadge = (severity: string) => {
        if (severity === "critical") return <Badge variant="destructive" className="font-black">Critical</Badge>;
        if (severity === "high") return <Badge variant="destructive" className="bg-orange-600">High</Badge>;
        if (severity === "medium") return <Badge variant="warning">Medium</Badge>;
        return <Badge variant="outline">Low</Badge>;
    };

    const getStatusBadge = (status: string) => {
        if (status === "resolved") return <Badge variant="success">Resolved</Badge>;
        if (status === "investigating") return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-transparent">Investigating</Badge>;
        if (status === "open") return <Badge variant="warning">Open</Badge>;
        return <Badge variant="outline">{status}</Badge>;
    };

    const totalPages = Math.ceil(totalCases / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Fraud Cases</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Monitor suspicious activity, investigate anomalies, and manage fraud incidents
                </p>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by user or case description..."
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
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="investigating">Investigating</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-40 h-12 border-border/50 rounded-xl bg-background font-bold">
                                <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50">
                                <SelectItem value="all">All Severity</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-5 text-sm font-semibold">Case ID</th>
                                <th className="text-left p-5 text-sm font-semibold">User</th>
                                <th className="text-left p-5 text-sm font-semibold">Type</th>
                                <th className="text-left p-5 text-sm font-semibold">Severity</th>
                                <th className="text-left p-5 text-sm font-semibold">Status</th>
                                <th className="text-left p-5 text-sm font-semibold">Description</th>
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
                            ) : cases.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <ShieldCheck className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No fraud cases found</h3>
                                            <p className="text-muted-foreground text-sm">No fraud incidents match your current filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                cases.map((c) => (
                                    <tr key={c.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5 font-mono text-xs font-bold text-muted-foreground">{c.id.slice(0, 8)}</td>
                                        <td className="p-5">
                                            <div>
                                                <div className="font-bold">{c.username}</div>
                                                <div className="text-xs text-muted-foreground font-mono">{c.userId?.slice(0, 12)}</div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-red-500/10 text-red-600">
                                                {c.type}
                                            </span>
                                        </td>
                                        <td className="p-5">{getSeverityBadge(c.severity)}</td>
                                        <td className="p-5">{getStatusBadge(c.status)}</td>
                                        <td className="p-5 text-sm text-muted-foreground max-w-xs truncate">{c.description}</td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(c.createdAt), "MMM dd, yyyy HH:mm")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {cases.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCases)} of {totalCases}
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
