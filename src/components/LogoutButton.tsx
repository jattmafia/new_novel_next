"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        try {
            // Clear local storage on current domain (e.g. subdomain) immediately
            localStorage.removeItem("authToken");
            localStorage.removeItem("webnovelUsername");
        } catch (e) {
            // ignore
        }

        // Redirect to base-domain logout route which will clear root domain storage
        const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
        const proto = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : "";

        if (APP_DOMAIN) {
            // Full URL redirect to ensure we hit the root domain
            // Middleware will force /auth/* to root domain anyway, but being explicit is good
            window.location.href = `${proto}//${APP_DOMAIN}${port}/auth/logout`;
        } else {
            // Fallback for simple local dev without configured domain
            window.location.href = "/auth/logout";
        }
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
