import Image from "next/image";
import ProfileOwnerDetector from "@/components/ProfileOwnerDetector";

interface Props {
    params: { username: string } | Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: Props) {
    const resolvedParams = await params;
    const username = resolvedParams?.username ?? "";

    return (
        <main className="min-h-screen bg-linear-to-b from-purple-50 via-white to-amber-50 py-12 px-4">
            <ProfileOwnerDetector username={username} />

            <div className="max-w-3xl mx-auto bg-white/95 p-8 rounded-2xl shadow-lg border border-purple-100">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                        {username ? username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">@{username}</h1>
                        <p className="text-sm text-gray-600">Public profile — placeholder content</p>
                    </div>
                </div>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold mb-2">About</h2>
                    <p className="text-gray-700">This is a static public profile placeholder. Owner will see edit controls when signed in.</p>
                </section>

                <section className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Stories</h2>
                    <div className="text-sm text-gray-600">No stories yet.</div>
                </section>
            </div>
        </main>
    );
}
