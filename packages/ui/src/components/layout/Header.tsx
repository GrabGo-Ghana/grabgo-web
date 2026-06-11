"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "@grabgo/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Search, Bell, User, LogOut, Settings as SettingsIcon, InfoCircle, UserPlus, Cart, SunLight, HalfMoon } from "iconoir-react";

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "order" | "user" | "system";
    unread: boolean;
}

const formatTime = (dateString: string) => {
    try {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 0) return "Just now";
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    } catch {
        return "";
    }
};

const areNotificationsEqual = (previous: Notification[], next: Notification[]) => {
    if (previous.length !== next.length) return false;

    return previous.every((prevItem, index) => {
        const nextItem = next[index];
        return (
            prevItem.id === nextItem.id &&
            prevItem.title === nextItem.title &&
            prevItem.description === nextItem.description &&
            prevItem.time === nextItem.time &&
            prevItem.type === nextItem.type &&
            prevItem.unread === nextItem.unread
        );
    });
};

interface HeaderProps {
    isCollapsed: boolean;
    showNotifications?: boolean;
}

export function Header({ showNotifications = true }: HeaderProps) {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotifLoading, setIsNotifLoading] = useState(false);
    const hasLoadedNotifications = useRef(false);
    const isFetchingNotifications = useRef(false);

    // Initial mounting to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch notifications from API with 30s polling
    useEffect(() => {
        if (!mounted || !isAuthenticated || !showNotifications) return;

        const fetchNotifications = async () => {
            if (isFetchingNotifications.current) return;
            isFetchingNotifications.current = true;

            if (!hasLoadedNotifications.current) {
                setIsNotifLoading(true);
            }
            try {
                const response = await apiClient.get("/notifications?limit=20");
                if (response.data?.success && response.data?.notifications) {
                    const mapped = response.data.notifications.map((n: any) => {
                        let type: "order" | "user" | "system" = "system";
                        const nType = (n.type || "").toLowerCase();
                        if (nType.includes("order")) {
                            type = "order";
                        } else if (
                            nType.includes("user") ||
                            nType.includes("rider") ||
                            nType.includes("vendor")
                        ) {
                            type = "user";
                        }

                        return {
                            id: n._id,
                            title: n.title || "Alert",
                            description: n.message || "",
                            unread: !n.isRead,
                            time: formatTime(n.createdAt),
                            type,
                        };
                    });
                    setNotifications((prev) =>
                        areNotificationsEqual(prev, mapped) ? prev : mapped
                    );
                }
            } catch (err) {
                // Fail silently — do not crash the header
                console.error("Failed to fetch notifications:", err);
            } finally {
                if (!hasLoadedNotifications.current) {
                    hasLoadedNotifications.current = true;
                    setIsNotifLoading(false);
                }

                isFetchingNotifications.current = false;
            }
        };

        fetchNotifications();
        const interval = window.setInterval(fetchNotifications, 30000);
        return () => window.clearInterval(interval);
    }, [mounted, isAuthenticated, showNotifications]);

    const unreadCount = useMemo(
        () => notifications.reduce((total, notification) => total + (notification.unread ? 1 : 0), 0),
        [notifications]
    );

    const markAsRead = useCallback(async (id: string) => {
        try {
            // Optimistic update
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
            );
            await apiClient.patch(`/notifications/${id}/read`);
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        if (unreadCount === 0) return;
        try {
            // Optimistic update
            setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
            await apiClient.patch("/notifications/read-all");
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err);
        }
    }, [unreadCount]);

    return (
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background">
            <div className="flex h-16 items-center justify-between gap-4 px-6">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search orders, users, restaurants..."
                            className="pl-10 bg-accent/50 border-border/50 focus:bg-background transition-colors"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="hover:bg-accent transition-all duration-300 border border-transparent hover:border-border/50"
                    >
                        {!mounted ? (
                            <SunLight className="w-5 h-5 text-muted-foreground animate-pulse" />
                        ) : theme === "dark" ? (
                            <SunLight className="w-5 h-5 text-orange-400" />
                        ) : (
                            <HalfMoon className="w-5 h-5 text-muted-foreground" />
                        )}
                    </Button>

                    {/* Notifications */}
                    {showNotifications && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative hover:bg-accent transition-all duration-300 border border-transparent hover:border-border/50"
                                >
                                    <Bell className="w-5 h-5" />
                                    {/* Notification Badge */}
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FE6132] rounded-none animate-pulse" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-[380px] p-0 overflow-hidden bg-background border-border/50 animate-in fade-in zoom-in-95 duration-200"
                            >
                                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-accent/30">
                                    <div className="flex items-center gap-2">
                                        <DropdownMenuLabel className="p-0 text-base font-bold">
                                            Notifications
                                        </DropdownMenuLabel>
                                        {unreadCount > 0 && (
                                            <Badge className="bg-[#FE6132] text-white hover:bg-[#FE6132] border-0 text-[10px] h-4 min-w-[20px] flex items-center justify-center px-1">
                                                {unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-[11px] font-bold text-[#FE6132] hover:text-[#FE6132] hover:bg-[#FE6132]/10 rounded-none"
                                        onClick={markAllAsRead}
                                        disabled={unreadCount === 0}
                                    >
                                        Mark all as read
                                    </Button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                                    {isNotifLoading && notifications.length === 0 ? (
                                        <div className="p-8 text-center bg-accent/5">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FE6132] mx-auto mb-3" />
                                            <p className="text-sm text-muted-foreground font-medium">
                                                Loading notifications...
                                            </p>
                                        </div>
                                    ) : notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <DropdownMenuItem
                                                key={notification.id}
                                                className={`flex flex-col items-start p-4 cursor-pointer border-b border-border/40 last:border-0 hover:bg-accent/50 focus:bg-accent transition-colors relative group ${notification.unread ? "bg-[#FE6132]/5" : ""}`}
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <div className="flex gap-4 w-full">
                                                    <div
                                                        className={`mt-1 flex-shrink-0 w-9 h-9 rounded-none flex items-center justify-center ${notification.type === "order"
                                                                ? "bg-orange-100 text-[#FE6132]"
                                                                : notification.type === "user"
                                                                    ? "bg-blue-100 text-blue-600"
                                                                    : "bg-purple-100 text-purple-600"
                                                            }`}
                                                    >
                                                        {notification.type === "order" ? (
                                                            <Cart className="w-5 h-5" />
                                                        ) : notification.type === "user" ? (
                                                            <UserPlus className="w-5 h-5" />
                                                        ) : (
                                                            <InfoCircle className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p
                                                                className={`text-sm font-bold leading-none ${notification.unread ? "text-foreground" : "text-muted-foreground"}`}
                                                            >
                                                                {notification.title}
                                                            </p>
                                                            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                                                                {notification.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 pr-4">
                                                            {notification.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                {notification.unread && (
                                                    <div className="absolute top-1/2 -translate-y-1/2 right-3 w-1.5 h-1.5 bg-[#FE6132] rounded-none" />
                                                )}
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center bg-accent/5">
                                            <Bell className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-muted-foreground">
                                                All caught up!
                                            </p>
                                            <p className="text-xs text-muted-foreground/60 mt-1">
                                                Check back later for new alerts.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-border/50 bg-accent/20">
                                    <Button className="w-full h-9 rounded-none text-xs font-bold bg-[#FE6132] hover:bg-[#FE6132]/90 text-white transition-all active:scale-95">
                                        See all notifications
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 hover:bg-accent transition-all duration-300 border border-transparent hover:border-border/50 focus:border-transparent active:border-transparent data-[state=open]:border-transparent data-[state=closed]:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            >
                                <div className="w-8 h-8 rounded-none bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 flex items-center justify-center text-white font-semibold text-sm">
                                    {user?.username?.charAt(0).toUpperCase() || "A"}
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-sm font-medium">
                                        {user?.username || "Admin"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {user?.role || "Administrator"}
                                    </span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">
                                        {user?.username || "Admin User"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {user?.email || "admin@grabgo.com"}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SettingsIcon className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={logout}
                                className="text-red-600 focus:text-red-600"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
