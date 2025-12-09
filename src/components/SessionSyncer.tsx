"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SessionSyncer() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const syncToken = searchParams.get("s_token");
        const syncUser = searchParams.get("s_user");

        if (syncToken && syncUser) {
            try {
                localStorage.setItem("authToken", syncToken);
                localStorage.setItem("webnovelUsername", syncUser);

                // Clean URL
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete("s_token");
                newUrl.searchParams.delete("s_user");

                router.replace(newUrl.pathname + newUrl.search);
            } catch (e) {
                console.error("Session sync failed", e);
            }
        }
    }, [searchParams, router]);

    return null;
}
