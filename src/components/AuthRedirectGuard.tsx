"use client";

import { useEffect } from "react";

export default function AuthRedirectGuard() {
    useEffect(() => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const username = localStorage.getItem("webnovelUsername");
            const destination = username ? `/${encodeURIComponent(username)}` : "/auth/create-profile";

            // Avoid redirect loops and unnecessary replaces
            if (window.location.pathname === destination) return;

            // If user is already visiting allowed auth pages and has no username, go to create-profile
            const allowedAuthPages = ["/login", "/signup", "/auth/create-profile", "/auth/verify"];
            // If on an allowed page but destination differs, redirect to destination
            if (allowedAuthPages.includes(window.location.pathname) || window.location.pathname === "/") {
                window.location.replace(destination);
                return;
            }

            // For any other public page, if they have a username and token, send them to their profile path
            window.location.replace(destination);
        } catch (e) {
            // ignore errors reading localStorage
        }
    }, []);

    return null;
}
