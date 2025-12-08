"use client";

import { useEffect } from "react";

export default function AuthRedirectGuard() {
    useEffect(() => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const username = localStorage.getItem("webnovelUsername");
            const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
            const proto = window.location.protocol;

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
            if (current === destNormalized) return;

            const allowedAuthPages = ["/login", "/signup", "/auth/create-profile", "/auth/verify"];
            if (allowedAuthPages.includes(window.location.pathname) || window.location.pathname === "/") {
                window.location.replace(destination);
                return;
            }

            window.location.replace(destination);
        } catch (e) {
            // ignore errors reading localStorage
        }
    }, []);

    return null;
}
