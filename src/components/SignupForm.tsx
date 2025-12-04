"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validateCompleteSignup } from "@/lib/authValidation";
import { signupUser } from "@/lib/authService";
import Spinner from "@/components/Spinner";

export default function SignupForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate form
        const validation = validateCompleteSignup(name, email, password, confirmPassword, gender, dob);
        if (!validation.valid) {
            setErrors(validation.errors);
            setIsLoading(false);
            return;
        }

        setErrors({});

        try {
            // Call backend API
            const response = await signupUser({
                name,
                email,
                password,
                gender,
                dob,
            });

            if (response.success) {
                // Reset form
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setGender("");
                setDob("");

                // Show quick success message then navigate to verification screen
                setSuccessMsg(`Account created — check ${email} for a verification email`);
                setTimeout(() => {
                    try {
                        router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
                    } catch (err) {
                        window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
                    }
                }, 700);
                return;
            }
        } catch (error) {
            setErrors({ submit: error instanceof Error ? error.message : "Signup failed" });
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                    <p className="text-emerald-700 text-sm">✅ {successMsg}</p>
                </div>
            )}
            {/* Full Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    👤 Full Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.name
                        ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                        : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300 text-black"
                        }`}
                    disabled={isLoading}
                    maxLength={50}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1.5 font-medium">{errors.name}</p>}
            </div>

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
                    autoComplete="email"
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

            {/* Gender Field */}
            <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                    ⚧️ Gender
                </label>
                <select
                    id="gender"
                    name="gender"
                    autoComplete="sex"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.gender
                        ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                        : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300 text-black"
                        }`}
                    disabled={isLoading}
                >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
                {errors.gender && <p className="text-red-600 text-sm mt-1.5 font-medium">{errors.gender}</p>}
            </div>

            {/* Date of Birth Field */}
            <div>
                <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-2">
                    🎂 Date of Birth
                </label>
                <input
                    id="dob"
                    name="bday"
                    type="date"
                    autoComplete="bday"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.dob
                        ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                        : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300 text-black"
                        }`}
                    disabled={isLoading}
                />
                {errors.dob && <p className="text-red-600 text-sm mt-1.5 font-medium">{errors.dob}</p>}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    🔐 Password
                </label>
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
                        name="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                            ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                            : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300 text-black"
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
                className="w-full inline-flex items-center justify-center gap-3 bg-linear-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg mt-2"
            >
                {isLoading && <Spinner size={16} />}
                <span>{isLoading ? "✨ Creating Account..." : "✨ Start Your Journey"}</span>
            </button>
        </form>
    );
}