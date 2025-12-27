"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import AuthRedirectGuard from "@/components/AuthRedirectGuard";
import { resendVerification } from "@/lib/authService";

export default function VerifyEmailPage() {
    return (
        <>
            <AuthRedirectGuard />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
                <VerifyContent />
            </Suspense>
        </>
    );
}

function VerifyContent() {
    const searchParams = useSearchParams();
    const email = searchParams?.get("email") || "";
    const [resendStatus, setResendStatus] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleResend = async () => {
        if (!email) return;
        setIsSending(true);
        setResendStatus("");
        try {
            const data = await resendVerification(email);
            setResendStatus(data.message || "Verification email resent. Check your inbox (or spam).");
            // start cooldown (30s)
            setCooldown(30);
            const iv = setInterval(() => {
                setCooldown((c) => {
                    if (c <= 1) {
                        clearInterval(iv);
                        return 0;
                    }
                    return c - 1;
                });
            }, 1000);
        } catch (err) {
            setResendStatus(err instanceof Error ? err.message : "Failed to resend verification email.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-linear-to-b from-purple-50 via-white to-amber-50 py-20 px-4 relative overflow-hidden">
            {/* Subtle decorative blobs */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Card Container */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100/50">
                    {/* Decorative header line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-linear-to-r from-amber-400 to-purple-500 rounded-full"></div>

                    {/* Header */}
                    <div className="mb-8 pt-4 text-center">
                        <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent mb-2">
                            ✉️ Verify Your Email
                        </h1>
                        <p className="text-gray-600 text-sm">We sent a verification link to your inbox</p>
                    </div>

                    {/* Email Display */}
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 text-center">
                        <p className="text-xs text-gray-600 mb-1">Verification email sent to:</p>
                        <p className="text-lg font-semibold text-purple-700 break-all">{email || "your email"}</p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            📬 Check your inbox (or spam folder) and click the verification link to activate your account.
                        </p>
                    </div>

                    {/* Status Message */}
                    {resendStatus && (
                        <div className={`p-3 rounded-xl mb-4 text-sm ${resendStatus.includes("copied")
                            ? "bg-blue-50 border border-blue-200 text-blue-800"
                            : resendStatus.includes("resent")
                                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                                : "bg-red-50 border border-red-200 text-red-800"
                            }`}>
                            {resendStatus}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={handleResend}
                            disabled={!email || isSending || cooldown > 0}
                            className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            {isSending && <Spinner size={16} />}
                            <span>{isSending ? "Sending..." : cooldown > 0 ? `Resend (${cooldown}s)` : "Resend Verification Email"}</span>
                        </button>

                        <button
                            onClick={() => {
                                if (!email) return;
                                navigator.clipboard?.writeText(email).catch(() => { });
                                setResendStatus("✅ Email copied to clipboard");
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition-all"
                        >
                            📋 Copy Email
                        </button>

                        <Link href="/login" className="w-full px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-center transition-all block">
                            🔐 Go to Login
                        </Link>
                    </div>

                    {/* Footer Info */}
                    <div className="text-center border-t border-gray-200 pt-4">
                        <p className="text-xs text-gray-500">No email? Check your spam folder or try resending above.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
