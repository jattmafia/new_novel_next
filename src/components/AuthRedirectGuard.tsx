"use client";

import { useEffect } from "react";
import { useSessionSync } from "@/lib/SessionContext";

export default function AuthRedirectGuard() {
    const { isSessionSynced } = useSessionSync();

    useEffect(() => {
        if (!isSessionSynced) return;

        try {
            // Escape hatch: ?force=true clears storage to fix loops
            const params = new URLSearchParams(window.location.search);
            if (params.get("force") === "true") {
                console.log("AuthRedirectGuard: Force clearing storage");
                localStorage.removeItem("authToken");
                localStorage.removeItem("webnovelUsername");
                // Remove param from URL
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete("force");
                window.history.replaceState({}, "", newUrl.toString());
                return;
            }

            const token = localStorage.getItem("authToken");
            if (!token) return;

            const username = localStorage.getItem("webnovelUsername");

            const buildProfileUrl = (u: string) => `/${encodeURIComponent(u)}`;
            const buildCreateProfileUrl = () => "/auth/create-profile";

            const destination = username ? buildProfileUrl(username) : buildCreateProfileUrl();

            const normalizeHref = (href: string) => {
                try {
                    const url = new URL(href, window.location.href);
                    return url.href.replace(/\/+$/, "");
                } catch {
                    return href.replace(/\/+$/, "");
                }
            };

            const current = window.location.href.replace(/\/+$/, "");
            const destNormalized = normalizeHref(destination);

            console.log("AuthRedirectGuard: Checking redirect", { current, destNormalized, token: !!token });

            if (current === destNormalized) return;

            const allowedAuthPages = ["/login", "/signup", "/auth/create-profile", "/auth/verify"];
            if (allowedAuthPages.includes(window.location.pathname) || window.location.pathname === "/") {
                console.log("AuthRedirectGuard: Redirecting to", destination);
                window.location.replace(destination);
                return;
            }

            window.location.replace(destination);
        } catch (e) {
            console.error("AuthRedirectGuard error", e);
        }
    }, []);

    return null;
}
