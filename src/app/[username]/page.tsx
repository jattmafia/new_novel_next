import Image from "next/image";
import { Metadata } from "next";
import ProfileOwnerView from "../../components/ProfileOwnerView";
import LogoutButton from "../../components/LogoutButton";
import NewChapterModal from "../../components/NewChapterModal";
import NewStoryModal from "../../components/NewStoryModal";
import UserNotFound from "../../components/UserNotFound";
import { API_BASE, imageUrl } from '@/lib/config';

interface Props {
    params: { username: string } | Promise<{ username: string }>;
}

// Dynamic metadata for browser tab title
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const username = resolvedParams?.username ?? "";

    // Check if user exists
    try {
        const storiesUrl = `${API_BASE}/stories/user/${encodeURIComponent(username)}?page=1&limit=1`;
        const res = await fetch(storiesUrl);

        if (res.status === 404) {
            return {
                title: `User Not Found | Rowllr`,
                description: `The user @${username} was not found on Rowllr`,
                icons: { icon: "/logo.png" },
            };
        }

        const json = await res.json().catch(() => null);
        if (!json?.author) {
            return {
                title: `User Not Found | Rowllr`,
                description: `The user @${username} was not found on Rowllr`,
                icons: { icon: "/logo.png" },
            };
        }

        // User exists - use their name if available
        const displayName = json.author.name || username;
        return {
            title: `${displayName} | Rowllr`,
            description: json.author.bio || `Check out ${displayName}'s stories on Rowllr`,
            icons: { icon: "/logo.png" },
        };
    } catch {
        return {
            title: `@${username} | Rowllr`,
            description: `Check out ${username}'s stories on Rowllr`,
            icons: { icon: "/logo.png" },
        };
    }
}


