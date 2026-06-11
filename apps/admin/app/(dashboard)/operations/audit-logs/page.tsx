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
import { Search, Download, Database } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface AuditLog {
    id: string;
    adminName: string;
    adminEmail: string;
    action: string;
    targetType: string;
    targetId: string;
    reason: string;
    ipAddress: string;
    createdAt: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
    UPDATE_USER_STATUS: { label: "User Status", color: "bg-blue-500/10 text-blue-600" },
    UPDATE_VENDOR_STATUS: { label: "Vendor Status", color: "bg-green-500/10 text-green-600" },
    UPDATE_RIDER_STATUS: { label: "Rider Status", color: "bg-purple-500/10 text-purple-600" },
    UPDATE_ORDER_STATUS: { label: "Order Status", color: "bg-orange-500/10 text-orange-600" },
    ASSIGN_RIDER: { label: "Assign Rider", color: "bg-cyan-500/10 text-cyan-600" },
    INITIATE_REFUND: { label: "Refund", color: "bg-red-500/10 text-red-600" },
    PROCESS_REFUND: { label: "Process Refund", color: "bg-red-500/10 text-red-600" },
    GRANT_CREDITS: { label: "Grant Credits", color: "bg-green-500/10 text-green-600" },
    DEDUCT_CREDITS: { label: "Deduct Credits", color: "bg-red-500/10 text-red-600" },
    APPROVE_VENDOR_PAYOUT: { label: "Vendor Payout", color: "bg-green-500/10 text-green-600" },
    APPROVE_RIDER_PAYOUT: { label: "Rider Payout", color: "bg-green-500/10 text-green-600" },
    RECONCILE_COD_COLLECTION: { label: "COD Reconcile", color: "bg-yellow-500/10 text-yellow-600" },
    CREATE_PROMOTION: { label: "Create Promo", color: "bg-purple-500/10 text-purple-600" },
    RESOLVE_DISPUTE_CLAIM: { label: "Resolve Dispute", color: "bg-blue-500/10 text-blue-600" },
    UPDATE_PLATFORM_SETTINGS: { label: "Settings Update", color: "bg-orange-500/10 text-orange-600" },
    SEND_NOTIFICATION_CAMPAIGN: { label: "Send Notification", color: "bg-blue-500/10 text-blue-600" },
    SEND_SINGLE_NOTIFICATION: { label: "Single Notification", color: "bg-blue-500/10 text-blue-600" },
};

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(50);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [totalLogs, setTotalLogs] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const actionParam = actionFilter === "all" ? "" : actionFilter;
                const response = await apiClient.get(
                    `/admin/audit-logs?page=${currentPage}&limit=${itemsPerPage}&q=${searchQuery}&action=${actionParam}`
                );
                if (isMounted && response.data.success) {
                    setLogs(response.data.data.logs || []);
                    setTotalLogs(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchLogs(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, searchQuery, actionFilter]);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await apiClient.get("/admin/audit-logs/export", {
                responseType: "blob"
            });
            const url = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `audit_logs_export_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const getActionBadge = (action: string) => {
        const meta = ACTION_LABELS[action];
        if (meta) {
            return (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${meta.color}`}>
                    {meta.label}
                </span>
            );
        }
        return (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-accent text-muted-foreground">
                {action.replace(/_/g, " ")}
            </span>
        );
    };

    const totalPages = Math.ceil(totalLogs / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Read-only timeline of all administrative actions and system changes
                    </p>
                </div>
                <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    variant="outline"
                    className="gap-2 border-border/50 h-12 px-6 rounded-xl font-bold transition-all"
                >
                    <Download className="w-4 h-4" />
                    {isExporting ? "Exporting..." : "Export Full Logs"}
                </Button>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by admin name, email, or target ID..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="pl-12 h-12 bg-accent/30 border-border/50 focus:bg-background transition-all rounded-xl font-medium w-full"
                        />
                    </div>
                    <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-48 h-12 border-border/50 rounded-xl bg-background font-bold">
                            <SelectValue placeholder="Action Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="UPDATE_USER_STATUS">User Status</SelectItem>
                            <SelectItem value="UPDATE_VENDOR_STATUS">Vendor Status</SelectItem>
                            <SelectItem value="UPDATE_RIDER_STATUS">Rider Status</SelectItem>
                            <SelectItem value="UPDATE_ORDER_STATUS">Order Status</SelectItem>
                            <SelectItem value="INITIATE_REFUND">Refunds</SelectItem>
                            <SelectItem value="GRANT_CREDITS">Grant Credits</SelectItem>
                            <SelectItem value="APPROVE_VENDOR_PAYOUT">Vendor Payouts</SelectItem>
                            <SelectItem value="APPROVE_RIDER_PAYOUT">Rider Payouts</SelectItem>
                            <SelectItem value="UPDATE_PLATFORM_SETTINGS">Settings</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <Card className="overflow-hidden border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-5 text-sm font-semibold">Timestamp</th>
                                <th className="text-left p-5 text-sm font-semibold">Admin</th>
                                <th className="text-left p-5 text-sm font-semibold">Action</th>
                                <th className="text-left p-5 text-sm font-semibold">Target</th>
                                <th className="text-left p-5 text-sm font-semibold">Reason</th>
                                <th className="text-left p-5 text-sm font-semibold">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={`sk-${i}`} className="animate-pulse">
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="p-5"><div className="h-4 bg-muted rounded w-24" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Database className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No audit logs found</h3>
                                            <p className="text-muted-foreground text-sm">No administrative actions match your query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log, index) => (
                                    <tr key={log.id} className="hover:bg-accent/40 transition-all animate-fade-in-up" style={{ animationDelay: `${index * 20}ms` }}>
                                        <td className="p-5">
                                            <div>
                                                <div className="font-bold text-sm">
                                                    {format(new Date(log.createdAt), "MMM dd, yyyy")}
                                                </div>
                                                <div className="text-xs text-muted-foreground font-mono">
                                                    {format(new Date(log.createdAt), "HH:mm:ss")}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div>
                                                <div className="font-bold text-sm">{log.adminName}</div>
                                                <div className="text-xs text-muted-foreground">{log.adminEmail}</div>
                                            </div>
                                        </td>
                                        <td className="p-5">{getActionBadge(log.action)}</td>
                                        <td className="p-5">
                                            <div>
                                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{log.targetType}</div>
                                                <div className="font-mono text-xs text-foreground">{log.targetId?.slice(0, 12)}</div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-muted-foreground max-w-xs truncate">{log.reason || "—"}</td>
                                        <td className="p-5 font-mono text-xs text-muted-foreground">{log.ipAddress || "—"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {logs.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalLogs)} of {totalLogs}
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
