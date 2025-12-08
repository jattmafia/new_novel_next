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
        // Redirect to base-domain login (preserve protocol and port in dev when NEXT_PUBLIC_APP_DOMAIN is set)
        const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
        if (APP_DOMAIN) {
            const proto = window.location.protocol;
            const port = window.location.port ? `:${window.location.port}` : "";
            // Use window.location to perform a full-domain navigation
            window.location.href = `${proto}//${APP_DOMAIN}${port}/login`;
            return;
        }

        // Fallback: client-side push to /login on current domain
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
