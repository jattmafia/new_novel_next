"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        try {
            localStorage.removeItem("authToken");
            localStorage.removeItem("webnovelUsername");
        } catch (e) {
            // ignore
        }
        // Redirect to login
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-colors backdrop-blur-sm"
        >
            Logout
        </button>
    );
}
