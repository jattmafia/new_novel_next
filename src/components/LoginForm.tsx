"use client";

import { useState, FormEvent } from "react";
import { validateLoginForm } from "@/lib/validation";
import { loginUser } from "@/lib/authService";
import Spinner from "@/components/Spinner";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
        const proto = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : "";
        const buildProfileUrl = (u: string) =>
            APP_DOMAIN ? `${proto}//${encodeURIComponent(u)}.${APP_DOMAIN}${port}` : `/${encodeURIComponent(u)}`;
        const createProfileUrl = () => (APP_DOMAIN ? `${proto}//${APP_DOMAIN}${port}/auth/create-profile` : "/auth/create-profile");

        // Validate form
        const validation = validateLoginForm(email, password);
        if (!validation.valid) {
            setErrors(validation.errors);
            setIsLoading(false);
            return;
        }

        setErrors({});

        try {
            // Call backend API
            const response = await loginUser({ email, password });

            if (response.success) {
                // Check if email is verified
                if (!response.data?.isEmailVerified) {
                    // Route to email verification page
                    setTimeout(() => {
                        window.location.href = `/auth/verify?email=${encodeURIComponent(response.data?.email || email)}`;
                    }, 500);
                    return;
                }

                // Check if profile/username exists
                if (!response.data?.profile?.username) {
                    // Store token temporarily for profile creation
                    if (response.data?.token) {
                        localStorage.setItem("authToken", response.data.token);
                    }
                    // Route to create profile page
                    setTimeout(() => {
                        window.location.href = createProfileUrl();
                    }, 500);
                    return;
                }

                alert(`🎉 Welcome back ${response.data?.name}!`);

                // Store token if provided
                if (response.data?.token) {
                    localStorage.setItem("authToken", response.data.token);
                }

                // Persist username and redirect to their profile path
                const username = response.data?.profile?.username;
                if (username) {
                    try {
                        localStorage.setItem("webnovelUsername", username);
                    } catch (e) {
                        // ignore
                    }
                    setTimeout(() => {
                        // Pass token and username to allow session sync on the subdomain
                        const targetUrl = buildProfileUrl(username);
                        const sep = targetUrl.includes("?") ? "&" : "?";
                        window.location.href = `${targetUrl}${sep}s_token=${encodeURIComponent(response.data?.token || "")}&s_user=${encodeURIComponent(username)}`;
                    }, 500);
                    return;
                }
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Login failed";

            // Check if error is about email verification
            if (errorMsg.toLowerCase().includes("verify") && errorMsg.toLowerCase().includes("email")) {
                // Route to email verification page
                setTimeout(() => {
                    window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
                }, 500);
                return;
            }

            setErrors({ submit: errorMsg });
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    📧 Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email
                        ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                        : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300 text-black"
                        }`}
                    disabled={isLoading}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1.5 font-medium">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                        🔐 Password
                    </label>
                    <a href="/forgot-password" className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors">
                        Forgot?
                    </a>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password
                            ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                            : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300 text-black"
                            }`}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 font-medium text-xs transition-colors"
                        disabled={isLoading}
                    >
                        {showPassword ? "👁️" : "🔒"}
                    </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1.5 font-medium">{errors.password}</p>}
            </div>

            {/* Submit Error */}
            {errors.submit && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm font-medium">❌ {errors.submit}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-3 bg-linear-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg mt-2"
            >
                {isLoading && <Spinner size={16} />}
                <span>{isLoading ? "✨ Entering..." : "✨ Enter Your Library"}</span>
            </button>
        </form>
    );
}
