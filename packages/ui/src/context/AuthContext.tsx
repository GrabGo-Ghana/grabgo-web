'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { authService } from '@grabgo/utils';
import type { User, AuthState, LoginCredentials, AuthResponse } from '@grabgo/utils';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<AuthResponse | void>;
    verifyMfa: (mfaChallengeToken: string, otp: string) => Promise<AuthResponse | void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Prevent concurrent logout operations
    const isLoggingOut = useRef(false);

    // Check for existing session on mount
    useEffect(() => {
        let isMounted = true; // Cleanup flag

        const initAuth = async () => {
            // SSR safety check
            if (typeof window === 'undefined') {
                if (isMounted) {
                    setState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
                return;
            }

            const token = localStorage.getItem('grabgo_admin_token');
            const storedUser = authService.getStoredUser();

            if (token && storedUser) {
                // Verify token is still valid
                try {
                    const { user } = await authService.getCurrentUser();

                    // Check if user is admin (case-insensitive)
                    if (!user || (user.role?.toLowerCase() !== 'admin' && !user.isAdmin)) {
                        throw new Error('Unauthorized: Admin access required');
                    }

                    if (isMounted) {
                        setState({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    // Invalid token or not admin
                    localStorage.removeItem('grabgo_admin_token');
                    localStorage.removeItem('grabgo_admin_user');
                    if (isMounted) {
                        setState({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                }
            } else {
                if (isMounted) {
                    setState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            }
        };

        initAuth();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const res = await authService.login(credentials);

            if (res.requiresMfa) {
                return res;
            }

            const { user, token } = res;
            if (!user || !token) {
                throw new Error('Invalid authentication response');
            }

            // Verify user is admin (case-insensitive)
            if (user.role?.toLowerCase() !== 'admin' && !user.isAdmin) {
                await authService.logout();
                throw new Error('Unauthorized: Admin access required');
            }

            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });

            // Redirect to dashboard
            router.push('/');
            return res;
        } catch (error) {
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
            throw error;
        }
    };

    const verifyMfa = async (mfaChallengeToken: string, otp: string) => {
        try {
            const res = await authService.verifyMfa(mfaChallengeToken, otp);
            const { user, token } = res;

            if (!user || !token) {
                throw new Error('Invalid verification response');
            }

            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });

            router.push('/');
            return res;
        } catch (error) {
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
            throw error;
        }
    };

    const logout = async () => {
        // Prevent concurrent logout operations
        if (isLoggingOut.current) {
            return;
        }

        isLoggingOut.current = true;

        try {
            await authService.logout();
        } finally {
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
            isLoggingOut.current = false;
            router.push('/login');
        }
    };

    const refreshUser = async () => {
        try {
            const { user } = await authService.getCurrentUser();
            setState(prev => {
                if (!user) return prev;

                const updatedUser = {
                    ...prev.user,
                    ...user,
                };

                return {
                    ...prev,
                    user: updatedUser,
                };
            });
        } catch (error) {
            // If refresh fails, log out (protected by race condition flag)
            await logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                verifyMfa,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function hasPermission(user: User | null, permission: string | string[]): boolean {
    if (!user) return false;
    if (user.isSuperAdmin) return true;
    const list = Array.isArray(permission) ? permission : [permission];
    return list.some(p => (user as any)[p] === true);
}
