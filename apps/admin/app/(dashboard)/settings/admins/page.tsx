'use client';

import { useState, useEffect } from 'react';
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
    Switch,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@grabgo/ui';
import { apiClient } from '@grabgo/utils';
import { Plus, Trash, Key, Check, Xmark, ShieldCheck, Mail, Send, Group } from 'iconoir-react';
import { useAuth } from '@grabgo/ui';

// Custom Tabs component since ui packages may vary
function Tabs({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
    return (
        <div className="flex border-b border-border mb-6">
            <button
                onClick={() => setActiveTab('admins')}
                className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${activeTab === 'admins'
                    ? 'border-[#FE6132] text-[#FE6132]'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
            >
                Active Administrators
            </button>
            <button
                onClick={() => setActiveTab('invites')}
                className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${activeTab === 'invites'
                    ? 'border-[#FE6132] text-[#FE6132]'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
            >
                Pending Invitations
            </button>
        </div>
    );
}

const PERMISSIONS_LIST = [
    { key: 'canViewDashboard', label: 'View Dashboard Stats' },
    { key: 'canViewAnalytics', label: 'View Analytics' },
    { key: 'canManageUsers', label: 'Manage Customers' },
    { key: 'canManageVendors', label: 'Manage Vendors' },
    { key: 'canManageRiders', label: 'Manage Riders' },
    { key: 'canManageOrders', label: 'Manage Orders' },
    { key: 'canViewFinance', label: 'View Finance Ledger' },
    { key: 'canManageFinance', label: 'Manage Credits/Money' },
    { key: 'canApprovePayouts', label: 'Approve Payouts' },
    { key: 'canProcessRefunds', label: 'Process Refunds' },
    { key: 'canReconcileCOD', label: 'Reconcile COD Cash' },
    { key: 'canViewPaystackLogs', label: 'View Paystack Webhooks' },
    { key: 'canManageSupport', label: 'Manage Support Tickets' },
    { key: 'canManagePromotions', label: 'Manage Coupon Promos' },
    { key: 'canManageSubscriptions', label: 'Manage Subscriptions' },
    { key: 'canManageReferrals', label: 'Manage Referrals' },
    { key: 'canSendNotifications', label: 'Send Notifications' },
    { key: 'canManageNotifications', label: 'Manage Notification Lists' },
    { key: 'canManagePlatformSettings', label: 'Edit Fees & Settings' },
    { key: 'canViewAuditLogs', label: 'View System Audit Logs' },
    { key: 'canExportAuditLogs', label: 'Export Audit Log Sheets' },
    { key: 'canManageFraud', label: 'Manage Fraud Cases' },
    { key: 'canManageDisputes', label: 'Manage Vendor Disputes' },
    { key: 'canManageProducts', label: 'Manage Catalog Products' }
];

const PRESETS = {
    operations: [
        'canManageUsers',
        'canManageVendors',
        'canManageRiders',
        'canManageOrders',
        'canManageFraud',
        'canManageDisputes',
        'canManageSupport'
    ],
    finance: [
        'canViewFinance',
        'canApprovePayouts',
        'canProcessRefunds',
        'canReconcileCOD',
        'canViewPaystackLogs',
        'canManageFinance'
    ],
    support: [
        'canManageSupport',
        'canManageDisputes'
    ],
    marketing: [
        'canManagePromotions',
        'canManageReferrals',
        'canSendNotifications',
        'canManageNotifications'
    ],
    readonly: [
        'canViewDashboard',
        'canViewAnalytics',
        'canViewAuditLogs'
    ]
};

export default function AdminManagementPage() {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('admins');
    const [admins, setAdmins] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Invite Modal Form States
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [invitePhone, setInvitePhone] = useState('');
    const [invitePreset, setInvitePreset] = useState('custom');
    const [invitePerms, setInvitePerms] = useState<Record<string, boolean>>({});

    // Edit Permissions Modal States
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<any>(null);
    const [editPerms, setEditPerms] = useState<Record<string, boolean>>({});

    // MFA Challenge Modal States
    const [isMfaOpen, setIsMfaOpen] = useState(false);
    const [mfaOtp, setMfaOtp] = useState('');
    const [mfaError, setMfaError] = useState('');
    const [pendingAction, setPendingAction] = useState<() => Promise<void>>();
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isMfaVerifying, setIsMfaVerifying] = useState(false);
    const [isInviteSubmitting, setIsInviteSubmitting] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [adminsRes, invitesRes] = await Promise.all([
                apiClient.get('/admin/manage/list'),
                apiClient.get('/admin/manage/invites')
            ]);
            if (adminsRes.data.success) setAdmins(adminsRes.data.data);
            if (invitesRes.data.success) setInvites(invitesRes.data.data);
        } catch (err) {
            console.error('Failed to load admin management data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Countdown timer for MFA OTP resends
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Handle generic error responses with MFA popups
    const executeActionWithMfa = async (actionFn: () => Promise<any>) => {
        try {
            const result = await actionFn();
            return result;
        } catch (err: any) {
            if (err.response?.data?.mfaRequired) {
                // Open MFA verification flow
                setMfaOtp('');
                setMfaError('');
                setPendingAction(() => async () => {
                    const res = await actionFn();
                    if (res?.data?.success) {
                        setIsMfaOpen(false);
                        loadData();
                    }
                });

                // Request send OTP
                try {
                    await apiClient.post('/admin/auth/mfa/send');
                    setResendCooldown(60);
                } catch (sendErr: any) {
                    console.error('Failed to send MFA OTP:', sendErr);
                }

                setIsMfaOpen(true);
            } else {
                alert(err.response?.data?.message || 'Action failed. Please try again.');
            }
            return null;
        }
    };

    const handleVerifyMfa = async () => {
        if (!mfaOtp || isMfaVerifying) return;
        setIsMfaVerifying(true);
        try {
            const res = await apiClient.post('/admin/auth/mfa/verify', { otp: mfaOtp });
            if (res.data.success) {
                setMfaError('');
                if (pendingAction) {
                    await pendingAction();
                }
            }
        } catch (err: any) {
            setMfaError(err.response?.data?.message || 'Invalid verification code.');
        } finally {
            setIsMfaVerifying(false);
        }
    };

    const handleResendMfa = async () => {
        if (resendCooldown > 0) return;
        try {
            await apiClient.post('/admin/auth/mfa/send');
            setResendCooldown(60);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to send OTP.');
        }
    };

    // Preset selection updates permission flags
    const handlePresetChange = (preset: string) => {
        setInvitePreset(preset);
        if (preset === 'custom') return;

        const presetKeys = (PRESETS as any)[preset] || [];
        const newPerms: Record<string, boolean> = {};
        PERMISSIONS_LIST.forEach(p => {
            newPerms[p.key] = presetKeys.includes(p.key);
        });
        setInvitePerms(newPerms);
    };

    const handleCheckboxChange = (key: string, checked: boolean) => {
        setInvitePreset('custom');
        setInvitePerms(prev => ({ ...prev, [key]: checked }));
    };

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isInviteSubmitting) return;
        setIsInviteSubmitting(true);
        try {
            const action = () => apiClient.post('/admin/manage/invite', {
                email: inviteEmail,
                username: inviteUsername,
                phone: invitePhone,
                permissions: invitePerms
            });

            const res = await executeActionWithMfa(action);
            if (res) {
                alert(res.data.message);
                setIsInviteOpen(false);
                setInviteEmail('');
                setInviteUsername('');
                setInvitePhone('');
                setInvitePreset('custom');
                setInvitePerms({});
                loadData();
            }
        } finally {
            setIsInviteSubmitting(false);
        }
    };

    const handleRevokeInvite = async (inviteId: string) => {
        if (!confirm('Are you sure you want to revoke this invitation?')) return;
        const action = () => apiClient.post(`/admin/manage/invites/${inviteId}/revoke`);
        const res = await executeActionWithMfa(action);
        if (res) {
            alert('Invitation successfully revoked.');
            loadData();
        }
    };

    const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
        const action = () => apiClient.put(`/admin/manage/${adminId}/status`, {
            isActive: !currentStatus
        });
        const res = await executeActionWithMfa(action);
        if (res) {
            loadData();
        }
    };

    const handleOpenEdit = (admin: any) => {
        setEditingAdmin(admin);
        const perms: Record<string, boolean> = {};
        PERMISSIONS_LIST.forEach(p => {
            perms[p.key] = admin[p.key] === true;
        });
        setEditPerms(perms);
        setIsEditOpen(true);
    };

    const handleSavePermissions = async () => {
        if (!editingAdmin) return;
        const action = () => apiClient.put(`/admin/manage/${editingAdmin.id}/permissions`, {
            permissions: editPerms
        });
        const res = await executeActionWithMfa(action);
        if (res) {
            alert('Permissions updated successfully.');
            setIsEditOpen(false);
            loadData();
        }
    };

    if (loading && admins.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-[#FE6132] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground">Loading administrator records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Administrators</h1>
                    <p className="text-muted-foreground mt-1">Manage admin roles, issue boarding invites, and configure permissions.</p>
                </div>
                {currentUser?.isSuperAdmin && (
                    <Button
                        onClick={() => setIsInviteOpen(true)}
                        className="bg-[#FE6132] hover:bg-[#FE6132]/90 text-white font-semibold flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Invite Administrator
                    </Button>
                )}
            </div>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 'admins' ? (
                <Card className="overflow-hidden border-border/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-accent/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-4">Admin Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 text-center">Perms Count</th>
                                    <th className="p-4 text-center">Active Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-sm">
                                {admins.map(admin => {
                                    const activePermsCount = PERMISSIONS_LIST.filter(p => admin[p.key] === true).length;
                                    const isSelf = admin.id === currentUser?.id;

                                    return (
                                        <tr key={admin.id} className="hover:bg-accent/10 transition-all">
                                            <td className="p-4 font-semibold text-foreground flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {admin.username.charAt(0).toUpperCase()}
                                                </div>
                                                {admin.username}
                                            </td>
                                            <td className="p-4 text-muted-foreground">{admin.email}</td>
                                            <td className="p-4 text-muted-foreground">{admin.phone || '—'}</td>
                                            <td className="p-4">
                                                {admin.isSuperAdmin ? (
                                                    <Badge className="bg-destructive/15 text-destructive border-destructive/20 font-bold">Super Admin</Badge>
                                                ) : (
                                                    <Badge className="bg-secondary/20 text-muted-foreground border-border font-bold">Standard Admin</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 text-center font-medium">
                                                {admin.isSuperAdmin ? 'Full Bypass' : activePermsCount}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center">
                                                    <Switch
                                                        checked={admin.isActive}
                                                        disabled={isSelf || admin.isSuperAdmin}
                                                        onChange={() => handleToggleStatus(admin.id, admin.isActive)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    disabled={admin.isSuperAdmin || isSelf}
                                                    onClick={() => handleOpenEdit(admin)}
                                                    className="hover:text-primary"
                                                >
                                                    <Key className="w-4 h-4 mr-2" />
                                                    Edit Permissions
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <Card className="overflow-hidden border-border/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-accent/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-4">Invited Email</th>
                                    <th className="p-4">Username</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Expires At</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-sm">
                                {invites.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-8 text-muted-foreground">
                                            No pending invitations found.
                                        </td>
                                    </tr>
                                ) : (
                                    invites.map(invite => {
                                        const isExpired = new Date(invite.expiresAt) < new Date();
                                        let statusBadge = <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
                                        if (invite.isAccepted) statusBadge = <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Accepted</Badge>;
                                        else if (invite.isRevoked) statusBadge = <Badge className="bg-muted text-muted-foreground">Revoked</Badge>;
                                        else if (isExpired) statusBadge = <Badge className="bg-destructive/10 text-destructive border-destructive/20">Expired</Badge>;

                                        return (
                                            <tr key={invite.id} className="hover:bg-accent/10 transition-all">
                                                <td className="p-4 font-semibold text-foreground">{invite.email}</td>
                                                <td className="p-4 text-muted-foreground">{invite.username}</td>
                                                <td className="p-4 text-muted-foreground">{invite.phone || '—'}</td>
                                                <td className="p-4 text-muted-foreground">
                                                    {new Date(invite.expiresAt).toLocaleString()}
                                                </td>
                                                <td className="p-4">{statusBadge}</td>
                                                <td className="p-4 text-right">
                                                    {!invite.isAccepted && !invite.isRevoked && !isExpired && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleRevokeInvite(invite.id)}
                                                            className="hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash className="w-4 h-4 mr-2" />
                                                            Revoke
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Invite Administrator Modal */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Invite New Administrator</DialogTitle>
                        <DialogDescription>
                            Send a timed onboarding link. Invited admins must complete phone OTP verification.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendInvite} className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">Email Address</label>
                                <Input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="name@grabgo.com"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">Username / Name</label>
                                <Input
                                    type="text"
                                    required
                                    value={inviteUsername}
                                    onChange={e => setInviteUsername(e.target.value)}
                                    placeholder="e.g. john_doe"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">Phone Number</label>
                                <Input
                                    type="text"
                                    required
                                    value={invitePhone}
                                    onChange={e => setInvitePhone(e.target.value)}
                                    placeholder="e.g. 0244123456"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">Role Preset</label>
                            <Select value={invitePreset} onValueChange={handlePresetChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select preset or create custom" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="custom">Custom Permissions Selection</SelectItem>
                                    <SelectItem value="readonly">Read-Only Admin (Viewer)</SelectItem>
                                    <SelectItem value="operations">Operations Admin (Riders, Users, Disputes)</SelectItem>
                                    <SelectItem value="finance">Finance Admin (Payouts, Refunds, Ledger)</SelectItem>
                                    <SelectItem value="support">Support Agent (Support Tickets only)</SelectItem>
                                    <SelectItem value="marketing">Marketing Admin (Promotions, SMS Notifications)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-4 border-b border-border pb-2">
                                Configure Permissions
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {PERMISSIONS_LIST.map(p => (
                                    <div key={p.key} className="flex items-center justify-between p-3 border border-border bg-accent/10 rounded-sm">
                                        <span className="text-sm font-medium">{p.label}</span>
                                        <Switch
                                            checked={!!invitePerms[p.key]}
                                            onCheckedChange={(checked) => handleCheckboxChange(p.key, checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="mt-6 border-t border-border pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#FE6132] hover:bg-[#FE6132]/95 text-white">
                                Generate & Send Invitation
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Permissions Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Admin Permissions</DialogTitle>
                        <DialogDescription>
                            Modifying permissions for <span className="font-semibold">{editingAdmin?.username}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 my-4">
                        <div className="grid grid-cols-2 gap-4">
                            {PERMISSIONS_LIST.map(p => (
                                <div key={p.key} className="flex items-center justify-between p-3 border border-border bg-accent/10 rounded-sm">
                                    <span className="text-sm font-medium">{p.label}</span>
                                    <Switch
                                        checked={!!editPerms[p.key]}
                                        onCheckedChange={(checked) => setEditPerms(prev => ({ ...prev, [p.key]: checked }))}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="border-t border-border pt-4">
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSavePermissions} className="bg-[#FE6132] hover:bg-[#FE6132]/95 text-white">
                            Save Configuration Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MFA Security Prompt Modal */}
            <Dialog open={isMfaOpen} onOpenChange={setIsMfaOpen}>
                <DialogContent className="max-w-md">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-[#FE6132]/10 border border-[#FE6132]/20 text-[#FE6132] flex items-center justify-center mb-4">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-xl font-bold">MFA Verification Required</DialogTitle>
                        <DialogDescription className="mt-2 text-sm text-muted-foreground">
                            A verification code has been dispatched to your configured phone number. Enter it below to complete this administrative action.
                        </DialogDescription>

                        <div className="w-full mt-6 space-y-4">
                            <Input
                                type="text"
                                maxLength={6}
                                value={mfaOtp}
                                onChange={e => setMfaOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="Enter 6-digit code"
                                className="text-center text-2xl font-bold tracking-widest h-14"
                            />
                            {mfaError && <p className="text-sm text-destructive font-medium">{mfaError}</p>}

                            <Button
                                onClick={handleVerifyMfa}
                                disabled={isMfaVerifying || !mfaOtp}
                                className="w-full h-12 bg-[#FE6132] hover:bg-[#FE6132]/95 text-white font-semibold"
                            >
                                {isMfaVerifying ? 'Verifying...' : 'Verify & Proceed'}
                            </Button>

                            <button
                                onClick={handleResendMfa}
                                disabled={resendCooldown > 0}
                                className={`text-xs font-semibold hover:underline block mx-auto mt-2 ${resendCooldown > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-[#FE6132]'
                                    }`}
                            >
                                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Verification Code'}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
