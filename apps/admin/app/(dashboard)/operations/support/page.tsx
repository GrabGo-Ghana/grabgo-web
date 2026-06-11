"use client";

import { useState, useEffect, useRef } from "react";
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
} from "@grabgo/ui";
import { Search, MessageText } from "iconoir-react";
import { Send, Headset, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";
import { io, Socket } from "socket.io-client";

interface SupportTicket {
    id: string;
    ticketNumber: string;
    userName: string;
    userEmail: string;
    customerId: string;
    adminId?: string | null;
    subject: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
}

interface ChatMessage {
    id: string;
    senderId: string;
    senderName?: string;
    text: string;
    messageType: string;
    createdAt: string;
    sentAt?: string;
}

export default function SupportTicketsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [totalTickets, setTotalTickets] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Current Admin User
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Chat Drawer/Dialog
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Socket Ref
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Load logged in admin user
        const userStr = localStorage.getItem("grabgo_admin_user");
        if (userStr) {
            try {
                setCurrentUser(JSON.parse(userStr));
            } catch (e) {
                console.error("Failed to parse currentUser from localStorage", e);
            }
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                const statusParam = statusFilter === "all" ? "" : statusFilter;
                const response = await apiClient.get(
                    `/admin/operations/support?page=${currentPage}&limit=${itemsPerPage}&status=${statusParam}&q=${searchQuery}`
                );
                if (isMounted && response.data.success) {
                    setTickets(response.data.data.tickets || []);
                    setTotalTickets(response.data.data.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch support tickets:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchTickets(), 300);
        return () => { isMounted = false; clearTimeout(timer); };
    }, [currentPage, itemsPerPage, statusFilter, searchQuery, refreshTrigger]);

    // Handle ticket detail / chat drawer open
    const handleOpenChat = async (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
        setMessages([]);
        setNewMessage("");

        // 1. Fetch message history
        try {
            const response = await apiClient.get(`/chats/${ticket.id}/messages`);
            if (response.data && response.data.messages) {
                setMessages(response.data.messages);
            } else if (response.data && response.data.data && response.data.data.messages) {
                setMessages(response.data.data.messages);
            }
        } catch (e) {
            console.error("Failed to load message history:", e);
        }

        // 2. Setup Socket.IO connection
        const token = localStorage.getItem("grabgo_admin_token");
        const socketUrl = process.env.NEXT_PUBLIC_API_URL 
          ? new URL(process.env.NEXT_PUBLIC_API_URL).origin 
          : "http://localhost:5000";

        const socket = io(socketUrl, {
            auth: { token },
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to support socket:", socket.id);
            socket.emit("chat:join", { chatId: ticket.id });
        });

        // Listen for new messages
        socket.on("chat:new_message", (payload: { chatId: string; message: any }) => {
            if (payload.chatId === ticket.id) {
                setMessages(prev => {
                    // Prevent duplicates
                    if (prev.some(m => m.id === payload.message.id)) return prev;
                    return [...prev, payload.message];
                });
            }
        });

        // Listen for assignment events in real-time
        socket.on("case:assigned", (payload: { chatId: string; adminId: string | null }) => {
            if (payload.chatId === ticket.id) {
                setSelectedTicket(prev => prev ? { ...prev, adminId: payload.adminId } : null);
                setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, adminId: payload.adminId } : t));
            }
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });
    };

    // Close chat and disconnect socket
    const handleCloseChat = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setSelectedTicket(null);
        setMessages([]);
        setNewMessage("");
    };

    // Auto-scroll chat messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Send chat message
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket || isSending) return;
        setIsSending(true);

        const textToSend = newMessage.trim();
        setNewMessage("");

        try {
            const response = await apiClient.post(`/chats/${selectedTicket.id}/messages`, {
                text: textToSend,
                messageType: "text",
            });
            // Hydrate local messages state if not instantly updated by socket
            if (response.data && response.data.success && response.data.data) {
                const newMsg = response.data.data;
                setMessages(prev => {
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
            }
        } catch (e) {
            console.error("Failed to send message:", e);
        } finally {
            setIsSending(false);
        }
    };

    // Toggle assignment
    const handleToggleAssign = async () => {
        if (!selectedTicket) return;
        try {
            const response = await apiClient.patch(`/chats/cases/${selectedTicket.id}/assign`);
            if (response.data.success) {
                const assignedAdminId = response.data.data.adminId;
                setSelectedTicket(prev => prev ? { ...prev, adminId: assignedAdminId } : null);
                setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, adminId: assignedAdminId } : t));
                setRefreshTrigger(r => r + 1);
            }
        } catch (e) {
            console.error("Failed to toggle assignment:", e);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === "resolved" || status === "closed") return <Badge variant="success">Resolved</Badge>;
        if (status === "open") return <Badge variant="warning">Open</Badge>;
        if (status === "in_progress") return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-transparent">In Progress</Badge>;
        return <Badge variant="outline">{status}</Badge>;
    };

    const getPriorityBadge = (priority: string) => {
        if (priority === "urgent" || priority === "critical") return <Badge variant="destructive" className="font-black">Urgent</Badge>;
        if (priority === "high") return <Badge variant="destructive" className="bg-orange-600">High</Badge>;
        if (priority === "medium") return <Badge variant="warning">Medium</Badge>;
        return <Badge variant="outline">Low</Badge>;
    };

    const totalPages = Math.ceil(totalTickets / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Support Tickets</h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    View, assign, and respond to customer support tickets and service inquiries in real-time
                </p>
            </div>

            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Search by ticket number, user, or subject..."
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
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <Card className="overflow-hidden border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-5 text-sm font-semibold">Ticket #</th>
                                <th className="text-left p-5 text-sm font-semibold">User</th>
                                <th className="text-left p-5 text-sm font-semibold">Subject</th>
                                <th className="text-left p-5 text-sm font-semibold">Category</th>
                                <th className="text-left p-5 text-sm font-semibold">Priority</th>
                                <th className="text-left p-5 text-sm font-semibold">Status</th>
                                <th className="text-left p-5 text-sm font-semibold">Assignee</th>
                                <th className="text-left p-5 text-sm font-semibold">Created</th>
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
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <MessageText className="w-10 h-10 text-muted-foreground opacity-20" />
                                            <h3 className="text-lg font-semibold">No support tickets</h3>
                                            <p className="text-muted-foreground text-sm">No tickets match your current query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((t) => (
                                    <tr key={t.id} className="hover:bg-accent/40 transition-all cursor-pointer" onClick={() => handleOpenChat(t)}>
                                        <td className="p-5 font-bold">{t.ticketNumber || t.id.slice(0, 8)}</td>
                                        <td className="p-5">
                                            <div>
                                                <div className="font-bold">{t.userName}</div>
                                                <div className="text-xs text-muted-foreground">{t.userEmail}</div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-medium max-w-xs truncate">{t.subject}</td>
                                        <td className="p-5">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-accent">
                                                {t.category || "General"}
                                            </span>
                                        </td>
                                        <td className="p-5">{getPriorityBadge(t.priority)}</td>
                                        <td className="p-5">{getStatusBadge(t.status)}</td>
                                        <td className="p-5 font-medium text-sm">
                                            {t.adminId ? (
                                                t.adminId === currentUser?.id ? (
                                                    <span className="text-green-600 font-bold">Assigned to Me</span>
                                                ) : (
                                                    <span className="text-muted-foreground">Assigned (Other)</span>
                                                )
                                            ) : (
                                                <span className="text-amber-600 font-bold">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="p-5 text-sm text-muted-foreground font-medium">
                                            {format(new Date(t.createdAt), "MMM dd, yyyy HH:mm")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {tickets.length > 0 && (
                    <div className="border-t border-border/50 p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalTickets)} of {totalTickets}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="border-border/50">Previous</Button>
                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="border-border/50">Next</Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Chat Dialog */}
            <Dialog open={!!selectedTicket} onOpenChange={(open) => { if (!open) handleCloseChat(); }}>
                <DialogContent className="rounded-2xl border-border/50 max-w-2xl h-[80vh] flex flex-col p-0 overflow-hidden">
                    <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                <Headset className="w-5 h-5 text-[#FE6132]" />
                                Ticket #{selectedTicket?.ticketNumber || selectedTicket?.id.slice(0, 8)}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                Customer: <span className="font-bold text-foreground">{selectedTicket?.userName}</span> ({selectedTicket?.userEmail})
                            </p>
                        </div>
                        <div className="flex items-center gap-2 pr-6">
                            {selectedTicket && getStatusBadge(selectedTicket.status)}
                            {selectedTicket?.status === "open" && (
                                <Button
                                    size="sm"
                                    onClick={handleToggleAssign}
                                    variant={selectedTicket?.adminId === currentUser?.id ? "destructive" : "outline"}
                                    className="rounded-lg h-9 font-bold flex items-center gap-1.5"
                                >
                                    {selectedTicket?.adminId === currentUser?.id ? (
                                        <>
                                            <Unlock className="w-3.5 h-3.5" />
                                            Unassign Me
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-3.5 h-3.5" />
                                            Assign to Me
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-accent/10 min-h-0 flex flex-col">
                        <div className="flex-1" />
                        <div className="space-y-4">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === currentUser?.id;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                    >
                                        <div className="text-[10px] text-muted-foreground mb-1 font-bold">
                                            {msg.senderName || (isMe ? "Me" : "Customer")}
                                        </div>
                                        <div
                                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm font-medium ${
                                                isMe
                                                    ? "bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-br-none"
                                                    : "bg-background border border-border/50 text-foreground rounded-bl-none"
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <div className="text-[9px] text-muted-foreground mt-1 font-medium font-mono">
                                            {format(new Date(msg.sentAt || msg.createdAt), "HH:mm")}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-border/50 bg-background flex items-center gap-2">
                        <Input
                            placeholder={
                                selectedTicket?.status === "closed"
                                    ? "This ticket is resolved and closed"
                                    : selectedTicket?.adminId !== currentUser?.id
                                    ? "Assign this case to yourself to respond"
                                    : "Type a response..."
                            }
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            disabled={selectedTicket?.status === "closed" || selectedTicket?.adminId !== currentUser?.id}
                            className="flex-1 h-12 rounded-xl border-border/50"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={
                                !newMessage.trim() ||
                                selectedTicket?.status === "closed" ||
                                selectedTicket?.adminId !== currentUser?.id ||
                                isSending
                            }
                            className="bg-[#FE6132] hover:bg-[#FE6132]/90 text-white rounded-xl h-12 w-12 flex items-center justify-center p-0 flex-shrink-0"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
