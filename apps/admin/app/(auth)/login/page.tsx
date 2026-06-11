"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { Button, Input, Label, Card, useAuth } from "@grabgo/ui";
import { authService } from "@grabgo/utils";
import { ShieldCheck, WarningCircle, EyeClosed, Eye, NavArrowRight, Mail, Lock } from "iconoir-react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { login, verifyMfa, isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaChallengeToken, setMfaChallengeToken] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent concurrent submissions
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isForgotPassword) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          throw new Error('Please enter a valid email address');
        }
        await authService.forgotPassword({ email });
        setResetEmailSent(true);
      } else if (requiresMfa) {
        if (!otpCode || otpCode.length !== 6) {
          throw new Error('Please enter a valid 6-digit security code');
        }
        await verifyMfa(mfaChallengeToken, otpCode);
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          throw new Error('Please enter a valid email address');
        }
        if (!password || password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (!recaptchaToken) {
          throw new Error('Please complete the reCAPTCHA verification');
        }
        const res = await login({ email, password, role: 'admin', recaptchaToken: recaptchaToken || undefined });
        if (res && res.requiresMfa && res.mfaChallengeToken) {
          setRequiresMfa(true);
          setMfaChallengeToken(res.mfaChallengeToken);
          setOtpCode("");
          setError(null);
          // Reset reCAPTCHA since the token was consumed
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
          setRecaptchaToken(null);
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      // Reset reCAPTCHA on failed login
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
    setResetEmailSent(false);
    setPassword("");
    setError(null);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setResetEmailSent(false);
    setEmail("");
    setPassword("");
    setError(null);
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">

        {/* Left Side - Branding Section */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 animate-fade-in-left">
          <div className="space-y-4">
            {/* Logo with unique animation */}
            <div className="inline-flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-14 h-14 rounded-none flex items-center justify-center transition-colors duration-300" style={{ background: '#FE6132' }}>
                  <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
              </div>
            </div>

            <h2 className="text-5xl font-bold leading-tight">
              <span className="text-foreground">Admin</span>
              <br />
              <span style={{ color: '#FE6132' }}>
                Dashboard
              </span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-md">
              Manage your delivery platform with powerful tools and real-time insights.
            </p>
          </div>

          {/* Animated Stats Cards - Unique feature */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            {[
              { label: "Active Orders", value: "1,234", delay: "0ms" },
              { label: "Total Revenue", value: "GH₵45.2K", delay: "100ms" },
            ].map((stat, i) => (
              <Card
                key={i}
                className="p-4 border-primary/20 bg-card/60 hover:border-primary/40 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: stat.delay }}
              >
                <div className="text-3xl font-bold" style={{ color: '#FE6132' }}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto animate-fade-in-right">
          <Card className="p-8 border-primary/20 bg-card">
            <div
              key={isForgotPassword ? (resetEmailSent ? 'success' : 'forgot') : 'login'}
              className="space-y-6 animate-fade-in"
            >
              {/* Header */}
              <div className="space-y-2 text-center lg:text-left">
                <h3 className="text-2xl font-bold tracking-tight">
                  {resetEmailSent ? "Check your email" : isForgotPassword ? "Reset your password" : "Welcome back"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {resetEmailSent
                    ? "We've sent a password reset link to your email address"
                    : isForgotPassword
                      ? "Enter your email address and we'll send you a reset link"
                      : "Enter your credentials to access your account"}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="rounded-none p-4 animate-fade-in border border-red-200/80 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <WarningCircle className="w-5 h-5 mt-0.5 text-red-500 dark:text-red-400" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                        {error.includes('CORS') || error.includes('Network') || error.includes('Failed to fetch')
                          ? 'Connection Error'
                          : 'Authentication Failed'}
                      </h3>
                      <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                        {error.includes('CORS') || error.includes('Network') || error.includes('Failed to fetch')
                          ? 'Unable to connect to the server. Please check your internet connection or try again later.'
                          : error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {requiresMfa ? (
                  <div className="space-y-4">
                    <div className="space-y-2 group">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="otpCode" className="text-sm font-medium">
                          Security OTP Code
                        </Label>
                        <button
                          type="button"
                          onClick={() => {
                            setRequiresMfa(false);
                            setMfaChallengeToken("");
                            setOtpCode("");
                            setError(null);
                            // Reset reCAPTCHA on going back to credentials
                            if (recaptchaRef.current) {
                              recaptchaRef.current.reset();
                            }
                            setRecaptchaToken(null);
                          }}
                          className="text-xs font-medium transition-colors"
                          style={{ color: '#FE6132' }}
                        >
                          Back to Sign In
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="otpCode"
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit MFA code"
                          value={otpCode}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          className="h-11 pl-10 text-center font-bold tracking-widest text-lg border-input transition-all duration-200"
                          style={{ outline: 'none' }}
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.target.style.borderColor = '#FE6132';
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.target.style.borderColor = '';
                          }}
                          required
                        />
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Email Field */}
                    <div className="space-y-2 group">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@grabgo.com"
                          value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                          className="h-11 pl-10 border-input transition-all duration-200"
                          style={{ outline: 'none' }}
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.target.style.borderColor = '#FE6132';
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.target.style.borderColor = '';
                          }}
                          required
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Password Field - Only show for login */}
                    {!isForgotPassword && !resetEmailSent && (
                      <div className="space-y-2 group">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-sm font-medium">
                            Password
                          </Label>
                          <button
                            type="button"
                            onClick={handleForgotPasswordClick}
                            className="text-xs font-medium transition-colors"
                            style={{ color: '#FE6132' }}
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            className="h-11 pl-10 pr-10 border-input transition-all duration-200"
                            style={{ outline: 'none' }}
                            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                              e.target.style.borderColor = '#FE6132';
                            }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              e.target.style.borderColor = '';
                            }}
                            required
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={2} />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeClosed className="w-5 h-5" strokeWidth={2} />
                            ) : (
                              <Eye className="w-5 h-5" strokeWidth={2} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Google reCAPTCHA Checkbox Widget */}
                    {!isForgotPassword && !resetEmailSent && (
                      <div className="flex justify-center py-2 animate-fade-in">
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                          onChange={(token) => setRecaptchaToken(token)}
                          theme="light"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Submit Button with unique loading animation */}
                {!resetEmailSent ? (
                  <Button
                    type="submit"
                    className="w-full h-11 text-white font-medium transition-all duration-300 relative overflow-hidden group"
                    style={{ background: '#FE6132' }}
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          {isForgotPassword ? "Sending link..." : requiresMfa ? "Verifying..." : "Signing in..."}
                        </>
                      ) : (
                        <>
                          {isForgotPassword ? "Send reset link" : requiresMfa ? "Verify & Sign in" : "Sign in"}
                          <NavArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full h-11 text-white font-medium transition-all duration-300 relative overflow-hidden group"
                    style={{ background: '#FE6132' }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <NavArrowRight className="w-4 h-4 rotate-180" strokeWidth={2} />
                      Back to Login
                    </span>
                  </Button>
                )}
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-muted-foreground pt-4">
                {isForgotPassword || resetEmailSent ? (
                  <button
                    onClick={handleBackToLogin}
                    className="font-medium transition-colors hover:opacity-80 flex items-center justify-center w-full gap-2"
                    style={{ color: '#FE6132' }}
                  >
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Back to login
                  </button>
                ) : (
                  <>
                    Need help?{" "}
                    <button className="font-medium transition-colors" style={{ color: '#FE6132' }}>
                      Contact support
                    </button>
                  </>
                )}
              </p>
            </div>
          </Card>

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mt-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium">GrabGo Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
