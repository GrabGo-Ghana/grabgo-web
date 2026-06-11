'use client';

import { useAuth, DashboardLayout as Layout, LoadingScreen, hasPermission } from "@grabgo/ui";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ShieldCheck, ArrowLeft } from "iconoir-react";

const routePermissionMap: { [key: string]: string | string[] } = {
    '/users': 'canManageUsers',
    '/vendors': 'canManageVendors',
    '/riders': 'canManageRiders',
    '/orders': 'canManageOrders',
    '/analytics': 'canViewAnalytics',
    '/food-items': 'canManageProducts',
    '/grocery-items': 'canManageProducts',
    '/pharmacy-items': 'canManageProducts',
    '/market-items': 'canManageProducts',
    '/finance/payments': 'canViewFinance',
    '/finance/paystack': 'canViewPaystackLogs',
    '/finance/cod': 'canReconcileCOD',
    '/finance/vendor-payouts': 'canApprovePayouts',
    '/finance/rider-payouts': 'canApprovePayouts',
    '/finance/refunds': 'canProcessRefunds',
    '/finance/credits': 'canViewFinance',
    '/finance/failed-payments': 'canViewFinance',
    '/operations/fraud': 'canManageFraud',
    '/operations/disputes': 'canManageDisputes',
    '/operations/support': 'canManageSupport',
    '/operations/promotions': 'canManagePromotions',
    '/operations/subscriptions': 'canManageSubscriptions',
    '/operations/notifications': ['canSendNotifications', 'canManageNotifications'],
    '/operations/referrals': 'canManageReferrals',
    '/operations/settings': 'canManagePlatformSettings',
    '/operations/audit-logs': 'canViewAuditLogs',
    '/settings/admins': 'isSuperAdmin',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const redirectAttempts = useRef(0);
    const MAX_REDIRECT_ATTEMPTS = 3;

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Prevent infinite redirect loops
            if (redirectAttempts.current < MAX_REDIRECT_ATTEMPTS) {
                redirectAttempts.current += 1;
                router.push('/login');
            } else {
                console.error('Max redirect attempts reached. Possible redirect loop detected.');
            }
        } else if (isAuthenticated) {
            // Reset counter on successful auth
            redirectAttempts.current = 0;
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) return null;

    // Route-level permission checks
    let requiredPermission: string | string[] | null = null;
    if (pathname === '/') {
        requiredPermission = ['canViewDashboard', 'canViewAnalytics'];
    } else {
        const sortedKeys = Object.keys(routePermissionMap).sort((a, b) => b.length - a.length);
        const matchKey = sortedKeys.find(key => pathname.startsWith(key));
        if (matchKey) {
            requiredPermission = routePermissionMap[matchKey];
        }
    }

    const permitted = requiredPermission ? hasPermission(user, requiredPermission) : true;

    if (!permitted) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                    <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6 border border-destructive/20 animate-pulse">
                        <ShieldCheck className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
                        Access Denied
                    </h1>
                    <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                        Your account does not have the permissions required to access the section: <span className="font-semibold text-foreground">{pathname}</span>.
                        Please request permission updates from a Super Administrator.
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all border border-border"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="px-5 py-2.5 bg-[#FE6132] text-white font-semibold hover:bg-[#FE6132]/95 transition-all shadow-lg shadow-[#FE6132]/25"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return <Layout>{children}</Layout>;
}
