"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileOwnerDetector({ username }: { username: string }) {
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const token = localStorage.getItem("authToken");
            const stored = localStorage.getItem("webnovelUsername");
            if (!token) {
                setIsOwner(false);
                return;
            }
            if (stored && stored === username) {
                setIsOwner(true);
                return;
            }
            setIsOwner(false);
        } catch (e) {
            setIsOwner(false);
        }
    }, [username]);

    if (isOwner === null) return null;

    if (!isOwner) return null;

    return (
        <div className="fixed top-4 right-4 z-50 bg-white/95 border border-purple-200 rounded-lg px-4 py-2 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="text-sm font-semibold">This is your profile</div>
                <button
                    onClick={() => router.push("/auth/create-profile")}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
}
