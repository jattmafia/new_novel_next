"use client";

import { useState, FormEvent } from "react";
import { validateSignupForm } from "@/lib/validation";

export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate form
        const validation = validateSignupForm(email, password, confirmPassword);
        if (!validation.valid) {
            setErrors(validation.errors);
            setIsLoading(false);
            return;
        }

        setErrors({});

        // Simulate signup delay
        setTimeout(() => {
            // TODO: Connect to your external authentication service
            // (Firebase, Auth0, Supabase, etc.)
            console.log("Signup attempt:", { email, password, confirmPassword });
            alert(`🎉 Account created! Welcome to Webnovel, ${email}!`);
            setIsLoading(false);
            // Reset form
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            // Uncomment when you have real signup:
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
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    🔐 Password
                </label>
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
                <p className="text-xs text-gray-500 mt-2">
                    💡 8+ chars, uppercase, lowercase, and numbers
                </p>
            </div>
            {/* Confirm Password Field */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    ✔️ Confirm Password
                </label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                                ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                                : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300"
                            }`}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 font-medium text-xs transition-colors"
                        disabled={isLoading}
                    >
                        {showConfirmPassword ? "👁️" : "🔒"}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1.5 font-medium">{errors.confirmPassword}</p>}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center gap-2">
                <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    required
                    disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" className="text-purple-600 hover:underline font-medium">
                        Terms of Service
                    </a>
                </label>
            </div>

            {/* Submit Error */}
            {errors.submit && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm font-medium">❌ {errors.submit}</p>
                </div>
            )}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 disabled:from-purple-400 disabled:to-amber-400 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg mt-2"
            >
                {isLoading ? "✨ Creating Account..." : "✨ Start Your Journey"}
            </button>
        </form>
    );
}