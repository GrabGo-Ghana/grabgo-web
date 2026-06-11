'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Input, Button, Badge } from '@grabgo/ui';
import { apiClient } from '@grabgo/utils';
import { ShieldCheck, Mail, Key, Check, Phone, ArrowRight, Xmark } from 'iconoir-react';

function AcceptInviteForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [verifyingInvite, setVerifyingInvite] = useState(true);
    const [error, setError] = useState('');
    const [inviteData, setInviteData] = useState<any>(null);

    // Form inputs
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    // Status text
    const [otpError, setOtpError] = useState('');
    const [otpMessage, setOtpMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invitation code token is missing.');
            setLoading(false);
            setVerifyingInvite(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await apiClient.get(`/admin-invites/${token}`);
                if (res.data.success) {
                    setInviteData(res.data.data);
                } else {
                    setError(res.data.message || 'Invitation is invalid or expired.');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Verification of invitation token failed.');
            } finally {
                setLoading(false);
                setVerifyingInvite(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSendOtp = async () => {
        if (!token) return;
        setOtpError('');
        setOtpMessage('');
        try {
            const res = await apiClient.post(`/admin-invites/${token}/otp/send`, {
                phone: inviteData?.phone
            });
            if (res.data.success) {
                setIsOtpSent(true);
                setOtpMessage(res.data.message || 'Verification code sent.');
                // Dev auto-fill in development if provided in backend payload
                if (res.data.otp) {
                    console.log('Development OTP code:', res.data.otp);
                }
            }
        } catch (err: any) {
            setOtpError(err.response?.data?.message || 'Failed to send OTP.');
        }
    };

    const handleVerifyOtp = async () => {
        if (!token || !otp) return;
        setOtpError('');
        setOtpMessage('');
        try {
            const res = await apiClient.post(`/admin-invites/${token}/otp/verify`, {
                otp,
                phone: inviteData?.phone
            });
            if (res.data.success) {
                setIsPhoneVerified(true);
                setOtpMessage('Phone number verified successfully.');
            }
        } catch (err: any) {
            setOtpError(err.response?.data?.message || 'Incorrect OTP code.');
        }
    };

    const handleAccept = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (!isPhoneVerified) {
            alert('MFA security verification is required to complete onboarding.');
            return;
        }
        if (!token) return;

        setSubmitting(true);
        try {
            const res = await apiClient.post(`/admin-invites/${token}/accept`, {
                password
            });
            if (res.data.success) {
                setSuccessMessage(res.data.message || 'Onboarding completed successfully.');
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to accept invitation.');
        } finally {
            setSubmitting(false);
        }
    };

    if (verifyingInvite) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh]">
                <div className="w-10 h-10 border-4 border-[#FE6132] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground text-sm font-medium">Validating invitation credentials...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <Xmark className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Invitation Invalid</h1>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                    {error}
                </p>
                <Button
                    onClick={() => router.push('/login')}
                    className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold"
                >
                    Return to Login
                </Button>
            </div>
        );
    }

    if (successMessage) {
        return (
            <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Account Activated!</h1>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                    Your administrator profile is now active. You can proceed to the dashboard log-in.
                </p>
                <Button
                    onClick={() => router.push('/login')}
                    className="mt-6 bg-[#FE6132] hover:bg-[#FE6132]/95 text-white font-semibold flex items-center justify-center gap-2 mx-auto"
                >
                    Proceed to Login
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-12 h-12 rounded-none bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 flex items-center justify-center text-white mx-auto mb-4">
                    <ShieldCheck className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Join GrabGo Admin</h1>
                <p className="text-muted-foreground text-sm mt-1">Configure your login credentials to finalize onboarding.</p>
            </div>

            <Card className="p-6 border-border/50">
                <form onSubmit={handleAccept} className="space-y-5">
                    {/* User Metadata */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-accent/20 border border-border/50 rounded-sm text-sm">
                        <div>
                            <span className="text-xs uppercase text-muted-foreground font-semibold block mb-1">Email</span>
                            <span className="font-medium text-foreground">{inviteData?.email}</span>
                        </div>
                        <div>
                            <span className="text-xs uppercase text-muted-foreground font-semibold block mb-1">Username</span>
                            <span className="font-medium text-foreground">{inviteData?.username}</span>
                        </div>
                    </div>

                    {/* Phone OTP Verification */}
                    <div className="border border-border/50 p-4 rounded-sm bg-accent/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#FE6132]" />
                                <span className="text-sm font-semibold">Phone MFA Authentication</span>
                            </div>
                            {isPhoneVerified ? (
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-bold">Verified</Badge>
                            ) : (
                                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-bold">Action Required</Badge>
                            )}
                        </div>

                        {!isPhoneVerified && (
                            <div className="space-y-3">
                                <p className="text-xs text-muted-foreground">
                                    MFA is mandatory. Verification will be sent to: <span className="font-medium text-foreground">{inviteData?.phone}</span>
                                </p>

                                {!isOtpSent ? (
                                    <Button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold"
                                    >
                                        Send Security OTP Code
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                            placeholder="Enter 6-digit code"
                                            className="text-center font-bold tracking-widest"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            className="bg-[#FE6132] hover:bg-[#FE6132]/95 text-white font-semibold"
                                        >
                                            Verify
                                        </Button>
                                    </div>
                                )}

                                {otpMessage && <p className="text-xs text-green-500 font-semibold text-center">{otpMessage}</p>}
                                {otpError && <p className="text-xs text-destructive font-semibold text-center">{otpError}</p>}
                            </div>
                        )}

                        {isPhoneVerified && (
                            <p className="text-xs text-green-500 font-semibold flex items-center gap-1.5 justify-center">
                                <Check className="w-4 h-4" /> MFA configuration verified.
                            </p>
                        )}
                    </div>

                    {/* Password Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">Create Password</label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-11"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">Confirm Password</label>
                            <Input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-11"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={submitting || !isPhoneVerified || password !== confirmPassword || password.length < 8}
                        className="w-full h-11 bg-[#FE6132] hover:bg-[#FE6132]/95 text-white font-semibold mt-4 shadow-lg shadow-[#FE6132]/25"
                    >
                        {submitting ? 'Finalizing Profile Setup...' : 'Finalize Profile & Onboard'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default function AcceptInvitePage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh]">
                <div className="w-10 h-10 border-4 border-[#FE6132] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground text-sm font-medium">Loading layout context...</p>
            </div>
        }>
            <AcceptInviteForm />
        </Suspense>
    );
}
