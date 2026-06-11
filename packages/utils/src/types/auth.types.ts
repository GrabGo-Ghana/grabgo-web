// Authentication related TypeScript types and interfaces

export interface User {
    _id: string;
    id?: string;
    email: string;
    username: string;
    role: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isActive: boolean;
    profilePicture?: string | null;
    
    // Permissions
    canViewDashboard: boolean;
    canViewAnalytics: boolean;
    canManageUsers: boolean;
    canManageVendors: boolean;
    canManageRiders: boolean;
    canManageOrders: boolean;
    canViewFinance: boolean;
    canManageFinance: boolean;
    canApprovePayouts: boolean;
    canProcessRefunds: boolean;
    canReconcileCOD: boolean;
    canViewPaystackLogs: boolean;
    canManageSupport: boolean;
    canManagePromotions: boolean;
    canManageSubscriptions: boolean;
    canManageReferrals: boolean;
    canSendNotifications: boolean;
    canManageNotifications: boolean;
    canManagePlatformSettings: boolean;
    canViewAuditLogs: boolean;
    canExportAuditLogs: boolean;
    canManageFraud: boolean;
    canManageDisputes: boolean;
    canManageProducts: boolean;
    canManageContent: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
    role?: string;
    recaptchaToken?: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthResponse {
    user?: User;
    token?: string;
    requiresMfa?: boolean;
    mfaChallengeToken?: string;
}