export default async function UserProfilePage({ params }: Props) {
    const resolvedParams = await params;
    const username = resolvedParams?.username ?? "";

    console.log(`[UserProfilePage] Rendering for username: ${username}`);

    // Fetch author's stories from external API via API_BASE so the server-rendered
    // profile shows up-to-date content after creating a story.
    let storiesList: any[] = [];
    let authorData: any = null;
    let userExists = false;

    try {
        // First try to resolve the username 
        // to an author id via our profile proxy.
        let authorId: string | null = null;
        try {
            const profileUrl = `/api/profile/check-username?username=${encodeURIComponent(username)}`;
            const profileResp = await fetch(`http://localhost:3000${profileUrl}`);
            if (profileResp.ok) {
                const pdata = await profileResp.json().catch(() => null);
                // common id fields that backend might return
                authorId = pdata?.id || pdata?._id || pdata?.authorId || pdata?.userId || null;
            }
        } catch (e) {
            console.log(`[UserProfilePage] Profile fetch error:`, e);
            authorId = null;
        }

        // If we have an authorId, prefer the author-based stories endpoint; otherwise fall back to username-based.
        const storiesUrl = authorId
            ? `${API_BASE}/stories/author/${encodeURIComponent(authorId)}?page=1&limit=12`
            : `${API_BASE}/stories/user/${encodeURIComponent(username)}?page=1&limit=12`;

        const res = await fetch(storiesUrl);

        // If 404, user doesn't exist
        if (res.status === 404) {
            return <UserNotFound username={username} />;
        }

        const json = await res.json().catch(() => null);

        // Check if author data exists in response
        if (json?.author) {
            authorData = json.author;
            userExists = true;
        }

        if (json) {
            if (Array.isArray(json)) storiesList = json;
            else if (Array.isArray(json.data)) storiesList = json.data;
            else if (Array.isArray(json.items)) storiesList = json.items;
            else if (Array.isArray(json.stories)) storiesList = json.stories;
            else if (Array.isArray(json.results)) storiesList = json.results;
        }
    } catch (e) {
        console.log(`[UserProfilePage] Error fetching data:`, e);
        // On error, show user not found
        return <UserNotFound username={username} />;
    }

    // If no author data was found, show user not found
    if (!userExists) {
        return <UserNotFound username={username} />;
    }

    const storiesCount = storiesList.length;

    return (

        <main className="min-h-screen bg-white text-slate-900">

            {/* Header/Navigation */}
            <header className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <a href="/" className="group flex items-center gap-2 hover:opacity-70 transition-opacity">
                        <img
                            src="/logo.png"
                            alt="Rowllr"
                            className="w-8 h-8 rounded-lg shadow-lg shadow-purple-500/20"
                        />
                        <div className="hidden sm:block">
                            <span className="text-sm font-bold bg-linear-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">Rowllr</span>
                        </div>
                    </a>

                    <div className="flex items-center gap-4">
                        <input type="text" placeholder="Search creators..." className="hidden md:block px-4 py-2 rounded-lg bg-slate-50 border border-purple-200 text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:outline-none transition-all text-sm focus:bg-white" />
                        <ProfileOwnerView username={username}>
                            <LogoutButton />
                        </ProfileOwnerView>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="mx-auto max-w-6xl px-6 py-16">
                {/* Profile Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                    {/* Avatar */}
                    <div>
                        <div className="relative inline-block group">
                            <div className="w-40 h-40 rounded-2xl bg-linear-to-br from-purple-500 via-purple-400 to-amber-500 flex items-center justify-center text-5xl font-bold text-white shadow-xl shadow-purple-500/30 group-hover:shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-105">
                                {username ? username.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="md:col-span-2 flex flex-col justify-center space-y-6">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-2">
                                <span className="bg-linear-to-r from-purple-600 via-purple-500 to-amber-600 bg-clip-text text-transparent">{username}</span>
                            </h1>
                            <p className="text-lg text-purple-600 font-semibold">Story Creator</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8">
                            <div className="group cursor-default">
                                <p className="text-3xl font-bold bg-linear-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-amber-500 transition-all">{storiesCount}</p>
                                <p className="text-sm text-slate-500 mt-1">Stories</p>
                            </div>
                            <div className="group cursor-default">
                                <p className="text-3xl font-bold bg-linear-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-amber-500 transition-all">0</p>
                                <p className="text-sm text-slate-500 mt-1">Followers</p>
                            </div>
                            <div className="group cursor-default">
                                <p className="text-3xl font-bold bg-linear-to-r from-purple-500 to-amber-600 bg-clip-text text-transparent group-hover:from-amber-500 group-hover:to-purple-600 transition-all">0</p>
                                <p className="text-sm text-slate-500 mt-1">Reads</p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-3 pt-4">
                            <ProfileOwnerView username={username}>
                                <div className="flex items-center gap-3">
                                    <NewStoryModal />
                                    <NewChapterModal />
                                    <button className="px-6 py-2.5 border-2 border-purple-300 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all text-sm">
                                        Manage
                                    </button>
                                </div>
                            </ProfileOwnerView>
                            <ProfileOwnerView username={username}>
                                <>
                                    <button className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105 text-sm">
                                        Follow
                                    </button>
                                    <button className="px-6 py-2.5 border-2 border-purple-300 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all text-sm">
                                        Connect
                                    </button>
                                </>
                            </ProfileOwnerView>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mb-20 pb-8 border-b-2 border-purple-100">
                    <p className="text-lg text-slate-700 leading-relaxed max-w-3xl">
                        Crafting stories that move hearts and inspire minds. Join my community of passionate readers and let's create magic together.
                    </p>
                </div>

                {/* Featured Stories Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">Featured Stories</h2>
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">NEW</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {storiesList.length > 0 ? (
                            storiesList.map((s: any) => (
                                <div key={s.id || s._id || s.slug || s.title} className="bg-white rounded-lg p-4 shadow-sm">
                                    {s.coverImage || s.cover || s.image ? (
                                        <div className="mb-3 h-44 w-full relative rounded-md overflow-hidden bg-slate-100">
                                            <Image src={imageUrl(s.coverImage || s.cover || s.image) || '/logo.png'} alt={s.title || 'cover'} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                    ) : null}
                                    <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                                    <p className="text-sm text-slate-600 mb-3">{s.description ?? s.summary ?? ''}</p>
                                    <div className="flex items-center justify-between">
                                        <a href={`#`} className="text-sm text-purple-600 font-semibold">View</a>
                                        <span className="text-xs text-slate-500">{s.chapterCount ? `${s.chapterCount} chapters` : ''}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-2 lg:col-span-3 py-20 text-center border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/50 hover:border-purple-300 hover:bg-purple-50 transition-all">
                                <p className="text-slate-600 mb-6 text-lg font-medium">No stories published yet</p>
                                <ProfileOwnerView username={username}>
                                    <div className="flex items-center justify-center">
                                        <NewStoryModal />
                                    </div>
                                </ProfileOwnerView>
                            </div>
                        )}
                    </div>
                </div>

                {/* About & Support Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 py-12">
                    {/* About */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent mb-4">About</h3>
                        <p className="text-slate-700 leading-relaxed">
                            Creator's bio and information will appear here. Share your story, interests, and what drives your creativity.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-6">
                        <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-xs text-purple-600 uppercase tracking-widest font-semibold mb-1">Member Since</p>
                            <p className="text-sm font-bold text-slate-900">Today</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3">
                            <p className="text-xs text-amber-600 uppercase tracking-widest font-semibold mb-1">Status</p>
                            <p className="text-sm font-bold text-slate-900">Active</p>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-t-2 border-purple-100">
                    {/* Subscribe */}
                    <div className="bg-linear-to-br from-purple-50 to-transparent rounded-xl p-6 border border-purple-200">
                        <h4 className="font-bold text-slate-900 mb-3 text-lg">📬 Newsletter</h4>
                        <p className="text-sm text-slate-600 mb-4">Get updates on new stories</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 px-3 py-2 rounded-lg bg-white border border-purple-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-all text-sm"
                                disabled
                            />
                            <button className="px-3 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm" disabled>
                                Join
                            </button>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="bg-linear-to-br from-amber-50 to-transparent rounded-xl p-6 border border-amber-200">
                        <h4 className="font-bold text-slate-900 mb-3 text-lg">☕ Support</h4>
                        <p className="text-sm text-slate-600 mb-4">Help creators thrive</p>
                        <button className="w-full px-3 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-105 text-sm">
                            Buy Coffee
                        </button>
                    </div>

                    {/* Membership */}
                    <div className="bg-linear-to-br from-purple-50/50 to-amber-50/50 rounded-xl p-6 border border-purple-200">
                        <h4 className="font-bold text-slate-900 mb-3 text-lg">💝 Membership</h4>
                        <p className="text-sm text-slate-600 mb-4">Exclusive benefits</p>
                        <button className="w-full px-3 py-2 border-2 border-purple-400 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-500 transition-all text-sm">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t-2 border-purple-100 bg-linear-to-b from-white via-purple-50/30 to-white mt-20">
                <div className="mx-auto max-w-6xl px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-purple-600">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Features</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Pricing</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-purple-600">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">About</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Contact</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-purple-600">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Privacy</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Terms</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-purple-600">Social</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Twitter</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Discord</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors font-medium">Email</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-purple-100 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-600 gap-4">
                        <span className="font-semibold text-purple-600">© {new Date().getFullYear()} Rowllr. All rights reserved.</span>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-purple-600 transition-colors font-medium">Status</a>
                            <a href="#" className="hover:text-purple-600 transition-colors font-medium">API Docs</a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
