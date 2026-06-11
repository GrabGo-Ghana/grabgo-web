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
import { Search, Bell, Plus, Send } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface NotificationCampaign {
    id: string;
    title: string;
    body: string;
    targetAudience: string;
    recipientCount: number;
    sentBy: string;
    sentAt: string;
    createdAt: string;
}

export default function NotificationsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Send dialog
    const [showSend, setShowSend] = useState(false);
    const [sendTitle, setSendTitle] = useState("");
    const [sendBody, setSendBody] = useState("");
    const [sendAudience, setSendAudience] = useState<string>("all_customers");
    const [estimatedCount, setEstimatedCount] = useState<number | null>(null);
    const [isEstimating, setIsEstimating] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchCampaigns = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(
                    `/admin/notifications?page=${currentPage}&limit=${itemsPerPage}`
                );
                if (isMounted && response.data.success) {
                    setCampaigns(response.data.data.campaigns || []);
                    setTotalCampaigns(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch notification campaigns:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchCampaigns(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, refreshTrigger]);

    const handleEstimateCount = async () => {
        setIsEstimating(true);
        try {
            const response = await apiClient.post("/admin/notifications/estimate-count", {
                targetAudience: sendAudience
            });
            if (response.data.success) {
                setEstimatedCount(response.data.data.recipientCount);
            }
        } catch (error) {
            console.error("Estimate failed:", error);
        } finally {
            setIsEstimating(false);
        }
    };

    const handlePreviewSend = () => {
        if (!sendTitle || !sendBody) {
            setSendError("Title and body are required");
            return;
        }
        setSendError("");
        setShowConfirm(true);
    };

    const handleConfirmSend = async () => {
        setIsSending(true);
        setSendError("");
        try {
            const response = await apiClient.post("/admin/notifications/send", {
                targetAudience: sendAudience,
                title: sendTitle,
                body: sendBody,
                reason: "Admin notification campaign"
            });
            if (response.data.success) {
                setShowSend(false);
                setShowConfirm(false);
                resetSendForm();
                setRefreshTrigger(r => r + 1);
            } else {
                setSendError(response.data.message || "Failed to send notification");
            }
        } catch (error: any) {
            setSendError(error?.response?.data?.message || "Failed to send notification");
        } finally {
            setIsSending(false);
        }
    };

    const resetSendForm = () => {
        setSendTitle("");
        setSendBody("");
        setSendAudience("all_customers");
        setEstimatedCount(null);
        setSendError("");
    };

    const getAudienceLabel = (audience: string) => {
        const labels: Record<string, string> = {
            all_customers: "All Customers",
            all_vendors: "All Vendors",
            all_riders: "All Riders",
            all_users: "All Users",
            active_customers: "Active Customers",
            inactive_customers: "Inactive Customers",
        };
        return labels[audience] || audience;
    };

    const totalPages = Math.ceil(totalCampaigns / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Send push notifications and manage campaign history
                    </p>
                </div>
                <Button
                    onClick={() => setShowSend(true)}
                    className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl h-12 px-6 font-bold active:scale-95 transition-all"
                >
                    <Send className="w-5 h-5 mr-2" />
                    New Campaign
                </Button>
            </div>

            <Card className="overflow-hidden border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-5 text-sm font-semibold">Title</th>
                                <th className="text-left p-5 text-sm font-semibold">Body</th>
                                <th className="text-left p-5 text-sm font-semibold">Audience</th>
                                <th className="text-left p-5 text-sm font-semibold">Recipients</th>
                                <th className="text-left p-5 text-sm font-semibold">Sent By</th>
                                <th className="text-left p-5 text-sm font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`sk-${i}`} className="animate-pulse">
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="p-5"><div className="h-4 bg-muted rounded w-24" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Bell className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No campaigns yet</h3>
                                            <p className="text-muted-foreground text-sm">Send your first notification campaign to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                campaigns.map((c) => (
                                    <tr key={c.id} className="hover:bg-accent/40 transition-all">
                                        <td className="p-5 font-bold max-w-[200px] truncate">{c.title}</td>
                                        <td className="p-5 text-sm text-muted-foreground max-w-xs truncate">{c.body}</td>
                                        <td className="p-5">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-[#FE6132]/10 text-[#FE6132]">
                                                {getAudienceLabel(c.targetAudience)}
                                            </span>
                                        </td>
                                        <td className="p-5 font-extrabold">{(c.recipientCount || 0).toLocaleString()}</td>
                                        <td className="p-5 font-medium">{c.sentBy || "Admin"}</td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(c.sentAt || c.createdAt), "MMM dd, yyyy HH:mm")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {campaigns.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCampaigns)} of {totalCampaigns}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="border-border/50">Previous</Button>
                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="border-border/50">Next</Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Send Notification Dialog */}
            <Dialog open={showSend} onOpenChange={(open) => { if (!open) { setShowSend(false); resetSendForm(); } }}>
                <DialogContent className="rounded-2xl border-border/50 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">New Notification Campaign</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {sendError && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium">
                                {sendError}
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-bold mb-2 block">Target Audience</label>
                            <div className="flex gap-2">
                                <Select value={sendAudience} onValueChange={(v) => { setSendAudience(v); setEstimatedCount(null); }}>
                                    <SelectTrigger className="h-12 rounded-xl border-border/50 flex-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/50">
                                        <SelectItem value="all_customers">All Customers</SelectItem>
                                        <SelectItem value="all_vendors">All Vendors</SelectItem>
                                        <SelectItem value="all_riders">All Riders</SelectItem>
                                        <SelectItem value="all_users">All Users</SelectItem>
                                        <SelectItem value="active_customers">Active Customers</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    onClick={handleEstimateCount}
                                    disabled={isEstimating}
                                    className="rounded-xl border-border/50 font-bold whitespace-nowrap"
                                >
                                    {isEstimating ? "..." : "Estimate"}
                                </Button>
                            </div>
                            {estimatedCount !== null && (
                                <p className="text-sm mt-2 text-[#FE6132] font-bold">
                                    Estimated recipients: {estimatedCount.toLocaleString()}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Title *</label>
                            <Input
                                placeholder="e.g., Weekend Special Offer!"
                                value={sendTitle}
                                onChange={(e) => setSendTitle(e.target.value)}
                                className="h-12 rounded-xl border-border/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold mb-2 block">Message Body *</label>
                            <textarea
                                placeholder="Write your notification message..."
                                value={sendBody}
                                onChange={(e) => setSendBody(e.target.value)}
                                className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#FE6132]/30 resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowSend(false); resetSendForm(); }} className="rounded-xl">Cancel</Button>
                        <Button
                            onClick={handlePreviewSend}
                            className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl font-bold"
                        >
                            Preview & Send
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Send Dialog */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="rounded-2xl border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Confirm Send</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-4 rounded-xl bg-accent/50 space-y-2">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preview</p>
                            <p className="font-bold text-lg">{sendTitle}</p>
                            <p className="text-sm text-muted-foreground">{sendBody}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-500/10 border border-[#FE6132]/20">
                            <p className="text-sm font-bold text-[#FE6132]">
                                This notification will be sent to <span className="font-black">{getAudienceLabel(sendAudience)}</span>
                                {estimatedCount !== null && <> (~{estimatedCount.toLocaleString()} recipients)</>}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirm(false)} className="rounded-xl">Go Back</Button>
                        <Button
                            onClick={handleConfirmSend}
                            disabled={isSending}
                            className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl font-bold"
                        >
                            {isSending ? "Sending..." : "Confirm & Send"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
