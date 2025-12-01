import LoginForm from "@/components/LoginForm";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Link from "next/link";

export const metadata = {
    title: "Login - Webnovel",
    description: "Sign in to your Webnovel account",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-purple-50 via-white to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle decorative blobs - top right */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>

            {/* Subtle decorative blobs - bottom left */}
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Card Container */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100/50">
                    {/* Decorative header line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-linear-to-r from-amber-400 to-purple-500 rounded-full"></div>

                    {/* Header */}
                    <div className="mb-8 pt-2">
                        <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent mb-2">Welcome back</h1>
                        <p className="text-gray-600">Continue your literary journey</p>
                    </div>

                    {/* OAuth Options */}
                    <div className="mb-6">
                        <GoogleLoginButton />
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-linear-to-r from-transparent via-purple-300 to-transparent"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white/95 text-gray-500 text-xs uppercase tracking-widest font-medium">Or</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <LoginForm />

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600 text-sm mt-6">
                        New reader?{" "}
                        <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                            Create account
                        </Link>
                    </p>

                    {/* Additional Links */}
                    <div className="mt-6 pt-6 border-t border-purple-100/30 space-y-2 text-center">
                        <p className="text-xs text-gray-500">
                            By signing in, you agree to our{" "}
                            <a href="/terms" className="text-purple-600 hover:underline font-medium">
                                Terms
                            </a>
                            {" "}and{" "}
                            <a href="/privacy" className="text-purple-600 hover:underline font-medium">
                                Privacy
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6 space-x-4 flex justify-center">
                    <a href="/support" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                        Help
                    </a>
                    <span>•</span>
                    <a href="/about" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                        About
                    </a>
                </p>
            </div>
        </div>
    );
}
