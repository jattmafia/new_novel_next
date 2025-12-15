import Link from "next/link";

interface UserNotFoundProps {
    username: string;
}

export default function UserNotFound({ username }: UserNotFoundProps) {
    return (
        <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center">
            {/* Animated gradient orbs */}
            <div className="absolute -top-96 -left-96 w-full h-full bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/4 -right-96 w-full h-full bg-amber-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob" style={{ animationDelay: '2s' }}></div>

            {/* Gradient veil */}
            <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/90 to-slate-950 pointer-events-none"></div>

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                {/* 404 Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-purple-500/10 border border-purple-500/30 mb-6">
                        <span className="text-7xl">👤</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl sm:text-6xl font-black mb-4">
                    <span className="bg-linear-to-r from-purple-300 via-purple-200 to-amber-300 bg-clip-text text-transparent">
                        User Not Found
                    </span>
                </h1>

                {/* Username */}
                <div className="mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
                        <span className="text-gray-400">@</span>
                        <span className="font-mono text-purple-200">{username}</span>
                    </span>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto">
                    The creator you're looking for doesn't exist or may have changed their username.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-purple-600 to-amber-500 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                    >
                        <span>← Go Home</span>
                    </Link>
                </div>

                {/* Decorative element */}
                <div className="mt-16 flex items-center justify-center gap-3">
                    <div className="w-12 h-px bg-linear-to-r from-transparent to-purple-500/50"></div>
                    <img src="/logo.png" alt="Rowllr" className="w-8 h-8 rounded-lg opacity-50" />
                    <div className="w-12 h-px bg-linear-to-l from-transparent to-purple-500/50"></div>
                </div>
            </div>
        </main>
    );
}
