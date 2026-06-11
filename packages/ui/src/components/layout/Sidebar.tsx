"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import {
    ViewGrid,
    Group,
    Shop,
    Cart,
    Cycling,
    CreditCard,
    Gift,
    MessageText,
    Bell,
    StatsReport,
    Settings as SettingsIcon,
    NavArrowLeft,
    NavArrowRight,
    ShieldCheck,
    Database,
    NavArrowDown,
    FastArrowDown,
    PharmacyCrossTag,
    Leaf,
} from "iconoir-react";
import { useAuth, hasPermission } from "../../context/AuthContext";

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const mainNavigation = [
    { name: "Dashboard", href: "/", icon: ViewGrid, permission: ["canViewDashboard", "canViewAnalytics"] },
    { name: "Customers", href: "/users", icon: Group, permission: "canManageUsers" },
    { name: "Vendors", href: "/vendors", icon: Shop, permission: "canManageVendors" },
    { name: "Riders", href: "/riders", icon: Cycling, permission: "canManageRiders" },
    { name: "Orders", href: "/orders", icon: Cart, permission: "canManageOrders" },
    { name: "Analytics", href: "/analytics", icon: StatsReport, permission: "canViewAnalytics" },
];

const catalogNavigation = [
    { name: "Food Items", href: "/food-items", icon: Database, permission: "canManageProducts" },
    { name: "Grocery Items", href: "/grocery-items", icon: Leaf, permission: "canManageProducts" },
    { name: "Pharmacy Items", href: "/pharmacy-items", icon: PharmacyCrossTag, permission: "canManageProducts" },
    { name: "Market Items", href: "/market-items", icon: Gift, permission: "canManageProducts" },
];

const financeNavigation = [
    { name: "Payments Ledger", href: "/finance/payments", icon: CreditCard, permission: "canViewFinance" },
    { name: "Paystack Logs", href: "/finance/paystack", icon: Database, permission: "canViewPaystackLogs" },
    { name: "COD Collections", href: "/finance/cod", icon: FastArrowDown, permission: "canReconcileCOD" },
    { name: "Vendor Payouts", href: "/finance/vendor-payouts", icon: Shop, permission: "canApprovePayouts" },
    { name: "Rider Payouts", href: "/finance/rider-payouts", icon: Cycling, permission: "canApprovePayouts" },
    { name: "Refunds", href: "/finance/refunds", icon: FastArrowDown, permission: "canProcessRefunds" },
    { name: "Wallet/Credits", href: "/finance/credits", icon: CreditCard, permission: "canViewFinance" },
    { name: "Failed Payments", href: "/finance/failed-payments", icon: CreditCard, permission: "canViewFinance" },
];

