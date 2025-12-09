"use client";

import { useEffect } from "react";

export default function AuthRedirectGuard() {
    useEffect(() => {
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
            const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
            const proto = window.location.protocol;

            // Avoid redirecting if we are already on the SUBDOMAIN
            // Check if current hostname ends with appDomain
            if (APP_DOMAIN && window.location.hostname.endsWith(`.${APP_DOMAIN}`)) {
                // We are on a subdomain. Do not redirect "away" to the same subdomain 
                // unless the logic below detects we are on the WRONG subdomain?
                // But typically AuthRedirectGuard is only on the Root Landing Page?
                // Wait, AuthRedirectGuard is in `src/app/page.tsx` (Root) and `src/app/login/page.tsx`.
                // If the USER is on `username.localhost:3000`, that is technically the SAME Next.js app but `middleware` rewrites it.
                // Middleware rewrites `username.localhost` -> `/username`.
                // Does `/src/app/page.tsx` render on `/username`? 
                // NO! `/src/app/[username]/page.tsx` renders.
                // So AuthRedirectGuard is NOT present on the subdomain profile page.
                // UNLESS `src/app/layout.tsx` imports it? No.
                // So AuthRedirectGuard ONLY runs on `localhost:3000` (Landing) and `/login`.

                // So, if we are here, we are on localhost:3000 (or `www`).
                // We SHOULD redirect to subdomain if logged in.
            }

            const buildProfileUrl = (u: string) =>
                APP_DOMAIN
                    ? `${proto}//${encodeURIComponent(u)}.${APP_DOMAIN}${window.location.port ? `:${window.location.port}` : ""}`
                    : `/${encodeURIComponent(u)}`;
            const buildCreateProfileUrl = () =>
                APP_DOMAIN ? `${proto}//${APP_DOMAIN}${window.location.port ? `:${window.location.port}` : ""}/auth/create-profile` : "/auth/create-profile";

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
