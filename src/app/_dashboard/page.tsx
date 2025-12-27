import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-amber-950 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: "2s" }}></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: "4s" }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                                    📚 WebNovel
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">Your story reading companion</p>
                            </div>
                            {/* Logout handled by client component to avoid passing event handlers from server */}
                            <div>
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    {/* Welcome card */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Welcome to WebNovel! 🎉
                        </h2>
                        <p className="text-gray-300">
                            Your authentication flow is complete. This is your dashboard page.
                        </p>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Story Discovery */}
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                            <div className="text-4xl mb-4">📖</div>
                            <h3 className="text-xl font-bold text-white mb-2">Discover Stories</h3>
                            <p className="text-gray-300">
                                Browse thousands of stories across different genres and find your next favorite read.
                            </p>
                        </div>

                        {/* Bookmarks */}
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                            <div className="text-4xl mb-4">🔖</div>
                            <h3 className="text-xl font-bold text-white mb-2">Bookmarks</h3>
                            <p className="text-gray-300">
                                Save your favorite stories and keep track of where you left off reading.
                            </p>
                        </div>

                        {/* Reading History */}
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="text-xl font-bold text-white mb-2">Reading History</h3>
                            <p className="text-gray-300">
                                View your complete reading history and resume stories anytime.
                            </p>
                        </div>

                        {/* Recommendations */}
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                            <div className="text-4xl mb-4">⭐</div>
                            <h3 className="text-xl font-bold text-white mb-2">Recommendations</h3>
                            <p className="text-gray-300">
                                Get personalized story recommendations based on your reading preferences.
                            </p>
                        </div>

                        {/* Collections */}
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                            <div className="text-4xl mb-4">📚</div>
                            <h3 className="text-xl font-bold text-white mb-2">Collections</h3>
                            <p className="text-gray-300">
                                Create and manage your personal collections of favorite stories.
                            </p>
                        </div>

                        {/* Profile */}
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                            <div className="text-4xl mb-4">👤</div>
                            <h3 className="text-xl font-bold text-white mb-2">Profile</h3>
                            <p className="text-gray-300">
                                View and manage your profile, preferences, and account settings.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-400">
                        <p>🚀 Your WebNovel adventure starts here. Happy reading!</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
