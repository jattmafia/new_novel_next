import Image from "next/image";
import ProfileOwnerView from "../../components/ProfileOwnerView";
import LogoutButton from "../../components/LogoutButton";

interface Props {
    params: { username: string } | Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: Props) {
    const resolvedParams = await params;
    const username = resolvedParams?.username ?? "";

    return (
        <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute -top-96 -left-96 w-full h-full bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/4 -right-96 w-full h-full bg-amber-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-0 left-1/3 w-full h-full bg-purple-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '4s' }}></div>

            {/* Gradient veil */}
            <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/90 to-slate-950 pointer-events-none"></div>

            <div className="relative z-10">
                {/* Header/Navigation */}
                <header className="border-b border-purple-500/10 bg-slate-950/50 backdrop-blur-2xl sticky top-0 z-40">
                    <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between relative z-10">
                        <a href="/" className="group flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-500/30 group-hover:shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300">
                                R
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-lg font-black bg-linear-to-r from-purple-300 to-amber-300 bg-clip-text text-transparent">Rowllr</div>
                            </div>
                        </a>

                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search creators..."
                                className="hidden md:block px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all text-sm"
                            />
                            <ProfileOwnerView username={username}>
                                <LogoutButton />
                            </ProfileOwnerView>
                        </div>
                    </div>
                </header>

                {/* Hero Background with Cover Image */}
                <div className="h-64 md:h-80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-600/30 via-transparent to-amber-600/20"></div>
                    <div className="absolute inset-0 backdrop-blur-sm"></div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    {/* Profile Header - Overlapping */}
                    <div className="flex flex-col md:flex-row gap-8 -mt-32 mb-16 relative z-20">
                        {/* Avatar with Enhanced Badge */}
                        <div className="shrink-0">
                            <div className="relative inline-block group">
                                <div className="w-48 h-48 rounded-3xl bg-linear-to-br from-purple-500 via-purple-400 to-amber-500 flex items-center justify-center text-7xl font-black shadow-2xl shadow-purple-500/60 group-hover:shadow-3xl group-hover:shadow-purple-500/80 transition-all duration-300 group-hover:scale-105 ring-4 ring-slate-950">
                                    {username ? username.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-2xl shadow-amber-500/50 ring-4 ring-slate-950">
                                    ⭐
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="grow pt-8 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-6xl md:text-7xl font-black leading-tight">
                                        <span className="block bg-linear-to-r from-purple-300 via-purple-200 to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
                                            {username}
                                        </span>
                                    </h1>
                                    <span className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 text-sm font-bold text-purple-200">
                                        ✨ Verified Creator
                                    </span>
                                </div>
                                <p className="text-2xl text-gray-300 font-semibold">Premium Storyteller</p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-4 pt-6">
                                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all group cursor-default">
                                    <p className="text-4xl font-black bg-linear-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">0</p>
                                    <p className="text-sm text-gray-400 font-semibold mt-1">Stories</p>
                                </div>
                                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all group cursor-default">
                                    <p className="text-4xl font-black bg-linear-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">0</p>
                                    <p className="text-sm text-gray-400 font-semibold mt-1">Followers</p>
                                </div>
                                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all group cursor-default">
                                    <p className="text-4xl font-black bg-linear-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">0</p>
                                    <p className="text-sm text-gray-400 font-semibold mt-1">Reads</p>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                                Crafting stories that move hearts and inspire minds. Join my community of passionate readers and let's create magic together.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex gap-3 pt-4 flex-wrap">
                                <ProfileOwnerView username={username}>
                                    {/* Owner View */}
                                    <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-purple-600 to-amber-500 rounded-xl font-bold text-white text-lg shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
                                        <span className="relative z-10">📖 New Story</span>
                                    </button>
                                    <button className="px-8 py-4 border-2 border-purple-500/40 rounded-xl font-bold text-purple-200 hover:border-purple-500/80 hover:bg-purple-500/10 transition-all duration-300 text-lg">
                                        ⚙️ Manage
                                    </button>
                                </ProfileOwnerView>
                                <ProfileOwnerView username={username}>
                                    {/* Fallback for non-owners */}
                                    <>
                                        <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-purple-600 to-amber-500 rounded-xl font-bold text-white text-lg shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 active:scale-95">
                                            <span className="relative z-10">💜 Follow</span>
                                        </button>
                                        <button className="px-8 py-4 border-2 border-purple-500/40 rounded-xl font-bold text-purple-200 hover:border-purple-500/80 hover:bg-purple-500/10 transition-all duration-300 text-lg">
                                            💬 Connect
                                        </button>
                                    </>
                                </ProfileOwnerView>
                            </div>
                        </div>
                    </div>

                    {/* Featured Stories Section */}
                    <div className="mt-20 space-y-12">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-5xl font-black bg-linear-to-r from-purple-300 to-amber-300 bg-clip-text text-transparent">Featured Works</h2>
                                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-sm font-bold text-amber-300">NEW</span>
                            </div>
                            <p className="text-lg text-gray-400">Discover the best stories from this creator</p>
                        </div>

                        {/* Stories Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Empty State Card */}
                            <div className="md:col-span-2 lg:col-span-3">
                                <div className="group relative border-2 border-dashed border-purple-500/40 rounded-3xl p-20 text-center backdrop-blur-sm bg-linear-to-br from-purple-500/10 to-amber-500/5 hover:border-purple-500/70 hover:bg-purple-500/20 transition-all duration-300 cursor-pointer overflow-hidden">
                                    {/* Background animation */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-amber-500/10 animate-pulse"></div>
                                    </div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="text-8xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-300">📚</div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black">No Published Stories Yet</h3>
                                            <p className="text-gray-400 text-lg">This creator is just getting started. Check back soon for amazing stories!</p>
                                        </div>
                                        <ProfileOwnerView username={username}>
                                            <button className="px-8 py-4 bg-linear-to-r from-purple-600 to-amber-500 rounded-xl font-bold text-white text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105">
                                                ✨ Publish Your First Story
                                            </button>
                                        </ProfileOwnerView>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="mt-24 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 space-y-8 hover:border-white/40 transition-all duration-300">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black bg-linear-to-r from-purple-300 to-amber-300 bg-clip-text text-transparent">About this Creator</h3>
                            <div className="w-20 h-1 bg-linear-to-r from-purple-500 to-amber-500 rounded-full"></div>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {username} hasn't shared their story yet, but their words are about to inspire thousands. Stay tuned for their debut on Rowllr!
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                            <div className="space-y-2 group hover:bg-white/5 p-4 rounded-xl transition-all">
                                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Join Date</p>
                                <p className="font-bold text-lg">Today</p>
                            </div>
                            <div className="space-y-2 group hover:bg-white/5 p-4 rounded-xl transition-all">
                                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Genre</p>
                                <p className="font-bold text-lg">All</p>
                            </div>
                            <div className="space-y-2 group hover:bg-white/5 p-4 rounded-xl transition-all">
                                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Language</p>
                                <p className="font-bold text-lg">English</p>
                            </div>
                            <div className="space-y-2 group hover:bg-white/5 p-4 rounded-xl transition-all">
                                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Status</p>
                                <p className="font-bold text-lg text-amber-400">Active</p>
                            </div>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="mt-24 space-y-8">
                        <h2 className="text-4xl font-black bg-linear-to-r from-purple-300 to-amber-300 bg-clip-text text-transparent">Support & Connect</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Subscribe Card */}
                            <div className="group backdrop-blur-xl bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-3xl p-8 hover:border-purple-500/60 hover:bg-purple-500/15 transition-all duration-300">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📧</div>
                                <h3 className="text-2xl font-black mb-2">Newsletter</h3>
                                <p className="text-gray-300 mb-6">Never miss a new story</p>
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-white/15 focus:outline-none transition-all"
                                        disabled
                                    />
                                    <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-white transition-all" disabled>
                                        Subscribe
                                    </button>
                                </div>
                            </div>

                            {/* Support Card */}
                            <div className="group backdrop-blur-xl bg-linear-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-3xl p-8 hover:border-amber-500/60 hover:bg-amber-500/15 transition-all duration-300">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">☕</div>
                                <h3 className="text-2xl font-black mb-2">Buy Coffee</h3>
                                <p className="text-gray-300 mb-6">Support their craft</p>
                                <button className="w-full px-4 py-3 bg-linear-to-r from-amber-600 to-orange-500 hover:shadow-lg hover:shadow-amber-500/50 rounded-xl font-bold text-white transition-all hover:scale-105">
                                    One Time Tip
                                </button>
                            </div>

                            {/* Membership Card */}
                            <div className="group backdrop-blur-xl bg-linear-to-br from-rose-500/10 to-pink-500/5 border border-rose-500/30 rounded-3xl p-8 hover:border-rose-500/60 hover:bg-rose-500/15 transition-all duration-300">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💝</div>
                                <h3 className="text-2xl font-black mb-2">Become Member</h3>
                                <p className="text-gray-300 mb-6">Exclusive perks</p>
                                <button className="w-full px-4 py-3 bg-linear-to-r from-rose-600 to-pink-500 hover:shadow-lg hover:shadow-rose-500/50 rounded-xl font-bold text-white transition-all hover:scale-105">
                                    Join Community
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="mt-20 flex items-center justify-center gap-6 pb-20">
                        <a href="#" className="p-4 rounded-full bg-white/10 border border-white/20 hover:border-white/50 hover:bg-white/20 transition-all group">
                            <span className="text-2xl group-hover:scale-125 transition-transform inline-block">🐦</span>
                        </a>
                        <a href="#" className="p-4 rounded-full bg-white/10 border border-white/20 hover:border-white/50 hover:bg-white/20 transition-all group">
                            <span className="text-2xl group-hover:scale-125 transition-transform inline-block">📘</span>
                        </a>
                        <a href="#" className="p-4 rounded-full bg-white/10 border border-white/20 hover:border-white/50 hover:bg-white/20 transition-all group">
                            <span className="text-2xl group-hover:scale-125 transition-transform inline-block">💬</span>
                        </a>
                        <a href="#" className="p-4 rounded-full bg-white/10 border border-white/20 hover:border-white/50 hover:bg-white/20 transition-all group">
                            <span className="text-2xl group-hover:scale-125 transition-transform inline-block">🔗</span>
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-purple-500/10 bg-slate-950/80 backdrop-blur relative z-10 mt-12">
                    <div className="mx-auto max-w-7xl px-6 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="space-y-4">
                                <h4 className="font-black text-lg">Rowllr</h4>
                                <p className="text-gray-400 text-sm">Empowering creators worldwide</p>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-bold text-white">Product</h4>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-purple-300 transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-purple-300 transition-colors">Pricing</a></li>
                                    <li><a href="#" className="hover:text-purple-300 transition-colors">Blog</a></li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-bold text-white">Company</h4>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-purple-300 transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-purple-300 transition-colors">Contact</a></li>
                                    <li><a href="#" className="hover:text-purple-300 transition-colors">Careers</a></li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-bold text-white">Legal</h4>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-purple-300 transition-colors">Privacy</a></li>
                                    <li><a href="#" className="hover:text-purple-300 transition-colors">Terms</a></li>
                                    <li><a href="#" className="hover:text-purple-300 transition-colors">Support</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-4">
                            <span className="font-semibold">© {new Date().getFullYear()} Rowllr. Creators First.</span>
                            <div className="flex gap-6">
                                <a href="#" className="hover:text-purple-400 transition-colors">Status</a>
                                <a href="#" className="hover:text-purple-400 transition-colors">API</a>
                                <a href="#" className="hover:text-purple-400 transition-colors">Accessibility</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