const operationsNavigation = [
    { name: "Fraud Cases", href: "/operations/fraud", icon: ShieldCheck, permission: "canManageFraud" },
    { name: "Disputes", href: "/operations/disputes", icon: ShieldCheck, permission: "canManageDisputes" },
    { name: "Support Tickets", href: "/operations/support", icon: MessageText, permission: "canManageSupport" },
    { name: "Promotions", href: "/operations/promotions", icon: Gift, permission: "canManagePromotions" },
    { name: "Subscriptions", href: "/operations/subscriptions", icon: Group, permission: "canManageSubscriptions" },
    { name: "Notifications", href: "/operations/notifications", icon: Bell, permission: ["canSendNotifications", "canManageNotifications"] },
    { name: "Referrals", href: "/operations/referrals", icon: Group, permission: "canManageReferrals" },
    { name: "Platform Settings", href: "/operations/settings", icon: SettingsIcon, permission: "canManagePlatformSettings" },
    { name: "Audit Logs", href: "/operations/audit-logs", icon: Database, permission: "canViewAuditLogs" },
    { name: "Admin Management", href: "/settings/admins", icon: ShieldCheck, permission: "isSuperAdmin" },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();
    const [catalogExpanded, setCatalogExpanded] = useState(false);
    const [financeExpanded, setFinanceExpanded] = useState(false);
    const [operationsExpanded, setOperationsExpanded] = useState(false);

    const visibleMain = mainNavigation.filter(item => hasPermission(user, item.permission));
    const visibleCatalog = catalogNavigation.filter(item => hasPermission(user, item.permission));
    const visibleFinance = financeNavigation.filter(item => hasPermission(user, item.permission));
    const visibleOperations = operationsNavigation.filter(item => hasPermission(user, item.permission));

    const showCatalog = visibleCatalog.length > 0;
    const showFinance = visibleFinance.length > 0;
    const showOperations = visibleOperations.length > 0;

    // Check if submenus contain active routes
    const isCatalogActive = visibleCatalog.some(item => pathname.startsWith(item.href));
    const isFinanceActive = visibleFinance.some(item => pathname.startsWith(item.href));
    const isOperationsActive = visibleOperations.some(item => pathname.startsWith(item.href));

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-50 h-screen transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="absolute inset-0 bg-card border-r border-border/50" />

            {/* Content */}
            <div className="relative h-full flex flex-col">
                {/* Logo Section */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 h-20">
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center gap-3 transition-all duration-300",
                            isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible"
                        )}
                    >
                        {/* Logo Icon */}
                        <div className="w-10 h-10 rounded-none flex items-center justify-center bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>

                        {/* Logo Text */}
                        <div className="flex flex-col animate-fade-in">
                            <span className="text-lg font-bold text-foreground">
                                GrabGo
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                                Admin Panel
                            </span>
                        </div>
                    </Link>

                    {/* Toggle Button - Dynamic Position */}
                    <button
                        onClick={onToggle}
                        className={cn(
                            "p-2 rounded-none hover:bg-accent transition-all duration-300 border border-transparent hover:border-border/50",
                            isCollapsed ? "absolute left-1/2 -translate-x-1/2" : "relative"
                        )}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <div className="flex flex-col items-center gap-1">
                                <ShieldCheck className="w-6 h-6 text-[#FE6132] mb-2" />
                                <NavArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                        ) : (
                            <NavArrowLeft className="w-4 h-4 text-muted-foreground" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {/* Main Navigation */}
                    {visibleMain.map((item, index) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-none transition-all duration-200",
                                    " group",
                                    isActive
                                        ? "bg-[#FE6132] text-white"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                                    isCollapsed && "justify-center px-2",
                                    "animate-fade-in-left"
                                )}
                                title={isCollapsed ? item.name : ""}
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="font-medium whitespace-nowrap">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}

                    {/* Catalog Management Section */}
                    {!isCollapsed && showCatalog && (
                        <div className="pt-1">
                            <button
                                onClick={() => setCatalogExpanded(!catalogExpanded)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-all duration-200",
                                    "hover:bg-accent group",
                                    isCatalogActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Database className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium whitespace-nowrap">Catalog Management</span>
                                </div>
                                <NavArrowDown className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    catalogExpanded && "rotate-180"
                                )} />
                            </button>

                            {/* Submenu */}
                            {catalogExpanded && (
                                <div className="ml-4 mt-1 space-y-1 border-l-2 border-border/50 pl-2">
                                    {visibleCatalog.map((item) => {
                                        const isActive = pathname.startsWith(item.href);
                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-none transition-all duration-200",
                                                    " group text-sm",
                                                    isActive
                                                        ? "bg-[#FE6132] text-white"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                                )}
                                            >
                                                <Icon className="w-4 h-4 flex-shrink-0" />
                                                <span className="font-medium whitespace-nowrap">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Finance Section */}
                    {!isCollapsed && showFinance && (
                        <div className="pt-1">
                            <button
                                onClick={() => setFinanceExpanded(!financeExpanded)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-all duration-200",
                                    "hover:bg-accent group",
                                    isFinanceActive ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium whitespace-nowrap">Finance</span>
                                </div>
                                <NavArrowDown className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    financeExpanded && "rotate-180"
                                )} />
                            </button>

                            {/* Submenu */}
                            {financeExpanded && (
                                <div className="ml-4 mt-1 space-y-1 border-l-2 border-border/50 pl-2">
                                    {visibleFinance.map((item) => {
                                        const isActive = pathname.startsWith(item.href);
                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-none transition-all duration-200",
                                                    " group text-sm",
                                                    isActive
                                                        ? "bg-[#FE6132] text-white font-bold"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                                )}
                                            >
                                                <Icon className="w-4 h-4 flex-shrink-0" />
                                                <span className="font-medium whitespace-nowrap">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Operations Section */}
                    {!isCollapsed && showOperations && (
                        <div className="pt-1">
                            <button
                                onClick={() => setOperationsExpanded(!operationsExpanded)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-all duration-200",
                                    "hover:bg-accent group",
                                    isOperationsActive ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium whitespace-nowrap">Operations</span>
                                </div>
                                <NavArrowDown className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    operationsExpanded && "rotate-180"
                                )} />
                            </button>

                            {/* Submenu */}
                            {operationsExpanded && (
                                <div className="ml-4 mt-1 space-y-1 border-l-2 border-border/50 pl-2">
                                    {visibleOperations.map((item) => {
                                        const isActive = pathname.startsWith(item.href);
                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-none transition-all duration-200",
                                                    " group text-sm",
                                                    isActive
                                                        ? "bg-[#FE6132] text-white font-bold"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                                )}
                                            >
                                                <Icon className="w-4 h-4 flex-shrink-0" />
                                                <span className="font-medium whitespace-nowrap">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Collapsed Icons when sidebar is closed */}
                    {isCollapsed && (
                        <div className="pt-2 mt-2 border-t border-border/50 space-y-2">
                            {showCatalog && (
                                <Link
                                    href={visibleCatalog[0].href}
                                    className={cn(
                                        "flex items-center justify-center px-2 py-2.5 rounded-none transition-all duration-200 hover:bg-accent",
                                        isCatalogActive ? "bg-[#FE6132] text-white" : "text-muted-foreground"
                                    )}
                                    title="Catalog"
                                >
                                    <Database className="w-5 h-5 flex-shrink-0" />
                                </Link>
                            )}
                            {showFinance && (
                                <Link
                                    href={visibleFinance[0].href}
                                    className={cn(
                                        "flex items-center justify-center px-2 py-2.5 rounded-none transition-all duration-200 hover:bg-accent",
                                        isFinanceActive ? "bg-[#FE6132] text-white" : "text-muted-foreground"
                                    )}
                                    title="Finance"
                                >
                                    <CreditCard className="w-5 h-5 flex-shrink-0" />
                                </Link>
                            )}
                            {showOperations && (
                                <Link
                                    href={visibleOperations[0].href}
                                    className={cn(
                                        "flex items-center justify-center px-2 py-2.5 rounded-none transition-all duration-200 hover:bg-accent",
                                        isOperationsActive ? "bg-[#FE6132] text-white" : "text-muted-foreground"
                                    )}
                                    title="Operations"
                                >
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                </Link>
                            )}
                        </div>
                    )}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-border/50 animate-fade-in">
                    <div className={cn(
                        "flex items-center rounded-none transition-all duration-300",
                        isCollapsed ? "justify-center p-0 bg-transparent" : "gap-3 p-3 bg-accent/50"
                    )}>
                        <div className={cn(
                            " rounded-none bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 flex items-center justify-center text-white font-semibold transition-all duration-300",
                            isCollapsed ? "w-10 h-10 cursor-pointer" : "w-10 h-10"
                        )}>
                            {user?.username?.charAt(0).toUpperCase() || "A"}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate leading-none mb-1">
                                    {user?.username || "Admin User"}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate opacity-80 uppercase tracking-wider font-semibold">
                                    {user?.email || "admin@grabgo.com"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
