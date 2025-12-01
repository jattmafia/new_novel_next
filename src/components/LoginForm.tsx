"use client";

import { useState, FormEvent } from "react";
import { validateLoginForm } from "@/lib/validation";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate form
        const validation = validateLoginForm(email, password);
        if (!validation.valid) {
            setErrors(validation.errors);
            setIsLoading(false);
            return;
        }

        setErrors({});

        // Simulate login delay
        setTimeout(() => {
            // TODO: Connect to your external authentication service
            // (Firebase, Auth0, Supabase, etc.)
            console.log("Login attempt:", { email, password });
            alert(`Welcome ${email}! (Demo only - implement real auth)`);
            setIsLoading(false);
            // Uncomment when you have real auth:
            // window.location.href = "/dashboard";
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    📧 Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email
                        ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                        : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300"
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
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password
                            ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                            : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300"
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
                className="w-full bg-linear-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 disabled:from-purple-400 disabled:to-amber-400 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg mt-2"
            >
                {isLoading ? "✨ Entering..." : "✨ Enter Your Library"}
            </button>
        </form>
    );
}
